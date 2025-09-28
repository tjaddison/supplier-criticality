import { NextRequest } from 'next/server';
import { exchangeCodeForTokens, getUserInfo } from '@/lib/auth0-client';
import { createSession, getSession, deleteSession } from '@/lib/session';

export async function GET(request: NextRequest, { params }: { params: Promise<{ auth0: string[] }> }) {
  const { auth0: authPath } = await params;
  const action = authPath[0];

  switch (action) {
    case 'login':
      // Redirect to Auth0 login
      const loginUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/authorize`);
      loginUrl.searchParams.set('response_type', 'code');
      loginUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      loginUrl.searchParams.set('redirect_uri', `${process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL}/api/auth/callback`);
      loginUrl.searchParams.set('scope', 'openid profile email user_role');
      return Response.redirect(loginUrl.toString());

    case 'logout':
      // Clear local session
      await deleteSession();

      // Redirect to Auth0 logout
      const logoutUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
      logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      logoutUrl.searchParams.set('returnTo', process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL!);
      return Response.redirect(logoutUrl.toString());

    case 'callback':
      // Handle OAuth callback - get the authorization code and redirect to dashboard
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        return Response.redirect(`${process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL}/?error=${error}`);
      }

      if (code) {
        try {
          // Exchange authorization code for tokens
          const tokens = await exchangeCodeForTokens(code);

          // Get user information using the access token
          const user = await getUserInfo(tokens.access_token);
          console.log('Authenticated user:', user);
          // Create session with user data and access token
          await createSession(user as unknown as Record<string, unknown>, tokens.access_token);

          return Response.redirect(`${process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL}/dashboard`);
        } catch (error) {
          console.error('Authentication error:', error);
          return Response.redirect(`${process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL}/?error=auth_failed`);
        }
      }

      return Response.redirect(`${process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL}/?error=no_code`);

    case 'profile':
      // Return real user profile from session
      const session = await getSession();
      if (!session) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 });
      }

      return Response.json({
        sub: session.sub,
        email: session.email,
        name: session.name,
        picture: session.picture,
        app_metadata: {
          role: session.role,
          subscription_tier: session.subscription
        }
      });

    default:
      return new Response('Not found', { status: 404 });
  }
}