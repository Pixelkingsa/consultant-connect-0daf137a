
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import ShopContent from "@/components/shop/ShopContent";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/components/auth/AuthProvider";

const Shop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated === false) {
      navigate("/auth");
      return;
    }

    // Simulating loading time for data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading shop..." />
      </div>
    );
  }
  
  return (
    <AppLayout>
      <ShopContent />
    </AppLayout>
  );
};

export default Shop;
