# Admin Authentication Setup

This document describes the JWT-based authentication system for the Medusa Enterprise Admin Panel.

## Overview

The admin panel uses a secure, session-based authentication system with:

- **JWT Token Storage**: Tokens stored in secure HTTP-only cookies (path-scoped to `/admin`)
- **Protected Routes**: All admin routes except login require authentication
- **Role-Based Access Control**: Support for super_admin, manager, and staff roles
- **Session Management**: Automatic token refresh and cleanup
- **Permission System**: Fine-grained permissions based on user roles

## Architecture

### Components

1. **Auth Context** (`src/lib/context/auth-context.tsx`)
   - Manages global authentication state
   - Provides user info, loading states, and logout function
   - Implements permission checking methods

2. **Admin Auth Data Functions** (`src/lib/data/admin-auth.ts`)
   - Server-side authentication logic
   - Token management (set, get, refresh, remove)
   - User fetching and validation

3. **API Routes** (`src/app/api/admin/auth/`)
   - `/login` - Authenticate with email/password
   - `/logout` - Clear authentication tokens
   - `/me` - Get current user information
   - `/refresh` - Refresh expired tokens

4. **Protected Route Component** (`src/lib/context/protected-route.tsx`)
   - Client-side route protection wrapper
   - Checks authentication and authorization
   - Redirects to login if needed

5. **Middleware** (`middleware.ts`)
   - Edge-level authentication check
   - Redirects unauthenticated requests to login
   - Validates JWT cookie presence

## File Structure

```
src/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx           # Admin layout with AuthProvider
│   │       ├── login/
│   │       │   └── page.tsx         # Login page
│   │       ├── unauthorized/
│   │       │   └── page.tsx         # Unauthorized access page
│   │       └── page.tsx             # Dashboard (protected)
│   └── api/
│       └── admin/
│           └── auth/
│               ├── login/route.ts   # Login endpoint
│               ├── logout/route.ts  # Logout endpoint
│               ├── me/route.ts      # Current user endpoint
│               └── refresh/route.ts # Token refresh endpoint
├── lib/
│   ├── context/
│   │   ├── auth-context.tsx         # Auth state management
│   │   ├── protected-route.tsx      # Route protection wrapper
│   │   └── modal-context.tsx
│   ├── data/
│   │   └── admin-auth.ts            # Server-side auth functions
│   ├── hooks/
│   │   └── useAdminAuth.ts          # Custom auth hooks
│   └── ...
├── modules/
│   └── admin/
│       ├── dashboard/
│       │   └── index.tsx            # Dashboard component
│       └── components/
│           ├── header.tsx           # Admin header with user menu
│           └── sidebar.tsx          # Navigation sidebar
├── types/
│   └── auth.ts                      # TypeScript types for auth
└── ...
```

## Usage

### Login Flow

1. User navigates to `/admin/login`
2. Enters email and password
3. Form submission calls `loginAdmin()` server action
4. Server sends credentials to Medusa backend
5. On success, JWT token stored in secure cookie
6. User context updated and user redirected to dashboard

### Protected Routes

Wrap components with `ProtectedRoute`:

```tsx
import { ProtectedRoute } from '@lib/context/protected-route'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'manager']}>
      <AdminContent />
    </ProtectedRoute>
  )
}
```

### Using Auth in Components

```tsx
'use client'

import { useAuth } from '@lib/context/auth-context'

export function MyComponent() {
  const { user, hasPermission, logout } = useAuth()

  if (user?.role === 'super_admin') {
    // Show admin-only content
  }

  if (hasPermission('products:create')) {
    // Show create product button
  }

  return (
    <button onClick={logout}>
      Sign out {user?.email}
    </button>
  )
}
```

### Role-Based Access

Three predefined roles with permissions:

**super_admin**
- Full access to all features (wildcard permission: `*`)

**manager**
- Read/create/update/delete products
- Read/update orders
- Read/update customers
- Read analytics
- Read settings

**staff**
- Read-only access to products, orders, customers, and analytics

### Customizing Permissions

Edit `src/types/auth.ts` to modify role permissions:

```tsx
export const ROLE_PERMISSIONS: RolePermissions = {
  super_admin: ['*'],
  manager: [
    'products:read',
    'products:create',
    // Add more permissions...
  ],
  staff: [
    'products:read',
    // ...
  ],
}
```

## Authentication Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ GET /admin/dashboard
       ▼
┌─────────────────────┐
│    Middleware       │ ◄─── Check _admin_jwt cookie
└──────┬──────────────┘
       │
       ├─ No token ──────────────┐
       │                         │
       │ Has token              │
       ▼                         │
    ┌────────────┐              ▼
    │   Server   │         ┌─────────────┐
    │ RSC Render │         │  Redirect   │
    └──────┬─────┘         │ /admin/login│
           │               └─────────────┘
           │
           ▼
    ┌──────────────────┐
    │  ClientComponent │
    │  - AuthProvider  │
    │  - useAuth hook  │
    └─────────┬────────┘
              │
              ├─ Fetch /api/admin/auth/me
              │
              ▼
        ┌──────────────┐
        │  Update User │
        │   in Context │
        └──────────────┘
```

## Token Management

### Token Lifespan

- **Access Token**: 24 hours (stored in `_admin_jwt` cookie)
- **Refresh Token**: 7 days (stored in `_admin_refresh_jwt` cookie, if provided)

### Token Refresh

Tokens are automatically refreshed when they expire:

1. API request fails with 401 Unauthorized
2. Client calls `/api/admin/auth/refresh`
3. New access token is issued and stored
4. Original request is retried with new token

### Token Storage

Tokens are stored as HTTP-only cookies with:
- `httpOnly: true` - Prevents XSS attacks
- `sameSite: 'strict'` - CSRF protection
- `secure: true` - HTTPS only in production
- `path: '/admin'` - Scoped to admin routes

## Security Considerations

### Cookie Security

- Tokens cannot be accessed by JavaScript (httpOnly)
- Cookies are sent only on same-site requests (sameSite: strict)
- HTTPS enforced in production (secure flag)
- Path-scoped to `/admin` to prevent unintended sharing

### CSRF Protection

- Same-site cookie policy prevents cross-site token submission
- Consider adding CSRF tokens for sensitive operations

### Password Requirements

- Minimum 8 characters
- Maximum 128 characters
- Enforced on login and signup

### Token Validation

- Tokens are decoded and validated on the server
- Invalid or expired tokens trigger re-authentication

## Environment Variables

Required for admin authentication to work:

```env
# Medusa Backend
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key

# Optional
LOG_SECRET=your_log_secret  # For anonymized logging
```

## Error Handling

The system handles various error scenarios:

- **Invalid Credentials**: User receives clear feedback
- **Token Expired**: Automatic refresh or redirect to login
- **Network Errors**: Retry logic with exponential backoff
- **Unauthorized Access**: Redirect to unauthorized page with explanation
- **Backend Unavailable**: Graceful fallback with error messages

## Next Steps (Future Features)

Phase 2-16 will build on this foundation:

- Two-factor authentication (2FA)
- OAuth2 integration
- Admin user management
- Activity logging and audit trails
- Password reset functionality
- Account lockout after failed attempts
- Session timeout warnings
- Remember me functionality
- Admin user invitation system
- Role and permission management UI

## Troubleshooting

### Login fails with "Invalid credentials"

- Verify email and password are correct
- Ensure Medusa backend is running
- Check MEDUSA_BACKEND_URL is correct

### Token not persisting

- Verify cookies are enabled in browser
- Check browser console for cookie warnings
- Ensure HTTPS is used in production

### Users redirected to login unexpectedly

- Token may have expired (needs refresh)
- Browser cookies may have been cleared
- Try logging in again

### Permission denied errors

- Verify user has correct role assigned in Medusa
- Check role permissions in `src/types/auth.ts`
- Ensure frontend is using correct permission names

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware)
- [HTTP-only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security)
- [Medusa Admin API](https://docs.medusajs.com/admin/api)
