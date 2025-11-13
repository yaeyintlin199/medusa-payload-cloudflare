'use client'

import React from 'react'
import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminDashboard } from '@modules/admin/dashboard'

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
