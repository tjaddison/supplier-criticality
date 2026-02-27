import { NextRequest, NextResponse } from 'next/server'
import { createAPIHandler } from '@/lib/api-auth'
import { getContactSubmissions } from '@/lib/contact-dynamodb'

export const GET = createAPIHandler(async (_request: NextRequest, user) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const contacts = await getContactSubmissions()
  contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return NextResponse.json({ contacts })
})
