import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import DaySelector from "./components/DaySelector";
import DayCard from "./components/DayCard";
import BottomNav from "./components/BottomNav";
import NoteModal from "./components/NoteModal";
import NotesList from "./components/NotesList";
import MetroInfo from "./components/MetroInfo";
import { itinerary } from "./data/itinerary";
import { useNotes } from "./hooks/useNotes";

function App() {
  const [activeTab, setActiveTab] = useState("itinerary");
  const [selectedDay, setSelectedDay] = useState(1);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const { notes, loading, error, submitting, addNote, deleteNote } = useNotes();

  // 取得當前選擇的日期行程
  const currentDay = itinerary.find((d) => d.day === selectedDay);

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

          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-white rounded-2xl shadow-md p-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  我的備註
                </h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
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
        onAddNote={() => setIsNoteModalOpen(true)}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={addNote}
        submitting={submitting}
      />
    </div>
  );
}

export default App;
