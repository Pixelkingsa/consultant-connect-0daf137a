
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import refactored components
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import ConsultantDetails from "@/components/profile/ConsultantDetails";
import { 
  calculateRankProgress, 
  getNextRankName, 
  getNextRankThreshold 
} from "@/components/profile/RankProgressHelper";

// Define profile type with ranks relationship
interface Rank {
  id: string;
  name: string;
  threshold_pv: number;
  threshold_gv: number;
  commission_rate: number;
}

interface ExtendedProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  rank_id: string | null;
  ranks: Rank | null;
  team_size: number;
  personal_volume: number;
  group_volume: number;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

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
      // Get user profile with rank information
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
        // Set form data from profile
        setFormData({
          full_name: profileData?.full_name || "",
          email: user.email || "",
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

  // Calculate rank progress for the current profile
  const getRankProgress = () => calculateRankProgress(profile);
  
  // Get the next rank name
  const getNextRank = () => getNextRankName(profile);

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
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="account">Account Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <ProfileHeader 
                avatarUrl={profile?.avatar_url} 
                fullName={profile?.full_name} 
              />
              <CardContent className="space-y-6">
                <PersonalInfoForm 
                  formData={formData}
                  setFormData={setFormData}
                  userId={user.id}
                  refreshProfile={() => fetchProfile(user.id)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <ConsultantDetails 
                profile={profile} 
                calculateRankProgress={getRankProgress}
                getNextRankName={getNextRank}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
