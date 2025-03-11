
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
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
            description: "Could not load your profile data. Please try again later.",
            variant: "destructive",
          });
        } else {
          setProfile(profile);
          setRankInfo(profile.ranks);
          
          // Fetch sales data
          const { data: salesData, error: salesError } = await supabase
            .from("sales")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });
            
          if (salesError) {
            console.error("Error fetching sales:", salesError);
          } else {
            setSalesData(salesData || []);
          }
          
          // Fetch bonuses data
          const { data: bonusesData, error: bonusesError } = await supabase
            .from("bonuses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
            
          if (bonusesError) {
            console.error("Error fetching bonuses:", bonusesError);
          } else {
            setBonusesData(bonusesData || []);
          }
        }
      } catch (error) {
        console.error("Error:", error);
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
    totalBonuses: bonusesData.reduce((total, bonus) => total + Number(bonus.amount), 0)
  };
};
