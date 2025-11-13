'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { OrdersContent } from '@modules/admin/pages/orders'

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <OrdersContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
