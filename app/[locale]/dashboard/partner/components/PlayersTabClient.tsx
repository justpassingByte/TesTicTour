"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Users, Edit, Trash2, Upload, Plus, DollarSign } from "lucide-react"
import Link from "next/link"
import AddPlayerModal from "./AddPlayerModal"
import EditPlayerModal from "./EditPlayerModal"
import WithdrawModal from "./WithdrawModal"

interface Player {
  id: string
  miniTourLobbyId: string
  userId: string
  joinedAt: string
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

interface PlayersTabClientProps {
  players: Player[]
  currentBalance?: number
  totalRevenue?: number
}

export default function PlayersTabClient({ players, currentBalance = 0, totalRevenue = 0 }: PlayersTabClientProps) {
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  const handleExportCSV = () => {
    // Create CSV content
    const csvHeader = 'ID,Username,Email,Riot Game Name,Riot Tag,Region,Role,Total Matches,Tournaments Won,Balance,Referrer,Joined At,Created At\n';
    
    const csvData = players.map(player => [
      player.user.id,
      player.user.username,
      player.user.email,
      player.user.riotGameName || '',
      player.user.riotGameTag || '',
      player.user.region || '',
      player.user.role || '',
      player.user.totalMatchesPlayed || 0,
      player.user.tournamentsWon || 0,
      player.user.balance?.amount || 0,
      player.user.referrer || '',
      player.joinedAt,
      player.user.createdAt
    ]);

    const csvContent = csvHeader + csvData.map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `partner-players-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        const response = await fetch(`/api/partner/players/${playerId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Refresh page or update state
          window.location.reload();
        } else {
          alert('Failed to delete player');
        }
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Error deleting player');
      }
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setOpenEditModal(true);
  };

  const handleCreatePlayer = async (playerData: any) => {
    try {
      const response = await fetch('/api/partner/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData)
      });
      
      if (response.ok) {
        alert('Player created successfully');
        window.location.reload();
      } else {
        alert('Failed to create player');
      }
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Error creating player');
    }
  };

  const handleUpdatePlayer = async (playerId: string, playerData: any) => {
    try {
      const response = await fetch(`/api/partner/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData)
      });
      
      if (response.ok) {
        alert('Player updated successfully');
        window.location.reload();
      } else {
        alert('Failed to update player');
      }
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Error updating player');
    }
  };

  const handleWithdraw = async (withdrawData: any) => {
    try {
      const response = await fetch('/api/partner/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawData)
      });
      
      if (response.ok) {
        alert('Withdrawal request submitted successfully');
        window.location.reload();
      } else {
        alert('Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      alert('Error submitting withdrawal');
    }
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/partner/import/players', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            alert('Players imported successfully');
            window.location.reload();
          } else {
            alert('Failed to import players');
          }
        } catch (error) {
          console.error('Error importing players:', error);
          alert('Error importing players');
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Referred Players</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Total Referred: {players.length}
          </span>
          <Badge variant="secondary">All Active</Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setOpenWithdrawModal(true)}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleImportCSV}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setOpenAddModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Player List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Referred By</TableHead>
                <TableHead>Joined At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg`} />
                        <AvatarFallback>
                          {player.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{player.user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.user.riotGameName}#{player.user.riotGameTag}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{player.user.email}</TableCell>
                  <TableCell>{player.user.region || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{player.user.role || 'User'}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${player.user.balance?.amount || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{player.user.referrer}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(player.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPlayer(player)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeletePlayer(player.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddPlayerModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onCreate={handleCreatePlayer}
      />
      <EditPlayerModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onUpdate={handleUpdatePlayer}
        player={editingPlayer}
      />
      <WithdrawModal
        open={openWithdrawModal}
        onClose={() => setOpenWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        currentBalance={currentBalance}
        totalRevenue={totalRevenue}
      />
    </div>
  )
}
