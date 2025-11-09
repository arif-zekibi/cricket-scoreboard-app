"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlayerStatsProps {
  matchData: any
}

export function PlayerStats({ matchData }: PlayerStatsProps) {
  if (!matchData) return null

  const getBattingStats = () => {
    const stats: any[] = []

    if (!matchData.battingTeam?.battingOrder) return stats

    matchData.battingTeam.battingOrder.forEach((playerId: string) => {
      const player = matchData.battingTeam.players.find((p: any) => p.id === playerId)
      const deliveries = matchData.deliveries.filter((d: any) => d.batsmanId === playerId)
      const legalDeliveries = deliveries.filter((d: any) => !d.isWide && !d.isNoBall)

      const runsScored = deliveries.reduce((sum: number, d: any) => sum + (d.runs || 0), 0)
      const ballsFaced = legalDeliveries.length
      const fours = deliveries.filter((d: any) => d.runs === 4).length
      const sixes = deliveries.filter((d: any) => d.runs === 6).length
      const wicketDelivery = deliveries.find((d: any) => d.isWicket && d.dismissedBatsmanId === playerId)
      const strikeRate = ballsFaced > 0 ? ((runsScored / ballsFaced) * 100).toFixed(1) : "0.0"

      stats.push({
        player,
        runs: runsScored,
        balls: ballsFaced,
        fours,
        sixes,
        strikeRate,
        out: wicketDelivery ? wicketDelivery.wicketType : null,
      })
    })

    return stats
  }

  const getBowlingStats = () => {
    const bowlingStatsMap: { [key: string]: any } = {}

    // Initialize stats for all bowlers
    if (matchData.bowlingTeam?.bowlingOrder) {
      matchData.bowlingTeam.bowlingOrder.forEach((bowlerId: string) => {
        bowlingStatsMap[bowlerId] = {
          balls: 0,
          runs: 0,
          wickets: 0,
          maidens: 0,
        }
      })
    }

    // Calculate stats from deliveries
    matchData.deliveries.forEach((delivery: any) => {
      const bowlerId = delivery.bowlerId
      if (!bowlingStatsMap[bowlerId]) {
        bowlingStatsMap[bowlerId] = {
          balls: 0,
          runs: 0,
          wickets: 0,
          maidens: 0,
        }
      }

      // Only count legal deliveries
      if (!delivery.isWide && !delivery.isNoBall) {
        bowlingStatsMap[bowlerId].balls += 1
      }

      bowlingStatsMap[bowlerId].runs += delivery.totalRuns || 0
      if (delivery.isWicket) {
        bowlingStatsMap[bowlerId].wickets += 1
      }
    })

    // Convert to array with calculated values
    const stats: any[] = []

    if (matchData.bowlingTeam?.bowlingOrder) {
      matchData.bowlingTeam.bowlingOrder.forEach((bowlerId: string) => {
        const player = matchData.bowlingTeam.players.find((p: any) => p.id === bowlerId)
        const bowlerStats = bowlingStatsMap[bowlerId] || { balls: 0, runs: 0, wickets: 0, maidens: 0 }

        const overs = Math.floor(bowlerStats.balls / 6)
        const balls = bowlerStats.balls % 6
        const totalOvers = overs + balls / 6
        const economy = totalOvers > 0 ? (bowlerStats.runs / totalOvers).toFixed(2) : "0.00"

        stats.push({
          player,
          overs: `${overs}.${balls}`,
          runs: bowlerStats.runs,
          wickets: bowlerStats.wickets,
          economy,
        })
      })
    }

    return stats
  }

  const battingStats = getBattingStats()
  const bowlingStats = getBowlingStats()

  return (
    <Card className="p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">
        {matchData.battingTeam?.name} - Innings {matchData.currentInning} Statistics
      </h2>

      <Tabs defaultValue="batting">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="batting">Batting ({matchData.battingTeam?.name})</TabsTrigger>
          <TabsTrigger value="bowling">Bowling ({matchData.bowlingTeam?.name})</TabsTrigger>
        </TabsList>

        <TabsContent value="batting" className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Player</th>
                  <th className="px-4 py-3 text-center font-semibold">Runs</th>
                  <th className="px-4 py-3 text-center font-semibold">Balls</th>
                  <th className="px-4 py-3 text-center font-semibold">4s</th>
                  <th className="px-4 py-3 text-center font-semibold">6s</th>
                  <th className="px-4 py-3 text-center font-semibold">SR</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {battingStats.length > 0 ? (
                  battingStats.map((stat: any, idx: number) => (
                    <tr key={stat.player?.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        <div>
                          <span className="text-gray-500 text-xs">#{stat.player?.jerseyNumber}</span>{" "}
                          {stat.player?.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-lg">{stat.runs}</td>
                      <td className="px-4 py-3 text-center">{stat.balls}</td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">{stat.fours}</td>
                      <td className="px-4 py-3 text-center text-purple-600 font-semibold">{stat.sixes}</td>
                      <td className="px-4 py-3 text-center text-gray-600 font-medium">{stat.strikeRate}</td>
                      <td className="px-4 py-3 text-center">
                        {stat.out ? (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                            {stat.out}
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                            Not Out
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No batting statistics available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Batting Summary */}
          {battingStats.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">Total Runs</p>
                <p className="text-2xl font-bold">{matchData.runs}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Wickets</p>
                <p className="text-2xl font-bold">{matchData.wickets}/10</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Extras</p>
                <p className="text-2xl font-bold">{matchData.extras || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Overs</p>
                <p className="text-2xl font-bold">
                  {matchData.currentOver}.{matchData.currentBall}
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bowling" className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-orange-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Bowler</th>
                  <th className="px-4 py-3 text-center font-semibold">Overs</th>
                  <th className="px-4 py-3 text-center font-semibold">Maidens</th>
                  <th className="px-4 py-3 text-center font-semibold">Runs</th>
                  <th className="px-4 py-3 text-center font-semibold">Wickets</th>
                  <th className="px-4 py-3 text-center font-semibold">Economy</th>
                </tr>
              </thead>
              <tbody>
                {bowlingStats.length > 0 ? (
                  bowlingStats.map((stat: any, idx: number) => (
                    <tr key={stat.player?.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        <div>
                          <span className="text-gray-500 text-xs">#{stat.player?.jerseyNumber}</span>{" "}
                          {stat.player?.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{stat.overs}</td>
                      <td className="px-4 py-3 text-center">{stat.maidens || 0}</td>
                      <td className="px-4 py-3 text-center font-bold">{stat.runs}</td>
                      <td className="px-4 py-3 text-center font-bold text-red-600">{stat.wickets}</td>
                      <td className="px-4 py-3 text-center text-gray-600 font-medium">{stat.economy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No bowling statistics available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
