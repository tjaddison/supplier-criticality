import { NextRequest, NextResponse } from 'next/server'
import { getCriteriaWeights, updateCriteriaWeights } from '@/lib/dynamodb'
import { createAPIHandler } from '@/lib/api-auth'

export const GET = createAPIHandler(async (request: NextRequest, user) => {
  try {
    // Get criteria weights for the user
    const weights = await getCriteriaWeights(user.id)

    return NextResponse.json({ weights })

  } catch (error) {
    console.error('Error fetching criteria weights:', error)
    return NextResponse.json({
      error: 'Failed to fetch criteria weights',
      details: [error instanceof Error ? error.message : 'Unknown error occurred']
    }, { status: 500 })
  }
})

export const POST = createAPIHandler(async (request: NextRequest, user) => {
  try {
    // Parse request body
    const weights = await request.json()

    // Save criteria weights for the user
    await updateCriteriaWeights(user.id, weights)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error saving criteria weights:', error)
    return NextResponse.json({
      error: 'Failed to save criteria weights',
      details: [error instanceof Error ? error.message : 'Unknown error occurred']
    }, { status: 500 })
  }
})