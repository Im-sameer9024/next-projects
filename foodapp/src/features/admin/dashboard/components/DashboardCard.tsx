"use client";

import { DashboardDataProps } from "@/shared/data/data";
import { motion } from "framer-motion";

type Props = {
  data: DashboardDataProps;
};

const DashboardCard = ({ data }: Props) => {
  const Icon = data.icon;

  return (
    <motion.div
      aria-label="single-dashboard-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
    >
      {/* Icon */}
      <div
        className={`p-2 sm:p-3 rounded-lg flex items-center justify-center ${data.color}`}
      >
        <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
      </div>

      {/* Content */}
      <div className="space-y-1 text-right">
        <p className="text-xs sm:text-sm text-gray-500">{data.title}</p>

        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
          {data.value}
        </h2>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
