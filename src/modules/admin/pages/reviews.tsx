'use client'

import { useEffect, useState } from 'react'
import type { Review, PaginationParams } from '@/types/admin'
import { getReviews } from '@lib/data/admin-api'

export function ReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<Review['status'] | 'all'>('all')
  const limit = 20

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const params: PaginationParams = { page, limit }
        const result = await getReviews(params)
        const filtered =
          filter === 'all' ? result.data : result.data.filter((r) => r.status === filter)
        setReviews(filtered)
        setTotal(result.total)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [page, filter])

  const totalPages = Math.ceil(total / limit)

  const getStatusColor = (status: Review['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return colors[status]
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-900">Reviews & Ratings</h1>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status as any)
                  setPage(1)
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
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
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Review
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {review.productName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{review.customerName}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{review.title}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(review.status)}`}
                        >
                          {review.status}
                        </span>
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
