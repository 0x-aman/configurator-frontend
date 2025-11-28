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

/* -------------------------------------------------------
   ACTION TYPES
------------------------------------------------------- */
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

/* -------------------------------------------------------
   NORMALIZER — ensures category.options ALWAYS exists
------------------------------------------------------- */
function normalizeCategory(cat: ConfigCategory): ConfigCategory {
  return {
    ...cat,
    options: Array.isArray(cat.options) ? cat.options : [],
  };
}

/* -------------------------------------------------------
   REDUCER
------------------------------------------------------- */
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
      return { ...state, isAdminMode: !state.isAdminMode };

    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.categories.map(normalizeCategory),
      };

    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, normalizeCategory(action.category)],
      };

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.category.id
            ? normalizeCategory(action.category)
            : cat
        ),
      };

    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter(
          (cat) => cat.id !== action.categoryId
        ),
      };

    case "ADD_OPTION":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.categoryId
            ? {
                ...cat,
                options: [...cat.options, action.option],
              }
            : cat
        ),
      };

    case "UPDATE_OPTION":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.categoryId
            ? {
                ...cat,
                options: cat.options.map((opt) =>
                  opt.id === action.option.id ? action.option : opt
                ),
              }
            : cat
        ),
      };

    case "DELETE_OPTION":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.categoryId
            ? {
                ...cat,
                options: cat.options.filter(
                  (opt) => opt.id !== action.optionId
                ),
              }
            : cat
        ),
      };

    case "RESTORE_CONFIG":
      return { ...state, selectedConfig: action.config };

    default:
      return state;
  }
}

/* -------------------------------------------------------
   HOOK
------------------------------------------------------- */
export function useConfiguration(apiCategories: ConfigCategory[]) {
  const { token } = useAuthToken();

  const initialCategories = apiCategories.map(normalizeCategory);

  const initialSelectedConfig = Object.fromEntries(
    initialCategories.map((cat) => {
      // If primary: pick default, or fallback option
      if (cat.isPrimary) {
        const defaultOpt = cat.options.find((opt) => opt.isDefault);
        return [cat.id, defaultOpt?.id || cat.options[0]?.id || ""];
      }

      // Default: pick a free option if exists
      const freeOpt = cat.options.find((opt) => opt.price === 0);
      return [cat.id, freeOpt?.id || ""];
    })
  );

  const [state, dispatch] = useReducer(configReducer, {
    categories: initialCategories,
    selectedConfig: initialSelectedConfig,
    isAdminMode: false,
  });

  /* -------------------------------------------------------
     SYNC API DATA INTO REDUCER
  ------------------------------------------------------- */
  useEffect(() => {
    if (apiCategories.length > 0) {
      dispatch({
        type: "SET_CATEGORIES",
        categories: apiCategories.map(normalizeCategory),
      });
    }
  }, [apiCategories]);

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */
  const calculateTotal = () => {
    return state.categories.reduce((total, cat) => {
      const optId = state.selectedConfig[cat.id];
      const opt = cat.options.find((o) => o.id === optId);
      return total + (Number(opt?.price) || 0);
    }, 0);
  };

  const validateAndAdjustSelections = (
    selectedConfig: Record<string, string>,
    categories: ConfigCategory[]
  ) => {
    let corrected = false;

    categories.forEach((category) => {
      const selectedOptionId = selectedConfig[category.id];
      if (!selectedOptionId) return;

      const selectedOption = category.options.find(
        (opt) => opt.id === selectedOptionId
      );
      if (!selectedOption) return;

      const conflict = Object.entries(selectedConfig).some(
        ([otherId, otherOptionId]) => {
          if (!otherOptionId || otherId === category.id) return false;

          const otherCategory = categories.find((c) => c.id === otherId);
          const otherOption = otherCategory?.options.find(
            (opt) => opt.id === otherOptionId
          );

          if (!otherOption) return false;

          return areIncompatible(selectedOption, otherOption);
        }
      );

      if (conflict) {
        dispatch({
          type: "SELECT_OPTION",
          categoryId: category.id,
          optionId: "",
        });
        corrected = true;
      }
    });

    if (corrected) {
      toast({
        title: "Incompatible selections adjusted",
        description: "Some selections were cleared due to conflict rules.",
      });
    }
  };

  /* -------------------------------------------------------
     MUTATIONS
  ------------------------------------------------------- */

  const onAddCategory = async (
    category: ConfigCategory
  ): Promise<ConfigCategory | null> => {
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
        const createdCategory = normalizeCategory(response.data);
        dispatch({
          type: "ADD_CATEGORY",
          category: createdCategory,
        });

        toast({
          title: "Category added",
          description: `"${category.name}" created successfully.`,
        });

        return createdCategory;
      }
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
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
        dispatch({
          type: "UPDATE_CATEGORY",
          category: normalizeCategory(category),
        });

        toast({
          title: "Category updated",
          description: `"${category.name}" updated successfully.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update category.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onAddOption = async (
    categoryId: string,
    option: ConfigOption
  ): Promise<{ success: boolean; isLimitError?: boolean }> => {
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
        incompatibleWith: option.incompatibleWith,
      });

      if (response.success && response.data) {
        dispatch({
          type: "ADD_OPTION",
          categoryId,
          option: response.data,
        });

        const updatedCategories = state.categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, options: [...cat.options, response.data] }
            : cat
        );

        validateAndAdjustSelections(state.selectedConfig, updatedCategories);

        toast({
          title: "Option added",
          description: `"${option.label}" created successfully.`,
        });

        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      // Check for 403 status code indicating limit reached
      if (
        error?.response?.status === 403 ||
        error?.message?.toLowerCase().includes("limit")
      ) {
        return { success: false, isLimitError: true };
      }

      const errorMessage =
        error instanceof Error ? error.message : "Failed to create option.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false };
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
        dispatch({
          type: "UPDATE_OPTION",
          categoryId,
          option,
        });

        const updatedCategories = state.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                options: cat.options.map((o) =>
                  o.id === option.id ? option : o
                ),
              }
            : cat
        );

        validateAndAdjustSelections(state.selectedConfig, updatedCategories);

        toast({
          title: "Option updated",
          description: `"${option.label}" updated successfully.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update option.";
      toast({
        title: "Error",
        description: errorMessage,
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

        toast({
          title: "Category deleted",
          description: `"${category?.name ?? "Category"}" deleted.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete category.";
      toast({
        title: "Error",
        description: errorMessage,
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

        toast({
          title: "Option deleted",
          description: `"${option?.label ?? "Option"}" deleted.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete option.";
      toast({
        title: "Error",
        description: errorMessage,
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
