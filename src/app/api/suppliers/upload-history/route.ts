import { NextRequest, NextResponse } from 'next/server'
import { getUserUploadHistory } from '@/lib/dynamodb'
import { createAPIHandler } from '@/lib/api-auth'

export const GET = createAPIHandler(async (request: NextRequest, user) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Fetch upload history
    const uploadHistory = await getUserUploadHistory(user.id, limit)

    return NextResponse.json({
      success: true,
      uploadHistory,
      count: uploadHistory.length
    })

  } catch (error) {
    console.error('Upload history fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch upload history'
    }, { status: 500 })
  }
})