export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}