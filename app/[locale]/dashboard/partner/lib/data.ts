import { cache } from "react"

import api from "@/app/lib/apiConfig"
import { MiniTourLobby, PartnerData, AnalyticsData } from "@/app/stores/miniTourLobbyStore"

// Data Fetching Functions (Server-side)
export const getPartnerData = cache(async (): Promise<PartnerData | null> => {
  try {
    const response = await api.get("/partner/summary")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch partner data:", error)
    return null
  }
})

export const getPartnerLobbies = cache(async (): Promise<MiniTourLobby[]> => {
  try {
    const response = await api.get("/minitour-lobbies")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch partner lobbies:", error)
    return []
  }
})

export const getAnalyticsData = cache(async (): Promise<AnalyticsData | null> => {
  try {
    const response = await api.get("/partner/analytics")
    return response.data.data
  } catch (error) {
    console.error("Failed to fetch analytics data:", error)
    return null
  }
}) 