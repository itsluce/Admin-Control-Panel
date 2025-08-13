import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        className="min-h-screen flex items-center justify-center bg-gradient-dark"
        sx={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 50%, #0a0a0a 100%)',
        }}
      >
        <Box className="text-center">
          <CircularProgress
            size={60}
            className="mb-4"
            sx={{
              color: '#f5c542',
            }}
          />
          <Typography variant="h6" className="text-white">
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};