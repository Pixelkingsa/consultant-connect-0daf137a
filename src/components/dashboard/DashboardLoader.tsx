
import React from "react";
import { Loader } from "@/components/ui/loader";

const DashboardLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" text="Loading your dashboard data..." />
    </div>
  );
};

export default DashboardLoader;
