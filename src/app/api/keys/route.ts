import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';
import { encryptKey } from '../../../lib/crypto';
import { checkRateLimit } from '../../../lib/ratelimit';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(`keys_get_${userId}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    // Retrieve all API keys associated with the active user ID from the database
    const keys = await prisma.apiKey.findMany({
      where: { userId },
      include: {
        accessScopes: true,
      },
      orderBy: {
        lastUsed: 'desc',
      },
    });

    // Return only the safe metadata. Never expose raw ciphertext, IV, or auth tags.
    const safeKeys = keys.map((key) => ({
      id: key.id,
      label: key.label,
      provider: key.provider,
      mask: key.mask,
      status: key.status,
      lastUsed: key.lastUsed,
      accessProfile: key.accessScopes.map((scope) => scope.scope),
    }));

    return NextResponse.json({ keys: safeKeys });
  } catch (error) {
    // Safely return a 500 Server Error response without exposing raw database logs
    console.error('API /keys GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(`keys_post_${userId}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const body = await req.json();
    const { label, provider, rawKey, accessScopes = [] } = body;

    if (!label || !provider || !rawKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Compute the safe UI display mask (first 6 chars + ... + last 4 chars)
    let mask = '••••••••••••';
    if (rawKey.length > 10) {
      mask = `${rawKey.substring(0, 6)}...${rawKey.substring(rawKey.length - 4)}`;
    } else {
      mask = `${rawKey.substring(0, 2)}...${rawKey.substring(rawKey.length - 2)}`;
    }

    // Pass the rawKey through our encryptKey utility
    const { encryptedData, iv, authTag } = encryptKey(rawKey);

    // Save the resulting encrypted ciphertext, IV, and authTag to PostgreSQL
    const newKey = await prisma.$transaction(async (tx) => {
      // Ensure user exists (in a real scenario, Clerk webhook handles this, but we upsert here for safety)
      let user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        // Fallback email or pull from clerk
        user = await tx.user.create({
          data: {
            id: userId,
            email: `${userId}@placeholder.com`, // We'd ideally fetch real email from Clerk
          },
        });
      }

      return tx.apiKey.create({
        data: {
          userId: user.id,
          label,
          provider,
          encryptedKey: encryptedData,
          iv,
          authTag,
          mask,
          accessScopes: {
            create: accessScopes.map((scope: string) => ({ scope })),
          },
        },
        include: {
          accessScopes: true,
        },
      });
    });

    const safeNewKey = {
      id: newKey.id,
      label: newKey.label,
      provider: newKey.provider,
      mask: newKey.mask,
      status: newKey.status,
      lastUsed: newKey.lastUsed,
      accessProfile: newKey.accessScopes.map((s) => s.scope),
    };

    return NextResponse.json({ key: safeNewKey }, { status: 201 });
  } catch (error) {
    console.error('API /keys POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
