import { motion } from "framer-motion";
import { FaLightbulb } from "react-icons/fa";

export default function TipsList({ tips }) {
  if (!tips || tips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100"
    >
      <h4 className="text-base font-bold text-amber-700 flex items-center gap-2 mb-3">
        <FaLightbulb />
        注意事項
      </h4>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
