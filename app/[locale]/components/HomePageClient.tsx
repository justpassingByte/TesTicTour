"use client"

import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, ChevronRight, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ITournament } from "@/app/types/tournament"

import TournamentDirectoryClient from "./TournamentDirectoryClient"
import { useTranslations } from 'next-intl';

const defaultTFTImage = "/TFT.jfif"

interface HomePageClientProps {
  tournaments: ITournament[];
}

export default function HomePageClient({ tournaments }: HomePageClientProps) {
  const featuredTournaments = tournaments
    .filter((t) => t.status === "in_progress")
    .slice(0, 2)

  const t = useTranslations('common');

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-pattern py-16 md:py-24 border-b">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="gradient-text">{t('hero_title_part1')}</span> {t('hero_title_part2')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('hero_description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/tournaments">{t('browse_tournaments')}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/players">{t('view_players')}</Link>
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
                    {t('live_tournaments')}: {tournaments.filter((t) => t.status === "in_progress").length}
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
              <h2 className="text-3xl font-bold mb-2">{t('featured_tournaments')}</h2>
              <p className="text-muted-foreground">{t('featured_tournaments_description')}</p>
            </div>
            <Link href="/tournaments" className="group flex items-center text-primary mt-4 md:mt-0">
              {t('view_all_tournaments')}
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
            <h2 className="text-3xl md:text-4xl font-bold">{t('cta_title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('cta_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/tournaments">{t('find_tournament')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/profile">{t('create_account')}</Link>
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
  const t = useTranslations('common');
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
              {t(tournament.status as any)}
            </Badge>
            <Badge variant="outline" className="ml-2 bg-transparent backdrop-blur-sm">
              {t(tournament.region as any)}
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
            <span>{new Date(tournament.startTime).toLocaleTimeString()} {t('utc')}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{t('region_label', { region: tournament.region })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/tournaments/${tournament.id}`}>{t('view_tournament')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Skeleton loader for Tournament Directory
function TournamentDirectorySkeleton() {
  const t = useTranslations('common');
  return (
    <section className="py-12 bg-background/60 dark:bg-background/40 backdrop-blur-lg border-t border-b border-white/20">
      <div className="container space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">{t('tournament_directory')}</h2>
          <p className="text-muted-foreground">{t('loading_tournaments')}</p>
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