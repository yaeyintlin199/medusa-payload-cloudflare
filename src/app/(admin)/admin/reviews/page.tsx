'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { ReviewsContent } from '@modules/admin/pages/reviews'

export default function ReviewsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <ReviewsContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
