import { useState, useEffect } from "react";
import { configuratorService } from "@/services/configuratorService";

export function useAdminVerification(token: string, isAdminMode: boolean) {
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedPublicId, setVerifiedPublicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!isAdminMode || !token) {
        setIsVerified(false);
        setVerifiedPublicId(null);
        setIsLoading(false);
        return;
      }
      try {
        const resp = await configuratorService.verifyEditToken(token);
        if (resp.success && resp.data?.valid) {
          setIsVerified(true);
          setVerifiedPublicId(resp.data.publicId);
        } else {
          setIsVerified(false);
          setVerifiedPublicId(null);
          sessionStorage.removeItem("adminToken");
          sessionStorage.removeItem("adminMode");
        }
      } catch {
        setIsVerified(false);
        setVerifiedPublicId(null);
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, [token, isAdminMode]);

  return { isVerified, verifiedPublicId, isLoading };
}
