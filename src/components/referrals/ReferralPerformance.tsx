
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReferredUser, PerformanceMetric } from "./types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ReferralPerformanceProps {
  referrals: ReferredUser[];
  isPlaceholder: boolean;
}

const ReferralPerformance = ({ referrals, isPlaceholder }: ReferralPerformanceProps) => {
  // Generate placeholder performance data
  const placeholderMetrics: PerformanceMetric[] = [
    {
      userId: "placeholder1",
      userName: "Jane Smith",
      sales: 3200,
      recruits: 4,
      activity: 95,
      growth: 12
    },
    {
      userId: "placeholder2",
      userName: "John Doe",
      sales: 2800,
      recruits: 2,
      activity: 85,
      growth: 8
    },
    {
      userId: "placeholder3",
      userName: "Alice Johnson",
      sales: 1500,
      recruits: 1,
      activity: 70,
      growth: -2
    },
    {
      userId: "placeholder4",
      userName: "Mike Wilson",
      sales: 4100,
      recruits: 5,
      activity: 90,
      growth: 15
    },
    {
      userId: "placeholder5",
      userName: "Sara Davis",
      sales: 2300,
      recruits: 2,
      activity: 75,
      growth: 4
    },
    {
      userId: "placeholder6",
      userName: "Tom Jackson",
      sales: 1800,
      recruits: 0,
      activity: 60,
      growth: -5
    },
  ];
  
  // Sort by sales (highest first)
  const performanceData = [...placeholderMetrics].sort((a, b) => b.sales - a.sales);
  
  // Calculate averages and totals
  const totalSales = performanceData.reduce((sum, item) => sum + item.sales, 0);
  const totalRecruits = performanceData.reduce((sum, item) => sum + item.recruits, 0);
  const averageActivity = Math.round(
    performanceData.reduce((sum, item) => sum + item.activity, 0) / performanceData.length
  );
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Team Sales</p>
          <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-gray-500">New Team Members</p>
          <p className="text-2xl font-bold">{totalRecruits}</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-gray-500">Average Activity Score</p>
          <p className="text-2xl font-bold">{averageActivity}%</p>
          <p className="text-xs text-muted-foreground mt-1">Based on login frequency & sales</p>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Team Member Performance</h3>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Recruits</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((metric) => (
                <TableRow key={metric.userId}>
                  <TableCell className="font-medium">{metric.userName}</TableCell>
                  <TableCell>${metric.sales.toLocaleString()}</TableCell>
                  <TableCell>{metric.recruits}</TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${metric.activity}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center ${metric.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.growth >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(metric.growth)}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {isPlaceholder && (
        <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800 border border-yellow-100">
          <p className="font-medium">This is example data</p>
          <p>Real performance metrics will be shown once your team members become active.</p>
        </div>
      )}
    </div>
  );
};

export default ReferralPerformance;
