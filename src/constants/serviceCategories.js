//levlpro-mvp\src\constants\serviceCategories.js
import {
  Wrench,
  Home,
  Zap,
  Paintbrush,
  TreePine,
  Package,
  Droplet,
  Sparkles,
} from "lucide-react";

export const SERVICE_CATEGORIES = [
  { id: "handyman", name: "Handyman", icon: Wrench },
  { id: "plumbing", name: "Plumbing", icon: Droplet },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "cleaning", name: "Cleaning", icon: Sparkles },
  { id: "painting", name: "Painting", icon: Paintbrush },
  { id: "assembly", name: "Assembly", icon: Package },
  { id: "landscaping", name: "Landscaping", icon: TreePine },
  { id: "hvac", name: "HVAC", icon: Home },
];

// Detailed services under each category
export const SERVICES_BY_CATEGORY = {
  handyman: [
    { id: "handyman-general", name: "General Repairs" },
    { id: "handyman-drywall", name: "Drywall Repair" },
    { id: "handyman-doors", name: "Door Installation/Repair" },
    { id: "handyman-windows", name: "Window Repair" },
    { id: "handyman-furniture", name: "Furniture Assembly" },
  ],
  plumbing: [
    { id: "plumbing-leaks", name: "Leak Repair" },
    { id: "plumbing-drains", name: "Drain Cleaning" },
    { id: "plumbing-fixtures", name: "Fixture Installation" },
    { id: "plumbing-water-heater", name: "Water Heater Service" },
    { id: "plumbing-emergency", name: "Emergency Plumbing" },
  ],
  electrical: [
    { id: "electrical-outlets", name: "Outlet/Switch Repair" },
    { id: "electrical-lighting", name: "Lighting Installation" },
    { id: "electrical-ceiling-fan", name: "Ceiling Fan Installation" },
    { id: "electrical-panel", name: "Panel Upgrade" },
    { id: "electrical-wiring", name: "Rewiring" },
  ],
  cleaning: [
    { id: "cleaning-deep", name: "Deep Cleaning" },
    { id: "cleaning-regular", name: "Regular Cleaning" },
    { id: "cleaning-move", name: "Move In/Out Cleaning" },
    { id: "cleaning-windows", name: "Window Cleaning" },
    { id: "cleaning-carpet", name: "Carpet Cleaning" },
  ],
  painting: [
    { id: "painting-interior", name: "Interior Painting" },
    { id: "painting-exterior", name: "Exterior Painting" },
    { id: "painting-cabinet", name: "Cabinet Painting" },
    { id: "painting-deck", name: "Deck Staining" },
    { id: "painting-drywall", name: "Drywall Texturing" },
  ],
  assembly: [
    { id: "assembly-furniture", name: "Furniture Assembly" },
    { id: "assembly-ikea", name: "IKEA Assembly" },
    { id: "assembly-playground", name: "Playground Equipment" },
    { id: "assembly-fitness", name: "Fitness Equipment" },
    { id: "assembly-office", name: "Office Furniture" },
  ],
  landscaping: [
    { id: "landscaping-mowing", name: "Lawn Mowing" },
    { id: "landscaping-trimming", name: "Tree/Shrub Trimming" },
    { id: "landscaping-mulch", name: "Mulching" },
    { id: "landscaping-cleanup", name: "Yard Cleanup" },
    { id: "landscaping-irrigation", name: "Irrigation Systems" },
  ],
  hvac: [
    { id: "hvac-repair", name: "AC/Heating Repair" },
    { id: "hvac-maintenance", name: "HVAC Maintenance" },
    { id: "hvac-installation", name: "System Installation" },
    { id: "hvac-duct", name: "Duct Cleaning" },
    { id: "hvac-thermostat", name: "Thermostat Installation" },
  ],
};