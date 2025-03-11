
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types/cart";

export const useCart = () => {
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
  
  const handleCheckout = () => {
    // Placeholder for checkout functionality
    toast({
      title: "Checkout",
      description: "Checkout functionality will be implemented soon.",
    });
  };

  return {
    user,
    cartItems,
    loading,
    updatingItem,
    updateQuantity,
    removeItem,
    handleCheckout
  };
};
