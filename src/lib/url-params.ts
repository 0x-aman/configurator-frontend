/**
 * URL Parameter Handling and Token Management
 * 
 * This module handles:
 * - Admin mode: Extract token from URL, store securely in sessionStorage
 * - Public mode: Extract publicId and publicKey from URL
 * - Secure token storage using sessionStorage for enhanced security
 */

const TOKEN_STORAGE_KEY = 'konfigra_edit_token';
const PUBLIC_ID_KEY = 'konfigra_public_id';
const PUBLIC_KEY_KEY = 'konfigra_public_key';

export interface UrlParams {
  admin: boolean;
  token: string | null;
  publicId: string | null;
  publicKey: string | null;
}

/**
 * Extract parameters from URL
 */
export function extractUrlParams(): UrlParams {
  const urlParams = new URLSearchParams(window.location.search);
  
  const admin = urlParams.get('admin') === 'true';
  const token = urlParams.get('token');
  const publicId = urlParams.get('publicId');
  const publicKey = urlParams.get('publicKey');

  return {
    admin,
    token,
    publicId,
    publicKey,
  };
}

/**
 * Store edit token securely in sessionStorage
 */
export function storeEditToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Failed to store edit token:', error);
  }
}

/**
 * Get stored edit token from sessionStorage
 */
export function getStoredEditToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to retrieve edit token:', error);
    return null;
  }
}

/**
 * Clear stored edit token from sessionStorage
 */
export function clearEditToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear edit token:', error);
  }
}

/**
 * Store public credentials in sessionStorage
 */
export function storePublicCredentials(publicId: string, publicKey: string): void {
  try {
    sessionStorage.setItem(PUBLIC_ID_KEY, publicId);
    sessionStorage.setItem(PUBLIC_KEY_KEY, publicKey);
  } catch (error) {
    console.error('Failed to store public credentials:', error);
  }
}

/**
 * Get stored public credentials from sessionStorage
 */
export function getStoredPublicCredentials(): { publicId: string | null; publicKey: string | null } {
  try {
    return {
      publicId: sessionStorage.getItem(PUBLIC_ID_KEY),
      publicKey: sessionStorage.getItem(PUBLIC_KEY_KEY),
    };
  } catch (error) {
    console.error('Failed to retrieve public credentials:', error);
    return { publicId: null, publicKey: null };
  }
}

/**
 * Clear public credentials from sessionStorage
 */
export function clearPublicCredentials(): void {
  try {
    sessionStorage.removeItem(PUBLIC_ID_KEY);
    sessionStorage.removeItem(PUBLIC_KEY_KEY);
  } catch (error) {
    console.error('Failed to clear public credentials:', error);
  }
}

/**
 * Sanitize URL by removing sensitive parameters
 * This prevents token/key exposure in browser history and logs
 */
export function sanitizeUrl(): void {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  let modified = false;

  // Remove sensitive parameters
  if (params.has('token')) {
    params.delete('token');
    modified = true;
  }

  if (params.has('publicKey')) {
    params.delete('publicKey');
    modified = true;
  }

  // Update URL without reloading if parameters were removed
  if (modified) {
    const newUrl = params.toString() 
      ? `${url.pathname}?${params.toString()}`
      : url.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * Initialize authentication from URL parameters
 * Returns the appropriate credentials based on mode (admin or public)
 */
export function initializeAuth(): {
  mode: 'admin' | 'public' | 'none';
  token: string | null;
  publicId: string | null;
  publicKey: string | null;
} {
  const urlParams = extractUrlParams();

  // Admin mode
  if (urlParams.admin && urlParams.token) {
    storeEditToken(urlParams.token);
    sanitizeUrl();
    return {
      mode: 'admin',
      token: urlParams.token,
      publicId: null,
      publicKey: null,
    };
  }

  // Check for stored admin token
  const storedToken = getStoredEditToken();
  if (storedToken) {
    return {
      mode: 'admin',
      token: storedToken,
      publicId: null,
      publicKey: null,
    };
  }

  // Public mode
  if (urlParams.publicId && urlParams.publicKey) {
    storePublicCredentials(urlParams.publicId, urlParams.publicKey);
    sanitizeUrl();
    return {
      mode: 'public',
      token: null,
      publicId: urlParams.publicId,
      publicKey: urlParams.publicKey,
    };
  }

  // Check for stored public credentials
  const storedCredentials = getStoredPublicCredentials();
  if (storedCredentials.publicId && storedCredentials.publicKey) {
    return {
      mode: 'public',
      token: null,
      publicId: storedCredentials.publicId,
      publicKey: storedCredentials.publicKey,
    };
  }

  return {
    mode: 'none',
    token: null,
    publicId: null,
    publicKey: null,
  };
}

/**
 * Logout - clear all stored credentials
 */
export function logout(): void {
  clearEditToken();
  clearPublicCredentials();
}
