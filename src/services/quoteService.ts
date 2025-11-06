import { apiClient } from '@/lib/api-client';

export interface QuoteInput {
  configuratorId: string;
  selections: Array<{ categoryId: string; optionId: string }>;
  clientInfo: { name: string; email: string; phone?: string };
  total: number;
  meta?: any;
}

export const quoteService = {
  async create(input: QuoteInput) {
    return apiClient.post<{ quoteCode: string }>('/api/quote/create', input);
  },

  async list(configuratorId?: string) {
    const suffix = configuratorId ? `?configuratorId=${encodeURIComponent(configuratorId)}` : '';
    return apiClient.get('/api/quote/list' + suffix);
  },

  async getByCode(quoteCode: string) {
    return apiClient.get(`/api/quote/${encodeURIComponent(quoteCode)}`);
  },

  async update(id: string, data: any, token: string) {
    return apiClient.post('/api/quote/update', { id, token, ...data });
  },
};