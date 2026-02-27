import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { patchAuth0User } from '@/lib/auth0-management'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth0.getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = session.user.role as string
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId } = await params
  const body = await request.json() as { role?: string; blocked?: boolean }

  const updates: Parameters<typeof patchAuth0User>[1] = {}

  if (body.role !== undefined) {
    updates.app_metadata = { user_role: body.role, subscription: body.role }
  }

  if (body.blocked !== undefined) {
    updates.blocked = body.blocked
  }

  const updated = await patchAuth0User(userId, updates)
  return NextResponse.json({ user: updated })
}
