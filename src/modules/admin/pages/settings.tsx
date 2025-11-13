'use client'

import { useState } from 'react'

export function SettingsContent() {
  const [settings, setSettings] = useState({
    storeName: 'Casual Chic Boutique',
    storeUrl: 'https://casualchic.com',
    timezone: 'UTC',
    currency: 'USD',
    maintenanceMode: false,
    emailNotifications: true,
    apiKeysEnabled: false,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

      {saved && (
        <div className="rounded-lg bg-green-50 p-4 text-green-700">Settings saved successfully!</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Settings */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Store Information</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Store URL</label>
              <input
                type="text"
                value={settings.storeUrl}
                onChange={(e) => handleChange('storeUrl', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              >
                <option>UTC</option>
                <option>EST</option>
                <option>CST</option>
                <option>PST</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>CAD</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">System Settings</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Maintenance Mode</label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="h-5 w-5"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="h-5 w-5"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">API Keys</label>
              <input
                type="checkbox"
                checked={settings.apiKeysEnabled}
                onChange={(e) => handleChange('apiKeysEnabled', e.target.checked)}
                className="h-5 w-5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
