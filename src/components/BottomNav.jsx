import { motion } from "framer-motion";
import { FaRoute, FaStickyNote, FaSubway, FaPlus } from "react-icons/fa";

const tabs = [
  { id: "itinerary", label: "行程", icon: FaRoute },
  { id: "notes", label: "備註", icon: FaStickyNote },
  { id: "metro", label: "地鐵", icon: FaSubway },
];

export default function BottomNav({ activeTab, onTabChange, onAddNote }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? "text-pink-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-pink-500 rounded-b-full"
                />
              )}
              <Icon className="text-xl mb-0.5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}

        {/* Add Note FAB */}
        <button
          onClick={onAddNote}
          className="absolute -top-6 right-4 w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow active:scale-95"
        >
          <FaPlus className="text-xl" />
        </button>
      </div>
    </nav>
  );
}
