// Django JWT Authentication Hook - replaces Supabase auth
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient, APIError } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  profile?: {
    display_name?: string;
    avatar_url?: string;
  };
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (userData: {
    email: string;
    password: string;
    password_confirm: string;
    username: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<{ error?: string }>;
  signOut: () => void;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Try to get current user profile
      const profile = await apiClient.getProfile();
      const storedUser = apiClient.getCurrentUser();
      
      setUser({
        ...storedUser,
        profile
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      if (error instanceof APIError && error.status === 401) {
        // Token expired, try to refresh
        try {
          await apiClient.refreshToken();
          // Retry getting user
          const profile = await apiClient.getProfile();
          const storedUser = apiClient.getCurrentUser();
          setUser({
            ...storedUser,
            profile
          });
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          apiClient.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    // Set up automatic token refresh
    const refreshInterval = setInterval(async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await apiClient.refreshToken();
        } catch (error) {
          console.error('Auto refresh failed:', error);
        }
      }
    }, 50 * 60 * 1000); // Refresh every 50 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      const response = await apiClient.login(email, password);
      setUser(response.user);
      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        error: error instanceof APIError 
          ? 'Invalid email or password' 
          : 'An error occurred during sign in'
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    password_confirm: string;
    username: string;
    first_name?: string;
    last_name?: string;
  }): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      setUser(response.user);
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        error: error instanceof APIError 
          ? error.message 
          : 'An error occurred during sign up'
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    apiClient.logout();
    setUser(null);
  };

  const refetch = () => {
    checkUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      refetch
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}