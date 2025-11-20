import { useEffect, useState } from 'react';
import { initializeAuth, clearEditToken, clearPublicCredentials } from '@/lib/url-params';
import { apiClient } from '@/lib/api-client';

/**
 * Hook for managing authentication state
 * Handles both admin mode (token-based) and public mode (publicId/publicKey)
 */
export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Initialize authentication from URL parameters
    const auth = initializeAuth();

    if (auth.mode === 'admin' && auth.token) {
      setToken(auth.token);
      setIsAdminMode(true);
      setPublicId(null);
      setPublicKey(null);
    } else if (auth.mode === 'public' && auth.publicId && auth.publicKey) {
      setPublicId(auth.publicId);
      setPublicKey(auth.publicKey);
      setIsAdminMode(false);
      setToken(null);
      
      // Set public key in API client for authenticated requests
      apiClient.setPublicKey(auth.publicKey);
    } else {
      // No valid credentials
      setToken(null);
      setPublicId(null);
      setPublicKey(null);
      setIsAdminMode(false);
    }

    setIsInitialized(true);
  }, []);

  /**
   * Clear authentication and logout
   */
  function logout() {
    clearEditToken();
    clearPublicCredentials();
    apiClient.setPublicKey(null);
    setToken(null);
    setPublicId(null);
    setPublicKey(null);
    setIsAdminMode(false);
  }

  return {
    token,
    publicId,
    publicKey,
    isAdminMode,
    isInitialized,
    logout,
    // Legacy compatibility
    apiKey: publicId,
    clearToken: logout,
  };
}
