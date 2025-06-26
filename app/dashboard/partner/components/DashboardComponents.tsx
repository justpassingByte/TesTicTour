import { cache } from "react"
import Link from "next/link"
import {
  BarChart3,
  Coins,
  Crown,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Settings,
  Star,
  Trash2,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react"

import api from "@/lib/apiConfig"
import { MiniTourLobby } from "@/stores/miniTourLobbyStore"
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

// Types
interface PartnerData {
  partner: { name: string; logo: string; tier: string; verified: boolean; rating: number }
  metrics: {
    monthlyRevenue: number
    totalRevenue: number
    totalPlayers: number
    activeLobbies: number
    totalLobbies: number
    totalMatches: number
    revenueShare: number
  }
}
interface AnalyticsData {
  playerGrowth: { month: string; players: number }[]
  revenueGrowth: { month: string; revenue: number }[]
  performance: {
    totalPlayers: { value: number; change: number }
    totalRevenue: { value: number; change: number }
    averageRating: { value: number; change: number }
  }
}
interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  lastActive: string
  permissions: string[]
}

// Data Fetching Functions
export const getPartnerData = cache(async (): Promise<PartnerData | null> => {
  try {
    const response = await api.get("/partner/summary")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch partner data:", error)
    return null
  }
})
export const getPartnerLobbies = cache(async (): Promise<MiniTourLobby[]> => {
  try {
    const response = await api.get("/minitour-lobbies")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch partner lobbies:", error)
    return []
  }
})
export const getAnalyticsData = cache(async (): Promise<AnalyticsData | null> => {
  try {
    const response = await api.get("/partner/analytics")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch analytics data:", error)
    return null
  }
})
export const getTeamData = cache(async (): Promise<TeamMember[]> => {
  try {
    const response = await api.get("/partner/team")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch team data:", error)
    return []
  }
})

// --- ASYNC COMPONENTS ---

export async function PartnerHeader() {
  const data = await getPartnerData()
  if (!data) return null
  const { partner } = data
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

export async function KeyMetrics() {
  const data = await getPartnerData()
  if (!data) return <div>Failed to load metrics.</div>
  const { metrics } = data
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
              <p className="text-2xl font-bold">
                {metrics.activeLobbies}/{metrics.totalLobbies}
              </p>
              <p className="text-xs text-muted-foreground">Active Lobbies</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{metrics.totalMatches.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Matches</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export async function OverviewTab() {
  const [partnerData, lobbies] = await Promise.all([getPartnerData(), getPartnerLobbies()])
  if (!partnerData) return <p>Could not load overview.</p>

  const { partner, metrics } = partnerData
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Your lobbies' performance over the last 30 days</CardDescription>
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
            <Link href="/dashboard/partner/minitours">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" /> Create New Lobby
              </Button>
            </Link>
            <Link href="/dashboard/partner/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" /> View Detailed Analytics
              </Button>
            </Link>
            <Link href="/dashboard/partner/team">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" /> Manage Team
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
  )
}

export async function LobbiesTab() {
  const lobbies = await getPartnerLobbies()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Lobbies</h2>
        <Link href="/dashboard/partner/minitours">
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

export async function AnalyticsTab() {
  const analyticsData = await getAnalyticsData()
  if (!analyticsData) return <p>Could not load analytics.</p>
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Player Growth</CardTitle>
            <CardDescription>Total players over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end justify-between space-x-2">
              {analyticsData.playerGrowth.map((data) => (
                <div key={data.month} className="flex flex-col items-center space-y-2">
                  <div
                    className="w-8 rounded-t bg-primary"
                    style={{
                      height: `${
                        (data.players / Math.max(...analyticsData.playerGrowth.map((d) => d.players))) * 160
                      }px`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly revenue in coins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end justify-between space-x-2">
              {analyticsData.revenueGrowth.map((data) => (
                <div key={data.month} className="flex flex-col items-center space-y-2">
                  <div
                    className="w-8 rounded-t bg-green-500"
                    style={{
                      height: `${
                        (data.revenue / Math.max(...analyticsData.revenueGrowth.map((d) => d.revenue))) * 160
                      }px`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Detailed analytics for your lobbies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-2xl font-bold">{analyticsData.performance.totalPlayers.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Players</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +{analyticsData.performance.totalPlayers.change}% from last month
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">${analyticsData.performance.totalRevenue.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +{analyticsData.performance.totalRevenue.change}% from last month
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{analyticsData.performance.averageRating.value}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
              <div className="flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                +{analyticsData.performance.averageRating.change} from last month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export async function TeamTab() {
  const teamMembers = await getTeamData()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Permissions</TableHead>
                <TableHead className="text-center">Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`
                        ${member.role === "Admin" ? "bg-red-500/20 text-red-500" : ""}
                        ${member.role === "Moderator" ? "bg-blue-500/20 text-blue-500" : ""}
                        ${member.role === "Analyst" ? "bg-green-500/20 text-green-500" : ""}
                      `}
                    >
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {member.permissions.slice(0, 2).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace(/_/g, " ")}
                        </Badge>
                      ))}
                      {member.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {new Date(member.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export async function RevenueTab() {
  const [partnerData, lobbies] = await Promise.all([getPartnerData(), getPartnerLobbies()])
  if (!partnerData) return <p>Could not load revenue data.</p>
  const { metrics } = partnerData
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="mr-3 h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="mr-3 h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{metrics.revenueShare}%</p>
                <p className="text-xs text-muted-foreground">Revenue Share</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Detailed breakdown of your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lobbies.map((lobby) => (
              <div key={lobby.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-medium">{lobby.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {lobby.matches.length} matches • {lobby.currentPlayers} active players
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    <Coins className="mr-1 inline h-4 w-4" />
                    {lobby.prizePool}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${((lobby.prizePool * metrics.revenueShare) / 100).toFixed(2)} potential earnings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
