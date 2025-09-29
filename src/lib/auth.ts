import { getSession, SessionPayload } from './session';
import { redirect } from 'next/navigation';

export type UserRole = 'free' | 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4' | 'admin';

export interface RequireAuthOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
}

// Role hierarchy - higher index means higher privilege
const ROLE_HIERARCHY: UserRole[] = ['free', 'tier-1', 'tier-2', 'tier-3', 'tier-4', 'admin'];

export function hasRequiredRole(userRole: string, requiredRole: UserRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole as UserRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
}

export async function requireAuth(options: RequireAuthOptions = {}): Promise<SessionPayload> {
  const { requiredRole = 'free', redirectTo = '/api/auth/login' } = options;

  const session = await getSession();

  if (!session) {
    redirect(redirectTo);
  }

  const userRole = session.role || 'free';
  if (!hasRequiredRole(userRole, requiredRole)) {
    redirect('/unauthorized');
  }

  return session;
}

export async function requireRole(requiredRole: UserRole): Promise<SessionPayload> {
  return requireAuth({ requiredRole });
}

// Check if user has access without redirecting
export async function checkAuth(): Promise<SessionPayload | null> {
  return await getSession();
}

export async function checkRole(requiredRole: UserRole): Promise<boolean> {
  const session = await checkAuth();
  if (!session) return false;

  const userRole = session.role || 'free';
  return hasRequiredRole(userRole, requiredRole);
}