"use client"
import Link from "next/link"
import { useEffect, use, useState } from "react"
import { format } from "date-fns"
import {
  Globe,
  Medal,
  Loader2,
  AlertCircle,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TournamentHeader } from "@/components/tournament/TournamentHeader"
import { TournamentScheduleCard } from "@/components/tournament/TournamentScheduleCard"
import { TournamentFormatCard } from "@/components/tournament/TournamentFormatCard"
import { useTournamentStore } from "@/app/stores/tournamentStore"
import { TournamentTabsContent } from "@/components/tournament/TournamentTabsContent"
import Image from "next/image"

export default function TournamentPage({ params }: { params: Promise<{ id:string }> }) {
  const { id: tournamentId } = use(params)
  const {
    currentTournament: tournament,
    currentTournamentParticipants: participants,
    loading,
    error,
    fetchTournamentDetail,
    fetchTournamentParticipants,
    participantsLoading,
  } = useTournamentStore()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentDetail(tournamentId)
      fetchTournamentParticipants(tournamentId)
    }
  }, [tournamentId, fetchTournamentDetail, fetchTournamentParticipants])

  useEffect(() => {
    if (!loading) {
      setIsInitialLoading(false)
    }
  }, [loading])

  if (isInitialLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading tournament details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 text-red-500">
        <AlertCircle className="mr-2 h-16 w-16" />
        <p className="mt-4 text-lg">Error loading tournament: {error}</p>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 text-red-500">
        <AlertCircle className="mr-2 h-16 w-16" />
        <p className="mt-4 text-lg">Tournament not found.</p>
      </div>
    )
  }

  // Determine status from database values
  const statusMapping = {
    pending: { text: "Upcoming", color: "bg-yellow-500/20 text-yellow-500" },
    in_progress: { text: "Ongoing", color: "bg-primary/20 text-primary animate-pulse-subtle" },
    completed: { text: "Finished", color: "bg-muted text-muted-foreground" },
  }
  const currentStatus = statusMapping[tournament.status as keyof typeof statusMapping] || { text: tournament.status, color: "" }

  return (
    <div className="container py-8">
      <TournamentHeader tournament={tournament} />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="col-span-3 md:col-span-2">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <Badge variant="outline" className={`${currentStatus.color} capitalize`}>
                  {currentStatus.text}
                </Badge>
              </div>
              <p className="text-muted-foreground">{tournament.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TournamentScheduleCard tournament={tournament} />
              <TournamentFormatCard tournament={tournament} />
            </div>

            {tournament.phases?.[0]?.pointsMapping && (
              <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Medal className="mr-2 h-5 w-5 text-primary" />
                    Point System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center mt-2">
                    {Object.entries(tournament.phases[0].pointsMapping)
                      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
                      .map(([position, points], index) => (
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
                            {position}
                          </div>
                          <div className="font-bold">{points as number} pts</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <TournamentTabsContent
              tournament={tournament}
              participants={participants}
              fetchMoreParticipants={fetchTournamentParticipants}
              loading={participantsLoading}
            />
          </div>
        </div>

        <div className="col-span-3 md:col-span-1">
          <div className="flex flex-col space-y-6">
            <Card className="overflow-hidden bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader className="p-0">
                <Image
                  src={tournament.image || '/TFT.jfif'}
                  alt={tournament.name}
                  className="w-full h-52 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Users className="mr-2 h-4 w-4" /> Players:</span>
                    <span className="font-medium">{tournament.actualParticipantsCount || 0} / {tournament.maxPlayers}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Globe className="mr-2 h-4 w-4" /> Region:</span>
                    <span className="font-medium">{tournament.region || 'N/A'}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" /> Reg. Deadline:</span>
                    <span className="font-medium">{format(new Date(tournament.registrationDeadline), "yyyy-MM-dd")}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><DollarSign className="mr-2 h-4 w-4" /> Reg. Fee:</span>
                    <span className="font-medium">${tournament.entryFee}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Clock className="mr-2 h-4 w-4" /> Status:</span>
                    <Badge variant="outline" className={`${currentStatus.color} capitalize`}>{currentStatus.text}</Badge>
                  </li>
                </ul>
                <div className="grid gap-2">
                  {tournament.status === "in_progress" && (
                     <>
                      <Button asChild className="w-full">
                        <Link href={`/tournaments/${tournament.id}/scoreboard`}>View Live Scoreboard</Link>
                      </Button>
                      <Button asChild variant="secondary" className="w-full">
                        <Link href={`/tournaments/${tournament.id}/lobbies`}>View Current Lobbies</Link>
                      </Button>
                    </>
                  )}
                   {tournament.status === "pending" && (
                    <Button asChild className="w-full">
                      <Link href={`/tournaments/${tournament.id}/register`}>Register Now</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Link href="#" className="flex items-center text-sm hover:text-primary">
                  <Download className="mr-2 h-4 w-4" /> Download Brackets
                </Link>
                <Link href="#" className="flex items-center text-sm hover:text-primary">
                  <Download className="mr-2 h-4 w-4" /> Export Results as CSV
                </Link>
                <Link href="#" className="flex items-center text-sm hover:text-primary">
                  <Download className="mr-2 h-4 w-4" /> Download Player List
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
