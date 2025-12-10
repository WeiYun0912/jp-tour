import { motion } from "framer-motion";
import { FaSubway, FaMapMarkerAlt } from "react-icons/fa";
import { metroInfo } from "../data/itinerary";

export default function MetroInfo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-800">
          <FaSubway className="text-red-500" />
          地鐵快速索引
        </h2>

        <div className="space-y-3">
          {metroInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100"
            >
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                <span className="font-medium text-gray-800">{info.area}</span>
              </div>
              <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">
                {info.station}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metro Line Info */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h3 className="font-bold text-gray-800 mb-3">御堂筋線 (紅線)</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">M11</span>
            <span className="text-xs">江坂</span>
          </div>
          <div className="flex-1 h-1 bg-red-500 min-w-8" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">M16</span>
            <span className="text-xs">梅田</span>
          </div>
          <div className="flex-1 h-1 bg-red-500 min-w-8" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">M19</span>
            <span className="text-xs">心齋橋</span>
          </div>
          <div className="flex-1 h-1 bg-red-500 min-w-8" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">M22</span>
            <span className="text-xs">動物園前</span>
          </div>
          <div className="flex-1 h-1 bg-red-500 min-w-8" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">M30</span>
            <span className="text-xs">中百舌鳥</span>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-md p-4 text-white">
        <h3 className="font-bold mb-2">南海電鐵資訊</h3>
        <ul className="text-sm space-y-1 opacity-90">
          <li>- 特急 Rapi:t (藍色彩繪車廂)</li>
          <li>- 30分鐘發一班</li>
          <li>- 關西機場 → 難波：約34分鐘</li>
          <li>- 難波搭車月台：第9月台</li>
        </ul>
      </div>
    </motion.div>
  );
}
