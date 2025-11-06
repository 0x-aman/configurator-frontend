export interface Incompatibility {
  from: string; // SKU of option A
  to: string; // SKU of option B
  message?: string; // Optional custom message
}

export interface IncompatibilityMap {
  [optionSku: string]: string[]; // Maps SKU to array of incompatible SKUs
}
