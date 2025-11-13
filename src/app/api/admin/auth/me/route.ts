import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuthHeaders, getCurrentAdminUser, refreshAdminToken } from '@lib/data/admin-auth'

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export async function GET(request: NextRequest) {
  try {
    const authHeaders = await getAdminAuthHeaders()

    if (Object.keys(authHeaders).length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch current user from backend
    const response = await fetch(`${BACKEND_URL}/admin/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) {
      // Try to refresh token if it expired
      if (response.status === 401) {
        const refreshResult = await refreshAdminToken()
        if (!refreshResult.success) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        // Retry with new token
        const newHeaders = await getAdminAuthHeaders()
        const retryResponse = await fetch(`${BACKEND_URL}/admin/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...newHeaders,
          },
          credentials: 'include',
          cache: 'no-store',
        })

        if (!retryResponse.ok) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }

        const userData = await retryResponse.json()
        const user = userData.user || userData

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name || 'Admin',
            lastName: user.last_name || 'User',
            role: user.role || 'staff',
            avatar: user.avatar,
          },
        })
      }

      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      )
    }

    const userData = await response.json()
    const user = userData.user || userData

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name || 'Admin',
        lastName: user.last_name || 'User',
        role: user.role || 'staff',
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
