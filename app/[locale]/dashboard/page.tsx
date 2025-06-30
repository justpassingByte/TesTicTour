import PlayerDashboardClient from "./components/PlayerDashboardClient"
import { redirect } from "next/navigation";
import { AuthServerService } from "@/app/services/AuthServerService";

export default async function DashboardPage() {
  // Call getMyProfile() ONCE. It contains all the necessary data.
  const userProfile = await AuthServerService.getMyProfile();

  // This single check handles both authentication and data availability.
  if (!userProfile) {
    redirect('/');
  }

  // Handle role-based redirection from the entry page.
  switch (userProfile.role) {
    case 'admin':
      redirect('/dashboard/admin');
      break; // Prevent fall-through
    case 'partner':
      redirect('/dashboard/partner');
      break; // Prevent fall-through
    case 'user':
    default:
      // If the user is a player, render their dashboard.
      return <PlayerDashboardClient user={userProfile} />;
  }
}
