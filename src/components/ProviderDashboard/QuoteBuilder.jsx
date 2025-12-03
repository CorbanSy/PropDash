// src/components/ProviderDashboard/QuoteBuilder.jsx
import { useState, useEffect } from "react";
import {
  Upload,
  X,
  Loader2,
  Plus,
  DollarSign,
  Clock,
  AlertTriangle,
  Download,
  Edit2,
  Check,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Send,
  Save,
  Trash2,
  Eye,
  ChevronRight,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

export default function QuoteBuilder() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'history'
  const [provider, setProvider] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [quote, setQuote] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch provider data and saved quotes
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Get provider info
      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (providerData) setProvider(providerData);

      // Get saved quotes
      const { data: quotesData } = await supabase
        .from("quotes")
        .select("*")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (quotesData) setSavedQuotes(quotesData);

      setLoading(false);
    }
    fetchData();
  }, [user]);

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      analyzed: false,
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  // Remove photo
  const removePhoto = (photoId) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
  };

  // Convert image to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Call Gemini API (AI Quote Generation)
  const generateQuote = async () => {
    if (photos.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    setAnalyzing(true);

    try {
      // Convert all photos to base64
      const base64Photos = await Promise.all(
        photos.map((photo) => fileToBase64(photo.file))
      );

      // Call your backend API endpoint (you'll need to create this)
      const response = await fetch("/api/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: base64Photos,
          baseRate: provider.base_rate,
          licenseType: provider.license_type,
        }),
      });

      const data = await response.json();
      setQuote(data.quote);
      setAnalyzing(false);
    } catch (error) {
      console.error("Error generating quote:", error);
      // MOCK DATA for development
      generateMockQuote();
    }
  };

  // Mock quote generator
  const generateMockQuote = () => {
    const mockItems = [
      {
        id: 1,
        description: "Furniture Assembly - IKEA Bookshelf",
        laborHours: 2,
        laborCost: provider.base_rate * 2,
        materials: 15,
        total: provider.base_rate * 2 + 15,
      },
      {
        id: 2,
        description: "Minor Drywall Repair",
        laborHours: 1.5,
        laborCost: provider.base_rate * 1.5,
        materials: 25,
        total: provider.base_rate * 1.5 + 25,
      },
    ];

    const subtotal = mockItems.reduce((sum, item) => sum + item.total, 0);
    const bufferFee = subtotal * 0.2;
    const total = subtotal + bufferFee;

    setQuote({
      items: mockItems,
      subtotal,
      bufferFee,
      total,
      createdAt: new Date().toISOString(),
    });
    setAnalyzing(false);
  };

  // Check compliance
  const isCompliant = () => {
    if (!provider || !quote) return true;
    if (provider.license_type === "none" && quote.total > 1000) {
      return false;
    }
    return true;
  };

  // Edit item
  const startEditItem = (item) => {
    setEditingItem({ ...item });
  };

  const saveEditItem = () => {
    const updatedItems = quote.items.map((item) =>
      item.id === editingItem.id ? editingItem : item
    );

    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const bufferFee = subtotal * 0.2;
    const total = subtotal + bufferFee;

    setQuote({
      ...quote,
      items: updatedItems,
      subtotal,
      bufferFee,
      total,
    });
    setEditingItem(null);
  };

  // Add new line item
  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      description: "New Item",
      laborHours: 1,
      laborCost: provider.base_rate,
      materials: 0,
      total: provider.base_rate,
    };

    const updatedItems = [...quote.items, newItem];
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const bufferFee = subtotal * 0.2;
    const total = subtotal + bufferFee;

    setQuote({
      ...quote,
      items: updatedItems,
      subtotal,
      bufferFee,
      total,
    });
  };

  // Remove line item
  const removeLineItem = (itemId) => {
    const updatedItems = quote.items.filter((item) => item.id !== itemId);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const bufferFee = subtotal * 0.2;
    const total = subtotal + bufferFee;

    setQuote({
      ...quote,
      items: updatedItems,
      subtotal,
      bufferFee,
      total,
    });
  };

  // Save quote to database
  const saveQuote = async (status = "draft") => {
    if (!clientInfo.name) {
      alert("Please enter client name");
      return;
    }

    const { data, error } = await supabase.from("quotes").insert({
      provider_id: user.id,
      client_name: clientInfo.name,
      client_email: clientInfo.email,
      client_phone: clientInfo.phone,
      quote_data: quote,
      total: Math.round(quote.total * 100), // Convert to cents
      status: status,
    });

    if (error) {
      console.error("Error saving quote:", error);
      alert("Error saving quote");
    } else {
      alert(
        status === "sent"
          ? "Quote sent successfully!"
          : "Quote saved as draft!"
      );

      // Refresh quotes list
      const { data: quotesData } = await supabase
        .from("quotes")
        .select("*")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (quotesData) setSavedQuotes(quotesData);

      // Reset form
      setPhotos([]);
      setQuote(null);
      setClientInfo({ name: "", email: "", phone: "" });
      setActiveTab("history");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quote Builder</h1>
          <p className="text-slate-600 mt-1">
            Create professional estimates powered by AI
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Quotes"
          value={savedQuotes.length}
          color="blue"
        />
        <StatCard
          label="Sent"
          value={savedQuotes.filter((q) => q.status === "sent").length}
          color="green"
        />
        <StatCard
          label="Accepted"
          value={savedQuotes.filter((q) => q.status === "accepted").length}
          color="purple"
        />
        <StatCard
          label="Draft"
          value={savedQuotes.filter((q) => q.status === "draft").length}
          color="orange"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2.5 font-medium transition relative ${
            activeTab === "create"
              ? "text-purple-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles size={18} />
            Create Quote
          </span>
          {activeTab === "create" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2.5 font-medium transition relative ${
            activeTab === "history"
              ? "text-purple-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText size={18} />
            Quote History ({savedQuotes.length})
          </span>
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
          )}
        </button>
      </div>

      {activeTab === "create" ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles size={28} />
                <h2 className="text-2xl font-bold">AI Quote Builder</h2>
              </div>
              <p className="text-purple-100 mb-6">
                Upload photos of the job and let AI generate a professional,
                itemized estimate in seconds
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <CheckCircle2 size={16} />
                  <span>Automatic pricing</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <CheckCircle2 size={16} />
                  <span>Material estimates</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <CheckCircle2 size={16} />
                  <span>PDF export ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Alert */}
          {provider && provider.license_type === "none" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle
                className="text-amber-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">
                  $1,000 Job Limit Active
                </p>
                <p className="text-xs text-amber-700">
                  As an unlicensed provider, quotes cannot exceed $1,000 (CA AB
                  2622). The system will automatically flag non-compliant quotes.
                </p>
              </div>
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Upload Job Photos
              </h3>
              <span className="text-sm text-slate-600">
                {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
              </span>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition group">
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 p-4 rounded-full mb-3 group-hover:bg-purple-200 transition">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-slate-900 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-500">
                  PNG, JPG, HEIC up to 10MB each
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.preview}
                      alt="Upload"
                      className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      <ImageIcon size={12} className="inline mr-1" />
                      Image {photos.indexOf(photo) + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Generate Button */}
            {photos.length > 0 && !quote && (
              <button
                onClick={generateQuote}
                disabled={analyzing}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing photos with AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Quote with AI
                  </>
                )}
              </button>
            )}
          </div>

          {/* Generated Quote */}
          {quote && (
            <>
              {/* Compliance Warning */}
              {!isCompliant() && (
                <div className="bg-red-50 border-2 border-red-300 text-red-800 p-5 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="flex-shrink-0 mt-0.5" size={24} />
                  <div>
                    <p className="font-bold text-lg mb-2">⚠️ Compliance Alert</p>
                    <p className="text-sm">
                      This quote exceeds $1,000. As an unlicensed provider, you
                      cannot accept this job under CA AB 2622. Please reduce the
                      scope or refer this client to a licensed contractor.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    Generated Quote
                  </h3>
                  <button
                    onClick={addLineItem}
                    className="text-sm text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Line Item
                  </button>
                </div>

                {/* Quote Items */}
                <div className="space-y-4 mb-6">
                  {quote.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="border-2 border-slate-200 rounded-xl p-4 hover:border-purple-200 transition"
                    >
                      {editingItem?.id === item.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-700 mb-1 block">
                              Description
                            </label>
                            <input
                              type="text"
                              value={editingItem.description}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  description: e.target.value,
                                })
                              }
                              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                Labor Hours
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={editingItem.laborHours}
                                onChange={(e) => {
                                  const hours = parseFloat(e.target.value);
                                  const laborCost = hours * provider.base_rate;
                                  setEditingItem({
                                    ...editingItem,
                                    laborHours: hours,
                                    laborCost,
                                    total: laborCost + editingItem.materials,
                                  });
                                }}
                                className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                Materials ($)
                              </label>
                              <input
                                type="number"
                                value={editingItem.materials}
                                onChange={(e) => {
                                  const materials = parseFloat(e.target.value);
                                  setEditingItem({
                                    ...editingItem,
                                    materials,
                                    total: editingItem.laborCost + materials,
                                  });
                                }}
                                className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              />
                            </div>
                          </div>
                          <button
                            onClick={saveEditItem}
                            className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                          >
                            <Check size={18} />
                            Save Changes
                          </button>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                                  #{index + 1}
                                </span>
                                <h4 className="font-semibold text-slate-900">
                                  {item.description}
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-blue-600" />
                                  <span>
                                    {item.laborHours} hrs × ${provider.base_rate}
                                    /hr
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign
                                    size={16}
                                    className="text-green-600"
                                  />
                                  <span>Materials: ${item.materials.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-slate-900">
                                ${item.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-3 border-t border-slate-200">
                            <button
                              onClick={() => startEditItem(item)}
                              className="flex-1 text-sm py-2 px-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center justify-center gap-1"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => removeLineItem(item.id)}
                              className="text-sm py-2 px-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quote Summary */}
                <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${quote.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Buffer/Disposal Fee (20%)</span>
                    <span className="font-semibold">
                      ${quote.bufferFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-slate-900 pt-3 border-t-2 border-slate-300">
                    <span>Total</span>
                    <span className="text-purple-600">
                      ${quote.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={clientInfo.name}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, name: e.target.value })
                      }
                      className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, email: e.target.value })
                      }
                      className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, phone: e.target.value })
                      }
                      className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => saveQuote("sent")}
                  disabled={!isCompliant()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  <Send size={20} />
                  Send Quote to Client
                </button>
                <button
                  onClick={() => saveQuote("draft")}
                  disabled={!isCompliant()}
                  className="flex-1 bg-white border-2 border-slate-300 text-slate-700 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save as Draft
                </button>
                <button
                  onClick={() => {
                    setQuote(null);
                    setPhotos([]);
                    setClientInfo({ name: "", email: "", phone: "" });
                  }}
                  className="px-6 py-3.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
                >
                  Start Over
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <QuoteHistory quotes={savedQuotes} />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-xl p-4 text-center`}
    >
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm font-medium opacity-80">{label}</p>
    </div>
  );
}

// Quote History Component
function QuoteHistory({ quotes }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="text-slate-400" size={40} />
        </div>
        <p className="text-slate-900 font-semibold text-lg mb-2">
          No quotes yet
        </p>
        <p className="text-slate-600 mb-6">
          Create your first AI-powered quote to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-lg mb-1">
                {quote.client_name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(quote.created_at)}
                </span>
                {quote.client_email && (
                  <span className="text-slate-400">•</span>
                )}
                {quote.client_email && <span>{quote.client_email}</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 mb-2">
                ${(quote.total / 100).toFixed(2)}
              </p>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusColor(
                  quote.status
                )}`}
              >
                {quote.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-200">
            <button className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <Eye size={16} />
              View Details
            </button>
            <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2">
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}