import { NextRequest, NextResponse } from 'next/server'
import { removeAdminAuthToken, getAdminAuthHeaders } from '@lib/data/admin-auth'

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export async function POST(request: NextRequest) {
  try {
    // Try to call backend logout if available
    try {
      const authHeaders = await getAdminAuthHeaders()
      if (Object.keys(authHeaders).length > 0) {
        await fetch(`${BACKEND_URL}/admin/auth/user`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          credentials: 'include',
        }).catch(() => {
          // Backend logout might fail, but we still want to clear local tokens
        })
      }
    } catch {
      // Continue with local logout
    }

    // Clear local auth tokens
    await removeAdminAuthToken()

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    // Still clear tokens on error
    await removeAdminAuthToken()
    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  }
}
