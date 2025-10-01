import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './auth0';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription: string;
}

export type AuthenticatedAPIHandler = (
  request: NextRequest,
  user: AuthenticatedUser
) => Promise<NextResponse>;

export function createAPIHandler(handler: AuthenticatedAPIHandler) {
  return async (request: NextRequest) => {
    try {
      // Get session from Auth0
      const session = await auth0.getSession();

      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Create user object from session
      const user: AuthenticatedUser = {
        id: session.user.sub || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role || 'free',
        subscription: session.user.subscription || 'free'
      };

      // Call the actual handler with the authenticated user
      return await handler(request, user);
    } catch (error) {
      console.error('API authentication error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}