import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, accountType: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, username: string, accountType: string) => {
    try {
      // Validate input
      if (!email || !password || !username || !accountType) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // First check if username is available
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw new Error('Error checking username availability');
      }

      if (existingUser) {
        throw new Error('Username is already taken');
      }

      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            account_type: accountType
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('No user data returned');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          username,
          account_type: accountType
        }]);

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.admin.deleteUser(data.user.id);
        throw new Error('Failed to create profile');
      }

      // Create default payment settings
      const { error: paymentError } = await supabase
        .from('payment_settings')
        .insert([{
          user_id: data.user.id,
          payment_method: 'bank'
        }]);

      if (paymentError) {
        // If payment settings creation fails, clean up
        await supabase.auth.admin.deleteUser(data.user.id);
        throw new Error('Failed to create payment settings');
      }

      // Set the user and profile
      setUser(data.user);
      await fetchProfile(data.user.id);

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const value = {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}