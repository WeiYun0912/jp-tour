import { motion } from "framer-motion";
import { FaPlane, FaCalendarAlt, FaHotel } from "react-icons/fa";
import { tripInfo } from "../data/itinerary";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg"
    >
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-1">
          <FaPlane className="text-xl" />
          <h1 className="text-xl font-bold">{tripInfo.title}</h1>
        </div>
        <div className="flex items-center gap-4 text-sm opacity-90">
          <span className="flex items-center gap-1">
            <FaCalendarAlt />
            {tripInfo.dateRange}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs mt-2 opacity-80">
          <FaHotel />
          <span className="truncate">{tripInfo.hotel.name}</span>
        </div>
      </div>
    </motion.header>
  );
}
