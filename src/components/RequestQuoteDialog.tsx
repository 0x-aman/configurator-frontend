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
import { Loader2, Download } from "lucide-react";
import jsPDF from "jspdf";
import { useCurrency } from "@/contexts/CurrencyContext";
import { quoteService } from "@/services/quoteService";
import { getErrorMessage } from "@/lib/api-client";

interface RequestQuoteDialogProps {
  open: boolean;
  publicKey: string;
  onOpenChange: (open: boolean) => void;
  totalPrice: number;
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
  publicKey,
  categories = [],
  selectedConfig = {},
}: RequestQuoteDialogProps) {
  const { formatPrice } = useCurrency();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Configuration Quote", 20, 20);

    // Configuration Details
    doc.setFontSize(12);
    let yPos = 40;

    doc.text("Selected Configuration:", 20, yPos);
    yPos += 10;

    // List all items
    selectedConfig?.items?.forEach((item, index) => {
      doc.setFontSize(10);
      doc.text(
        `${index + 1}. ${item.label} - ${formatPrice(item.price)}`,
        25,
        yPos
      );
      yPos += 7;
    });

    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total Price: ${formatPrice(totalPrice)}`, 20, yPos);

    // Customer info if filled
    if (formData.name || formData.email) {
      yPos += 20;
      doc.setFontSize(12);
      doc.text("Customer Information:", 20, yPos);
      yPos += 10;

      if (formData.name) {
        doc.setFontSize(10);
        doc.text(`Name: ${formData.name}`, 25, yPos);
        yPos += 7;
      }
      if (formData.email) {
        doc.text(`Email: ${formData.email}`, 25, yPos);
        yPos += 7;
      }
      if (formData.phone) {
        doc.text(`Phone: ${formData.phone}`, 25, yPos);
        yPos += 7;
      }
      if (formData.company) {
        doc.text(`Company: ${formData.company}`, 25, yPos);
        yPos += 7;
      }
    }

    doc.save(`configuration-quote-${Date.now()}.pdf`);

    toast({
      title: "PDF Downloaded",
      description: "Your configuration has been exported as PDF.",
    });
  };

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
      totalPrice: totalPrice,
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
      const resp = await quoteService.create(quotePayload, publicKey);

      if (resp?.success) {
        console.log(
          "Quote Request Payload (saved):",
          resp.data ?? quotePayload
        );

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
      } else {
        const msg = resp?.message ?? "Could not submit quote request.";
        console.error("Quote submission failed:", msg, resp);
        toast({
          title: "Submission failed",
          description: msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      console.error("Quote submission failed:", msg, error);
      toast({
        title: "Something went wrong",
        description: msg,
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
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportPDF}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
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
