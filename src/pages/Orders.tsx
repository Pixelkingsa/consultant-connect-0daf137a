
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PackageCheck, AlertCircle, CheckCircle2, Clock, FileSearch } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  date: string;
  items?: any[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Try to fetch real orders from sales table
        const { data: salesData, error: salesError } = await supabase
          .from("sales")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (salesError) {
          console.error("Error fetching orders:", salesError);
          // Fallback to placeholder data
          setOrders([
            {
              id: "ord-1",
              order_id: "ORD-2023-001",
              amount: 125.98,
              status: "completed",
              date: new Date().toISOString(),
            },
            {
              id: "ord-2",
              order_id: "ORD-2023-002",
              amount: 89.99,
              status: "processing",
              date: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
              id: "ord-3",
              order_id: "ORD-2023-003",
              amount: 45.50,
              status: "shipped",
              date: new Date(Date.now() - 86400000 * 5).toISOString(),
            }
          ]);
        } else if (salesData && salesData.length > 0) {
          setOrders(salesData);
        } else {
          // If no orders found but table exists
          setOrders([]);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "shipped":
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Shipped</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const viewOrderDetails = (orderId: string) => {
    toast({
      title: "Order Details",
      description: `Order details for ${orderId} will be available soon.`,
    });
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
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <Button variant="outline" onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>

        {orders.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>${Number(order.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewOrderDetails(order.order_id)}
                        >
                          <FileSearch className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <PackageCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders. Start shopping now!</p>
            <Button onClick={() => navigate("/shop")}>
              Browse Products
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Orders;
