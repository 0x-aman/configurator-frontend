import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/types/configurator";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OptionFormDetailsProps {
  categoryType: CategoryType;
  image: string;
  setImage: (image: string) => void;
  color: string;
  setColor: (color: string) => void;
  voltage: string;
  setVoltage: (voltage: string) => void;
  wattage: string;
  setWattage: (wattage: string) => void;
  materialType: string;
  setMaterialType: (material: string) => void;
  finishType: string;
  setFinishType: (finish: string) => void;
  textValue: string;
  setTextValue: (text: string) => void;
  maxCharacters: string;
  setMaxCharacters: (max: string) => void;
  dimensionWidth: string;
  setDimensionWidth: (width: string) => void;
  dimensionHeight: string;
  setDimensionHeight: (height: string) => void;
  dimensionUnit: string;
  setDimensionUnit: (unit: string) => void;
}

export function OptionFormDetails({
  categoryType,
  image,
  setImage,
  color,
  setColor,
  voltage,
  setVoltage,
  wattage,
  setWattage,
  materialType,
  setMaterialType,
  finishType,
  setFinishType,
  textValue,
  setTextValue,
  maxCharacters,
  setMaxCharacters,
  dimensionWidth,
  setDimensionWidth,
  dimensionHeight,
  setDimensionHeight,
  dimensionUnit,
  setDimensionUnit,
}: OptionFormDetailsProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);
      setImage(url); // Set the base64 data URL for now (in real app, you'd upload to server first)
    };
    reader.readAsDataURL(file);

    toast({
      title: "Image uploaded",
      description: `${file.name} ready to save`,
    });
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setPreviewUrl("");
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>
        
        <div className="space-y-3">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="option-image" className="text-sm text-muted-foreground">
              Image URL
            </Label>
            <Input
              id="option-image"
              type="url"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setPreviewUrl(e.target.value);
                setUploadedFile(null);
              }}
              placeholder="https://example.com/image.png"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 border-t" />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Upload Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            {uploadedFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {uploadedFile.name}
              </p>
            )}
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="relative border rounded-lg p-4 bg-muted/50 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border"
                    onError={() => {
                      setPreviewUrl("");
                      toast({
                        title: "Invalid image",
                        description: "Could not load image preview",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Preview</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {uploadedFile?.name || image}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Product preview will update when image is provided (max 5MB)
        </p>
      </div>

      {categoryType === "color" && (
        <div className="space-y-2">
          <Label htmlFor="option-color">Color (Hex)</Label>
          <div className="flex gap-2">
            <Input
              id="option-color"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#FF5733"
            />
            <Input
              type="color"
              value={color || "#000000"}
              onChange={(e) => setColor(e.target.value)}
              className="w-20"
            />
          </div>
        </div>
      )}

      {categoryType === "dimension" && (
        <div className="space-y-2">
          <Label>Dimensions</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={dimensionWidth}
              onChange={(e) => setDimensionWidth(e.target.value)}
              placeholder="Width"
            />
            <Input
              type="number"
              min="0"
              step="0.01"
              value={dimensionHeight}
              onChange={(e) => setDimensionHeight(e.target.value)}
              placeholder="Height"
            />
            <Select value={dimensionUnit} onValueChange={setDimensionUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm">mm</SelectItem>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="m">m</SelectItem>
                <SelectItem value="in">in</SelectItem>
                <SelectItem value="ft">ft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {categoryType === "power" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="option-voltage">Voltage</Label>
            <Input
              id="option-voltage"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              placeholder="e.g., 220V"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="option-wattage">Wattage</Label>
            <Input
              id="option-wattage"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              placeholder="e.g., 10kW"
            />
          </div>
        </>
      )}

      {categoryType === "material" && (
        <div className="space-y-2">
          <Label htmlFor="option-material">Material Type</Label>
          <Input
            id="option-material"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            placeholder="e.g., Steel, Aluminum, Acrylic"
          />
        </div>
      )}

      {categoryType === "finish" && (
        <div className="space-y-2">
          <Label htmlFor="option-finish">Finish Type</Label>
          <Input
            id="option-finish"
            value={finishType}
            onChange={(e) => setFinishType(e.target.value)}
            placeholder="e.g., Gloss, Matte, Brushed"
          />
        </div>
      )}

      {categoryType === "text" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="option-text">Default Text</Label>
            <Input
              id="option-text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="e.g., Custom Engraving"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="option-maxchars">Max Characters</Label>
            <Input
              id="option-maxchars"
              type="number"
              min="1"
              value={maxCharacters}
              onChange={(e) => setMaxCharacters(e.target.value)}
              placeholder="e.g., 50"
            />
          </div>
        </>
      )}
    </div>
  );
}
