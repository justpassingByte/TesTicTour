import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Star,
} from "lucide-react"

import { PartnerData } from "@/app/stores/miniTourLobbyStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalyticsTabNewProps {
  partnerData: PartnerData | null
}

// Simple chart component using SVG
function SimpleChart({ data, color, title }: { data: number[]; color: string; title: string }) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  
  return (
    <div className="h-[200px] w-full">
      <div className="flex items-end justify-between h-full px-2">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - minValue) / range) * 100 : 50
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              />
              <span className="text-xs text-muted-foreground mt-1">
                {value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export async function AnalyticsTabNew({ partnerData }: AnalyticsTabNewProps) {
  if (!partnerData) return <p>Could not load analytics.</p>

  const { metrics } = partnerData

  // Generate mock growth data based on real metrics
  const playerGrowthData = [
    Math.max(0, (metrics?.totalPlayers || 0) - 15),
    Math.max(0, (metrics?.totalPlayers || 0) - 12),
    Math.max(0, (metrics?.totalPlayers || 0) - 9),
    Math.max(0, (metrics?.totalPlayers || 0) - 6),
    Math.max(0, metrics.totalPlayers - 3),
    metrics.totalPlayers
  ]

  const revenueGrowthData = [
    Math.max(0, (metrics?.monthlyRevenue || 0) - 80),
    Math.max(0, (metrics?.monthlyRevenue || 0) - 60),
    Math.max(0, (metrics?.monthlyRevenue || 0) - 40),
    Math.max(0, (metrics?.monthlyRevenue || 0) - 20),
    Math.max(0, (metrics?.monthlyRevenue || 0) - 10),
    (metrics?.monthlyRevenue || 0)
  ]

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Player Growth
            </CardTitle>
            <CardDescription>New players over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SimpleChart data={playerGrowthData} color="#3b82f6" title="Player Growth" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Growth</span>
                <span className="flex items-center text-green-600 font-medium">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  +{playerGrowthData[5] - playerGrowthData[0]} players
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
              Revenue Growth
            </CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SimpleChart data={revenueGrowthData} color="#10b981" title="Revenue Growth" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Growth</span>
                <span className="flex items-center text-green-600 font-medium">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  +${revenueGrowthData[5] - revenueGrowthData[0]}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{metrics.totalPlayers}</span>
                <span className="text-sm text-muted-foreground">players</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600">Active this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-600" />
              Partner Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{4.5}</span>
                <span className="text-sm text-muted-foreground">/5.0</span>
              </div>
              <div className="flex items-center text-sm">
                <Star className="mr-1 h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-yellow-600">Excellent performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key metrics and trends for your partnership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Lobby Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Lobbies</span>
                  <span className="font-medium">{metrics.totalLobbies}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Rate</span>
                  <span className="font-medium text-green-600">
                    {metrics.totalLobbies > 0 ? Math.round((metrics.activeLobbies / metrics.totalLobbies) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Revenue Share</span>
                  <span className="font-medium">{metrics.revenueShare}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Financial Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Revenue</span>
                  <span className="font-medium">${metrics.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Balance</span>
                  <span className="font-medium">${metrics.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Monthly</span>
                  <span className="font-medium">${Math.round(metrics.totalRevenue / 6).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
