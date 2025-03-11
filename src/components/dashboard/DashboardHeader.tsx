
import React from "react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  profileName: string | null;
  userEmail: string | null;
  rankName: string | null;
  teamSize: number;
  personalVolume: number;
}

const DashboardHeader = ({ 
  profileName, 
  userEmail, 
  rankName, 
  teamSize, 
  personalVolume 
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {profileName || userEmail}</h1>
        <p className="text-muted-foreground">
          Your current rank: <Badge variant="outline" className="ml-1 bg-black text-white">{rankName || "Starter"}</Badge>
        </p>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
          Team Size: {teamSize || 0} members
        </Badge>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
          PV Points: {personalVolume || 0}
        </Badge>
      </div>
    </div>
  );
};

export default DashboardHeader;
