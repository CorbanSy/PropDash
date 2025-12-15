// src/components/ProviderDashboard/Schedule/components/QuickActionsMenu.jsx
import { useEffect, useRef } from "react";
import { Eye, Ban, Clock, CheckCircle2 } from "lucide-react";

export default function QuickActionsMenu({
  date,
  x,
  y,
  dateInfo,
  onClose,
  onViewDetails,
  onBlockDate,
  onSetCustomHours,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const formatDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const actions = [
    {
      label: "View Details",
      icon: <Eye size={16} />,
      onClick: onViewDetails,
      show: true,
    },
    {
      label: "Block This Date",
      icon: <Ban size={16} />,
      onClick: onBlockDate,
      show: dateInfo.type !== "blocked",
      danger: true,
    },
    {
      label: "Set Custom Hours",
      icon: <Clock size={16} />,
      onClick: onSetCustomHours,
      show: dateInfo.type !== "blocked",
    },
    {
      label: "Remove Override",
      icon: <CheckCircle2 size={16} />,
      onClick: () => {
        onClose();
      },
      show: dateInfo.type === "blocked" || dateInfo.type === "custom",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border-2 border-secondary-200 py-2 min-w-[200px]"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        {/* Header */}
        <div className="px-4 py-2 border-b border-secondary-200">
          <p className="font-semibold text-secondary-900 text-sm">{formatDate}</p>
          <p className="text-xs text-secondary-500 capitalize">{dateInfo.type}</p>
        </div>

        {/* Actions */}
        <div className="py-1">
          {actions
            .filter((action) => action.show)
            .map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-all duration-200 ${
                  action.danger
                    ? "text-error-600 hover:bg-error-50"
                    : "text-secondary-700 hover:bg-secondary-100"
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
        </div>

        {/* Jobs Count */}
        {dateInfo.jobs && dateInfo.jobs.length > 0 && (
          <div className="px-4 py-2 border-t border-secondary-200">
            <p className="text-xs text-secondary-600">
              {dateInfo.jobs.length} {dateInfo.jobs.length === 1 ? "booking" : "bookings"} on
              this day
            </p>
          </div>
        )}
      </div>
    </>
  );
}