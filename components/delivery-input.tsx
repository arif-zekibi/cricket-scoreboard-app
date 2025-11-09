"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DeliveryInputProps {
  matchData: any
  setMatchData: (data: any) => void
}

export function DeliveryInput({ matchData, setMatchData }: DeliveryInputProps) {
  const [runs, setRuns] = useState<number>(0)
  const [isWicket, setIsWicket] = useState(false)
  const [wicketType, setWicketType] = useState<string>("")
  const [isNoBall, setIsNoBall] = useState(false)
  const [isWide, setIsWide] = useState(false)
  const [isBye, setIsBye] = useState(false)
  const [isLegBye, setIsLegBye] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBatsmanSelector, setShowBatsmanSelector] = useState(false)
  const [selectedNewBatsman, setSelectedNewBatsman] = useState<string>("")

  const wicketTypes = ["Caught", "Bowled", "LBW", "Run Out", "Stumped", "Hit Wicket", "Handled Ball", "Obstructing"]

  const resetForm = () => {
    setRuns(0)
    setIsWicket(false)
    setWicketType("")
    setIsNoBall(false)
    setIsWide(false)
    setIsBye(false)
    setIsLegBye(false)
    setError(null)
    setShowBatsmanSelector(false)
    setSelectedNewBatsman("")
  }

  const handleSelectNewBatsman = () => {
    if (!selectedNewBatsman) {
      setError("Please select a batsman")
      return
    }

    const updatedData = { ...matchData }

    // Find the index of the selected batsman in the batting order
    const newBatsmanIdx = updatedData.battingTeam.battingOrder.findIndex((id: string) => id === selectedNewBatsman)

    if (newBatsmanIdx === -1) {
      setError("Invalid batsman selection")
      return
    }

    // Replace the dismissed striker with the new batsman
    updatedData.strikerIdx = newBatsmanIdx

    setMatchData(updatedData)
    resetForm()
  }

  const handleDeliver = () => {
    setError(null)

    // Validation
    if (isWicket && !wicketType) {
      setError("Please select a wicket type")
      return
    }

    // Can't have wicket on free hit (except run out)
    if (matchData.nextBallIsFreeHit && isWicket && wicketType !== "Run Out") {
      setError("On free hit, only run out is allowed")
      return
    }

    // Can't have wide and no-ball together
    if (isWide && isNoBall) {
      setError("Cannot have both wide and no-ball")
      return
    }

    // Can't have bye/leg-bye with wide/no-ball
    if ((isBye || isLegBye) && (isWide || isNoBall)) {
      setError("Bye/Leg-bye cannot be with wide/no-ball")
      return
    }

    const updatedData = { ...matchData }

    // Calculate runs according to international cricket rules
    let batsmanRuns = 0  // Runs credited to batsman
    let extraRuns = 0    // Extra runs
    let totalRuns = 0    // Total runs added to team

    if (isWide) {
      // Wide: 1 penalty + any runs scored
      extraRuns = 1 + runs
      totalRuns = extraRuns
      batsmanRuns = 0
    } else if (isNoBall) {
      // No-ball: 1 penalty + runs scored (credited to batsman)
      extraRuns = 1
      batsmanRuns = runs
      totalRuns = extraRuns + batsmanRuns
    } else if (isBye || isLegBye) {
      // Bye/Leg-bye: Runs are extras, not credited to batsman
      extraRuns = runs
      totalRuns = extraRuns
      batsmanRuns = 0
    } else {
      // Normal delivery: runs credited to batsman
      batsmanRuns = runs
      totalRuns = batsmanRuns
    }

    // Get current players
    const strikerId = updatedData.battingTeam.battingOrder[updatedData.strikerIdx]
    const bowlerId = updatedData.bowlingTeam.bowlingOrder[updatedData.bowlerIdx]

    // Create delivery record
    const delivery = {
      ballNumber: updatedData.deliveries.length + 1,
      over: updatedData.currentOver,
      ball: updatedData.currentBall,
      batsmanId: strikerId,
      bowlerId: bowlerId,
      runs: batsmanRuns,
      totalRuns: totalRuns,
      extraRuns: extraRuns,
      isWicket,
      wicketType: isWicket ? wicketType : null,
      dismissedBatsmanId: isWicket ? strikerId : null,
      isNoBall,
      isWide,
      isBye,
      isLegBye,
      isFreeHit: matchData.nextBallIsFreeHit || false,
      timestamp: Date.now(),
    }

    updatedData.deliveries.push(delivery)

    // Update runs
    updatedData.runs += totalRuns
    updatedData.extras = (updatedData.extras || 0) + extraRuns

    // Determine if this is a legal delivery
    const isLegalDelivery = !isWide && !isNoBall

    // Handle wicket
    if (isWicket) {
      updatedData.wickets += 1

      // Check if team is all out (10 wickets)
      const teamSize = updatedData.battingTeam.battingOrder.length
      const isAllOut = updatedData.wickets >= 10 || updatedData.wickets >= teamSize - 1

      // If not all out, need to select next batsman
      if (!isAllOut) {
        setMatchData(updatedData)
        setShowBatsmanSelector(true)
        return
      }
    }

    // Strike rotation logic
    let shouldRotateStrike = false

    if (!isWicket) {
      // For legal deliveries, rotate on odd batsman runs
      if (isLegalDelivery && [1, 3, 5].includes(batsmanRuns)) {
        shouldRotateStrike = true
      }

      // For extras (wide/no-ball) with runs, rotate based on total runs scored
      if (!isLegalDelivery && (isWide || isNoBall)) {
        // For wide: if additional runs scored beyond the penalty (e.g., wide + 1 run = 2 total)
        // For no-ball: if runs scored by batsman are odd (e.g., no-ball + 1 run = odd)
        if (isWide) {
          // Wide: rotate if total runs (including penalty) are odd
          // Wide is 1 penalty + runs, so if runs > 1, check if runs-1 is odd
          if (runs > 0 && [1, 3, 5].includes(runs)) {
            shouldRotateStrike = true
          }
        } else if (isNoBall) {
          // No-ball: rotate if batsman runs are odd
          if ([1, 3, 5].includes(batsmanRuns)) {
            shouldRotateStrike = true
          }
        }
      }
    }

    // Ball counting and over management
    if (isLegalDelivery) {
      updatedData.currentBall += 1

      // Check if over is complete
      if (updatedData.currentBall === 6) {
        updatedData.currentBall = 0
        updatedData.currentOver += 1

        // Always rotate strike at end of over
        shouldRotateStrike = true

        // Change bowler (cycle through bowling order)
        updatedData.bowlerIdx = (updatedData.bowlerIdx + 1) % updatedData.bowlingTeam.bowlingOrder.length
      }
    }

    // Apply strike rotation
    if (shouldRotateStrike) {
      [updatedData.strikerIdx, updatedData.nonStrikerIdx] = [updatedData.nonStrikerIdx, updatedData.strikerIdx]
    }

    // Free hit logic
    if (isNoBall) {
      updatedData.nextBallIsFreeHit = true
    } else if (!isWide) {
      // Free hit is only for one delivery (unless another no-ball)
      updatedData.nextBallIsFreeHit = false
    }

    setMatchData(updatedData)
    resetForm()
  }

  if (!matchData) return null

  const ballsRemaining = matchData.overs * 6 - (matchData.currentOver * 6 + matchData.currentBall)
  const teamSize = matchData.battingTeam?.battingOrder?.length || 11
  const isAllOut = matchData.wickets >= 10 || matchData.wickets >= teamSize - 1
  const isInningOver = ballsRemaining <= 0 || isAllOut

  // Check if target achieved (second innings)
  const targetAchieved = matchData.currentInning === 2 &&
    matchData.innings?.inning1 &&
    matchData.runs > matchData.innings.inning1.runs

  const isMatchOver = isInningOver || targetAchieved

  // Get available batsmen (not currently batting and haven't batted yet)
  const getAvailableBatsmen = () => {
    if (!matchData.battingTeam) return []

    const currentBatsmen = [
      matchData.battingTeam.battingOrder[matchData.strikerIdx],
      matchData.battingTeam.battingOrder[matchData.nonStrikerIdx]
    ]

    // Get all players who have batted (appeared in deliveries as batsman)
    const battedPlayerIds = new Set<string>()
    matchData.deliveries?.forEach((d: any) => {
      if (d.batsmanId) battedPlayerIds.add(d.batsmanId)
    })

    return matchData.battingTeam.players.filter((player: any) => {
      const playerId = player.id
      return !currentBatsmen.includes(playerId) && !battedPlayerIds.has(playerId)
    })
  }

  const availableBatsmen = getAvailableBatsmen()

  return (
    <Card className="p-4 sticky top-6 bg-white border-2">
      <h3 className="font-bold mb-4 text-lg">Record Delivery</h3>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm mb-3 font-medium">
          {error}
        </div>
      )}

      {/* Batsman Selector Dialog */}
      {showBatsmanSelector && (
        <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded">
          <h4 className="font-bold text-lg mb-2 text-red-700">🏏 Wicket! Select Next Batsman</h4>
          <p className="text-sm text-gray-700 mb-3">A wicket has fallen. Please select the next batsman to come in.</p>

          <select
            value={selectedNewBatsman}
            onChange={(e) => setSelectedNewBatsman(e.target.value)}
            className="w-full p-2 border-2 border-yellow-400 rounded text-sm bg-white mb-3"
          >
            <option value="">Select next batsman...</option>
            {availableBatsmen.map((player: any) => (
              <option key={player.id} value={player.id}>
                #{player.jerseyNumber} {player.name}
              </option>
            ))}
          </select>

          <Button
            onClick={handleSelectNewBatsman}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            Confirm Batsman
          </Button>
        </div>
      )}

      {matchData.nextBallIsFreeHit && !showBatsmanSelector && (
        <div className="p-2 bg-yellow-100 text-yellow-800 rounded text-sm mb-3 font-semibold">
          ⚡ FREE HIT - Next delivery
        </div>
      )}

      {isMatchOver && !showBatsmanSelector && (
        <div className="p-3 bg-green-100 text-green-800 rounded text-sm mb-3 font-bold">
          {targetAchieved ? "🎉 TARGET ACHIEVED!" : "📊 INNINGS COMPLETE!"}
        </div>
      )}

      {!showBatsmanSelector && <div className="space-y-4">
        {/* Runs Section */}
        <div>
          <p className="text-sm font-semibold mb-2">Runs Scored</p>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3, 4, 6].map((r) => (
              <Button
                key={r}
                onClick={() => setRuns(r)}
                variant={runs === r ? "default" : "outline"}
                className={`${runs === r ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white hover:bg-gray-100"} ${r === 4 || r === 6 ? "font-bold" : ""}`}
                disabled={isMatchOver}
              >
                {r}
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {runs === 4 && "Four (Boundary)"}
            {runs === 6 && "Six (Maximum)"}
          </p>
        </div>

        {/* Extras Section */}
        <div className="border-t pt-3">
          <p className="text-sm font-semibold mb-2">Extras</p>
          <div className="grid grid-cols-2 gap-2">
            <label className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${isWide ? "bg-blue-100 border-blue-400" : "hover:bg-gray-50 border-gray-200"}`}>
              <input
                type="checkbox"
                checked={isWide}
                onChange={(e) => {
                  setIsWide(e.target.checked)
                  if (e.target.checked) {
                    setIsNoBall(false)
                    setIsBye(false)
                    setIsLegBye(false)
                    setRuns(1)
                  }
                }}
                className="w-4 h-4"
                disabled={isMatchOver}
              />
              <span className="text-sm font-medium">Wide</span>
            </label>

            <label className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${isNoBall ? "bg-orange-100 border-orange-400" : "hover:bg-gray-50 border-gray-200"}`}>
              <input
                type="checkbox"
                checked={isNoBall}
                onChange={(e) => {
                  setIsNoBall(e.target.checked)
                  if (e.target.checked) {
                    setIsWide(false)
                    setIsBye(false)
                    setIsLegBye(false)
                  }
                }}
                className="w-4 h-4"
                disabled={isMatchOver}
              />
              <span className="text-sm font-medium">No Ball</span>
            </label>

            <label className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${isBye ? "bg-purple-100 border-purple-400" : "hover:bg-gray-50 border-gray-200"}`}>
              <input
                type="checkbox"
                checked={isBye}
                onChange={(e) => {
                  setIsBye(e.target.checked)
                  if (e.target.checked) {
                    setIsNoBall(false)
                    setIsWide(false)
                    setIsLegBye(false)
                  }
                }}
                className="w-4 h-4"
                disabled={isMatchOver}
              />
              <span className="text-sm font-medium">Bye</span>
            </label>

            <label className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${isLegBye ? "bg-pink-100 border-pink-400" : "hover:bg-gray-50 border-gray-200"}`}>
              <input
                type="checkbox"
                checked={isLegBye}
                onChange={(e) => {
                  setIsLegBye(e.target.checked)
                  if (e.target.checked) {
                    setIsNoBall(false)
                    setIsWide(false)
                    setIsBye(false)
                  }
                }}
                className="w-4 h-4"
                disabled={isMatchOver}
              />
              <span className="text-sm font-medium">Leg Bye</span>
            </label>
          </div>
        </div>

        {/* Wicket Section */}
        <div className="border-t pt-3">
          <label className={`flex items-center gap-2 p-2 rounded cursor-pointer mb-2 border ${isWicket ? "bg-red-100 border-red-400" : "hover:bg-gray-50 border-gray-200"}`}>
            <input
              type="checkbox"
              checked={isWicket}
              onChange={(e) => {
                setIsWicket(e.target.checked)
                if (!e.target.checked) {
                  setWicketType("")
                }
              }}
              className="w-4 h-4"
              disabled={isMatchOver}
            />
            <span className="font-semibold text-sm">Wicket</span>
          </label>

          {isWicket && (
            <select
              value={wicketType}
              onChange={(e) => setWicketType(e.target.value)}
              className="w-full p-2 border rounded text-sm bg-white"
            >
              <option value="">Select wicket type...</option>
              {wicketTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        </div>

        <Button
          onClick={handleDeliver}
          disabled={isMatchOver}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 disabled:opacity-50"
        >
          {isMatchOver ? "Innings Over" : "Record Ball"}
        </Button>

        {/* Match Status */}
        <div className="text-xs space-y-1 pt-2 border-t bg-gray-50 p-2 rounded">
          <div className="flex justify-between">
            <span className="text-gray-600">Innings:</span>
            <span className="font-bold">{matchData.currentInning}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Over:</span>
            <span className="font-bold">
              {matchData.currentOver}.{matchData.currentBall}/{matchData.overs}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Balls Left:</span>
            <span className="font-bold">{Math.max(0, ballsRemaining)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Wickets:</span>
            <span className="font-bold">{matchData.wickets}/10</span>
          </div>
          {matchData.currentInning === 2 && matchData.innings?.inning1 && (
            <>
              <div className="flex justify-between border-t pt-1 mt-1">
                <span className="text-gray-600">Target:</span>
                <span className="font-bold">{matchData.innings.inning1.runs + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Required:</span>
                <span className="font-bold text-red-600">
                  {Math.max(0, matchData.innings.inning1.runs + 1 - matchData.runs)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>}
    </Card>
  )
}
