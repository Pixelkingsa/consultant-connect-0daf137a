
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageOpen, Clock, CheckCircle, XCircle, FileText, ChevronRight } from "lucide-react";

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock orders data - in a real app this would come from the backend
  const orders = [
    {
      id: "ORD-1234",
      date: "2023-06-15",
      status: "delivered",
      total: 125.99,
      items: [
        { name: "Vamna Essence Parfum", quantity: 1, price: 79.99 },
        { name: "Vamna Body Lotion", quantity: 1, price: 45.99 }
      ]
    },
    {
      id: "ORD-1235",
      date: "2023-06-28",
      status: "shipped",
      total: 89.99,
      items: [
        { name: "Vamna Cologne for Men", quantity: 1, price: 89.99 }
      ]
    },
    {
      id: "ORD-1236",
      date: "2023-07-05",
      status: "processing",
      total: 159.98,
      items: [
        { name: "Vamna Premium Collection", quantity: 1, price: 159.98 }
      ]
    },
    {
      id: "ORD-1237",
      date: "2023-07-12",
      status: "cancelled",
      total: 45.99,
      items: [
        { name: "Vamna Body Mist", quantity: 1, price: 45.99 }
      ]
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Shipped</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Processing</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <PackageOpen className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
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
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        {getStatusIcon(order.status)}
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-lg font-semibold">
                        Total: ${order.total.toFixed(2)}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <PackageOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button onClick={() => navigate("/shop")}>Browse Products</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-6">
            {orders.filter(o => o.status === "processing").length > 0 ? (
              orders.filter(o => o.status === "processing").map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  {/* ... Same card content as above ... */}
                  <CardHeader className="bg-gray-50 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        {getStatusIcon(order.status)}
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-lg font-semibold">
                        Total: ${order.total.toFixed(2)}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No processing orders</h3>
                <p className="text-muted-foreground">You don't have any orders in processing status.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shipped" className="space-y-6">
            {/* Similar content for shipped orders */}
            {orders.filter(o => o.status === "shipped").length > 0 ? (
              orders.filter(o => o.status === "shipped").map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  {/* Similar card structure */}
                  <CardHeader className="bg-gray-50 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        {getStatusIcon(order.status)}
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Similar content */}
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-lg font-semibold">
                        Total: ${order.total.toFixed(2)}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <PackageOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No shipped orders</h3>
                <p className="text-muted-foreground">You don't have any orders that are currently shipped.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="delivered" className="space-y-6">
            {/* Similar content for delivered orders */}
            {orders.filter(o => o.status === "delivered").length > 0 ? (
              orders.filter(o => o.status === "delivered").map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  {/* Similar card structure */}
                  <CardHeader className="bg-gray-50 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        {getStatusIcon(order.status)}
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Similar content */}
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-lg font-semibold">
                        Total: ${order.total.toFixed(2)}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
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
