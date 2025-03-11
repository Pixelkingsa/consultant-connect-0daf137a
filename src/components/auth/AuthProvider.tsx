
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  isAuthenticated: boolean | null;
  isAdmin: boolean;
  userId: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isAdmin: false,
  userId: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string) => {
    try {
      // Use the direct query to user_roles table with a join to roles
      const { data: userRoles, error } = await supabase
        .from("user_roles")
        .select("*, roles(*)")
        .eq("user_id", userId);
            
      console.log("User roles data:", userRoles);
      console.log("User roles error:", error);
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      // Check if the user has an admin role
      const hasAdminRole = userRoles && userRoles.some(role => role.roles?.role_name === "admin");
      console.log("Has admin role:", hasAdminRole);
      
      return hasAdminRole || false;
    } catch (err) {
      console.error("Exception checking admin status:", err);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        console.log("Session data:", data);
        console.log("Session error:", error);
        
        const sessionExists = !!data.session;
        setIsAuthenticated(sessionExists);
        
        if (data.session) {
          const currentUserId = data.session.user.id;
          setUserId(currentUserId);
          
          // Check admin status and update state
          const adminStatus = await checkAdminStatus(currentUserId);
          setIsAdmin(adminStatus);
          
          console.log(`User ${currentUserId} authenticated, admin status: ${adminStatus}`);
        } else {
          setUserId(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error in auth check:", err);
        setIsAuthenticated(false);
        setUserId(null);
        setIsAdmin(false);
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state change event:", event);
          console.log("New session:", session);
          
          setIsAuthenticated(!!session);
          
          // Reset user info when logged out
          if (!session) {
            setUserId(null);
            setIsAdmin(false);
            return;
          }
          
          // Set user ID and check admin status when logged in
          if (session?.user) {
            const currentUserId = session.user.id;
            setUserId(currentUserId);
            
            // Check admin status and update state
            const adminStatus = await checkAdminStatus(currentUserId);
            setIsAdmin(adminStatus);
            
            console.log(`User ${currentUserId} state changed, admin status: ${adminStatus}`);
            
            if (adminStatus) {
              toast({
                title: "Admin access granted",
                description: "You're logged in with administrator privileges.",
              });
            }
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, [toast]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
