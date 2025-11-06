import { apiClient, ApiResponse } from '@/lib/api-client';
import { ConfigCategory } from '@/types/configurator';

export interface ConfiguratorData {
  id: string;
  publicId: string;
  name: string;
  description?: string;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
  isPublished: boolean;
  categories?: ConfigCategory[];
}

export interface CreateConfiguratorInput {
  token: string;
  name: string;
  description?: string;
  currency?: string;
  currencySymbol?: string;
  isActive?: boolean;
  isPublished?: boolean;
}

export interface UpdateConfiguratorInput {
  token: string;
  id: string;
  name?: string;
  description?: string;
  currency?: string;
  currencySymbol?: string;
  isActive?: boolean;
  isPublished?: boolean;
}

export const configuratorService = {
  async getByPublicId(publicId: string) {
    return apiClient.get<ConfiguratorData>(`/api/configurator/${publicId}`);
  },

  async list() {
    return apiClient.get<ConfiguratorData[]>('/api/configurator/list');
  },

  async create(input: CreateConfiguratorInput) {
    return apiClient.post<ConfiguratorData>('/api/configurator/create', input);
  },

  async update(input: UpdateConfiguratorInput) {
    return apiClient.post<ConfiguratorData>('/api/configurator/update', input);
  },

  async delete(id: string, token: string) {
    return apiClient.post<unknown>('/api/configurator/delete', { id, token });
  },

  async duplicate(id: string, token: string) {
    return apiClient.post<ConfiguratorData>('/api/configurator/duplicate', { id, token });
  },

  async verifyEditToken(token: string) {
    return apiClient.post<{ valid: boolean; publicId: string }>(
      '/api/configurator/verify-edit-token',
      { token }
    );
  },

  async generateEditToken(id: string) {
    return apiClient.post<{ token: string }>('/api/configurator/generate-edit-token', { id });
  },
};