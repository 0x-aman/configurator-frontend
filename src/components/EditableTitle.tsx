import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { configuratorService } from "@/services/configuratorService";

interface EditableTitleProps {
  configuratorId: string;
  configuratorName: string;
  token: string | null;
  isAdminMode: boolean;
}

export function EditableTitle({
  configuratorId,
  configuratorName,
  token,
  isAdminMode,
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(configuratorName);
  const [editValue, setEditValue] = useState(configuratorName);
  const [isSaving, setIsSaving] = useState(false);

  // Update title when configuratorName changes
  useEffect(() => {
    setTitle(configuratorName);
    setEditValue(configuratorName);
  }, [configuratorName]);

  const handleSave = async () => {
    if (!editValue.trim()) {
      toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token available",
        variant: "destructive",
      });
      return;
    }

    // Don't save if nothing changed
    if (editValue.trim() === title) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const response = await configuratorService.update({
        token,
        name: editValue.trim(),
      });

      if (response.success && response.data) {
        setTitle(response.data.name);
        setEditValue(response.data.name);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Configurator name updated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to update configurator name");
      }
    } catch (error) {
      console.error("Error updating configurator name:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update configurator name",
        variant: "destructive",
      });
      // Reset to previous value on error
      setEditValue(title);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  if (isEditing && isAdminMode) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="text-lg sm:text-2xl font-bold h-auto py-1"
          autoFocus
          disabled={isSaving}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center gap-2 ${
        isAdminMode ? "cursor-pointer" : ""
      }`}
      onClick={() => isAdminMode && setIsEditing(true)}
    >
      <h1 className="text-lg sm:text-2xl font-bold text-foreground">{title}</h1>
      {isAdminMode && (
        <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}
