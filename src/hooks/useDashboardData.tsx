
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDashboardData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [rankInfo, setRankInfo] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [bonusesData, setBonusesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        setError(false);
        
        console.log("Fetching user data...");
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Auth error:", userError);
          navigate("/auth");
          return;
        }
        
        console.log("User authenticated:", user.id);
        setUser(user);
        
        // Get user profile with rank information
        console.log("Fetching profile data...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, ranks(*)")
          .eq("id", user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Error loading profile",
            description: "Could not load your profile data. Please try again later.",
            variant: "destructive",
          });
          setError(true);
        } else {
          console.log("Profile data loaded:", profile?.id);
          setProfile(profile);
          setRankInfo(profile?.ranks);
          
          // Fetch sales data
          console.log("Fetching sales data...");
          const { data: salesData, error: salesError } = await supabase
            .from("sales")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });
            
          if (salesError) {
            console.error("Error fetching sales:", salesError);
            setError(true);
          } else {
            console.log(`Loaded ${salesData?.length || 0} sales records`);
            setSalesData(salesData || []);
          }
          
          // Fetch bonuses data
          console.log("Fetching bonuses data...");
          const { data: bonusesData, error: bonusesError } = await supabase
            .from("bonuses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
            
          if (bonusesError) {
            console.error("Error fetching bonuses:", bonusesError);
            setError(true);
          } else {
            console.log(`Loaded ${bonusesData?.length || 0} bonus records`);
            setBonusesData(bonusesData || []);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError(true);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate, toast]);

  return {
    user,
    profile,
    rankInfo,
    salesData,
    bonusesData,
    loading,
    error,
    totalBonuses: bonusesData.reduce((total, bonus) => total + Number(bonus.amount), 0)
  };
};
