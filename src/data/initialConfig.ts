import { ConfigCategory } from "@/types/configurator";
import machineSmall from "@/assets/machine-small.png";
import machineMedium from "@/assets/machine-medium.png";
import machineLarge from "@/assets/machine-large.png";

export const initialCategories: ConfigCategory[] = [
  {
    id: "model",
    name: "Machine Model",
    categoryType: "generic",
    isPrimary: true,
    relatedCategories: ["cutting-area"],
    options: [
      {
        id: "finjet-s",
        label: "FinJet S",
        price: 26000,
        description: "Compact 1×1 m unit suitable for small yet demanding cutting applications. Based on FinJet H technology but designed for limited space.",
        image: machineSmall,
      },
      {
        id: "finjet-m",
        label: "FinJet M",
        price: 45000,
        description: "Mid-range industrial unit with enhanced capabilities and larger workspace.",
        image: machineMedium,
      },
      {
        id: "finjet-l",
        label: "FinJet L",
        price: 78000,
        description: "Large format professional cutting system for industrial applications.",
        image: machineLarge,
      },
    ],
    defaultOptionId: "finjet-s",
  },
  {
    id: "cutting-area",
    name: "Cutting Area",
    categoryType: "dimension",
    relatedCategories: ["model"],
    options: [
      {
        id: "1200x1200",
        label: "1,200 × 1,200 mm",
        price: 0,
        description: "Standard bed",
      },
      {
        id: "3000x1500",
        label: "3,000 × 1,500 mm",
        price: 7000,
        description: "Mid-size industrial bed",
      },
      {
        id: "6000x2000",
        label: "6,000 × 2,000 mm",
        price: 18000,
        description: "Large format bed for heavy workloads",
      },
    ],
    defaultOptionId: "1200x1200",
  },
  {
    id: "max-thickness",
    name: "Max Material Thickness",
    categoryType: "generic",
    options: [
      {
        id: "100mm",
        label: "100 mm",
        price: 0,
        description: "Suitable for most materials",
      },
      {
        id: "300mm",
        label: "300 mm",
        price: 6000,
        description: "Heavy metal cutting support",
      },
      {
        id: "500mm",
        label: "500 mm",
        price: 15000,
        description: "For extreme-cutting requirements",
      },
    ],
    defaultOptionId: "100mm",
  },
  {
    id: "pump-type",
    name: "Pump Type",
    categoryType: "generic",
    relatedCategories: ["pump-pressure"],
    options: [
      {
        id: "direct-drive",
        label: "Direct Drive",
        price: 4000,
        description: "Compact, low-maintenance pump",
      },
      {
        id: "intensifier",
        label: "Intensifier Pump",
        price: 9000,
        description: "High-efficiency for continuous operation",
      },
    ],
    defaultOptionId: "direct-drive",
  },
  {
    id: "pump-pressure",
    name: "Pump Pressure",
    categoryType: "generic",
    relatedCategories: ["pump-type"],
    options: [
      {
        id: "30000psi",
        label: "30,000 psi",
        price: 0,
        description: "Standard cutting pressure",
      },
      {
        id: "50000psi",
        label: "50,000 psi",
        price: 8000,
        description: "Enhanced cutting speed",
      },
      {
        id: "87000psi",
        label: "87,000 psi",
        price: 22000,
        description: "Ultra-high pressure for maximum precision",
      },
    ],
    defaultOptionId: "30000psi",
  },
  {
    id: "power-supply",
    name: "Power Supply",
    categoryType: "power",
    options: [
      {
        id: "220v-10kw",
        label: "220V / 10 kW",
        price: 0,
        description: "Standard power usage",
      },
      {
        id: "380v-20kw",
        label: "380V / 20 kW",
        price: 3500,
        description: "Industrial power supply",
      },
    ],
    defaultOptionId: "220v-10kw",
  },
  {
    id: "cutting-head",
    name: "Cutting Head",
    categoryType: "feature",
    options: [
      {
        id: "single-axis",
        label: "Single-Axis",
        price: 4000,
        description: "Standard cutting head for flat materials",
      },
      {
        id: "multi-axis",
        label: "Multi-Axis",
        price: 12000,
        description: "Advanced 5-axis head for complex geometries",
      },
    ],
    defaultOptionId: "single-axis",
  },
];
