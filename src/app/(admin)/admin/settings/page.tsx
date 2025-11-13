'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { SettingsContent } from '@modules/admin/pages/settings'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <SettingsContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
