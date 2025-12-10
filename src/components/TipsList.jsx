import { motion } from "framer-motion";
import { FaLightbulb } from "react-icons/fa";

export default function TipsList({ tips }) {
  if (!tips || tips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-3 bg-amber-50 rounded-lg p-3 border border-amber-100"
    >
      <h4 className="text-sm font-bold text-amber-700 flex items-center gap-2 mb-2">
        <FaLightbulb />
        注意事項
      </h4>
      <ul className="space-y-1">
        {tips.map((tip, i) => (
          <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
