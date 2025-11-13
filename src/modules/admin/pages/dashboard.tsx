'use client'

import { useEffect, useState } from 'react'
import type { DashboardMetrics } from '@/types/admin'
import { getDashboardMetrics } from '@lib/data/admin-api'
import DashboardHeader from './dashboard-header'
import DashboardMetricsCards from '../components/cards/metrics-cards'
import DashboardCharts from '../components/cards/dashboard-charts'
import RecentOrdersWidget from '../components/cards/recent-orders-widget'

export function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const data = await getDashboardMetrics()
        setMetrics(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-lg bg-slate-200 h-32" />
          ))}
        </div>
      ) : metrics ? (
        <>
          <DashboardMetricsCards metrics={metrics} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DashboardCharts metrics={metrics} />
            </div>
            <RecentOrdersWidget orders={metrics.recentOrders} />
          </div>
        </>
      ) : null}
    </div>
  )
}
