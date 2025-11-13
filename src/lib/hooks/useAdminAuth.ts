import { useAuth } from '@lib/context/auth-context'

export function useAdminAuth() {
  return useAuth()
}

export function useRequireAuth() {
  const { user, isLoading } = useAuth()

  return {
    isAuthenticated: !!user,
    user,
    isLoading,
  }
}

export function useRequireRole(requiredRoles: string[]) {
  const { user, canAccess, isLoading } = useAuth()

  return {
    hasRequiredRole: user ? canAccess(requiredRoles) : false,
    user,
    isLoading,
  }
}
