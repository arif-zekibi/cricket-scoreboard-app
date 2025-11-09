"use client"

import { Card } from "@/components/ui/card"

interface LiveScoreboardProps {
  matchData: any
}

export function LiveScoreboard({ matchData }: LiveScoreboardProps) {
  if (!matchData) return null

  // Calculate batsman statistics
  const calculateBatsmanStats = (batsmanId: string) => {
    const deliveries = matchData.deliveries.filter((d: any) => d.batsmanId === batsmanId)
    const legalDeliveries = deliveries.filter((d: any) => !d.isWide && !d.isNoBall)

    return {
      runs: deliveries.reduce((sum: number, d: any) => sum + (d.runs || 0), 0),
      balls: legalDeliveries.length,
      fours: deliveries.filter((d: any) => d.runs === 4).length,
      sixes: deliveries.filter((d: any) => d.runs === 6).length,
    }
  }

  // Calculate bowler statistics
  const calculateBowlerStats = (bowlerId: string) => {
    const deliveries = matchData.deliveries.filter((d: any) => d.bowlerId === bowlerId)
    const legalDeliveries = deliveries.filter((d: any) => !d.isWide && !d.isNoBall)
    const totalBalls = legalDeliveries.length
    const overs = Math.floor(totalBalls / 6)
    const balls = totalBalls % 6

    return {
      overs: `${overs}.${balls}`,
      runs: deliveries.reduce((sum: number, d: any) => sum + (d.totalRuns || 0), 0),
      wickets: deliveries.filter((d: any) => d.isWicket).length,
      maidens: 0, // Calculate if needed
    }
  }

  // Get current players
  const strikerId = matchData.battingTeam?.battingOrder?.[matchData.strikerIdx]
  const nonStrikerId = matchData.battingTeam?.battingOrder?.[matchData.nonStrikerIdx]
  const bowlerId = matchData.bowlingTeam?.bowlingOrder?.[matchData.bowlerIdx]

  const strikerPlayer = matchData.battingTeam?.players?.find((p: any) => p.id === strikerId)
  const nonStrikerPlayer = matchData.battingTeam?.players?.find((p: any) => p.id === nonStrikerId)
  const bowlerPlayer = matchData.bowlingTeam?.players?.find((p: any) => p.id === bowlerId)

  const strikerStats = strikerId ? calculateBatsmanStats(strikerId) : { runs: 0, balls: 0, fours: 0, sixes: 0 }
  const nonStrikerStats = nonStrikerId
    ? calculateBatsmanStats(nonStrikerId)
    : { runs: 0, balls: 0, fours: 0, sixes: 0 }
  const bowlerStats = bowlerId ? calculateBowlerStats(bowlerId) : { overs: "0.0", runs: 0, wickets: 0 }

  // Current over deliveries
  const currentOverDeliveries = matchData.deliveries.filter((d: any) => d.over === matchData.currentOver)
  const currentOverRuns = currentOverDeliveries.reduce((sum: number, d: any) => sum + (d.totalRuns || 0), 0)
  const currentOverWickets = currentOverDeliveries.filter((d: any) => d.isWicket).length

  // Calculate run rate and required run rate
  const ballsFaced = matchData.currentOver * 6 + matchData.currentBall
  const currentRunRate = ballsFaced > 0 ? ((matchData.runs / ballsFaced) * 6).toFixed(2) : "0.00"

  let requiredRunRate = null
  if (matchData.currentInning === 2 && matchData.innings?.inning1) {
    const ballsRemaining = matchData.overs * 6 - ballsFaced
    const runsRequired = matchData.innings.inning1.runs + 1 - matchData.runs
    requiredRunRate = ballsRemaining > 0 ? ((runsRequired / ballsRemaining) * 6).toFixed(2) : "0.00"
  }

  // Recent deliveries (last 12 balls)
  const recentDeliveries = matchData.deliveries.slice(-12)

  return (
    <div className="space-y-4">
      {/* Main Score */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="mb-3">
          <p className="text-sm opacity-90">
            {matchData.battingTeam?.name} vs {matchData.bowlingTeam?.name}
          </p>
          <p className="text-xs opacity-75">
            Innings {matchData.currentInning} • {matchData.matchType}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm opacity-90">Score</p>
            <p className="text-4xl font-bold">
              {matchData.runs}/{matchData.wickets}
            </p>
            <p className="text-xs opacity-75">
              ({matchData.currentOver}.{matchData.currentBall} ov)
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Run Rate</p>
            <p className="text-3xl font-bold">{currentRunRate}</p>
            <p className="text-xs opacity-75">Current</p>
          </div>
          {requiredRunRate && (
            <>
              <div>
                <p className="text-sm opacity-90">Required</p>
                <p className="text-3xl font-bold">
                  {Math.max(0, matchData.innings.inning1.runs + 1 - matchData.runs)}
                </p>
                <p className="text-xs opacity-75">runs</p>
              </div>
              <div>
                <p className="text-sm opacity-90">RRR</p>
                <p className="text-3xl font-bold">{requiredRunRate}</p>
                <p className="text-xs opacity-75">Required Rate</p>
              </div>
            </>
          )}
          {!requiredRunRate && (
            <div className="col-span-2">
              <p className="text-sm opacity-90">Extras</p>
              <p className="text-3xl font-bold">{matchData.extras || 0}</p>
              <p className="text-xs opacity-75">Wides, No-balls, Byes</p>
            </div>
          )}
        </div>
      </Card>

      {/* Batsmen */}
      <Card className="p-4">
        <h3 className="font-bold mb-3">Batsmen</h3>
        <div className="space-y-3">
          {strikerPlayer && (
            <div className="p-3 bg-green-100 border-l-4 border-green-600 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-green-700 font-semibold">★ STRIKER</p>
                  <p className="font-bold">
                    #{strikerPlayer.jerseyNumber} {strikerPlayer.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-700">{strikerStats.runs}</p>
                  <p className="text-xs text-gray-600">({strikerStats.balls}b)</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">SR:</span>{" "}
                  <span className="font-bold">
                    {strikerStats.balls > 0 ? ((strikerStats.runs / strikerStats.balls) * 100).toFixed(1) : "0.0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">4s:</span> <span className="font-bold">{strikerStats.fours}</span>
                </div>
                <div>
                  <span className="text-gray-600">6s:</span> <span className="font-bold">{strikerStats.sixes}</span>
                </div>
              </div>
            </div>
          )}

          {nonStrikerPlayer && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-blue-700 font-semibold">NON-STRIKER</p>
                  <p className="font-bold">
                    #{nonStrikerPlayer.jerseyNumber} {nonStrikerPlayer.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700">{nonStrikerStats.runs}</p>
                  <p className="text-xs text-gray-600">({nonStrikerStats.balls}b)</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">SR:</span>{" "}
                  <span className="font-bold">
                    {nonStrikerStats.balls > 0
                      ? ((nonStrikerStats.runs / nonStrikerStats.balls) * 100).toFixed(1)
                      : "0.0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">4s:</span> <span className="font-bold">{nonStrikerStats.fours}</span>
                </div>
                <div>
                  <span className="text-gray-600">6s:</span> <span className="font-bold">{nonStrikerStats.sixes}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bowler */}
      {bowlerPlayer && (
        <Card className="p-4">
          <h3 className="font-bold mb-3">Current Bowler</h3>
          <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-orange-700 font-semibold">BOWLING</p>
                <p className="font-bold">
                  #{bowlerPlayer.jerseyNumber} {bowlerPlayer.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-700">
                  {currentOverWickets}-{currentOverRuns}
                </p>
                <p className="text-xs text-gray-600">this over</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Overs:</span> <span className="font-bold">{bowlerStats.overs}</span>
              </div>
              <div>
                <span className="text-gray-600">Runs:</span> <span className="font-bold">{bowlerStats.runs}</span>
              </div>
              <div>
                <span className="text-gray-600">Wkts:</span> <span className="font-bold">{bowlerStats.wickets}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Deliveries */}
      {recentDeliveries.length > 0 && (
        <Card className="p-4">
          <h3 className="font-bold mb-3">Recent Deliveries</h3>
          <div className="flex flex-wrap gap-2">
            {recentDeliveries.map((delivery: any, idx: number) => {
              let displayText = delivery.totalRuns || "0"
              let bgColor = "bg-gray-200"

              if (delivery.isWicket) {
                displayText = "W"
                bgColor = "bg-red-500 text-white"
              } else if (delivery.totalRuns === 6) {
                bgColor = "bg-purple-500 text-white"
              } else if (delivery.totalRuns === 4) {
                bgColor = "bg-green-500 text-white"
              } else if (delivery.isWide) {
                displayText = `WD${delivery.totalRuns > 1 ? delivery.totalRuns : ""}`
                bgColor = "bg-blue-400 text-white"
              } else if (delivery.isNoBall) {
                displayText = `NB${delivery.totalRuns > 1 ? delivery.totalRuns : ""}`
                bgColor = "bg-orange-400 text-white"
              } else if (delivery.isBye || delivery.isLegBye) {
                displayText = `${delivery.isBye ? "B" : "LB"}${delivery.totalRuns}`
                bgColor = "bg-purple-300"
              }

              return (
                <div
                  key={idx}
                  className={`${bgColor} px-3 py-2 rounded-full font-bold text-sm min-w-[40px] text-center`}
                >
                  {displayText}
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
