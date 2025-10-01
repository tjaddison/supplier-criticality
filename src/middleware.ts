import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  // VERBOSE_LOG_START - Remove this entire logging block later
  console.log('[AUTH_FLOW] Middleware called for:', request.nextUrl.pathname);
  console.log('[AUTH_FLOW] Method:', request.method);
  console.log('[AUTH_FLOW] URL:', request.url);
  console.log('[AUTH_FLOW] Search params:', request.nextUrl.searchParams.toString());
  console.log('[AUTH_FLOW] Has returnTo?:', request.nextUrl.searchParams.get('returnTo'));
  console.log('[AUTH_FLOW] Cookies:', request.cookies.getAll().map(c => c.name));
  // VERBOSE_LOG_END

  // Let Auth0 handle everything
  const response = await auth0.middleware(request);

  // VERBOSE_LOG_START - Remove this entire logging block later
  console.log('[AUTH_FLOW] Response status:', response.status);
  console.log('[AUTH_FLOW] Response headers:', Object.fromEntries(response.headers.entries()));
  if (response.headers.get('location')) {
    console.log('[AUTH_FLOW] Redirecting to:', response.headers.get('location'));
  }
  if (response.headers.get('set-cookie')) {
    console.log('[AUTH_FLOW] Setting cookies');
  }
  // VERBOSE_LOG_END

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};