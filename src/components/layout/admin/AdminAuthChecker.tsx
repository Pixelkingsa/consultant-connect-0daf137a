
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";

interface AdminAuthCheckerProps {
  children: (isAdmin: boolean) => React.ReactNode;
}

const AdminAuthChecker = ({ children }: AdminAuthCheckerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        // Check if user has admin role in the user_roles table
        const { data: userRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", user.id);
          
        if (rolesError) {
          console.error("Error checking admin status:", rolesError);
          toast({
            title: "Error checking admin status",
            description: "Could not verify admin privileges. Please try again later.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        // Check if the user has an admin role
        const hasAdminRole = userRoles && userRoles.some(role => role.role === "admin");
        
        if (hasAdminRole) {
          setIsAdmin(true);
        } else {
          // Not admin, redirect to user dashboard
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAccess();
  }, [navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }
  
  return <>{children(isAdmin)}</>;
};

export default AdminAuthChecker;
