'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { CategoriesContent } from '@modules/admin/pages/categories'

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <CategoriesContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
