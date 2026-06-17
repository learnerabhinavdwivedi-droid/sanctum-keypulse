import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/prisma';
import { decryptKey } from '../../../../lib/crypto';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { keyId } = await req.json();

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    const keyRecord = await prisma.apiKey.findUnique({
      where: { id: keyId }
    });

    if (!keyRecord || keyRecord.userId !== userId) {
      return NextResponse.json({ error: 'Key not found or unauthorized' }, { status: 404 });
    }

    if (!keyRecord.encryptedKey || !keyRecord.iv || !keyRecord.authTag) {
      return NextResponse.json({ error: 'Key data is corrupted or missing cryptography parameters' }, { status: 500 });
    }

    const rawKey = decryptKey(keyRecord.encryptedKey, keyRecord.iv, keyRecord.authTag);

    return NextResponse.json({ rawKey });
  } catch (error) {
    console.error('API /keys/reveal POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
