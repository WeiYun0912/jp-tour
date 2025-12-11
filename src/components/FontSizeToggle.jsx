import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronRight, FaChevronLeft, FaFont } from "react-icons/fa";

const fontSizes = [
  { id: "small", label: "小", scale: "text-sm" },
  { id: "medium", label: "中", scale: "text-base" },
  { id: "large", label: "大", scale: "text-lg" },
];

export default function FontSizeToggle({ fontSize, onFontSizeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="absolute left-12 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-3 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <FaFont className="text-gray-600" />
              <span className="font-bold text-gray-700">字體大小</span>
            </div>
            <div className="flex flex-col gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    onFontSizeChange(size.id);
                    setIsOpen(false);
                  }}
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                    fontSize === size.id
                      ? "bg-pink-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 開關按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-16 bg-white shadow-lg rounded-r-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-l-0 border-gray-200"
      >
        {isOpen ? (
          <FaChevronLeft className="text-lg" />
        ) : (
          <FaChevronRight className="text-lg" />
        )}
      </button>
    </div>
  );
}
