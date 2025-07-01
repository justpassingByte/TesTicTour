"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import PlayerDashboardClient from "./components/PlayerDashboardClient"
import { useUserStore } from "@/app/stores/userStore";

export default function DashboardPage() {
  const { user, loading, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Ensure user data is fetched
    if (!user && !loading) {
      fetchUser();
    }

    if (!loading && user) {
      // User data is available, redirect based on role
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'partner':
          router.push('/dashboard/partner');
          break;
        case 'user':
          router.push('/dashboard/player');
          break;
        default:
          // Fallback if role is not recognized or player dashboard
          // For players, we might just render PlayerDashboardClient directly if this page is specific to them
          // For now, let's assume 'user' role is the default rendering here.
          // If it's not a known role, or we are explicitly rendering the PlayerDashboardClient here:
          if (user.role === 'user') {
            // This component already handles rendering PlayerDashboardClient if user.role is 'user'
            // So, no explicit redirect needed if we're going to render it below.
          } else {
            // If it's an unknown role, redirect to home or a forbidden page
            router.push('/');
          }
          break;
      }
    } else if (!loading && user === null) {
      // User is not authenticated, redirect to home/login
      router.push('/?auth=login');
    }
  }, [user, loading, fetchUser, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">Loading dashboard...</div>;
  }

  if (!user) {
    // If not loading and no user, it means they were redirected by useEffect
    return null; // Or a simple spinner to prevent flickering
  }

  if (user.role === 'user') {
    router.push('/dashboard/player'); // Explicitly redirect to the player dashboard page
    return null; // Stop rendering this page
  }

  // If user is not 'user' role, they would have been redirected by useEffect
  // This case should ideally not be reached if redirects work as expected.
  return null;
}
