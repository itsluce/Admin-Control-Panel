import { http, HttpResponse } from 'msw';
import type { AuthResponse, Product, ProductsResponse, User } from '../types';

const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
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

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@example.com' && password === 'password123') {
      const user = users[0];
      const response: AuthResponse = {
        user,
        tokens: {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
        },
      };

      return HttpResponse.json({
        data: response,
        success: true,
        message: 'Login successful',
      });
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid credentials',
      },
      { status: 401 }
    );
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    const { refreshToken } = await request.json() as { refreshToken: string };

    await new Promise(resolve => setTimeout(resolve, 500));

    if (refreshToken.startsWith('mock-refresh-token')) {
      return HttpResponse.json({
        data: {
          accessToken: 'mock-access-token-refreshed-' + Date.now(),
        },
        success: true,
      });
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid refresh token',
      },
      { status: 401 }
    );
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer mock-access-token')) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      data: users[0],
      success: true,
    });
  }),

  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let filteredProducts = [...products];

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    filteredProducts.sort((a, b) => {
      const aVal = a[sortBy as keyof Product];
      const bVal = b[sortBy as keyof Product];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    const response: ProductsResponse = {
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
    };

    return HttpResponse.json({
      data: response,
      success: true,
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    const product = products.find(p => p.id === id);

    if (!product) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: product,
      success: true,
    });
  }),

  http.post('/api/products', async ({ request }) => {
    const productData = await request.json() as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProduct: Product = {
      ...productData,
      id: nextProductId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    nextProductId++;

    return HttpResponse.json({
      data: newProduct,
      success: true,
      message: 'Product created successfully',
    });
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Product>;
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;

    return HttpResponse.json({
      data: updatedProduct,
      success: true,
      message: 'Product updated successfully',
    });
  }),

  http.delete('/api/products/:id', async ({ params }) => {
    const { id } = params;
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    products.splice(productIndex, 1);

    return HttpResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  }),
];