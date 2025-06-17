import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ITournament } from "@/app/types/tournament"
import { CalendarClock } from "lucide-react"

interface TournamentScheduleCardProps {
  tournament: ITournament;
}

export function TournamentScheduleCard({ tournament }: TournamentScheduleCardProps) {
  const completedPhasesCount = tournament.phases.filter(phase => 
    phase.rounds.length > 0 && phase.rounds.every(round => round.status === 'completed')
  ).length;

  return (
    <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <CalendarClock className="mr-2 h-5 w-5 text-primary" />
          Tournament Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <div className="text-muted-foreground">Start Date:</div>
          <div className="font-medium">{new Date(tournament.startTime).toLocaleDateString()}</div>
        </div>
        {/* <div className="flex justify-between">
          <div className="text-muted-foreground">End Date:</div>
          <div className="font-medium">{tournament.endTime ? new Date(tournament.endTime).toLocaleDateString() : 'N/A'}</div>
        </div> */}
        <div className="flex justify-between">
          <div className="text-muted-foreground">Registration Deadline:</div>
          <div className="font-medium">{new Date(tournament.registrationDeadline).toLocaleDateString()}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-muted-foreground">Completed Phases:</div>
          <div className="font-medium">
            {completedPhasesCount} / {tournament.phases.length}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
 