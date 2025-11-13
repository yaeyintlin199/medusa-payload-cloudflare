# Admin Panel Development Guide

## Quick Start

### 1. Access the Admin Panel

Start the development server:
```bash
pnpm dev
```

Visit: `http://localhost:3000/admin/login`

Login with your Medusa credentials.

### 2. Main Routes

| Section | Route | Phase |
|---------|-------|-------|
| Dashboard | `/admin/dashboard` | 4 |
| Products | `/admin/products` | 2 |
| Orders | `/admin/orders` | 3 |
| Customers | `/admin/customers` | 5 |
| Coupons | `/admin/coupons` | 6 |
| Categories | `/admin/categories` | 7 |
| Reviews | `/admin/reviews` | 8 |
| Reports | `/admin/reports` | 13 |
| Settings | `/admin/settings` | 12 |

---

## Adding a New Admin Page

### Step 1: Create the Page Route

Create `src/app/(admin)/admin/[section]/page.tsx`:

```tsx
'use client'

import { ProtectedRoute } from '@lib/context/protected-route'
import { AdminLayout } from '@modules/admin/dashboard/admin-layout'
import { SectionContent } from '@modules/admin/pages/section'

export default function SectionPage() {
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'manager']}>
      <AdminLayout>
        <SectionContent />
      </AdminLayout>
    </ProtectedRoute>
  )
}
```

### Step 2: Create the Content Component

Create `src/modules/admin/pages/section.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import type { ItemType, PaginationParams } from '@/types/admin'
import { getItems } from '@lib/data/admin-api'

export function SectionContent() {
  const [items, setItems] = useState<ItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const params: PaginationParams = { page, limit }
        const result = await getItems(params)
        setItems(result.data)
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [page])

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-900">Section Title</h1>

      <div className="rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-semibold">Column</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
```

### Step 3: Add Sidebar Navigation

Update `src/modules/admin/components/sidebar.tsx`:

```tsx
const menuItems = [
  // ... existing items
  {
    label: 'Section',
    href: '/admin/section',
    icon: '🔷',
    permission: 'section:read',
  },
]
```

### Step 4: Create API Functions

Add to `src/lib/data/admin-api.ts`:

```tsx
export async function getItems(params: PaginationParams): Promise<PaginatedResponse<ItemType>> {
  try {
    const { page = 1, limit = 20 } = params

    // TODO: Replace with actual Medusa SDK call
    const allItems: ItemType[] = [
      // Mock data
    ]

    const start = (page - 1) * limit
    const end = start + limit
    const data = allItems.slice(start, end)

    return {
      data,
      total: allItems.length,
      page,
      limit,
      pages: Math.ceil(allItems.length / limit),
    }
  } catch (error) {
    console.error('Error fetching items:', error)
    throw error
  }
}
```

---

## Common Patterns

### Pagination

```tsx
const [page, setPage] = useState(1)
const [total, setTotal] = useState(0)
const limit = 20
const totalPages = Math.ceil(total / limit)

<div className="flex items-center justify-between p-4">
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
    <span className="text-sm">Page {page} of {totalPages}</span>
    <button
      onClick={() => setPage(Math.min(totalPages, page + 1))}
      disabled={page === totalPages}
      className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>
```

### Status Badges

```tsx
const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-800'
}

<span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(status)}`}>
  {status}
</span>
```

### Search & Filter

```tsx
const [search, setSearch] = useState('')
const [filter, setFilter] = useState('all')

const filtered = search
  ? items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    )
  : items

<input
  type="text"
  placeholder="Search..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value)
    setPage(1)  // Reset to page 1
  }}
  className="w-full rounded border border-slate-300 px-3 py-2"
/>
```

### Loading States

```tsx
{loading ? (
  <div className="animate-pulse">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg bg-slate-200 h-32" />
      ))}
    </div>
  </div>
) : items.length === 0 ? (
  <div className="p-4 text-center text-slate-500">No items found</div>
) : (
  // render items
)}
```

### Action Buttons

```tsx
<div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold text-slate-900">Items</h1>
  <Link
    href="/admin/items/new"
    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
  >
    Add Item
  </Link>
</div>
```

---

## Type Definitions

### Admin Entity Types

All types are defined in `src/types/admin.ts`:

```tsx
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  cost?: number
  sku?: string
  status: 'active' | 'inactive' | 'draft'
  category?: string
  inventory: number
  images?: string[]
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress?: Address
  billingAddress?: Address
  notes?: string
  createdAt: string
  updatedAt: string
}

// ... more types
```

### Pagination

```tsx
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}
```

---

## Authentication & Authorization

### Checking Permission

```tsx
import { useAuth } from '@lib/context/auth-context'

export function MyComponent() {
  const { user, hasPermission } = useAuth()

  if (!hasPermission('products:create')) {
    return <div>You don't have permission</div>
  }

  return <button>Create Product</button>
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@lib/context/protected-route'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'manager']}>
      <AdminContent />
    </ProtectedRoute>
  )
}
```

### Available Permissions

```tsx
super_admin: ['*']  // All permissions

manager: [
  'products:read', 'products:create', 'products:update', 'products:delete',
  'orders:read', 'orders:update',
  'customers:read', 'customers:update',
  'analytics:read',
  'settings:read',
]

staff: [
  'products:read',
  'orders:read',
  'customers:read',
  'analytics:read',
]
```

---

## Styling Guidelines

### Color Scheme

```tsx
// Status colors
- success/active: bg-green-100 text-green-800
- warning/pending: bg-yellow-100 text-yellow-800
- error/cancelled: bg-red-100 text-red-800
- info/inactive: bg-blue-100 text-blue-800
- default: bg-gray-100 text-gray-800

// Background
- Primary: bg-blue-600 hover:bg-blue-700
- Danger: bg-red-600 hover:bg-red-700
- White: bg-white
- Gray: bg-slate-50 to bg-slate-200
```

### Common Classes

```tsx
// Typography
h1: text-3xl font-bold text-slate-900
h2: text-lg font-semibold text-slate-900
p: text-sm text-slate-600

// Spacing
Container: p-6
Section: mb-6, space-y-6
Card: rounded-lg bg-white p-6 shadow-sm

// Borders
Border: border-slate-200
Border-top: border-t border-slate-200
Border-bottom: border-b border-slate-200
```

---

## Best Practices

### 1. Server-Side Operations

Use `'use server'` directive for data fetching:

```tsx
'use server'

export async function getItems(params: PaginationParams) {
  // This runs on the server
  const items = await fetchFromMedusa()
  return items
}
```

### 2. Error Handling

Always include try-catch blocks:

```tsx
try {
  const data = await fetchData()
  setData(data)
} catch (error) {
  console.error('Error:', error)
  setError(error instanceof Error ? error.message : 'An error occurred')
} finally {
  setLoading(false)
}
```

### 3. Loading States

Show loading indicators for better UX:

```tsx
{loading && <div className="p-4 text-center">Loading...</div>}
{!loading && items.length === 0 && <div className="p-4 text-center">No items</div>}
{!loading && items.length > 0 && <div>Items...</div>}
```

### 4. TypeScript Types

Always use type imports for types:

```tsx
import type { Product, Order } from '@/types/admin'

// Not:
import { Product } from '@/types/admin'
```

### 5. Component Organization

```tsx
// Organize components by feature/section:
src/modules/admin/pages/      # Full page components
src/modules/admin/components/ # Reusable components
src/lib/data/                 # API/data functions
src/lib/context/              # Context providers
src/types/                    # Type definitions
```

---

## Integration with Medusa Backend

### Using Medusa SDK

```tsx
import { sdk } from '@lib/config'

// Example: Get products
const response = await sdk.store.product.list({
  limit: 20,
  offset: (page - 1) * 20,
})

// Example: Create product
const product = await sdk.admin.product.create({
  title: 'Product Name',
  handle: 'product-name',
  description: 'Description',
})
```

### Replace Mock Data

In `src/lib/data/admin-api.ts`, replace mock data with actual calls:

```tsx
// Before:
const allProducts: Product[] = [
  { id: '1', name: 'Product', ... }
]

// After:
const response = await sdk.store.product.list({
  limit: 1000,
  fields: 'id,title,description,prices,variants,options'
})

const allProducts: Product[] = response.products.map(p => ({
  id: p.id,
  name: p.title,
  description: p.description,
  // ... map other fields
}))
```

---

## Troubleshooting

### Issue: "Cannot import type declaration files"

**Solution:** Use `@/types/` instead of `@types/`:
```tsx
import type { Product } from '@/types/admin'  // ✅
import type { Product } from '@types/admin'   // ❌
```

### Issue: Page doesn't load / 401 Unauthorized

**Solution:** Check auth context and protected route:
```tsx
<ProtectedRoute>
  <AdminLayout>
    <Content />
  </AdminLayout>
</ProtectedRoute>
```

### Issue: Types not found

**Solution:** Make sure types are exported from `src/types/admin.ts`:
```tsx
export interface Product { ... }
export type PaginationParams = { ... }
```

### Issue: Sidebar menu item not showing

**Solution:** Check sidebar.tsx menuItems array and permission:
```tsx
const menuItems = [
  {
    label: 'Products',
    href: '/admin/products',
    icon: '🛍️',
    permission: 'products:read',  // Check this
  },
]

const visibleItems = menuItems.filter(
  (item) => !item.permission || hasPermission(item.permission)
)
```

---

## Performance Tips

### 1. Use React.memo for Cards

```tsx
const MetricsCard = React.memo(({ title, value }: Props) => (
  // component
))
```

### 2. Debounce Search

```tsx
import { useCallback } from 'react'

const handleSearch = useCallback((query: string) => {
  // search logic
}, [])
```

### 3. Lazy Load Pages

```tsx
const ProductsPage = dynamic(() => import('./products'), {
  loading: () => <LoadingSpinner />,
})
```

### 4. Optimize Images

Use Next.js Image component:
```tsx
import Image from 'next/image'

<Image
  src={url}
  alt="alt"
  width={200}
  height={200}
  className="rounded-lg"
/>
```

---

## Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react'
import { ProductsContent } from './products'

describe('ProductsContent', () => {
  it('renders products list', () => {
    render(<ProductsContent />)
    expect(screen.getByText('Products')).toBeInTheDocument()
  })
})
```

### E2E Tests

```tsx
import { test, expect } from '@playwright/test'

test('admin can view products', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login')
  await page.fill('[type=email]', 'admin@example.com')
  await page.fill('[type=password]', 'password')
  await page.click('button[type=submit]')
  
  await page.goto('http://localhost:3000/admin/products')
  expect(await page.textContent('h1')).toContain('Products')
})
```

---

## Resources

- [Admin Phases Implementation](./ADMIN_PHASES_IMPLEMENTATION.md)
- [Admin Auth Setup](./ADMIN_AUTH_SETUP.md)
- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated:** November 2025
**Version:** 1.0
**Production Ready:** Yes (with backend integration)
