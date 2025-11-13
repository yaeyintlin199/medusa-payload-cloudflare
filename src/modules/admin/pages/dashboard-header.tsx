'use client'

import { useAuth } from '@lib/context/auth-context'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome back, {user?.firstName || 'Administrator'}. Here's your store overview.
      </p>
    </div>
  )
}
