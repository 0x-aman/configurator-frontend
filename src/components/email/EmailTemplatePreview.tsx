import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailTemplate } from "@/types/settings";

interface EmailTemplatePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
  primaryColor: string;
}

export function EmailTemplatePreview({
  open,
  onOpenChange,
  template,
  primaryColor,
}: EmailTemplatePreviewProps) {
  if (!template) return null;

  const renderPreview = () => {
    let html = template.body;

    // Replace placeholders with sample data
    const replacements: Record<string, string> = {
      "{{customerName}}": "John Doe",
      "{{totalPrice}}": "$12,345.67",
      "{{orderNumber}}": "ORD-2025-001234",
      "{{deliveryDate}}": "October 28, 2025",
      "{{configurationDetails}}": `
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>Size:</strong> Large (1200mm × 800mm)</li>
          <li style="margin-bottom: 8px;"><strong>Material:</strong> Stainless Steel</li>
          <li style="margin-bottom: 8px;"><strong>Color:</strong> Metallic Blue</li>
          <li style="margin-bottom: 8px;"><strong>Power:</strong> 240V / 3000W</li>
        </ul>
      `,
      "{{primaryColor}}": template.inheritThemeColors ? primaryColor : "#0066ff",
    };

    Object.entries(replacements).forEach(([key, value]) => {
      html = html.replace(new RegExp(key, "g"), value);
    });

    return html;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {template.name}</DialogTitle>
          <DialogDescription>Subject: {template.subject}</DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-6 bg-background">
          <div
            className="email-preview"
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />
        </div>

        <div className="text-xs text-muted-foreground p-4 bg-muted rounded-lg">
          <p className="font-semibold mb-2">Preview Notes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>This preview uses sample data for demonstration</li>
            <li>Actual emails will include real customer and configuration data</li>
            {template.inheritThemeColors && (
              <li>Theme colors are applied based on your current configurator theme</li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
