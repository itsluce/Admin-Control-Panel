import React, {useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '../ui';
import { productSchema } from '../../utils';
import type { Product, ProductFormData } from '../../types';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product | null;
  isSubmitting?: boolean;
}

const categories = [
  'Electronics',
  'Accessories',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Beauty',
  'Health',
  'Automotive',
];

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(245, 197, 66, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(245, 197, 66, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f5c542',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#f5c542',
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#fca5a5',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}

export const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSubmit,
  product,
  isSubmitting = false,
}) => {
  const isEditing = !!product;
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      category: '',
      stock: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
      });
    } else {
      reset({
        name: '',
        price: 0,
        description: '',
        category: '',
        stock: 0,
      });
    }
  }, [product, reset]);

  const handleFormSubmit = async (data: ProductFormData): Promise<void> => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = (): void => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#2a2a2a',
          border: '1px solid rgba(245, 197, 66, 0.2)',
          maxHeight: { xs: '100vh', md: '90vh' },
          margin: { xs: 0, md: 2 },
          borderRadius: { xs: 0, md: 2 },
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" className="text-white font-semibold">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className="pt-4" sx={{ px: { xs: 2, md: 3 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Product Name"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="price"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Price"
                    type="number"
                    variant="outlined"
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    inputProps={{
                      step: 0.01,
                      min: 0,
                    }}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Category"
                    variant="outlined"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    sx={inputStyle}>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="stock"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    variant="outlined"
                    value={value || ''}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    inputProps={{
                      min: 0,
                    }}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions 
          className="p-6" 
          sx={{ 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 1 },
            px: { xs: 2, md: 3 }
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            fullWidth={isSmallScreen}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              order: { xs: 2, sm: 1 },
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            fullWidth={isSmallScreen}
            sx={{
              background: 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
              color: '#0a0a0a',
              '&:hover': {
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
              },
              order: { xs: 1, sm: 2 },
            }}
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};