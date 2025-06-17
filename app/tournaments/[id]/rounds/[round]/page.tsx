"use client"

import { use, useEffect, useMemo } from "react"
import { useTournamentStore } from "@/app/stores/tournamentStore"
import { IMatchResult, PlayerRoundStats } from "@/app/types/tournament"
import { RoundHeader } from "@/components/tournament/round/RoundHeader"
import { RoundSummary } from "@/components/tournament/round/RoundSummary"
import { RoundTabs } from "@/components/tournament/round/RoundTabs"
import { RoundResultsLoading } from "@/components/tournament/round/RoundResultsLoading"

export default function RoundResultsPage({ params: paramsPromise }: { params: Promise<{ id: string; round: string }> }) {
  const params = use(paramsPromise)
  const {
    currentTournament,
    fetchRoundDetails,
    roundLoading,
    currentRoundDetails: roundData,
    matchResults,
  } = useTournamentStore()

  useEffect(() => {
    if (params.id && params.round) {
      fetchRoundDetails(params.id, parseInt(params.round, 10))
    }
  }, [params.id, params.round, fetchRoundDetails])

  const allPlayers: PlayerRoundStats[] = useMemo(() => {
    if (!roundData || !roundData.lobbies || Object.keys(matchResults).length === 0) {
      return []
    }

    return roundData.lobbies
      .flatMap((lobby) => {
        return (lobby.participantDetails || []).map((participant) => {
          if (!participant) return null

          const playerMatchResults =
            (lobby.matches || [])
              .map((match) => matchResults[match.id]?.find((r) => r.participantId === participant.user?.puuid))
              .filter((result): result is IMatchResult => result !== undefined)

          const totalPoints = playerMatchResults.reduce((sum, result) => sum + result.points, 0)
          const placements = playerMatchResults.map((r) => r.placement)

          const status: "advanced" | "eliminated" = participant.eliminated ? "eliminated" : "advanced"

          return {
            id: participant.id,
            name: participant.user?.riotGameName || "N/A",
            region: participant.user?.region || "N/A",
            lobbyName: lobby.name,
            placements: placements,
            points: playerMatchResults.map((r) => r.points),
            total: totalPoints,
            status: status,
          }
        })
      })
      .filter((p): p is PlayerRoundStats => p !== null)
  }, [roundData, matchResults])

  if (roundLoading || !roundData) {
    return <RoundResultsLoading />
  }

  const playersAdvanced = allPlayers.filter((p) => p.status === "advanced").length
  const playersEliminated = allPlayers.filter((p) => p.status === "eliminated").length
  const totalMatches = roundData?.matches?.length ?? 0
  const totalPointsAwarded = allPlayers.reduce((sum, p) => sum + p.total, 0)

  const currentPhase = currentTournament?.phases.find((p) => p.id === roundData.phaseId)
  const numMatches = currentPhase?.matchesPerRound ?? 0

  return (
    <div className="container py-8 space-y-6">
      <RoundHeader tournament={currentTournament} round={roundData} />
      <RoundSummary
        totalMatches={totalMatches}
        pointsAwarded={totalPointsAwarded}
        playersAdvanced={playersAdvanced}
        playersEliminated={playersEliminated}
      />
      <RoundTabs round={roundData} allPlayers={allPlayers} numMatches={numMatches} />
    </div>
  )
}
