import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SpotCard from "./SpotCard";
import FoodList from "./FoodList";
import TipsList from "./TipsList";

export default function DayCard({ day, isExpanded, onToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden"
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className={`w-full text-left p-4 bg-gradient-to-r ${day.color} text-white`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">DAY {day.day}</span>
              <span className="text-sm opacity-90 bg-white/20 px-2 py-0.5 rounded-full">
                {day.date}
              </span>
            </div>
            <h3 className="text-lg font-medium mt-1">{day.title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaChevronDown className="text-xl opacity-80" />
          </motion.div>
        </div>
      </button>

      {/* Content - Expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Sections (for Day 4 with North/East areas) */}
              {day.sections ? (
                day.sections.map((section, sIdx) => (
                  <div key={sIdx} className="mb-4">
                    <h4 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      {section.name}
                    </h4>
                    <div className="space-y-2 ml-1">
                      {day.spots
                        .filter((spot) => section.ids.includes(spot.id))
                        .map((spot, index) => (
                          <SpotCard key={spot.id} spot={spot} index={index} />
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  {day.spots.map((spot, index) => (
                    <SpotCard key={spot.id} spot={spot} index={index} />
                  ))}
                </div>
              )}

              {/* Tips */}
              <TipsList tips={day.tips} />

              {/* Foods */}
              <FoodList foods={day.foods} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
