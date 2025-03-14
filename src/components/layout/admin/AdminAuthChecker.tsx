
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        
        // Check if user is admin - first user in the system
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(1);
          
        if (profilesError) {
          console.error("Error checking admin status:", profilesError);
          toast({
            title: "Error checking admin status",
            description: "Could not verify admin privileges. Redirecting to dashboard.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        // Check if current user is the first user (admin)
        if (profiles && profiles.length > 0 && profiles[0].id === user.id) {
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
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  return <>{children(isAdmin)}</>;
};

export default AdminAuthChecker;
