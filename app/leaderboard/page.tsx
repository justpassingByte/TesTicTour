"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Trophy, Medal, Star, TrendingUp, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SyncStatus } from "@/components/sync-status"

// Mock leaderboard data
const globalLeaderboard = [
  {
    id: 1,
    rank: 1,
    player: "TFTMaster2024",
    region: "AP",
    totalPoints: 2847,
    tournamentsPlayed: 12,
    tournamentsWon: 3,
    averagePlacement: 2.1,
    topFourRate: 89,
    winStreak: 8,
    lastActive: "2025-06-16",
    trend: "up",
  },
  {
    id: 2,
    rank: 2,
    player: "ChampionPlayer",
    region: "NA",
    totalPoints: 2756,
    tournamentsPlayed: 15,
    tournamentsWon: 2,
    averagePlacement: 2.3,
    topFourRate: 85,
    winStreak: 5,
    lastActive: "2025-06-15",
    trend: "up",
  },
  {
    id: 3,
    rank: 3,
    player: "ProGamer123",
    region: "EUW",
    totalPoints: 2689,
    tournamentsPlayed: 10,
    tournamentsWon: 4,
    averagePlacement: 2.0,
    topFourRate: 92,
    winStreak: 12,
    lastActive: "2025-06-16",
    trend: "up",
  },
  {
    id: 4,
    rank: 4,
    player: "KoreanLegend",
    region: "KR",
    totalPoints: 2634,
    tournamentsPlayed: 8,
    tournamentsWon: 2,
    averagePlacement: 1.9,
    topFourRate: 94,
    winStreak: 3,
    lastActive: "2025-06-14",
    trend: "down",
  },
  {
    id: 5,
    rank: 5,
    player: "EUWChampion",
    region: "EUW",
    totalPoints: 2578,
    tournamentsPlayed: 11,
    tournamentsWon: 1,
    averagePlacement: 2.4,
    topFourRate: 82,
    winStreak: 2,
    lastActive: "2025-06-16",
    trend: "stable",
  },
  {
    id: 6,
    rank: 6,
    player: "NAProdigy",
    region: "NA",
    totalPoints: 2523,
    tournamentsPlayed: 9,
    tournamentsWon: 1,
    averagePlacement: 2.6,
    topFourRate: 78,
    winStreak: 1,
    lastActive: "2025-06-15",
    trend: "up",
  },
  {
    id: 7,
    rank: 7,
    player: "APMaster",
    region: "AP",
    totalPoints: 2467,
    tournamentsPlayed: 13,
    tournamentsWon: 0,
    averagePlacement: 2.8,
    topFourRate: 75,
    winStreak: 0,
    lastActive: "2025-06-13",
    trend: "down",
  },
  {
    id: 8,
    rank: 8,
    player: "RisingTalent",
    region: "KR",
    totalPoints: 2412,
    tournamentsPlayed: 7,
    tournamentsWon: 1,
    averagePlacement: 2.5,
    topFourRate: 80,
    winStreak: 4,
    lastActive: "2025-06-16",
    trend: "up",
  },
]

// Mock regional stats
const regionalStats = [
  { region: "AP", players: 1247, avgPoints: 1834, topPlayer: "TFTMaster2024" },
  { region: "NA", players: 1156, avgPoints: 1789, topPlayer: "ChampionPlayer" },
  { region: "EUW", players: 1089, avgPoints: 1823, topPlayer: "ProGamer123" },
  { region: "KR", players: 892, avgPoints: 1945, topPlayer: "KoreanLegend" },
  { region: "OCE", players: 234, avgPoints: 1567, topPlayer: "OceaniaPro" },
]

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [timeframe, setTimeframe] = useState<string>("all-time")

  // Filter leaderboard based on search and region
  const filteredLeaderboard = globalLeaderboard.filter((player) => {
    const matchesSearch = player.player.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "all" || player.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Global Leaderboard</h1>
          <p className="text-muted-foreground">Top players ranked by tournament performance across all regions.</p>
        </div>
        <SyncStatus status="live" />
      </div>

      {/* Top 3 Podium */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {globalLeaderboard.slice(0, 3).map((player, index) => (
          <Card
            key={player.id}
            className={`
              ${index === 0 ? "border-yellow-500/50 bg-yellow-500/5" : ""}
              ${index === 1 ? "border-gray-400/50 bg-gray-400/5" : ""}
              ${index === 2 ? "border-amber-700/50 bg-amber-700/5" : ""}
              card-hover-effect
            `}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={player.player} />
                    <AvatarFallback className="text-lg">{player.player.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`
                      absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                      ${index === 0 ? "bg-yellow-500" : ""}
                      ${index === 1 ? "bg-gray-400" : ""}
                      ${index === 2 ? "bg-amber-700" : ""}
                    `}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold">{player.player}</h3>
                    <Badge variant="outline">{player.region}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-primary">{player.totalPoints.toLocaleString()} pts</div>
                  <div className="text-sm text-muted-foreground">
                    {player.tournamentsWon} wins • {player.topFourRate}% top 4
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="AP">AP</SelectItem>
              <SelectItem value="NA">NA</SelectItem>
              <SelectItem value="EUW">EUW</SelectItem>
              <SelectItem value="KR">KR</SelectItem>
              <SelectItem value="OCE">OCE</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList>
          <TabsTrigger value="global">Global Rankings</TabsTrigger>
          <TabsTrigger value="regional">Regional Stats</TabsTrigger>
          <TabsTrigger value="rising">Rising Stars</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">Region</TableHead>
                    <TableHead className="text-center">Total Points</TableHead>
                    <TableHead className="text-center">Tournaments</TableHead>
                    <TableHead className="text-center">Wins</TableHead>
                    <TableHead className="text-center">Avg. Placement</TableHead>
                    <TableHead className="text-center">Top 4 Rate</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                    <TableHead className="text-center">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboard.map((player) => (
                    <TableRow key={player.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {player.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500 mr-1" />}
                          {player.rank === 2 && <Medal className="h-4 w-4 text-gray-400 mr-1" />}
                          {player.rank === 3 && <Medal className="h-4 w-4 text-amber-700 mr-1" />}#{player.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.player} />
                            <AvatarFallback className="text-xs">{player.player.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Link href={`/players/${player.id}`} className="hover:text-primary font-medium">
                            {player.player}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{player.region}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">{player.totalPoints.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{player.tournamentsPlayed}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                          {player.tournamentsWon}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{player.averagePlacement}</TableCell>
                      <TableCell className="text-center">{player.topFourRate}%</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {player.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {player.trend === "down" && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                          {player.trend === "stable" && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">{player.lastActive}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regionalStats.map((region) => (
              <Card key={region.region}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    {region.region} Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Players:</span>
                    <span className="font-medium">{region.players.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Points:</span>
                    <span className="font-medium">{region.avgPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top Player:</span>
                    <span className="font-medium">{region.topPlayer}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Regional Leaderboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rising" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-primary" />
                Rising Stars
              </CardTitle>
              <CardDescription>Players with the highest improvement in recent tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">Region</TableHead>
                    <TableHead className="text-center">Current Rank</TableHead>
                    <TableHead className="text-center">Rank Change</TableHead>
                    <TableHead className="text-center">Win Streak</TableHead>
                    <TableHead className="text-center">Recent Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalLeaderboard
                    .filter((player) => player.trend === "up")
                    .slice(0, 5)
                    .map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.player} />
                              <AvatarFallback className="text-xs">{player.player.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Link href={`/players/${player.id}`} className="hover:text-primary font-medium">
                              {player.player}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{player.region}</Badge>
                        </TableCell>
                        <TableCell className="text-center">#{player.rank}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center text-green-500">
                            <TrendingUp className="h-4 w-4 mr-1" />+{Math.floor(Math.random() * 10) + 1}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-500/20 text-green-500">{player.winStreak}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{player.topFourRate}%</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
