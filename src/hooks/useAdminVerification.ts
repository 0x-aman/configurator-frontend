import { useState, useEffect } from "react";
import { configuratorService } from "@/services/configuratorService";
import { clearEditToken } from "@/lib/url-params";
import { getErrorMessage } from "@/lib/api-client";

/**
 * Hook to verify admin token
 */
export function useAdminVerification(
  token: string | null,
  isAdminMode: boolean
) {
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedPublicId, setVerifiedPublicId] = useState<string | null>(null);
  const [verifiedPublicKey, setVerifiedPublicKey] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyToken() {
      // If not in admin mode or no token, skip verification
      if (!isAdminMode || !token) {
        setIsVerified(false);
        setVerifiedPublicId(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await configuratorService.verifyEditToken(token);

        if (response.success && response.data?.valid) {
          setIsVerified(true);
          setVerifiedPublicId(response.data.publicId);
          setVerifiedPublicKey(response.data.publicKey);
        } else {
          setIsVerified(false);
          setVerifiedPublicId(null);
          setError("Invalid or expired token");
          clearEditToken();
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        console.error("[Admin Verification Error]", errorMessage);
        setIsVerified(false);
        setVerifiedPublicId(null);
        setError(errorMessage);
        clearEditToken();
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [token, isAdminMode]);

  return { isVerified, verifiedPublicKey, verifiedPublicId, isLoading, error };
}
