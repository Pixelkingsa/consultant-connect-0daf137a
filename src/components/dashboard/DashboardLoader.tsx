
import React from "react";
import { Loader } from "@/components/ui/loader";

const DashboardLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Loading Dashboard</h2>
        <p className="text-muted-foreground">Please wait a moment...</p>
      </div>
    </div>
  );
};

export default DashboardLoader;
