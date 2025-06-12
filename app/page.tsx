import { Search, Filter, ArrowRight, Calendar, Clock, MapPin, ChevronRight } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SyncStatus } from "@/components/sync-status"

// Mock tournament data
const tournaments = [
  {
    id: 1,
    name: "TFT Championship Series",
    image: "/placeholder.svg?height=200&width=200",
    status: "ongoing",
    region: "AP",
    date: "2025-06-13",
    time: "12:00 PM UTC",
    participants: 32,
    registered: true,
  },
  {
    id: 2,
    name: "Weekend Warriors Cup",
    image: "/placeholder.svg?height=200&width=200",
    status: "upcoming",
    region: "NA",
    date: "2025-06-15",
    time: "4:00 PM UTC",
    participants: 64,
    registered: false,
  },
  {
    id: 3,
    name: "Global TFT Masters",
    image: "/placeholder.svg?height=200&width=200",
    status: "upcoming",
    region: "Global",
    date: "2025-06-20",
    time: "10:00 AM UTC",
    participants: 128,
    registered: false,
  },
  {
    id: 4,
    name: "TFT Summer Showdown",
    image: "/placeholder.svg?height=200&width=200",
    status: "finished",
    region: "EUW",
    date: "2025-06-05",
    time: "2:00 PM UTC",
    participants: 64,
    registered: true,
  },
  {
    id: 5,
    name: "Seoul Invitational",
    image: "/placeholder.svg?height=200&width=200",
    status: "finished",
    region: "KR",
    date: "2025-06-01",
    time: "8:00 AM UTC",
    participants: 32,
    registered: false,
  },
  {
    id: 6,
    name: "TFT Asia Championship",
    image: "/placeholder.svg?height=200&width=200",
    status: "ongoing",
    region: "AP",
    date: "2025-06-12",
    time: "9:00 AM UTC",
    participants: 64,
    registered: false,
  },
]

// Featured tournaments
const featuredTournaments = tournaments.filter((t) => t.status === "ongoing").slice(0, 2)

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-pattern py-16 md:py-24 border-b">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="gradient-text">NEXUS</span> TFT Tournament Platform
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
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="TFT Tournament"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-lg border shadow-md">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-live-update animate-pulse"></div>
                  <span className="font-medium">
                    Live Tournaments: {tournaments.filter((t) => t.status === "ongoing").length}
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
            {featuredTournaments.map((tournament) => (
              <Card key={tournament.id} className="overflow-hidden card-hover-effect">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={tournament.image || "/placeholder.svg"}
                    alt={tournament.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-primary/80 text-white border-none">
                        {tournament.status}
                      </Badge>
                      <Badge variant="outline" className="ml-2 bg-background/80 backdrop-blur-sm">
                        {tournament.region}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid gap-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{tournament.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{tournament.region} Region</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/tournaments/${tournament.id}`}>
                      View Tournament
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
      <section className="py-12 bg-muted/30">
        <div className="container space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tournament Directory</h2>
            <p className="text-muted-foreground">Browse and filter through all available tournaments</p>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tournaments..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="ap">AP</SelectItem>
                    <SelectItem value="na">NA</SelectItem>
                    <SelectItem value="euw">EUW</SelectItem>
                    <SelectItem value="kr">KR</SelectItem>
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
                <TabsTrigger value="ongoing">
                  <span className="flex items-center">
                    Ongoing
                    <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                      {tournaments.filter((t) => t.status === "ongoing").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  <span className="flex items-center">
                    Upcoming
                    <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                      {tournaments.filter((t) => t.status === "upcoming").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="finished">
                  <span className="flex items-center">
                    Finished
                    <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                      {tournaments.filter((t) => t.status === "finished").length}
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
                {tournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ongoing" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tournaments
                  .filter((t) => t.status === "ongoing")
                  .map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tournaments
                  .filter((t) => t.status === "upcoming")
                  .map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="finished" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tournaments
                  .filter((t) => t.status === "finished")
                  .map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="my-tournaments" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tournaments
                  .filter((t) => t.registered)
                  .map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
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

function TournamentCard({ tournament }: { tournament: any }) {
  const statusColors = {
    ongoing: "bg-primary/20 text-primary border-primary/20 animate-pulse-subtle",
    upcoming: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
    finished: "bg-muted text-muted-foreground border-muted",
  }

  const statusColor = statusColors[tournament.status as keyof typeof statusColors]

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={tournament.image || "/placeholder.svg"}
            alt={tournament.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <Badge variant="outline" className={`${statusColor} capitalize`}>
              {tournament.status}
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
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
            <span>{tournament.date}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{tournament.time}</span>
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
        {tournament.status === "upcoming" && !tournament.registered && (
          <Link href={`/tournaments/${tournament.id}/register`}>
            <Button>Register Now</Button>
          </Link>
        )}
        {tournament.registered && (
          <Badge variant="outline" className="bg-muted">
            Registered
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}
