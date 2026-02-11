"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Player {
  id: string
  user: {
    id: string
    username: string
    email: string
    riotGameName: string
    riotGameTag: string
    region: string
    role: string
    totalMatchesPlayed: number
    tournamentsWon: number
    balance: {
      amount: number
    } | null
    referrer: string
    createdAt: string
  }
}

interface EditPlayerModalProps {
  open: boolean
  onClose: () => void
  onUpdate: (playerId: string, playerData: any) => void
  player: Player | null
}

export default function EditPlayerModal({ open, onClose, onUpdate, player }: EditPlayerModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    riotGameName: '',
    riotGameTag: '',
    region: '',
    role: 'user'
  })

  useEffect(() => {
    if (player) {
      setFormData({
        username: player.user.username,
        email: player.user.email,
        riotGameName: player.user.riotGameName || '',
        riotGameTag: player.user.riotGameTag || '',
        region: player.user.region || '',
        role: player.user.role || 'user'
      })
    }
  }, [player])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (player) {
      onUpdate(player.id, formData)
    }
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Username
              </Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-riotGameName" className="text-right">
                Riot Game Name
              </Label>
              <Input
                id="edit-riotGameName"
                value={formData.riotGameName}
                onChange={(e) => handleChange('riotGameName', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-riotGameTag" className="text-right">
                Riot Tag
              </Label>
              <Input
                id="edit-riotGameTag"
                value={formData.riotGameTag}
                onChange={(e) => handleChange('riotGameTag', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-region" className="text-right">
                Region
              </Label>
              <Select value={formData.region} onValueChange={(value) => handleChange('region', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NA">North America</SelectItem>
                  <SelectItem value="EU">Europe</SelectItem>
                  <SelectItem value="KR">Korea</SelectItem>
                  <SelectItem value="CN">China</SelectItem>
                  <SelectItem value="BR">Brazil</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="OCE">Oceania</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Player</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
