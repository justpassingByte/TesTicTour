import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, ChevronRight, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TournamentService } from "@/app/services/TournamentService"
import { ITournament } from "@/app/types/tournament"

import TournamentDirectoryClient from "./components/TournamentDirectoryClient"

const defaultTFTImage = "/TFT.jfif"

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

export default async function Home() {
  const tournaments = await getTournaments()
  const featuredTournaments = tournaments
    .filter((t) => t.status === "in_progress")
    .slice(0, 2)

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-pattern py-16 md:py-24 border-b">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="gradient-text">TesTicTour</span> TFT Tournament Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Register, compete, and track your progress in Teamfight Tactics tournaments around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/tournaments">Browse Tournaments</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/players">View Players</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border shadow-lg">
                <Image
                  width={800}
                  height={600}
                  src="/TFT.jfif"
                  alt="TFT Tournament"
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-transparent p-4 rounded-lg border shadow-md">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-live-update animate-pulse"></div>
                  <span className="font-medium">
                    Live Tournaments: {tournaments.filter((t) => t.status === "in_progress").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Tournaments</h2>
              <p className="text-muted-foreground">Check out these ongoing tournaments</p>
            </div>
            <Link href="/tournaments" className="group flex items-center text-primary mt-4 md:mt-0">
              View all tournaments
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredTournaments.map((tournament, index) => (
              <FeaturedTournamentCard key={tournament.id} tournament={tournament} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Directory - Client Component with Suspense */}
      <Suspense fallback={<TournamentDirectorySkeleton />}>
        <TournamentDirectoryClient tournaments={tournaments} />
      </Suspense>

      {/* Call to Action */}
      <section className="py-16 bg-primary/5 border-y">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to join the competition?</h2>
            <p className="text-xl text-muted-foreground">
              Create an account or register for a tournament to start your TFT competitive journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/tournaments">Find a Tournament</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/profile">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Featured Tournament Card Component
function FeaturedTournamentCard({ tournament, index }: { tournament: ITournament, index: number }) {
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-up bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          width={600}
          height={338}
          src={tournament.image || defaultTFTImage}
          alt={tournament.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
          <div className="flex items-center mt-2">
            <Badge variant="outline" className="bg-primary/80 text-white border-none">
              {tournament.status}
            </Badge>
            <Badge variant="outline" className="ml-2 bg-transparent backdrop-blur-sm">
              {tournament.region}
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{new Date(tournament.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{new Date(tournament.startTime).toLocaleTimeString()} UTC</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{tournament.region} Region</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/tournaments/${tournament.id}`}>View Tournament
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Skeleton loader for Tournament Directory
function TournamentDirectorySkeleton() {
  return (
    <section className="py-12 bg-background/60 dark:bg-background/40 backdrop-blur-lg border-t border-b border-white/20">
      <div className="container space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Tournament Directory</h2>
          <p className="text-muted-foreground">Loading tournaments...</p>
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
    </section>
  )
}

// Server Component for TournamentCard
export function TournamentCard({ tournament, index }: { tournament: ITournament, index?: number }) {
  const statusColors = {
    in_progress: "bg-primary/20 text-primary border-primary/20 animate-pulse-subtle",
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
    completed: "bg-muted text-muted-foreground border-muted",
  };
  
  const statusKey = tournament.status as keyof typeof statusColors;
  const statusColor = statusColors[statusKey] || "bg-transparent text-muted-foreground border-transparent";

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-up bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20"
      style={{ animationDelay: `${(index || 0) * 100}ms` }}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            width={400}
            height={225}
            src={tournament.image || defaultTFTImage}
            alt={tournament.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <Badge variant="outline" className={`${statusColor} capitalize`}>
              {tournament.status.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline" className="bg-transparent backdrop-blur-sm">
              {tournament.region}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="mb-2 line-clamp-1">{tournament.name}</CardTitle>
        <div className="grid gap-2 mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(tournament.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{tournament.region} Region</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Link href={`/tournaments/${tournament.id}`}>
          <Button variant="ghost" className="flex items-center gap-1">
            View
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
        {tournament.status === "pending" && !tournament.registered && (
          <Link href={`/tournaments/${tournament.id}/register`}>
            <Button>Register Now</Button>
          </Link>
        )}
        {tournament.registered && (
          <Badge variant="outline" className="bg-transparent">
            Registered
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}
