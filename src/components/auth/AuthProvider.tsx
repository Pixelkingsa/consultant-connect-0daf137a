
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

  // Function to check admin status directly from the database
  const checkAdminStatus = async (userId: string) => {
    console.log("Checking admin status for user:", userId);
    
    try {
      // Check if the user has the admin role
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role_id", 1) // Assuming role_id 1 is admin
        .single();
      
      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error checking admin status:", error);
        return false;
      }
      
      const isAdmin = !!data;
      console.log("Admin check result:", isAdmin, "data:", data);
      return isAdmin;
    } catch (err) {
      console.error("Exception in admin status check:", err);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data, error } = await supabase.auth.getSession();
        
        console.log("Session data:", data);
        
        if (error) {
          console.error("Session error:", error);
          setIsAuthenticated(false);
          setUserId(null);
          setIsAdmin(false);
          return;
        }
        
        const sessionExists = !!data.session;
        setIsAuthenticated(sessionExists);
        
        if (data.session) {
          const currentUserId = data.session.user.id;
          setUserId(currentUserId);
          
          // Direct check for admin role
          const adminStatus = await checkAdminStatus(currentUserId);
          setIsAdmin(adminStatus);
          
          console.log(`User ${currentUserId} authenticated, admin status: ${adminStatus}`);
          
          if (adminStatus) {
            toast({
              title: "Admin access granted",
              description: "You're logged in with administrator privileges.",
            });
          }
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
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        
        setIsAuthenticated(!!session);
        
        // Reset user info when logged out
        if (!session) {
          console.log("No session found, setting user as logged out");
          setUserId(null);
          setIsAdmin(false);
          return;
        }
        
        // Set user ID and check admin status when logged in
        if (session?.user) {
          const currentUserId = session.user.id;
          setUserId(currentUserId);
          
          // Direct check for admin role
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
  }, [toast]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
