import { apiClient } from "@/lib/api-client";
import { getParentOrigin } from "@/lib/embed-origin";
import {
  ApiResponse,
  Quote,
  CreateQuoteInput,
  UpdateQuoteInput,
} from "@/types/api";
const origin = getParentOrigin();

/**
 * Quote Service
 * Handles all quote-related API calls
 */
export const quoteService = {
  /**
   * Create a new quote (public endpoint)
   * Requires X-Public-Key header (optional param)
   */
  async create(
    input: CreateQuoteInput,
    publicKey: string
  ): Promise<ApiResponse<Quote>> {
    const config: Record<string, any> = {};
    config.headers = {
      "X-Public-Key": publicKey,
      "X-Embed-Origin": origin,
    };
    return apiClient.post<Quote>("/api/quote/create", input, config);
  },

  /**
   * List quotes (requires token)
   */
  async list(
    token: string,
    filters?: {
      status?: Quote["status"];
      configuratorId?: string;
    }
  ): Promise<ApiResponse<Quote[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.configuratorId)
      params.append("configuratorId", filters.configuratorId);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/api/quote/list?${queryString}`
      : "/api/quote/list";

    return apiClient.get<Quote[]>(endpoint, {
      data: { token },
    });
  },

  /**
   * Get quote by code (public endpoint)
   */
  async getByCode(quoteCode: string): Promise<ApiResponse<Quote>> {
    return apiClient.get<Quote>(`/api/quote/${encodeURIComponent(quoteCode)}`);
  },

  /**
   * Update quote (requires token)
   */
  async update(input: UpdateQuoteInput): Promise<ApiResponse<Quote>> {
    return apiClient.put<Quote>("/api/quote/update", input);
  },
};
