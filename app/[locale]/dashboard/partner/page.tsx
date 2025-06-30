import { Suspense } from "react"
import Link from "next/link"
import { Plus, Settings, DollarSign, Users, Trophy, BarChart3, Coins } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SyncStatus } from "@/components/sync-status"

import {
  PlayerTab,
  getPlayersData,
} from "./components/DashboardComponents"

import {
  AnalyticsTab,
  LobbiesTab,
  OverviewTab,
  PartnerHeader,
  RevenueTab,
  SettingsTab,
} from "./components/PartnerServerComponents"

import { getPartnerData, getPartnerLobbies, getAnalyticsData } from "./lib/data"

import { MiniTourLobby, MiniTourMatch, MiniTourMatchResult, PartnerData, AnalyticsData, Player } from "@/stores/miniTourLobbyStore";

// Fallback Skeleton Components
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
  // Mock data for MiniTourMatchResult
  const mockMiniTourMatchResult: MiniTourMatchResult = {
    id: "mock-match-result-1",
    userId: "mock-user-1",
    user: { id: "mock-user-1", username: "mockuser" },
    placement: 1,
    points: 100,
  };

  // Mock data for MiniTourMatch
  const mockMiniTourMatch: MiniTourMatch = {
    id: "mock-match-1",
    miniTourLobbyId: "mock-lobby-1",
    status: "COMPLETED",
    matchIdRiotApi: null,
    fetchedAt: new Date().toISOString(),
    matchData: { /* empty for now */ },
    miniTourMatchResults: [mockMiniTourMatchResult],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPartnerData: PartnerData = {
    partner: { name: "thaytft", logo: "", tier: "Gold", verified: true, rating: 4.5 },
    metrics: {
      monthlyRevenue: 15000,
      totalRevenue: 150000,
      totalPlayers: 5000,
      activeLobbies: 15,
      totalLobbies: 20,
      totalMatches: 100,
      revenueShare: 70,
      balance: 25000,
    },
  };

  const mockLobbies: MiniTourLobby[] = [
    { 
      id: "1", name: "Mock Lobby 1", status: "WAITING", currentPlayers: 10, maxPlayers: 20, entryFee: 100, prizePool: 500, averageRating: 4.2, 
      matches: [mockMiniTourMatch], entryType: "Free", gameMode: "Solo", skillLevel: "Beginner", totalMatches: 1, 
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ["mock", "test"], rules: ["no cheating"], 
      participants: [], ownerId: "mock-user-1", settings: { autoStart: true, privateMode: false },
      customLogoUrl: "", description: "", theme: "", prizeDistribution: {},
    },
    { 
      id: "2", name: "Mock Lobby 2", status: "IN_PROGRESS", currentPlayers: 15, maxPlayers: 25, entryFee: 50, prizePool: 300, averageRating: 3.8, 
      matches: [mockMiniTourMatch], entryType: "Paid", gameMode: "Team", skillLevel: "Intermediate", totalMatches: 2, 
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ["mock", "competitive"], rules: ["fair play"],
      participants: [], ownerId: "mock-user-1", settings: { autoStart: true, privateMode: false },
      customLogoUrl: "", description: "", theme: "", prizeDistribution: {},
    },
    { 
      id: "3", name: "Mock Lobby 3", status: "COMPLETED", currentPlayers: 20, maxPlayers: 20, entryFee: 200, prizePool: 1000, averageRating: 4.7, 
      matches: [mockMiniTourMatch], entryType: "Paid", gameMode: "Solo", skillLevel: "Advanced", totalMatches: 3, 
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ["mock", "grand-final"], rules: ["standard"],
      participants: [], ownerId: "mock-user-1", settings: { autoStart: false, privateMode: true },
      customLogoUrl: "", description: "", theme: "", prizeDistribution: {},
    },
  ];

  const mockAnalyticsData: AnalyticsData = {
    playerGrowth: [
      { month: "Jan", players: 100 },
      { month: "Feb", players: 120 },
      { month: "Mar", players: 150 },
      { month: "Apr", players: 130 },
      { month: "May", players: 180 },
      { month: "Jun", players: 200 },
    ],
    revenueGrowth: [
      { month: "Jan", revenue: 1000 },
      { month: "Feb", revenue: 1200 },
      { month: "Mar", revenue: 1500 },
      { month: "Apr", revenue: 1300 },
      { month: "May", revenue: 1800 },
      { month: "Jun", revenue: 2000 },
    ],
    performance: {
      totalPlayers: { value: 20000, change: 5 },
      totalRevenue: { value: 50000, change: 10 },
      averageRating: { value: 4.5, change: 0.2 },
    },
  };

  const mockPlayers: Player[] = [
    { id: "p1", username: "playerone", email: "player1@example.com", riotGameName: "PlayerOne", riotGameTag: "NA1", region: "NA", role: "PLAYER", totalMatchesPlayed: 10, tournamentsWon: 3, balance: 50000, isActive: true, totalAmountWon: 15000 },
    { id: "p2", username: "playertwo", email: "player2@example.com", riotGameName: "PlayerTwo", riotGameTag: "EUW", region: "EUW", role: "PLAYER", totalMatchesPlayed: 8, tournamentsWon: 1, balance: 20000, isActive: true, totalAmountWon: 5000 },
    { id: "p3", username: "playerthree", email: "player3@example.com", riotGameName: "PlayerThree", riotGameTag: "KR1", region: "KR", role: "PLAYER", totalMatchesPlayed: 12, tournamentsWon: 5, balance: 75000, isActive: false, totalAmountWon: 20000 },
  ];

  const [partnerData, lobbies] = await Promise.all([getPartnerData(), getPartnerLobbies()]);
  const currentPartnerData = partnerData || mockPartnerData;
  const currentLobbies = lobbies.length > 0 ? lobbies : mockLobbies;

  const analyticsData = await getAnalyticsData();
  const currentAnalyticsData = analyticsData || mockAnalyticsData;

  const referrerName = currentPartnerData.partner.name;
  // console.log("Referrer Name being used:", referrerName);
  // const playersData = await getPlayersData(referrerName);
  // const currentPlayers = playersData.length > 0 ? playersData : mockPlayers;

  const summaryData = {
    monthlyRevenue: currentPartnerData.metrics.monthlyRevenue,
    totalPlayers: currentPartnerData.metrics.totalPlayers,
    totalLobbies: currentPartnerData.metrics.totalLobbies,
    partnerBalance: currentPartnerData.metrics.balance,
  };

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your partnership, lobbies, players, and earnings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/partner/lobbies">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Lobby
            </Button>
          </Link>
          <SyncStatus status="live" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This Month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.partnerBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalPlayers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all lobbies</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lobbies</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalLobbies.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total active and completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lobbies">Lobbies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Players</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <OverviewTab partnerData={currentPartnerData} lobbies={currentLobbies} />
          </Suspense>
        </TabsContent>

        <TabsContent value="lobbies" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <LobbiesTab lobbies={currentLobbies} />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <AnalyticsTab analyticsData={currentAnalyticsData} />
          </Suspense>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <PlayerTab /* players={currentPlayers} */ referrer={referrerName} />
          </Suspense>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <RevenueTab partnerData={currentPartnerData} lobbies={currentLobbies} />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Suspense fallback={<TabContentSkeleton />}>
            <SettingsTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
