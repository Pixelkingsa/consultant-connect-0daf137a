
export interface ReferredUser {
  id: string;
  name: string;
  email: string;
  date: string;
  status: string;
}

export interface ConversionRate {
  period: string;
  rate: number;
  count: number;
  total: number;
}

export interface ActivityEvent {
  userId: string;
  userName: string;
  eventType: 'signup' | 'purchase' | 'referral' | 'rank_change';
  date: string;
  description: string;
}

export interface PerformanceMetric {
  userId: string;
  userName: string;
  sales: number;
  recruits: number;
  activity: number;
  growth: number;
}
