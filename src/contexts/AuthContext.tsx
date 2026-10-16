import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { authService, tokenStorage } from '../services/api';
import type { AuthenticatedUser, LoginRequest } from '../types/auth/auth';
import { AuthContext } from './auth-context';
import type { AppUser } from './auth-context';

function toAppUser(user: AuthenticatedUser): AppUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        if (active) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();

        if (active) {
          setUser({
            id: currentUser.userId,
            role: currentUser.role,
          });
        }
      } catch {
        if (!refreshToken) {
          tokenStorage.clear();

          if (active) {
            setUser(null);
          }
          return;
        }

        try {
          const refreshed = await authService.refreshToken({ refreshToken });

          if (active) {
            setUser(toAppUser(refreshed.user));
          }
        } catch {
          tokenStorage.clear();

          if (active) {
            setUser(null);
          }
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    const response = await authService.login(request);
    setUser(toAppUser(response.user));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
