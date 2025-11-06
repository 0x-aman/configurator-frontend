import { useReducer, useEffect } from "react";
import {
  ConfigState,
  ConfigCategory,
  ConfigOption,
} from "@/types/configurator";
import { toast } from "@/hooks/use-toast";
import { areIncompatible } from "@/utils/incompatibilityUtils";
import { categoryService } from "@/services/categoryService";
import { optionService } from "@/services/optionService";
import { useAuthToken } from "@/hooks/useAuthToken";

type Action =
  | { type: "SELECT_OPTION"; categoryId: string; optionId: string }
  | { type: "TOGGLE_ADMIN" }
  | { type: "ADD_CATEGORY"; category: ConfigCategory }
  | { type: "UPDATE_CATEGORY"; category: ConfigCategory }
  | { type: "DELETE_CATEGORY"; categoryId: string }
  | { type: "ADD_OPTION"; categoryId: string; option: ConfigOption }
  | { type: "UPDATE_OPTION"; categoryId: string; option: ConfigOption }
  | { type: "DELETE_OPTION"; categoryId: string; optionId: string }
  | { type: "RESTORE_CONFIG"; config: Record<string, string> }
  | { type: "SET_CATEGORIES"; categories: ConfigCategory[] };

function configReducer(state: ConfigState, action: Action): ConfigState {
  switch (action.type) {
    case "SELECT_OPTION":
      return {
        ...state,
        selectedConfig: {
          ...state.selectedConfig,
          [action.categoryId]: action.optionId,
        },
      };
    case "TOGGLE_ADMIN":
      return {
        ...state,
        isAdminMode: !state.isAdminMode,
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.category],
      };
    case "ADD_OPTION": {
      const categories = state.categories.map((cat) =>
        cat.id === action.categoryId
          ? { ...cat, options: [...cat.options, action.option] }
          : cat
      );
      return { ...state, categories };
    }
    case "UPDATE_OPTION": {
      const categories = state.categories.map((cat) =>
        cat.id === action.categoryId
          ? {
              ...cat,
              options: cat.options.map((opt) =>
                opt.id === action.option.id ? action.option : opt
              ),
            }
          : cat
      );
      return { ...state, categories };
    }
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.category.id ? action.category : cat
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter(
          (cat) => cat.id !== action.categoryId
        ),
      };
    case "DELETE_OPTION": {
      const categories = state.categories.map((cat) =>
        cat.id === action.categoryId
          ? {
              ...cat,
              options: cat.options.filter((opt) => opt.id !== action.optionId),
            }
          : cat
      );
      return { ...state, categories };
    }
    case "RESTORE_CONFIG":
      return { ...state, selectedConfig: action.config };
    case "SET_CATEGORIES":
      return { ...state, categories: action.categories };
    default:
      return state;
  }
}

export function useConfiguration(apiCategories: ConfigCategory[]) {
  const { token } = useAuthToken();
  const [state, dispatch] = useReducer(configReducer, {
    categories: apiCategories,
    selectedConfig: Object.fromEntries(
      apiCategories.map((cat) => {
        if (cat.isPrimary) {
          // Find the default option for primary categories
          const defaultOption = cat.options.find((opt) => opt.isDefault);
          return [cat.id, defaultOption?.id || cat.options[0]?.id || ""];
        }
        const freeOption = cat.options.find((opt) => opt.price === 0);
        if (freeOption) {
          return [cat.id, freeOption.id];
        }
        return [cat.id, ""];
      })
    ),
    isAdminMode: false,
  });

  // Update categories when API data changes
  useEffect(() => {
    if (apiCategories.length > 0) {
      dispatch({ type: "SET_CATEGORIES", categories: apiCategories });
    }
  }, [apiCategories]);

  const calculateTotal = () => {
    let total = 0;
    state.categories.forEach((category) => {
      const selectedOptionId = state.selectedConfig[category.id];
      const option = category.options?.find((o) => o.id === selectedOptionId);
      if (option) {
        const price = parseFloat(option.price.toString()) || 0; // ensure numeric
        total += price;
      }
    });
    return total;
  };

  const validateAndAdjustSelections = (
    selectedConfig: Record<string, string>,
    categories: ConfigCategory[]
  ) => {
    let hasConflict = false;

    categories.forEach((category) => {
      const selectedOptionId = selectedConfig[category.id];
      if (!selectedOptionId) return;

      const selectedOption = category.options?.find(
        (opt) => opt.id === selectedOptionId
      );
      if (!selectedOption) return;

      // Check mutual incompatibility with all other selected options
      const isIncompatible = Object.entries(selectedConfig).some(
        ([catId, otherOptionId]) => {
          if (!otherOptionId || catId === category.id) return false;

          // Find the other selected option
          const otherCategory = categories.find((c) => c.id === catId);
          const otherOption = otherCategory?.options.find(
            (opt) => opt.id === otherOptionId
          );

          if (!otherOption) return false;

          // Use mutual incompatibility check
          return areIncompatible(selectedOption, otherOption);
        }
      );

      if (isIncompatible) {
        dispatch({
          type: "SELECT_OPTION",
          categoryId: category.id,
          optionId: "",
        });
        hasConflict = true;
      }
    });

    if (hasConflict) {
      toast({
        title: "Incompatible selections adjusted",
        description:
          "Some selections were cleared due to mutual incompatibility rules.",
        variant: "default",
      });
    }
  };

  const onAddCategory = async (category: ConfigCategory) => {
    try {
      const response = await categoryService.create({
        token,
        configuratorId: category.configuratorId,
        name: category.name,
        categoryType: category.categoryType,
        description: category.description,
        isPrimary: category.isPrimary,
        isRequired: category.isRequired,
      });

      if (response.success && response.data) {
        dispatch({ type: "ADD_CATEGORY", category: response.data });
        toast({
          title: "Category added",
          description: `"${category.name}" has been created.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const onUpdateCategory = async (category: ConfigCategory) => {
    try {
      const response = await categoryService.update({
        id: category.id,
        token,
        name: category.name,
        categoryType: category.categoryType,
        description: category.description,
        isPrimary: category.isPrimary,
        isRequired: category.isRequired,
      });

      if (response.success) {
        dispatch({ type: "UPDATE_CATEGORY", category });
        toast({
          title: "Category updated",
          description: `"${category.name}" has been updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const onAddOption = async (categoryId: string, option: ConfigOption) => {
    try {
      const response = await optionService.create({
        token,
        categoryId,
        label: option.label,
        price: option.price,
        description: option.description,
        sku: option.sku,
        imageUrl: option.imageUrl,
        isDefault: option.isDefault,
      });

      if (response.success && response.data) {
        dispatch({ type: "ADD_OPTION", categoryId, option: response.data });

        const updatedCategories = state.categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, options: [...cat.options, response.data!] }
            : cat
        );
        validateAndAdjustSelections(state.selectedConfig, updatedCategories);

        toast({
          title: "Option added",
          description: `"${option.label}" has been created.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add option",
        variant: "destructive",
      });
    }
  };

  const onUpdateOption = async (categoryId: string, option: ConfigOption) => {
    try {
      const response = await optionService.update({
        id: option.id,
        token,
        label: option.label,
        price: option.price,
        description: option.description,
        sku: option.sku,
        imageUrl: option.imageUrl,
        isDefault: option.isDefault,
      });

      if (response.success) {
        dispatch({ type: "UPDATE_OPTION", categoryId, option });

        const updatedCategories = state.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                options: cat.options.map((opt) =>
                  opt.id === option.id ? option : opt
                ),
              }
            : cat
        );
        validateAndAdjustSelections(state.selectedConfig, updatedCategories);

        toast({
          title: "Option updated",
          description: `"${option.label}" has been updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update option",
        variant: "destructive",
      });
    }
  };

  const onDeleteCategory = async (categoryId: string) => {
    const category = state.categories.find((c) => c.id === categoryId);
    try {
      const response = await categoryService.delete(categoryId, token);

      if (response.success) {
        dispatch({ type: "DELETE_CATEGORY", categoryId });
        if (category) {
          toast({
            title: "Category deleted",
            description: `"${category.name}" has been removed.`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const onDeleteOption = async (categoryId: string, optionId: string) => {
    const category = state.categories.find((c) => c.id === categoryId);
    const option = category?.options.find((o) => o.id === optionId);
    try {
      const response = await optionService.delete(optionId, token);

      if (response.success) {
        dispatch({ type: "DELETE_OPTION", categoryId, optionId });
        if (option) {
          toast({
            title: "Option deleted",
            description: `"${option.label}" has been removed.`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete option",
        variant: "destructive",
      });
    }
  };

  return {
    state,
    dispatch,
    calculateTotal,
    onAddCategory,
    onUpdateCategory,
    onAddOption,
    onUpdateOption,
    onDeleteCategory,
    onDeleteOption,
  };
}
