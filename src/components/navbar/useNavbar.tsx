
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

        // Get cart count
        await fetchCartCount(user.id);
      }
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
  }, []);
  
  const getNavLinks = (): NavLink[] => {
    const navLinks = [
      { name: "Products", path: "/shop" },
      { name: "Dashboard", path: "/user-dashboard" }
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
