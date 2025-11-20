import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EditableTitleProps {
  initialTitle: string;
}

export function EditableTitle({ initialTitle }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [editValue, setEditValue] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!editValue.trim()) {
      toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setTitle(editValue);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Title updated successfully",
    });
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="text-lg sm:text-2xl font-bold h-auto py-1"
          autoFocus
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
          <Check className="h-4 w-4" />
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
      className="group flex items-center gap-2 cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <h1 className="text-lg sm:text-2xl font-bold text-foreground">
        {title}
      </h1>
      <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
