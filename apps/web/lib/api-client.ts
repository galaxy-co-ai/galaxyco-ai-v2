/**
 * GalaxyCo.ai API Client
 * Typed HTTP client for API interactions
 * October 15, 2025
 */

import type { APIResponse, APIError, PaginatedResponse } from './types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const API_TIMEOUT = 30000; // 30 seconds

// Custom error classes
export class APIClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'APIClientError';
  }
}

export class NetworkError extends APIClientError {
  constructor(message: string = 'Network request failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends APIClientError {
  constructor(message: string = 'Request timeout') {
    super(message, 408, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

// Request configuration type
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  signal?: AbortSignal;
}

// Main API client class
class APIClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Add authorization header with bearer token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Make HTTP request with error handling and timeout
   */
  private async makeRequest<T = unknown>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, timeout = this.defaultTimeout, signal } = config;

    // Create abort controller for timeout if no signal provided
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const requestSignal = signal || controller.signal;

    try {
      // Prepare URL
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

      // Prepare headers
      const requestHeaders = {
        ...this.defaultHeaders,
        ...headers,
      };

      // Prepare body
      let requestBody: string | FormData | undefined;
      if (body) {
        if (body instanceof FormData) {
          requestBody = body;
          // Remove content-type header for FormData (browser will set it with boundary)
          delete requestHeaders['Content-Type'];
        } else {
          requestBody = JSON.stringify(body);
        }
      }

      // Make request
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal: requestSignal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      if (!response.headers.get('Content-Type')?.includes('application/json')) {
        if (!response.ok) {
          throw new APIClientError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
          );
        }
        return (await response.text()) as T;
      }

      // Parse JSON response
      const data: APIResponse<T> = await response.json();

      // Handle API errors
      if (!response.ok || !data.success) {
        const error = data.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        };

        throw new APIClientError(error.message, response.status, error.code, error.details);
      }

      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError();
      }

      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new NetworkError();
      }

      // Re-throw API errors
      if (error instanceof APIClientError) {
        throw error;
      }

      // Handle other errors
      throw new APIClientError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = unknown>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file(s) using FormData
   */
  async upload<T = unknown>(
    endpoint: string,
    files: File | File[],
    additionalData?: Record<string, string>,
    config?: RequestConfig,
  ): Promise<T> {
    const formData = new FormData();

    // Add files
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    } else {
      formData.append('file', files);
    }

    // Add additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.makeRequest<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Get paginated results
   */
  async getPaginated<T = unknown>(
    endpoint: string,
    params?: {
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      [key: string]: any;
    },
    config?: RequestConfig,
  ): Promise<PaginatedResponse<T>> {
    // Build query string
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const url = searchParams.toString() ? `${endpoint}?${searchParams.toString()}` : endpoint;

    return this.makeRequest<PaginatedResponse<T>>(url, {
      ...config,
      method: 'GET',
    });
  }
}

// Create default client instance
export const apiClient = new APIClient();

// Typed API methods for specific endpoints
export const api = {
  // Auth endpoints
  auth: {
    me: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout'),
  },

  // User endpoints
  users: {
    getCurrent: () => apiClient.get('/users/me'),
    updateProfile: (data: any) => apiClient.patch('/users/me', data),
    updatePreferences: (data: any) => apiClient.patch('/users/me/preferences', data),
  },

  // Workspace endpoints
  workspaces: {
    getCurrent: () => apiClient.get('/workspaces/current'),
    update: (data: any) => apiClient.patch('/workspaces/current', data),
    getMembers: () => apiClient.get('/workspaces/current/members'),
  },

  // Agent endpoints
  agents: {
    list: (params?: any) => apiClient.getPaginated('/agents', params),
    get: (id: string) => apiClient.get(`/agents/${id}`),
    create: (data: any) => apiClient.post('/agents', data),
    update: (id: string, data: any) => apiClient.patch(`/agents/${id}`, data),
    delete: (id: string) => apiClient.delete(`/agents/${id}`),
    execute: (id: string, data?: any) => apiClient.post(`/agents/${id}/execute`, data),
    pause: (id: string) => apiClient.post(`/agents/${id}/pause`),
    resume: (id: string) => apiClient.post(`/agents/${id}/resume`),
    getMetrics: (id: string) => apiClient.get(`/agents/${id}/metrics`),
  },

  // Workflow endpoints
  workflows: {
    list: (params?: any) => apiClient.getPaginated('/workflows', params),
    get: (id: string) => apiClient.get(`/workflows/${id}`),
    create: (data: any) => apiClient.post('/workflows', data),
    update: (id: string, data: any) => apiClient.patch(`/workflows/${id}`, data),
    delete: (id: string) => apiClient.delete(`/workflows/${id}`),
    execute: (id: string, data?: any) => apiClient.post(`/workflows/${id}/execute`, data),
    getExecutions: (id: string, params?: any) =>
      apiClient.getPaginated(`/workflows/${id}/executions`, params),
  },

  // Prospect endpoints
  prospects: {
    list: (params?: any) => apiClient.getPaginated('/prospects', params),
    get: (id: string) => apiClient.get(`/prospects/${id}`),
    create: (data: any) => apiClient.post('/prospects', data),
    update: (id: string, data: any) => apiClient.patch(`/prospects/${id}`, data),
    delete: (id: string) => apiClient.delete(`/prospects/${id}`),
    enrich: (id: string) => apiClient.post(`/prospects/${id}/enrich`),
    bulkImport: (file: File) => apiClient.upload('/prospects/bulk-import', file),
  },

  // Email endpoints
  emails: {
    list: (params?: any) => apiClient.getPaginated('/emails', params),
    get: (id: string) => apiClient.get(`/emails/${id}`),
    create: (data: any) => apiClient.post('/emails', data),
    update: (id: string, data: any) => apiClient.patch(`/emails/${id}`, data),
    delete: (id: string) => apiClient.delete(`/emails/${id}`),
    approve: (id: string) => apiClient.post(`/emails/${id}/approve`),
    reject: (id: string) => apiClient.post(`/emails/${id}/reject`),
    send: (id: string) => apiClient.post(`/emails/${id}/send`),
    getReview: () => apiClient.getPaginated('/emails/review'),
  },

  // Notification endpoints
  notifications: {
    list: (params?: any) => apiClient.getPaginated('/notifications', params),
    markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    markAllRead: () => apiClient.post('/notifications/mark-all-read'),
    delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  },

  // Integration endpoints
  integrations: {
    list: () => apiClient.get('/integrations'),
    get: (id: string) => apiClient.get(`/integrations/${id}`),
    connect: (type: string, data: any) => apiClient.post(`/integrations/${type}/connect`, data),
    disconnect: (id: string) => apiClient.post(`/integrations/${id}/disconnect`),
    sync: (id: string) => apiClient.post(`/integrations/${id}/sync`),
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => apiClient.get('/dashboard/stats'),
    getRecentActivity: () => apiClient.get('/dashboard/activity'),
    getCharts: (timeRange?: string) =>
      apiClient.get(`/dashboard/charts?timeRange=${timeRange || '7d'}`),
  },

  // Health check
  health: () => apiClient.get('/health'),
};

export default apiClient;
