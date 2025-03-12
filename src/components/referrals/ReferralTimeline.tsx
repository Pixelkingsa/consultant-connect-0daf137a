
import { Card } from "@/components/ui/card";
import { ReferredUser, ActivityEvent } from "./types";
import { CalendarClock, ShoppingBag, UserPlus, Award } from "lucide-react";
import { format, parseISO, subDays } from "date-fns";

interface ReferralTimelineProps {
  referrals: ReferredUser[];
  isPlaceholder: boolean;
}

const ReferralTimeline = ({ referrals, isPlaceholder }: ReferralTimelineProps) => {
  // Generate placeholder timeline data
  const today = new Date();
  
  const placeholderEvents: ActivityEvent[] = [
    {
      userId: "placeholder1",
      userName: "Jane Smith",
      eventType: "signup",
      date: subDays(today, 2).toISOString(),
      description: "Joined your team as a new consultant"
    },
    {
      userId: "placeholder2",
      userName: "John Doe",
      eventType: "purchase",
      date: subDays(today, 5).toISOString(),
      description: "Made first product purchase ($150)"
    },
    {
      userId: "placeholder3",
      userName: "Alice Johnson",
      eventType: "referral",
      date: subDays(today, 7).toISOString(),
      description: "Referred 2 new team members"
    },
    {
      userId: "placeholder4",
      userName: "Mike Wilson",
      eventType: "rank_change",
      date: subDays(today, 10).toISOString(),
      description: "Advanced to Silver rank"
    },
    {
      userId: "placeholder5",
      userName: "Sara Davis",
      eventType: "purchase",
      date: subDays(today, 14).toISOString(),
      description: "Purchased starter kit ($350)"
    },
    {
      userId: "placeholder6",
      userName: "Tom Jackson",
      eventType: "signup",
      date: subDays(today, 20).toISOString(),
      description: "Joined your team as a new consultant"
    },
  ];
  
  // Sort events by date (newest first)
  const events = placeholderEvents.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get icon based on event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'signup':
        return <UserPlus className="h-4 w-4" />;
      case 'purchase':
        return <ShoppingBag className="h-4 w-4" />;
      case 'referral':
        return <UserPlus className="h-4 w-4" />;
      case 'rank_change':
        return <Award className="h-4 w-4" />;
      default:
        return <CalendarClock className="h-4 w-4" />;
    }
  };
  
  // Get background color based on event type
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'signup':
        return 'bg-blue-100 text-blue-600';
      case 'purchase':
        return 'bg-green-100 text-green-600';
      case 'referral':
        return 'bg-purple-100 text-purple-600';
      case 'rank_change':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <div className="text-sm text-muted-foreground">
          Showing last 30 days
        </div>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <div className="divide-y">
          {events.map((event, index) => (
            <div key={index} className="p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full mt-0.5 ${getEventColor(event.eventType)}`}>
                  {getEventIcon(event.eventType)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{event.userName}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(event.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {isPlaceholder && (
        <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800 border border-yellow-100">
          <p className="font-medium">This is example data</p>
          <p>Real activity will be shown once your team members become active.</p>
        </div>
      )}
    </div>
  );
};

export default ReferralTimeline;
