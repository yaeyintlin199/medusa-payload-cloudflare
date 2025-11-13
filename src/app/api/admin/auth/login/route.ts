import { NextRequest, NextResponse } from 'next/server'
import { setAdminAuthToken, decodeAdminToken } from '@lib/data/admin-auth'

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

if (!BACKEND_URL) {
  throw new Error('MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_BACKEND_URL is required')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Call Medusa backend for admin login
    const response = await fetch(`${BACKEND_URL}/admin/auth/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }))
      return NextResponse.json(
        { error: errorData.message || 'Invalid credentials' },
        { status: 401 }
      )
    }

    const data = await response.json()
    const token = data.token || data.access_token

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token received' },
        { status: 500 }
      )
    }

    // Decode token to get user info
    const decodedToken = decodeAdminToken(token)
    const user = data.user || decodedToken

    // Set secure HTTP-only cookie
    await setAdminAuthToken(token, data.refresh_token)

    const response2 = NextResponse.json(
      {
        success: true,
        user: {
          id: user?.id || user?.sub,
          email: user?.email,
          firstName: user?.first_name || 'Admin',
          lastName: user?.last_name || 'User',
          role: user?.role || 'staff',
        },
      },
      { status: 200 }
    )

    // Set cookies from backend response if present
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      response2.headers.set('set-cookie', setCookieHeader)
    }

    return response2
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    )
  }
}
