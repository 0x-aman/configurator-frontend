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
      content: "Welcome to Admin Mode! This tour will guide you through the main features of the configurator.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".add-category-btn",
      content: "Use this button to add new product categories. Each category represents a different aspect of your product.",
      placement: "bottom",
    },
    {
      target: ".config-panel",
      content: "This panel shows all your categories. Click to expand and see options within each category.",
      placement: "right",
    },
    {
      target: ".preview-panel",
      content: "See how your selected options change the product preview in real-time.",
      placement: "left",
    },
    {
      target: ".summary-panel",
      content: "All selected options and their prices appear here. Track your total configuration cost.",
      placement: "left",
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
