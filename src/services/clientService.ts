import { apiClient } from '@/lib/api-client';
import { ApiResponse, Client, UpdateClientInput, UpdateDomainsInput } from '@/types/api';

/**
 * Client Service
 * Handles client profile and settings
 */
export const clientService = {
  /**
   * Get current client profile (requires token)
   */
  async getProfile(token: string): Promise<ApiResponse<Client>> {
    return apiClient.get<Client>('/api/client/me', {
      data: { token },
    });
  },

  /**
   * Update client profile (requires token)
   */
  async updateProfile(input: UpdateClientInput): Promise<ApiResponse<Client>> {
    return apiClient.put<Client>('/api/client/update', input);
  },

  /**
   * Get allowed domains (requires token)
   */
  async getDomains(token: string): Promise<ApiResponse<{ domains: string[] }>> {
    return apiClient.get<{ domains: string[] }>('/api/client/domains', {
      data: { token },
    });
  },

  /**
   * Update allowed domains (requires token)
   */
  async updateDomains(input: UpdateDomainsInput): Promise<ApiResponse<{ domains: string[] }>> {
    return apiClient.put<{ domains: string[] }>('/api/client/domains', input);
  },
};