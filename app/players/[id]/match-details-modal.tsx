"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { usePlayerStore } from "@/app/stores/playerStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MatchDetailsModalProps {
  matchId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MatchDetailsModal({ matchId, userId, isOpen, onClose }: MatchDetailsModalProps) {
  const { matchResults, fetchPlayerMatchResults, isLoading, error } = usePlayerStore();

  useEffect(() => {
    if (isOpen && matchId) {
      console.log("Fetching match details for:", matchId);
      fetchPlayerMatchResults(matchId);
    }
  }, [isOpen, matchId, fetchPlayerMatchResults]);

  useEffect(() => {
    console.log("Match Results state:", matchResults);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
  }, [matchResults, isLoading, error]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Match Details</DialogTitle>
          <DialogDescription>Detailed results for match ID: {matchId}</DialogDescription>
        </DialogHeader>
        {
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-muted-foreground">Loading match results...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-red-500">
              <AlertCircle className="mr-2 h-8 w-8" />
              <p className="mt-2">Error: {error}</p>
            </div>
          ) : matchResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No detailed results found for this match.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-center">Placement</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.tournamentName}</TableCell>
                    <TableCell className="text-center">{result.placement}</TableCell>
                    <TableCell className="text-right">{result.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        }
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 