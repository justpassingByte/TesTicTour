import Link from "next/link"
import {
  Plus,
  Settings,
  Users,
  Trophy,
  BarChart3,
  Shuffle,
  RefreshCw,
  FileSpreadsheet,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { SyncStatus } from "@/components/sync-status"

// Mock tournaments data
const tournaments = [
  {
    id: 1,
    name: "TFT Championship Series",
    status: "ongoing",
    region: "AP",
    currentRound: 2,
    totalRounds: 4,
    registeredPlayers: 48,
    maxPlayers: 64,
    lastSync: "2 minutes ago",
    syncStatus: "success",
  },
  {
    id: 2,
    name: "Weekend Warriors Cup",
    status: "upcoming",
    region: "NA",
    currentRound: 0,
    totalRounds: 3,
    registeredPlayers: 32,
    maxPlayers: 64,
    lastSync: "1 hour ago",
    syncStatus: "idle",
  },
  {
    id: 3,
    name: "Global TFT Masters",
    status: "upcoming",
    region: "Global",
    currentRound: 0,
    totalRounds: 5,
    registeredPlayers: 96,
    maxPlayers: 128,
    lastSync: "30 minutes ago",
    syncStatus: "idle",
  },
  {
    id: 4,
    name: "TFT Summer Showdown",
    status: "finished",
    region: "EUW",
    currentRound: 3,
    totalRounds: 3,
    registeredPlayers: 64,
    maxPlayers: 64,
    lastSync: "2 days ago",
    syncStatus: "idle",
  },
]

export default function AdminDashboard() {
  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage tournaments, players, and settings.</p>
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

      <Tabs defaultValue="tournaments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tournaments.length}</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tournaments.filter((t) => t.status === "ongoing").length}</div>
                <p className="text-xs text-muted-foreground">
                  {tournaments.filter((t) => t.status === "upcoming").length} upcoming
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tournaments.reduce((acc, t) => acc + t.registeredPlayers, 0)}</div>
                <p className="text-xs text-muted-foreground">Across all tournaments</p>
              </CardContent>
            </Card>
            <Card>
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

          <div className="grid gap-4">
            {tournaments.map((tournament) => (
              <Card key={tournament.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle>{tournament.name}</CardTitle>
                      <CardDescription>
                        {tournament.region} Region • {tournament.registeredPlayers} players
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                      ${tournament.status === "ongoing" ? "bg-primary/20 text-primary" : ""}
                      ${tournament.status === "upcoming" ? "bg-yellow-500/20 text-yellow-500" : ""}
                      ${tournament.status === "finished" ? "bg-muted text-muted-foreground" : ""}
                      capitalize
                    `}
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Registration</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {tournament.registeredPlayers} / {tournament.maxPlayers}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round((tournament.registeredPlayers / tournament.maxPlayers) * 100)}%
                          </div>
                        </div>
                        <Progress value={(tournament.registeredPlayers / tournament.maxPlayers) * 100} />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Progress</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Round {tournament.currentRound} / {tournament.totalRounds}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round((tournament.currentRound / tournament.totalRounds) * 100)}%
                          </div>
                        </div>
                        <Progress value={(tournament.currentRound / tournament.totalRounds) * 100} />
                      </div>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className="flex items-center mr-4">
                        <span className="text-muted-foreground mr-2">Last sync:</span>
                        <span>{tournament.lastSync}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">Status:</span>
                        <div className="flex items-center">
                          {tournament.syncStatus === "success" && (
                            <CheckCircle2 className="h-4 w-4 text-advanced mr-1" />
                          )}
                          {tournament.syncStatus === "idle" && <Clock className="h-4 w-4 text-muted-foreground mr-1" />}
                          {tournament.syncStatus === "error" && (
                            <AlertCircle className="h-4 w-4 text-destructive mr-1" />
                          )}
                          <span
                            className={`
                            ${tournament.syncStatus === "success" ? "text-advanced" : ""}
                            ${tournament.syncStatus === "idle" ? "text-muted-foreground" : ""}
                            ${tournament.syncStatus === "error" ? "text-destructive" : ""}
                            capitalize
                          `}
                          >
                            {tournament.syncStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/tournaments/${tournament.id}/players`}>
                        <Users className="mr-2 h-4 w-4" />
                        Players
                      </Link>
                    </Button>
                    {tournament.status !== "finished" && (
                      <Button variant="outline" size="sm">
                        <Shuffle className="mr-2 h-4 w-4" />
                        Assign Lobbies
                      </Button>
                    )}
                    {tournament.status === "ongoing" && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Matches
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/admin/tournaments/${tournament.id}/edit`} className="flex w-full">
                            Edit Tournament
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Recalculate Points</DropdownMenuItem>
                        {tournament.status === "ongoing" && <DropdownMenuItem>Advance to Next Round</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete Tournament</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>Player Management</CardTitle>
              <CardDescription>View and manage all players across tournaments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-center py-8 text-muted-foreground">
                Player management interface will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure API keys, notification settings, and platform defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-center py-8 text-muted-foreground">Settings interface will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
