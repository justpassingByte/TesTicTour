import Link from "next/link"
import {
  Coins,
  Star,
  Trophy,
  Users,
  TrendingUp,
  Plus,
} from "lucide-react"

import { MiniTourLobby, PartnerData } from "@/app/stores/miniTourLobbyStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect } from "react"

export function OverviewTabNew({ partnerData, lobbies }: { partnerData: PartnerData | null; lobbies: MiniTourLobby[] }) {
  if (!partnerData) return <p>Could not load overview.</p>

  useEffect(() => {
    // existing code here
  }, [partnerData]) // added partnerData to dependency array

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-primary" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">${partnerData?.totalRevenue?.toLocaleString() || 0}</span>
                <span className="text-sm text-muted-foreground">total</span>
              </div>
              <Progress value={Math.min((partnerData?.totalRevenue || 0) / 100, 100)} className="h-2" />
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Total Lobbies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{partnerData?.totalLobbies || 0}</span>
                <span className="text-sm text-muted-foreground">lobbies</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {partnerData?.activeLobbies || 0} active
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  {(partnerData?.totalLobbies || 0) - (partnerData?.activeLobbies || 0)} completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-600" />
              Referred Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{partnerData?.totalPlayers || 0}</span>
                <span className="text-sm text-muted-foreground">players</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Active this month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lobbies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Lobbies</CardTitle>
              <CardDescription>Your latest tournament lobbies</CardDescription>
            </div>
            <Link href="/dashboard/partner/lobbies">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Lobby
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lobbies.length > 0 ? (
              lobbies
                .slice(0, 5)
                .map((lobby) => (
                  <div key={lobby.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{lobby.name}</h4>
                        <Badge 
                          variant={lobby.status === 'WAITING' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {lobby.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {lobby.currentPlayers}/{lobby.maxPlayers}
                        </span>
                        <span className="flex items-center">
                          <Coins className="mr-1 h-3 w-3" />
                          ${lobby.prizePool.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Star className="mr-1 h-3 w-3 text-yellow-500" />
                          {lobby.averageRating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No lobbies yet</p>
                <p className="text-sm">Create your first tournament lobby to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
