import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './session';

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
      // Get session from request
      const session = await getSession();

      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Convert session to user object
      const user: AuthenticatedUser = {
        id: session.sub,
        email: session.email,
        name: session.name,
        role: session.role || 'free',
        subscription: session.subscription || 'free',
      };

      // Call the authenticated handler
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