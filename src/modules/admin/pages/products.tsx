'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product, PaginationParams } from '@/types/admin'
import { getProducts } from '@lib/data/admin-api'

export function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 20

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params: PaginationParams = { page, limit, search }
        const result = await getProducts(params)
        setProducts(result.data)
        setTotal(result.total)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, search])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
        </div>

        {loading ? (
          <div className="p-4 text-center text-slate-600">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{product.sku}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">${product.price}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{product.inventory}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'inactive'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/products/${product.id}`}
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

            <div className="flex items-center justify-between border-t border-slate-200 p-4">
              <div className="text-sm text-slate-600">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
