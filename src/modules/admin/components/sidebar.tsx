'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@lib/context/auth-context'

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, hasPermission } = useAuth()

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: '📊',
      permission: undefined,
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: '🛍️',
      permission: 'products:read',
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: '📦',
      permission: 'orders:read',
    },
    {
      label: 'Customers',
      href: '/admin/customers',
      icon: '👥',
      permission: 'customers:read',
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: '📂',
      permission: 'products:read',
    },
    {
      label: 'Coupons',
      href: '/admin/coupons',
      icon: '🏷️',
      permission: 'products:read',
    },
    {
      label: 'Reviews',
      href: '/admin/reviews',
      icon: '⭐',
      permission: 'products:read',
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: '📈',
      permission: 'analytics:read',
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: '⚙️',
      permission: 'settings:read',
    },
  ]

  const visibleItems = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  )

  return (
    <>
      {/* Sidebar */}
      <div
        className={`bg-slate-900 text-white transition-all duration-300 ease-in-out overflow-hidden flex flex-col border-r border-slate-800 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo/Branding */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {isOpen && (
            <Link href="/admin" className="font-bold text-lg">
              Meridian
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                    title={!isOpen ? item.label : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Status */}
        {isOpen && user && (
          <div className="border-t border-slate-800 p-4">
            <p className="text-xs text-slate-400 mb-2">Logged in as</p>
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="hidden sm:block fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        ></div>
      )}
    </>
  )
}
