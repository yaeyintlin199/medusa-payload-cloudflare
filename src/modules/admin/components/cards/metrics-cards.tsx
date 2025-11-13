'use client'

import type { DashboardMetrics } from '@/types/admin'

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

export default function DashboardMetricsCards({ metrics }: MetricsCardsProps) {
  const metricCards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toString(),
      icon: '📦',
      color: 'bg-green-50',
    },
    {
      title: 'Active Customers',
      value: metrics.activeCustomers.toString(),
      icon: '👥',
      color: 'bg-purple-50',
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: '📈',
      color: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((card, index) => (
        <div key={index} className={`${card.color} rounded-lg p-6 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
            <span className="text-4xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
