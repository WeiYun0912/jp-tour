import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStickyNote, FaExchangeAlt, FaShoppingCart } from "react-icons/fa";
import NotesList from "./NotesList";
import CurrencyConverter from "./CurrencyConverter";
import ShoppingList from "./ShoppingList";
import { useNotes } from "../hooks/useNotes";

const tabs = [
  { id: "shopping", label: "購物", icon: FaShoppingCart },
  { id: "notes", label: "備註", icon: FaStickyNote },
  { id: "currency", label: "匯率", icon: FaExchangeAlt },
];

export default function ToolsPage({ activeSubTab, onSubTabChange }) {
  const { notes, loading, error, submitting, deleteNote } = useNotes();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Tab 切換 */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSubTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon className="text-xl" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 內容 */}
      <AnimatePresence mode="wait">
        {activeSubTab === "shopping" && (
          <motion.div
            key="shopping"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ShoppingList />
          </motion.div>
        )}

        {activeSubTab === "notes" && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">我的備註</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-lg">
                  {error}
                </div>
              )}
              <NotesList
                notes={notes}
                loading={loading}
                onDelete={deleteNote}
                submitting={submitting}
              />
            </div>
          </motion.div>
        )}

        {activeSubTab === "currency" && (
          <motion.div
            key="currency"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CurrencyConverter />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
