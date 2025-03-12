
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types/cart";
import { calculateSubtotal, calculateTax, calculateTotal } from "@/lib/checkoutUtils";

export function useCheckout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');
  const [formIsValid, setFormIsValid] = useState(false);

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

  return {
    user,
    cartItems,
    loading,
    orderId,
    formIsValid,
    setFormIsValid,
    getSubtotal,
    getTax,
    getTotal
  };
}
