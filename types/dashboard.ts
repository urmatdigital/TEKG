export interface Profile {
  id: string;
  role: 'user' | 'admin';
  email: string;
  created_at: string;
}

export interface Referral {
  id: string;
  email: string;
  created_at: string;
  status: 'active' | 'inactive';
}

export interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  type: 'income' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed';
}

export interface AdminDashboardData {
  totalUsers: number;
  totalReferrals: number;
  totalTransactions: number;
  totalEarnings: number;
}