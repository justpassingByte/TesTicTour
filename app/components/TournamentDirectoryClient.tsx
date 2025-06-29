"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SyncStatus } from "@/components/sync-status"
import { TournamentCard } from "../page"
import { ITournament } from "@/app/types/tournament"

interface TournamentDirectoryClientProps {
  tournaments: ITournament[]
}

export default function TournamentDirectoryClient({ tournaments }: TournamentDirectoryClientProps) {
  const [filteredTournaments, setFilteredTournaments] = useState<ITournament[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  
  useEffect(() => {
    let tempTournaments = [...tournaments]

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
  }, [tournaments, searchTerm, selectedRegion, selectedStatus])

  return (
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
            <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value)}>
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
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
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
              {filteredTournaments.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No tournaments match your criteria
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="in_progress" className="mt-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments
                .filter((t) => t.status === "in_progress")
                .map((tournament, index) => (
                  <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                ))}
              {filteredTournaments.filter((t) => t.status === "in_progress").length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No ongoing tournaments match your criteria
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments
                .filter((t) => t.status === "pending")
                .map((tournament, index) => (
                  <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                ))}
              {filteredTournaments.filter((t) => t.status === "pending").length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No upcoming tournaments match your criteria
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments
                .filter((t) => t.status === "completed")
                .map((tournament, index) => (
                  <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                ))}
              {filteredTournaments.filter((t) => t.status === "completed").length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No completed tournaments match your criteria
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-tournaments" className="mt-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments
                .filter((t) => t.registered)
                .map((tournament, index) => (
                  <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                ))}
              {filteredTournaments.filter((t) => t.registered).length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  You are not registered for any tournaments
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
} 