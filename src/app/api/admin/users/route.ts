import { NextRequest, NextResponse } from 'next/server'
import { createAPIHandler } from '@/lib/api-auth'
import { listAuth0Users } from '@/lib/auth0-management'
import { docClient } from '@/lib/dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

export const GET = createAPIHandler(async (_request: NextRequest, user) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [auth0Users, scanResult] = await Promise.all([
    listAuth0Users(),
    docClient.send(new ScanCommand({
      TableName: process.env.SUPPLIERS_TABLE_NAME || 'suppliers',
      ProjectionExpression: 'userId',
    })),
  ])

  const supplierCounts: Record<string, number> = {}
  for (const item of scanResult.Items || []) {
    const uid = item.userId as string
    supplierCounts[uid] = (supplierCounts[uid] || 0) + 1
  }

  const users = auth0Users.map(u => ({
    userId: u.user_id,
    email: u.email,
    name: u.name,
    blocked: u.blocked || false,
    role: u.app_metadata?.user_role || 'free',
    subscription: u.app_metadata?.subscription || 'free',
    lastLogin: u.last_login || null,
    loginsCount: u.logins_count || 0,
    supplierCount: supplierCounts[u.user_id] || 0,
  }))

  return NextResponse.json({ users })
})
