export interface Auth0TokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

export interface Auth0User {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
  app_metadata?: {
    role?: string;
    subscription_tier?: string;
  };
}

export async function exchangeCodeForTokens(code: string): Promise<Auth0TokenResponse> {
  const tokenEndpoint = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.AUTH0_CLIENT_ID!,
    client_secret: process.env.AUTH0_CLIENT_SECRET!,
    code,
    redirect_uri: `${process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL}/api/auth/callback`,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${error}`);
  }

  return response.json();
}

export async function getUserInfo(accessToken: string): Promise<Auth0User> {
  const userInfoEndpoint = `https://${process.env.AUTH0_DOMAIN}/userinfo`;

  const response = await fetch(userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user info: ${response.status} ${error}`);
  }

  const user = await response.json();

  // Get additional user metadata from Management API if needed
  // For now, return basic user info
  return user;
}

export async function getAuth0ManagementToken(): Promise<string> {
  const tokenEndpoint = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AUTH0_CLIENT_ID!,
    client_secret: process.env.AUTH0_CLIENT_SECRET!,
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to get management token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function getUserMetadata(userId: string, managementToken: string): Promise<Auth0User> {
  const userEndpoint = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`;

  const response = await fetch(userEndpoint, {
    headers: {
      Authorization: `Bearer ${managementToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user metadata: ${response.status}`);
  }

  return response.json();
}

// Add this to your @/lib/auth0-client file
export async function getUserRoles(userId: string, managementToken: string) {
  try {
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${managementToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user roles: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}