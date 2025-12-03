// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import BookingPage from "./components/PublicBookingPage/BookingPage";

// Dashboard imports
import DashboardLayout from "./components/ProviderDashboard/DashboardLayout";
import Home from "./components/ProviderDashboard/Home";
import Schedule from "./components/ProviderDashboard/Schedule";
import QuoteBuilder from "./components/ProviderDashboard/QuoteBuilder"; // 👈 ADD THIS
import Network from "./components/ProviderDashboard/Network";
import Settings from "./components/ProviderDashboard/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public booking */}
        <Route path="/book/:providerId" element={<BookingPage />} />

        {/* Provider Dashboard - Nested */}
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
          <Route path="quotes" element={<QuoteBuilder />} /> {/* 👈 CHANGED FROM services TO quotes */}
          <Route path="network" element={<Network />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}