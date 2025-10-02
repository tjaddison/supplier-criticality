import { Auth0Client } from "@auth0/nextjs-auth0/server";

const CLAIMS_NAMESPACE = 'https://procuresci.com/';

export const auth0 = new Auth0Client({
  // Auth0 configuration is automatically loaded from environment variables:
  // - AUTH0_SECRET
  // - AUTH0_BASE_URL
  // - AUTH0_ISSUER_BASE_URL
  // - AUTH0_CLIENT_ID
  // - AUTH0_CLIENT_SECRET
  
  async beforeSessionSaved(session, idToken) {
    // Check if idToken is valid (not null/undefined) and is an object
    if (!idToken || typeof idToken !== 'object') {
      return session;
    }

    // Type assertion to access claims
    const claims = idToken as Record<string, unknown>;
    
    return {
      ...session,
      user: {
        ...session.user,
        role: claims[`${CLAIMS_NAMESPACE}user_role`] as string | undefined,
        subscription: claims[`${CLAIMS_NAMESPACE}subscription`] as string | undefined,
      },
    };
  },
  
  session: {
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    },
    inactivityDuration: 86400, // 24 hours
    absoluteDuration: 604800, // 7 days
  },
  
  routes: {
    callback: '/auth/callback',
  },
});