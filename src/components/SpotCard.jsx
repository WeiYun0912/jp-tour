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
  FaMapMarked,
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

// 開啟 Google Maps
function openGoogleMaps(query) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
}

export default function SpotCard({ spot, index }) {
  const Icon = iconMap[spot.icon] || FaMapMarkerAlt;
  const colorClass = typeColors[spot.type] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative border-2 rounded-2xl p-4 ${colorClass} shadow-sm`}
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute -top-3 left-8 w-1 h-3 bg-gray-300" />
      )}

      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
          <Icon className="text-2xl" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold text-lg leading-tight">{spot.name}</h4>
            {spot.time && (
              <span className="flex-shrink-0 flex items-center gap-1 text-base bg-white/60 px-3 py-1 rounded-full font-medium">
                <FaClock className="text-sm" />
                {spot.time}
              </span>
            )}
          </div>

          {spot.location && (
            <p className="text-base mt-2 flex items-center gap-2 opacity-80">
              <FaMapMarkerAlt className="text-sm flex-shrink-0" />
              <span>{spot.location}</span>
            </p>
          )}

          {spot.description && (
            <p className="text-base mt-2 leading-relaxed opacity-90">
              {spot.description}
            </p>
          )}

          {spot.walkInfo && (
            <p className="text-base mt-3 flex items-start gap-2 text-gray-600 bg-white/50 p-2 rounded-lg">
              <FaWalking className="text-sm flex-shrink-0 mt-1" />
              <span>{spot.walkInfo}</span>
            </p>
          )}

          {spot.alternative && (
            <p className="text-base mt-3 flex items-start gap-2 text-orange-600 bg-orange-50 p-3 rounded-xl">
              <FaInfoCircle className="text-sm flex-shrink-0 mt-1" />
              <span>{spot.alternative}</span>
            </p>
          )}

          {/* Google Maps 按鈕 */}
          {spot.mapQuery && (
            <button
              onClick={() => openGoogleMaps(spot.mapQuery)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-gray-50 border-2 border-current rounded-xl font-bold text-base transition-colors active:scale-95"
            >
              <FaMapMarked className="text-lg" />
              開啟 Google 地圖
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
