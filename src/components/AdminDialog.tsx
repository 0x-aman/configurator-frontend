import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ConfigOption,
  ConfigCategory,
  CategoryType,
  ConfigAttribute,
} from "@/types/configurator";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { OptionFormBasic } from "@/components/admin/OptionFormBasic";
import { OptionFormDetails } from "@/components/admin/OptionFormDetails";
import { OptionFormCompatibility } from "@/components/admin/OptionFormCompatibility";
import { OptionAttributeValues } from "@/components/admin/OptionAttributeValues";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "category" | "option";
  categoryId?: string;
  categories?: ConfigCategory[];
  editingOption?: ConfigOption | null;
  editingCategory?: ConfigCategory | null;
  onAddCategory?: (category: ConfigCategory) => Promise<ConfigCategory | null>;
  onUpdateCategory?: (category: ConfigCategory) => void;
  onAddOption?: (
    categoryId: string,
    option: ConfigOption
  ) => Promise<{ success: boolean; isLimitError?: boolean }>;
  onUpdateOption?: (categoryId: string, option: ConfigOption) => void;
  onCategoryCreated?: (categoryId: string) => void;
  onLimitReached?: () => void;
  configuratorId: string;
}

export function AdminDialog({
  open,
  onOpenChange,
  mode,
  categoryId,
  categories = [],
  editingOption = null,
  editingCategory = null,
  onAddCategory,
  onUpdateCategory,
  onAddOption,
  onUpdateOption,
  onCategoryCreated,
  onLimitReached,
  configuratorId,
}: AdminDialogProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>("GENERIC");
  const [categoryIsPrimary, setCategoryIsPrimary] = useState(false);
  const [categoryAttributesTemplate, setCategoryAttributesTemplate] = useState<
    ConfigAttribute[]
  >([]);

  const [optionLabel, setOptionLabel] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [optionDescription, setOptionDescription] = useState("");
  const [optionImage, setOptionImage] = useState("");
  const [optionColor, setOptionColor] = useState("");
  const [optionVoltage, setOptionVoltage] = useState("");
  const [optionWattage, setOptionWattage] = useState("");
  const [optionMaterialType, setOptionMaterialType] = useState("");
  const [optionFinishType, setOptionFinishType] = useState("");
  const [optionTextValue, setOptionTextValue] = useState("");
  const [optionMaxCharacters, setOptionMaxCharacters] = useState("");
  const [optionDimensionWidth, setOptionDimensionWidth] = useState("");
  const [optionDimensionHeight, setOptionDimensionHeight] = useState("");
  const [optionDimensionUnit, setOptionDimensionUnit] = useState("mm");
  const [optionAttributeValues, setOptionAttributeValues] = useState<
    Record<string, any>
  >({});

  const [selectedIncompatibilities, setSelectedIncompatibilities] = useState<
    string[]
  >([]);
  const [compatibilitySearch, setCompatibilitySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const currentCategory = categories.find((cat) => cat.id === categoryId);
  const currentCategoryType = currentCategory?.categoryType || "generic";

  useEffect(() => {
    if (open) {
      if (editingOption) {
        setOptionLabel(editingOption.label);
        setOptionPrice(editingOption.price.toString());
        setOptionDescription(editingOption.description);
        setOptionImage(editingOption.image || "");
        setOptionColor(editingOption.color || "");
        setOptionVoltage(editingOption.voltage || "");
        setOptionWattage(editingOption.wattage || "");
        setOptionMaterialType(editingOption.materialType || "");
        setOptionFinishType(editingOption.finishType || "");
        setOptionTextValue(editingOption.textValue || "");
        setOptionMaxCharacters(editingOption.maxCharacters?.toString() || "");
        setOptionDimensionWidth(
          editingOption.dimensions?.width.toString() || ""
        );
        setOptionDimensionHeight(
          editingOption.dimensions?.height.toString() || ""
        );
        setOptionDimensionUnit(editingOption.dimensions?.unit || "mm");
        setOptionAttributeValues(editingOption.attributeValues || {});
        // preserve existing incompatibilities when editing
        setSelectedIncompatibilities(editingOption.incompatibleWith || []);
      } else if (editingCategory) {
        setCategoryName(editingCategory.name);
        setCategoryType(
          (editingCategory.categoryType || "generic") as CategoryType
        );
        setCategoryIsPrimary(editingCategory.isPrimary || false);
        setCategoryAttributesTemplate(editingCategory.attributesTemplate || []);
      } else if (mode === "option") {
        resetOptionForm();
      } else if (mode === "category") {
        resetCategoryForm();
      }
      setCompatibilitySearch("");
      setShowAllCategories(false);
    }
  }, [open, editingOption, editingCategory, mode]);

  const resetOptionForm = () => {
    setOptionLabel("");
    setOptionPrice("");
    setOptionDescription("");
    setOptionImage("");
    setOptionColor("");
    setOptionVoltage("");
    setOptionWattage("");
    setOptionMaterialType("");
    setOptionFinishType("");
    setOptionTextValue("");
    setOptionMaxCharacters("");
    setOptionDimensionWidth("");
    setOptionDimensionHeight("");
    setOptionDimensionUnit("mm");
    setOptionAttributeValues({});
    setSelectedIncompatibilities([]);
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryType("GENERIC");
    setCategoryIsPrimary(false);
    setCategoryAttributesTemplate([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "category") {
      if (editingCategory && onUpdateCategory) {
        onUpdateCategory({
          ...editingCategory,
          name: categoryName,
          categoryType,
          isPrimary: categoryIsPrimary,
          attributesTemplate:
            categoryAttributesTemplate.length > 0
              ? categoryAttributesTemplate
              : undefined,
        });
        onOpenChange(false);
      } else if (onAddCategory) {
        // Don't generate temporary ID - let backend create it
        const createdCategory = await onAddCategory({
          id: "", // Backend will assign the real ID
          name: categoryName,
          categoryType,
          isPrimary: categoryIsPrimary,
          options: [],
          relatedCategories: [],
          attributesTemplate:
            categoryAttributesTemplate.length > 0
              ? categoryAttributesTemplate
              : undefined,
          configuratorId,
        });

        resetCategoryForm();
        onOpenChange(false);

        // Trigger option form with the REAL category ID from backend
        if (createdCategory && onCategoryCreated) {
          onCategoryCreated(createdCategory.id);
        }
      }
    } else if (mode === "option" && categoryId) {
      const optionPayload: ConfigOption = {
        id: editingOption?.id || `option-${Date.now()}`,
        label: optionLabel,
        price: parseFloat(optionPrice) || 0,
        description: optionDescription,
        image: optionImage || undefined,
        attributeValues:
          Object.keys(optionAttributeValues).length > 0
            ? optionAttributeValues
            : undefined,
        // include incompatibilities in payload (backend expects `incompatibleWith`)
        incompatibleWith:
          selectedIncompatibilities.length > 0 ? selectedIncompatibilities : [],
      };

      if (currentCategoryType === "color" && optionColor) {
        optionPayload.color = optionColor;
      }
      if (currentCategoryType === "power") {
        if (optionVoltage) optionPayload.voltage = optionVoltage;
        if (optionWattage) optionPayload.wattage = optionWattage;
      }
      if (currentCategoryType === "material" && optionMaterialType) {
        optionPayload.materialType = optionMaterialType;
      }
      if (currentCategoryType === "finish" && optionFinishType) {
        optionPayload.finishType = optionFinishType;
      }
      if (currentCategoryType === "text") {
        if (optionTextValue) optionPayload.textValue = optionTextValue;
        if (optionMaxCharacters)
          optionPayload.maxCharacters = parseInt(optionMaxCharacters);
      }
      if (
        currentCategoryType === "dimension" &&
        optionDimensionWidth &&
        optionDimensionHeight
      ) {
        optionPayload.dimensions = {
          width: parseFloat(optionDimensionWidth),
          height: parseFloat(optionDimensionHeight),
          unit: optionDimensionUnit,
        };
      }

      if (editingOption && onUpdateOption) {
        onUpdateOption(categoryId, optionPayload);
        resetOptionForm();
        onOpenChange(false);
      } else if (onAddOption) {
        const result = await onAddOption(categoryId, optionPayload);
        if (result.isLimitError) {
          resetOptionForm();
          onOpenChange(false);
          if (onLimitReached) {
            onLimitReached();
          }
        } else if (result.success) {
          resetOptionForm();
          onOpenChange(false);
        }
      }
    }
  };

  const toggleIncompatibility = (optionId: string) => {
    setSelectedIncompatibilities((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "category"
              ? editingCategory
                ? "Edit Category"
                : "Add New Category"
              : editingOption
              ? "Edit Option"
              : "Add New Option"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "category" ? (
            <CategoryForm
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              categoryType={categoryType}
              setCategoryType={setCategoryType}
              isEditing={!!editingCategory}
              hasOptions={(editingCategory?.options.length || 0) > 0}
              attributesTemplate={categoryAttributesTemplate}
              setAttributesTemplate={setCategoryAttributesTemplate}
              isPrimary={categoryIsPrimary}
              setIsPrimary={setCategoryIsPrimary}
              hasPrimaryCategory={categories.some(
                (cat) => cat.isPrimary && cat.id !== editingCategory?.id
              )}
            />
          ) : (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <OptionFormBasic
                  label={optionLabel}
                  setLabel={setOptionLabel}
                  price={optionPrice}
                  setPrice={setOptionPrice}
                  description={optionDescription}
                  setDescription={setOptionDescription}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <OptionFormDetails
                  categoryType={currentCategoryType as CategoryType}
                  image={optionImage}
                  setImage={setOptionImage}
                  color={optionColor}
                  setColor={setOptionColor}
                  voltage={optionVoltage}
                  setVoltage={setOptionVoltage}
                  wattage={optionWattage}
                  setWattage={setOptionWattage}
                  materialType={optionMaterialType}
                  setMaterialType={setOptionMaterialType}
                  finishType={optionFinishType}
                  setFinishType={setOptionFinishType}
                  textValue={optionTextValue}
                  setTextValue={setOptionTextValue}
                  maxCharacters={optionMaxCharacters}
                  setMaxCharacters={setOptionMaxCharacters}
                  dimensionWidth={optionDimensionWidth}
                  setDimensionWidth={setOptionDimensionWidth}
                  dimensionHeight={optionDimensionHeight}
                  setDimensionHeight={setOptionDimensionHeight}
                  dimensionUnit={optionDimensionUnit}
                  setDimensionUnit={setOptionDimensionUnit}
                />
              </TabsContent>

              <TabsContent value="attributes" className="space-y-4 mt-4">
                <OptionAttributeValues
                  attributesTemplate={currentCategory?.attributesTemplate || []}
                  attributeValues={optionAttributeValues}
                  setAttributeValues={setOptionAttributeValues}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <OptionFormCompatibility
                  categories={categories}
                  currentCategoryId={categoryId}
                  selectedIncompatibilities={selectedIncompatibilities}
                  onToggleIncompatibility={toggleIncompatibility}
                  compatibilitySearch={compatibilitySearch}
                  setCompatibilitySearch={setCompatibilitySearch}
                  showAllCategories={showAllCategories}
                  setShowAllCategories={setShowAllCategories}
                />
              </TabsContent>
            </Tabs>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "category"
                ? editingCategory
                  ? "Update Category"
                  : "Add Category"
                : editingOption
                ? "Update Option"
                : "Add Option"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
