import { apiClient } from '@/lib/api-client';
import {
  ApiResponse,
  EmailTemplate,
  EmailPreviewInput,
  EmailPreviewResponse,
  SendEmailInput,
  SendEmailResponse,
} from '@/types/api';

/**
 * Email Service
 * Handles all email-related API calls
 */
export const emailService = {
  /**
   * Preview email with template or custom content
   */
  async preview(input: EmailPreviewInput): Promise<ApiResponse<EmailPreviewResponse>> {
    return apiClient.post<EmailPreviewResponse>('/api/email/preview', input);
  },

  /**
   * List email templates (requires token)
   */
  async listTemplates(
    token: string,
    type?: EmailTemplate['templateType']
  ): Promise<ApiResponse<EmailTemplate[]>> {
    const endpoint = type
      ? `/api/email/templates?type=${encodeURIComponent(type)}`
      : '/api/email/templates';

    return apiClient.get<EmailTemplate[]>(endpoint, {
      data: { token },
    });
  },

  /**
   * Send email (requires token)
   */
  async send(input: SendEmailInput): Promise<ApiResponse<SendEmailResponse>> {
    return apiClient.post<SendEmailResponse>('/api/email/send', input);
  },
};