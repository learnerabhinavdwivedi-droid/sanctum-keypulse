import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';
import { encryptKey } from '../../../lib/crypto';

// Mapping provider to realistic simulated keys and scopes
const PROVIDER_CONFIG: Record<string, { prefix: string; defaultScopes: string[] }> = {
  GOOGLE: { prefix: 'ya29.c.', defaultScopes: ['https://www.googleapis.com/auth/cloud-platform'] },
  STRIPE: { prefix: 'sk_live_', defaultScopes: ['billing.read', 'charges.write'] },
  AWS: { prefix: 'AKIA', defaultScopes: ['s3:GetObject', 'ec2:DescribeInstances'] },
  GITHUB: { prefix: 'ghp_', defaultScopes: ['repo', 'read:user'] },
  OPENAI: { prefix: 'sk-proj-', defaultScopes: ['api.chat', 'api.completions'] },
  ANTHROPIC: { prefix: 'sk-ant-', defaultScopes: ['messages.create'] },
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider } = body;

    if (!provider || typeof provider !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid provider' }, { status: 400 });
    }

    const uppercaseProvider = provider.toUpperCase();
    const config = PROVIDER_CONFIG[uppercaseProvider] || { prefix: 'sk_custom_', defaultScopes: ['api.read'] };

    // Simulate OAuth Exchange: generate a highly realistic provider-specific API token
    const randomEntropy = Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);
    const rawKey = `${config.prefix}${randomEntropy}`;

    // Pass the raw key into our symmetric encryption utility
    const { encryptedData, iv, authTag } = encryptKey(rawKey);

    // Compute the safe UI display mask (first 6 + ... + last 4)
    let mask = '••••••••••••';
    if (rawKey.length > 10) {
      mask = `${rawKey.substring(0, 6)}...${rawKey.substring(rawKey.length - 4)}`;
    } else {
      mask = `${rawKey.substring(0, 2)}...${rawKey.substring(rawKey.length - 2)}`;
    }

    const label = `${uppercaseProvider} Auto-Integration`;

    // Create a new ApiKey record in the Prisma database
    const newKey = await prisma.$transaction(async (tx) => {
      // Ensure user exists locally
      let user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        user = await tx.user.create({
          data: {
            id: userId,
            email: `${userId}@placeholder.com`,
          },
        });
      }

      return tx.apiKey.create({
        data: {
          userId: user.id,
          label,
          provider: uppercaseProvider,
          encryptedKey: encryptedData,
          iv,
          authTag,
          mask,
          accessScopes: {
            create: config.defaultScopes.map((scope: string) => ({ scope })),
          },
        },
        include: {
          accessScopes: true,
        },
      });
    });

    // Return only the safe metadata
    const safePayload = {
      id: newKey.id,
      label: newKey.label,
      provider: newKey.provider,
      mask: newKey.mask,
      status: newKey.status,
      lastUsed: newKey.lastUsed,
      accessProfile: newKey.accessScopes.map((s) => s.scope),
    };

    return NextResponse.json({ key: safePayload }, { status: 201 });
  } catch (error) {
    // Never log raw generated key or sensitive DB errors to the client
    console.error('API /integrations POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
