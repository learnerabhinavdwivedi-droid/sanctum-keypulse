import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';
import { decryptKey } from '../../../lib/crypto';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get('keyId');

    if (!keyId) {
      return NextResponse.json({ error: 'Missing keyId parameter' }, { status: 400 });
    }

    // Fetch key from DB
    const keyRecord = await prisma.apiKey.findUnique({ where: { id: keyId } });
    if (!keyRecord || keyRecord.userId !== userId) {
      return NextResponse.json({ error: 'Key not found or unauthorized' }, { status: 404 });
    }

    // Decrypt key
    let rawKey = '';
    if (keyRecord.encryptedKey && keyRecord.iv && keyRecord.authTag) {
      rawKey = decryptKey(keyRecord.encryptedKey, keyRecord.iv, keyRecord.authTag);
    } else {
      return NextResponse.json({ error: 'Key is corrupt or unencrypted' }, { status: 500 });
    }

    // Determine Provider Target
    let url = 'https://httpbin.org/get'; // Fallback / default
    let method = 'GET';
    let headers: any = {
      'Authorization': `Bearer ${rawKey}`,
      'User-Agent': 'KeyPulse-Diagnostic-Probe/1.0',
    };

    const provider = keyRecord.provider.toUpperCase();
    if (provider.includes('STRIPE')) {
      url = 'https://api.stripe.com/v1/charges?limit=1';
    } else if (provider.includes('GITHUB')) {
      url = 'https://api.github.com/user';
    } else if (provider.includes('OPENAI')) {
      url = 'https://api.openai.com/v1/models';
    } else if (provider.includes('GOOGLE')) {
      url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + rawKey;
      delete headers['Authorization']; // Google handles it in QS for tokeninfo
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const start = performance.now();
    let httpStatus = 0;

    try {
      const response = await fetch(url, { method, headers, signal: controller.signal });
      httpStatus = response.status;
    } catch (e: any) {
      if (e.name === 'AbortError') {
        httpStatus = 408; // Request Timeout
      } else {
        httpStatus = 503; // Service Unavailable
      }
    } finally {
      clearTimeout(timeoutId);
    }

    const end = performance.now();
    const latencyMs = Math.round(end - start);

    let health = 'OPTIMAL';
    if (httpStatus >= 400 || latencyMs > 500) {
      health = 'DEGRADED';
    }
    if (httpStatus === 401 || httpStatus === 403) {
      health = 'REVOKED/INVALID';
    }

    return NextResponse.json({
      latencyMs,
      httpStatus,
      health,
      target: url
    });
  } catch (error) {
    console.error('API /diagnostics Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
