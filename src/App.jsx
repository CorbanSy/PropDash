// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerRegister from "./pages/CustomerRegister";
import NotFound from "./pages/NotFound";

// Utils
import ProtectedRoute from "./utils/ProtectedRoute";

// Public Components
import BookingPage from "./components/PublicBookingPage/BookingPage";

// Provider Dashboard Components
import DashboardLayout from "./components/ProviderDashboard/DashboardLayout";
import Home from "./components/ProviderDashboard/Home";
import Schedule from "./components/ProviderDashboard/Schedule";
import Clients from "./components/ProviderDashboard/Clients";
import Network from "./components/ProviderDashboard/Network";
import Settings from "./components/ProviderDashboard/Settings";

// Customer Dashboard Components
import CustomerDashboardLayout from "./components/CustomerDashboard/CustomerDashboardLayout";
import CustomerHome from "./components/CustomerDashboard/Home";
import MyJobs from "./components/CustomerDashboard/MyJobs";
import BrowsePros from "./components/CustomerDashboard/BrowsePros";
import Messages from "./components/CustomerDashboard/Messages";
import CustomerSettings from "./components/CustomerDashboard/CustomerSettings";

import QuoteBuilder from "./components/ProviderDashboard/QuoteBuilder";
import QuoteEditor from "./components/ProviderDashboard/QuoteBuilder/QuoteEditor";
import QuotePricingLibrary from "./components/ProviderDashboard/QuoteBuilder/QuotePricingLibrary";
import ClientQuoteView from "./components/ProviderDashboard/QuoteBuilder/components/ClientQuoteView";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/book/:providerId" element={<BookingPage />} />
        <Route path="/quotes/:id/view" element={<ClientQuoteView />} />
        {/* ========== PROVIDER DASHBOARD ========== */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="quotes" element={<QuoteBuilder />} />
          <Route path="quotes/new" element={<QuoteEditor />} />
          <Route path="quotes/:id" element={<QuoteEditor />} />
          <Route path="quotes/settings" element={<QuotePricingLibrary />} />
          <Route path="clients" element={<Clients />} />
          <Route path="network" element={<Network />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ========== CUSTOMER DASHBOARD ========== */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CustomerHome />} />
          <Route path="browse" element={<BrowsePros />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>

        {/* ========== 404 NOT FOUND ========== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}