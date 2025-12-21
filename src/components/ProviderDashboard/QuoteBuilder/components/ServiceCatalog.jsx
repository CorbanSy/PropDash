//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\components\ServiceCatalog.jsx
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { theme } from "../../../../styles/theme";

export default function ServiceCatalog({ onSelect, onClose }) {
  const [services, setServices] = useState([
    // Example data - would come from database
    { id: 1, name: "TV Mounting", price: 120, type: "fixed", category: "Installation" },
    { id: 2, name: "Furniture Assembly", price: 80, type: "fixed", category: "Assembly" },
    { id: 3, name: "Drywall Patch", price: 150, type: "fixed", category: "Repair" },
    { id: 4, name: "Lighting Install", rate: 75, type: "hourly", category: "Electrical" },
    { id: 5, name: "Paint Touch-up", ratePerSqft: 0.5, type: "sqft", category: "Painting" },
    { id: 6, name: "Outlet Installation", price: 95, type: "fixed", category: "Electrical" },
    { id: 7, name: "Door Installation", price: 250, type: "fixed", category: "Installation" },
    { id: 8, name: "Carpet Cleaning", ratePerSqft: 0.25, type: "sqft", category: "Cleaning" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ["all", ...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (service) => {
    onSelect({
      name: service.name,
      description: service.description || "",
      type: service.type,
      price: service.price,
      rate: service.rate,
      ratePerSqft: service.ratePerSqft,
      hours: service.type === "hourly" ? 1 : undefined,
      squareFeet: service.type === "sqft" ? 100 : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <h2 className={theme.text.h2}>Service Catalog</h2>
            <p className={theme.text.caption}>Select a service to add to your quote</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className={`${theme.button.provider} text-sm`}
            >
              <Plus size={16} />
              Add Service
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-slate-200 space-y-4">
          {/* Search */}
          <div className="relative">
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

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  categoryFilter === category
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category === "all" ? "All Services" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className={theme.text.body}>No services found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={() => handleSelect(service)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <AddServiceModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newService) => {
            setServices([...services, { ...newService, id: Date.now() }]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

// Service Card Component
function ServiceCard({ service, onSelect }) {
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
    <button
      onClick={onSelect}
      className="text-left p-4 rounded-lg border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-900">{service.name}</h4>
        <span className={`text-xs px-2 py-1 rounded font-medium ${typeColors[service.type]}`}>
          {service.type}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-2">{service.category}</p>
      <p className="text-xl font-bold text-slate-900">{getPriceDisplay()}</p>
    </button>
  );
}

// Add Service Modal
function AddServiceModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "fixed",
    price: "",
    rate: "",
    ratePerSqft: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      category: formData.category,
      type: formData.type,
      price: formData.type === "fixed" ? parseFloat(formData.price) : undefined,
      rate: formData.type === "hourly" ? parseFloat(formData.rate) : undefined,
      ratePerSqft: formData.type === "sqft" ? parseFloat(formData.ratePerSqft) : undefined,
      description: formData.description,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={theme.text.h3}>Add New Service</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={theme.text.label}>Service Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              placeholder="e.g., TV Mounting"
            />
          </div>

          <div>
            <label className={theme.text.label}>Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              placeholder="e.g., Installation"
            />
          </div>

          <div>
            <label className={theme.text.label}>Pricing Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="sqft">Per Square Foot</option>
            </select>
          </div>

          {formData.type === "fixed" && (
            <div>
              <label className={theme.text.label}>Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
              />
            </div>
          )}

          {formData.type === "hourly" && (
            <div>
              <label className={theme.text.label}>Hourly Rate ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
              />
            </div>
          )}

          {formData.type === "sqft" && (
            <div>
              <label className={theme.text.label}>Rate per Sq Ft ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.ratePerSqft}
                onChange={(e) => setFormData({ ...formData, ratePerSqft: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
              />
            </div>
          )}

          <div>
            <label className={theme.text.label}>Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${theme.input.base} ${theme.input.provider} mt-2`}
              rows={3}
              placeholder="Add any notes about this service..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} className={`flex-1 ${theme.button.secondary} justify-center`}>
              Cancel
            </button>
            <button type="submit" className={`flex-1 ${theme.button.provider} justify-center`}>
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}