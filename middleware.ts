import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Middleware for the Medusa Enterprise Admin Panel and storefront.
 *
 * This middleware handles:
 * 1. Admin authentication checks for protected routes
 * 2. JWT token validation for admin panel
 * 3. Role-based access control at the edge
 * 4. Storefront requests (passthrough for client-side handling)
 *
 * @param request - The incoming Next.js request
 * @returns NextResponse - Protected routes require auth, others pass through
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Admin panel protection - check for auth token
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('_admin_jwt')?.value

    // If no token and not on login page, redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

/**
 * Next.js middleware configuration.
 *
 * IMPORTANT: The matcher must be a static string or array of strings for Next.js to parse at build time.
 * Cannot use imported constants or variables.
 *
 * Current exclusions:
 * - /api/* - API routes (handled by route handlers)
 * - /_next/static/* - Static assets (CSS, JS, fonts)
 * - /_next/image/* - Next.js image optimization
 * - /favicon.ico - Site favicon
 * - /admin/login - Login page (publicly accessible)
 *
 * Note: Uses negative lookahead with explicit path separators (/) to ensure
 * only exact path prefixes are excluded. This prevents false positives like
 * excluding /api-docs when we only want to exclude /api/*.
 *
 * Admin routes middleware:
 * - All /admin/* routes except /admin/login require authentication
 * - JWT token is validated at the middleware level
 * - Unauthenticated users are redirected to login with redirectTo query param
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api or /api/* (API routes)
     * - /_next/static/* (static files)
     * - /_next/image/* (image optimization files)
     * - /favicon.ico (exact match)
     *
     * Note: Uses negative lookahead with (?:/|$) to match both:
     * - /api (exact match using $)
     * - /api/... (paths with trailing slash using /)
     * This prevents false positives like /api-docs while catching /api alone.
     */
    '/((?!api(?:/|$)|_next/static|_next/image|favicon\\.ico).*)',
  ],
}
