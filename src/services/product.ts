import { apiService } from './api';
import { mockApi } from './mockApi';
import type { Product, ProductFormData, ProductsResponse, PaginationParams, ProductFilters } from '../types';

export const productService = {
  async getProducts(params?: PaginationParams & ProductFilters): Promise<ProductsResponse> {
    try {
      return await mockApi.getProducts(params);
    } catch  {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const query = queryParams.toString();
      const url = `/products${query ? `?${query}` : ''}`;
      
      const response = await apiService.get<ProductsResponse>(url);
      return response.data;
    }
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    return await mockApi.createProduct(data);
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    return await mockApi.updateProduct(id, data);
  },

  async deleteProduct(id: string): Promise<void> {
    return await mockApi.deleteProduct(id);
  },
};