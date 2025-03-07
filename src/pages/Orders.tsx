import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PackageOpen, TruckIcon, CheckCircle, Clock, Search, FilterIcon, X } from "lucide-react";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2023-1001",
      date: "2023-10-25",
      total: 159.97,
      status: "delivered",
      items: [
        { id: "prod-1", name: "Vamna Essence Parfum", price: 79.99, quantity: 1, image: "https://i.pravatar.cc/150?img=1" },
        { id: "prod-2", name: "Vamna Body Lotion", price: 39.99, quantity: 2, image: "https://i.pravatar.cc/150?img=2" }
      ]
    },
    {
      id: "ORD-2023-1002",
      date: "2023-11-12",
      total: 89.99,
      status: "shipped",
      items: [
        { id: "prod-3", name: "Vamna Cologne for Men", price: 89.99, quantity: 1, image: "https://i.pravatar.cc/150?img=3" }
      ]
    },
    {
      id: "ORD-2023-1003",
      date: "2023-12-03",
      total: 124.98,
      status: "processing",
      items: [
        { id: "prod-4", name: "Vamna Gift Set", price: 124.98, quantity: 1, image: "https://i.pravatar.cc/150?img=4" }
      ]
    }
  ]);

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

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-amber-50 text-amber-500 border-amber-200">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <TruckIcon className="h-5 w-5 text-amber-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-medium">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Order Total</p>
                      <p className="text-lg font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-6">
            {orders.filter(order => order.status === "processing").map((order) => (
              <Card key={order.id}>
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-medium">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Order Total</p>
                      <p className="text-lg font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {orders.filter(order => order.status === "processing").length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No processing orders</h3>
                <p className="text-muted-foreground">You don't have any orders being processed at the moment.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shipped" className="space-y-6">
            {orders.filter(order => order.status === "shipped").map((order) => (
              <Card key={order.id}>
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-medium">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Order Total</p>
                      <p className="text-lg font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {orders.filter(order => order.status === "shipped").length === 0 && (
              <div className="text-center py-12">
                <TruckIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No shipped orders</h3>
                <p className="text-muted-foreground">You don't have any orders being shipped at the moment.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="delivered" className="space-y-6">
            {orders.filter(order => order.status === "delivered").map((order) => (
              <Card key={order.id}>
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-medium">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Order Total</p>
                      <p className="text-lg font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {orders.filter(order => order.status === "delivered").length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No delivered orders</h3>
                <p className="text-muted-foreground">You don't have any delivered orders yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Orders;
