import { apiClient } from "@/lib/api-client";
import { getParentOrigin } from "@/lib/embed-origin";
import {
  ApiResponse,
  Configurator,
  CreateConfiguratorInput,
  UpdateConfiguratorInput,
  EditToken,
  TokenVerification,
} from "@/types/api";

const origin = getParentOrigin();

/**
 * Configurator Service
 * Handles all configurator-related API calls
 */
export const configuratorService = {
  /**
   * Generate edit token for a configurator
   */
  async generateEditToken(
    configuratorId: string
  ): Promise<ApiResponse<EditToken>> {
    return apiClient.post<EditToken>("/api/configurator/generate-edit-token", {
      configuratorId,
    });
  },

  /**
   * Verify edit token
   */
  async verifyEditToken(
    token: string
  ): Promise<ApiResponse<TokenVerification>> {
    return apiClient.post<TokenVerification>(
      "/api/configurator/verify-edit-token",
      {
        token,
      }
    );
  },

  /**
   * Get configurator by public ID (public endpoint)
   * Requires publicKey in query params
   */
  async getByPublicId(
    publicId: string,
    publicKey: string
  ): Promise<ApiResponse<Configurator>> {
    return apiClient.get<Configurator>(
      `/api/configurator/${publicId}?publicKey=${encodeURIComponent(
        publicKey
      )}`,
      {
        headers: {
          "X-Embed-Origin": origin || "UNKNOWN",
        },
      }
    );
  },

  /**
   * List all configurators (requires token)
   */
  async list(token: string): Promise<ApiResponse<Configurator[]>> {
    return apiClient.get<Configurator[]>("/api/configurator/list", {
      data: { token },
    });
  },

  /**
   * Create configurator
   */
  async create(
    input: CreateConfiguratorInput
  ): Promise<ApiResponse<Configurator>> {
    return apiClient.post<Configurator>("/api/configurator/create", input);
  },

  /**
   * Update configurator
   */
  async update(
    input: UpdateConfiguratorInput
  ): Promise<ApiResponse<Configurator>> {
    return apiClient.put<Configurator>("/api/configurator/update", input);
  },

  /**
   * Delete configurator
   */
  async delete(id: string, token: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(
      `/api/configurator/delete?id=${encodeURIComponent(
        id
      )}&token=${encodeURIComponent(token)}`
    );
  },

  /**
   * Duplicate configurator
   */
  async duplicate(
    id: string,
    token: string
  ): Promise<ApiResponse<Configurator>> {
    return apiClient.post<Configurator>("/api/configurator/duplicate", {
      token,
      id,
    });
  },
};
