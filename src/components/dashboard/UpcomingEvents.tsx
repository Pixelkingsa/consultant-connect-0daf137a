
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const UpcomingEvents = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Stay updated with important dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-4 border-black pl-4 py-2">
            <p className="font-medium">New Collection Launch</p>
            <p className="text-sm text-muted-foreground">March 15, 2023</p>
          </div>
          <div className="border-l-4 border-black pl-4 py-2">
            <p className="font-medium">Team Training Webinar</p>
            <p className="text-sm text-muted-foreground">March 22, 2023</p>
          </div>
          <div className="border-l-4 border-black pl-4 py-2">
            <p className="font-medium">Spring Promotion Starts</p>
            <p className="text-sm text-muted-foreground">April 1, 2023</p>
          </div>
          <div className="border-l-4 border-black pl-4 py-2">
            <p className="font-medium">Annual Convention</p>
            <p className="text-sm text-muted-foreground">May 15-17, 2023</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
