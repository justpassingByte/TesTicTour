"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"

import { useMiniTourLobbyStore, MiniTourLobby } from "@/app/stores/miniTourLobbyStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LobbyActions({ lobby }: { lobby: MiniTourLobby }) {
  const router = useRouter()
  const { deleteLobby, isProcessingAction } = useMiniTourLobbyStore()

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this lobby? This action cannot be undone.")) {
      try {
        await deleteLobby(lobby.id, router)
        // Success toast can be shown here or handled globally if the store does it
      } catch (error) {
        // Error toast is likely handled by the store, but you could add one here as a fallback
        console.error("Failed to delete lobby from component:", error)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isProcessingAction}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/partner/minitours/${lobby.id}`}>
            <Edit className="mr-2 h-4 w-4" /> View/Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={handleDelete} disabled={isProcessingAction}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete Lobby
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 