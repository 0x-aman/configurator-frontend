import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CurrencySelector } from "./settings/CurrencySelector";
import { EmailTemplateManager } from "./email/EmailTemplateManager";
import { EmailTemplatePreview } from "./email/EmailTemplatePreview";
import { Currency, EmailTemplate } from "@/types/settings";
import { Settings, DollarSign, Mail, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  emailTemplates: EmailTemplate[];
  defaultEmailTemplate?: string;
  onAddTemplate: (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => EmailTemplate;
  onUpdateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onCloneTemplate: (id: string) => EmailTemplate | undefined;
  onSetDefaultTemplate: (id: string) => void;
  primaryColor: string;
}

export function SettingsDialog({
  open,
  onOpenChange,
  currency,
  onCurrencyChange,
  emailTemplates,
  defaultEmailTemplate,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onCloneTemplate,
  onSetDefaultTemplate,
  primaryColor,
}: SettingsDialogProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const handleCurrencyChange = (newCurrency: Currency) => {
    onCurrencyChange(newCurrency);
    toast({
      title: "Currency updated",
      description: `Prices will now be displayed in ${newCurrency.name} (${newCurrency.code}).`,
    });
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurator Settings
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="currency" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="currency" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Currency
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="currency" className="mt-6">
              <CurrencySelector
                currentCurrency={currency}
                onCurrencyChange={handleCurrencyChange}
              />
            </TabsContent>

            <TabsContent value="email" className="mt-6 space-y-6">
              {/* Quick Preview Section */}
              <div className="bg-muted/50 border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Quick Preview
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Select a template below to preview how it will look to customers
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {emailTemplates.slice(0, 6).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                      className="justify-start text-left truncate"
                    >
                      <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{template.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <EmailTemplateManager
                templates={emailTemplates}
                defaultTemplateId={defaultEmailTemplate}
                onAddTemplate={onAddTemplate}
                onUpdateTemplate={onUpdateTemplate}
                onDeleteTemplate={onDeleteTemplate}
                onCloneTemplate={onCloneTemplate}
                onSetDefault={onSetDefaultTemplate}
                primaryColor={primaryColor}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <EmailTemplatePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={previewTemplate}
        primaryColor={primaryColor}
      />
    </>
  );
}
