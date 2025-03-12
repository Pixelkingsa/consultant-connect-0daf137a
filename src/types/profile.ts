
// Profile-related type definitions
export interface Rank {
  id: string;
  name: string;
  threshold_pv: number;
  threshold_gv: number;
  commission_rate: number;
}

export interface ExtendedProfile {
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

export interface PersonalInfoFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}
