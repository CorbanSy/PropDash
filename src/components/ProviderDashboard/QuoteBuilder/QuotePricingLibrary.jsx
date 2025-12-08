// src/components/ProviderDashboard/QuoteBuilder/QuotePricingLibrary.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Search,
  Settings as SettingsIcon,
  Package,
  DollarSign,
  Zap,
  Save,
} from "lucide-react";
import { theme } from "../../../styles/theme";
import useAuth from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabaseClient";

export default function QuotePricingLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("catalog");
  const [searchQuery, setSearchQuery] = useState("");

  // Service Catalog State
  const [services, setServices] = useState([
    // Example data - would come from database
    { id: 1, name: "TV Mounting", price: 120, type: "fixed", category: "Installation" },
    { id: 2, name: "Furniture Assembly", price: 80, type: "fixed", category: "Assembly" },
    { id: 3, name: "Drywall Patch", price: 150, type: "fixed", category: "Repair" },
    { id: 4, name: "Lighting Install", rate: 75, type: "hourly", category: "Electrical" },
    { id: 5, name: "Paint Touch-up", ratePerSqft: 0.5, type: "sqft", category: "Painting" },
  ]);

  // Pricing Settings State
  const [settings, setSettings] = useState({
    materialMarkup: 20,
    travelFee: 0,
    minimumCharge: 75,
    taxRate: 8.5,
    laborRounding: "0.5",
  });

  const [editingService, setEditingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveSettings = async () => {
    // TODO: Save to database
    alert("Settings saved!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/provider/quotes")}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className={theme.text.h1}>Pricing & Settings</h1>
            <p className={`${theme.text.body} mt-1`}>
              Manage your service catalog and pricing rules
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton
          active={activeTab === "catalog"}
          onClick={() => setActiveTab("catalog")}
          icon={<Package size={18} />}
          label="Service Catalog"
        />
        <TabButton
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
          icon={<SettingsIcon size={18} />}
          label="Pricing Rules"
        />
      </div>

      {/* Service Catalog Tab */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Search & Add */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${theme.input.base} ${theme.input.provider} pl-10`}
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className={`${theme.button.provider} flex items-center gap-2`}
              >
                <Plus size={18} />
                Add Service
              </button>
            </div>
          </div>

          {/* Services List */}
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h3} mb-4`}>
              Your Services ({filteredServices.length})
            </h3>

            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto text-slate-400 mb-4" size={48} />
                <p className={`${theme.text.h4} mb-2`}>No Services Found</p>
                <p className={theme.text.body}>
                  {searchQuery ? "Try a different search" : "Add your first service to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredServices.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onEdit={() => setEditingService(service)}
                    onDelete={() => {
                      if (confirm(`Delete "${service.name}"?`)) {
                        setServices(services.filter((s) => s.id !== service.id));
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Rules Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className={`${theme.card.base} ${theme.card.padding}`}>
            <h3 className={`${theme.text.h3} mb-6`}>Automatic Pricing Rules</h3>

            <div className="space-y-6">
              {/* Material Markup */}
              <div>
                <label className={theme.text.label}>Material Markup (%)</label>
                <p className={`${theme.text.caption} mb-2`}>
                  Automatic markup applied to all material costs
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={settings.materialMarkup}
                    onChange={(e) =>
                      setSettings({ ...settings, materialMarkup: parseInt(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.materialMarkup}
                    onChange={(e) =>
                      setSettings({ ...settings, materialMarkup: parseInt(e.target.value) })
                    }
                    className={`${theme.input.base} ${theme.input.provider} w-20 text-center`}
                  />
                  <span className="text-slate-600 font-medium">%</span>
                </div>
              </div>

              {/* Travel Fee */}
              <div>
                <label className={theme.text.label}>Travel Fee ($)</label>
                <p className={`${theme.text.caption} mb-2`}>
                  Fixed fee added to all quotes for travel costs
                </p>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={settings.travelFee}
                    onChange={(e) =>
                      setSettings({ ...settings, travelFee: parseFloat(e.target.value) })
                    }
                    className={`${theme.input.base} ${theme.input.provider} pl-8`}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Minimum Charge */}
              <div>
                <label className={theme.text.label}>Minimum Charge ($)</label>
                <p className={`${theme.text.caption} mb-2`}>
                  Minimum amount for any job
                </p>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={settings.minimumCharge}
                    onChange={(e) =>
                      setSettings({ ...settings, minimumCharge: parseFloat(e.target.value) })
                    }
                    className={`${theme.input.base} ${theme.input.provider} pl-8`}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Tax Rate */}
              <div>
                <label className={theme.text.label}>Sales Tax (%)</label>
                <p className={`${theme.text.caption} mb-2`}>
                  Tax rate applied to quote subtotal
                </p>
                <div className="flex items-center gap-4 max-w-xl">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={settings.taxRate}
                    onChange={(e) =>
                      setSettings({ ...settings, taxRate: parseFloat(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) =>
                      setSettings({ ...settings, taxRate: parseFloat(e.target.value) })
                    }
                    className={`${theme.input.base} ${theme.input.provider} w-20 text-center`}
                  />
                  <span className="text-slate-600 font-medium">%</span>
                </div>
              </div>

              {/* Labor Rounding */}
              <div>
                <label className={theme.text.label}>Labor Hour Rounding</label>
                <p className={`${theme.text.caption} mb-2`}>
                  Round labor hours up to nearest interval
                </p>
                <select
                  value={settings.laborRounding}
                  onChange={(e) => setSettings({ ...settings, laborRounding: e.target.value })}
                  className={`${theme.input.base} ${theme.input.provider} max-w-xs`}
                >
                  <option value="0.25">0.25 hours (15 min)</option>
                  <option value="0.5">0.5 hours (30 min)</option>
                  <option value="1">1 hour</option>
                  <option value="none">No rounding</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className={`w-full mt-8 ${theme.button.provider} justify-center`}
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>

          {/* Settings Summary */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-blue-600" size={20} />
              <h4 className="font-semibold text-blue-900">Current Settings Summary</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-700 mb-1">Material Markup</p>
                <p className="font-bold text-blue-900 text-lg">{settings.materialMarkup}%</p>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Travel Fee</p>
                <p className="font-bold text-blue-900 text-lg">${settings.travelFee}</p>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Minimum Charge</p>
                <p className="font-bold text-blue-900 text-lg">${settings.minimumCharge}</p>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Tax Rate</p>
                <p className="font-bold text-blue-900 text-lg">{settings.taxRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 font-semibold transition relative ${
        active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>}
    </button>
  );
}

// Service Row Component
function ServiceRow({ service, onEdit, onDelete }) {
  const getPriceDisplay = () => {
    if (service.type === "fixed") return `$${service.price}`;
    if (service.type === "hourly") return `$${service.rate}/hr`;
    if (service.type === "sqft") return `$${service.ratePerSqft}/sqft`;
    return "Custom";
  };

  const typeColors = {
    fixed: "bg-blue-100 text-blue-700",
    hourly: "bg-purple-100 text-purple-700",
    sqft: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-blue-300 transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-slate-900">{service.name}</h4>
          <span className={`text-xs px-2 py-1 rounded font-medium ${typeColors[service.type]}`}>
            {service.type}
          </span>
        </div>
        <p className="text-sm text-slate-600">{service.category}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-xl font-bold text-slate-900">{getPriceDisplay()}</p>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            <Edit2 size={16} className="text-slate-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}