
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Calendar, 
  Award, 
  Gift, 
  User, 
  Megaphone,
  ChevronDown
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: "announcement" | "promotion" | "event" | "incentive";
  date: string;
  is_read?: boolean;
}

const News = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Try to fetch real news/announcements from incentives table
        const { data: incentivesData, error: incentivesError } = await supabase
          .from("incentives")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (!incentivesError && incentivesData && incentivesData.length > 0) {
          // Map incentives to news items
          const mappedItems: NewsItem[] = incentivesData.map(item => ({
            id: item.id,
            title: item.title,
            content: item.description,
            type: "incentive",
            date: item.created_at,
            is_read: false
          }));
          setNewsItems(mappedItems);
        } else {
          // Fallback to placeholder data
          setNewsItems([
            {
              id: "news-1",
              title: "New Summer Collection Launch",
              content: "Introducing our new Summer Collection of fragrances, featuring fresh and vibrant scents perfect for the season. Get 15% off for a limited time.",
              type: "announcement",
              date: new Date().toISOString(),
              is_read: false
            },
            {
              id: "news-2",
              title: "Consultant Rank Promotions",
              content: "Congratulations to all consultants who achieved new ranks last month! Special mention to Sarah Thompson who reached Diamond status.",
              type: "promotion",
              date: new Date(Date.now() - 2 * 86400000).toISOString(),
              is_read: true
            },
            {
              id: "news-3",
              title: "Upcoming Virtual Training Event",
              content: "Join us on July 15 for a virtual training session on social media marketing strategies for promoting your business online.",
              type: "event",
              date: new Date(Date.now() - 5 * 86400000).toISOString(),
              is_read: true
            },
            {
              id: "news-4",
              title: "Double Volume Points Promotion",
              content: "For the entire month of July, earn double volume points on all purchases. This is a perfect opportunity to boost your rank and earnings!",
              type: "incentive",
              date: new Date(Date.now() - 7 * 86400000).toISOString(),
              is_read: false
            },
            {
              id: "news-5",
              title: "New Consultant Welcome Package",
              content: "We're excited to announce our enhanced welcome package for new consultants, now including product samples, marketing materials, and a personalized training session.",
              type: "announcement",
              date: new Date(Date.now() - 10 * 86400000).toISOString(),
              is_read: true
            }
          ]);
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const markAsRead = (id: string) => {
    setNewsItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, is_read: true } 
          : item
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      case "promotion":
        return <Award className="h-5 w-5 text-amber-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "incentive":
        return <Gift className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filterNewsByType = (type: string | null) => {
    if (!type) return newsItems;
    return newsItems.filter(item => item.type === type);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading news and updates...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">News & Updates</h1>
            <p className="text-muted-foreground">Stay informed about the latest company announcements</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-md">
            <Bell className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList>
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="announcement">Announcements</TabsTrigger>
            <TabsTrigger value="promotion">Promotions</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="incentive">Incentives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6 space-y-4">
            {filterNewsByType(null).map(item => (
              <NewsCard 
                key={item.id}
                item={item}
                isExpanded={expandedItems.includes(item.id)}
                onToggleExpand={() => toggleExpand(item.id)}
                onMarkAsRead={() => markAsRead(item.id)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="announcement" className="mt-6 space-y-4">
            {filterNewsByType("announcement").length > 0 ? (
              filterNewsByType("announcement").map(item => (
                <NewsCard 
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.includes(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  onMarkAsRead={() => markAsRead(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No announcements</p>
                <p className="text-muted-foreground">There are no announcements at this time.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="promotion" className="mt-6 space-y-4">
            {filterNewsByType("promotion").length > 0 ? (
              filterNewsByType("promotion").map(item => (
                <NewsCard 
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.includes(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  onMarkAsRead={() => markAsRead(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No promotions</p>
                <p className="text-muted-foreground">There are no promotions at this time.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="event" className="mt-6 space-y-4">
            {filterNewsByType("event").length > 0 ? (
              filterNewsByType("event").map(item => (
                <NewsCard 
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.includes(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  onMarkAsRead={() => markAsRead(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No events</p>
                <p className="text-muted-foreground">There are no events scheduled at this time.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="incentive" className="mt-6 space-y-4">
            {filterNewsByType("incentive").length > 0 ? (
              filterNewsByType("incentive").map(item => (
                <NewsCard 
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.includes(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  onMarkAsRead={() => markAsRead(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No incentives</p>
                <p className="text-muted-foreground">There are no incentives available at this time.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

interface NewsCardProps {
  item: NewsItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMarkAsRead: () => void;
}

const NewsCard = ({ item, isExpanded, onToggleExpand, onMarkAsRead }: NewsCardProps) => {
  useEffect(() => {
    if (isExpanded && !item.is_read) {
      onMarkAsRead();
    }
  }, [isExpanded, item.is_read, onMarkAsRead]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      case "promotion":
        return <Award className="h-5 w-5 text-amber-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "incentive":
        return <Gift className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className={`border-l-4 ${
      item.is_read ? 'border-l-gray-200 dark:border-l-gray-800' : 'border-l-primary'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getTypeIcon(item.type)}
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </div>
          <button 
            onClick={onToggleExpand}
            className="p-1 rounded-full hover:bg-muted"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <CardDescription>
          {format(new Date(item.date), "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <p>{item.content}</p>
        </CardContent>
      )}
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-4">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>For all consultants</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default News;
