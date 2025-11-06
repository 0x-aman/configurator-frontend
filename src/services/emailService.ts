import { apiClient } from '@/lib/api-client';

export interface EmailTemplate {
  templateKey: string;
  subject: string;
  html?: string;
  text?: string;
}

export const emailService = {
  async list() {
    return apiClient.get<EmailTemplate[]>('/api/email/templates');
  },

  async upsert(template: EmailTemplate, token: string) {
    return apiClient.post('/api/email/templates', { ...template, token });
  },

  async preview(templateKey: string, data: any) {
    return apiClient.post<string>('/api/email/preview', { templateKey, data });
  },

  async send(templateKey: string, to: string, data: any) {
    return apiClient.post('/api/email/send', { templateKey, to, data });
  },
};