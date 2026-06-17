import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/prisma';
import { encryptKey } from '../../../../lib/crypto';

const PROVIDER_TOKEN_URLS: Record<string, string> = {
  GOOGLE: 'https://oauth2.googleapis.com/token',
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL('/?error=Unauthorized', req.url));
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state'); // format: PROVIDER_STATE
    
    // The provider param isn't explicitly required if state contains it, but leaving it to match standard OAuth flows if needed.
    // We strictly require real code exchanges here.

    if (!code || !stateParam) {
      return NextResponse.redirect(new URL('/?error=MissingParameters', req.url));
    }

    const [provider, returnedState] = stateParam.split('_');
    const storedState = req.cookies.get('oauth_state')?.value;

    if (!storedState || returnedState !== storedState) {
      return NextResponse.redirect(new URL('/?error=InvalidStateCSRF', req.url));
    }

    const clientId = process.env[`${provider}_CLIENT_ID`];
    const clientSecret = process.env[`${provider}_CLIENT_SECRET`];
    
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL('/?error=MissingCredentials', req.url));
    }

    // Exchange code for real token
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/auth/callback`;
    
    const tokenRes = await fetch(PROVIDER_TOKEN_URLS[provider], {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      })
    });

    if (!tokenRes.ok) {
      const errTxt = await tokenRes.text();
      console.error('Token Exchange Failed:', errTxt);
      return NextResponse.redirect(new URL('/?error=TokenExchangeFailed', req.url));
    }

    const tokenData = await tokenRes.json();
    const rawKey = tokenData.access_token;
    
    if (!rawKey) {
      return NextResponse.redirect(new URL('/?error=NoAccessTokenReturned', req.url));
    }

    await saveKeyToDb(userId, provider, rawKey);

    // Redirect to main app UI
    return NextResponse.redirect(new URL('/?integration=success', req.url));
  } catch (error) {
    console.error('API /auth/callback Error:', error);
    return NextResponse.redirect(new URL('/?error=InternalServerError', req.url));
  }
}

async function saveKeyToDb(userId: string, provider: string, rawKey: string) {
  const { encryptedData, iv, authTag } = encryptKey(rawKey);

  let mask = '••••••••••••';
  if (rawKey.length > 10) {
    mask = `${rawKey.substring(0, 6)}...${rawKey.substring(rawKey.length - 4)}`;
  }

  const label = `${provider} OAuth Integration`;

  await prisma.$transaction(async (tx) => {
    let user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await tx.user.create({ data: { id: userId, email: `${userId}@placeholder.com` } });
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
          create: [{ scope: 'oauth_access' }],
        },
      }
    });
  });
}


