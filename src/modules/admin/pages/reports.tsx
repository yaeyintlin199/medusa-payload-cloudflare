'use client'

import { useState } from 'react'

export function ReportsContent() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  const reports = [
    {
      title: 'Sales Report',
      description: 'Daily, weekly, and monthly sales performance',
      icon: '📊',
    },
    {
      title: 'Customer Report',
      description: 'Customer acquisition and retention metrics',
      icon: '👥',
    },
    {
      title: 'Product Report',
      description: 'Top performing and underperforming products',
      icon: '📦',
    },
    {
      title: 'Inventory Report',
      description: 'Stock levels and inventory status',
      icon: '📈',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Date Range</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {reports.map((report, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-2">{report.icon}</div>
            <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{report.description}</p>
            <button className="mt-4 rounded bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200">
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
