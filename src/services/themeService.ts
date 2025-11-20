import { apiClient } from '@/lib/api-client';
import { ApiResponse, Theme, CreateThemeInput, UpdateThemeInput } from '@/types/api';

/**
 * Theme Service
 * Handles all theme-related API calls
 * Replaces localStorage-based implementation with real API calls
 */
export const themeService = {
  /**
   * Create a new theme (requires token)
   */
  async create(input: CreateThemeInput): Promise<ApiResponse<Theme>> {
    return apiClient.post<Theme>('/api/theme/create', input);
  },

  /**
   * List all themes (requires token)
   */
  async list(token: string): Promise<ApiResponse<Theme[]>> {
    return apiClient.get<Theme[]>('/api/theme/list', {
      data: { token },
    });
  },

  /**
   * Update theme (requires token)
   */
  async update(input: UpdateThemeInput): Promise<ApiResponse<Theme>> {
    return apiClient.put<Theme>('/api/theme/update', input);
  },

  /**
   * Delete theme (requires token)
   */
  async delete(id: string, token: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(
      `/api/theme/update?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`
    );
  },

  /**
   * Get active theme (convenience method)
   */
  async getActiveTheme(token: string): Promise<Theme | null> {
    const response = await this.list(token);
    if (response.success && response.data) {
      const activeTheme = response.data.find((t) => t.isActive);
      return activeTheme || response.data[0] || null;
    }
    return null;
  },
};