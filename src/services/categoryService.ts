import { apiClient } from '@/lib/api-client';
import { ApiResponse, Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/api';

/**
 * Category Service
 * Handles all category-related API calls
 */
export const categoryService = {
  /**
   * Create a new category (requires token)
   */
  async create(input: CreateCategoryInput): Promise<ApiResponse<Category>> {
    return apiClient.post<Category>('/api/category/create', input);
  },

  /**
   * List categories for a configurator (public endpoint)
   */
  async list(configuratorId: string): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>(
      `/api/category/list?configuratorId=${encodeURIComponent(configuratorId)}`
    );
  },

  /**
   * Update category (requires token)
   */
  async update(input: UpdateCategoryInput): Promise<ApiResponse<Category>> {
    return apiClient.put<Category>('/api/category/update', input);
  },

  /**
   * Delete category (requires token)
   */
  async delete(id: string, token: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(
      `/api/category/update?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`
    );
  },
};