'use server'

import { sdk } from '@lib/config'
import type {
  Product,
  Order,
  Customer,
  Coupon,
  Category,
  Review,
  DashboardMetrics,
  PaginatedResponse,
  PaginationParams,
} from '@/types/admin'

// Products API
export async function getProducts(
  params: PaginationParams
): Promise<PaginatedResponse<Product>> {
  try {
    const { page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc', search } = params

    // Mock data for demonstration
    const allProducts: Product[] = [
      {
        id: '1',
        name: 'Classic T-Shirt',
        description: 'Premium cotton t-shirt',
        price: 29.99,
        cost: 10,
        sku: 'TS-001',
        status: 'active',
        category: 'Clothing',
        inventory: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Denim Jeans',
        description: 'Classic blue jeans',
        price: 79.99,
        cost: 30,
        sku: 'JN-001',
        status: 'active',
        category: 'Clothing',
        inventory: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const filtered = search
      ? allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku?.toLowerCase().includes(search.toLowerCase())
        )
      : allProducts

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortBy as keyof Product]
      const bValue = b[sortBy as keyof Product]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })

    const start = (page - 1) * limit
    const end = start + limit
    const data = sorted.slice(start, end)

    return {
      data,
      total: sorted.length,
      page,
      limit,
      pages: Math.ceil(sorted.length / limit),
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    // Mock data
    return {
      id,
      name: 'Sample Product',
      description: 'Sample description',
      price: 99.99,
      cost: 50,
      sku: 'SKU-001',
      status: 'active',
      category: 'Clothing',
      inventory: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  try {
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || '',
      description: data.description,
      price: data.price || 0,
      cost: data.cost,
      sku: data.sku,
      status: data.status || 'draft',
      category: data.category,
      inventory: data.inventory || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return product
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  try {
    const product: Product = {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    } as Product
    return product
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    // Delete operation
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Orders API
export async function getOrders(
  params: PaginationParams
): Promise<PaginatedResponse<Order>> {
  try {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = params

    // Mock data
    const allOrders: Order[] = [
      {
        id: 'ORD-001',
        customerId: 'cust-1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            id: 'item-1',
            productId: '1',
            productName: 'Classic T-Shirt',
            quantity: 2,
            price: 29.99,
            total: 59.98,
          },
        ],
        subtotal: 59.98,
        tax: 4.8,
        total: 64.78,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const start = (page - 1) * limit
    const end = start + limit
    const data = allOrders.slice(start, end)

    return {
      data,
      total: allOrders.length,
      page,
      limit,
      pages: Math.ceil(allOrders.length / limit),
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export async function getOrder(id: string): Promise<Order> {
  try {
    return {
      id,
      customerId: 'cust-1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<Order> {
  try {
    const order = await getOrder(id)
    return { ...order, status, updatedAt: new Date().toISOString() }
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

// Customers API
export async function getCustomers(
  params: PaginationParams
): Promise<PaginatedResponse<Customer>> {
  try {
    const { page = 1, limit = 20 } = params

    // Mock data
    const allCustomers: Customer[] = [
      {
        id: 'cust-1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        totalOrders: 5,
        totalSpent: 324.95,
        lifetimeValue: 324.95,
        status: 'active',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const start = (page - 1) * limit
    const end = start + limit
    const data = allCustomers.slice(start, end)

    return {
      data,
      total: allCustomers.length,
      page,
      limit,
      pages: Math.ceil(allCustomers.length / limit),
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}

export async function getCustomer(id: string): Promise<Customer> {
  try {
    return {
      id,
      email: 'customer@example.com',
      firstName: 'Customer',
      lastName: 'Name',
      totalOrders: 0,
      totalSpent: 0,
      lifetimeValue: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw error
  }
}

// Coupons API
export async function getCoupons(
  params: PaginationParams
): Promise<PaginatedResponse<Coupon>> {
  try {
    const { page = 1, limit = 20 } = params

    // Mock data
    const allCoupons: Coupon[] = [
      {
        id: 'coup-1',
        code: 'SUMMER20',
        type: 'percentage',
        value: 20,
        currentUses: 45,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const start = (page - 1) * limit
    const end = start + limit
    const data = allCoupons.slice(start, end)

    return {
      data,
      total: allCoupons.length,
      page,
      limit,
      pages: Math.ceil(allCoupons.length / limit),
    }
  } catch (error) {
    console.error('Error fetching coupons:', error)
    throw error
  }
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  try {
    return [
      {
        id: 'cat-1',
        name: 'Clothing',
        productCount: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Reviews API
export async function getReviews(
  params: PaginationParams
): Promise<PaginatedResponse<Review>> {
  try {
    const { page = 1, limit = 20 } = params

    // Mock data
    const allReviews: Review[] = [
      {
        id: 'rev-1',
        productId: '1',
        productName: 'Classic T-Shirt',
        customerId: 'cust-1',
        customerName: 'John Doe',
        rating: 5,
        title: 'Great quality!',
        content: 'Excellent product, very comfortable',
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const start = (page - 1) * limit
    const end = start + limit
    const data = allReviews.slice(start, end)

    return {
      data,
      total: allReviews.length,
      page,
      limit,
      pages: Math.ceil(allReviews.length / limit),
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

// Dashboard API
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      totalRevenue: 12500.5,
      totalOrders: 245,
      activeCustomers: 128,
      conversionRate: 2.8,
      averageOrderValue: 51.02,
      topProducts: [
        { id: '1', name: 'Classic T-Shirt', sales: 145, revenue: 4348.55 },
        { id: '2', name: 'Denim Jeans', sales: 89, revenue: 7119.11 },
      ],
      topCategories: [
        { id: 'cat-1', name: 'Clothing', revenue: 8500 },
        { id: 'cat-2', name: 'Accessories', revenue: 4000.5 },
      ],
      recentOrders: [],
      salesTrend: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(thirtyDaysAgo)
        date.setDate(date.getDate() + i)
        return {
          date: date.toISOString().split('T')[0],
          revenue: Math.random() * 1000,
          orders: Math.floor(Math.random() * 20),
        }
      }),
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    throw error
  }
}
