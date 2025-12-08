// src/components/ProviderDashboard/Schedule/components/CalendarDay.jsx
import { Ban } from "lucide-react";
import { formatTime } from "../utils/timeUtils";

export default function CalendarDay({
  date,
  dateInfo,
  isDragOver,
  onClick,
  onContextMenu,
  onDragOver,
  onDrop,
}) {
  if (!date) {
    return <div className="h-16"></div>;
  }

  const getTimeDisplay = () => {
    if (dateInfo.schedule?.type === "blocked") {
      return <Ban size={14} className="mx-auto" />;
    }

    if (dateInfo.schedule?.type === "custom" || dateInfo.schedule?.type === "available") {
      const blocks = dateInfo.schedule.blocks || [];
      if (blocks.length === 1) {
        return (
          <span className="text-[10px] leading-none">
            {formatTime(blocks[0].start)}-{formatTime(blocks[0].end)}
          </span>
        );
      } else if (blocks.length > 1) {
        return (
          <div className="flex flex-col gap-0.5 text-[9px] leading-none">
            {blocks.slice(0, 2).map((block, i) => (
              <span key={i}>
                {formatTime(block.start)}-{formatTime(block.end)}
              </span>
            ))}
            {blocks.length > 2 && <span className="text-[8px]">+{blocks.length - 2}</span>}
          </div>
        );
      }
    }
    return null;
  };

  const styles = {
    past: "bg-slate-50 text-slate-300 cursor-not-allowed",
    unavailable: "bg-slate-100 text-slate-400 hover:bg-slate-150 cursor-pointer",
    available:
      "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer border border-blue-200",
    booked:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer border border-emerald-300",
    blocked: "bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer border border-red-300",
    custom:
      "bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer border border-amber-300",
  };

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDragOver={onDragOver}
      onDrop={onDrop}
      disabled={dateInfo.type === "past"}
      className={`
        h-16 p-1 rounded transition relative flex flex-col items-center justify-center
        ${styles[dateInfo.type]}
        ${isToday ? "ring-2 ring-blue-600" : ""}
        ${isDragOver ? "ring-2 ring-green-500 bg-green-50" : ""}
      `}
    >
      <span className="text-sm font-semibold mb-0.5">{date.getDate()}</span>
      {getTimeDisplay()}
      {dateInfo.jobs?.length > 0 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
          {dateInfo.jobs.slice(0, 3).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-current rounded-full"></div>
          ))}
        </div>
      )}
    </button>
  );
}