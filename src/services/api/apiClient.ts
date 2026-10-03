/**
 * Production-ready API Client
 * Configured with configurable baseUrl, auth interceptors, and typed response wrappers.
 * Ready for backend connectivity (Express, FastAPI, Django, NestJS, etc.)
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiClient {
  private static token: string | null = null;

  public static setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('erp_auth_token', token);
    } else {
      localStorage.removeItem('erp_auth_token');
    }
  }

  public static getAuthToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('erp_auth_token');
    }
    return this.token;
  }

  public static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } catch {
          // ignore json parse error
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      // In development or when backend is not yet spun up, fallback gracefully
      console.warn(`[ApiClient] Request to ${endpoint} failed or offline:`, error.message);
      throw error;
    }
  }

  public static get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public static post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static put<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static patch<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
