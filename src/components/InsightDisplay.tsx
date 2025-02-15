
import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface InsightDisplayProps {
  insight: string;
}

const InsightDisplay: React.FC<InsightDisplayProps> = ({ insight }) => {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-4">
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/50 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-200 ring-1 ring-inset ring-blue-700/10">
              Insight
            </span>
          </div>
          <p className="text-lg leading-relaxed">{insight}</p>
        </div>
      </motion.div>
    </Card>
  );
};

export default InsightDisplay;
