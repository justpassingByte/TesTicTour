"use client"

import { useTournamentStore } from "@/app/stores/tournamentStore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IRound, PlayerRoundStats } from "@/app/types/tournament"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star } from "lucide-react"
import { format } from "date-fns"

import { ResultsTab } from "./tabs/ResultsTab"
import { LobbiesTab } from "./tabs/LobbiesTab"
import { StatisticsTab } from "./tabs/StatisticsTab"

interface RoundTabsProps {
  round: IRound
  allPlayers: PlayerRoundStats[]
  numMatches: number
}

export function RoundTabs({ round, allPlayers, numMatches }: RoundTabsProps) {
  const { matchResults } = useTournamentStore()

  const allMatches =
    round.lobbies
      ?.flatMap((lobby) =>
        (lobby.matches || []).map((match) => {
          const matchInfo = match.matchData?.info
          if (!matchInfo) return null

          const riotParticipants = matchInfo.participants
          const winnerData = riotParticipants.find((p) => p.placement === 1)

          const winnerParticipant = lobby.participantDetails?.find((p) => p.user?.puuid === winnerData?.puuid)
          const winnerName = winnerParticipant?.user?.riotGameName || "Unknown"

          const avgPlacement = (riotParticipants.reduce((sum, p) => sum + p.placement, 0) / riotParticipants.length).toFixed(1)

          const tournamentMatchResults = matchResults[match.id] || []
          const totalPoints = tournamentMatchResults.reduce((sum, r) => sum + r.points, 0)

          const startTime = new Date(matchInfo.gameCreation)
          const durationInSeconds = matchInfo.gameDuration
          const endTime = new Date(startTime.getTime() + durationInSeconds * 1000)

          const formatDuration = (seconds: number) => {
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            return `${minutes}m ${remainingSeconds}s`
          }

          return {
            id: match.id,
            lobbyName: lobby.name,
            startTimeFormatted: format(startTime, "MMM d, h:mm a"),
            endTimeFormatted: format(endTime, "h:mm a"),
            durationFormatted: formatDuration(durationInSeconds),
            winner: winnerName,
            avgPlacement,
            totalPoints,
          }
        })
      )
      .filter((m): m is NonNullable<typeof m> => m !== null) ?? []

  return (
    <Tabs defaultValue="results" className="w-full">
      <TabsList>
        <TabsTrigger value="results">Round Results</TabsTrigger>
        <TabsTrigger value="matches">Match Details</TabsTrigger>
        <TabsTrigger value="lobbies">Lobby Breakdown</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
      </TabsList>
      <TabsContent value="results">
        <ResultsTab round={round} allPlayers={allPlayers} numMatches={numMatches} />
      </TabsContent>
      <TabsContent value="matches" className="space-y-4">
        {allMatches.map((match, index) => (
          <Card 
            key={match.id}
            className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Match {index + 1}</CardTitle>
                <Badge variant="outline">{match.lobbyName}</Badge>
              </div>
              <CardDescription>
                {match.startTimeFormatted} - {match.endTimeFormatted} • Duration: {match.durationFormatted}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Winner</div>
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    <span className="font-medium">{match.winner}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Average Placement</div>
                  <div className="flex items-center">
                    <Medal className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-medium">{match.avgPlacement}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Points</div>
                  <div className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-medium">{match.totalPoints} pts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {allMatches.length === 0 && (
          <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
            <CardHeader>
              <CardTitle>Match Details</CardTitle>
              <CardDescription>Detailed breakdown of each match in the round.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Match details are not available or are still being processed.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="lobbies">
        <LobbiesTab round={round} allPlayers={allPlayers} numMatches={numMatches} />
      </TabsContent>
      <TabsContent value="statistics">
        <StatisticsTab allPlayers={allPlayers} />
      </TabsContent>
    </Tabs>
  )
}