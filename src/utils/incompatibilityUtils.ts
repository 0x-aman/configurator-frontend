import { ConfigOption, ConfigCategory } from "@/types/configurator";
import { Incompatibility } from "@/types/incompatibility";

// Global incompatibilities map (set by configurator data)
let globalIncompatibilities: Incompatibility[] = [];

export const setIncompatibilities = (incompatibilities: Incompatibility[]) => {
  globalIncompatibilities = incompatibilities;
};

/**
 * Checks if two options are mutually incompatible based on their SKUs
 * Uses the global incompatibilities array from backend
 */
export const areIncompatible = (
  optionA: ConfigOption,
  optionB: ConfigOption
): boolean => {
  if (!optionA.sku || !optionB.sku) return false;

  return globalIncompatibilities.some(
    (incomp) =>
      (incomp.from === optionA.sku && incomp.to === optionB.sku) ||
      (incomp.from === optionB.sku && incomp.to === optionA.sku)
  );
};

/**
 * Checks if an option is incompatible with any currently selected options
 */
export const isOptionIncompatibleWithSelection = (
  option: ConfigOption,
  selectedConfig: Record<string, string>,
  categories: ConfigCategory[]
): boolean => {
  const selectedOptionIds = Object.values(selectedConfig).filter(Boolean);

  return selectedOptionIds.some((selectedOptionId) => {
    // Find the selected option in all categories
    for (const category of categories) {
      const selectedOption = category.options?.find(
        (opt) => opt.id === selectedOptionId
      );
      if (selectedOption) {
        return areIncompatible(option, selectedOption);
      }
    }
    return false;
  });
};
