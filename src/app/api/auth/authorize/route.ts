import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

const PROVIDER_AUTH_URLS: Record<string, string> = {
  GOOGLE: 'https://accounts.google.com/o/oauth2/v2/auth',
  GEMINI: 'https://accounts.google.com/o/oauth2/v2/auth',
  OPENAI: 'https://platform.openai.com/oauth',
  GITHUB: 'https://github.com/login/oauth/authorize',
  STRIPE: 'https://connect.stripe.com/oauth/authorize',
};

const PROVIDER_SCOPES: Record<string, string> = {
  GOOGLE: 'https://www.googleapis.com/auth/cloud-platform',
  GEMINI: 'https://www.googleapis.com/auth/generative-language.retriever',
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider')?.toUpperCase();

    if (!provider || !PROVIDER_AUTH_URLS[provider]) {
      return NextResponse.json({ error: 'Unsupported or missing provider' }, { status: 400 });
    }

    const clientId = process.env[`${provider}_CLIENT_ID`];
    if (!clientId) {
      console.error(`Missing ${provider}_CLIENT_ID in environment.`);
      return NextResponse.json({ error: `Provider ${provider} is not properly configured.` }, { status: 500 });
    }

    // Generate CSRF state token
    const state = crypto.randomBytes(16).toString('hex');
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/auth/callback`;

    // Construct authorization URL
    const authUrl = new URL(PROVIDER_AUTH_URLS[provider]);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', PROVIDER_SCOPES[provider] || '');
    authUrl.searchParams.append('state', `${provider}_${state}`);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    const response = NextResponse.redirect(authUrl.toString());
    
    // Store state in HTTP-only cookie for CSRF validation during callback
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('API /auth/authorize Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
