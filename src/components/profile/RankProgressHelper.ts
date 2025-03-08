
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

// Function to calculate rank progress percentage
export const calculateRankProgress = (profile: ExtendedProfile | null): number => {
  if (!profile || !profile.ranks) return 0;
  
  const currentPV = profile.personal_volume || 0;
  const threshold = profile.ranks.threshold_pv;
  
  if (threshold === 0) return 0; // Prevent division by zero
  
  const nextRankThreshold = getNextRankThreshold(profile);
  if (nextRankThreshold === null) return 100; // Already at highest rank
  
  return Math.min(Math.round((currentPV / nextRankThreshold) * 100), 100);
};

// Function to get next rank threshold
export const getNextRankThreshold = (profile: ExtendedProfile | null): number | null => {
  if (!profile || !profile.ranks) return null;
  
  const currentRankName = profile.ranks.name;
  
  // Define rank order and thresholds
  const rankOrder = [
    { name: 'Starter', threshold: 100 }, // Threshold to reach Associate
    { name: 'Associate', threshold: 200 }, // Threshold to reach Director
    { name: 'Director', threshold: 300 }, // Threshold to reach Executive
    { name: 'Executive', threshold: 500 }, // Threshold to reach Elite
    { name: 'Elite', threshold: null } // No higher rank
  ];
  
  const currentRankIndex = rankOrder.findIndex(r => r.name === currentRankName);
  if (currentRankIndex === -1 || currentRankIndex === rankOrder.length - 1) return null;
  
  return rankOrder[currentRankIndex + 1].threshold;
};

// Get next rank name
export const getNextRankName = (profile: ExtendedProfile | null): string => {
  if (!profile || !profile.ranks) return "Loading...";
  
  const currentRankName = profile.ranks.name;
  
  const rankOrder = ['Starter', 'Associate', 'Director', 'Executive', 'Elite'];
  const currentRankIndex = rankOrder.indexOf(currentRankName);
  
  if (currentRankIndex === -1 || currentRankIndex === rankOrder.length - 1) {
    return "Highest Rank";
  }
  
  return rankOrder[currentRankIndex + 1];
};
