
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useAppUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  // Function to fetch cart count
  const fetchCartCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from("cart_items")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", userId);
        
      if (!error) {
        setCartCount(count || 0);
      } else {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error counting cart items:", error);
      setCartCount(0);
    }
  };
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate("/auth");
        return;
      }
      
      setUser(user);
      
      // Check if user is admin
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (!profileError && profiles) {
        setProfile(profiles);
        setIsAdmin(profiles.rank === "Admin");
      }
      
      // Get cart count
      await fetchCartCount(user.id);
    };
    
    checkUser();
    
    // Setup event listener for cart updates
    const handleCartUpdate = async () => {
      if (user?.id) {
        await fetchCartCount(user.id);
      }
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return {
    user,
    profile,
    isAdmin,
    cartCount,
    handleSignOut
  };
}
