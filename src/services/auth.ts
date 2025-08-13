import { apiService } from './api';
import { mockApi } from './mockApi';
import type { LoginCredentials, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await mockApi.login(credentials);
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiService.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  logout(): void {
    apiService.clearAuthTokens();
  },

  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  },
};