import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters long')
    .max(100, 'Product name must be less than 100 characters'),
  price: z
    .number({ message: 'Price must be a number' })
    .positive('Price must be a positive number')
    .max(999999.99, 'Price cannot exceed $999,999.99'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  stock: z
    .number({ message: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(99999, 'Stock cannot exceed 99,999 units'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
