import { ConfigOption, ConfigCategory } from "@/types/configurator";

/**
 * Checks if two options are mutually incompatible based on their IDs
 * Checks the incompatibleWith array in both options for bidirectional compatibility
 */
export const areIncompatible = (
  optionA: ConfigOption,
  optionB: ConfigOption
): boolean => {
  if (!optionA || !optionB) return false;

  // Check if optionA has optionB in its incompatibleWith list
  const aIncompatibleWithB = optionA.incompatibleWith?.some(
    (incomp) => incomp.incompatibleOptionId === optionB.id
  );

  // Check if optionB has optionA in its incompatibleWith list (bidirectional check)
  const bIncompatibleWithA = optionB.incompatibleWith?.some(
    (incomp) => incomp.incompatibleOptionId === optionA.id
  );

  return !!(aIncompatibleWithB || bIncompatibleWithA);
};

/**
 * Checks if an option is incompatible with any currently selected options
 */
export const isOptionIncompatibleWithSelection = (
  option: ConfigOption,
  selectedConfig: Record<string, string>,
  categories: ConfigCategory[]
): boolean => {
  // Get all selected option IDs (filter out empty strings)
  const selectedOptionIds = Object.values(selectedConfig).filter(Boolean);

  // Check if this option is incompatible with any selected option
  return selectedOptionIds.some((selectedOptionId) => {
    // Find the selected option in all categories
    for (const category of categories) {
      const selectedOption = category.options?.find(
        (opt) => opt.id === selectedOptionId
      );
      if (selectedOption) {
        // Use bidirectional incompatibility check
        return areIncompatible(option, selectedOption);
      }
    }
    return false;
  });
};

/**
 * Gets all option IDs that are incompatible with a given option
 */
export const getIncompatibleOptionIds = (option: ConfigOption): string[] => {
  if (!option.incompatibleWith || option.incompatibleWith.length === 0) {
    return [];
  }
  
  return option.incompatibleWith.map((incomp) => incomp.incompatibleOptionId);
};
