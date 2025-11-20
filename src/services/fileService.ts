import { apiClient } from '@/lib/api-client';
import { ApiResponse, FileUpload, FileType, SignedUploadUrl } from '@/types/api';

/**
 * File Service
 * Handles all file-related API calls
 */
export const fileService = {
  /**
   * Upload file (requires token in FormData)
   */
  async upload(file: File, token: string): Promise<ApiResponse<FileUpload>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);

    return apiClient.upload<FileUpload>('/api/files/upload', formData);
  },

  /**
   * Get signed upload URL for direct upload (requires token)
   */
  async getSignedUploadUrl(
    filename: string,
    contentType: string,
    token: string
  ): Promise<ApiResponse<SignedUploadUrl>> {
    return apiClient.get<SignedUploadUrl>(
      `/api/files/upload?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`,
      {
        data: { token },
      }
    );
  },

  /**
   * List files (requires token)
   */
  async list(token: string, type?: FileType): Promise<ApiResponse<FileUpload[]>> {
    const endpoint = type
      ? `/api/files/list?type=${encodeURIComponent(type)}`
      : '/api/files/list';

    return apiClient.get<FileUpload[]>(endpoint, {
      data: { token },
    });
  },

  /**
   * Delete file (requires token)
   */
  async delete(id: string, token: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(
      `/api/files/delete?id=${encodeURIComponent(id)}`,
      {
        data: { token },
      }
    );
  },
};