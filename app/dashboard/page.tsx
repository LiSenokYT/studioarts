'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Loader2 } from 'lucide-react';
import { UserDashboard } from '@/components/dashboard/user-dashboard';
import { ArtistDashboard } from '@/components/dashboard/artist-dashboard';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';

export default function DashboardPage() {
  const { user, profile, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !profile) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#A682E6]" />
      </div>
    );
  }

  if (profile.is_banned) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Аккаунт заблокирован
          </h1>
          <p className="text-gray-600">
            Ваш аккаунт был заблокирован администратором.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {profile.role === 'admin' && <AdminDashboard />}
      {profile.role === 'artist' && <ArtistDashboard />}
      {profile.role === 'user' && <UserDashboard />}
    </>
  );
}
