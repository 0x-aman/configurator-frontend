export type TextColorMode = "auto" | "white" | "black" | "custom";

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  textColorMode?: TextColorMode;
  customTextColor?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PredefinedColor {
  name: string;
  value: string;
}
