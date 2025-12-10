import { motion, AnimatePresence } from "framer-motion";
import {
  FaStickyNote,
  FaTrash,
  FaCalendarDay,
  FaSpinner,
  FaUser,
} from "react-icons/fa";

export default function NotesList({ notes, loading, onDelete, submitting }) {
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
        <p className="text-sm">還沒有備註</p>
        <p className="text-xs opacity-70">點擊右下角按鈕新增</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {notes.map((note, index) => (
          <motion.div
            key={note.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="border rounded-xl p-3 bg-amber-50 text-amber-800 border-amber-200 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                <FaStickyNote className="text-sm text-amber-600" />
              </div>

              <div className="flex-1 min-w-0">
                {note.name && (
                  <p className="text-xs font-medium text-amber-600 flex items-center gap-1 mb-1">
                    <FaUser className="text-[10px]" />
                    {note.name}
                  </p>
                )}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>

                <div className="flex items-center gap-3 mt-2 text-xs opacity-70">
                  {note.dayId && (
                    <span className="flex items-center gap-1">
                      <FaCalendarDay />
                      DAY {note.dayId}
                    </span>
                  )}
                  {note.timestamp && (
                    <span>
                      {typeof note.timestamp === "number"
                        ? new Date(note.timestamp).toLocaleDateString("zh-TW")
                        : note.timestamp}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDelete(note.id)}
                disabled={submitting}
                className="flex-shrink-0 p-2 hover:bg-white/50 rounded-full transition-colors disabled:opacity-50"
              >
                <FaTrash className="text-xs opacity-50 hover:opacity-100" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
