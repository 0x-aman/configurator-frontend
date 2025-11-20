import { useQuery } from "@tanstack/react-query";
import { configuratorService } from "@/services/configuratorService";
import { Configurator, Category } from "@/types/api";
import { getErrorMessage } from "@/lib/api-client";

interface ConfiguratorQueryResult {
  categories: Category[];
  configuratorFound: boolean;
  configurator?: Configurator;
  configuratorId?: string;
}

/**
 * Hook to fetch configurator data
 * Requires both publicId and publicKey for public mode
 */
export function useConfiguratorData(
  publicId: string | null,
  publicKey: string | null
) {
  const { data, isLoading, error, refetch } = useQuery<ConfiguratorQueryResult>(
    {
      queryKey: ["configurator", publicId, publicKey],
      queryFn: async () => {
        if (!publicId || !publicKey) {
          return { categories: [], configuratorFound: false };
        }

        try {
          const response = await configuratorService.getByPublicId(
            publicId,
            publicKey
          );

          if (response.success && response.data) {
            return {
              categories: response.data.categories || [],
              configuratorFound: true,
              configurator: response.data,
              configuratorId: response.data.id,
            };
          }

          return { categories: [], configuratorFound: false };
        } catch (err) {
          const errorMessage = getErrorMessage(err);
          console.error("[Configurator Data Error]", errorMessage);
          throw err;
        }
      },
      enabled: !!publicId && !!publicKey,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    }
  );

  return {
    categories: data?.categories ?? [],
    configuratorFound: data?.configuratorFound ?? false,
    configurator: data?.configurator,
    configuratorId: data?.configuratorId,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
}
