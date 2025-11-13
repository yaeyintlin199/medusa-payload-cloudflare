'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Category } from '@/types/admin'
import { getCategories } from '@lib/data/admin-api'

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const result = await getCategories()
        setCategories(result)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Category
        </Link>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="p-4 text-center text-slate-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Products
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{category.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{category.description}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{category.productCount}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
