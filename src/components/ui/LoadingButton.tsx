import React from 'react';
import {Button, type ButtonProps, CircularProgress} from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingSize?: number;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingSize = 20,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={
        loading ? (
          <CircularProgress
            size={loadingSize}
            sx={{ color: 'inherit' }}
          />
        ) : (
          props.startIcon
        )
      }
    >
      {children}
    </Button>
  );
};