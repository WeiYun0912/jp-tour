import { motion } from "framer-motion";
import {
  FaPlane,
  FaTrain,
  FaHotel,
  FaGamepad,
  FaShoppingBag,
  FaCamera,
  FaMapMarkerAlt,
  FaWalking,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import { MdAttractions, MdPets } from "react-icons/md";
import { BsBuildingFill } from "react-icons/bs";

const iconMap = {
  plane: FaPlane,
  train: FaTrain,
  hotel: FaHotel,
  game: FaGamepad,
  shopping: FaShoppingBag,
  photo: FaCamera,
  ferris: MdAttractions,
  zoo: MdPets,
  tower: BsBuildingFill,
};

const typeColors = {
  transport: "bg-blue-100 text-blue-700 border-blue-200",
  hotel: "bg-purple-100 text-purple-700 border-purple-200",
  attraction: "bg-amber-100 text-amber-700 border-amber-200",
  shopping: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function SpotCard({ spot, index }) {
  const Icon = iconMap[spot.icon] || FaMapMarkerAlt;
  const colorClass = typeColors[spot.type] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative border rounded-xl p-3 ${colorClass} shadow-sm`}
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute -top-3 left-6 w-0.5 h-3 bg-gray-300" />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
          <Icon className="text-lg" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-sm leading-tight">{spot.name}</h4>
            {spot.time && (
              <span className="flex-shrink-0 flex items-center gap-1 text-xs bg-white/60 px-2 py-0.5 rounded-full">
                <FaClock className="text-[10px]" />
                {spot.time}
              </span>
            )}
          </div>

          {spot.location && (
            <p className="text-xs mt-1 flex items-center gap-1 opacity-80">
              <FaMapMarkerAlt className="text-[10px] flex-shrink-0" />
              <span className="truncate">{spot.location}</span>
            </p>
          )}

          {spot.description && (
            <p className="text-xs mt-1.5 leading-relaxed opacity-90">
              {spot.description}
            </p>
          )}

          {spot.walkInfo && (
            <p className="text-xs mt-1.5 flex items-start gap-1 text-gray-600">
              <FaWalking className="text-[10px] flex-shrink-0 mt-0.5" />
              <span>{spot.walkInfo}</span>
            </p>
          )}

          {spot.alternative && (
            <p className="text-xs mt-1.5 flex items-start gap-1 text-orange-600 bg-orange-50 p-1.5 rounded">
              <FaInfoCircle className="text-[10px] flex-shrink-0 mt-0.5" />
              <span>{spot.alternative}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
