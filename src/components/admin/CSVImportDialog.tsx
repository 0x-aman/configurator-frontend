import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { ConfigCategory, ConfigOption } from "@/types/configurator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CSVRow {
  category: string;
  option: string;
  description: string;
  price: string;
  imageUrl?: string;
  incompatibleWith?: string;
}

interface ParsedData {
  category: string;
  options: (CSVRow & { errors: string[] })[];
}

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ConfigCategory[];
  onImport: (data: { category: string; options: ConfigOption[] }[]) => void;
}

export function CSVImportDialog({
  open,
  onOpenChange,
  categories,
  onImport,
}: CSVImportDialogProps) {
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRow = (row: CSVRow): string[] => {
    const errors: string[] = [];
    
    if (!row.category?.trim()) errors.push("Missing category");
    if (!row.option?.trim()) errors.push("Missing option name");
    if (!row.description?.trim()) errors.push("Missing description");
    if (!row.price || isNaN(parseFloat(row.price))) errors.push("Invalid price");
    
    return errors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const grouped = new Map<string, (CSVRow & { errors: string[] })[]>();
        
        results.data.forEach((row) => {
          const errors = validateRow(row);
          const categoryName = row.category?.trim() || "Unknown";
          
          if (!grouped.has(categoryName)) {
            grouped.set(categoryName, []);
          }
          
          grouped.get(categoryName)!.push({ ...row, errors });
        });

        const parsed = Array.from(grouped.entries()).map(([category, options]) => ({
          category,
          options,
        }));

        setParsedData(parsed);
        setIsProcessing(false);
        
        toast({
          title: "CSV parsed successfully",
          description: `Found ${results.data.length} rows in ${parsed.length} categories`,
        });
      },
      error: (error) => {
        setIsProcessing(false);
        toast({
          title: "Parse error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const template = `category,option,description,price,imageUrl,incompatibleWith
Base Machine,Standard Model,Our standard configuration,5000,https://example.com/image.png,
Base Machine,Premium Model,Enhanced features,7500,https://example.com/image.png,option-2
Color,Red,Vibrant red finish,200,,
Color,Blue,Classic blue finish,200,,option-1`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "configurator-template.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded",
    });
  };

  const handleSaveAll = () => {
    const hasErrors = parsedData.some((group) =>
      group.options.some((opt) => opt.errors.length > 0)
    );

    if (hasErrors) {
      toast({
        title: "Validation errors",
        description: "Please fix all errors before saving",
        variant: "destructive",
      });
      return;
    }

    const importData = parsedData.map((group) => ({
      category: group.category,
      options: group.options.map((opt) => ({
        id: `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label: opt.option,
        description: opt.description,
        price: parseFloat(opt.price),
        image: opt.imageUrl || undefined,
        incompatibleWith: opt.incompatibleWith
          ? opt.incompatibleWith.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      })),
    }));

    onImport(importData);
    setParsedData([]);
    onOpenChange(false);
    
    toast({
      title: "All data saved",
      description: `Imported ${importData.reduce((acc, g) => acc + g.options.length, 0)} options across ${importData.length} categories`,
    });
  };

  const handleDiscard = () => {
    setParsedData([]);
    toast({
      title: "Import canceled",
      description: "CSV data has been discarded",
    });
  };

  const totalErrors = parsedData.reduce(
    (acc, group) => acc + group.options.filter((opt) => opt.errors.length > 0).length,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">CSV Import</DialogTitle>
          <DialogDescription>
            Bulk import categories and options from a CSV file
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {parsedData.length === 0 ? (
            <div className="space-y-6 py-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all"
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isProcessing ? "Processing..." : "Click to upload CSV"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or drag and drop your file here
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Expected columns:</strong> category, option, description, price, imageUrl (optional), incompatibleWith (optional)
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">
                    {parsedData.reduce((acc, g) => acc + g.options.length, 0)} options
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    across {parsedData.length} categories
                  </p>
                </div>
                {totalErrors > 0 ? (
                  <Badge variant="destructive" className="text-sm">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {totalErrors} errors found
                  </Badge>
                ) : (
                  <Badge className="text-sm bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    All valid
                  </Badge>
                )}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  {parsedData.map((group, groupIdx) => (
                    <div key={groupIdx} className="border-b last:border-b-0">
                      <div className="bg-muted/80 px-4 py-3 font-semibold sticky top-0 z-10 flex items-center justify-between">
                        <span>{group.category}</span>
                        {categories.find((c) => c.name === group.category) && (
                          <Badge variant="secondary" className="text-xs">
                            Merges with existing
                          </Badge>
                        )}
                      </div>
                      <div className="divide-y">
                        {group.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`px-4 py-3 grid grid-cols-12 gap-3 items-start ${
                              opt.errors.length > 0 ? "bg-destructive/5 border-l-4 border-l-destructive" : ""
                            }`}
                          >
                            <div className="col-span-3">
                              <p className="font-medium text-sm">{opt.option}</p>
                            </div>
                            <div className="col-span-5">
                              <p className="text-sm text-muted-foreground line-clamp-2">{opt.description}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-mono">${opt.price}</p>
                            </div>
                            <div className="col-span-2">
                              {opt.errors.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {opt.errors.map((err, errIdx) => (
                                    <span key={errIdx} className="text-xs text-destructive">
                                      {err}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Valid
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleDiscard} variant="outline" className="flex-1">
                  Discard
                </Button>
                <Button
                  onClick={handleSaveAll}
                  disabled={totalErrors > 0}
                  className="flex-1"
                >
                  Save All ({parsedData.reduce((acc, g) => acc + g.options.length, 0)} items)
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
