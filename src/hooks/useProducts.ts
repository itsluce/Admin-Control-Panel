import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData, ProductsResponse, PaginationParams, ProductFilters, ApiError } from '../types';
import { productService } from '../services';

interface UseProductsReturn {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: ApiError | null;
  loadProducts: (params?: PaginationParams & ProductFilters) => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

interface UseProductsParams {
  autoLoad?: boolean;
  initialParams?: PaginationParams & ProductFilters;
}

export const useProducts = ({
  autoLoad = true,
  initialParams = { page: 1, limit: 10 },
}: UseProductsParams = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentParams, setCurrentParams] = useState(initialParams);

  const loadProducts = useCallback(async (params?: PaginationParams & ProductFilters): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = params || currentParams;
      setCurrentParams(queryParams);
      
      const response: ProductsResponse = await productService.getProducts(queryParams);
      
      setProducts(response.products);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error('Failed to load products:', apiError);
    } finally {
      setIsLoading(false);
    }
  }, [currentParams]);

  const createProduct = useCallback(async (data: ProductFormData): Promise<Product> => {
    try {
      setError(null);
      const newProduct = await productService.createProduct(data);
      
      await loadProducts(currentParams);
      
      return newProduct;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    }
  }, [loadProducts, currentParams]);

  const updateProduct = useCallback(async (id: string, data: Partial<ProductFormData>): Promise<Product> => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(id, data);
      
      await loadProducts(currentParams);
      
      return updatedProduct;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    }
  }, [loadProducts, currentParams]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await productService.deleteProduct(id);
      
      setProducts(prev => prev.filter(product => product.id !== id));
      setTotal(prev => prev - 1);
      
      if (products.length === 1 && page > 1) {
        const newParams = { ...currentParams, page: page - 1 };
        await loadProducts(newParams);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    }
  }, [products.length, page, currentParams, loadProducts]);

  const refreshProducts = useCallback(async (): Promise<void> => {
    await loadProducts(currentParams);
  }, [loadProducts, currentParams]);

  useEffect(() => {
    if (autoLoad) {
      loadProducts(initialParams);
    }
  }, [autoLoad]);

  return {
    products,
    total,
    page,
    totalPages,
    isLoading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };
};