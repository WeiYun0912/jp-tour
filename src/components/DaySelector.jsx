import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { itinerary } from "../data/itinerary";

export default function DaySelector({ selectedDay, onSelectDay }) {
    const containerRef = useRef(null);

    // 自動滾動到選中的日期
    useEffect(() => {
        if (containerRef.current) {
            const selectedBtn = containerRef.current.querySelector(`[data-day="${selectedDay}"]`);
            if (selectedBtn) {
                selectedBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
        }
    }, [selectedDay]);

    return (
        <div className="sticky top-[74px] z-40 bg-gray-50 py-3 -mx-4 px-4 shadow-sm">
            <div
                ref={containerRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {itinerary.map((day) => {
                    const isSelected = selectedDay === day.day;
                    return (
                        <button
                            key={day.day}
                            data-day={day.day}
                            onClick={() => onSelectDay(day.day)}
                            className={`relative flex-shrink-0 px-4 py-3 rounded-2xl transition-all ${
                                isSelected
                                    ? `bg-gradient-to-r ${day.color} text-white shadow-lg scale-105`
                                    : "bg-white text-gray-600 shadow hover:shadow-md"
                            }`}
                        >
                            <div className="text-center">
                                <div className={`text-lg font-bold ${isSelected ? "" : "text-gray-800"}`}>
                                    DAY {day.day}
                                </div>
                                <div className={`text-sm ${isSelected ? "opacity-90" : "text-gray-500"}`}>
                                    {day.date}
                                </div>
                            </div>
                            {isSelected && (
                                <motion.div
                                    layoutId="dayIndicator"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
