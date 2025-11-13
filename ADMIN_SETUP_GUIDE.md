# Admin Panel Setup Guide

This guide covers the complete setup of the Medusa Enterprise Admin Panel authentication system.

## Quick Start

### 1. Environment Configuration

Ensure your `.env.local` file contains:

```env
# Medusa Backend
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key

# Optional for logging
LOG_SECRET=your_generated_secret
```

### 2. Running the Admin Panel

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

Access the admin panel at: `http://localhost:3000/admin`

### 3. First Login

1. Navigate to `/admin/login`
2. Enter your Medusa admin credentials
3. You'll be redirected to the dashboard

## Architecture Overview

### Authentication Flow

1. **Middleware Layer** (`middleware.ts`)
   - Validates JWT cookie presence on admin routes
   - Redirects to login if token missing
   - Allows access if token exists

2. **API Layer** (`/app/api/admin/auth/`)
   - Communicates with Medusa backend
   - Manages JWT token lifecycle
   - Handles token refresh

3. **Context Layer** (`lib/context/auth-context.tsx`)
   - Manages client-side auth state
   - Provides user information and permissions
   - Fetches current user on app load

4. **Route Protection** (`lib/context/protected-route.tsx`)
   - Client-side route wrapper
   - Checks authentication and authorization
   - Performs permission validation

### Component Architecture

```
App (root)
├── (admin) group
│   └── admin
│       ├── layout.tsx (AuthProvider wrapper)
│       ├── login/ (public)
│       ├── unauthorized/ (public)
│       ├── page.tsx (protected)
│       └── [other routes]
└── (storefront) group
```

## Role System

### Three Built-in Roles

#### 1. Super Admin
- Full system access (wildcard permissions)
- Can manage all features
- Can create/delete other admin users

#### 2. Manager
- Can manage products, orders, customers
- Read access to analytics and settings
- Limited to assigned stores/regions

#### 3. Staff
- Read-only access to products, orders, customers
- Can create orders for customers
- No access to sensitive settings

### Permission Structure

Each role has a list of permissions in `src/types/auth.ts`:

```
Permission Format: "resource:action"

Examples:
- products:read       - Can view products
- products:create     - Can create new products
- products:update     - Can edit products
- products:delete     - Can delete products
- orders:read         - Can view orders
- customers:read      - Can view customer list
- analytics:read      - Can access analytics
- settings:read       - Can view settings
```

### Wildcard Permission

`super_admin` role has `*` wildcard which grants all permissions.

## Component Usage Examples

### Basic Auth Check

```tsx
'use client'

import { useAuth } from '@lib/context/auth-context'

export default function MyComponent() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner />
  if (!user) return <NotAuthenticated />

  return <div>Welcome, {user.firstName}!</div>
}
```

### Permission Check

```tsx
'use client'

import { useAuth } from '@lib/context/auth-context'

export function CreateProductButton() {
  const { hasPermission } = useAuth()

  if (!hasPermission('products:create')) {
    return null // Don't show if no permission
  }

  return <button>Create Product</button>
}
```

### Role Check

```tsx
'use client'

import { useAuth } from '@lib/context/auth-context'

export function AdminSettings() {
  const { canAccess } = useAuth()

  if (!canAccess(['super_admin'])) {
    return <div>Access Denied</div>
  }

  return <SettingsPanel />
}
```

### Protected Page

```tsx
'use client'

import { ProtectedRoute } from '@lib/context/protected-route'

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'manager']}>
      <ProductsManager />
    </ProtectedRoute>
  )
}
```

### Custom Hook

```tsx
import { useAdminAuth } from '@lib/hooks/useAdminAuth'

export function MyComponent() {
  const auth = useAdminAuth()
  const { user, hasPermission } = auth

  return null
}
```

## API Reference

### Login (`POST /api/admin/auth/login`)

Request:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "super_admin"
  }
}
```

### Logout (`POST /api/admin/auth/logout`)

Response:
```json
{
  "success": true
}
```

### Get Current User (`GET /api/admin/auth/me`)

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "super_admin",
    "avatar": "url_to_avatar"
  }
}
```

### Refresh Token (`POST /api/admin/auth/refresh`)

Response:
```json
{
  "success": true,
  "token": "new_jwt_token"
}
```

## Cookie Management

### Admin JWT Cookie

- **Name**: `_admin_jwt`
- **Path**: `/admin`
- **HttpOnly**: Yes (secure, cannot be accessed by JavaScript)
- **SameSite**: strict
- **Secure**: Yes (HTTPS only in production)
- **MaxAge**: 24 hours

### Admin Refresh Token Cookie

- **Name**: `_admin_refresh_jwt`
- **Path**: `/admin`
- **HttpOnly**: Yes
- **SameSite**: strict
- **Secure**: Yes
- **MaxAge**: 7 days

## Customization Guide

### Adding New Roles

1. Update `src/types/auth.ts`:

```tsx
export type AdminRole = 'super_admin' | 'manager' | 'staff' | 'your_new_role'

export const ROLE_PERMISSIONS: RolePermissions = {
  your_new_role: [
    'products:read',
    // Add your permissions
  ],
}
```

2. Use in components:

```tsx
<ProtectedRoute requiredRoles={['your_new_role']}>
  <Component />
</ProtectedRoute>
```

### Adding New Permissions

1. Create permission name following format: `resource:action`
2. Add to relevant roles in `ROLE_PERMISSIONS`
3. Use in components:

```tsx
if (hasPermission('new_resource:action')) {
  // Show UI element
}
```

### Customizing Login Page

Edit `src/app/(admin)/admin/login/page.tsx`:

- Update styling
- Add logo/branding
- Customize error messages
- Add forgot password link

### Customizing Dashboard

Edit `src/modules/admin/dashboard/index.tsx`:

- Add widgets and KPIs
- Customize layout
- Add analytics
- Integrate real-time data

## Troubleshooting

### Issue: Can't login

**Solutions:**
1. Check MEDUSA_BACKEND_URL is correct
2. Verify Medusa backend is running
3. Check credentials are correct
4. Review network tab for API errors

### Issue: Token keeps expiring

**Solutions:**
1. Reduce browser background tabs
2. Check server time synchronization
3. Clear browser cookies and retry
4. Check token validity in browser console

### Issue: Permission denied on allowed action

**Solutions:**
1. Verify role assignment in Medusa
2. Check permission name matches exactly
3. Verify role has permission in `ROLE_PERMISSIONS`
4. Clear cache and refresh

### Issue: Sidebar not updating

**Solutions:**
1. Wrap component with `<AuthProvider>`
2. Use `useAuth()` hook only in client components (`'use client'`)
3. Check user role loaded correctly
4. Verify permissions are defined

## Security Best Practices

1. **Always use HTTPS in production**
   - Cookies require secure flag in production
   - Prevents token interception

2. **Rotate tokens regularly**
   - Implement automatic token refresh
   - Use short expiration times

3. **Validate permissions server-side**
   - Client-side checks are UI only
   - Always verify permissions on API endpoints

4. **Monitor failed login attempts**
   - Log all authentication events
   - Implement account lockout after X failed attempts

5. **Audit admin actions**
   - Log all admin changes
   - Track who made changes and when

6. **Use environment variables**
   - Never commit secrets to git
   - Use .env.local for development

## Performance Tips

1. **Cache user data**
   - Avoid re-fetching /api/admin/auth/me on every render
   - Use React Context to memoize user state

2. **Lazy load admin components**
   - Use code splitting for admin routes
   - Load components only when needed

3. **Implement request debouncing**
   - Debounce permission checks
   - Batch API requests

4. **Use ISR for static content**
   - Implement incremental static regeneration
   - Cache dashboard data appropriately

## Next Steps

After basic setup, implement:

1. **User Management** (Phase 5)
   - Create/edit/delete admin users
   - Assign roles and permissions

2. **Product Management** (Phase 2)
   - CRUD operations
   - Bulk actions

3. **Order Management** (Phase 3)
   - Order tracking
   - Status updates

4. **Dashboard & Analytics** (Phase 4)
   - Real-time metrics
   - Charts and graphs

## Testing

### Manual Testing

1. Test login flow
2. Verify token storage in cookies
3. Check permission enforcement
4. Test logout
5. Verify redirect on unauthorized access

### Automated Testing

Examples for your test suite:

```typescript
describe('Admin Auth', () => {
  it('should login with valid credentials', async () => {
    // Test login
  })

  it('should redirect to login if not authenticated', async () => {
    // Test redirect
  })

  it('should prevent unauthorized role access', async () => {
    // Test role-based access
  })
})
```

## Support & Resources

- Medusa Docs: https://docs.medusajs.com
- Next.js App Router: https://nextjs.org/docs/app
- TypeScript: https://www.typescriptlang.org/docs
- React: https://react.dev

## License

This project is open source and available under the MIT License.
