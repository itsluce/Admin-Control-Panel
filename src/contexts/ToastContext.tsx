import React, {createContext, type ReactNode, useContext, useState} from 'react';
import {Snackbar, Alert, type AlertColor} from '@mui/material';

interface ToastContextType {
  showToast: (message: string, type?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertColor>('info');

  const showToast = (message: string, type: AlertColor = 'info') => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={type}
          sx={{ 
            width: '100%',
            backgroundColor: type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 
                             type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                             type === 'info' ? 'rgba(33, 150, 243, 0.9)' : 'rgba(255, 152, 0, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};