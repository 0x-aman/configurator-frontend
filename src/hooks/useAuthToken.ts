import { useEffect, useState } from "react";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlToken = params.get("token");
    const urlAdmin = params.get("admin") === "true";
    const urlApiKeyParam = params.get("apiKey") || null;

    // If token found in URL, store and strip from URL
    if (urlToken && urlAdmin) {
      sessionStorage.setItem("adminToken", urlToken);
      sessionStorage.setItem("adminMode", "true");

      params.delete("token");
      params.delete("admin");

      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");

      window.history.replaceState({}, "", newUrl);
    }

    const storedToken = sessionStorage.getItem("adminToken");
    const storedMode = sessionStorage.getItem("adminMode") === "true";

    setToken(storedToken);
    setIsAdminMode(storedMode);

    setApiKey(urlApiKeyParam);
  }, []);

  function clearToken() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminMode");
    setToken(null);
    setIsAdminMode(false);
  }

  return { token, apiKey, isAdminMode, clearToken };
}
