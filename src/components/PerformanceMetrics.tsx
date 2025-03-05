
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Example data
const monthlyData = [
  { name: 'Jan', personalVP: 20, groupVP: 45, earnings: 2000 },
  { name: 'Feb', personalVP: 25, groupVP: 60, earnings: 2500 },
  { name: 'Mar', personalVP: 30, groupVP: 80, earnings: 3200 },
  { name: 'Apr', personalVP: 22, groupVP: 70, earnings: 2800 },
  { name: 'May', personalVP: 35, groupVP: 100, earnings: 4000 },
  { name: 'Jun', personalVP: 40, groupVP: 120, earnings: 4800 },
];

const teamData = [
  { name: 'Direct', value: 8 },
  { name: 'Level 2', value: 15 },
  { name: 'Level 3', value: 6 },
];

const COLORS = ['#3a86ff', '#8338ec', '#ff006e'];

const PerformanceMetrics = () => {
  const [period, setPeriod] = useState("6m");
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-medium">Performance Metrics</CardTitle>
          <Tabs 
            defaultValue="6m" 
            className="w-full max-w-[400px] mt-2 md:mt-0"
            onValueChange={setPeriod}
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-0 shadow-none">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Volume Points</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}VP`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="personalVP" 
                      stroke="#3a86ff" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="groupVP" 
                      stroke="#ff006e" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Earnings (R)</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `R${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                      formatter={(value) => [`R${value}`, 'Earnings']}
                    />
                    <Bar 
                      dataKey="earnings" 
                      fill="#8338ec" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Team Composition</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {teamData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                      formatter={(value, name) => [`${value} consultants`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                {teamData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
