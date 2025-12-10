import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import DayCard from "./components/DayCard";
import BottomNav from "./components/BottomNav";
import NoteModal from "./components/NoteModal";
import NotesList from "./components/NotesList";
import MetroInfo from "./components/MetroInfo";
import { itinerary } from "./data/itinerary";
import { useNotes } from "./hooks/useNotes";

function App() {
  const [activeTab, setActiveTab] = useState("itinerary");
  const [expandedDay, setExpandedDay] = useState(1);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const { notes, loading, error, submitting, addNote, deleteNote } = useNotes();

  const handleToggleDay = (dayNum) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="px-4 py-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "itinerary" && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {itinerary.map((day) => (
                <DayCard
                  key={day.day}
                  day={day}
                  isExpanded={expandedDay === day.day}
                  onToggle={() => handleToggleDay(day.day)}
                />
              ))}
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
                <h2 className="text-lg font-bold mb-4 text-gray-800">
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
