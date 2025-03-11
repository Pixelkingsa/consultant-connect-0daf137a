
import { supabase } from "@/integrations/supabase/client";
import { type RankFormValues } from "@/components/admin/ranks/RankForm";

export const fetchRanks = async () => {
  const { data, error } = await supabase
    .from("ranks")
    .select("*")
    .order("threshold_pv", { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const saveRank = async (values: RankFormValues, editingRankId: string | null = null) => {
  // Ensure all required fields are present with their correct types
  const rankData = {
    name: values.name,
    commission_rate: Number(values.commission_rate),
    threshold_pv: Number(values.threshold_pv),
    threshold_gv: Number(values.threshold_gv)
  };

  if (editingRankId) {
    const { error } = await supabase
      .from("ranks")
      .update(rankData)
      .eq("id", editingRankId);
    
    if (error) throw error;
    return { action: 'updated' };
  } else {
    const { error } = await supabase
      .from("ranks")
      .insert([rankData]);
    
    if (error) throw error;
    return { action: 'created' };
  }
};

export const updateRankOrder = async (ranks: any[], rankId: string, direction: 'up' | 'down') => {
  const rankIndex = ranks.findIndex(r => r.id === rankId);
  if (rankIndex === -1) return;
  
  const swapIndex = direction === 'up' ? rankIndex - 1 : rankIndex + 1;
  if (swapIndex < 0 || swapIndex >= ranks.length) return;
  
  const currentRank = ranks[rankIndex];
  const swapRank = ranks[swapIndex];
  
  const updates = [
    {
      id: currentRank.id,
      threshold_pv: swapRank.threshold_pv,
      threshold_gv: swapRank.threshold_gv
    },
    {
      id: swapRank.id,
      threshold_pv: currentRank.threshold_pv,
      threshold_gv: currentRank.threshold_gv
    }
  ];
  
  for (const update of updates) {
    const { error } = await supabase
      .from("ranks")
      .update({ 
        threshold_pv: update.threshold_pv,
        threshold_gv: update.threshold_gv
      })
      .eq("id", update.id);
      
    if (error) throw error;
  }
  
  return true;
};
