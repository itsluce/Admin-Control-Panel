import React, { useState } from 'react';
import { ProductsTable, ProductForm } from '../components/products';
import type { Product, ProductFormData, ApiError } from '../types';
import { useProducts } from '../hooks';
import { useToast } from '../contexts/ToastContext';

export const ProductsPage: React.FC = () => {
  const productsHook = useProducts();
  const { createProduct, updateProduct } = productsHook;
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleAddProduct = (): void => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product): void => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleFormClose = (): void => {
    setFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (data: ProductFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data);
        showToast('Product updated successfully!', 'success');
      } else {
        await createProduct(data);
        showToast('Product created successfully!', 'success');
      }
      
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message || 'Operation failed. Please try again.', 'error');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <ProductsTable
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        productsHook={productsHook}
      />
      
      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        isSubmitting={isSubmitting}
      />
    </>
  );
};