
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

export interface PaymentTransaction {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  merchant_id: string;
  merchant_key: string;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PayfastPaymentData {
  amount: number;
  item_name: string;
  orderId: string;
  email_address: string;
  name_first?: string;
  name_last?: string;
  return_url?: string;
  cancel_url?: string;
  notify_url?: string;
}
