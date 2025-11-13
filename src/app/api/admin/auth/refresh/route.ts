import { NextRequest, NextResponse } from 'next/server'
import { refreshAdminToken } from '@lib/data/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const result = await refreshAdminToken()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Token refresh failed' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      token: result.token,
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Token refresh failed' },
      { status: 500 }
    )
  }
}
