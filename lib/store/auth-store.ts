import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  isArtist: () => boolean;
  isAdmin: () => boolean;
  canManageOrders: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  isArtist: () => get().profile?.role === 'artist',
  isAdmin: () => get().profile?.role === 'admin',
  canManageOrders: () => {
    const role = get().profile?.role;
    return role === 'artist' || role === 'admin';
  },
}));
