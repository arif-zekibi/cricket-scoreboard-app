"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface InningConfigProps {
  matchData: any
  setMatchData: (data: any) => void
  onStart: () => void
}

export function InningConfig({ matchData, setMatchData, onStart }: InningConfigProps) {
  const [selectedBowlers, setSelectedBowlers] = useState<string[]>([])

  if (!matchData) return null

  const isFirstInning = matchData.currentInning === 1

  // First innings: team1 bats, team2 bowls
  // Second innings: team2 bats, team1 bowls (swap)
  const battingTeam = isFirstInning ? matchData.team1 : matchData.team2
  const bowlingTeam = isFirstInning ? matchData.team2 : matchData.team1

  const handleToggleBowler = (playerId: string) => {
    if (selectedBowlers.includes(playerId)) {
      setSelectedBowlers(selectedBowlers.filter((id) => id !== playerId))
    } else {
      setSelectedBowlers([...selectedBowlers, playerId])
    }
  }

  const handleStartInning = () => {
    if (selectedBowlers.length === 0) {
      alert("Select at least one bowler to start the innings")
      return
    }

    // Initialize innings data
    const inningData = {
      ...matchData,
      battingTeam: {
        ...battingTeam,
        // Players already have batting order from team setup
      },
      bowlingTeam: {
        ...bowlingTeam,
        bowlingOrder: selectedBowlers, // Bowling rotation order
      },
      runs: 0,
      wickets: 0,
      extras: 0,
      currentOver: 0,
      currentBall: 0,
      deliveries: [],
      strikerIdx: 0,
      nonStrikerIdx: 1,
      bowlerIdx: 0,
      nextBallIsFreeHit: false,
      status: "in-progress",
    }

    setMatchData(inningData)
    onStart()
  }

  return (
    <div className="space-y-4 p-6 max-w-3xl mx-auto">
      {/* Inning Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Innings {matchData.currentInning} Setup
        </h2>
        <p className="text-blue-100 text-lg">
          {battingTeam.name} (Batting) vs {bowlingTeam.name} (Bowling)
        </p>
        {!isFirstInning && matchData.innings.inning1 && (
          <div className="mt-3 p-3 bg-white/10 rounded">
            <p className="text-sm">
              Target: {matchData.innings.inning1.runs + 1} runs in {matchData.overs} overs
            </p>
          </div>
        )}
      </Card>

      {/* Batting Order Display */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Batting Order - {battingTeam.name}</h3>
        <div className="space-y-2">
          {battingTeam.battingOrder && battingTeam.battingOrder.length > 0 ? (
            battingTeam.battingOrder.map((playerId: string, idx: number) => {
              const player = battingTeam.players.find((p: any) => p.id === playerId)
              return (
                <div
                  key={playerId}
                  className={`p-3 rounded border-l-4 ${
                    idx === 0
                      ? "bg-green-100 border-green-600"
                      : idx === 1
                        ? "bg-blue-100 border-blue-600"
                        : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {idx + 1}. #{player?.jerseyNumber} {player?.name}
                    </p>
                    {idx === 0 && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Striker</span>
                    )}
                    {idx === 1 && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Non-Striker</span>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-gray-500">No batting order configured</p>
          )}
        </div>
      </Card>

      {/* Bowling Order Selection */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Select Bowlers - {bowlingTeam.name}</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select bowlers who will bowl in this innings. You can select all players or specific bowlers.
        </p>

        <div className="space-y-2">
          {bowlingTeam.players && bowlingTeam.players.length > 0 ? (
            bowlingTeam.players.map((player: any) => (
              <label
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded cursor-pointer transition border-2 ${
                  selectedBowlers.includes(player.id)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedBowlers.includes(player.id)}
                  onChange={() => handleToggleBowler(player.id)}
                  className="w-4 h-4"
                />
                <span className="font-medium">
                  #{player.jerseyNumber} {player.name}
                </span>
              </label>
            ))
          ) : (
            <p className="text-gray-500">No players available</p>
          )}
        </div>

        {selectedBowlers.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded">
            <p className="text-sm font-medium text-green-800">
              {selectedBowlers.length} bowler{selectedBowlers.length > 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </Card>

      {/* Start Button */}
      <Button
        onClick={handleStartInning}
        disabled={selectedBowlers.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg disabled:opacity-50"
      >
        Start Innings {matchData.currentInning}
      </Button>
    </div>
  )
}
