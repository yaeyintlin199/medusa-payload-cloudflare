'use client'

import type { Order } from '@/types/admin'
import Link from 'next/link'

interface RecentOrdersWidgetProps {
  orders: Order[]
}

export default function RecentOrdersWidget({ orders }: RecentOrdersWidgetProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
          View All →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-4 text-center text-sm text-slate-500">No orders yet</div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="border-l-4 border-blue-500 bg-blue-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-600">{order.customerName}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">${order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
