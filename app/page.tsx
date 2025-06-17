"use client"

import { Search, Filter, ArrowRight, Calendar, Clock, MapPin, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SyncStatus } from "@/components/sync-status"
import { useTournamentStore } from "@/stores/tournamentStore"
import { ITournament } from "@/app/types/tournament"
import Image from "next/image"

const defaultTFTImage = "/TFT.jfif"

export default function Home() {
  const { tournaments, loading, error, fetchTournaments } = useTournamentStore()
  const [filteredTournaments, setFilteredTournaments] = useState<ITournament[]>([])
  const [featuredTournaments, setFeaturedTournaments] = useState<ITournament[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchTournaments()
  }, [fetchTournaments])

  useEffect(() => {
    // Ensure tournaments is an array before filtering
    let tempTournaments = Array.isArray(tournaments) ? tournaments : []

    if (searchTerm) {
      tempTournaments = tempTournaments.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedRegion && selectedRegion !== "all") {
      tempTournaments = tempTournaments.filter((t) => t.region === selectedRegion)
    }

    if (selectedStatus && selectedStatus !== "all") {
      tempTournaments = tempTournaments.filter((t) => t.status === selectedStatus)
    }

    setFilteredTournaments(tempTournaments)
    setFeaturedTournaments(tempTournaments.filter((t) => t.status === "ongoing").slice(0, 2))
  }, [tournaments, searchTerm, selectedRegion, selectedStatus])

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading tournaments...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>
  }

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
                  src="/TFT.jfif?height=600&width=800"
                  alt="TFT Tournament"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-transparent p-4 rounded-lg border shadow-md">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-live-update animate-pulse"></div>
                  <span className="font-medium">
                    Live Tournaments: {Array.isArray(tournaments) ? tournaments.filter((t) => t.status === "in_progress").length : 0}
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
              <Card 
                key={tournament.id} 
                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-up bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
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
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Directory */}
      <section className="py-12 bg-background/60 dark:bg-background/40 backdrop-blur-lg border-t border-b border-white/20">
        <div className="container space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tournament Directory</h2>
            <p className="text-muted-foreground">Browse and filter through all available tournaments</p>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tournaments..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedRegion || "all"} onValueChange={(value) => setSelectedRegion(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                    <SelectItem value="AP">AP</SelectItem>
                    <SelectItem value="NA">NA</SelectItem>
                    <SelectItem value="EUW">EUW</SelectItem>
                    <SelectItem value="KR">KR</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={selectedStatus || "all"} onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_progress">Ongoing</SelectItem>
                    <SelectItem value="pending">Upcoming</SelectItem>
                    <SelectItem value="completed">Finished</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="in_progress">
                  <span className="flex items-center">
                    Ongoing
                    <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                      {filteredTournaments.filter((t) => t.status === "in_progress").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  <span className="flex items-center">
                    Upcoming
                    <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                      {filteredTournaments.filter((t) => t.status === "pending").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <span className="flex items-center">
                    Finished
                    <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                      {filteredTournaments.filter((t) => t.status === "completed").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="my-tournaments">My Tournaments</TabsTrigger>
              </TabsList>
              <div className="hidden md:block">
                <SyncStatus status="live" />
              </div>
            </div>

            <TabsContent value="all" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTournaments.map((tournament, index) => (
                  <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="in_progress" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTournaments
                  .filter((t) => t.status === "in_progress")
                  .map((tournament, index) => (
                    <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTournaments
                  .filter((t) => t.status === "pending")
                  .map((tournament, index) => (
                    <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTournaments
                  .filter((t) => t.status === "completed")
                  .map((tournament, index) => (
                    <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="my-tournaments" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTournaments
                  .filter((t) => t.registered)
                  .map((tournament, index) => (
                    <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

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

function TournamentCard({ tournament, index }: { tournament: ITournament, index?: number }) {
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
