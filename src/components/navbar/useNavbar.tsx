import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavLink } from "./types";

export function useNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setUser(user);
        
        // Check if user is admin
        const { data: profiles, error: adminCheckError } = await supabase
          .from("profiles")
          .select("id")
          .order("created_at", { ascending: true })
          .limit(1);
          
        if (!adminCheckError && profiles && profiles.length > 0) {
          setIsAdmin(profiles[0].id === user.id);
        }

        // Get cart count from the cart_items table
        try {
          const { count, error: cartError } = await supabase
            .from("cart_items")
            .select("id", { count: 'exact', head: true })
            .eq("user_id", user.id);
            
          if (!cartError) {
            setCartCount(count || 0);
          } else {
            console.error("Error fetching cart count:", cartError);
            setCartCount(0);
          }
        } catch (cartError) {
          console.error("Error counting cart items:", cartError);
          setCartCount(0);
        }
      }
    };
    
    checkUser();
  }, []);
  
  const getNavLinks = (): NavLink[] => {
    const navLinks = [
      { name: "Products", path: "/shop" },
      { name: "Dashboard", path: "/dashboard" }
    ];

    if (isAdmin) {
      navLinks.push({ name: "Admin", path: "/admin-dashboard" });
    }
    
    return navLinks;
  };

  return {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAdmin,
    user,
    cartCount,
    navLinks: getNavLinks()
  };
}
