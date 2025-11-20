"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RequestQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalPrice: string | number;
  categories?: any[];
  selectedConfig?: {
    configuratorId?: string;
    selectedOptions?: Record<string, string>;
    items?: {
      sku: string;
      label: string;
      price: number;
    }[];
  };
}

export function RequestQuoteDialog({
  open,
  onOpenChange,
  totalPrice,
  categories = [],
  selectedConfig = {},
}: RequestQuoteDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Build the payload in your requested format
    const quotePayload = {
      configuratorId:
        selectedConfig?.configuratorId || "default_configurator_id",
      customerEmail: formData.email,
      customerName: formData.name,
      customerPhone: formData.phone || "",
      selectedOptions: selectedConfig?.selectedOptions || {},
      totalPrice: parseFloat(totalPrice as string) || 0,
      configuration: {
        items: selectedConfig?.items || [],
      },
      metadata: {
        company: formData.company || "",
        message: formData.message || "",
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // Simulate API call (replace this with your real POST request)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Quote Request Payload (ready for backend):", quotePayload);

      toast({
        title: "Quote request sent!",
        description:
          "Your quote request has been submitted successfully. We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Quote submission failed:", error);
      toast({
        title: "Something went wrong",
        description:
          "Could not send your quote request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request a Quote</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-accent rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Total Configuration Price:
            </span>
            <span className="text-2xl font-bold text-primary">
              ${parseFloat(totalPrice as string).toFixed(2)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1-555-0123"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Your company name (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Any additional requirements or questions..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
