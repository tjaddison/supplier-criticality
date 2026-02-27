export interface Auth0User {
  user_id: string
  email: string
  name: string
  blocked: boolean
  app_metadata: {
    user_role?: string
    subscription?: string
  }
  last_login?: string
  logins_count?: number
}

function getDomain() {
  return (process.env.AUTH0_ISSUER_BASE_URL || '').replace('https://', '')
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getMgmtToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token

  const domain = getDomain()
  const res = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_MGMT_CLIENT_ID,
      client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  })

  if (!res.ok) throw new Error(`Auth0 management token error: ${res.status}`)

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return data.access_token
}

export async function listAuth0Users(): Promise<Auth0User[]> {
  const domain = getDomain()
  const token = await getMgmtToken()
  const res = await fetch(
    `https://${domain}/api/v2/users?per_page=100&fields=user_id,email,name,blocked,app_metadata,last_login,logins_count`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error(`Auth0 list users error: ${res.status}`)
  return res.json()
}

export async function patchAuth0User(
  userId: string,
  updates: { app_metadata?: Record<string, unknown>; blocked?: boolean }
) {
  const domain = getDomain()
  const token = await getMgmtToken()
  const res = await fetch(
    `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  )
  if (!res.ok) throw new Error(`Auth0 patch user error: ${res.status}`)
  return res.json()
}
