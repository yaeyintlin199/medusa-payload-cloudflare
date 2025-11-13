'use server'

import type { AdminUser, AdminRole } from '@/types/auth'
import { cookies as nextCookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

const ADMIN_TOKEN_COOKIE = '_admin_jwt'
const ADMIN_REFRESH_TOKEN_COOKIE = '_admin_refresh_jwt'
const ADMIN_CACHE_TAG = 'admin-auth'

/**
 * Get admin auth headers from cookies
 */
export const getAdminAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get(ADMIN_TOKEN_COOKIE)?.value

    if (!token) {
      return {}
    }

    return { authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

/**
 * Set admin JWT token in secure HTTP-only cookie
 */
export const setAdminAuthToken = async (token: string, refreshToken?: string) => {
  try {
    const cookies = await nextCookies()
    
    cookies.set(ADMIN_TOKEN_COOKIE, token, {
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/admin',
    })

    if (refreshToken) {
      cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/admin',
      })
    }

    await revalidateTag(ADMIN_CACHE_TAG)
  } catch (error) {
    console.error('Failed to set admin auth token:', error)
    throw error
  }
}

/**
 * Remove admin JWT token from cookies
 */
export const removeAdminAuthToken = async () => {
  try {
    const cookies = await nextCookies()
    
    cookies.set(ADMIN_TOKEN_COOKIE, '', {
      maxAge: -1,
      path: '/admin',
    })

    cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, '', {
      maxAge: -1,
      path: '/admin',
    })

    await revalidateTag(ADMIN_CACHE_TAG)
  } catch (error) {
    console.error('Failed to remove admin auth token:', error)
    throw error
  }
}

/**
 * Get admin refresh token from cookies
 */
export const getAdminRefreshToken = async (): Promise<string | null> => {
  try {
    const cookies = await nextCookies()
    return cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value || null
  } catch {
    return null
  }
}

/**
 * Validate and decode JWT token (simple validation without external dependencies)
 * This is a basic implementation - in production, verify the signature with your secret
 */
export const decodeAdminToken = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    return decoded
  } catch {
    return null
  }
}

/**
 * Login admin user with email and password
 */
export async function loginAdmin(
  _currentState: unknown,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  // Validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please provide a valid email address' }
  }

  if (!password) {
    return { success: false, error: 'Please provide your password' }
  }

  try {
    // Call admin login endpoint
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      }
    )

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      const errorMessage = data?.message || data?.error || 'Login failed'
      return { success: false, error: errorMessage }
    }

    const data = await response.json()
    const token = data.token || data.access_token

    if (!token) {
      return { success: false, error: 'No authentication token received' }
    }

    // Set JWT token in secure cookie
    await setAdminAuthToken(token, data.refresh_token)

    return { success: true, error: null, user: data.user }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    return { success: false, error: errorMessage }
  }
}

/**
 * Logout admin user
 */
export async function logoutAdmin() {
  try {
    const headers = await getAdminAuthHeaders()
    
    // Call admin logout endpoint if available
    if (Object.keys(headers).length > 0) {
      await fetch(
        `${process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          credentials: 'include',
        }
      ).catch(() => {
        // Logout endpoint might not exist, continue with local cleanup
      })
    }

    // Always clean up local tokens
    await removeAdminAuthToken()
    return { success: true }
  } catch (error) {
    console.error('Error during logout:', error)
    await removeAdminAuthToken()
    return { success: true }
  }
}

/**
 * Refresh admin JWT token using refresh token
 */
export async function refreshAdminToken() {
  try {
    const refreshToken = await getAdminRefreshToken()

    if (!refreshToken) {
      return { success: false, error: 'No refresh token available' }
    }

    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/auth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      }
    )

    if (!response.ok) {
      await removeAdminAuthToken()
      return { success: false, error: 'Token refresh failed' }
    }

    const data = await response.json()
    const token = data.token || data.access_token

    if (!token) {
      await removeAdminAuthToken()
      return { success: false, error: 'No new token received' }
    }

    await setAdminAuthToken(token, data.refresh_token)
    return { success: true, token }
  } catch (error) {
    console.error('Token refresh error:', error)
    await removeAdminAuthToken()
    return { success: false, error: 'Token refresh failed' }
  }
}

/**
 * Get current admin user from token
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const headers = await getAdminAuthHeaders()

    if (Object.keys(headers).length === 0) {
      return null
    }

    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/users/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        credentials: 'include',
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const adminUser = data.user || data

    return {
      id: adminUser.id,
      email: adminUser.email,
      firstName: adminUser.first_name || 'Admin',
      lastName: adminUser.last_name || 'User',
      role: (adminUser.role || 'staff') as AdminRole,
      avatar: adminUser.avatar,
    }
  } catch (error) {
    console.error('Error fetching current admin user:', error)
    return null
  }
}
