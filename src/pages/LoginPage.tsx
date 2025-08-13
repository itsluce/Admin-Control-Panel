import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingButton } from '../components/ui';
import { loginSchema } from '../utils/validation';
import type { LoginFormData } from '../utils/validation';
import type { ApiError } from '../types';

const inputStyle = {
  '& .MuiOutlinedInput-root': {
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
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #2a2a2a inset',
      WebkitTextFillColor: '#fff',
      caretColor: '#fff',
      borderRadius: 'inherit',
    },
    '& input:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 100px #2a2a2a inset',
    },
    '& input:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 100px #2a2a2a inset',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#f5c542',
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#fca5a5',
  },
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setApiError(null);
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      const apiError = error as ApiError;
      setApiError(apiError.message || 'Login failed. Please try again.');
    }
  };

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      className="min-h-screen bg-gradient-dark flex items-center justify-center p-4"
      sx={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 50%, #0a0a0a 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box className="text-center mb-8">
          <Typography
            variant="h3"
            component="h1"
            className="font-bold text-white mb-2"
            sx={{
              background: 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(245, 197, 66, 0.3)',
            }}
          >
            Admin Portal
          </Typography>
          <Typography variant="h6" className="text-gray-300">
            E-commerce Control Panel
          </Typography>
        </Box>

        <Card
          className="backdrop-blur-sm shadow-gold-lg"
          sx={{
            backgroundColor: 'rgba(31, 31, 31, 0.9)',
            border: '1px solid rgba(245, 197, 66, 0.2)',
          }}
        >
          <CardContent className="p-8">
            <Typography
              variant="h4"
              component="h2"
              className="text-center text-white font-semibold"
            >
              Sign In
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 mt-4"
            >
              {apiError && (
                <Alert
                  severity="error"
                  className="mb-4"
                  sx={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                  }}
                >
                  {apiError}
                </Alert>
              )}

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail className="text-gold-500" size={20} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock className="text-gold-500" size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            className="text-gold-500 hover:text-gold-400"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                )}
              />

              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                loading={isSubmitting}
                className="mt-6 py-3 text-lg font-semibold"
                sx={{
                  background: 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
                  color: '#0a0a0a',
                  boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.39)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                    boxShadow: '0 6px 20px 0 rgba(234, 179, 8, 0.5)',
                  },
                  '&:disabled': {
                    background: 'rgba(245, 197, 66, 0.3)',
                    color: 'rgba(0, 0, 0, 0.5)',
                  },
                }}
              >
                SIGN IN
              </LoadingButton>

              <Box className="mt-6 p-4 rounded-lg bg-gray-800 bg-opacity-50">
                <Typography variant="body2" className="text-gray-300 text-center mb-2">
                  Demo Credentials:
                </Typography>
                <Typography variant="body2" className="text-gold-400 text-center">
                  Email: admin@example.com<br />
                  Password: password123
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};