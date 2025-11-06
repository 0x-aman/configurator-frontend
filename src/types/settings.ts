export interface Currency {
  code: string;
  symbol: string;
  name: string;
  format: (amount: number) => string;
}

export const CURRENCIES: Currency[] = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    format: (amount: number) => `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    format: (amount: number) => `€${amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    format: (amount: number) => `£${amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    format: (amount: number) => `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    format: (amount: number) => `¥${amount.toLocaleString("ja-JP", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  },
  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    format: (amount: number) => `C$${amount.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    format: (amount: number) => `A$${amount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
];

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  inheritThemeColors: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  currency: Currency;
  emailTemplates: EmailTemplate[];
  defaultEmailTemplate?: string;
}
