import { Suspense } from "react"
import { notFound } from "next/navigation"
import { TournamentService } from "@/app/services/TournamentService"
import TournamentsClientPage from "./components/TournamentsClientPage"

// Server-side data fetching
async function getTournaments() {
  try {
    const data = await TournamentService.list()
    return data.tournaments || []
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return []
  }
}

export default async function TournamentPage() {
  // Fetch tournaments on the server
  const tournaments = await getTournaments()
  
  if (!tournaments) {
    notFound()
  }

  return (
    <Suspense fallback={<TournamentListSkeleton />}>
      {/* Pass server-fetched data to client component for interactivity */}
      <TournamentsClientPage initialTournaments={tournaments} />
    </Suspense>
  )
}

// Simple skeleton loader for the tournament list
function TournamentListSkeleton() {
  return (
    <div className="container py-10 space-y-8">
      <div className="h-10 w-48 bg-muted rounded mb-2"></div>
      <div className="h-5 w-96 bg-muted rounded-md mb-8"></div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-10 bg-muted rounded w-full max-w-md"></div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-muted rounded"></div>
            <div className="h-10 w-28 bg-muted rounded"></div>
            <div className="h-10 w-20 bg-muted rounded"></div>
          </div>
        </div>
        
        <div className="flex space-x-4 border-b overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-28 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[16/9] bg-muted rounded-md mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
