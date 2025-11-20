import { useState, useEffect } from "react";
import { AppSettings, Currency, EmailTemplate, CURRENCIES } from "@/types/settings";

const STORAGE_KEY = "configurator_settings";

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "quote-received",
    name: "Quote Request Received",
    subject: "Thank you for your quote request",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: {{primaryColor}};">Quote Request Received</h1>
  <p>Dear {{customerName}},</p>
  <p>Thank you for your interest in our products. We have received your quote request and our team will review your configuration shortly.</p>
  
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="margin-top: 0; color: {{primaryColor}};">Configuration Summary</h2>
    {{configurationDetails}}
    <p style="font-size: 18px; font-weight: bold; color: {{primaryColor}};">Total: {{totalPrice}}</p>
  </div>
  
  <p>We will get back to you within 24 hours with a detailed quote.</p>
  <p>Best regards,<br>Your Sales Team</p>
</div>`,
    inheritThemeColors: true,
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    subject: "Your order has been confirmed - Order #{{orderNumber}}",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: {{primaryColor}};">Order Confirmation</h1>
  <p>Dear {{customerName}},</p>
  <p>Your order has been successfully confirmed and is being processed.</p>
  
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="margin-top: 0;">Order #{{orderNumber}}</h2>
    {{configurationDetails}}
    <p style="font-size: 18px; font-weight: bold; color: {{primaryColor}};">Total: {{totalPrice}}</p>
  </div>
  
  <p>Expected delivery: {{deliveryDate}}</p>
  <p>Thank you for your business!</p>
</div>`,
    inheritThemeColors: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to our configurator!",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: {{primaryColor}};">Welcome!</h1>
  <p>Dear {{customerName}},</p>
  <p>Thank you for using our product configurator. We're excited to help you design your perfect solution.</p>
  
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Getting Started</h3>
    <ul>
      <li>Browse our configuration options</li>
      <li>Customize your product</li>
      <li>Request a quote instantly</li>
    </ul>
  </div>
  
  <p>If you have any questions, our team is here to help.</p>
  <p>Best regards,<br>The Team</p>
</div>`,
    inheritThemeColors: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getDefaultSettings = (): AppSettings => ({
  currency: CURRENCIES[0], // USD
  emailTemplates: DEFAULT_TEMPLATES,
  defaultEmailTemplate: "quote-received",
});

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings);

  // Settings are now kept in memory only - no persistence
  // This improves security by not storing sensitive data locally

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    // No longer persisting to localStorage for security
  };

  const updateCurrency = (currency: Currency) => {
    saveSettings({ ...settings, currency });
  };

  const addEmailTemplate = (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSettings({
      ...settings,
      emailTemplates: [...settings.emailTemplates, newTemplate],
    });
    return newTemplate;
  };

  const updateEmailTemplate = (id: string, updates: Partial<EmailTemplate>) => {
    saveSettings({
      ...settings,
      emailTemplates: settings.emailTemplates.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    });
  };

  const deleteEmailTemplate = (id: string) => {
    saveSettings({
      ...settings,
      emailTemplates: settings.emailTemplates.filter((t) => t.id !== id),
      defaultEmailTemplate: settings.defaultEmailTemplate === id ? undefined : settings.defaultEmailTemplate,
    });
  };

  const cloneEmailTemplate = (id: string) => {
    const template = settings.emailTemplates.find((t) => t.id === id);
    if (!template) return;

    const cloned: EmailTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveSettings({
      ...settings,
      emailTemplates: [...settings.emailTemplates, cloned],
    });
    return cloned;
  };

  const setDefaultEmailTemplate = (id: string) => {
    saveSettings({
      ...settings,
      emailTemplates: settings.emailTemplates.map((t) => ({
        ...t,
        isDefault: t.id === id,
      })),
      defaultEmailTemplate: id,
    });
  };

  const formatPrice = (amount: number) => {
    const currency = settings?.currency || CURRENCIES[0];
    return currency.format(amount);
  };

  return {
    settings,
    updateCurrency,
    addEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    cloneEmailTemplate,
    setDefaultEmailTemplate,
    formatPrice,
  };
}
