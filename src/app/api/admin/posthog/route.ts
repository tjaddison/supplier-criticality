import { NextRequest, NextResponse } from 'next/server'
import { createAPIHandler } from '@/lib/api-auth'

export interface PostHogPersonStats {
  distinctId: string
  lastSeen: string | null
  pageviews: number
  sessions: number
}

export const GET = createAPIHandler(async (_request: NextRequest, user) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID

  if (!apiKey || !projectId) {
    return NextResponse.json({ stats: {} })
  }

  const res = await fetch(
    `https://us.posthog.com/api/projects/${projectId}/persons/?limit=100`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  )

  if (!res.ok) {
    return NextResponse.json({ stats: {} })
  }

  const data = await res.json() as {
    results: Array<{
      distinct_ids: string[]
      properties: {
        email?: string
        $last_seen?: string
        $pageview_count?: number
        $session_count?: number
      }
    }>
  }

  const stats: Record<string, PostHogPersonStats> = {}

  for (const person of data.results) {
    const email = person.properties.email
    if (!email) continue

    // Also index by Auth0 user_id (distinct_id starting with 'auth0|')
    const auth0Id = person.distinct_ids.find(id => id.startsWith('auth0|'))

    const entry: PostHogPersonStats = {
      distinctId: auth0Id || person.distinct_ids[0] || '',
      lastSeen: person.properties.$last_seen || null,
      pageviews: person.properties.$pageview_count || 0,
      sessions: person.properties.$session_count || 0,
    }

    if (email) stats[email] = entry
    if (auth0Id) stats[auth0Id] = entry
  }

  return NextResponse.json({ stats })
})
