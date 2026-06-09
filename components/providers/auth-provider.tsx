"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "@supabase/supabase-js";

import { getCurrentProfile, getProfileByUser } from "@/lib/services/profile";
import { supabase } from "@/lib/supabase/client";

import { Profile } from "@/types/profile";
import { Role } from "@/types/role";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const profile = await getCurrentProfile();

    setProfile(profile);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const profile = await getProfileByUser(user);

        setProfile(profile);
      }

      setLoading(false);
      setInitialized(true);
    };

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);

        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);

        const profile = await getProfileByUser(session.user);

        setProfile(profile);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role ?? null,
        loading,
        initialized,
        isAuthenticated: !!user,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
