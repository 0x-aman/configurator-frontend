// Core API Types based on external API documentation

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
}

// Error codes from API documentation
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "PLAN_LIMIT"
  | "LIMIT_EXCEEDED"
  | "CREATE_ERROR"
  | "UPDATE_ERROR"
  | "DELETE_ERROR"
  | "UPLOAD_ERROR"
  | "EMAIL_ERROR"
  | "INTERNAL_ERROR";

// Token types
export interface EditToken {
  token: string;
}

export interface TokenVerification {
  valid: boolean;
  publicId: string;
  publicKey: string;
}

// Configurator types
export interface Configurator {
  id: string;
  publicId: string;
  name: string;
  description?: string;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
  isPublished: boolean;
  allowQuotes?: boolean;
  requireEmail?: boolean;
  showTotal?: boolean;
  themeId?: string;
  categories?: Category[];
  theme?: Theme;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateConfiguratorInput {
  token: string;
  name: string;
  description?: string;
  currency?: string;
  currencySymbol?: string;
  themeId?: string;
}

export interface UpdateConfiguratorInput {
  token: string;
  name?: string;
  description?: string;
  isPublished?: boolean;
  allowQuotes?: boolean;
  requireEmail?: boolean;
  showTotal?: boolean;
  currency?: string;
  currencySymbol?: string;
}

// Category types
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

export interface Category {
  id: string;
  configuratorId: string;
  name: string;
  categoryType: CategoryType;
  description?: string;
  isPrimary?: boolean;
  isRequired?: boolean;
  orderIndex: number;
  defaultOptionId?: string;
  options?: Option[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  token: string;
  configuratorId: string;
  name: string;
  categoryType?: CategoryType;
  description?: string;
  isPrimary?: boolean;
  isRequired?: boolean;
}

export interface UpdateCategoryInput {
  token: string;
  id: string;
  name?: string;
  description?: string;
  orderIndex?: number;
  isRequired?: boolean;
  defaultOptionId?: string;
}

// Option types
export interface Option {
  id: string;
  categoryId: string;
  label: string;
  description?: string;
  price: number;
  sku?: string;
  imageUrl?: string;
  isDefault?: boolean;
  isActive: boolean;
  inStock?: boolean;
  isPopular?: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOptionInput {
  token: string;
  categoryId: string;
  label: string;
  description?: string;
  price: number;
  sku?: string;
  imageUrl?: string;
  isDefault?: boolean;
  incompatibleWith: any[];
}

export interface UpdateOptionInput {
  token: string;
  id: string;
  label?: string;
  description?: string;
  price?: number;
  orderIndex?: number;
  isPopular?: boolean;
  inStock?: boolean;
}

// Quote types
export interface Quote {
  id: string;
  quoteCode: string;
  status: "PENDING" | "SENT" | "ACCEPTED" | "REJECTED";
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  totalPrice: number;
  selectedOptions?: Record<string, any>;
  configuration?: Record<string, any>;
  internalNotes?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateQuoteInput {
  configuratorId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  selectedOptions: Record<string, any>;
  totalPrice: number;
  configuration?: Record<string, any>;
}

export interface UpdateQuoteInput {
  token: string;
  id: string;
  status?: Quote["status"];
  internalNotes?: string;
  validUntil?: string;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  description?: string;
  primaryColor: string; // HSL format: "hue saturation% lightness%"
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateThemeInput {
  token: string;
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  isDefault?: boolean;
}

export interface UpdateThemeInput {
  token: string;
  id: string;
  name?: string;
  primaryColor?: string;
  isDefault?: boolean;
}

// Email types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  templateType: "quote" | "confirmation" | "custom";
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EmailPreviewInput {
  token: string;
  templateId?: string;
  subject?: string;
  body?: string;
  variables: Record<string, string>;
}

export interface EmailPreviewResponse {
  subject: string;
  html: string;
}

export interface SendEmailInput {
  token: string;
  to: string;
  templateId?: string;
  subject?: string;
  html?: string;
  variables?: Record<string, string>;
}

export interface SendEmailResponse {
  sent: boolean;
  messageId: string;
}

// File types
export type FileType = "IMAGE" | "DOCUMENT" | "ASSET" | "OTHER";

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  fileType: FileType;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface SignedUploadUrl {
  uploadUrl: string;
  fileKey: string;
  expiresAt: string;
}

// Client types
export interface Client {
  id: string;
  email: string;
  name?: string;
  companyName?: string;
  phone?: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "TRIAL";
  apiKey: string;
  publicKey: string;
  allowedDomains: string[];
  monthlyRequests: number;
  requestLimit: number;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateClientInput {
  token: string;
  name?: string;
  companyName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateDomainsInput {
  token: string;
  domains: string[];
}

// Analytics types
export interface UsageAnalytics {
  totalViews: number;
  totalInteractions: number;
  totalQuotes: number;
  conversionRate: number;
  topConfigurators: Array<{
    id: string;
    name: string;
    views: number;
    quotes: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    interactions: number;
    quotes: number;
  }>;
}

export interface PerformanceMetrics {
  averageLoadTime: number;
  averageInteractionTime: number;
  bounceRate: number;
  completionRate: number;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
}
