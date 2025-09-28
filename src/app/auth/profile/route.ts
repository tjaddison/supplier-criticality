import { getSession } from '@/lib/session';

export async function GET() {
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
}