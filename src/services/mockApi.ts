import type { LoginCredentials, AuthResponse, Product, ProductsResponse, ProductFormData } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const users = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
  },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    price: 299.99,
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    stock: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 399.99,
    description: 'Advanced smartwatch with health monitoring features',
    category: 'Electronics',
    stock: 30,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Wireless Keyboard',
    price: 129.99,
    description: 'Mechanical keyboard with RGB backlighting',
    category: 'Accessories',
    stock: 75,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Gaming Mouse',
    price: 89.99,
    description: 'High-precision gaming mouse with customizable buttons',
    category: 'Accessories',
    stock: 100,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Monitor Stand',
    price: 49.99,
    description: 'Adjustable monitor stand with storage compartment',
    category: 'Accessories',
    stock: 25,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

let nextProductId = 6;

export const mockApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000);

    if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
      const response: AuthResponse = {
        user: users[0],
        tokens: {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
        },
      };
      return response;
    }

    throw new Error('Invalid credentials');
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    await delay(500);
    if (refreshToken.startsWith('mock-refresh-token')) {
      return {
        accessToken: 'mock-access-token-refreshed-' + Date.now(),
      };
    }
    throw new Error('Invalid refresh token');
  },

  async getProducts(params?: any): Promise<ProductsResponse> {
    await delay(500);
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || '';

    let filteredProducts = [...products];

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    await delay(1000);
    const newProduct: Product = {
      ...data,
      id: nextProductId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    nextProductId++;
    return newProduct;
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    await delay(1000);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    const updatedProduct = {
      ...products[productIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    products[productIndex] = updatedProduct;
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(500);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    products.splice(productIndex, 1);
  },
};