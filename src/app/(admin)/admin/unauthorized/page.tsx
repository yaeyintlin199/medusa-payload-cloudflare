'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@lib/context/auth-context'

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600">
            You don't have permission to access this page.
          </p>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-slate-50 rounded-md">
            <p className="text-sm text-slate-600">
              <span className="font-medium">Your role:</span> {user.role}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/admin"
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/admin/login"
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
