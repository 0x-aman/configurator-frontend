import { useEffect, useState } from "react";

/**
 * Handles authentication & context info for configurator embeds.
 * Extracts admin token (for admin mode) and public keys (for embeds)
 * from the URL, stores admin data in sessionStorage.
 */
export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Admin preview mode
    const urlToken = params.get("token");
    const urlAdmin = params.get("admin") === "true";

    // Embed identifiers
    const urlPublicKey = params.get("publicKey");
    const urlPublicId = params.get("publicId");

    // Store admin session if present
    if (urlToken && urlAdmin) {
      sessionStorage.setItem("adminToken", urlToken);
      sessionStorage.setItem("adminMode", "true");

      // Clean the URL (remove admin params)
      params.delete("token");
      params.delete("admin");
      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", newUrl);
    }

    // Retrieve any existing admin session
    const storedToken = sessionStorage.getItem("adminToken");
    const storedMode = sessionStorage.getItem("adminMode") === "true";

    setToken(storedToken);
    setIsAdminMode(storedMode);

    // Set the embed keys
    setPublicKey(urlPublicKey);
    setPublicId(urlPublicId);
  }, []);

  function clearToken() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminMode");
    setToken(null);
    setIsAdminMode(false);
  }

  return { token, publicKey, publicId, isAdminMode, clearToken };
}
