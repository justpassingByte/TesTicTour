"use client"

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ITournament } from "@/app/types/tournament";
import { useTranslations } from "next-intl";

const defaultTFTImage = "/TFT.jfif";

export function TournamentCard({ tournament, index }: { tournament: ITournament, index?: number }) {
  const t = useTranslations('common');
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
              {t(tournament.status.replace(/_/g, ' ') as any)}
            </Badge>
            <Badge variant="outline" className="bg-transparent backdrop-blur-sm">
              {t(tournament.region as any)}
            </Badge>
          </div>
        </div>
      </CardHeader>
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
      {/* Add CardFooter or other elements if needed */}
    </Card>
  );
} 