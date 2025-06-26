import { Suspense } from "react"
import Link from "next/link"
import { Plus, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SyncStatus } from "@/components/sync-status"

import {
  AnalyticsTab,
  KeyMetrics,
  LobbiesTab,
  OverviewTab,
  PartnerHeader,
  RevenueTab,
  TeamTab,
} from "./components/DashboardComponents"

// Fallback Skeleton Components
function DashboardHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  )
}

function KeyMetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="mb-2 h-7 w-24" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="mb-2 h-7 w-20" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="mb-2 h-7 w-16" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="mb-2 h-7 w-20" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    </div>
  )
}

function TabContentSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default async function PartnerDashboardPage() {
  return (
    <div className="container space-y-8 py-10">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Suspense fallback={<DashboardHeaderSkeleton />}>
          <PartnerHeader />
        </Suspense>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/partner/minitours">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Lobby
            </Button>
          </Link>
          <Link href="/dashboard/partner/settings">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <SyncStatus status="live" />
        </div>
      </div>

      <Suspense fallback={<KeyMetricsSkeleton />}>
        <KeyMetrics />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lobbies">Lobbies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <OverviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="lobbies" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <LobbiesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <AnalyticsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <TeamTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <RevenueTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
