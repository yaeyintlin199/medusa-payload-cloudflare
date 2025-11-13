'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { CouponsContent } from '@modules/admin/pages/coupons'

export default function CouponsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <CouponsContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
