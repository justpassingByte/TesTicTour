"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useUserStore } from '@/app/stores/userStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser: user, isLoading: loading, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Initial fetch if not already loaded
    if (user === null && loading) {
      fetchUser();
    }
  }, [user, loading, fetchUser]);

  useEffect(() => {
    if (user === null && !loading) {
      // User is not authenticated and loading is complete
      console.log('[DashboardLayout Client] No user found and loading complete, redirecting to login.');
      router.push('/?auth=login');
    } else if (user && !['admin', 'partner', 'user'].includes(user.role)) {
      // User is authenticated but does not have a valid dashboard role
      console.log('[DashboardLayout Client] User role is not authorized for dashboard:', user.role);
      router.push('/');
    }
  }, [user, loading, router]);

  // Optionally, show a loading spinner while authentication is being checked
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">Loading dashboard...</div>;
  }

  // If user is null but not loading, it means they were redirected, so we don't render children yet
  if (user === null) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <main className={`flex-1 p-8 bg-muted/40`}>
        {children}
      </main>
    </div>
  );
}