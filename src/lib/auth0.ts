import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  // Auth0 configuration is automatically loaded from environment variables:
  // - AUTH0_SECRET
  // - AUTH0_BASE_URL
  // - AUTH0_ISSUER_BASE_URL
  // - AUTH0_CLIENT_ID
  // - AUTH0_CLIENT_SECRET

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