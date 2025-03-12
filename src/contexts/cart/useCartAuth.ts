
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCartAuth = () => {
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
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { userId };
};
