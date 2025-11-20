import { apiClient } from '@/lib/api-client';
import { ApiResponse, UsageAnalytics, PerformanceMetrics } from '@/types/api';

/**
 * Analytics Service
 * Handles analytics and metrics
 */
export const analyticsService = {
  /**
   * Get usage analytics (requires token)
   */
  async getUsageAnalytics(
    token: string,
    filters?: {
      configuratorId?: string;
      from?: string; // ISO date string
      to?: string; // ISO date string
    }
  ): Promise<ApiResponse<UsageAnalytics>> {
    const params = new URLSearchParams();
    if (filters?.configuratorId) params.append('configuratorId', filters.configuratorId);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/api/analytics/usage?${queryString}`
      : '/api/analytics/usage';

    return apiClient.get<UsageAnalytics>(endpoint, {
      data: { token },
    });
  },

  /**
   * Get performance metrics (requires token)
   */
  async getPerformanceMetrics(
    token: string,
    configuratorId?: string
  ): Promise<ApiResponse<PerformanceMetrics>> {
    const endpoint = configuratorId
      ? `/api/analytics/performance?configuratorId=${encodeURIComponent(configuratorId)}`
      : '/api/analytics/performance';

    return apiClient.get<PerformanceMetrics>(endpoint, {
      data: { token },
    });
  },
};
