export type CategoryType =
  | "GENERIC"
  | "COLOR"
  | "DIMENSION"
  | "MATERIAL"
  | "FEATURE"
  | "ACCESSORY"
  | "POWER"
  | "TEXT"
  | "FINISH"
  | "CUSTOM";

export type AttributeType =
  | "text"
  | "number"
  | "color"
  | "select"
  | "boolean"
  | "dimension";

export interface ConfigAttribute {
  key: string;
  label: string;
  type: AttributeType;
  unit?: string; // for number/dimension types
  options?: string[]; // for select types
  min?: number; // for number types
  max?: number; // for number types
  value?: any; // the actual value of this attribute
}

export interface IncompatibilityRecord {
  id: string;
  optionId: string;
  incompatibleOptionId: string;
  severity?: string;
  message?: string;
  incompatibleOption?: {
    id: string;
    label: string;
    sku?: string;
    categoryId: string;
  };
}

export interface ConfigOption {
  id: string;
  label: string;
  price: number;
  description?: string;
  sku?: string;
  imageUrl?: string;
  isDefault?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  orderIndex?: number;
  // Category-driven attributes system
  attributeValues?: Record<string, any>; // key-value pairs based on category's attributesTemplate
  // Legacy fields - kept for backward compatibility
  attributes?: ConfigAttribute[]; // old per-option custom attributes (deprecated, for migration)
  image?: string;
  color?: string; // hex value for color types
  hexColor?: string;
  dimensions?: { width: number; height: number; unit: string }; // for dimension types
  voltage?: string; // for power types
  wattage?: string; // for power types
  materialType?: string; // for material types
  finishType?: string; // for finish types
  textValue?: string; // for text types
  maxCharacters?: number; // for text types
  extraData?: Record<string, any>; // catch-all for future extensions
  incompatibleWith?: IncompatibilityRecord[];
}

export interface ConfigCategory {
  id: string;
  name: string;
  categoryType?: CategoryType | string;
  description?: string;
  isPrimary?: boolean;
  isRequired?: boolean;
  orderIndex?: number;
  options: ConfigOption[];
  defaultOptionId?: string;
  relatedCategories?: string[]; // categories that can have incompatibilities with this one
  attributesTemplate?: ConfigAttribute[]; // defines what attributes options in this category should have
  configuratorId: string;
}

export interface SelectedConfig {
  [categoryId: string]: string; // categoryId -> optionId
}

export interface ConfigState {
  categories: ConfigCategory[];
  selectedConfig: SelectedConfig;
  isAdminMode: boolean;
}
