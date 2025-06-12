import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Mock tournament data
const tournament = {
  id: 1,
  name: "TFT Championship Series",
  currentRound: 2,
  totalRounds: 4,
}

// Mock round data
const roundData = {
  number: 2,
  status: "in_progress",
  matches: [1, 2, 3],
  lobbies: [
    {
      id: 1,
      name: "Lobby 1",
      players: [
        { id: 1, name: "Player1", region: "AP", placements: [1, 3, 5], points: [8, 6, 4], total: 18, advanced: true },
        { id: 2, name: "Player2", region: "AP", placements: [2, 1, 3], points: [7, 8, 6], total: 21, advanced: true },
        { id: 3, name: "Player3", region: "NA", placements: [3, 2, 1], points: [6, 7, 8], total: 21, advanced: true },
        { id: 4, name: "Player4", region: "EUW", placements: [4, 4, 2], points: [5, 5, 7], total: 17, advanced: true },
        { id: 5, name: "Player5", region: "KR", placements: [5, 5, 4], points: [4, 4, 5], total: 13, eliminated: true },
        { id: 6, name: "Player6", region: "NA", placements: [6, 6, 6], points: [3, 3, 3], total: 9, eliminated: true },
        { id: 7, name: "Player7", region: "AP", placements: [7, 7, 7], points: [2, 2, 2], total: 6, eliminated: true },
        { id: 8, name: "Player8", region: "EUW", placements: [8, 8, 8], points: [1, 1, 1], total: 3, eliminated: true },
      ],
    },
    {
      id: 2,
      name: "Lobby 2",
      players: [
        { id: 9, name: "Player9", region: "AP", placements: [1, 2, 2], points: [8, 7, 7], total: 22, advanced: true },
        { id: 10, name: "Player10", region: "NA", placements: [2, 1, 1], points: [7, 8, 8], total: 23, advanced: true },
        { id: 11, name: "Player11", region: "KR", placements: [3, 3, 3], points: [6, 6, 6], total: 18, advanced: true },
        {
          id: 12,
          name: "Player12",
          region: "EUW",
          placements: [4, 4, 4],
          points: [5, 5, 5],
          total: 15,
          advanced: true,
        },
        {
          id: 13,
          name: "Player13",
          region: "AP",
          placements: [5, 5, 5],
          points: [4, 4, 4],
          total: 12,
          eliminated: true,
        },
        {
          id: 14,
          name: "Player14",
          region: "NA",
          placements: [6, 6, 6],
          points: [3, 3, 3],
          total: 9,
          eliminated: true,
        },
        {
          id: 15,
          name: "Player15",
          region: "KR",
          placements: [7, 7, 7],
          points: [2, 2, 2],
          total: 6,
          eliminated: true,
        },
        {
          id: 16,
          name: "Player16",
          region: "EUW",
          placements: [8, 8, 8],
          points: [1, 1, 1],
          total: 3,
          eliminated: true,
        },
      ],
    },
    {
      id: 3,
      name: "Lobby 3",
      players: [
        { id: 17, name: "Player17", region: "AP", placements: [1, 1, 3], points: [8, 8, 6], total: 22, advanced: true },
        { id: 18, name: "Player18", region: "NA", placements: [2, 3, 1], points: [7, 6, 8], total: 21, advanced: true },
        { id: 19, name: "Player19", region: "KR", placements: [3, 2, 2], points: [6, 7, 7], total: 20, advanced: true },
        {
          id: 20,
          name: "Player20",
          region: "EUW",
          placements: [4, 4, 4],
          points: [5, 5, 5],
          total: 15,
          advanced: true,
        },
        {
          id: 21,
          name: "Player21",
          region: "AP",
          placements: [5, 5, 5],
          points: [4, 4, 4],
          total: 12,
          eliminated: true,
        },
        {
          id: 22,
          name: "Player22",
          region: "NA",
          placements: [6, 6, 6],
          points: [3, 3, 3],
          total: 9,
          eliminated: true,
        },
        {
          id: 23,
          name: "Player23",
          region: "KR",
          placements: [7, 7, 7],
          points: [2, 2, 2],
          total: 6,
          eliminated: true,
        },
        {
          id: 24,
          name: "Player24",
          region: "EUW",
          placements: [8, 8, 8],
          points: [1, 1, 1],
          total: 3,
          eliminated: true,
        },
      ],
    },
    {
      id: 4,
      name: "Lobby 4",
      players: [
        { id: 25, name: "Player25", region: "AP", placements: [1, 2, 1], points: [8, 7, 8], total: 23, advanced: true },
        { id: 26, name: "Player26", region: "NA", placements: [2, 1, 2], points: [7, 8, 7], total: 22, advanced: true },
        { id: 27, name: "Player27", region: "KR", placements: [3, 3, 3], points: [6, 6, 6], total: 18, advanced: true },
        {
          id: 28,
          name: "Player28",
          region: "EUW",
          placements: [4, 4, 4],
          points: [5, 5, 5],
          total: 15,
          advanced: true,
        },
        {
          id: 29,
          name: "Player29",
          region: "AP",
          placements: [5, 5, 5],
          points: [4, 4, 4],
          total: 12,
          eliminated: true,
        },
        {
          id: 30,
          name: "Player30",
          region: "NA",
          placements: [6, 6, 6],
          points: [3, 3, 3],
          total: 9,
          eliminated: true,
        },
        {
          id: 31,
          name: "Player31",
          region: "KR",
          placements: [7, 7, 7],
          points: [2, 2, 2],
          total: 6,
          eliminated: true,
        },
        {
          id: 32,
          name: "Player32",
          region: "EUW",
          placements: [8, 8, 8],
          points: [1, 1, 1],
          total: 3,
          eliminated: true,
        },
      ],
    },
  ],
}

export default function RoundPage({ params }: { params: { id: string; round: string } }) {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-1 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <ChevronRight className="h-4 w-4\
