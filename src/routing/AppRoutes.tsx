import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth';
import { DashboardLayout } from '../components/dashboard';
import { LoginPage, DashboardPage, ProductsPage } from '../pages';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-white text-center mt-20">
                <h2 className="text-2xl mb-4">Orders Management</h2>
                <p>Coming Soon - Orders functionality</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-white text-center mt-20">
                <h2 className="text-2xl mb-4">User Management</h2>
                <p>Coming Soon - User management functionality</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};