import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

const COOKIE = 'demo_tier'
const COOKIE_OPTS = { path: '/', httpOnly: true, sameSite: 'lax' as const }

async function requireAdmin() {
  const session = await auth0.getSession()
  if (!session?.user) return null
  if ((session.user.role as string) !== 'admin') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Read from request cookies isn't needed; the cookie is passed to the layout server-side.
  // This endpoint is just a confirmation endpoint.
  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { tier } = await request.json() as { tier: string }
  const validTiers = ['free', 'tier-1', 'tier-2', 'tier-3', 'tier-4']
  if (!validTiers.includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, tier, COOKIE_OPTS)
  return res
}

export async function DELETE() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, '', { ...COOKIE_OPTS, maxAge: 0 })
  return res
}
