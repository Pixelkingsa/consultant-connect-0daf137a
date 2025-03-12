import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAppUser } from './useAppUser';

export function useReferrals() {
  const { user, profile } = useAppUser();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Add new methods or update existing ones to use referral codes
  const getReferralCode = () => {
    return profile?.referral_code || '';
  };

  const getReferralLink = () => {
    const code = getReferralCode();
    if (!code) return '';
    return `${window.location.origin}/auth?ref=${code}`;
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        // Fetch referrals based on the current user's ID
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('upline_id', user?.id);

        if (error) {
          setError(error);
        } else {
          setReferrals(data || []);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReferrals();
    }
  }, [user]);

  return {
    referrals,
    loading,
    error,
    getReferralCode,
    getReferralLink,
  };
}
