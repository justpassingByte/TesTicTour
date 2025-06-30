import Link from "next/link"
import {
  BarChart3,
  Coins,
  Crown,
  DollarSign,
  MoreHorizontal,
  Plus,
  Settings,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react"

import { MiniTourLobby, PartnerData, AnalyticsData } from "@/stores/miniTourLobbyStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LobbyActions } from "./LobbyActions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import api from "@/lib/apiConfig"

// --- ASYNC COMPONENTS ---

export async function PartnerHeader({ partnerData }: { partnerData: PartnerData | null }) {
  if (!partnerData) return null
  const { partner } = partnerData
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Avatar className="h-16 w-16">
          <AvatarImage src={partner.logo || "/placeholder.svg"} alt={partner.name} />
          <AvatarFallback className="text-lg">{partner.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {partner.verified && (
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Crown className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{partner.name}</h1>
        <div className="flex items-center space-x-2">
          <Badge className="bg-primary/20 text-primary">{partner.tier} Partner</Badge>
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{partner.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function KeyMetrics({ partnerData }: { partnerData: PartnerData | null }) {
  if (!partnerData) return <div>Failed to load partner metrics. Please check the API.</div>
  const { metrics } = partnerData
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <DollarSign className="mr-3 h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Coins className="mr-3 h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">${metrics.balance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Partner Balance</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{metrics.totalPlayers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Players</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Trophy className="mr-3 h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{metrics.totalLobbies.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Lobbies</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export async function OverviewTab({ partnerData, lobbies }: { partnerData: PartnerData | null; lobbies: MiniTourLobby[] }) {
  if (!partnerData) return <p>Could not load overview.</p>

  const { partner, metrics } = partnerData
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Your lobbies performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Player Satisfaction</span>
                <span className="text-sm font-medium">{partner.rating}/5.0</span>
              </div>
              <Progress value={partner.rating * 20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Lobby Utilization</span>
                <span className="text-sm font-medium">
                  {metrics.totalLobbies > 0 ? Math.round((metrics.activeLobbies / metrics.totalLobbies) * 100) : 0}%
                </span>
              </div>
              <Progress value={metrics.totalLobbies > 0 ? (metrics.activeLobbies / metrics.totalLobbies) * 100 : 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Revenue Share</span>
                <span className="text-sm font-medium">{metrics.revenueShare}%</span>
              </div>
              <Progress value={metrics.revenueShare} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your lobbies and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/partner/lobbies">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" /> Create New Lobby
              </Button>
            </Link>
            <Link href="/dashboard/partner/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" /> View Detailed Analytics
              </Button>
            </Link>
            <Link href="/dashboard/partner/players">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" /> Manage Players
              </Button>
            </Link>
            <Link href="/dashboard/partner/settings">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" /> Partner Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Lobbies</CardTitle>
          <CardDescription>Your most successful lobbies this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lobbies
              .filter((lobby) => lobby.status === "WAITING" || lobby.status === "IN_PROGRESS")
              .sort((a, b) => b.prizePool - a.prizePool)
              .slice(0, 3)
              .map((lobby) => (
                <div key={lobby.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">{lobby.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>
                        {lobby.currentPlayers}/{lobby.maxPlayers} players
                      </span>
                      <span>{lobby.matches.length} matches</span>
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 text-yellow-500" />
                        {lobby.averageRating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      <Coins className="mr-1 inline h-4 w-4" />
                      {lobby.prizePool}
                    </div>
                    <div className="text-sm text-muted-foreground">Prize Pool</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export async function LobbiesTab({ lobbies }: { lobbies: MiniTourLobby[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Lobbies</h2>
        <Link href="/dashboard/partner/lobbies">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Lobby
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lobby Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Players</TableHead>
                <TableHead className="text-center">Entry Fee</TableHead>
                <TableHead className="text-center">Prize Pool</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lobbies.map((lobby) => (
                <TableRow key={lobby.id}>
                  <TableCell className="font-medium">{lobby.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`
                        ${lobby.status === "WAITING" ? "bg-green-500/20 text-green-500" : ""}
                        ${lobby.status === "IN_PROGRESS" ? "bg-yellow-500/20 text-yellow-500" : ""}
                        ${
                          lobby.status === "COMPLETED" || lobby.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-500"
                            : ""
                        }
                      `}
                    >
                      {lobby.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {lobby.currentPlayers}/{lobby.maxPlayers}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Coins className="mr-1 h-3 w-3" />
                      {lobby.entryFee}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Coins className="mr-1 h-3 w-3" />
                      {lobby.prizePool}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Star className="mr-1 h-3 w-3 text-yellow-500" />
                      {lobby.averageRating}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <LobbyActions lobby={lobby} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export async function AnalyticsTab({ analyticsData }: { analyticsData: AnalyticsData | null }) {
  if (!analyticsData) return <p>Could not load analytics.</p>

  const { playerGrowth, revenueGrowth, performance } = analyticsData

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Player Growth</CardTitle>
            <CardDescription>New players over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a chart */}
            <div className="h-[200px] w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
              Chart showing player growth
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a chart */}
            <div className="h-[200px] w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
              Chart showing revenue growth
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="mr-3 h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{performance.totalPlayers.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Players</p>
                <p className={`text-sm ${performance.totalPlayers.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {performance.totalPlayers.change >= 0 ? "+" : ""}{performance.totalPlayers.change.toLocaleString()}% vs last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="mr-3 h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${performance.totalRevenue.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className={`text-sm ${performance.totalRevenue.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {performance.totalRevenue.change >= 0 ? "+" : ""}{performance.totalRevenue.change.toLocaleString()}% vs last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Star className="mr-3 h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{performance.averageRating.value.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Average Rating</p>
                <p className={`text-sm ${performance.averageRating.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {performance.averageRating.change >= 0 ? "+" : ""}{performance.averageRating.change.toFixed(1)} vs last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function RevenueTab({ partnerData, lobbies }: { partnerData: PartnerData | null; lobbies: MiniTourLobby[] }) {
  if (!partnerData) return <p>Could not load revenue data.</p>
  const { metrics } = partnerData

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="mr-3 h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Coins className="mr-3 h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${metrics.balance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Current Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="mr-3 h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{metrics.revenueShare}%</p>
                <p className="text-xs text-muted-foreground">Your Revenue Share</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Trophy className="mr-3 h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalMatches.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Matches Played</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown by Lobby</CardTitle>
          <CardDescription>Performance of each lobby</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lobby Name</TableHead>
                <TableHead>Total Players</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Your Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lobbies.map((lobby) => (
                <TableRow key={lobby.id}>
                  <TableCell className="font-medium">{lobby.name}</TableCell>
                  <TableCell>{lobby.currentPlayers}/{lobby.maxPlayers}</TableCell>
                  <TableCell>${lobby.prizePool.toLocaleString()}</TableCell>
                  <TableCell>${((lobby.prizePool * metrics.revenueShare) / 100).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export async function SettingsTab() {
  // Mock data that would normally come from an API
  const partnerSettings = {
    partnerName: "TesTicTour Partner",
    partnerLogo: "/placeholder.svg",
    contactEmail: "partner@example.com",
    payoutMethod: "Bank Transfer",
    autoPayout: true,
    notifications: {
      email: true,
      sms: false,
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Partner Settings</h2>
      <form className="space-y-6">
        <Card>
          <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="partnerName">Partner Name</Label>
              <Input id="partnerName" defaultValue={partnerSettings.partnerName} />
            </div>
            <div>
              <Label htmlFor="partnerLogo">Partner Logo URL</Label>
              <Input id="partnerLogo" defaultValue={partnerSettings.partnerLogo} />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" defaultValue={partnerSettings.contactEmail} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payout Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="payoutMethod">Payout Method</Label>
              <Input id="payoutMethod" defaultValue={partnerSettings.payoutMethod} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoPayout"
                defaultChecked={partnerSettings.autoPayout}
              />
              <Label htmlFor="autoPayout">Enable Auto Payout</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="emailNotifications"
                defaultChecked={partnerSettings.notifications.email}
              />
              <Label htmlFor="emailNotifications">Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="smsNotifications"
                defaultChecked={partnerSettings.notifications.sms}
              />
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
            </div>
          </CardContent>
        </Card>

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
} 