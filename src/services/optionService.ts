import { apiClient } from '@/lib/api-client';
import { ApiResponse, Option, CreateOptionInput, UpdateOptionInput } from '@/types/api';

/**
 * Option Service
 * Handles all option-related API calls
 */
export const optionService = {
  /**
   * Create a new option (requires token)
   */
  async create(input: CreateOptionInput): Promise<ApiResponse<Option>> {
    return apiClient.post<Option>('/api/option/create', input);
  },

  /**
   * List options for a category (public endpoint)
   */
  async list(categoryId: string): Promise<ApiResponse<Option[]>> {
    return apiClient.get<Option[]>(
      `/api/option/list?categoryId=${encodeURIComponent(categoryId)}`
    );
  },

  /**
   * Update option (requires token)
   */
  async update(input: UpdateOptionInput): Promise<ApiResponse<Option>> {
    return apiClient.put<Option>('/api/option/update', input);
  },

  /**
   * Delete option (requires token)
   */
  async delete(id: string, token: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(
      `/api/option/update?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`
    );
  },
};