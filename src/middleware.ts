import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const isPublicRoute =
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/auth/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/about') ||
    request.nextUrl.pathname.startsWith('/contact') ||
    request.nextUrl.pathname.startsWith('/pricing') ||
    request.nextUrl.pathname.startsWith('/solutions') ||
    request.nextUrl.pathname.startsWith('/terms') ||
    request.nextUrl.pathname.startsWith('/privacy');

  try {
    // For public routes, just continue
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // For protected routes, check session
    const authToken = request.cookies.get('auth_token')?.value;

    // Redirect authenticated users from home to dashboard
    if (authToken && request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protected routes - check authentication
    if (!authToken && !isPublicRoute) {
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }

    return NextResponse.next();
  } catch (error: unknown) {
    console.error(`Middleware error:`, error);

    // If there's an error with Auth0 setup, allow public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // For protected routes with Auth0 errors, redirect to login
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};