import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, Trash2, MinusCircle, PlusCircle, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types/cart";
import { Loader } from "@/components/ui/loader";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Fetch cart items
        const { data, error: cartError } = await supabase
          .from("cart_items")
          .select(`
            *,
            products:product_id (
              name,
              price,
              image_url,
              vp_points
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (cartError) {
          console.error("Error fetching cart items:", cartError);
          toast({
            title: "Error",
            description: "Could not load your cart items.",
            variant: "destructive",
          });
        } else {
          setCartItems(data || []);
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate, toast]);
  
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(itemId);
    
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);
        
      if (error) {
        console.error("Error updating quantity:", error);
        toast({
          title: "Error",
          description: "Could not update item quantity.",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      );
      
      toast({
        title: "Cart Updated",
        description: "Item quantity has been updated.",
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdatingItem(null);
    }
  };
  
  const removeItem = async (itemId: string) => {
    setUpdatingItem(itemId);
    
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);
        
      if (error) {
        console.error("Error removing item:", error);
        toast({
          title: "Error",
          description: "Could not remove item from cart.",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdatingItem(null);
    }
  };
  
  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products?.price || 0) * item.quantity;
    }, 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  
  const handleCheckout = () => {
    // Placeholder for checkout functionality
    toast({
      title: "Checkout",
      description: "Checkout functionality will be implemented soon.",
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading your cart..." />
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-medium mb-2">Your cart is empty</p>
              <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button onClick={() => navigate("/shop")}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-md overflow-hidden">
                                <img 
                                  src={item.products?.image_url || "/placeholder.svg"} 
                                  alt={item.products?.name || "Product"} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{item.products?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ID: {item.product_id.substring(0, 8)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={!!updatingItem}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value);
                                  if (!isNaN(newQuantity) && newQuantity > 0) {
                                    updateQuantity(item.id, newQuantity);
                                  }
                                }}
                                className="w-16 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={!!updatingItem}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>${(item.products?.price || 0) * item.quantity}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => removeItem(item.id)}
                              disabled={!!updatingItem}
                            >
                              {updatingItem === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate("/shop")}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Cart;
