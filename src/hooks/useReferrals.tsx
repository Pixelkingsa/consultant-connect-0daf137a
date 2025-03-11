
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  date: string;
  status: string;
}

interface ReferralStats {
  totalDownlines: number;
  activeConsultants: number;
  teamSales: number;
  teamPerformance: string;
  commission: number;
  commissionPercentage: number;
}

export function useReferrals() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<ReferralStats>({
    totalDownlines: 6,
    activeConsultants: 5,
    teamSales: 5230,
    teamPerformance: "This month's team performance",
    commission: 523,
    commissionPercentage: 10
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
        
        // Generate referral code and link
        setReferralCode(`RF${user.id.substring(0, 6).toUpperCase()}`);
        setReferralLink(`${window.location.origin}/auth?ref=${user.id.substring(0, 8)}`);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (!profileError && profileData) {
          setProfile(profileData);
        }
        
        // Get referred users (downline)
        const { data: referredData, error: referredError } = await supabase
          .from("profiles")
          .select("id, full_name, created_at")
          .eq("upline_id", user.id);
          
        if (!referredError && referredData) {
          // Map to our expected format
          const mappedReferrals = referredData.map(ref => ({
            id: ref.id,
            name: ref.full_name || "Anonymous User",
            email: "****@example.com", // Privacy - don't show full email
            date: ref.created_at,
            status: "active"
          }));
          setReferredUsers(mappedReferrals);
          
          // Update stats based on actual data
          if (mappedReferrals.length > 0) {
            setStats(prev => ({
              ...prev,
              totalDownlines: mappedReferrals.length,
              activeConsultants: mappedReferrals.filter(r => r.status === "active").length
            }));
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
  }, [navigate]);

  return {
    user,
    profile,
    referralCode,
    referralLink,
    referredUsers,
    stats,
    loading
  };
}
