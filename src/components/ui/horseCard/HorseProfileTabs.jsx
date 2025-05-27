import { motion } from "framer-motion";
import React from "react";

const HorseProfileTabs = ({ activeTab, onChange }) => {
  return (
    <div className="px-1 md:px-6 py-2 mb-4">
      <div className="flex justify-evenly px-0 sm:px-10 md:px-20 relative">
        <button
          className={`px-4 py-1 text-lg lg:text-xl lg:py-2 font-semibold relative ${
            activeTab === "info" ? "text-primary" : "text-gray"
          }`}
          onClick={() => onChange("info")}
        >
          About
          {activeTab === "info" && (
            <motion.div
              layoutId="horseUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          className={`px-4 py-1 text-lg lg:text-xl lg:py-2 font-semibold relative ${
            activeTab === "owners" ? "text-primary" : "text-gray"
          }`}
          onClick={() => onChange("owners")}
        >
          Riders
          {activeTab === "owners" && (
            <motion.div
              layoutId="horseUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default HorseProfileTabs;
