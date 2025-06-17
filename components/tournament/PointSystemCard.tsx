import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ITournament } from "@/app/types/tournament"
import { Medal } from "lucide-react"

interface PointSystemCardProps {
  tournament: ITournament;
}

export function PointSystemCard({ tournament }: PointSystemCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Medal className="mr-2 h-5 w-5 text-primary" />
          Point System
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tournament.prizeStructure && Object.keys(tournament.prizeStructure).length > 0 ? (
          <div className="grid grid-cols-4 gap-4 text-center mt-2">
            {Object.entries(tournament.prizeStructure).map(([position, percentage], index) => (
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
                <div className="font-bold">{percentage * 100}%</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">No prize structure defined.</p>
        )}
      </CardContent>
    </Card>
  )
} 