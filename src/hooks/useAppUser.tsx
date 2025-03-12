
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

export function useAppUser() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
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
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      }
    };
    
    checkUser();
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
