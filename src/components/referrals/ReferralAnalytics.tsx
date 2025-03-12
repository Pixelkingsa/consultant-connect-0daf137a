
import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/custom-chart";
import { ReferredUser, ConversionRate } from "./types";
import { Activity, TrendingUp, Users } from "lucide-react";

interface ReferralAnalyticsProps {
  referrals: ReferredUser[];
  isPlaceholder: boolean;
}

const ReferralAnalytics = ({ referrals, isPlaceholder }: ReferralAnalyticsProps) => {
  // Generate placeholder analytics data when no real data is available
  const placeholderConversionRates: ConversionRate[] = [
    { period: 'Jan', rate: 65, count: 13, total: 20 },
    { period: 'Feb', rate: 75, count: 15, total: 20 },
    { period: 'Mar', rate: 60, count: 12, total: 20 },
    { period: 'Apr', rate: 80, count: 16, total: 20 },
    { period: 'May', rate: 85, count: 17, total: 20 },
    { period: 'Jun', rate: 70, count: 14, total: 20 },
  ];
  
  // Convert the data for the chart
  const chartData = placeholderConversionRates.map(rate => ({
    month: rate.period,
    'Conversion Rate': rate.rate,
    'Team Growth': rate.count * 5,
  }));
  
  // Calculate statistics
  const averageConversion = Math.round(
    placeholderConversionRates.reduce((sum, item) => sum + item.rate, 0) / placeholderConversionRates.length
  );
  
  const totalReferrals = isPlaceholder ? 87 : referrals.length;
  const activeReferrals = isPlaceholder ? 
    72 : 
    referrals.filter(user => user.status === 'active').length;
  const conversionRate = isPlaceholder ? averageConversion : (activeReferrals / totalReferrals * 100);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <p className="text-2xl font-bold">{totalReferrals}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Referrals</p>
              <p className="text-2xl font-bold">{activeReferrals}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Conversion Over Time</h3>
        <div className="h-[300px]">
          <BarChart 
            data={chartData}
            index="month"
            categories={['Conversion Rate', 'Team Growth']}
            colors={['#8b5cf6', '#60a5fa']}
          />
        </div>
      </Card>
      
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 border border-blue-100">
        <p className="font-medium mb-2">Analytics Insights</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Your conversion rate is {isPlaceholder ? "above" : "matching"} the network average.</li>
          <li>Most of your referrals join within 7 days of invitation.</li>
          <li>Team members who participate in monthly training have 30% higher retention rates.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralAnalytics;
