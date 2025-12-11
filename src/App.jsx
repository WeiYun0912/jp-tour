import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import DaySelector from "./components/DaySelector";
import DayCard from "./components/DayCard";
import BottomNav from "./components/BottomNav";
import NoteModal from "./components/NoteModal";
import ShoppingModal from "./components/ShoppingModal";
import ToolsPage from "./components/ToolsPage";
import MetroInfo from "./components/MetroInfo";
import FontSizeToggle from "./components/FontSizeToggle";
import { itinerary } from "./data/itinerary";
import { useNotes } from "./hooks/useNotes";
import { useShoppingList } from "./hooks/useShoppingList";

// localStorage keys
const STORAGE_KEYS = {
  mainTab: "jp-tour-main-tab",
  selectedDay: "jp-tour-selected-day",
  toolsSubTab: "jp-tour-tools-subtab",
  fontSize: "jp-tour-font-size",
};

// 從 localStorage 讀取初始值
function getStoredValue(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState(() =>
    getStoredValue(STORAGE_KEYS.mainTab, "itinerary")
  );
  const [selectedDay, setSelectedDay] = useState(() =>
    getStoredValue(STORAGE_KEYS.selectedDay, 1)
  );
  const [toolsSubTab, setToolsSubTab] = useState(() =>
    getStoredValue(STORAGE_KEYS.toolsSubTab, "shopping")
  );
  const [fontSize, setFontSize] = useState(() =>
    getStoredValue(STORAGE_KEYS.fontSize, "medium")
  );
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);

  const { addNote, submitting: noteSubmitting } = useNotes();
  const { addItem, submitting: shoppingSubmitting } = useShoppingList();

  // 儲存 tab 狀態到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mainTab, JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedDay, JSON.stringify(selectedDay));
  }, [selectedDay]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.toolsSubTab, JSON.stringify(toolsSubTab));
  }, [toolsSubTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.fontSize, JSON.stringify(fontSize));
  }, [fontSize]);

  // 切換主 tab 時滾動到頂部
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 切換小工具 sub tab 時滾動到頂部
  const handleSubTabChange = (subTab) => {
    setToolsSubTab(subTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 切換日期時滾動到頂部
  const handleDayChange = (day) => {
    setSelectedDay(day);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 字體大小 class
  const fontSizeClass = {
    small: "font-size-small",
    medium: "font-size-medium",
    large: "font-size-large",
  }[fontSize];

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
    <div className={`min-h-screen bg-gray-50 pb-20 ${fontSizeClass}`}>
      <Header />

      {/* 字體大小調整按鈕 */}
      <FontSizeToggle fontSize={fontSize} onFontSizeChange={setFontSize} />

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
                onSelectDay={handleDayChange}
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
                onSubTabChange={handleSubTabChange}
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
        onTabChange={handleTabChange}
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
