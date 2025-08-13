import React, {createContext, type ReactNode, useContext, useEffect, useState,} from 'react';
import { authService, apiService } from '../services';
import { useToast } from './ToastContext';
import type {AuthContextType, AuthTokens, LoginCredentials, User} from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const storedTokens = localStorage.getItem('auth_tokens');
        if (storedTokens) {
          setTokens(JSON.parse(storedTokens));
          setUser({
            id: '1',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
          });
        }
      }
    } catch (error) {
      console.error('Filed to initialize auth:', error);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse = await authService.login(credentials);

      setUser(authResponse.user);
      setTokens(authResponse.tokens);
      apiService.setAuthTokens(authResponse.tokens);
      showToast('Login successful! Welcome back.', 'success');
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setTokens(null);
    authService.logout();
    showToast('You have been logged out successfully.', 'info');
  };

  const contextValue: AuthContextType = {
    user,
    tokens,
    login,
    logout,
    isAuthenticated: !!user && !!tokens,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};