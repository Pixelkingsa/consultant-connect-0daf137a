
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/cart";
import { toast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for authenticated user and get ID
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    getUserId();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
          setCartItems([]);
          setCartCount(0);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch cart when userId changes
  useEffect(() => {
    if (userId) {
      refreshCart();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const refreshCart = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
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
        
      if (error) {
        console.error("Error fetching cart items:", error);
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
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!userId) return;
    
    try {
      // Check if product already in cart
      const { data: existingItems, error: checkError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();
        
      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows returned, which is expected if item isn't in cart
        console.error("Error checking cart:", checkError);
        return;
      }
      
      if (existingItems) {
        // Update existing item
        const newQuantity = existingItems.quantity + quantity;
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity })
          .eq("id", existingItems.id);
          
        if (error) {
          console.error("Error updating cart:", error);
          return;
        }
      } else {
        // Add new item
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: quantity
          });
          
        if (error) {
          console.error("Error adding to cart:", error);
          return;
        }
      }
      
      // Refresh cart after changes
      refreshCart();
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!userId || quantity < 1) return;
    
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: quantity })
        .eq("id", itemId)
        .eq("user_id", userId);
        
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
            ? { ...item, quantity: quantity } 
            : item
        )
      );
      
      toast({
        title: "Cart Updated",
        description: "Item quantity has been updated.",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeCartItem = async (itemId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", userId);
        
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isLoading,
        addToCart,
        updateCartItem,
        removeCartItem,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
