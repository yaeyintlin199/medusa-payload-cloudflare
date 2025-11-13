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

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  totalOrders: number
  totalSpent: number
  lifetimeValue: number
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
  updatedAt: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  minOrder?: number
  maxUses?: number
  currentUses: number
  expiresAt?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image?: string
  parent?: string
  children?: Category[]
  productCount: number
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  productName: string
  customerId: string
  customerName: string
  rating: number
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  response?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  activeCustomers: number
  conversionRate: number
  averageOrderValue: number
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  topCategories: Array<{
    id: string
    name: string
    revenue: number
  }>
  recentOrders: Order[]
  salesTrend: Array<{
    date: string
    revenue: number
    orders: number
  }>
}

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
