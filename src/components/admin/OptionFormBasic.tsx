import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OptionFormBasicProps {
  label: string;
  setLabel: (label: string) => void;
  price: string;
  setPrice: (price: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

export function OptionFormBasic({
  label,
  setLabel,
  price,
  setPrice,
  description,
  setDescription,
}: OptionFormBasicProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="option-label">Option Label *</Label>
        <Input
          id="option-label"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Premium Upgrade"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="option-price">Price ($) *</Label>
        <Input
          id="option-price"
          type="number"
          required
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground">
          Set to 0 for auto-selection by default
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="option-description">Description *</Label>
        <Textarea
          id="option-description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this option..."
          rows={3}
        />
      </div>
    </div>
  );
}
