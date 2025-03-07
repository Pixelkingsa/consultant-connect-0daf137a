
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Calendar, ChevronRight, Star, ShoppingBag, TrendingUp, 
  Award, MessageSquare, FileText, Users
} from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  image?: string;
  read: boolean;
}

const News = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Mock news data
  const newsItems: NewsItem[] = [
    {
      id: "news-1",
      title: "New Summer Fragrances Collection Launch",
      date: "2023-06-15",
      category: "product",
      summary: "Exciting new summer fragrances are now available in your catalog.",
      content: "We're thrilled to announce the launch of our new Summer Fragrances Collection! This exclusive collection features five new scents inspired by tropical destinations. These new products are now available in your catalog for you to showcase to your customers. The collection includes: Ocean Breeze, Tropical Paradise, Sunset Dreams, Exotic Flower, and Coconut Escape. Limited quantities available, so be sure to stock up! Each fragrance comes with matching body care products that your customers will love.",
      image: "https://i.pravatar.cc/300?img=30",
      read: false
    },
    {
      id: "news-2",
      title: "Updated Compensation Plan",
      date: "2023-06-10",
      category: "business",
      summary: "We've updated our compensation plan to better reward our Vamna Agents.",
      content: "We're excited to announce improvements to our compensation plan that will help you earn more from your Vamna business! The updated plan includes higher retail profit margins on premium collections, a new team bonus structure that rewards leadership development, and additional rank achievement bonuses. These changes will take effect on July 1st, 2023. We'll be hosting training webinars throughout June to help you understand how to maximize your earnings under the new plan. Check the Events calendar for dates and times.",
      read: true
    },
    {
      id: "news-3",
      title: "Annual Convention Registration Now Open",
      date: "2023-06-05",
      category: "event",
      summary: "Register now for our annual convention in Las Vegas this September.",
      content: "Registration is now open for our 2023 Annual Vamna Convention! Join us in Las Vegas from September 15-17 for three days of inspiration, education, and celebration. This year's theme is 'Elevate Your Success' and will feature keynote speakers, product launches, recognition ceremonies, and networking opportunities. Early bird pricing is available until July 31st. We encourage all agents to attend this transformative event that will provide you with strategies and tools to take your business to the next level.",
      image: "https://i.pravatar.cc/300?img=31",
      read: false
    },
    {
      id: "news-4",
      title: "New Digital Marketing Tools Available",
      date: "2023-05-28",
      category: "tools",
      summary: "Check out our new social media templates and digital marketing resources.",
      content: "We've expanded our digital marketing toolkit with new resources to help you grow your business online! The new tools include customizable social media templates for Instagram and Facebook, product photography that you can use on your channels, pre-written email sequences for customer follow-ups, and a guide to creating effective TikTok content. All of these resources are now available in your Agent Portal under the Marketing Tools section. We'll be hosting a webinar next week to walk you through how to use these resources effectively.",
      read: true
    },
    {
      id: "news-5",
      title: "Recognition: Top Performers of the Month",
      date: "2023-05-15",
      category: "recognition",
      summary: "Congratulations to our top performing Vamna Agents in May!",
      content: "We're proud to recognize our top performing Vamna Agents for the month of May! Congratulations to Sarah Johnson for achieving the highest personal sales volume, Michael Chen for the most team growth, and Priya Patel for the most new customer acquisitions. These outstanding agents have demonstrated exceptional dedication to their businesses and teams. We'll be featuring their success stories and strategies in our upcoming webinar series 'Success Spotlights' starting next month.",
      image: "https://i.pravatar.cc/300?img=32",
      read: false
    }
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "product":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case "business":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "tools":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "recognition":
        return <Award className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "product":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Product</Badge>;
      case "business":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Business</Badge>;
      case "event":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Event</Badge>;
      case "tools":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Tools</Badge>;
      case "recognition":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Recognition</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading news...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">News & Updates</h1>
          {selectedNews && (
            <Button variant="outline" onClick={() => setSelectedNews(null)}>
              Back to All News
            </Button>
          )}
        </div>

        {!selectedNews ? (
          <>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Updates</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="product">Products</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {newsItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedNews(item)}
                    className="cursor-pointer"
                  >
                    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${!item.read ? 'border-l-4 border-l-accent' : ''}`}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {item.image && (
                            <div className="md:w-1/4 h-48 md:h-auto">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className={`flex-1 p-6 ${item.image ? 'md:w-3/4' : 'w-full'}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getCategoryIcon(item.category)}
                                  {getCategoryBadge(item.category)}
                                  {!item.read && (
                                    <Badge variant="outline" className="bg-accent/10 text-accent">New</Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                                <p className="text-muted-foreground mb-4">{item.summary}</p>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="unread" className="space-y-6">
                {newsItems.filter(item => !item.read).length > 0 ? (
                  newsItems.filter(item => !item.read).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedNews(item)}
                      className="cursor-pointer"
                    >
                      <Card className="overflow-hidden transition-shadow hover:shadow-md border-l-4 border-l-accent">
                        {/* Same card content as above */}
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {item.image && (
                              <div className="md:w-1/4 h-48 md:h-auto">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className={`flex-1 p-6 ${item.image ? 'md:w-3/4' : 'w-full'}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getCategoryIcon(item.category)}
                                    {getCategoryBadge(item.category)}
                                    <Badge variant="outline" className="bg-accent/10 text-accent">New</Badge>
                                  </div>
                                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                                  <p className="text-muted-foreground mb-4">{item.summary}</p>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(item.date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No unread updates</h3>
                    <p className="text-muted-foreground">You're all caught up!</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Similar content structure for other tabs */}
              <TabsContent value="product" className="space-y-6">
                {newsItems.filter(item => item.category === "product").length > 0 ? (
                  newsItems.filter(item => item.category === "product").map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedNews(item)}
                      className="cursor-pointer"
                    >
                      <Card className={`overflow-hidden transition-shadow hover:shadow-md ${!item.read ? 'border-l-4 border-l-accent' : ''}`}>
                        {/* Same card content */}
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {item.image && (
                              <div className="md:w-1/4 h-48 md:h-auto">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className={`flex-1 p-6 ${item.image ? 'md:w-3/4' : 'w-full'}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getCategoryIcon(item.category)}
                                    {getCategoryBadge(item.category)}
                                    {!item.read && (
                                      <Badge variant="outline" className="bg-accent/10 text-accent">New</Badge>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                                  <p className="text-muted-foreground mb-4">{item.summary}</p>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(item.date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No product updates</h3>
                    <p className="text-muted-foreground">There are no product updates available at this time.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="business" className="space-y-6">
                {/* Similar structure for business updates */}
                {newsItems.filter(item => item.category === "business").length > 0 ? (
                  newsItems.filter(item => item.category === "business").map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedNews(item)}
                      className="cursor-pointer"
                    >
                      <Card className={`overflow-hidden transition-shadow hover:shadow-md ${!item.read ? 'border-l-4 border-l-accent' : ''}`}>
                        {/* Same card content structure */}
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {item.image && (
                              <div className="md:w-1/4 h-48 md:h-auto">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className={`flex-1 p-6 ${item.image ? 'md:w-3/4' : 'w-full'}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getCategoryIcon(item.category)}
                                    {getCategoryBadge(item.category)}
                                    {!item.read && (
                                      <Badge variant="outline" className="bg-accent/10 text-accent">New</Badge>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                                  <p className="text-muted-foreground mb-4">{item.summary}</p>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(item.date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No business updates</h3>
                    <p className="text-muted-foreground">There are no business updates available at this time.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="event" className="space-y-6">
                {/* Similar structure for event updates */}
                {newsItems.filter(item => item.category === "event").length > 0 ? (
                  newsItems.filter(item => item.category === "event").map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedNews(item)}
                      className="cursor-pointer"
                    >
                      <Card className={`overflow-hidden transition-shadow hover:shadow-md ${!item.read ? 'border-l-4 border-l-accent' : ''}`}>
                        {/* Same card content structure */}
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {item.image && (
                              <div className="md:w-1/4 h-48 md:h-auto">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className={`flex-1 p-6 ${item.image ? 'md:w-3/4' : 'w-full'}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getCategoryIcon(item.category)}
                                    {getCategoryBadge(item.category)}
                                    {!item.read && (
                                      <Badge variant="outline" className="bg-accent/10 text-accent">New</Badge>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                                  <p className="text-muted-foreground mb-4">{item.summary}</p>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(item.date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No event updates</h3>
                    <p className="text-muted-foreground">There are no event updates available at this time.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(selectedNews.category)}
                {getCategoryBadge(selectedNews.category)}
              </div>
              <CardTitle className="text-2xl">{selectedNews.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Published on {new Date(selectedNews.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {selectedNews.image && (
                <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                  <img 
                    src={selectedNews.image} 
                    alt={selectedNews.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                <p className="text-lg mb-4 font-medium">{selectedNews.summary}</p>
                <p className="whitespace-pre-line">{selectedNews.content}</p>
              </div>
              
              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Star className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Button onClick={() => setSelectedNews(null)}>
                  Back to All News
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default News;
