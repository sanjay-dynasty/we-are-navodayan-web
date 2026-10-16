import { createContext } from 'react';
import type { LoginRequest } from '../types/auth/auth';

export interface AppUser {
  id: string;
  fullName?: string;
  email?: string;
  role: string;
}

export interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
