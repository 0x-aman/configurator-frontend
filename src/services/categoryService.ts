import { apiClient } from "@/lib/api-client";
import { ConfigCategory } from "@/types/configurator";

export interface CreateCategoryInput {
  token: string;
  name: string;
  categoryType?: string;
  description?: string;
  isPrimary?: boolean;
  isRequired?: boolean;
  orderIndex?: number;
  configuratorId: string;
}

export interface UpdateCategoryInput {
  token: string;
  id: string;
  name?: string;
  categoryType?: string;
  description?: string;
  isPrimary?: boolean;
  isRequired?: boolean;
  orderIndex?: number;
  isActive?: boolean;
}

export const categoryService = {
  async create(input: CreateCategoryInput) {
    return apiClient.post<ConfigCategory>("/api/category/create", input);
  },

  async list(configuratorId: string) {
    return apiClient.get<ConfigCategory[]>(
      `/api/category/list?configuratorId=${encodeURIComponent(configuratorId)}`
    );
  },

  async update(input: UpdateCategoryInput) {
    return apiClient.post<ConfigCategory>("/api/category/update", input);
  },

  // Soft delete via update if backend has no delete route
  async delete(id: string, token: string) {
    return apiClient.post<ConfigCategory>("/api/category/delete", {
      id,
      token,
      isActive: false,
    });
  },
};
