
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps { 
  title: string; 
  value: string | number; 
  description: string; 
  icon: React.ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
