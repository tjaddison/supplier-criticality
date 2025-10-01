# Auth0 v4.10.0 Implementation Guide - Complete Setup

## Overview
This project uses Auth0 nextjs-auth0 v4.10.0 with Next.js App Router. The v4.x SDK introduces significant changes from v3.x, including a middleware-based approach that eliminates CORS issues and simplifies authentication handling.

## Auth0 v4.10.0 Exports
The available exports from Auth0 v4.10.0 are:
- **Main package**: ['Auth0Provider', 'getAccessToken', 'useUser', 'withPageAuthRequired']
- **Server package**: ['AbstractSessionStore', 'Auth0Client', 'AuthClient', 'DEFAULT_ID_TOKEN_CLAIMS', 'TransactionStore', 'filterDefaultIdTokenClaims']

**Note**: v4.10.0 does NOT export `handleAuth`, `handleLogin`, `handleLogout` - these are replaced by middleware-based authentication.

## Implementation Details

### 1. Environment Configuration
Required environment variables in `.env.local`:
```bash
# Auth0 Configuration (v4.10.0 format)
APP_BASE_URL=http://localhost:3000
AUTH0_SECRET=your-auth0-secret
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_DOMAIN=your-tenant.auth0.com
```

### 2. Auth0 Client Setup (`src/lib/auth0.ts`)
```typescript
import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  // Auth0 configuration is automatically loaded from environment variables
  authorizationParameters: {
    scope: 'openid profile email',
  },
  signInReturnToPath: '/dashboard',
});
```

### 3. Middleware Configuration (`src/middleware.ts`)
```typescript
import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
```

### 4. No Catch-All Route Required
**Important**: v4.10.0 does NOT require `/api/auth/[...auth0]/route.ts`. The middleware automatically handles:
- `/auth/login`: Login route
- `/auth/logout`: Logout route
- `/auth/callback`: Callback route
- `/auth/profile`: Profile route
- `/auth/access-token`: Access token route

### 5. Layout Configuration (`src/app/layout.tsx`)
```typescript
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { auth0 } from "@/lib/auth0";

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();
  const user = session?.user || undefined;

  return (
    <html lang="en">
      <body>
        <Auth0Provider user={user}>
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
```

### 6. Client Components
```typescript
"use client";
import { useUser } from '@auth0/nextjs-auth0/client';

export function AuthButton() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>Welcome {user.name}!</p>
        <a href="/auth/logout">Logout</a>
      </div>
    );
  }

  return <a href="/auth/login">Login</a>;
}
```

### 7. Server Components
```typescript
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <div>Welcome {session.user.name}!</div>;
}
```

## Key Implementation Rules

### 1. Authentication Links Must Use Anchor Tags
**Critical**: All authentication links MUST use `<a>` tags instead of Next.js `<Link>` components:

```typescript
// ✅ CORRECT - Use anchor tags for auth
<a href="/auth/login">Login</a>
<a href="/auth/logout">Logout</a>

// ❌ WRONG - Don't use Link for auth
<Link href="/auth/login">Login</Link>
<Link href="/auth/logout">Logout</Link>
```

### 2. Import Paths
```typescript
// Client-side imports
import { useUser, Auth0Provider } from '@auth0/nextjs-auth0/client';

// Server-side imports
import { Auth0Client } from '@auth0/nextjs-auth0/server';
```

### 3. Route Structure
- `/auth/login` - Login page (automatically handled by middleware)
- `/auth/logout` - Logout (automatically handled by middleware)
- `/auth/callback` - OAuth callback (automatically handled by middleware)
- `/auth/profile` - User profile endpoint (automatically handled by middleware)

## CORS Resolution

The v4.10.0 middleware-based approach resolves CORS issues by:

1. **Server-Side Route Handling**: All auth routes are handled server-side by the middleware
2. **Automatic CORS Headers**: Middleware automatically sets proper CORS headers
3. **No Client-Side Redirects**: Using anchor tags ensures server-side navigation
4. **Proper Session Management**: Session cookies are handled automatically with correct domains

## Auth0 Dashboard Configuration

Update your Auth0 Application settings:

**Allowed Callback URLs:**
```
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
https://yourdomain.com
```

**Allowed Web Origins:**
```
http://localhost:3000
https://yourdomain.com
```

## Migration from handleAuth Pattern

If migrating from the old `handleAuth` pattern:

1. **Remove** `/api/auth/[...auth0]/route.ts` file completely
2. **Update middleware** to use `auth0.middleware(request)`
3. **Change all auth Links** to anchor tags
4. **Update imports** to use `/client` for client components
5. **Update environment variables** to v4 format

## Error Handling

Common patterns for handling authentication errors:

```typescript
// Client-side error handling
"use client";
import { useUser } from '@auth0/nextjs-auth0/client';

export function ProtectedComponent() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <a href="/auth/login">Please login</a>;

  return <div>Welcome {user.name}!</div>;
}
```

```typescript
// Server-side error handling
import { auth0 } from '@/lib/auth0';

export default async function ProtectedPage() {
  try {
    const session = await auth0.getSession();
    if (!session) redirect('/auth/login');

    return <div>Protected content</div>;
  } catch (error) {
    console.error('Auth error:', error);
    redirect('/auth/login');
  }
}
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure you're using anchor tags for auth links, not Link components
2. **Session Not Found**: Check environment variables are correctly set
3. **Redirect Loops**: Verify Auth0 dashboard callback URLs match your domain
4. **Import Errors**: Use correct import paths (`/client` vs `/server`)

### Debug Steps:

1. Check browser network tab for failed requests
2. Verify middleware is running (should see auth routes in network)
3. Check browser cookies for auth session
4. Confirm environment variables are loaded
5. Test with fresh browser session (clear cookies)