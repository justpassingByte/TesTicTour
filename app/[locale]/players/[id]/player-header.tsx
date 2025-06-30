"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface PlayerHeaderProps {
  inGameName: string;
  region: string;
  username?: string;
  rank: string;
  level: number;
  puuid?: string;
  riotGameTag?: string;
}

export function PlayerHeader({
  inGameName,
  region,
  username,
  rank,
  level,
  puuid,
  riotGameTag,
}: PlayerHeaderProps) {
  return (
    <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`/placeholder-user.jpg`} alt={username} />
            <AvatarFallback>{username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold">{username}</h1>
              <Badge variant="outline" className="text-lg">Level {level || 312}</Badge>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{region} Region</Badge>
              <Badge>{rank}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Summoner Name</p>
                <p className="font-semibold">{inGameName} #{riotGameTag}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">PUUID</p>
                <p className="font-semibold truncate">{puuid || 'PUUID-ABC123DEF456GHI789JKL012MNO345'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 