"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MatchSummaryProps {
  matchData: any
  onBackToHistory: () => void
}

export function MatchSummary({ matchData, onBackToHistory }: MatchSummaryProps) {
  if (!matchData || !matchData.innings?.inning1 || !matchData.innings?.inning2) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-6 bg-red-50">
          <p className="text-red-700">Match data incomplete. Cannot display summary.</p>
          <Button onClick={onBackToHistory} className="mt-4">
            Back to History
          </Button>
        </Card>
      </div>
    )
  }

  const inning1 = matchData.innings.inning1
  const inning2 = matchData.innings.inning2

  // Determine winner
  const determineWinner = () => {
    if (inning2.runs > inning1.runs) {
      return {
        winner: matchData.team2.name,
        margin: `by ${10 - inning2.wickets} wickets`,
        description: `${matchData.team2.name} chased down the target successfully`,
      }
    } else {
      return {
        winner: matchData.team1.name,
        margin: `by ${inning1.runs - inning2.runs} runs`,
        description: `${matchData.team1.name} defended their total`,
      }
    }
  }

  // Calculate batting stats for an innings
  const calculateBattingStats = (deliveries: any[], battingOrder: string[], players: any[]) => {
    const stats: any[] = []

    battingOrder.forEach((playerId: string) => {
      const player = players.find((p: any) => p.id === playerId)
      const playerDeliveries = deliveries.filter((d: any) => d.batsmanId === playerId)
      const legalDeliveries = playerDeliveries.filter((d: any) => !d.isWide && !d.isNoBall)

      const runs = playerDeliveries.reduce((sum: number, d: any) => sum + (d.runs || 0), 0)
      const balls = legalDeliveries.length
      const fours = playerDeliveries.filter((d: any) => d.runs === 4).length
      const sixes = playerDeliveries.filter((d: any) => d.runs === 6).length
      const strikeRate = balls > 0 ? ((runs / balls) * 100).toFixed(1) : "0.0"
      const wicketDelivery = playerDeliveries.find((d: any) => d.isWicket && d.dismissedBatsmanId === playerId)

      if (balls > 0 || wicketDelivery) {
        stats.push({
          player,
          runs,
          balls,
          fours,
          sixes,
          strikeRate: parseFloat(strikeRate),
          out: wicketDelivery ? wicketDelivery.wicketType : null,
        })
      }
    })

    return stats
  }

  // Calculate bowling stats for an innings
  const calculateBowlingStats = (deliveries: any[], bowlingOrder: string[], players: any[]) => {
    const statsMap: { [key: string]: any } = {}

    bowlingOrder.forEach((bowlerId: string) => {
      statsMap[bowlerId] = { balls: 0, runs: 0, wickets: 0 }
    })

    deliveries.forEach((delivery: any) => {
      const bowlerId = delivery.bowlerId
      if (!statsMap[bowlerId]) {
        statsMap[bowlerId] = { balls: 0, runs: 0, wickets: 0 }
      }

      if (!delivery.isWide && !delivery.isNoBall) {
        statsMap[bowlerId].balls += 1
      }
      statsMap[bowlerId].runs += delivery.totalRuns || 0
      if (delivery.isWicket) {
        statsMap[bowlerId].wickets += 1
      }
    })

    const stats: any[] = []
    bowlingOrder.forEach((bowlerId: string) => {
      const player = players.find((p: any) => p.id === bowlerId)
      const bowlerStats = statsMap[bowlerId]

      if (bowlerStats.balls > 0) {
        const overs = Math.floor(bowlerStats.balls / 6)
        const balls = bowlerStats.balls % 6
        const totalOvers = overs + balls / 6
        const economy = totalOvers > 0 ? (bowlerStats.runs / totalOvers).toFixed(2) : "0.00"

        stats.push({
          player,
          overs: `${overs}.${balls}`,
          runs: bowlerStats.runs,
          wickets: bowlerStats.wickets,
          economy: parseFloat(economy),
        })
      }
    })

    return stats
  }

  // Get best performers
  const getBestBatsman = (stats: any[]) => {
    if (stats.length === 0) return null
    return stats.reduce((best, current) => (current.runs > best.runs ? current : best))
  }

  const getBestBowler = (stats: any[]) => {
    if (stats.length === 0) return null
    return stats.reduce((best, current) => {
      if (current.wickets > best.wickets) return current
      if (current.wickets === best.wickets && current.economy < best.economy) return current
      return best
    })
  }

  // Calculate all stats
  const inning1BattingStats = calculateBattingStats(inning1.deliveries, inning1.battingTeam.battingOrder, inning1.battingTeam.players)
  const inning1BowlingStats = calculateBowlingStats(inning1.deliveries, inning1.bowlingTeam.bowlingOrder, inning1.bowlingTeam.players)

  const inning2BattingStats = calculateBattingStats(inning2.deliveries, inning2.battingTeam.battingOrder, inning2.battingTeam.players)
  const inning2BowlingStats = calculateBowlingStats(inning2.deliveries, inning2.bowlingTeam.bowlingOrder, inning2.bowlingTeam.players)

  const allBattingStats = [...inning1BattingStats, ...inning2BattingStats]
  const allBowlingStats = [...inning1BowlingStats, ...inning2BowlingStats]

  const bestBatsmanInning1 = getBestBatsman(inning1BattingStats)
  const bestBatsmanInning2 = getBestBatsman(inning2BattingStats)
  const bestBatsmanOverall = getBestBatsman(allBattingStats)

  const bestBowlerInning1 = getBestBowler(inning1BowlingStats)
  const bestBowlerInning2 = getBestBowler(inning2BowlingStats)
  const bestBowlerOverall = getBestBowler(allBowlingStats)

  const result = determineWinner()

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Match Header */}
      <Card className="p-8 bg-gradient-to-r from-green-600 to-green-800 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">🏆 MATCH COMPLETE 🏆</h1>
        <p className="text-2xl font-semibold mb-2">{result.winner} Won</p>
        <p className="text-xl opacity-90">{result.margin}</p>
        <p className="text-sm opacity-75 mt-2">{matchData.matchType} Match</p>
      </Card>

      {/* Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Innings 1 */}
        <Card className="p-6 bg-blue-50 border-2 border-blue-400">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            Innings 1: {matchData.team1.name}
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded">
              <span className="text-gray-700 font-semibold">Score</span>
              <span className="text-3xl font-bold text-blue-700">
                {inning1.runs}/{inning1.wickets}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded">
              <span className="text-gray-700 font-semibold">Overs</span>
              <span className="text-xl font-bold">
                {inning1.overs}.{inning1.balls || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded">
              <span className="text-gray-700 font-semibold">Run Rate</span>
              <span className="text-xl font-bold">
                {((inning1.runs / ((inning1.overs * 6 + (inning1.balls || 0)) / 6)) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Innings 2 */}
        <Card className="p-6 bg-amber-50 border-2 border-amber-400">
          <h2 className="text-2xl font-bold mb-4 text-amber-900">
            Innings 2: {matchData.team2.name}
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded">
              <span className="text-gray-700 font-semibold">Score</span>
              <span className="text-3xl font-bold text-amber-700">
                {inning2.runs}/{inning2.wickets}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded">
              <span className="text-gray-700 font-semibold">Overs</span>
              <span className="text-xl font-bold">
                {inning2.overs}.{inning2.balls || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded">
              <span className="text-gray-700 font-semibold">Run Rate</span>
              <span className="text-xl font-bold">
                {((inning2.runs / ((inning2.overs * 6 + (inning2.balls || 0)) / 6)) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Best Performers */}
      <Card className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-50">
        <h2 className="text-2xl font-bold mb-4 text-yellow-900">🌟 Best Performers</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Batsman Overall */}
          {bestBatsmanOverall && (
            <div className="p-4 bg-white rounded-lg border-2 border-yellow-400">
              <p className="text-xs font-semibold text-gray-600 mb-1">PLAYER OF THE MATCH</p>
              <p className="text-lg font-bold text-yellow-700">#{bestBatsmanOverall.player.jerseyNumber} {bestBatsmanOverall.player.name}</p>
              <p className="text-2xl font-bold text-yellow-900 mt-2">
                {bestBatsmanOverall.runs} ({bestBatsmanOverall.balls})
              </p>
              <p className="text-sm text-gray-600">SR: {bestBatsmanOverall.strikeRate}</p>
            </div>
          )}

          {/* Best Bowler Overall */}
          {bestBowlerOverall && (
            <div className="p-4 bg-white rounded-lg border-2 border-orange-400">
              <p className="text-xs font-semibold text-gray-600 mb-1">BEST BOWLER</p>
              <p className="text-lg font-bold text-orange-700">#{bestBowlerOverall.player.jerseyNumber} {bestBowlerOverall.player.name}</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                {bestBowlerOverall.wickets}/{bestBowlerOverall.runs}
              </p>
              <p className="text-sm text-gray-600">Econ: {bestBowlerOverall.economy}</p>
            </div>
          )}

          {/* Most Valuable */}
          <div className="p-4 bg-white rounded-lg border-2 border-green-400">
            <p className="text-xs font-semibold text-gray-600 mb-1">MATCH RESULT</p>
            <p className="text-lg font-bold text-green-700">{result.winner}</p>
            <p className="text-xl font-bold text-green-900 mt-2">{result.margin}</p>
            <p className="text-sm text-gray-600">{result.description}</p>
          </div>
        </div>
      </Card>

      {/* Detailed Statistics */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Detailed Statistics</h2>

        <Tabs defaultValue="inning1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inning1">Innings 1 ({matchData.team1.name})</TabsTrigger>
            <TabsTrigger value="inning2">Innings 2 ({matchData.team2.name})</TabsTrigger>
          </TabsList>

          <TabsContent value="inning1" className="mt-4">
            {/* Innings 1 Batting */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Batting ({matchData.team1.name})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Player</th>
                      <th className="px-4 py-2 text-center">R</th>
                      <th className="px-4 py-2 text-center">B</th>
                      <th className="px-4 py-2 text-center">4s</th>
                      <th className="px-4 py-2 text-center">6s</th>
                      <th className="px-4 py-2 text-center">SR</th>
                      <th className="px-4 py-2 text-center">Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inning1BattingStats.map((stat, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">#{stat.player.jerseyNumber} {stat.player.name}</td>
                        <td className="px-4 py-2 text-center font-bold">{stat.runs}</td>
                        <td className="px-4 py-2 text-center">{stat.balls}</td>
                        <td className="px-4 py-2 text-center">{stat.fours}</td>
                        <td className="px-4 py-2 text-center">{stat.sixes}</td>
                        <td className="px-4 py-2 text-center">{stat.strikeRate}</td>
                        <td className="px-4 py-2 text-center text-xs">
                          {stat.out ? <span className="text-red-600">{stat.out}</span> : <span className="text-green-600">Not Out</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Innings 1 Bowling */}
            <div>
              <h3 className="font-bold text-lg mb-3">Bowling ({matchData.team2.name})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Bowler</th>
                      <th className="px-4 py-2 text-center">O</th>
                      <th className="px-4 py-2 text-center">R</th>
                      <th className="px-4 py-2 text-center">W</th>
                      <th className="px-4 py-2 text-center">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inning1BowlingStats.map((stat, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">#{stat.player.jerseyNumber} {stat.player.name}</td>
                        <td className="px-4 py-2 text-center">{stat.overs}</td>
                        <td className="px-4 py-2 text-center">{stat.runs}</td>
                        <td className="px-4 py-2 text-center font-bold text-red-600">{stat.wickets}</td>
                        <td className="px-4 py-2 text-center">{stat.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inning2" className="mt-4">
            {/* Innings 2 Batting */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Batting ({matchData.team2.name})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Player</th>
                      <th className="px-4 py-2 text-center">R</th>
                      <th className="px-4 py-2 text-center">B</th>
                      <th className="px-4 py-2 text-center">4s</th>
                      <th className="px-4 py-2 text-center">6s</th>
                      <th className="px-4 py-2 text-center">SR</th>
                      <th className="px-4 py-2 text-center">Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inning2BattingStats.map((stat, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">#{stat.player.jerseyNumber} {stat.player.name}</td>
                        <td className="px-4 py-2 text-center font-bold">{stat.runs}</td>
                        <td className="px-4 py-2 text-center">{stat.balls}</td>
                        <td className="px-4 py-2 text-center">{stat.fours}</td>
                        <td className="px-4 py-2 text-center">{stat.sixes}</td>
                        <td className="px-4 py-2 text-center">{stat.strikeRate}</td>
                        <td className="px-4 py-2 text-center text-xs">
                          {stat.out ? <span className="text-red-600">{stat.out}</span> : <span className="text-green-600">Not Out</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Innings 2 Bowling */}
            <div>
              <h3 className="font-bold text-lg mb-3">Bowling ({matchData.team1.name})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Bowler</th>
                      <th className="px-4 py-2 text-center">O</th>
                      <th className="px-4 py-2 text-center">R</th>
                      <th className="px-4 py-2 text-center">W</th>
                      <th className="px-4 py-2 text-center">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inning2BowlingStats.map((stat, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">#{stat.player.jerseyNumber} {stat.player.name}</td>
                        <td className="px-4 py-2 text-center">{stat.overs}</td>
                        <td className="px-4 py-2 text-center">{stat.runs}</td>
                        <td className="px-4 py-2 text-center font-bold text-red-600">{stat.wickets}</td>
                        <td className="px-4 py-2 text-center">{stat.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <Button onClick={onBackToHistory} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg">
        Back to Match History
      </Button>
    </div>
  )
}
