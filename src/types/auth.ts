export type AdminUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: AdminRole
  avatar?: string
}

export type AdminRole = 'super_admin' | 'manager' | 'staff'

export type RolePermissions = {
  super_admin: string[]
  manager: string[]
  staff: string[]
}

export const ROLE_PERMISSIONS: RolePermissions = {
  super_admin: ['*'],
  manager: [
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'orders:read',
    'orders:update',
    'customers:read',
    'customers:update',
    'analytics:read',
    'settings:read',
  ],
  staff: [
    'products:read',
    'orders:read',
    'customers:read',
    'analytics:read',
  ],
}
