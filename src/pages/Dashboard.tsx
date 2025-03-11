
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/components/auth/AuthProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, userId } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [rankInfo, setRankInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log admin status for debugging
    console.log("Dashboard loaded with auth state:", { isAdmin, userId });
    
    // Redirect admin users who somehow reached this page
    if (isAdmin) {
      console.log("Admin user detected in Dashboard, redirecting to admin dashboard");
      navigate("/admin-dashboard", { replace: true });
      return;
    }
    
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        console.log("User data in Dashboard:", user);
        setUser(user);
        
        // Get user profile with rank information
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, ranks(*)")
          .eq("id", user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Error loading profile",
            description: "Could not load your profile. Please try again later.",
            variant: "destructive",
          });
        } else {
          setProfile(profile);
          setRankInfo(profile.ranks);
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate, toast, isAdmin, userId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading your dashboard..." />
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || user?.email}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Complete your profile to get the most out of your Vamna experience.
              </p>
              <Button onClick={() => navigate("/profile")}>
                Update Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Get started with these common actions:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => navigate("/shop")}>
                  Browse Products
                </Button>
                <Button variant="outline" onClick={() => navigate("/referrals")}>
                  Manage Referrals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 bg-background border rounded-lg p-6 shadow-sm">
          <p className="text-xl mb-4">Your Consultant Dashboard</p>
          <p className="text-muted-foreground">For a more detailed dashboard with sales and team metrics, please visit:</p>
          <div className="mt-4">
            <Button onClick={() => navigate("/user-dashboard")} variant="default">
              Go to Advanced Dashboard
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
