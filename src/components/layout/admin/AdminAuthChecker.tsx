
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

interface AdminAuthCheckerProps {
  children: (isAdmin: boolean) => React.ReactNode;
}

const AdminAuthChecker = ({ children }: AdminAuthCheckerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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
          .select("*, roles!inner(*)")
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
        const hasAdminRole = userRoles && userRoles.some(role => role.roles?.role_name === "admin");
        
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
  
  const handleRemoveAdminRole = async () => {
    try {
      setDeleting(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Could not verify current user");
      }
      
      // Find the admin role ID for the current user
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, roles!inner(*)")
        .eq("user_id", user.id)
        .eq("roles.role_name", "admin");
        
      if (rolesError) {
        throw new Error("Could not find admin role");
      }
      
      if (!userRoles || userRoles.length === 0) {
        throw new Error("No admin role found for current user");
      }
      
      // Delete the admin role assignment for this user
      const adminRoleId = userRoles[0].id;
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", adminRoleId);
        
      if (deleteError) {
        throw new Error("Failed to remove admin role");
      }
      
      toast({
        title: "Admin Access Removed",
        description: "You have successfully removed your admin privileges.",
      });
      
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error removing admin role:", error);
      toast({
        title: "Error Removing Admin Role",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }
  
  return (
    <>
      {isAdmin && (
        <div className="bg-red-50 p-4 mb-4 rounded-md border border-red-200">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h3 className="font-medium text-red-800">Admin Access</h3>
              <p className="text-sm text-red-700">You currently have administrator privileges.</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleRemoveAdminRole}
              disabled={deleting}
            >
              {deleting ? "Removing..." : "Remove Admin Access"}
            </Button>
          </div>
        </div>
      )}
      {children(isAdmin)}
    </>
  );
};

export default AdminAuthChecker;
