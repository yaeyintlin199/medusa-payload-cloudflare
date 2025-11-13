'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { ReportsContent } from '@modules/admin/pages/reports'

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <ReportsContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
