import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
}

export async function getAuthenticatedUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authToken = req.cookies.get('auth_token')?.value;

    if (!authToken) {
      return null;
    }

    // Get user info from Auth0
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!userResponse.ok) {
      return null;
    }

    const user = await userResponse.json();

    if (!user?.sub || !user?.email) {
      return null;
    }

    return {
      userId: user.sub,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

interface RouteContext {
  params?: Record<string, unknown>;
}

export function requireAuth(
  handler: (req: NextRequest, user: AuthUser) => Promise<Response>
): (req: NextRequest) => Promise<Response>;

export function requireAuth<T extends RouteContext>(
  handler: (req: NextRequest, user: AuthUser, context: T) => Promise<Response>
): (req: NextRequest, context: T) => Promise<Response>;

export function requireAuth<T extends RouteContext>(
  handler: (req: NextRequest, user: AuthUser, context?: T) => Promise<Response>
): (req: NextRequest, context?: T) => Promise<Response> {
  return async (req: NextRequest, context?: T) => {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (context) {
      return handler(req, user, context);
    } else {
      return (handler as (req: NextRequest, user: AuthUser) => Promise<Response>)(req, user);
    }
  };
}