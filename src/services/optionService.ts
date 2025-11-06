import { apiClient } from "@/lib/api-client";
import { ConfigOption } from "@/types/configurator";

export interface CreateOptionInput {
  token: string;
  categoryId: string;
  label: string;
  price: number;
  description?: string;
  sku?: string;
  imageUrl?: string;
  isDefault?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  orderIndex?: number;
}

export interface UpdateOptionInput {
  token: string;
  id: string;
  label?: string;
  price?: number;
  description?: string;
  sku?: string;
  imageUrl?: string;
  isDefault?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  orderIndex?: number;
}

export const optionService = {
  async create(input: CreateOptionInput) {
    return apiClient.post<ConfigOption>("/api/option/create", input);
  },

  async list(categoryId: string) {
    return apiClient.get<ConfigOption[]>(
      `/api/option/list?categoryId=${encodeURIComponent(categoryId)}`
    );
  },

  async update(input: UpdateOptionInput) {
    return apiClient.put<ConfigOption>("/api/option/update", input);
  },

  async delete(id: string, token: string) {
    return apiClient.post<ConfigOption>("/api/option/update", {
      id,
      token,
      isActive: false,
    });
  },
};
