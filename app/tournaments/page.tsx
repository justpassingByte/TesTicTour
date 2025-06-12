"use client"

import { useState } from "react"
import { Search, Filter, ArrowRight, Calendar, Clock, MapPin, ChevronDown } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SyncStatus } from "@/components/sync-status"
import { useLanguage } from "@/components/language-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    maxParticipants: 64,
    registered: true,
    description:
      "The biggest TFT tournament of the year, featuring top players from around the world competing for a prize pool of $10,000.",
    registrationFee: "$10",
    budget: "$15,000",
  },
  {
    id: 2,
    name: "Weekend Warriors Cup",
    image: "/placeholder.svg?height=200&width=200",
    status: "upcoming",
    region: "NA",
    date: "2025-06-15",
    time: "4:00 PM UTC",
    participants: 24,
    maxParticipants: 64,
    registered: false,
    description: "A weekend tournament for casual players looking to test their skills against others.",
    registrationFee: "$5",
    budget: "$2,000",
  },
  {
    id: 3,
    name: "Global TFT Masters",
    image: "/placeholder.svg?height=200&width=200",
    status: "upcoming",
    region: "Global",
    date: "2025-06-20",
    time: "10:00 AM UTC",
    participants: 96,
    maxParticipants: 128,
    registered: false,
    description: "An international tournament featuring the best players from each region.",
    registrationFee: "$15",
    budget: "$25,000",
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
    maxParticipants: 64,
    registered: true,
    description: "A summer-themed tournament with special prizes and unique challenges.",
    registrationFee: "$8",
    budget: "$10,000",
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
    maxParticipants: 32,
    registered: false,
    description: "An exclusive tournament featuring invited players from the Korean server.",
    registrationFee: "$20",
    budget: "$30,000",
  },
  {
    id: 6,
    name: "TFT Asia Championship",
    image: "/placeholder.svg?height=200&width=200",
    status: "ongoing",
    region: "AP",
    date: "2025-06-12",
    time: "9:00 AM UTC",
    participants: 48,
    maxParticipants: 64,
    registered: false,
    description: "The premier tournament for players in the Asia Pacific region.",
    registrationFee: "$12",
    budget: "$18,000",
  },
  {
    id: 7,
    name: "Challenger Series",
    image: "/placeholder.svg?height=200&width=200",
    status: "upcoming",
    region: "NA",
    date: "2025-06-25",
    time: "6:00 PM UTC",
    participants: 16,
    maxParticipants: 32,
    registered: false,
    description: "A tournament exclusively for Challenger-ranked players.",
    registrationFee: "$25",
    budget: "$20,000",
  },
  {
    id: 8,
    name: "European Cup",
    image: "/placeholder.svg?height=200&width=200",
    status: "upcoming",
    region: "EUW",
    date: "2025-06-18",
    time: "3:00 PM UTC",
    participants: 40,
    maxParticipants: 64,
    registered: false,
    description: "The biggest tournament for European players this season.",
    registrationFee: "$10",
    budget: "$15,000",
  },
  {
    id: 9,
    name: "Oceania Open",
    image: "/placeholder.svg?height=200&width=200",
    status: "finished",
    region: "OCE",
    date: "2025-05-28",
    time: "11:00 AM UTC",
    participants: 32,
    maxParticipants: 32,
    registered: false,
    description: "An open tournament for players in the Oceania region.",
    registrationFee: "$5",
    budget: "$5,000",
  },
]

export default function TournamentsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("date")

  // Filter tournaments based on search, region, and status
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = !selectedRegion || tournament.region === selectedRegion
    const matchesStatus = !selectedStatus || tournament.status === selectedStatus

    return matchesSearch && matchesRegion && matchesStatus
  })

  // Sort tournaments
  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "date":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "participants":
        return b.participants - a.participants
      case "registrationFee":
        return (
          Number.parseFloat(a.registrationFee.replace("$", "")) - Number.parseFloat(b.registrationFee.replace("$", ""))
        )
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRegion(null)
    setSelectedStatus(null)
  }

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{t("tournaments")}</h1>
        <p className="text-muted-foreground">Browse and register for Teamfight Tactics tournaments around the world.</p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedRegion || "all"} onValueChange={(value) => setSelectedRegion(value || null)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t("region")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="AP">AP</SelectItem>
                <SelectItem value="NA">NA</SelectItem>
                <SelectItem value="EUW">EUW</SelectItem>
                <SelectItem value="KR">KR</SelectItem>
                <SelectItem value="OCE">OCE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus || ""} onValueChange={(value) => setSelectedStatus(value || null)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  Sort
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortBy("date")}>
                    <span className={sortBy === "date" ? "font-medium" : ""}>Date</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    <span className={sortBy === "name" ? "font-medium" : ""}>Name</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("participants")}>
                    <span className={sortBy === "participants" ? "font-medium" : ""}>Participants</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("registrationFee")}>
                    <span className={sortBy === "registrationFee" ? "font-medium" : ""}>Registration Fee</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Showing {sortedTournaments.length} tournaments</div>
          <SyncStatus status="live" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
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

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ongoing" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTournaments
              .filter((t) => t.status === "ongoing")
              .map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTournaments
              .filter((t) => t.status === "upcoming")
              .map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="finished" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTournaments
              .filter((t) => t.status === "finished")
              .map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="my-tournaments" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTournaments
              .filter((t) => t.registered)
              .map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
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
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tournament.description}</p>
        <div className="grid gap-2">
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
          <div className="flex items-center justify-between text-sm mt-2">
            <span>Registration Fee:</span>
            <span className="font-medium">{tournament.registrationFee}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Participants:</span>
            <span className="font-medium">
              {tournament.participants}/{tournament.maxParticipants}
            </span>
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
