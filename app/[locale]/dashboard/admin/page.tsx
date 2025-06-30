"use client"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Plus, Settings, Users, Trophy, BarChart3, Gamepad2, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SyncStatus } from "@/components/sync-status"

const LoadingSpinner = () => <div className="text-center py-8">Loading...</div>;

const TournamentManagementTab = dynamic(() => import('./components/TournamentManagementTab'), { loading: LoadingSpinner });
const UserManagementTab = dynamic(() => import('./components/UserManagementTab'), { loading: LoadingSpinner });
const MinitourManagementTab = dynamic(() => import('./components/MinitourManagementTab'), { loading: LoadingSpinner });
const RewardManagementTab = dynamic(() => import('./components/RewardManagementTab'), { loading: LoadingSpinner });
const SettingsTab = dynamic(() => import('./components/SettingsTab'), { loading: LoadingSpinner });

// Mock data for summary cards - in a real app, this would be fetched
const summaryData = {
  totalTournaments: 4,
  activeTournaments: 1,
  upcomingTournaments: 2,
  totalPlayers: 240
}

export default function AdminDashboardPage() {
  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage tournaments, users, rewards, and more.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/tournaments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Tournament
            </Link>
          </Button>
          <SyncStatus status="idle" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalTournaments}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.activeTournaments}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData.upcomingTournaments} upcoming
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">Across all tournaments</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-advanced mr-2" />
              <div className="text-sm font-medium">Operational</div>
            </div>
            <p className="text-xs text-muted-foreground">Last checked 5 minutes ago</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tournaments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tournaments"><Trophy className="mr-2 h-4 w-4" />Tournaments</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="minitours"><Gamepad2 className="mr-2 h-4 w-4" />Minitours</TabsTrigger>
          <TabsTrigger value="rewards"><Gift className="mr-2 h-4 w-4" />Rewards</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments">
          <TournamentManagementTab />
        </TabsContent>
        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>
        <TabsContent value="minitours">
          <MinitourManagementTab />
        </TabsContent>
        <TabsContent value="rewards">
          <RewardManagementTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}