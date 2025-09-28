import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.AUTH0_SECRET || process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

async function verifySession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

// Define route access rules
const routeRules: Record<string, string> = {
  '/dashboard/settings': 'free',
  '/dashboard/suppliers': 'pro', // Example: Suppliers page requires pro tier
  '/dashboard/admin': 'admin', // Example: Admin pages require admin role
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Check if user has valid session
  const session = await verifySession(request);

  if (!session) {
    // Redirect to login if no valid session
    const loginUrl = new URL('/api/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for specific routes
  for (const route in routeRules) {
    if (pathname.startsWith(route)) {
      const requiredRole = routeRules[route];
      const userRole = (session.role as string) || 'free';

      // Simple role hierarchy check
      const roleHierarchy = ['free', 'pro', 'enterprise', 'admin'];
      const userRoleIndex = roleHierarchy.indexOf(userRole);
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

      if (userRoleIndex < requiredRoleIndex) {
        // Redirect to unauthorized page
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match protected routes that require authentication:
     * - /dashboard and all sub-routes
     * - Exclude API routes and static files
     */
    '/dashboard/:path*',
  ],
};