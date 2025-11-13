'use client'

import type { DashboardMetrics } from '@/types/admin'

interface DashboardChartsProps {
  metrics: DashboardMetrics
}

export default function DashboardCharts({ metrics }: DashboardChartsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Sales Overview</h2>

      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700">Top Products</h3>
          <div className="mt-3 space-y-2">
            {metrics.topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{product.sales} sales</span>
                  <span className="text-sm text-slate-500">${product.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-medium text-slate-700">Top Categories</h3>
          <div className="mt-3 space-y-2">
            {metrics.topCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{category.name}</span>
                <span className="text-sm font-medium text-slate-900">
                  ${category.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
