import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaTrash,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { useShoppingList } from "../hooks/useShoppingList";

export default function ShoppingList({ onAdd }) {
  const { items, loading, error, submitting, toggleItem, deleteItem } =
    useShoppingList();

  // 分類：未完成 / 已完成
  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* 標題卡 */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaShoppingCart />
            購物清單
          </h2>
          <div className="text-lg bg-white/20 px-4 py-2 rounded-full font-bold">
            {uncheckedItems.length} 項待買
          </div>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-lg">
          {error}
        </div>
      )}

      {/* 載入中 */}
      {loading && (
        <div className="flex justify-center py-8">
          <FaSpinner className="text-3xl text-emerald-500 animate-spin" />
        </div>
      )}

      {/* 購物清單 */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-md p-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaShoppingCart className="text-5xl mx-auto mb-3 opacity-30" />
              <p className="text-xl">還沒有購物項目</p>
              <p className="text-lg mt-1">點右下角 + 新增</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 待買項目 */}
              {uncheckedItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-600 mb-3">待買</h3>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {uncheckedItems.map((item) => (
                        <ShoppingItem
                          key={item.id}
                          item={item}
                          onToggle={() => toggleItem(item.id)}
                          onDelete={() => deleteItem(item.id)}
                          submitting={submitting}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* 已買項目 */}
              {checkedItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-400 mb-3">已買</h3>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {checkedItems.map((item) => (
                        <ShoppingItem
                          key={item.id}
                          item={item}
                          onToggle={() => toggleItem(item.id)}
                          onDelete={() => deleteItem(item.id)}
                          submitting={submitting}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function ShoppingItem({ item, onToggle, onDelete, submitting }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
        item.checked
          ? "bg-gray-50 border-gray-200"
          : "bg-emerald-50 border-emerald-200"
      }`}
    >
      {/* 勾選按鈕 */}
      <button
        onClick={onToggle}
        disabled={submitting}
        className={`w-10 h-10 rounded-full border-3 flex items-center justify-center transition-all flex-shrink-0 ${
          item.checked
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-emerald-400 hover:bg-emerald-100"
        }`}
      >
        {item.checked && <FaCheck className="text-lg" />}
      </button>

      {/* 項目內容 */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xl font-medium truncate ${
            item.checked ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {item.item}
        </p>
        {item.quantity && (
          <p className="text-lg text-gray-500">{item.quantity}</p>
        )}
      </div>

      {/* 刪除按鈕 */}
      <button
        onClick={onDelete}
        disabled={submitting}
        className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
      >
        <FaTrash className="text-lg" />
      </button>
    </motion.div>
  );
}
