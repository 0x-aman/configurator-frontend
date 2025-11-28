import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { ApiResponse, ApiError, ApiErrorCode } from "@/types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  code: ApiErrorCode;
  statusCode?: number;

  constructor(message: string, code: ApiErrorCode, statusCode?: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Enhanced API Client with proper error handling, type safety, and token management
 */
export class ApiClient {
  private instance: AxiosInstance;
  private publicKey: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor for consistent error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Set public key for authenticated requests
   */
  setPublicKey(key: string | null) {
    this.publicKey = key;
  }

  /**
   * Get public key
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: AxiosError<ApiError>): ApiClientError {
    if (error.response) {
      const { data, status } = error.response;
      const errorMessage = data?.error || error.message || "An error occurred";
      const errorCode =
        (data?.code as ApiErrorCode) || this.getErrorCodeFromStatus(status);

      console.error("[API Error]", {
        status,
        code: errorCode,
        message: errorMessage,
        url: error.config?.url,
      });

      return new ApiClientError(errorMessage, errorCode, status);
    }

    if (error.request) {
      console.error("[Network Error]", error.message);
      return new ApiClientError(
        "Network error. Please check your connection.",
        "INTERNAL_ERROR"
      );
    }

    console.error("[Request Error]", error.message);
    return new ApiClientError(error.message, "INTERNAL_ERROR");
  }

  /**
   * Map HTTP status codes to API error codes
   */
  private getErrorCodeFromStatus(status: number): ApiErrorCode {
    switch (status) {
      case 400:
        return "VALIDATION_ERROR";
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      case 404:
        return "NOT_FOUND";
      case 429:
        return "LIMIT_EXCEEDED";
      case 500:
      default:
        return "INTERNAL_ERROR";
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const headers = this.buildHeaders(config?.headers);
    const response = await this.instance.get<ApiResponse<T>>(endpoint, {
      ...config,
      headers,
    });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const headers = this.buildHeaders(config?.headers);
    const response = await this.instance.post<ApiResponse<T>>(endpoint, data, {
      ...config,
      headers,
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const headers = this.buildHeaders(config?.headers);
    const response = await this.instance.put<ApiResponse<T>>(endpoint, data, {
      ...config,
      headers,
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const headers = this.buildHeaders(config?.headers);
    const response = await this.instance.delete<ApiResponse<T>>(endpoint, {
      ...config,
      headers,
    });
    return response.data;
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const headers = this.buildHeaders({
      ...config?.headers,
      "Content-Type": "multipart/form-data",
    });

    const response = await this.instance.post<ApiResponse<T>>(
      endpoint,
      formData,
      {
        ...config,
        headers,
      }
    );
    return response.data;
  }

  /**
   * Build request headers with public key if available
   */
  private buildHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    const headers: Record<string, string> = {
      ...customHeaders,
    };

    if (this.publicKey) {
      headers["X-Public-Key"] = this.publicKey;
    }

    return headers;
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Helper function to check if error is ApiClientError
export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

// Helper function to get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (isApiClientError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
