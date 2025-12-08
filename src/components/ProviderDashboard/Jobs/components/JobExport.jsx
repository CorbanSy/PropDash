// src/components/ProviderDashboard/Jobs/components/JobExport.jsx
import { X, Download, FileText, Table } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { formatCurrency, formatDate } from "../utils/jobCalculations";
import { getStatusBadge } from "../utils/jobHelpers";

export default function JobExport({ jobs, onClose }) {
  const exportToCSV = () => {
    const headers = [
      "Date",
      "Service",
      "Client",
      "Status",
      "Amount",
      "Paid",
      "Address",
      "Notes",
    ];

    const rows = jobs.map(job => [
      formatDate(job.scheduled_date),
      job.service_name || "",
      job.client_name || "",
      job.status || "",
      job.total || 0,
      job.paid ? "Yes" : "No",
      job.address || "",
      job.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jobs-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    onClose();
  };

  const exportToPDF = () => {
    alert("PDF export coming soon! For now, use CSV and convert to PDF.");
    onClose();
  };

  const totalRevenue = jobs
    .filter(j => j.status === "completed" || j.status === "paid")
    .reduce((sum, j) => sum + (j.total || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className={theme.text.h2}>Export Jobs</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Summary */}
          <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Exporting {jobs.length} job{jobs.length !== 1 ? "s" : ""}</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-slate-600 mt-1">Total Revenue</p>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <button
              onClick={exportToCSV}
              className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition text-left flex items-center gap-3"
            >
              <Table className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-slate-900">Export as CSV</p>
                <p className="text-sm text-slate-600">
                  Open in Excel, Google Sheets, or any spreadsheet app
                </p>
              </div>
            </button>

            <button
              onClick={exportToPDF}
              className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition text-left flex items-center gap-3"
            >
              <FileText className="text-red-600" size={24} />
              <div>
                <p className="font-semibold text-slate-900">Export as PDF</p>
                <p className="text-sm text-slate-600">
                  Formatted report ready to print or share
                </p>
              </div>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              💡 Exports include: Date, Service, Client, Status, Amount, Payment Status, Address, Notes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}