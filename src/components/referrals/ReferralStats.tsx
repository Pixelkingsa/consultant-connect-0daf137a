
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award } from "lucide-react";

interface ReferralStatsProps {
  totalDownlines: number;
  activeConsultants: number;
  teamSales: number;
  teamPerformance: string;
  commission: number;
  commissionPercentage: number;
}

const ReferralStats = ({
  totalDownlines,
  activeConsultants,
  teamSales,
  teamPerformance,
  commission,
  commissionPercentage,
}: ReferralStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Downlines Card */}
      <Card className="border rounded-lg overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Total Downlines</h3>
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">{totalDownlines}</p>
              <p className="text-sm text-gray-500 mt-1">{activeConsultants} active consultants</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Team Sales Card */}
      <Card className="border rounded-lg overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Team Sales</h3>
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-4">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">${teamSales.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{teamPerformance}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Commission Card */}
      <Card className="border rounded-lg overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Commission</h3>
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-4">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">${commission}</p>
              <p className="text-sm text-gray-500 mt-1">{commissionPercentage}% of total team sales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralStats;
