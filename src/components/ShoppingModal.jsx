import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaShoppingCart } from "react-icons/fa";

export default function ShoppingModal({ isOpen, onClose, onSave, submitting }) {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.trim()) return;

    const success = await onSave({ item: item.trim(), quantity: quantity.trim() });
    if (success) {
      setItem("");
      setQuantity("");
      onClose();
    }
  };

  // 常用購物項目建議
  const suggestions = [
    "藥妝",
    "零食",
    "伴手禮",
    "衣服",
    "電器",
    "文具",
    "扭蛋",
    "化妝品",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="max-w-lg mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaShoppingCart className="text-emerald-500" />
                  新增購物項目
                </h2>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 項目名稱 */}
                <div>
                  <label className="block text-xl font-bold text-gray-700 mb-2">
                    要買什麼？
                  </label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="例如：藥妝、零食..."
                    className="w-full px-4 py-4 text-xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    autoFocus
                  />
                  {/* 建議標籤 */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setItem(s)}
                        className="px-4 py-2 text-lg bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 數量備註 */}
                <div>
                  <label className="block text-xl font-bold text-gray-700 mb-2">
                    數量或備註 (選填)
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="例如：3盒、送阿姨..."
                    className="w-full px-4 py-4 text-xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* 提交按鈕 */}
                <button
                  type="submit"
                  disabled={!item.trim() || submitting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                >
                  {submitting ? "儲存中..." : "新增"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
