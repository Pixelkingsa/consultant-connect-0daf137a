
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
        
        if (user) {
          // Check if user has admin role
          const { data: userRoles } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", user.id);
            
          const hasAdminRole = userRoles && userRoles.some(role => role.role === "admin");
          setIsAdmin(hasAdminRole);
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
          if (session?.user) {
            const { data: userRoles } = await supabase
              .from("user_roles")
              .select("*")
              .eq("user_id", session.user.id);
              
            const hasAdminRole = userRoles && userRoles.some(role => role.role === "admin");
            setIsAdmin(hasAdminRole);
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
