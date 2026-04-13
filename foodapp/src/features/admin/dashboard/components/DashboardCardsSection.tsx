import React from "react";
import DashboardCard from "./DashboardCard";
import { DashboardData } from "@/shared/data/data";

const DashboardCardsSection = () => {
  return (
    <section aria-label="dashboard-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {DashboardData.map((item) => {
        return <DashboardCard key={item.id} data={item} />;
      })}
    </section>
  );
};

export default DashboardCardsSection;