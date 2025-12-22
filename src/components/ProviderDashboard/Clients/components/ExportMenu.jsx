//levlpro-mvp\src\components\ProviderDashboard\Clients\components\ExportMenu.jsx
import { X, Download, FileText, Table } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { exportToCSV } from "../utils/clientExport";

export default function ExportMenu({ clients, jobs, onClose }) {
  const handleExportCSV = () => {
    exportToCSV(clients, jobs);
    onClose();
  };

  const handleExportPDF = () => {
    alert("PDF export coming soon!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className={theme.text.h2}>Export Clients</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className={theme.text.body}>
            Export {clients.length} client{clients.length !== 1 ? "s" : ""} with their data
          </p>

          {/* Export Options */}
          <div className="space-y-3">
            <button
              onClick={handleExportCSV}
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
              onClick={handleExportPDF}
              className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition text-left flex items-center gap-3"
            >
              <FileText className="text-red-600" size={24} />
              <div>
                <p className="font-semibold text-slate-900">Export as PDF</p>
                <p className="text-sm text-slate-600">
                  Formatted document ready to print or share
                </p>
              </div>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              💡 Exports include: Name, Email, Phone, Total Spent, Jobs Count, Status, Tags
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}