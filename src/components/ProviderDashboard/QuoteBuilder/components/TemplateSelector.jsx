//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\components\TemplateSelector.jsx
import { X, FileText, Check } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { getTemplateList, getTemplate } from "../utils/templates";

export default function TemplateSelector({ onSelect, onClose }) {
  const templates = getTemplateList();

  const handleSelect = (templateKey) => {
    const template = getTemplate(templateKey);
    onSelect(template);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <h2 className={theme.text.h2}>Choose Quote Template</h2>
            <p className={theme.text.caption}>Start with a pre-built template for faster quoting</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.key}
                template={template}
                onSelect={() => handleSelect(template.key)}
              />
            ))}

            {/* Blank Template */}
            <button
              onClick={() => onSelect(null)}
              className="p-6 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition text-left"
            >
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 text-slate-600 p-3 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Blank Template</h4>
                  <p className="text-sm text-slate-600">Start from scratch with no pre-filled items</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="p-6 rounded-lg border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition text-left"
    >
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
          <FileText size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-1">{template.name}</h4>
          <p className="text-sm text-slate-600">{template.description}</p>
        </div>
        <Check size={20} className="text-blue-600 opacity-0 group-hover:opacity-100" />
      </div>
    </button>
  );
}