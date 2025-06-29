"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { MiniTourLobby, MiniTourMatch, MiniTourMatchResult, MiniTourLobbyParticipant } from "@/stores/miniTourLobbyStore"
import { useMiniTourLobbyStore } from "@/stores/miniTourLobbyStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

// --- Helper functions to get image URLs from Riot/Community Dragon ---

/*
const getUnitIconUrl = (characterId: string) => {
  if (!characterId) return "";
  const name = characterId.split('_')[1]?.toLowerCase();
  if (!name) return "";
  // Using a community-driven CDN like lolchess.gg is often simpler for static assets
  return `https://cdn.lolchess.gg/images/tft/11/champions/${name}.png`;
};

const getItemIconUrl = (itemName: string) => {
  if (!itemName) return "";
  // Transforms 'TFT_Item_ArchangelsStaff' or 'TFT14_Item_MobEmblem' to 'archangels-staff' or 'mob-emblem'
  const cleanName = itemName
    .replace(/^TFT\d*_Item_/, '') // Remove TFT_Item_ or TFTX_Item_
    .replace(/([A-Z])/g, (match, p1, offset) => (offset > 0 ? '-' : '') + p1.toLowerCase());
  return `https://cdn.lolchess.gg/images/tft/11/items/${cleanName}.png`;
};

const getTraitIconUrl = (traitName: string) => {
  if (!traitName) return "";
  const name = traitName.split('_')[1]?.toLowerCase();
  if (!name) return "";
  return `https://cdn.lolchess.gg/images/tft/11/traits/${name.toLowerCase()}.png`;
};
*/

const getTraitStyleBgClass = (style: number) => {
  switch (style) {
    case 1: return 'bg-[#A77044]'; // Bronze
    case 2: return 'bg-[#C4C4C4]'; // Silver
    case 3: return 'bg-[#FFB956]'; // Gold
    case 4: return 'bg-gradient-to-r from-purple-500 to-red-500'; // Prismatic
    default: return 'bg-gray-700';
  }
}

// --- New component to display a player's board ---

function PlayerCompositionDetail({ participant }: { participant: any }) {
  if (!participant || !participant.traits || !participant.units) {
    return <div className="p-2 text-xs text-muted-foreground">No detailed composition data available.</div>;
  }

  const activeTraits = participant.traits.filter((t: any) => t.style > 0);
  activeTraits.sort((a: any, b: any) => b.style - a.style || b.tier_current - a.tier_current);

  const units = participant.units.sort((a: any, b: any) => b.tier - a.tier);

  // Removed debugging logs

  return (
    <div className="bg-muted/30 p-2 rounded-md w-full">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {activeTraits.map((trait: any) => (
          <div key={trait.name} className={`flex items-center gap-1.5 p-1 rounded-sm text-white`}>
             <div className={`w-5 h-5 flex items-center justify-center rounded-sm ${getTraitStyleBgClass(trait.style)}`}>
               {/* <img src={getTraitIconUrl(trait.name)} alt={trait.name} className="w-4 h-4" /> */}
             </div>
            <span className="text-xs font-semibold text-foreground">{trait.tier_current}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-1 flex-wrap">
        {units.map((unit: any) => (
          <div key={unit.character_id} className="flex flex-col items-center w-14">
             <div className={`relative border-2 rounded-md ${unit.tier === 3 ? 'border-yellow-500' : unit.tier === 2 ? 'border-slate-400' : 'border-transparent'}`}>
              {/* <img src={getUnitIconUrl(unit.character_id)} alt={unit.character_id} className="w-12 h-12 rounded" /> */}
              <div className="absolute -bottom-1 -right-1 bg-background text-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border">
                {unit.tier}
              </div>
            </div>
            <div className="flex items-center gap-0.5 mt-1 h-[16px]">
              {unit.itemNames.slice(0, 3).map((item: string, index: number) => {
                if (item === 'TFT_Item_EmptyBag') return null;
                return (
                  // <img key={`${item}-${index}`} src={getItemIconUrl(item)} alt={item} className="w-4 h-4 rounded-sm" />
                  <div key={`${item}-${index}`} className="w-4 h-4 rounded-sm bg-gray-500" title={item}></div>
                )
              })}
            </div>
            <span className="text-xs text-muted-foreground mt-0.5 truncate w-full text-center">{unit.character_id.split('_')[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LobbyMatchesTabProps {
  lobby: MiniTourLobby
}

function MatchResultTable({ match, participants }: { match: MiniTourMatch; participants: MiniTourLobbyParticipant[] }) {
  const sortedResults = [...match.miniTourMatchResults].sort((a, b) => a.placement - b.placement);

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((result) => {
            const lobbyParticipant = participants.find((p: MiniTourLobbyParticipant) => p.userId === result.userId);
            const puuid = lobbyParticipant?.user.puuid;
            const matchParticipant = match.matchData?.participants?.find((p: any) => p.puuid === puuid);
            const displayName = matchParticipant?.gameName && matchParticipant?.tagLine
              ? `${matchParticipant.gameName} #${matchParticipant.tagLine}`
              : result.user.username;

            return (
              <React.Fragment key={result.id}>
                <TableRow>
                  <TableCell className="font-bold">{result.placement}</TableCell>
                  <TableCell>{displayName}</TableCell>
                  <TableCell className="text-right">{result.points}</TableCell>
                </TableRow>
                {matchParticipant && (
                   <TableRow>
                     <TableCell colSpan={3} className="p-1">
                       <PlayerCompositionDetail participant={matchParticipant} />
                     </TableCell>
                   </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export function LobbyMatchesTab({ lobby }: LobbyMatchesTabProps) {
  const { syncMatch, syncingMatchId } = useMiniTourLobbyStore()

  if (!lobby.matches || lobby.matches.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No matches have been created yet.
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lobby.matches.map((match) => {
            const isSynced = !!match.fetchedAt && match.miniTourMatchResults.length > 0;
            const isSyncing = syncingMatchId === match.id;

            return (
               <Collapsible key={match.id} className="border rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                   <div className="text-left">
                     <p className="font-semibold">Match {match.id.substring(0, 8)}</p>
                     <div className="text-sm text-muted-foreground">
                       Status: <Badge variant={isSynced ? 'default' : 'secondary'}>{isSynced ? 'Completed' : 'Pending Sync'}</Badge>
                     </div>
                      {match.matchIdRiotApi && (
                        <p className="text-xs text-muted-foreground mt-1">Riot ID: {match.matchIdRiotApi}</p>
                      )}
                   </div>
                  <div className="flex items-center gap-2">
                    {!isSynced && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          syncMatch(match.id)
                        }}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync
                          </>
                        )}
                      </Button>
                    )}
                     <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:-rotate-180" />
                   </div>
                 </CollapsibleTrigger>
                 <CollapsibleContent className="p-4 pt-0">
                  {isSynced ? (
                    <MatchResultTable match={match} participants={lobby.participants} />
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-4">Sync the match to see the results.</p>
                  )}
                 </CollapsibleContent>
               </Collapsible>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 