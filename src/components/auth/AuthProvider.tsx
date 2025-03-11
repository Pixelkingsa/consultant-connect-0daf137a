
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  isAuthenticated: boolean | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Check if user is admin (using same logic as AdminAuthChecker)
        if (user && user.email === "zonkebonke@gmail.com") {
          setIsAdmin(true);
        } else {
          // Check if user is the first user in the system
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: true })
            .limit(1);
            
          if (profiles && profiles.length > 0 && profiles[0].id === user?.id) {
            setIsAdmin(true);
          }
        }
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setIsAuthenticated(!!session);
          
          // Reset admin status when logged out
          if (!session) {
            setIsAdmin(false);
            return;
          }
          
          // Check admin status when logged in
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email === "zonkebonke@gmail.com") {
            setIsAdmin(true);
          } else {
            // Check if user is the first user in the system
            const { data: profiles } = await supabase
              .from("profiles")
              .select("*")
              .order("created_at", { ascending: true })
              .limit(1);
              
            if (profiles && profiles.length > 0 && profiles[0].id === user?.id) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
