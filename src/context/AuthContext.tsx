import { createContext, useState, ReactNode, useEffect } from 'react';
import { useProfile } from '@/hooks/api/useProfileApi';
import type { ProfileResponse } from '@/types/profile';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  profile: ProfileResponse | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const token = localStorage.getItem('accessToken');
  const { data: profileData, isError, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // If profile is loaded successfully, user is authenticated
    if (profileData) {
      setIsAuthenticated(true);
      setProfile(profileData);
      setIsLoading(false);
    }
    
    // If profile fetch failed, user is not authenticated
    if (isError) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      setIsAuthenticated(false);
      setProfile(null);
      setIsLoading(false);
    }
  }, [token, profileData, isError]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    setIsAuthenticated(false);
    setProfile(null);
  };

  if (isLoading || (token && isProfileLoading)) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, profile }}>
      {children}
    </AuthContext.Provider>
  );
} 