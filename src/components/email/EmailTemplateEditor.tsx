import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailTemplate } from "@/types/settings";

interface EmailTemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
  onSave: (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => void;
}

export function EmailTemplateEditor({
  open,
  onOpenChange,
  template,
  onSave,
}: EmailTemplateEditorProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [inheritThemeColors, setInheritThemeColors] = useState(true);

  useEffect(() => {
    if (open) {
      if (template) {
        setName(template.name);
        setSubject(template.subject);
        setBody(template.body);
        setInheritThemeColors(template.inheritThemeColors);
      } else {
        setName("");
        setSubject("");
        setBody("");
        setInheritThemeColors(true);
      }
    }
  }, [open, template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      subject,
      body,
      inheritThemeColors,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Template" : "Create New Template"}</DialogTitle>
          <DialogDescription>
            Design your email template. Use placeholders like {`{{customerName}}`}, {`{{totalPrice}}`}, and {`{{configurationDetails}}`}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Quote Request Received"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Thank you for your quote request"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Email Body (HTML)</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your email HTML template..."
              rows={12}
              className="font-mono text-xs"
              required
            />
            <p className="text-xs text-muted-foreground">
              Available placeholders: {`{{customerName}}`}, {`{{totalPrice}}`}, {`{{configurationDetails}}`}, {`{{primaryColor}}`}, {`{{orderNumber}}`}, {`{{deliveryDate}}`}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="theme-colors">Inherit Theme Colors</Label>
              <p className="text-sm text-muted-foreground">
                Use the configurator's primary color in this template
              </p>
            </div>
            <Switch
              id="theme-colors"
              checked={inheritThemeColors}
              onCheckedChange={setInheritThemeColors}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {template ? "Update Template" : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
