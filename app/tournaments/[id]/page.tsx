import Link from "next/link"
import {
  CalendarDays,
  Clock,
  Globe,
  Users,
  Trophy,
  CircleUser,
  Medal,
  Table,
  CalendarClock,
  ChevronRight,
  ArrowDown,
  DollarSign,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SyncStatus } from "@/components/sync-status"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Mock tournament data
const tournament = {
  id: 1,
  name: "TFT Championship Series",
  status: "ongoing",
  description:
    "The biggest TFT tournament of the year, featuring top players from around the world competing for a prize pool of $10,000.",
  image: "/placeholder.svg?height=400&width=400",
  startDate: "2025-06-13",
  endDate: "2025-06-15",
  currentRound: 2,
  totalRounds: 4,
  matchesPerRound: 3,
  region: "AP",
  playerCount: 64,
  registeredPlayers: 48,
  registrationDeadline: "2025-06-12",
  budget: "$15,000",
  registrationFee: "$10",
  pointSystem: {
    first: 8,
    second: 7,
    third: 6,
    fourth: 5,
    fifth: 4,
    sixth: 3,
    seventh: 2,
    eighth: 1,
  },
  eliminationRule: "Bottom 4 players from each lobby are eliminated after each round",
  rounds: [
    {
      number: 1,
      status: "completed",
      lobbies: 8,
      matches: 3,
      completed: true,
    },
    {
      number: 2,
      status: "in_progress",
      lobbies: 4,
      matches: 3,
      completed: false,
    },
    {
      number: 3,
      status: "upcoming",
      lobbies: 2,
      matches: 3,
      completed: false,
    },
    {
      number: 4,
      status: "upcoming",
      lobbies: 1,
      matches: 4,
      completed: false,
    },
  ],
  players: [
    { id: 1, name: "Player1", region: "AP", rank: "Diamond 2" },
    { id: 2, name: "Player2", region: "AP", rank: "Master" },
    { id: 3, name: "Player3", region: "NA", rank: "Grandmaster" },
    { id: 4, name: "Player4", region: "EUW", rank: "Diamond 1" },
    { id: 5, name: "Player5", region: "KR", rank: "Challenger" },
    { id: 6, name: "Player6", region: "NA", rank: "Master" },
    { id: 7, name: "Player7", region: "AP", rank: "Diamond 3" },
    { id: 8, name: "Player8", region: "EUW", rank: "Master" },
  ],
}

export default function TournamentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-1 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/tournaments">Tournaments</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{tournament.name}</span>
        </div>
        <SyncStatus status="live" />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="col-span-3 md:col-span-2">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <Badge
                  variant="outline"
                  className={`
                  ${tournament.status === "ongoing" ? "bg-primary/20 text-primary animate-pulse-subtle" : ""}
                  ${tournament.status === "upcoming" ? "bg-yellow-500/20 text-yellow-500" : ""}
                  ${tournament.status === "finished" ? "bg-muted text-muted-foreground" : ""}
                  capitalize
                `}
                >
                  {tournament.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{tournament.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <CalendarClock className="mr-2 h-5 w-5 text-primary" />
                    Tournament Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Start Date:</div>
                    <div className="font-medium">{tournament.startDate}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">End Date:</div>
                    <div className="font-medium">{tournament.endDate}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Registration Deadline:</div>
                    <div className="font-medium">{tournament.registrationDeadline}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Current Round:</div>
                    <div className="font-medium">
                      {tournament.currentRound} / {tournament.totalRounds}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Progress</span>
                      <span className="text-xs">
                        {Math.round((tournament.currentRound / tournament.totalRounds) * 100)}%
                      </span>
                    </div>
                    <Progress value={(tournament.currentRound / tournament.totalRounds) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Table className="mr-2 h-5 w-5 text-primary" />
                    Tournament Format
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Total Rounds:</div>
                    <div className="font-medium">{tournament.totalRounds}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Matches per Round:</div>
                    <div className="font-medium">{tournament.matchesPerRound}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Registration Fee:</div>
                    <div className="font-medium">{tournament.registrationFee}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Budget:</div>
                    <div className="font-medium">{tournament.budget}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted-foreground">Elimination Rule:</div>
                    <div className="font-medium text-right max-w-[200px]">Bottom 4 eliminated</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Medal className="mr-2 h-5 w-5 text-primary" />
                  Point System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center mt-2">
                  {Object.entries(tournament.pointSystem).map(([position, points], index) => (
                    <div key={position} className="flex flex-col items-center">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center mb-1
                        ${index === 0 ? "bg-yellow-500/20 text-yellow-500" : ""}
                        ${index === 1 ? "bg-gray-400/20 text-gray-400" : ""}
                        ${index === 2 ? "bg-amber-700/20 text-amber-700" : ""}
                        ${index > 2 ? "bg-secondary" : ""}
                      `}
                      >
                        {index + 1}
                      </div>
                      <div className="font-bold">{points} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="rounds">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="rounds">Rounds</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="rounds" className="space-y-4">
                {tournament.rounds.map((round) => (
                  <Card
                    key={round.number}
                    className={`
                    overflow-hidden
                    ${round.status === "in_progress" ? "border-primary" : ""}
                  `}
                  >
                    <CardHeader
                      className={`
                      pb-3 flex flex-row justify-between items-center
                      ${round.status === "in_progress" ? "bg-primary/5" : ""}
                    `}
                    >
                      <CardTitle className="text-lg">Round {round.number}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`
                        ${round.status === "completed" ? "bg-advanced/20 text-advanced" : ""}
                        ${round.status === "in_progress" ? "bg-primary/20 text-primary animate-pulse-subtle" : ""}
                        ${round.status === "upcoming" ? "bg-muted text-muted-foreground" : ""}
                        capitalize
                      `}
                      >
                        {round.status.replace("_", " ")}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Lobbies</div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-5 w-5 text-primary" />
                            <span className="font-medium">{round.lobbies} Lobbies</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Matches</div>
                          <div className="flex items-center">
                            <Trophy className="mr-2 h-5 w-5 text-primary" />
                            <span className="font-medium">{round.matches} Matches per Lobby</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link href={`/tournaments/${params.id}/rounds/${round.number}`}>
                          <Button variant={round.status !== "upcoming" ? "default" : "outline"} className="w-full">
                            {round.status === "completed" && "View Results"}
                            {round.status === "in_progress" && "View Live Scoreboard"}
                            {round.status === "upcoming" && "View Round Details"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="players">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <CircleUser className="mr-2 h-5 w-5 text-primary" />
                        Registered Players
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {tournament.registeredPlayers} / {tournament.playerCount}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Registration Progress</span>
                          <span className="text-xs">
                            {Math.round((tournament.registeredPlayers / tournament.playerCount) * 100)}%
                          </span>
                        </div>
                        <Progress value={(tournament.registeredPlayers / tournament.playerCount) * 100} />
                      </div>

                      <div className="border rounded-md">
                        <div className="grid grid-cols-3 gap-4 p-4 font-medium border-b">
                          <div>Player</div>
                          <div>Region</div>
                          <div>Rank</div>
                        </div>
                        <div className="divide-y">
                          {tournament.players.map((player) => (
                            <div key={player.id} className="grid grid-cols-3 gap-4 p-4 hover:bg-muted/50">
                              <div>
                                <Link href={`/players/${player.id}`} className="hover:text-primary">
                                  {player.name}
                                </Link>
                              </div>
                              <div>{player.region}</div>
                              <div>{player.rank}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <Button variant="outline">View All Players</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Tournament Rules</h3>
                    <div className="space-y-4 text-sm">
                      <p>1. All participants must register before the registration deadline.</p>
                      <p>2. Players must use the same Riot account throughout the tournament.</p>
                      <p>3. Each round consists of {tournament.matchesPerRound} matches per lobby.</p>
                      <p>4. Points are awarded based on placement in each match according to the point system.</p>
                      <p>5. After each round, {tournament.eliminationRule}.</p>
                      <p>6. The player with the highest total points at the end of the final round is the winner.</p>
                      <p>7. In case of a tie, the player with the highest number of first-place finishes wins.</p>
                      <p>8. Any form of cheating or unsportsmanlike conduct will result in disqualification.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Tournament Details</h3>
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Financial Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground mr-2">Registration Fee:</span>
                              <span className="font-medium">{tournament.registrationFee}</span>
                            </div>
                            <div className="flex items-center">
                              <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground mr-2">Budget:</span>
                              <span className="font-medium">{tournament.budget}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Tournament Organization</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground mr-2">Region:</span>
                              <span className="font-medium">{tournament.region}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground mr-2">Max Players:</span>
                              <span className="font-medium">{tournament.playerCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Prize Distribution</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="p-4 border rounded-md">
                            <div className="text-2xl font-bold text-yellow-500">1st</div>
                            <div className="text-sm text-muted-foreground">$5,000</div>
                          </div>
                          <div className="p-4 border rounded-md">
                            <div className="text-2xl font-bold text-gray-400">2nd</div>
                            <div className="text-sm text-muted-foreground">$2,500</div>
                          </div>
                          <div className="p-4 border rounded-md">
                            <div className="text-2xl font-bold text-amber-700">3rd</div>
                            <div className="text-sm text-muted-foreground">$1,500</div>
                          </div>
                          <div className="p-4 border rounded-md">
                            <div className="text-2xl font-bold">4th</div>
                            <div className="text-sm text-muted-foreground">$1,000</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                        <p className="text-sm text-muted-foreground">
                          This tournament is part of the official TFT Championship Series. The top 4 players will
                          qualify for the Global Finals taking place next month.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="col-span-3 md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="aspect-square relative rounded-lg overflow-hidden mb-6">
                <img
                  src={tournament.image || "/placeholder.svg"}
                  alt={tournament.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Players:</span>
                  </div>
                  <span className="font-medium">
                    {tournament.registeredPlayers} / {tournament.playerCount}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Region:</span>
                  </div>
                  <span className="font-medium">{tournament.region}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Registration Deadline:</span>
                  </div>
                  <span className="font-medium">{tournament.registrationDeadline}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Registration Fee:</span>
                  </div>
                  <span className="font-medium">{tournament.registrationFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Status:</span>
                  </div>
                  <Badge
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
              </div>

              {tournament.status === "upcoming" && (
                <Button size="lg" className="w-full mt-6">
                  Register for Tournament
                </Button>
              )}

              {tournament.status === "ongoing" && (
                <div className="space-y-2 mt-6">
                  <Link href={`/tournaments/${params.id}/scoreboard`}>
                    <Button size="lg" className="w-full">
                      View Live Scoreboard
                    </Button>
                  </Link>
                  <Link href={`/tournaments/${params.id}/lobbies`}>
                    <Button size="lg" variant="outline" className="w-full">
                      View Current Lobbies
                    </Button>
                  </Link>
                </div>
              )}

              {tournament.status === "finished" && (
                <Link href={`/tournaments/${params.id}/results`}>
                  <Button size="lg" className="w-full mt-6">
                    View Final Results
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="ghost" className="w-full justify-start">
                <ArrowDown className="mr-2 h-4 w-4" />
                Download Brackets
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ArrowDown className="mr-2 h-4 w-4" />
                Export Results as CSV
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ArrowDown className="mr-2 h-4 w-4" />
                Download Player List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
