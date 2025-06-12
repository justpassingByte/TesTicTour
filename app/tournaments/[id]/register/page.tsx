"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Loader2, Search, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/components/language-provider"

// Mock tournament data
const tournament = {
  id: 1,
  name: "TFT Championship Series",
  status: "upcoming",
  registrationFee: "$10",
}

// Mock regions
const regions = [
  { id: "ap", name: "Asia Pacific (AP)" },
  { id: "na", name: "North America (NA)" },
  { id: "euw", name: "Europe West (EUW)" },
  { id: "kr", name: "Korea (KR)" },
  { id: "br", name: "Brazil (BR)" },
  { id: "lan", name: "Latin America North (LAN)" },
  { id: "las", name: "Latin America South (LAS)" },
  { id: "oce", name: "Oceania (OCE)" },
]

export default function TournamentRegistration({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [summonerName, setSummonerName] = useState("")
  const [region, setRegion] = useState("ap")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [summonerInfo, setSummonerInfo] = useState<{
    name: string
    iconId: number
    level: number
    rank: string
    puuid: string
  } | null>(null)

  const handleSearch = async () => {
    if (!summonerName.trim()) return

    setStatus("loading")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock success response
      if (summonerName.toLowerCase() === "error") {
        setStatus("error")
        setErrorMessage("Summoner not found. Please check the name and region.")
        setSummonerInfo(null)
      } else {
        setStatus("success")
        setSummonerInfo({
          name: summonerName,
          iconId: 29,
          level: 312,
          rank: "Diamond 2",
          puuid: "PUUID-" + Math.random().toString(36).substring(2, 15),
        })
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred while searching for the summoner.")
      setSummonerInfo(null)
    }
  }

  const handleSubmit = async () => {
    if (!summonerInfo) return

    setStatus("loading")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page (in a real app)
      setStatus("success")
      window.location.href = `/tournaments/${params.id}`
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred during registration.")
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/tournaments">Tournaments</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/tournaments/${params.id}`}>{tournament.name}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Register</span>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Register for {tournament.name}</h1>
        <p className="text-muted-foreground mb-8">
          Enter your Summoner Name and select your region to register for this tournament. Registration fee:{" "}
          {tournament.registrationFee}
        </p>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
            <CardDescription>
              We'll use your Riot account to track your tournament progress automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="summoner-name">{t("summoner_name")}</Label>
              <div className="flex space-x-2">
                <Input
                  id="summoner-name"
                  value={summonerName}
                  onChange={(e) => setSummonerName(e.target.value)}
                  placeholder="Enter your summoner name"
                  className="flex-1"
                  disabled={status === "loading" || status === "success"}
                />
                <Button
                  onClick={handleSearch}
                  disabled={!summonerName.trim() || status === "loading" || status === "success"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">{t("region")}</Label>
              <RadioGroup
                defaultValue={region}
                onValueChange={setRegion}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                disabled={status === "loading" || status === "success"}
              >
                {regions.map((region) => (
                  <div key={region.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={region.id} id={region.id} />
                    <Label htmlFor={region.id} className="cursor-pointer">
                      {region.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {status === "error" && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {summonerInfo && (
              <Alert className="bg-primary/10 border-primary/20 text-primary animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Summoner Found</AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <div>
                    <span className="font-medium">{summonerInfo.name}</span> (Level {summonerInfo.level})
                  </div>
                  <div>Rank: {summonerInfo.rank}</div>
                  <div className="text-xs text-muted-foreground">PUUID: {summonerInfo.puuid}</div>
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border p-4 bg-muted/50">
              <h3 className="font-medium mb-2">Registration Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tournament:</span>
                  <span>{tournament.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration Fee:</span>
                  <span>{tournament.registrationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>Credit Card / PayPal</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/tournaments/${params.id}`}>Cancel</Link>
            </Button>
            <Button onClick={handleSubmit} disabled={!summonerInfo || status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
