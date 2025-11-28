import { ChevronDown, ChevronUp, Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ConfigCategory,
  SelectedConfig,
  ConfigOption,
} from "@/types/configurator";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { isOptionIncompatibleWithSelection } from "@/utils/incompatibilityUtils";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfigurationPanelProps {
  categories: ConfigCategory[];
  selectedConfig: SelectedConfig;
  onOptionSelect: (categoryId: string, optionId: string) => void;
  isAdminMode: boolean;
  onAddCategory: () => void;
  onEditCategory: (category: ConfigCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddOption: (categoryId: string) => void;
  onEditOption: (categoryId: string, option: ConfigOption) => void;
  onDeleteOption: (categoryId: string, optionId: string) => void;
}

export interface ConfigurationPanelRef {
  scrollToAndExpandCategory: (categoryId: string) => void;
}

export const ConfigurationPanel = forwardRef<
  ConfigurationPanelRef,
  ConfigurationPanelProps
>(
  (
    {
      categories,
      selectedConfig,
      onOptionSelect,
      isAdminMode,
      onAddCategory,
      onEditCategory,
      onDeleteCategory,
      onAddOption,
      onEditOption,
      onDeleteOption,
    },
    ref
  ) => {
    const { formatPrice } = useCurrency();
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
      new Set(categories.map((c) => c.id))
    );
    const [deleteDialog, setDeleteDialog] = useState<{
      type: "category" | "option";
      id: string;
      categoryId?: string;
      name: string;
    } | null>(null);

    const panelRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useImperativeHandle(ref, () => ({
      scrollToAndExpandCategory: (categoryId: string) => {
        // Expand the category
        setExpandedCategories((prev) => {
          const next = new Set(prev);
          next.add(categoryId);
          return next;
        });

        // Scroll to the category after a short delay to ensure DOM is updated
        setTimeout(() => {
          const categoryElement = categoryRefs.current[categoryId];
          if (categoryElement && panelRef.current) {
            categoryElement.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }, 100);
      },
    }));

    useEffect(() => {
      // Auto-select logic for primary and required categories
      categories.forEach((category) => {
        // Primary categories MUST always have a selection
        const mustSelect = category.isPrimary || category.isRequired;
        
        if (!mustSelect || !category.options?.length) return;

        const alreadySelected = selectedConfig[category.id];
        if (alreadySelected) return; // Skip if already selected

        // Priority order for auto-selection:
        // 1. Default option (marked with isDefault)
        const defaultOption = category.options?.find((o) => o.isDefault);

        // 2. Lowest-priced option
        const lowestPriceOption = [...category.options].sort(
          (a, b) => (a.price || 0) - (b.price || 0)
        )[0];

        // 3. Fallback to first option in list
        const fallbackOption = category.options[0];

        const optionToSelect =
          defaultOption || lowestPriceOption || fallbackOption;

        if (optionToSelect) {
          onOptionSelect(category.id, optionToSelect.id);
        }
      });
    }, [categories, selectedConfig, onOptionSelect]);

    const toggleCategory = (categoryId: string) => {
      setExpandedCategories((prev) => {
        const next = new Set(prev);
        if (next.has(categoryId)) {
          next.delete(categoryId);
        } else {
          next.add(categoryId);
        }
        return next;
      });
    };

    const isOptionDisabled = (
      optionId: string,
      categoryId: string
    ): boolean => {
      const option = categories
        .find((c) => c.id === categoryId)
        ?.options.find((o) => o.id === optionId);

      if (!option) return false;

      // Use mutual incompatibility check
      return isOptionIncompatibleWithSelection(
        option,
        selectedConfig,
        categories
      );
    };

    const handleDelete = () => {
      if (!deleteDialog) return;

      if (deleteDialog.type === "category") {
        onDeleteCategory(deleteDialog.id);
      } else {
        onDeleteOption(deleteDialog.categoryId!, deleteDialog.id);
      }
      setDeleteDialog(null);
    };

    // ensure categories stay expanded when categories prop updates
    useEffect(() => {
      setExpandedCategories(new Set(categories.map((c) => c.id)));
    }, [categories]);

    return (
      <div
        ref={panelRef}
        className="h-full overflow-y-auto bg-card config-panel"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Configuration Options
            </h2>
            {isAdminMode && (
              <Button
                onClick={onAddCategory}
                size="sm"
                variant="outline"
                className="add-category-btn"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {categories.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No configuration categories available</p>
                {isAdminMode && (
                  <p className="text-sm mt-2">
                    Click "Add Category" to create one
                  </p>
                )}
              </div>
            ) : (
              categories.map((category) => {
                const isExpanded = expandedCategories.has(category.id);
                const selectedOptionId = selectedConfig[category.id];

                return (
                  <Card
                    key={category.id}
                    ref={(el) => (categoryRefs.current[category.id] = el)}
                    className="border border-border"
                  >
                    <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex-1 flex items-center justify-between"
                      >
                        <span className="font-medium text-foreground">
                          {category.name}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {isAdminMode && (
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditCategory(category);
                            }}
                            className="p-1 hover:bg-primary/10 rounded transition-colors"
                            title="Edit category"
                          >
                            <Pencil className="h-3.5 w-3.5 text-primary" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({
                                type: "category",
                                id: category.id,
                                name: category.name,
                              });
                            }}
                            className="p-1 hover:bg-destructive/10 rounded transition-colors"
                            title="Delete category"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2">
                        {category.options?.map((option) => {
                          const isSelected = selectedOptionId === option.id;
                          const isDisabled = isOptionDisabled(
                            option.id,
                            category.id
                          );

                          return (
                            <div key={option.id} className="relative group">
                              <button
                                onClick={() => {
                                  if (isDisabled) return;
                                  
                                  // Prevent unselecting if this is primary category and it's the only selected option
                                  if (category.isPrimary && isSelected) {
                                    // Don't allow deselection of primary category
                                    return;
                                  }
                                  
                                  onOptionSelect(category.id, option.id);
                                }}
                                disabled={isDisabled}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                  isSelected
                                    ? "border-primary bg-accent"
                                    : isDisabled
                                    ? "border-muted bg-muted/20 opacity-50 cursor-not-allowed"
                                    : "border-border hover:border-primary/50 bg-card"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <span className="font-medium text-foreground">
                                    {option.label}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {isAdminMode && (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onEditOption(category.id, option);
                                          }}
                                          className="p-1 hover:bg-primary/10 rounded transition-colors"
                                          title="Edit option"
                                        >
                                          <Pencil className="h-3 w-3 text-primary" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteDialog({
                                              type: "option",
                                              id: option.id,
                                              categoryId: category.id,
                                              name: option.label,
                                            });
                                          }}
                                          className="p-1 hover:bg-destructive/10 rounded transition-colors"
                                          title="Delete option"
                                        >
                                          <Trash2 className="h-3 w-3 text-destructive" />
                                        </button>
                                      </>
                                    )}
                                    <span
                                      className={`font-semibold ${
                                        option.price === 0
                                          ? "text-success"
                                          : "text-foreground"
                                      }`}
                                    >
                                      {formatPrice(option.price)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {option.description}
                                </p>

                                {/* Display attribute values from category template */}
                                {category.attributesTemplate &&
                                  category.attributesTemplate.length > 0 &&
                                  option.attributeValues && (
                                    <div className="mt-2 space-y-1">
                                      {category.attributesTemplate.map(
                                        (attr) => {
                                          const value =
                                            option.attributeValues?.[attr.key];
                                          if (
                                            value === undefined ||
                                            value === null ||
                                            value === ""
                                          )
                                            return null;

                                          return (
                                            <div
                                              key={attr.key}
                                              className="text-xs text-muted-foreground"
                                            >
                                              <span className="font-medium">
                                                {attr.label}:
                                              </span>{" "}
                                              {attr.type === "boolean"
                                                ? value
                                                  ? "Yes"
                                                  : "No"
                                                : value}
                                              {attr.unit && ` ${attr.unit}`}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}

                                {/* Legacy attributes support */}
                                {option.attributes &&
                                  option.attributes.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {option.attributes.map((attr) => {
                                        const value = attr.value;
                                        if (
                                          value === undefined ||
                                          value === null ||
                                          value === ""
                                        )
                                          return null;

                                        return (
                                          <div
                                            key={attr.key}
                                            className="text-xs text-muted-foreground"
                                          >
                                            <span className="font-medium">
                                              {attr.label}:
                                            </span>{" "}
                                            {attr.type === "boolean"
                                              ? value
                                                ? "Yes"
                                                : "No"
                                              : value}
                                            {attr.unit && ` ${attr.unit}`}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                {isDisabled && (
                                  <p className="text-xs text-destructive mt-1">
                                    Incompatible with current selection
                                  </p>
                                )}
                              </button>
                            </div>
                          );
                        })}

                        {isAdminMode && (
                          <Button
                            onClick={() => onAddOption(category.id)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 add-option-btn"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <AlertDialog
          open={!!deleteDialog}
          onOpenChange={() => setDeleteDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the {deleteDialog?.type}{" "}
                <strong>"{deleteDialog?.name}"</strong>.
                {deleteDialog?.type === "category" &&
                  " All options in this category will also be deleted."}{" "}
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);

ConfigurationPanel.displayName = "ConfigurationPanel";
