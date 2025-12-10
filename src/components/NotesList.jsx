import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStickyNote,
  FaTrash,
  FaCalendarDay,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { itinerary } from "../data/itinerary";

// 格式化日期時間
function formatDateTime(timestamp) {
  if (!timestamp) return "";

  let date;
  if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else if (typeof timestamp === "string") {
    // 處理 ISO 格式或其他字串格式
    date = new Date(timestamp);
  } else {
    return String(timestamp);
  }

  if (isNaN(date.getTime())) return String(timestamp);

  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 取得日期標題
function getDayTitle(dayId) {
  const day = itinerary.find((d) => String(d.day) === String(dayId));
  return day ? `DAY ${day.day} - ${day.title}` : `DAY ${dayId}`;
}

export default function NotesList({ notes, loading, onDelete, submitting }) {
  // 按 dayId 分組
  const groupedNotes = useMemo(() => {
    if (!notes || notes.length === 0) return {};

    const groups = {};

    notes.forEach((note) => {
      const key = note.dayId ? String(note.dayId) : "general";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(note);
    });

    // 排序：先顯示有日期的（按日期排序），最後顯示沒有關聯日期的
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === "general") return 1;
      if (b === "general") return -1;
      return Number(a) - Number(b);
    });

    return { groups, sortedKeys };
  }, [notes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin text-2xl text-pink-500" />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaStickyNote className="text-4xl mx-auto mb-2 opacity-30" />
        <p className="text-base">還沒有備註</p>
        <p className="text-sm opacity-70">點擊右下角按鈕新增</p>
      </div>
    );
  }

  const { groups, sortedKeys } = groupedNotes;

  return (
    <div className="space-y-6">
      {sortedKeys.map((key) => (
        <div key={key}>
          {/* 分組標題 */}
          <div className="flex items-center gap-2 mb-3">
            <FaCalendarDay className="text-pink-500" />
            <h3 className="font-bold text-gray-700">
              {key === "general" ? "一般備註" : getDayTitle(key)}
            </h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
              {groups[key].length}
            </span>
          </div>

          {/* 該分組的備註 */}
          <div className="space-y-3">
            <AnimatePresence>
              {groups[key].map((note, index) => (
                <motion.div
                  key={note.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-xl p-4 bg-amber-50 text-amber-800 border-amber-200 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                      <FaStickyNote className="text-base text-amber-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {note.name && (
                        <p className="text-sm font-medium text-amber-600 flex items-center gap-1 mb-1">
                          <FaUser className="text-xs" />
                          {note.name}
                        </p>
                      )}

                      <p className="text-base leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>

                      {note.timestamp && (
                        <p className="text-sm text-amber-600/70 mt-2">
                          {formatDateTime(note.timestamp)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onDelete(note.id)}
                      disabled={submitting}
                      className="flex-shrink-0 p-2 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
                    >
                      <FaTrash className="text-sm text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
