'use client'

import React, { useState } from 'react'
import { useAuth } from '@lib/context/auth-context'
import { AdminHeader } from '../components/header'
import { AdminSidebar } from '../components/sidebar'

export function AdminDashboard() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader user={user} sidebarOpen={sidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Welcome to Admin Panel</h1>
              <p className="mt-2 text-slate-600">
                Manage your Medusa store from here.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Total Orders"
                value="0"
                description="All time"
                icon="📦"
              />
              <DashboardCard
                title="Total Revenue"
                value="$0.00"
                description="All time"
                icon="💰"
              />
              <DashboardCard
                title="Active Customers"
                value="0"
                description="This month"
                icon="👥"
              />
              <DashboardCard
                title="Products"
                value="0"
                description="In catalog"
                icon="🛍️"
              />
            </div>

            {/* User Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Profile</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="text-lg font-medium text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="text-lg font-medium text-slate-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Role</p>
                  <p className="text-lg font-medium text-slate-900">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {user?.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  description: string
  icon: string
}

function DashboardCard({ title, value, description, icon }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500 mt-2">{description}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
