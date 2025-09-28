import { NextRequest, NextResponse } from 'next/server'
import { getUserSuppliers } from '@/lib/dynamodb'
import { createAPIHandler } from '@/lib/api-auth'

export const GET = createAPIHandler(async (request: NextRequest, user) => {
  try {
    // Get suppliers for the user
    const suppliers = await getUserSuppliers(user.id)

    return NextResponse.json({ suppliers })

  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json({
      error: 'Failed to fetch suppliers',
      details: [error instanceof Error ? error.message : 'Unknown error occurred']
    }, { status: 500 })
  }
})