import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { updateContactStatus, deleteContactSubmission } from '@/lib/contact-dynamodb'

async function requireAdmin() {
  const session = await auth0.getSession()
  if (!session?.user) return null
  if ((session.user.role as string) !== 'admin') return null
  return session
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json() as { status?: 'new' | 'contacted' | 'closed'; notes?: string }

  if (body.status) {
    await updateContactStatus(id, body.status, body.notes)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  await deleteContactSubmission(id)
  return NextResponse.json({ ok: true })
}
