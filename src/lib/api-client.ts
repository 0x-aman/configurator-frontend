import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      withCredentials: false,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For endpoints that require token in body, caller should include it in data
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.instance.get<ApiResponse<T>>(endpoint, config);
    return res.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.instance.post<ApiResponse<T>>(endpoint, data, config);
    return res.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.instance.put<ApiResponse<T>>(endpoint, data, config);
    return res.data;
  }

  async del<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    // Some routes use POST for delete; prefer del only for true DELETE
    const res = await this.instance.delete<ApiResponse<T>>(endpoint, { data, ...(config || {}) });
    return res.data;
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const res = await this.instance.post<ApiResponse<T>>(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
}

export const apiClient = new ApiClient();