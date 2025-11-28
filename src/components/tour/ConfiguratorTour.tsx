import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useEffect, useState } from "react";

interface ConfiguratorTourProps {
  run: boolean;
  onComplete: () => void;
}

const TOUR_STORAGE_KEY = "configuratorTourCompleted";

export function ConfiguratorTour({ run, onComplete }: ConfiguratorTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: "body",
      content: "Welcome to Admin Mode! This tour will guide you through setting up your configurator. Let's get started!",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".add-category-btn",
      content: "Step 1: Click here to add your first category. You'll need to create at least one PRIMARY category for your product.",
      placement: "bottom",
    },
    {
      target: ".config-panel",
      content: "Step 2: After creating a category, you'll see it here. Click to expand and add options to it. Each option represents a variant or choice within that category.",
      placement: "right",
    },
    {
      target: ".preview-panel",
      content: "Step 3: The preview panel shows how your product configuration looks in real-time as options are selected.",
      placement: "left",
    },
    {
      target: ".summary-panel",
      content: "Step 4: This summary panel displays all selected options and calculates the total price. Users will see this when configuring their product.",
      placement: "left",
    },
    {
      target: "body",
      content: "Important: Every configurator needs exactly ONE primary category with at least one option. You can have multiple additional (non-primary) categories too!",
      placement: "center",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
      onComplete();
      setStepIndex(0);
    } else if (action === "next" || action === "prev") {
      setStepIndex(index + (action === "next" ? 1 : -1));
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--card))",
          textColor: "hsl(var(--foreground))",
          overlayColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "0.5rem",
          padding: "1rem",
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
          borderRadius: "0.375rem",
          padding: "0.5rem 1rem",
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
    />
  );
}

export function shouldShowTour(): boolean {
  return localStorage.getItem(TOUR_STORAGE_KEY) !== "true";
}

export function resetTour(): void {
  localStorage.removeItem(TOUR_STORAGE_KEY);
}
