import { AuthProvider } from '@lib/context/auth-context'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Medusa Enterprise Admin Panel',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
