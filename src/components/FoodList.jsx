import { motion } from "framer-motion";
import { FaUtensils, FaMapMarkerAlt } from "react-icons/fa";

export default function FoodList({ foods }) {
  if (!foods || foods.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-3 bg-red-50 rounded-lg p-3 border border-red-100"
    >
      <h4 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-2">
        <FaUtensils />
        推薦美食
      </h4>
      <div className="space-y-1.5">
        {foods.map((food, i) => (
          <div key={i} className="text-xs flex items-start gap-2">
            <span className="font-medium text-red-600">{food.name}</span>
            {food.location && (
              <span className="text-gray-500 flex items-center gap-1">
                <FaMapMarkerAlt className="text-[10px]" />
                {food.location}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
