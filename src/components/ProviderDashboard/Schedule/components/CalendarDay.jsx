//levlpro-mvp\src\components\ProviderDashboard\Schedule\components\CalendarDay.jsx
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
    past: "bg-secondary-50 text-secondary-300 cursor-not-allowed",
    unavailable: "bg-secondary-100 text-secondary-400 hover:bg-secondary-150 cursor-pointer",
    available:
      "bg-primary-50 text-primary-700 hover:bg-primary-100 cursor-pointer border border-primary-200",
    booked:
      "bg-success-50 text-success-700 hover:bg-success-100 cursor-pointer border border-success-300",
    blocked: "bg-error-50 text-error-700 hover:bg-error-100 cursor-pointer border border-error-300",
    custom:
      "bg-warning-50 text-warning-700 hover:bg-warning-100 cursor-pointer border border-warning-300",
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
        h-16 p-1 rounded-lg transition-all duration-200 relative flex flex-col items-center justify-center
        ${styles[dateInfo.type]}
        ${isToday ? "ring-2 ring-primary-600" : ""}
        ${isDragOver ? "ring-2 ring-success-500 bg-success-50" : ""}
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