
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PerformanceChartProps {
  data: any[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  return (
    <Card className="lg:col-span-2 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Performance Metrics</CardTitle>
        <CardDescription>Sales and referral performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="sales" 
                stroke="#000000" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: "#000000", strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="referrals" 
                stroke="#8884d8" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
