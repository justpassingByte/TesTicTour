'use client';
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  TrendingUp,
  Coins,
  Users,
} from "lucide-react"

import api from "@/app/lib/apiConfig"
import { Player, MiniTourLobby } from "@/app/stores/miniTourLobbyStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Import the async components from the new file
import { PartnerHeader, KeyMetrics, OverviewTab, LobbiesTab, AnalyticsTab, RevenueTab, SettingsTab } from "./PartnerServerComponents"

// Data Fetching Functions

export const getPlayersData = async (referrer: string): Promise<Player[]> => {
  // console.log("Attempting to fetch players for referrer:", referrer);
  try {
    const response = await api.get(`/admin/users/by-referrer?referrer=${referrer}`)
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch players data:", error)
    return []
  }
}

// --- CLIENT COMPONENTS ---

export function PlayerTab({ referrer }: { referrer: string }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPlayersData(referrer)
        setPlayers(data)
      } catch (err) {
        console.error("Error fetching players:", err)
        setError("Failed to load players. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (referrer) {
      fetchPlayers()
    }
  }, [referrer])

  if (loading) {
  return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
      </div>
    </div>
  )
}

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Players</h2>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Player
          </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {players.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">No players found for this referrer.</p>
        ) : (
          players.map((player) => (
            <Card key={player.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-lg font-semibold">{player.username}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Player</DropdownMenuItem>
                    <DropdownMenuItem>Edit Player</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Player</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
          </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Total Matches Played: {player.totalMatchesPlayed}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Tournaments Won: {player.tournamentsWon}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Coins className="mr-2 h-4 w-4" />
                  <span>Total Amount Won: ${player.totalAmountWon.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
          ))
        )}
      </div>
    </div>
  )
}

export function MiniTournamentsTab() {
  const [tournaments, setTournaments] = useState<MiniTourLobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/minitournaments'); // Adjust API endpoint as needed
        setTournaments(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch tournaments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) return <div>Loading tournaments...</div>;
  if (error) return <div>Error: {error}</div>;
  if (tournaments.length === 0) return <p>No mini-tournaments found.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mini-Tournaments</h2>
          <Table>
            <TableHeader>
              <TableRow>
            <TableHead>Tournament Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Prize Pool</TableHead>
            <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell className="font-medium">{tournament.name}</TableCell>
              <TableCell>{tournament.status}</TableCell>
              <TableCell>{tournament.currentPlayers}/{tournament.maxPlayers}</TableCell>
              <TableCell>${tournament.prizePool.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Tournament</DropdownMenuItem>
                    <DropdownMenuItem>Edit Tournament</DropdownMenuItem>
                    <DropdownMenuItem>Delete Tournament</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    </div>
  );
}
