import { useQuery } from "@tanstack/react-query";
import { configuratorService } from "@/services/configuratorService";
import { ConfigCategory } from "@/types/configurator";
import { ConfiguratorData } from "@/services/configuratorService";

interface ConfiguratorQueryResult {
  categories: ConfigCategory[];
  configuratorFound: boolean;
  configurator?: ConfiguratorData;
}

export function useConfiguratorData(apiKey: string | null) {
  const { data, isLoading, error } = useQuery<ConfiguratorQueryResult>({
    queryKey: ["configurator", apiKey],
    queryFn: async () => {
      if (!apiKey) {
        return { categories: [], configuratorFound: false };
      }

      const resp = await configuratorService.getByPublicId(apiKey);

      if (resp.success && resp.data) {
        return {
          categories: (resp.data.categories as ConfigCategory[]) || [],
          configuratorFound: true,
          configurator: resp.data,
          id: resp.data.publicId,
        };
      }

      return { categories: [], configuratorFound: false };
    },
    enabled: !!apiKey,
  });

  return {
    categories: data?.categories ?? [],
    configuratorFound: data?.configuratorFound ?? false,
    configurator: data?.configurator,
    isLoading,
    error,
  };
}
