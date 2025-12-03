// src/components/index.js

// Provider Dashboard Components
export { default as DashboardLayout } from "./ProviderDashboard/DashboardLayout";
export { default as Home } from "./ProviderDashboard/Home";
export { default as Schedule } from "./ProviderDashboard/Schedule";
export { default as QuoteBuilder } from "./ProviderDashboard/QuoteBuilder"; // Changed from Services
export { default as Clients } from "./ProviderDashboard/Clients"; // Added
export { default as Network } from "./ProviderDashboard/Network";
export { default as Settings } from "./ProviderDashboard/Settings";

// Customer Dashboard Components (Optional - for consistency)
export { default as CustomerDashboardLayout } from "./CustomerDashboard/CustomerDashboardLayout";
export { default as CustomerHome } from "./CustomerDashboard/Home";
export { default as MyJobs } from "./CustomerDashboard/MyJobs";
export { default as BrowsePros } from "./CustomerDashboard/BrowsePros";
export { default as Messages } from "./CustomerDashboard/Messages";
export { default as CustomerSettings } from "./CustomerDashboard/CustomerSettings";