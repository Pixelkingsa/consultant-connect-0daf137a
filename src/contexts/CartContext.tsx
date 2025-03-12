
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types/cart";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  updatingItem: string | null;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setLoading(false);
          return;
        }
        
        setUser(user);
        
        // Fetch cart items
        await fetchCartItems(user.id);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Setup listener for cart updates
    window.addEventListener('cart-updated', refreshCart);
    
    return () => {
      window.removeEventListener('cart-updated', refreshCart);
    };
  }, [navigate, toast]);

  const refreshCart = async () => {
    if (user?.id) {
      await fetchCartItems(user.id);
    }
  };

  const fetchCartItems = async (userId: string) => {
    try {
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
        .eq("user_id", userId)
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
        setCartCount(data?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  
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

      // Dispatch cart updated event
      const cartUpdatedEvent = new CustomEvent('cart-updated');
      window.dispatchEvent(cartUpdatedEvent);
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
      setCartCount(prev => prev - 1);
      
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });

      // Dispatch cart updated event
      const cartUpdatedEvent = new CustomEvent('cart-updated');
      window.dispatchEvent(cartUpdatedEvent);
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

  const value = {
    cartItems,
    cartCount,
    loading,
    updatingItem,
    updateQuantity,
    removeItem,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    refreshCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}
