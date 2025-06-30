import { redirect } from 'next/navigation';
import React from 'react';
import { AuthServerService } from '@/app/services/AuthServerService';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await AuthServerService.getMe();

  if (!user) {
    // Redirect to home to open login modal if not authenticated
    redirect('/?auth=login');
  }

  return (
    <div className="flex min-h-screen">
      <main className={`flex-1 p-8 bg-muted/40`}>
        {children}
      </main>
    </div>
  );
} 