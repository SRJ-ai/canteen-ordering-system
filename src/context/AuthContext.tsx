'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'KITCHEN_STAFF' | 'CASHIER' | 'CUSTOMER';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: string | null;
  isAdmin: boolean;
  isKitchen: boolean;
  isCustomer: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  quickLogin: (accountType: 'ADMIN' | 'KITCHEN' | 'STUDENT') => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndRole = async (currentUser: User) => {
    try {
      const supabase = createClient();
      
      // 1. Fetch user role
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id, roles(name)')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      const userRole = (userRoles?.roles as any)?.name || 'CUSTOMER';

      // 2. Fetch profile data
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      const userProfile: UserProfile = {
        id: currentUser.id,
        email: currentUser.email || '',
        first_name: profData?.first_name || currentUser.user_metadata?.first_name || 'GPREC Member',
        last_name: profData?.last_name || currentUser.user_metadata?.last_name || '',
        phone: profData?.phone || '',
        role: userRole,
      };

      setProfile(userProfile);
    } catch (err) {
      console.error('Error fetching user profile/role:', err);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    // Check active session
    supabase.auth.getUser().then(({ data: { user: activeUser } }) => {
      setUser(activeUser);
      if (activeUser) {
        fetchProfileAndRole(activeUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user || null;
      setUser(authUser);
      if (authUser) {
        await fetchProfileAndRole(authUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfileAndRole(data.user);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || '',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Upsert profile
        await supabase.from('profiles').upsert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
        });

        // Assign default CUSTOMER role
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'CUSTOMER')
          .single();

        if (roleData) {
          await supabase.from('user_roles').upsert({
            user_id: data.user.id,
            role_id: roleData.id,
          }, { onConflict: 'user_id, role_id' });
        }

        setUser(data.user);
        await fetchProfileAndRole(data.user);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const quickLogin = async (accountType: 'ADMIN' | 'KITCHEN' | 'STUDENT') => {
    let email = 'student@gprec.ac.in';
    if (accountType === 'ADMIN') email = 'admin@gprec.ac.in';
    if (accountType === 'KITCHEN') email = 'kitchen@gprec.ac.in';

    return await login(email, 'Password@123');
  };

  const role = profile?.role || (user ? 'CUSTOMER' : null);
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isKitchen = role === 'KITCHEN_STAFF' || isAdmin;
  const isCustomer = role === 'CUSTOMER' || !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isKitchen,
        isCustomer,
        loading,
        login,
        signup,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
