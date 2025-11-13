'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@lib/context/auth-context'
import { AdminUser } from '@types/auth'
import { logoutAdmin } from '@lib/data/admin-auth'

interface AdminHeaderProps {
  user: AdminUser | null
  sidebarOpen: boolean
}

export function AdminHeader({ user, sidebarOpen }: AdminHeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      await logoutAdmin()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-xl font-semibold text-slate-900">Admin</h2>
          </div>
        </div>

        {/* Right - User Menu */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button className="text-slate-600 hover:text-slate-900 transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.firstName?.[0] || 'A'}
              </div>
              {/* Name */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.firstName || 'Admin'} {user?.lastName || ''}
                </p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              {/* Chevron */}
              <svg
                className={`w-4 h-4 text-slate-600 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-200">
                  <p className="text-sm text-slate-900 font-medium">{user?.email}</p>
                </div>
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    handleLogout()
                  }}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-200 disabled:opacity-50"
                >
                  {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
