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
    console.log('[AUTH_FLOW] Session user object:', JSON.stringify(session.user, null, 2));
    console.log('[AUTH_FLOW] idToken:', idToken);
    
    // The claims are ALREADY in session.user!
    // Read the custom claims directly from session.user
    const role = (session.user[`${CLAIMS_NAMESPACE}user_role`] as string) || 'free';
    const subscription = (session.user[`${CLAIMS_NAMESPACE}subscription`] as string) || 'free';
    
    console.log('[AUTH_FLOW] Extracted role:', role);
    console.log('[AUTH_FLOW] Extracted subscription:', subscription);

    return {
      ...session,
      user: {
        ...session.user,
        role,
        subscription,
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