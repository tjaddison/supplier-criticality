import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const authAction = url.pathname.split('/').pop();

  try {
    switch (authAction) {
      case 'login':
        // Redirect to Auth0 login
        const loginUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/authorize`);
        loginUrl.searchParams.set('response_type', 'code');
        loginUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
        loginUrl.searchParams.set('redirect_uri', `${process.env.AUTH0_BASE_URL}/api/auth/callback`);
        loginUrl.searchParams.set('scope', 'openid profile email');
        loginUrl.searchParams.set('state', 'state');

        return NextResponse.redirect(loginUrl);

      case 'logout':
        // Redirect to Auth0 logout
        const logoutUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
        logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
        logoutUrl.searchParams.set('returnTo', `${process.env.AUTH0_BASE_URL}`);

        return NextResponse.redirect(logoutUrl);

      case 'callback':
        // Handle the callback from Auth0
        const code = url.searchParams.get('code');

        if (!code) {
          return NextResponse.redirect(new URL('/', req.url));
        }

        // Exchange code for tokens
        const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          }),
        });

        if (tokenResponse.ok) {
          const tokens = await tokenResponse.json();

          // Create a response that redirects to dashboard
          const response = NextResponse.redirect(new URL('/dashboard', req.url));

          // Set session cookie (simplified - in production you'd want to encrypt this)
          response.cookies.set('auth_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // 1 hour
          });

          return response;
        } else {
          return NextResponse.redirect(new URL('/', req.url));
        }

      case 'me':
        // Return user info
        const token = req.cookies.get('auth_token')?.value;
        if (!token) {
          return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Get user info from Auth0
        const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const user = await userResponse.json();
          return NextResponse.json(user);
        } else {
          return NextResponse.json({ error: 'Failed to get user' }, { status: 401 });
        }

      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}