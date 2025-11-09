"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveMatch } from "@/lib/storage"

interface MatchControlsProps {
  matchData: any
  setMatchData: (data: any) => void
  onInningComplete?: () => void
}

export function MatchControls({ matchData, setMatchData, onInningComplete }: MatchControlsProps) {
  if (!matchData) return null

  const handleUndo = () => {
    if (!matchData.deliveries || matchData.deliveries.length === 0) {
      alert("No deliveries to undo")
      return
    }

    const updatedData = { ...matchData }
    const lastDelivery = updatedData.deliveries.pop()

    // Reverse runs
    updatedData.runs -= lastDelivery.totalRuns
    updatedData.extras = (updatedData.extras || 0) - lastDelivery.extraRuns

    // Reverse wicket
    if (lastDelivery.isWicket) {
      updatedData.wickets -= 1
      // Note: We don't automatically restore batsman positions as it's complex
      // User can manually adjust if needed
    }

    // Recalculate ball and over
    const totalLegalBalls = updatedData.deliveries.filter(
      (d: any) => !d.isWide && !d.isNoBall
    ).length

    updatedData.currentBall = totalLegalBalls % 6
    updatedData.currentOver = Math.floor(totalLegalBalls / 6)

    // Reset free hit if last ball was no-ball
    if (lastDelivery.isNoBall) {
      updatedData.nextBallIsFreeHit = false
    }

    setMatchData(updatedData)
  }

  const handleRotateStrike = () => {
    const updatedData = { ...matchData }
    ;[updatedData.strikerIdx, updatedData.nonStrikerIdx] = [
      updatedData.nonStrikerIdx,
      updatedData.strikerIdx,
    ]
    setMatchData(updatedData)
  }

  const handleChangeBowler = () => {
    const updatedData = { ...matchData }
    updatedData.bowlerIdx =
      (updatedData.bowlerIdx + 1) % updatedData.bowlingTeam.bowlingOrder.length
    setMatchData(updatedData)
  }

  const handleSaveMatch = () => {
    const matchId = saveMatch(matchData)
    alert(`Match saved successfully!`)
  }

  const handleCompleteInning = () => {
    if (onInningComplete) {
      onInningComplete()
    }
  }

  // Get current striker
  const strikerPlayer = matchData.battingTeam?.players?.find(
    (p: any) => p.id === matchData.battingTeam.battingOrder[matchData.strikerIdx]
  )

  const nonStrikerPlayer = matchData.battingTeam?.players?.find(
    (p: any) => p.id === matchData.battingTeam.battingOrder[matchData.nonStrikerIdx]
  )

  const currentBowler = matchData.bowlingTeam?.players?.find(
    (p: any) => p.id === matchData.bowlingTeam.bowlingOrder[matchData.bowlerIdx]
  )

  // Check innings completion
  const ballsRemaining = matchData.overs * 6 - (matchData.currentOver * 6 + matchData.currentBall)
  const allOversComplete = ballsRemaining <= 0
  const allOut = matchData.wickets >= 10

  // Check target achieved for second innings
  const targetAchieved =
    matchData.currentInning === 2 &&
    matchData.innings?.inning1 &&
    matchData.runs > matchData.innings.inning1.runs

  const isInningComplete = allOversComplete || allOut || targetAchieved

  return (
    <div className="space-y-3 sticky top-6">
      {/* Current Players */}
      <Card className="p-4">
        <h3 className="font-bold mb-3">On Strike</h3>
        <div className="space-y-2">
          <div className="p-3 bg-green-100 rounded border-l-4 border-green-600">
            <p className="text-xs text-gray-600">Striker</p>
            <p className="font-bold">
              #{strikerPlayer?.jerseyNumber} {strikerPlayer?.name}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded border-l-4 border-blue-600">
            <p className="text-xs text-gray-600">Non-Striker</p>
            <p className="font-bold">
              #{nonStrikerPlayer?.jerseyNumber} {nonStrikerPlayer?.name}
            </p>
          </div>
        </div>
      </Card>

      {/* Current Bowler */}
      <Card className="p-4">
        <h3 className="font-bold mb-3">Bowling</h3>
        <div className="p-3 bg-orange-100 rounded border-l-4 border-orange-600">
          <p className="text-xs text-gray-600">Current Bowler</p>
          <p className="font-bold">
            #{currentBowler?.jerseyNumber} {currentBowler?.name}
          </p>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4">
        <h3 className="font-bold mb-3">Controls</h3>
        <div className="space-y-2">
          <Button
            onClick={handleRotateStrike}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
            size="sm"
          >
            Rotate Strike
          </Button>

          <Button
            onClick={handleChangeBowler}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium"
            size="sm"
          >
            Change Bowler
          </Button>

          <Button
            onClick={handleUndo}
            disabled={!matchData.deliveries || matchData.deliveries.length === 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium disabled:opacity-50"
            size="sm"
          >
            Undo Last Ball ({matchData.deliveries?.length || 0})
          </Button>

          <Button
            onClick={handleSaveMatch}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            size="sm"
          >
            Save Match
          </Button>

          {isInningComplete && (
            <Button
              onClick={handleCompleteInning}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3"
            >
              {matchData.currentInning === 1 ? "Start 2nd Innings" : "View Summary"}
            </Button>
          )}
        </div>
      </Card>

      {/* Match Status */}
      <Card className="p-4 bg-gray-50">
        <h3 className="font-bold mb-2 text-sm">Status</h3>
        <div className="space-y-1 text-xs">
          {allOversComplete && (
            <p className="text-green-700 font-semibold">✓ All overs completed</p>
          )}
          {allOut && <p className="text-red-700 font-semibold">✓ All out</p>}
          {targetAchieved && (
            <p className="text-blue-700 font-semibold">✓ Target achieved</p>
          )}
          {!isInningComplete && (
            <p className="text-gray-600">Innings in progress...</p>
          )}
        </div>
      </Card>
    </div>
  )
}
