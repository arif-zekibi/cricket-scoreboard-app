"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamConfigProps {
  onMatchStart: (data: any) => void
}

interface Player {
  id: string
  name: string
  jerseyNumber: number
}

interface Team {
  id: string
  name: string
  players: Player[]
  battingOrder: string[]
}

type MatchType = "T20" | "ODI" | "TEST" | "CUSTOM"

export function TeamConfig({ onMatchStart }: TeamConfigProps) {
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Team A", players: [], battingOrder: [] },
    { id: "2", name: "Team B", players: [], battingOrder: [] },
  ])
  const [matchType, setMatchType] = useState<MatchType>("T20")
  const [overs, setOvers] = useState(20)
  const [activeTeam, setActiveTeam] = useState("1")

  const handleMatchTypeChange = (type: MatchType) => {
    setMatchType(type)
    switch (type) {
      case "T20":
        setOvers(20)
        break
      case "ODI":
        setOvers(50)
        break
      case "TEST":
        setOvers(90) // Test cricket doesn't have over limit, but we'll use 90 as max per session
        break
      case "CUSTOM":
        // Keep current overs value
        break
    }
  }

  const updateTeamName = (teamId: string, newName: string) => {
    setTeams(teams.map(team =>
      team.id === teamId ? { ...team, name: newName } : team
    ))
  }

  const addPlayer = (teamId: string, playerName: string, jerseyNumber: number) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: [...team.players, { id: `${teamId}-${Date.now()}`, name: playerName, jerseyNumber }],
            }
          : team,
      ),
    )
  }

  const setBattingOrder = (teamId: string, playerIds: string[]) => {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, battingOrder: playerIds } : team)))
  }

  const startMatch = () => {
    if (teams[0].battingOrder.length < 2 || teams[1].battingOrder.length < 2) {
      alert("Configure both teams: Each team needs at least 2 players in batting order")
      return
    }

    if (!teams[0].name.trim() || !teams[1].name.trim()) {
      alert("Please provide names for both teams")
      return
    }

    onMatchStart({
      matchType,
      team1: teams[0],
      team2: teams[1],
      overs,
      timestamp: Date.now(),
    })
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Match Configuration</h2>

        {/* Match Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Match Type</label>
          <div className="grid grid-cols-4 gap-2">
            {(["T20", "ODI", "TEST", "CUSTOM"] as MatchType[]).map((type) => (
              <Button
                key={type}
                onClick={() => handleMatchTypeChange(type)}
                variant={matchType === type ? "default" : "outline"}
                className={matchType === type ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Overs Configuration */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Total Overs {matchType === "TEST" && "(per innings)"}
          </label>
          <Input
            type="number"
            value={overs}
            onChange={(e) => setOvers(Number(e.target.value))}
            min="1"
            max={matchType === "TEST" ? "450" : "50"}
            className="max-w-xs"
            disabled={matchType !== "CUSTOM" && matchType !== "TEST"}
          />
          <p className="text-xs text-gray-500 mt-1">
            {matchType === "T20" && "T20 format: 20 overs"}
            {matchType === "ODI" && "ODI format: 50 overs"}
            {matchType === "TEST" && "Test cricket: Customize overs per innings"}
            {matchType === "CUSTOM" && "Custom format: Set your own overs"}
          </p>
        </div>
      </Card>

      <Tabs value={activeTeam} onValueChange={setActiveTeam}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="1">{teams[0].name}</TabsTrigger>
          <TabsTrigger value="2">{teams[1].name}</TabsTrigger>
        </TabsList>

        {teams.map((team) => (
          <TabsContent key={team.id} value={team.id}>
            <TeamSetup
              team={team}
              onAddPlayer={(name, jersey) => addPlayer(team.id, name, jersey)}
              onSetBattingOrder={(order) => setBattingOrder(team.id, order)}
              onUpdateTeamName={(name) => updateTeamName(team.id, name)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Button onClick={startMatch} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
        Start Match
      </Button>
    </div>
  )
}

interface TeamSetupProps {
  team: Team
  onAddPlayer: (name: string, jersey: number) => void
  onSetBattingOrder: (order: string[]) => void
  onUpdateTeamName: (name: string) => void
}

function TeamSetup({ team, onAddPlayer, onSetBattingOrder, onUpdateTeamName }: TeamSetupProps) {
  const [playerName, setPlayerName] = useState("")
  const [jerseyNumber, setJerseyNumber] = useState("")

  const handleAddPlayer = () => {
    if (playerName.trim() && jerseyNumber) {
      onAddPlayer(playerName, Number(jerseyNumber))
      setPlayerName("")
      setJerseyNumber("")
    }
  }

  return (
    <Card className="p-6 bg-white space-y-6">
      {/* Team Name Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Team Name</label>
        <Input
          placeholder="Enter team name"
          value={team.name}
          onChange={(e) => onUpdateTeamName(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Add Players</h3>
        <div className="flex gap-2">
          <Input placeholder="Player name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <Input
            placeholder="Jersey #"
            type="number"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            className="w-20"
          />
          <Button onClick={handleAddPlayer} className="bg-blue-600 hover:bg-blue-700">
            Add
          </Button>
        </div>
      </div>

      {team.players.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Select for Batting Order</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {team.players.map((player) => (
              <label
                key={player.id}
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={team.battingOrder.includes(player.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSetBattingOrder([...team.battingOrder, player.id])
                    } else {
                      onSetBattingOrder(team.battingOrder.filter((id) => id !== player.id))
                    }
                  }}
                  className="w-4 h-4"
                />
                <span>
                  <span className="font-medium">#{player.jerseyNumber}</span> - {player.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {team.battingOrder.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Batting Order</h3>
          <ol className="space-y-2">
            {team.battingOrder.map((playerId, idx) => {
              const player = team.players.find((p) => p.id === playerId)
              return (
                <li
                  key={playerId}
                  className={`p-3 rounded flex justify-between items-center ${
                    idx < 2 ? "bg-blue-100 border border-blue-300" : "bg-gray-100"
                  }`}
                >
                  <span>
                    <span className="font-semibold">{idx + 1}.</span> #{player?.jerseyNumber} {player?.name}
                  </span>
                  {idx === 0 && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Striker</span>}
                  {idx === 1 && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Non-Striker</span>}
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </Card>
  )
}
