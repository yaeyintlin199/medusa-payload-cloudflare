'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  requiredPermission?: string
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermission,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, canAccess, hasPermission } = useAuth()

  React.useEffect(() => {
    if (isLoading) return

    // Check if user is authenticated
    if (!user) {
      router.push(`/admin/login?redirectTo=${pathname}`)
      return
    }

    // Check role requirements
    if (requiredRoles && !canAccess(requiredRoles)) {
      router.push('/admin/unauthorized')
      return
    }

    // Check permission requirements
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/admin/unauthorized')
      return
    }
  }, [user, isLoading, requiredRoles, requiredPermission, router, pathname, canAccess, hasPermission])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRoles && !canAccess(requiredRoles)) {
    return null
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null
  }

  return <>{children}</>
}
