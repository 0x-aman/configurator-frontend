import { useQuery } from "@tanstack/react-query";
import { configuratorService } from "@/services/configuratorService";
import { ConfigCategory } from "@/types/configurator";
import { ConfiguratorData } from "@/services/configuratorService";

interface ConfiguratorQueryResult {
  categories: ConfigCategory[];
  configuratorFound: boolean;
  configurator?: ConfiguratorData;
  errorMessage?: string;
}

export function useConfiguratorData(
  apiKey: string | null,
  publicKey: string | null
) {
  const { data, isLoading, error } = useQuery<ConfiguratorQueryResult>({
    queryKey: ["configurator", apiKey],
    queryFn: async () => {
      if (!apiKey) {
        return { categories: [], configuratorFound: false };
      }

      const resp = await configuratorService.getByPublicId(apiKey, publicKey);

      if (resp.success && resp.data) {
        return {
          categories: (resp.data.categories as ConfigCategory[]) || [],
          configuratorFound: true,
          configurator: resp.data,
          id: resp.data.publicId,
        };
      }
      console.log(resp, "resp");
      // If API returned an error, pass its message back so the UI can display it
      return {
        categories: [],
        configuratorFound: false,
        errorMessage: resp.message,
      };
    },
    enabled: !!apiKey,
  });

  return {
    categories: data?.categories ?? [],
    configuratorFound: data?.configuratorFound ?? false,
    configurator: data?.configurator,
    errorMessage: data?.errorMessage,
    isLoading,
    error,
  };
}
