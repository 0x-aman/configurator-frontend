import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType, ConfigAttribute } from "@/types/configurator";
import { AlertCircle } from "lucide-react";
import { CategoryAttributeTemplate } from "./CategoryAttributeTemplate";

interface CategoryFormProps {
  categoryName: string;
  setCategoryName: (name: string) => void;
  categoryType: CategoryType;
  setCategoryType: (type: CategoryType) => void;
  isEditing: boolean;
  hasOptions: boolean;
  attributesTemplate: ConfigAttribute[];
  setAttributesTemplate: (attributes: ConfigAttribute[]) => void;
}

export function CategoryForm({
  categoryName,
  setCategoryName,
  categoryType,
  setCategoryType,
  isEditing,
  hasOptions,
  attributesTemplate,
  setAttributesTemplate,
}: CategoryFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category-name">Category Name *</Label>
          <Input
            id="category-name"
            required
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g., Accessories"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-type">Category Type *</Label>
          <Select
            value={categoryType}
            onValueChange={(value) => setCategoryType(value as CategoryType)}
            disabled={isEditing && hasOptions}
          >
            <SelectTrigger id="category-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "GENERIC",
                "COLOR",
                "DIMENSION",
                "MATERIAL",
                "FEATURE",
                "ACCESSORY",
                "POWER",
                "TEXT",
                "FINISH",
                "CUSTOM",
              ].map((type: string) => (
                <SelectItem value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isEditing && hasOptions ? (
            <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <p>
                Category type cannot be changed when options exist. Delete all
                options first to change the type.
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              This determines what fields will be available when adding options
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <CategoryAttributeTemplate
          attributes={attributesTemplate}
          setAttributes={setAttributesTemplate}
        />
      </div>
    </div>
  );
}
