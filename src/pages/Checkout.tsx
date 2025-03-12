
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { CartItem } from "@/types/cart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import EmptyCheckout from "@/components/checkout/EmptyCheckout";
import CheckoutLoading from "@/components/checkout/CheckoutLoading";
import { calculateSubtotal, calculateTax, calculateTotal } from "@/lib/checkoutUtils";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');

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

        // Generate a unique order ID
        setOrderId(`order-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate, toast]);

  const handleCreditCardSuccess = async () => {
    // Clear the cart
    if (user) {
      const { error: clearCartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (clearCartError) {
        console.error("Failed to clear cart:", clearCartError);
        toast({
          title: "Warning",
          description: "Your order was placed, but we couldn't clear your cart. Please refresh the page.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Wrapper functions for calculations to pass cart items
  const getSubtotal = () => calculateSubtotal(cartItems);
  const getTax = () => calculateTax(cartItems);
  const getTotal = () => calculateTotal(cartItems);
  
  if (loading) {
    return <CheckoutLoading />;
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {cartItems.length === 0 ? (
          <EmptyCheckout />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm 
                user={user}
                orderId={orderId}
                calculateTotal={getTotal}
                onCreditCardSuccess={handleCreditCardSuccess}
              />
            </div>
            
            {/* Order Summary */}
            <div>
              <CheckoutSummary 
                cartItems={cartItems}
                calculateSubtotal={getSubtotal}
                calculateTax={getTax}
                calculateTotal={getTotal}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Checkout;
