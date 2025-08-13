import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { ProductsTable, ProductForm } from '../components/products';
import type { Product, ProductFormData, ApiError } from '../types';
import { useProducts } from '../hooks';

export const ProductsPage: React.FC = () => {
  const productsHook = useProducts();
  const { createProduct, updateProduct } = productsHook;
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

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
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success',
        });
      } else {
        await createProduct(data);
        setSnackbar({
          open: true,
          message: 'Product created successfully!',
          severity: 'success',
        });
      }
      
    } catch (error) {
      const apiError = error as ApiError;
      setSnackbar({
        open: true,
        message: apiError.message || 'Operation failed. Please try again.',
        severity: 'error',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = (): void => {
    setSnackbar(prev => ({ ...prev, open: false }));
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            backgroundColor: snackbar.severity === 'success' 
              ? 'rgba(16, 185, 129, 0.9)' 
              : 'rgba(239, 68, 68, 0.9)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};