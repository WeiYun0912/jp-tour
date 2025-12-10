import { motion } from "framer-motion";
import SpotCard from "./SpotCard";
import FoodList from "./FoodList";
import TipsList from "./TipsList";

export default function DayCard({ day }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden"
    >
      {/* Header */}
      <div className={`p-4 bg-gradient-to-r ${day.color} text-white`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">DAY {day.day}</span>
          <span className="text-base bg-white/20 px-3 py-1 rounded-full">
            {day.date}
          </span>
        </div>
        <h3 className="text-xl font-medium mt-2">{day.title}</h3>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Sections (for Day 4 with North/East areas) */}
        {day.sections ? (
          day.sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-4">
              <h4 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                {section.name}
              </h4>
              <div className="space-y-3 ml-1">
                {day.spots
                  .filter((spot) => section.ids.includes(spot.id))
                  .map((spot, index) => (
                    <SpotCard key={spot.id} spot={spot} index={index} />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3">
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
  );
}
