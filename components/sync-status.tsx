"use client"

import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"

type Status = "live" | "syncing" | "error" | "idle"

interface SyncStatusProps {
  status?: Status
  onSync?: () => Promise<void>
}

export function SyncStatus({ status = "idle", onSync }: SyncStatusProps) {
  const [currentStatus, setCurrentStatus] = useState<Status>(status)
  const { t } = useLanguage()

  const handleSync = async () => {
    if (currentStatus === "syncing") return

    try {
      setCurrentStatus("syncing")
      if (onSync) {
        await onSync()
      } else {
        // Simulate sync for demo
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
      setCurrentStatus("live")
    } catch (error) {
      setCurrentStatus("error")
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div
              className={`
                h-2 w-2 rounded-full transition-colors duration-500
                ${currentStatus === "live" && "bg-live-update animate-glow"}
                ${currentStatus === "syncing" && "bg-yellow-500"}
                ${currentStatus === "error" && "bg-destructive"}
                ${currentStatus === "idle" && "bg-muted"}
              `}
            />
            <span className="text-sm text-muted-foreground">
              {currentStatus === "live" && t("live_updates")}
              {currentStatus === "syncing" && t("syncing")}
              {currentStatus === "error" && t("sync_error")}
              {currentStatus === "idle" && t("not_synced")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleSync}
              disabled={currentStatus === "syncing"}
            >
              {currentStatus === "syncing" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {currentStatus === "live" && "Data is being updated in real-time"}
            {currentStatus === "syncing" && "Syncing data with Riot API..."}
            {currentStatus === "error" && "Failed to sync with Riot API"}
            {currentStatus === "idle" && "Click to sync with Riot API"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
