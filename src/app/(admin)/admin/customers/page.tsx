'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { CustomersContent } from '@modules/admin/pages/customers'

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <CustomersContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
