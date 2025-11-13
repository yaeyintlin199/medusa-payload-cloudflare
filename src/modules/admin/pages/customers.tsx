'use client'

import { useEffect, useState } from 'react'
import type { Customer, PaginationParams } from '@/types/admin'
import { getCustomers } from '@lib/data/admin-api'

export function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const params: PaginationParams = { page, limit }
        const result = await getCustomers(params)
        setCustomers(result.data)
        setTotal(result.total)
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [page])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-900">Customers</h1>

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
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Orders
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Lifetime Value
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{customer.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{customer.totalOrders}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                        ${customer.lifetimeValue.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            customer.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : customer.status === 'inactive'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {customer.status}
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
