'use client'

import React, { createContext, useContext, useCallback } from 'react'
import type { AdminUser } from '@/types/auth'

interface AuthContextType {
  user: AdminUser | null
  isLoading: boolean
  error: string | null
  setUser: (user: AdminUser | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  canAccess: (requiredRole: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Failed to check auth:', err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/auth/logout', { method: 'POST' })
      if (response.ok) {
        setUser(null)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false
      if (user.role === 'super_admin') return true

      const { ROLE_PERMISSIONS } = require('@types/auth')
      const permissions = ROLE_PERMISSIONS[user.role] || []
      return permissions.includes(permission) || permissions.includes('*')
    },
    [user]
  )

  const canAccess = useCallback(
    (requiredRoles: string[]): boolean => {
      if (!user) return false
      return requiredRoles.includes(user.role)
    },
    [user]
  )

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    setUser,
    setIsLoading,
    setError,
    logout,
    hasPermission,
    canAccess,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
