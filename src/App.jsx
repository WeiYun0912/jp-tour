import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import DaySelector from "./components/DaySelector";
import DayCard from "./components/DayCard";
import BottomNav from "./components/BottomNav";
import NoteModal from "./components/NoteModal";
import ShoppingModal from "./components/ShoppingModal";
import ToolsPage from "./components/ToolsPage";
import MetroInfo from "./components/MetroInfo";
import { itinerary } from "./data/itinerary";
import { useNotes } from "./hooks/useNotes";
import { useShoppingList } from "./hooks/useShoppingList";

function App() {
  const [activeTab, setActiveTab] = useState("itinerary");
  const [selectedDay, setSelectedDay] = useState(1);
  const [toolsSubTab, setToolsSubTab] = useState("notes"); // notes, currency, shopping
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);

  const { addNote, submitting: noteSubmitting } = useNotes();
  const { addItem, submitting: shoppingSubmitting } = useShoppingList();

  // 取得當前選擇的日期行程
  const currentDay = itinerary.find((d) => d.day === selectedDay);

  // 處理 + 按鈕點擊
  const handleAddClick = () => {
    if (toolsSubTab === "notes") {
      setIsNoteModalOpen(true);
    } else if (toolsSubTab === "shopping") {
      setIsShoppingModalOpen(true);
    }
  };

  // 判斷是否顯示 + 按鈕 (只在小工具頁面的備註或購物清單 tab 顯示)
  const showAddButton =
    activeTab === "tools" && (toolsSubTab === "notes" || toolsSubTab === "shopping");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="px-4 py-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "itinerary" && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 日期選擇器 */}
              <DaySelector
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />

              {/* 當天行程 */}
              <div className="mt-4">
                <AnimatePresence mode="wait">
                  {currentDay && (
                    <motion.div
                      key={currentDay.day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DayCard day={currentDay} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === "tools" && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ToolsPage
                activeSubTab={toolsSubTab}
                onSubTabChange={setToolsSubTab}
              />
            </motion.div>
          )}

          {activeTab === "metro" && (
            <motion.div
              key="metro"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MetroInfo />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={handleAddClick}
        showAddButton={showAddButton}
      />

      {/* 備註 Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={addNote}
        submitting={noteSubmitting}
      />

      {/* 購物清單 Modal */}
      <ShoppingModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
        onSave={addItem}
        submitting={shoppingSubmitting}
      />
    </div>
  );
}

export default App;
