import { apiClient } from '@/lib/api-client';

export interface UploadResponse {
  url: string;
  blobName: string;
  container: string;
}

export const fileService = {
  async upload(file: File, scope?: { configuratorId?: string; categoryId?: string; optionId?: string }) {
    const fd = new FormData();
    fd.append('file', file);
    if (scope?.configuratorId) fd.append('configuratorId', scope.configuratorId);
    if (scope?.categoryId) fd.append('categoryId', scope.categoryId);
    if (scope?.optionId) fd.append('optionId', scope.optionId);
    return apiClient.upload<UploadResponse>('/api/files/upload', fd);
  },

  async list(configuratorId?: string) {
    const suffix = configuratorId ? `?configuratorId=${encodeURIComponent(configuratorId)}` : '';
    return apiClient.get(`/api/files/list${suffix}`);
  },

  async delete(blobName: string, container: string) {
    return apiClient.post('/api/files/delete', { blobName, container });
  }
};