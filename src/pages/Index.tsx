import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ConfigurationPanel,
  ConfigurationPanelRef,
} from "@/components/ConfigurationPanel";
import { ProductPreview } from "@/components/ProductPreview";
import { SummaryPanel } from "@/components/SummaryPanel";
import { MobileConfigDrawer } from "@/components/MobileConfigDrawer";
import { SelectedConfigDrawer } from "@/components/SelectedConfigDrawer";
import { RequestQuoteDialog } from "@/components/RequestQuoteDialog";
import { ExportDialog } from "@/components/ExportDialog";
import { AdminDialog } from "@/components/AdminDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";
import { EditableTitle } from "@/components/EditableTitle";
import { CSVImportDialog } from "@/components/admin/CSVImportDialog";
import { BillingLimitModal } from "@/components/BillingLimitModal";
import { ConfiguratorInfoPopup } from "@/components/admin/ConfiguratorInfoPopup";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ConfigCategory, ConfigOption } from "@/types/configurator";
import { useConfiguration } from "@/hooks/useConfiguration";
import { useConfiguratorData } from "@/hooks/useConfiguratorData";
import { useTheme } from "@/hooks/useTheme";
import { useSettings } from "@/hooks/useSettings";
import { useAdminVerification } from "@/hooks/useAdminVerification";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Palette, FileText, Upload, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const { token, publicId, publicKey, isAdminMode, isInitialized } =
    useAuthToken();

  const {
    isVerified,
    verifiedPublicId,
    isLoading: isVerifyingToken,
    verifiedPublicKey,
  } = useAdminVerification(token, isAdminMode);

  // Determine which credentials to use: admin mode uses verified publicId, public mode uses URL params
  const activePublicId = isAdminMode ? verifiedPublicId : publicId;
  const activePublicKey = isAdminMode ? verifiedPublicKey : publicKey;

  const {
    categories: apiCategories,
    configuratorFound,
    isLoading: isLoadingData,
    configuratorId: retrievedConfiguratorId,
    configurator,
  } = useConfiguratorData(activePublicId, activePublicKey);

  const {
    state,
    dispatch,
    calculateTotal,
    onAddCategory,
    onUpdateCategory,
    onAddOption,
    onUpdateOption,
    onDeleteCategory,
    onDeleteOption,
  } = useConfiguration(apiCategories);

  const { theme, updateTheme, resetTheme } = useTheme();
  const {
    settings,
    updateCurrency,
    addEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    cloneEmailTemplate,
    setDefaultEmailTemplate,
    formatPrice,
  } = useSettings();

  const configPanelRef = useRef<ConfigurationPanelRef>(null);
  const [billingLimitModalOpen, setBillingLimitModalOpen] = useState(false);

  // Automatically enable admin mode when verified
  useEffect(() => {
    if (isVerified && !state.isAdminMode) {
      dispatch({ type: "TOGGLE_ADMIN" });
    } else if (!isVerified && state.isAdminMode) {
      dispatch({ type: "TOGGLE_ADMIN" });
    }
  }, [isVerified, state.isAdminMode]);

  const adminModeEnabled = state.isAdminMode && isVerified;

  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [csvImportDialogOpen, setCsvImportDialogOpen] = useState(false);
  const [adminDialogMode, setAdminDialogMode] = useState<"category" | "option">(
    "category"
  );
  const [selectedCategoryForOption, setSelectedCategoryForOption] =
    useState<string>("");
  const [editingOption, setEditingOption] = useState<ConfigOption | null>(null);
  const [editingCategory, setEditingCategory] = useState<ConfigCategory | null>(
    null
  );
  const [configuratorId, setConfiguratorId] = useState<string>("");

  const handleAddCategory = () => {
    setEditingOption(null);
    setEditingCategory(null);
    setAdminDialogMode("category");
    setAdminDialogOpen(true);
  };

  const handleEditCategory = (category: ConfigCategory) => {
    setEditingCategory(category);
    setEditingOption(null);
    setAdminDialogMode("category");
    setAdminDialogOpen(true);
  };

  const handleAddOption = (categoryId: string) => {
    setEditingOption(null);
    setEditingCategory(null);
    setSelectedCategoryForOption(categoryId);
    setAdminDialogMode("option");
    setAdminDialogOpen(true);
  };

  const handleEditOption = (categoryId: string, option: ConfigOption) => {
    setEditingOption(option);
    setEditingCategory(null);
    setSelectedCategoryForOption(categoryId);
    setAdminDialogMode("option");
    setAdminDialogOpen(true);
  };

  const handleCategoryCreated = (categoryId: string) => {
    // Scroll to and expand the new category
    if (configPanelRef.current) {
      configPanelRef.current.scrollToAndExpandCategory(categoryId);
    }

    // After creating a category, automatically open the option dialog
    setTimeout(() => {
      setSelectedCategoryForOption(categoryId);
      setAdminDialogMode("option");
      setAdminDialogOpen(true);
    }, 100);
  };

  // set configuratorId
  useEffect(() => {
    setConfiguratorId(
      retrievedConfiguratorId || apiCategories[0]?.configuratorId
    );
    console.log(apiCategories);
  }, [apiCategories]);

  const handleCSVImport = async (
    data: { category: string; options: ConfigOption[] }[]
  ) => {
    for (const { category, options } of data) {
      // Check if category exists
      const existingCategory = state.categories.find(
        (c) => c.name === category
      );

      if (existingCategory) {
        // Add options to existing category
        for (const option of options) {
          const result = await onAddOption(existingCategory.id, option);
          if (result.isLimitError) {
            setBillingLimitModalOpen(true);
            return; // Stop importing if limit reached
          }
        }
      } else {
        // Create new category and wait for the real ID from backend
        const newCategory: ConfigCategory = {
          id: "", // Backend will assign the real ID
          name: category,
          options: [],
          relatedCategories: [],
          configuratorId,
        };

        const createdCategory = await onAddCategory(newCategory);

        // Add options using the REAL category ID from backend
        if (createdCategory) {
          for (const option of options) {
            const result = await onAddOption(createdCategory.id, option);
            if (result.isLimitError) {
              setBillingLimitModalOpen(true);
              return; // Stop importing if limit reached
            }
          }
        }
      }
    }
  };

  // Handler for option selection with incompatibility validation
  const handleOptionSelect = (categoryId: string, optionId: string) => {
    // First, select the option
    dispatch({ type: "SELECT_OPTION", categoryId, optionId });

    // Get the selected option
    const category = state.categories.find((c) => c.id === categoryId);
    const selectedOption = category?.options.find((o) => o.id === optionId);

    if (!selectedOption || !selectedOption.incompatibleWith || selectedOption.incompatibleWith.length === 0) {
      return; // No incompatibilities to check
    }

    // Get all incompatible option IDs
    const incompatibleOptionIds = selectedOption.incompatibleWith.map(
      (incomp) => incomp.incompatibleOptionId
    );

    // Check if any currently selected options are in the incompatible list
    let deselectedSomething = false;
    const updatedConfig = { ...state.selectedConfig };

    Object.entries(state.selectedConfig).forEach(([catId, optId]) => {
      if (catId === categoryId || !optId) return; // Skip the current category and empty selections

      // If this selected option is incompatible with the newly selected option, deselect it
      if (incompatibleOptionIds.includes(optId)) {
        updatedConfig[catId] = "";
        deselectedSomething = true;
      }
    });

    // If we deselected any incompatible options, update the config and show a toast
    if (deselectedSomething) {
      dispatch({ type: "RESTORE_CONFIG", config: updatedConfig });
      toast({
        title: "Incompatible selections cleared",
        description: `Some options were automatically deselected because they're incompatible with "${selectedOption.label}".`,
      });
    }
  };

  // Show loading while initializing, verifying token, or loading data
  if (!isInitialized || isVerifyingToken || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!isInitialized
              ? "Initializing..."
              : isVerifyingToken
              ? "Verifying access..."
              : "Loading configurator..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error if in admin mode but token is invalid
  if (isAdminMode && !isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <p>
              Invalid or expired admin token. Please request a new edit link.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Return to Home
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error if configurator not found
  if (!configuratorFound && activePublicId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">Configurator Not Found</p>
            <p>
              The configurator you're looking for doesn't exist or you don't
              have access to it.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show empty configurator message
  if (configuratorFound && apiCategories.length === 0 && !isAdminMode) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">Empty Configurator</p>
            <p>
              This configurator has no categories or options configured yet.
            </p>
            {adminModeEnabled && (
              <p className="text-sm text-muted-foreground mt-2">
                Use the admin panel to add categories and options.
              </p>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error if no credentials provided
  if (!activePublicId || !activePublicKey) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">Missing Credentials</p>
            <p>
              No configurator specified. Please provide valid publicId and
              publicKey parameters.
            </p>
            <p className="text-sm mt-2">
              Example: ?publicId=your_id&publicKey=your_key
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <CurrencyProvider formatPrice={formatPrice}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between admin-toggle-area">
          <EditableTitle
            configuratorId={configuratorId}
            configuratorName={configurator?.name || "Product Configurator"}
            token={token}
            isAdminMode={adminModeEnabled}
          />
          {adminModeEnabled && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCsvImportDialogOpen(true)}
                size="sm"
                className="sm:h-10"
              >
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Import CSV</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setSettingsDialogOpen(true)}
                size="sm"
                className="sm:h-10"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setThemeDialogOpen(true)}
                size="sm"
                className="sm:h-10"
              >
                <Palette className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Theme</span>
              </Button>
            </div>
          )}
        </header>

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-10 overflow-hidden">
          {/* Mobile: Sticky Product Preview at top */}
          <div className="lg:hidden sticky top-0 z-20 bg-background">
            <ProductPreview
              selectedConfig={state.selectedConfig}
              categories={state.categories}
              totalPrice={formatPrice(calculateTotal())}
              onRequestQuote={() => setQuoteDialogOpen(true)}
              onExport={() => setExportDialogOpen(true)}
              isMobile={true}
            />
          </div>

          {/* Desktop: Configuration Panel */}
          <div className="hidden lg:block lg:col-span-3 lg:h-[calc(100vh-73px)] overflow-y-auto lg:border-r border-border">
            <ConfigurationPanel
              ref={configPanelRef}
              categories={state.categories}
              selectedConfig={state.selectedConfig}
              onOptionSelect={handleOptionSelect}
              isAdminMode={adminModeEnabled}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={onDeleteCategory}
              onAddOption={handleAddOption}
              onEditOption={handleEditOption}
              onDeleteOption={onDeleteOption}
            />
          </div>

          {/* Desktop: Product Preview */}
          <div className="hidden lg:block lg:col-span-4 lg:h-[calc(100vh-73px)] overflow-y-auto lg:border-r border-border preview-panel">
            <ProductPreview
              selectedConfig={state.selectedConfig}
              categories={state.categories}
              totalPrice={formatPrice(calculateTotal())}
              onRequestQuote={() => setQuoteDialogOpen(true)}
              onExport={() => setExportDialogOpen(true)}
              isMobile={false}
            />
          </div>

          {/* Desktop: Summary Panel */}
          <div className="hidden lg:block lg:col-span-3 lg:h-[calc(100vh-73px)] overflow-y-auto summary-panel">
            <SummaryPanel
              categories={state.categories}
              selectedConfig={state.selectedConfig}
              onRemoveOption={(categoryId) => {
                // For non-primary categories, just clear the selection
                dispatch({ type: "SELECT_OPTION", categoryId, optionId: "" });
              }}
            />
          </div>

          {/* Mobile: Configuration Drawers */}
          <div className="lg:hidden flex-1 overflow-y-auto pb-24">
            <div className="p-4 space-y-3">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Configure Your Product
              </h2>

              {/* Selected Configuration Summary Button */}
              <SelectedConfigDrawer
                categories={state.categories}
                selectedConfig={state.selectedConfig}
                totalPrice={formatPrice(calculateTotal())}
              />

              <div className="pt-2 space-y-3">
                {state.categories.map((category) => {
                  const selectedOptionId = state.selectedConfig[category.id];
                  const selectedOption = category.options?.find(
                    (o) => o.id === selectedOptionId
                  );

                  return (
                    <MobileConfigDrawer
                      key={category.id}
                      category={category}
                      selectedOption={selectedOption}
                      onOptionSelect={(optionId) =>
                        handleOptionSelect(category.id, optionId)
                      }
                      selectedConfig={state.selectedConfig}
                      categories={state.categories}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: Sticky Bottom Action Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 shadow-lg z-30 quote-export-actions">
            <div className="flex gap-2">
              <Button
                onClick={() => setQuoteDialogOpen(true)}
                className="flex-1"
                size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                Quote
              </Button>
              <Button
                onClick={() => setExportDialogOpen(true)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Export
              </Button>
            </div>
          </div>
        </div>

        <ConfiguratorInfoPopup
          isAdminMode={adminModeEnabled}
          configuratorFound={configuratorFound}
        />

        <RequestQuoteDialog
          publicKey={activePublicKey}
          open={quoteDialogOpen}
          onOpenChange={setQuoteDialogOpen}
          totalPrice={calculateTotal()}
          categories={state.categories}
          selectedConfig={{
            configuratorId,
            selectedOptions: state.selectedConfig,
            items: state.categories
              .map((cat) => {
                const optId = state.selectedConfig[cat.id];
                const opt = cat.options.find((o) => o.id === optId);
                return opt
                  ? {
                      sku: opt.sku || opt.id,
                      label: opt.label,
                      price: opt.price,
                    }
                  : null;
              })
              .filter(Boolean) as any[],
          }}
        />

        <SettingsDialog
          open={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
          currency={settings.currency}
          onCurrencyChange={updateCurrency}
          emailTemplates={settings.emailTemplates}
          defaultEmailTemplate={settings.defaultEmailTemplate}
          onAddTemplate={addEmailTemplate}
          onUpdateTemplate={updateEmailTemplate}
          onDeleteTemplate={deleteEmailTemplate}
          onCloneTemplate={cloneEmailTemplate}
          onSetDefaultTemplate={setDefaultEmailTemplate}
          primaryColor={theme?.primaryColor || "#0066ff"}
        />

        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          categories={state.categories}
          selectedConfig={state.selectedConfig}
        />

        <AdminDialog
          open={adminDialogOpen}
          onOpenChange={setAdminDialogOpen}
          mode={adminDialogMode}
          categoryId={selectedCategoryForOption}
          categories={state.categories}
          editingOption={editingOption}
          editingCategory={editingCategory}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
          onAddOption={onAddOption}
          onUpdateOption={onUpdateOption}
          onCategoryCreated={handleCategoryCreated}
          onLimitReached={() => setBillingLimitModalOpen(true)}
          configuratorId={configuratorId}
        />

        <ThemeCustomizer
          open={themeDialogOpen}
          onOpenChange={setThemeDialogOpen}
          currentTheme={theme}
          onUpdateTheme={updateTheme}
          onResetTheme={resetTheme}
        />

        <CSVImportDialog
          open={csvImportDialogOpen}
          onOpenChange={setCsvImportDialogOpen}
          categories={state.categories}
          onImport={handleCSVImport}
        />

        <BillingLimitModal
          open={billingLimitModalOpen}
          onOpenChange={setBillingLimitModalOpen}
        />
      </div>
    </CurrencyProvider>
  );
};

export default Index;
