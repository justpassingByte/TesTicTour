import Link from "next/link"
import { ChevronRight, Trophy, Medal, Star, Clock, Calendar, BarChart3, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock player data
const player = {
  id: 1,
  name: "Player1",
  region: "AP",
  level: 312,
  rank: "Diamond 2",
  tournaments: [
    {
      id: 1,
      name: "TFT Championship Series",
      status: "ongoing",
      currentRound: 2,
      totalRounds: 4,
      placement: 3,
      points: 18,
      eliminated: false,
    },
    {
      id: 4,
      name: "TFT Summer Showdown",
      status: "finished",
      currentRound: 3,
      totalRounds: 3,
      placement: 5,
      points: 42,
      eliminated: false,
    },
  ],
  matches: [
    {
      id: 1,
      tournamentId: 1,
      tournamentName: "TFT Championship Series",
      round: 1,
      match: 1,
      lobby: "Lobby 1",
      placement: 1,
      points: 8,
      date: "2025-06-13",
    },
    {
      id: 2,
      tournamentId: 1,
      tournamentName: "TFT Championship Series",
      round: 1,
      match: 2,
      lobby: "Lobby 1",
      placement: 3,
      points: 6,
      date: "2025-06-13",
    },
    {
      id: 3,
      tournamentId: 1,
      tournamentName: "TFT Championship Series",
      round: 1,
      match: 3,
      lobby: "Lobby 1",
      placement: 5,
      points: 4,
      date: "2025-06-13",
    },
    {
      id: 4,
      tournamentId: 1,
      tournamentName: "TFT Championship Series",
      round: 2,
      match: 1,
      lobby: "Lobby 1",
      placement: 2,
      points: 7,
      date: "2025-06-14",
    },
    {
      id: 5,
      tournamentId: 4,
      tournamentName: "TFT Summer Showdown",
      round: 1,
      match: 1,
      lobby: "Lobby 2",
      placement: 2,
      points: 7,
      date: "2025-06-05",
    },
    {
      id: 6,
      tournamentId: 4,
      tournamentName: "TFT Summer Showdown",
      round: 1,
      match: 2,
      lobby: "Lobby 2",
      placement: 1,
      points: 8,
      date: "2025-06-05",
    },
  ],
  stats: {
    tournamentsPlayed: 2,
    tournamentsWon: 0,
    matchesPlayed: 6,
    averagePlacement: 2.33,
    topFourRate: 83,
    firstPlaceRate: 33,
  },
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/players">Players</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{player.name}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">{player.name}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{player.region} Region</Badge>
              <Badge variant="outline" className="bg-primary/20 text-primary">
                Level {player.level}
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
                {player.rank}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="tournaments">
            <TabsList>
              <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
              <TabsTrigger value="matches">Match History</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="tournaments" className="mt-4 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Tournaments</h2>
              {player.tournaments.length > 0 ? (
                <div className="space-y-4">
                  {player.tournaments.map((tournament) => (
                    <Card key={tournament.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{tournament.name}</CardTitle>
                            <CardDescription>
                              Round {tournament.currentRound} of {tournament.totalRounds}
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
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Current Placement</div>
                            <div className="flex items-center">
                              <Trophy className="mr-2 h-5 w-5 text-primary" />
                              <span className="font-medium">#{tournament.placement}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Total Points</div>
                            <div className="flex items-center">
                              <Star className="mr-2 h-5 w-5 text-primary" />
                              <span className="font-medium">{tournament.points} pts</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link href={`/tournaments/${tournament.id}`}>
                            <Button variant="outline" className="w-full">
                              View Tournament
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    This player is not participating in any tournaments.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="matches" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Match History</h2>
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tournament</TableHead>
                        <TableHead className="text-center">Round</TableHead>
                        <TableHead className="text-center">Match</TableHead>
                        <TableHead className="text-center">Lobby</TableHead>
                        <TableHead className="text-center">Placement</TableHead>
                        <TableHead className="text-center">Points</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {player.matches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>
                            <Link href={`/tournaments/${match.tournamentId}`} className="hover:text-primary">
                              {match.tournamentName}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">{match.round}</TableCell>
                          <TableCell className="text-center">{match.match}</TableCell>
                          <TableCell className="text-center">{match.lobby}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`
                              inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                              ${match.placement === 1 ? "bg-yellow-500/20 text-yellow-500" : ""}
                              ${match.placement === 2 ? "bg-gray-400/20 text-gray-400" : ""}
                              ${match.placement === 3 ? "bg-amber-700/20 text-amber-700" : ""}
                              ${match.placement > 3 ? "bg-secondary" : ""}
                            `}
                            >
                              {match.placement}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-medium">{match.points}</TableCell>
                          <TableCell className="text-right">{match.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Player Statistics</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Trophy className="mr-2 h-4 w-4 text-primary" />
                      Tournaments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{player.stats.tournamentsPlayed}</div>
                    <p className="text-xs text-muted-foreground">{player.stats.tournamentsWon} tournaments won</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Users className="mr-2 h-4 w-4 text-primary" />
                      Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{player.stats.matchesPlayed}</div>
                    <p className="text-xs text-muted-foreground">Across all tournaments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Medal className="mr-2 h-4 w-4 text-primary" />
                      Avg. Placement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{player.stats.averagePlacement}</div>
                    <p className="text-xs text-muted-foreground">{player.stats.topFourRate}% top 4 rate</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Detailed statistics across all tournaments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Top 4 Rate</div>
                        <div className="text-sm text-muted-foreground">{player.stats.topFourRate}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${player.stats.topFourRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">1st Place Rate</div>
                        <div className="text-sm text-muted-foreground">{player.stats.firstPlaceRate}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${player.stats.firstPlaceRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Average Points per Match</div>
                        <div className="flex items-center">
                          <Star className="mr-2 h-5 w-5 text-primary" />
                          <span className="font-medium">6.7 pts</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Best Placement</div>
                        <div className="flex items-center">
                          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                          <span className="font-medium">1st Place (2 times)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Player Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tournaments:</span>
                </div>
                <span className="font-medium">{player.stats.tournamentsPlayed}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Medal className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Avg. Placement:</span>
                </div>
                <span className="font-medium">{player.stats.averagePlacement}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Top 4 Rate:</span>
                </div>
                <span className="font-medium">{player.stats.topFourRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Active:</span>
                </div>
                <span className="font-medium">Today</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                </div>
                <span className="font-medium">June 1, 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                </div>
                <Badge variant="outline" className="bg-primary/20 text-primary">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="font-medium">TFT Championship Series</div>
                  <div className="text-sm text-muted-foreground">Round 2 - Match 2</div>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lobby:</span>
                      <span className="font-medium">Lobby 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">Today, 3:00 PM</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-medium">TFT Championship Series</div>
                  <div className="text-sm text-muted-foreground">Round 2 - Match 3</div>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lobby:</span>
                      <span className="font-medium">Lobby 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">Today, 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
