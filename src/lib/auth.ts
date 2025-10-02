import { redirect } from 'next/navigation';
import { auth0 } from './auth0';

export type UserRole = 'free' | 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4' | 'admin';

export interface RequireAuthOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
}

export interface UserSession {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
  subscription?: string;
}

// Role hierarchy - higher index means higher privilege
const ROLE_HIERARCHY: UserRole[] = ['free', 'tier-1', 'tier-2', 'tier-3', 'tier-4', 'admin'];

export function hasRequiredRole(userRole: string, requiredRole: UserRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole as UserRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
}

export async function requireAuth(options: RequireAuthOptions = {}): Promise<UserSession> {
  const { requiredRole, redirectTo = '/login' } = options;

  // VERBOSE_LOG_START - Remove this entire logging block later
  console.log('[AUTH_FLOW] requireAuth called with options:', { requiredRole, redirectTo });
  // VERBOSE_LOG_END

  try {
    const session = await auth0.getSession();
    console.log('Session:', session);
    console.log('Session user:', session?.user);
    // VERBOSE_LOG_START - Remove this entire logging block later
    console.log('[AUTH_FLOW] Session exists?:', !!session);
    if (session?.user) {
      console.log('[AUTH_FLOW] User data:', {
        sub: session.user.sub,
        email: session.user.email,
        role: session.user.role,
      });
    }
    // VERBOSE_LOG_END

    if (!session || !session.user) {
      // VERBOSE_LOG_START - Remove this entire logging block later
      console.log('[AUTH_FLOW] No session/user, redirecting to:', redirectTo);
      // VERBOSE_LOG_END
      redirect(redirectTo);
    }

    const userRole = session.user.role as UserRole;

    // Check role if required
    if (requiredRole && !hasRequiredRole(userRole, requiredRole)) {
      // VERBOSE_LOG_START - Remove this entire logging block later
      console.log('[AUTH_FLOW] Role check failed. User role:', userRole, 'Required:', requiredRole);
      // VERBOSE_LOG_END
      redirect('/unauthorized');
    }

    return {
      sub: session.user.sub || '',
      email: session.user.email || '',
      name: session.user.name || '',
      picture: session.user.picture,
      role: userRole,
      subscription: session.user.subscription,
    };
  } catch (error) {
    // Suppress expected dynamic server usage errors during build
    const isDynamicServerError = error instanceof Error &&
      (error.message?.includes('Dynamic server usage') ||
       (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE');

    if (!isDynamicServerError) {
      // VERBOSE_LOG_START - Remove this entire logging block later
      console.error('[AUTH_FLOW] Error in requireAuth:', error);
      // VERBOSE_LOG_END
      console.error('Auth error:', error);
    }
    redirect(redirectTo);
  }
}

export async function requireRole(requiredRole: UserRole): Promise<UserSession> {
  return requireAuth({ requiredRole });
}

export async function checkAuth(): Promise<UserSession | null> {
  // VERBOSE_LOG_START - Remove this entire logging block later
  console.log('[AUTH_FLOW] checkAuth called');
  // VERBOSE_LOG_END

  try {
    const session = await auth0.getSession();

    // VERBOSE_LOG_START - Remove this entire logging block later
    console.log('[AUTH_FLOW] checkAuth session exists?:', !!session);
    if (session?.user) {
      console.log('[AUTH_FLOW] checkAuth user data:', {
        sub: session.user.sub,
        email: session.user.email,
        role: session.user.role,
      });
    }
    // VERBOSE_LOG_END

    if (!session || !session.user) {
      return null;
    }

    return {
      sub: session.user.sub || '',
      email: session.user.email || '',
      name: session.user.name || '',
      picture: session.user.picture,
      role: session.user.role as UserRole,
      subscription: session.user.subscription,
    };
  } catch {
    // VERBOSE_LOG_START - Remove this entire logging block later
    console.log('[AUTH_FLOW] checkAuth caught error, returning null');
    // VERBOSE_LOG_END
    return null;
  }
}

export async function checkRole(requiredRole: UserRole): Promise<boolean> {
  try {
    const session = await checkAuth();
    if (!session) return false;

    return hasRequiredRole(session.role || 'free', requiredRole);
  } catch {
    return false;
  }
}