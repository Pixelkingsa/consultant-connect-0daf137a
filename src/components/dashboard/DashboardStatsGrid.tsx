
import React from "react";
import { CircleDollarSign, Users, TrendingUp, Award, Share2 } from "lucide-react";
import StatCard from "./StatCard";

interface DashboardStatsGridProps {
  monthlySalesTotal: number;
  teamSize: number;
  personalVolume: number;
  groupVolume: number;
  rankProgress: number;
  nextRankName: string;
}

const DashboardStatsGrid = ({
  monthlySalesTotal,
  teamSize,
  personalVolume,
  groupVolume,
  rankProgress,
  nextRankName
}: DashboardStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Monthly Sales" 
        value={`$${monthlySalesTotal.toFixed(2)}`} 
        description={monthlySalesTotal > 0 ? "Based on this month's data" : "No sales data yet"} 
        icon={<CircleDollarSign className="h-8 w-8 text-green-500" />} 
      />
      <StatCard 
        title="Team Members" 
        value={teamSize.toString()} 
        description="Build your team to earn more" 
        icon={<Users className="h-8 w-8 text-blue-500" />} 
      />
      <StatCard 
        title="Personal Volume" 
        value={personalVolume.toString()} 
        description={`Group Volume: ${groupVolume}`} 
        icon={<Share2 className="h-8 w-8 text-purple-500" />} 
      />
      <StatCard 
        title="Rank Progress" 
        value={`${rankProgress}%`} 
        description={`Next: ${nextRankName}`} 
        icon={<Award className="h-8 w-8 text-amber-500" />} 
      />
    </div>
  );
};

export default DashboardStatsGrid;
