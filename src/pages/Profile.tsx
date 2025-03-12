
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { ExtendedProfile } from "@/types/profile";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*, ranks(*)")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data. Please try again later.",
          variant: "destructive",
        });
      } else {
        setProfile(profileData as ExtendedProfile);
        
        // Fix: Only set email from user object if it exists
        const userEmail = user?.email || "";
        
        setFormData({
          full_name: profileData?.full_name || "",
          email: userEmail,
          phone: profileData?.phone || "",
          address: profileData?.address || "",
          city: profileData?.city || "",
          state: profileData?.state || "",
          zip: profileData?.zip || "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        await fetchProfile(user.id);
        
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      }
    };
    
    checkUser();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <ProfilePageContent
        profile={profile}
        userId={user?.id || ""}
        formData={formData}
        setFormData={setFormData}
        refreshProfile={() => user?.id && fetchProfile(user.id)}
      />
    </AppLayout>
  );
};

export default Profile;
