import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AuthTokens, ApiResponse, ApiError } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private axiosInstance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const tokens = this.getTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const tokens = this.getTokens();
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh(tokens.refreshToken);

    try {
      const newAccessToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newAccessToken;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      
      const currentTokens = this.getTokens();
      if (currentTokens) {
        const newTokens: AuthTokens = {
          accessToken,
          refreshToken: currentTokens.refreshToken,
        };
        this.setTokens(newTokens);
      }

      return accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private getTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }

  private clearTokens(): void {
    localStorage.removeItem('auth_tokens');
  }

  private handleAuthError(): void {
    this.clearTokens();
    window.location.href = '/login';
  }

  private normalizeError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  public setAuthTokens(tokens: AuthTokens): void {
    this.setTokens(tokens);
  }

  public clearAuthTokens(): void {
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return !!tokens?.accessToken;
  }
}

export const apiService = new ApiService();
export default apiService;