import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.AUTH0_SECRET || process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
  subscription?: string;
  exp: number;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

export async function createSession(user: Record<string, unknown>, accessToken: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const sessionPayload: SessionPayload = {
    sub: user.sub as string,
    email: user.email as string,
    name: user.name as string,
    picture: user.picture as string,
    role: (user.app_metadata as Record<string, unknown>)?.role as string || 'free',
    subscription: (user.app_metadata as Record<string, unknown>)?.subscription_tier as string || 'free',
    exp: Math.floor(expiresAt.getTime() / 1000),
  };

  const session = await encrypt(sessionPayload);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  // Also store access token securely
  cookieStore.set('access_token', accessToken, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) return null;

  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('access_token');
}

export async function updateSession() {
  const session = await getSession();
  if (!session) return null;

  const cookieStore = await cookies();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  cookieStore.set('session', await encrypt(session), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}