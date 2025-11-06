import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmailTemplate } from "@/types/settings";
import { EmailTemplateEditor } from "./EmailTemplateEditor";
import { EmailTemplatePreview } from "./EmailTemplatePreview";
import { Mail, Plus, Edit, Copy, Trash2, Star } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface EmailTemplateManagerProps {
  templates: EmailTemplate[];
  defaultTemplateId?: string;
  onAddTemplate: (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => EmailTemplate;
  onUpdateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onCloneTemplate: (id: string) => EmailTemplate | undefined;
  onSetDefault: (id: string) => void;
  primaryColor: string;
}

export function EmailTemplateManager({
  templates,
  defaultTemplateId,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onCloneTemplate,
  onSetDefault,
  primaryColor,
}: EmailTemplateManagerProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingTemplate(null);
    setEditorOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditorOpen(true);
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  const handleClone = (id: string) => {
    const cloned = onCloneTemplate(id);
    if (cloned) {
      toast({
        title: "Template cloned",
        description: `"${cloned.name}" has been created successfully.`,
      });
    }
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      const template = templates.find((t) => t.id === templateToDelete);
      onDeleteTemplate(templateToDelete);
      toast({
        title: "Template deleted",
        description: `"${template?.name}" has been removed.`,
      });
      setTemplateToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSetDefault = (id: string) => {
    const template = templates.find((t) => t.id === id);
    onSetDefault(id);
    toast({
      title: "Default template updated",
      description: `"${template?.name}" is now the default template.`,
    });
  };

  const handleSave = (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => {
    if (editingTemplate) {
      onUpdateTemplate(editingTemplate.id, template);
      toast({
        title: "Template updated",
        description: "Your email template has been saved successfully.",
      });
    } else {
      onAddTemplate(template);
      toast({
        title: "Template created",
        description: "Your new email template has been created successfully.",
      });
    }
    setEditorOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Create and manage email templates for quotes and confirmations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleAddNew} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>

          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        {template.id === defaultTemplateId && (
                          <Badge variant="default" className="h-5">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {template.inheritThemeColors && (
                          <Badge variant="secondary" className="h-5">
                            Themed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(template)}
                        title="Preview"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(template)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleClone(template.id)}
                        title="Clone"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {template.id !== defaultTemplateId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSetDefault(template.id)}
                          title="Set as default"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(template.id)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <EmailTemplateEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        template={editingTemplate}
        onSave={handleSave}
      />

      <EmailTemplatePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={previewTemplate}
        primaryColor={primaryColor}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the email template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
