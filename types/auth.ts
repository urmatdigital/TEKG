export interface User {
  id: string;
  clientCode: string;
  firstName: string;
  lastName: string;
  telegramUsername?: string;
  telegramPhotoUrl?: string;
  balance: number;
  referralBalance: number;
  cashbackBalance: number;
  isVerified: boolean;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
