
import { useState, useEffect, useRef } from "react";
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
import { CheckoutFormValues } from "@/lib/validationSchemas";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');
  const [formIsValid, setFormIsValid] = useState(false);
  const getFormValues = useRef<() => CheckoutFormValues>(() => ({
    fullName: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phoneNumber: ""
  }));

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
                onFormValidityChange={setFormIsValid}
                getFormValues={getFormValues}
              />
            </div>
            
            {/* Order Summary with Payment Methods */}
            <div>
              <CheckoutSummary 
                cartItems={cartItems}
                calculateSubtotal={getSubtotal}
                calculateTax={getTax}
                calculateTotal={getTotal}
                user={user}
                orderId={orderId}
                formIsValid={formIsValid}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Checkout;
