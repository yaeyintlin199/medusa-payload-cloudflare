'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Coupon, PaginationParams } from '@/types/admin'
import { getCoupons } from '@lib/data/admin-api'

export function CouponsContent() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const params: PaginationParams = { page, limit }
        const result = await getCoupons(params)
        setCoupons(result.data)
        setTotal(result.total)
      } catch (error) {
        console.error('Error fetching coupons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [page])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Coupons & Discounts</h1>
        <Link
          href="/admin/coupons/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Coupon
        </Link>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="p-4 text-center text-slate-600">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Uses
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
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{coupon.code}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{coupon.type}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {coupon.currentUses}/{coupon.maxUses || '∞'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            coupon.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/coupons/${coupon.id}`}
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
