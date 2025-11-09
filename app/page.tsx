"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { TeamConfig } from "@/components/team-config"
import { LiveScoreboard } from "@/components/live-scoreboard"
import { DeliveryInput } from "@/components/delivery-input"
import { MatchControls } from "@/components/match-controls"
import { PlayerStats } from "@/components/player-stats"
import { MatchHistory } from "@/components/match-history"
import { saveMatch } from "@/lib/storage"
import { InningConfig } from "@/components/inning-config"
import { MatchSummary } from "@/components/match-summary"

export default function Home() {
  const [view, setView] = useState<"history" | "setup" | "match" | "inning" | "summary">("history")
  const [matchData, setMatchData] = useState<any>(null)
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null)

  useEffect(() => {
    if (matchData && view === "match") {
      const timer = setTimeout(() => {
        const matchId = saveMatch(matchData, currentMatchId)
        setCurrentMatchId(matchId)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [matchData, view, currentMatchId])

  const handleMatchSetup = (data: any) => {
    const initialMatchData = {
      id: `match-${Date.now()}`,
      timestamp: data.timestamp,
      matchType: data.matchType,
      overs: data.overs,
      team1: data.team1,
      team2: data.team2,
      currentInning: 1,
      innings: {
        inning1: null,
        inning2: null,
      },
      status: "setup",
    }
    setMatchData(initialMatchData)
    setCurrentMatchId(null)
    setView("inning")
  }

  const handleLoadMatch = (loadedData: any) => {
    setMatchData(loadedData.matchData || loadedData)
    setCurrentMatchId(loadedData.id || null)
    const currentInning = loadedData.matchData?.currentInning || loadedData.currentInning
    if (currentInning === 2) {
      setView("match")
    } else {
      setView("inning")
    }
  }

  const handleBackToHistory = () => {
    setMatchData(null)
    setCurrentMatchId(null)
    setView("history")
  }

  const handleNewMatch = () => {
    setMatchData(null)
    setCurrentMatchId(null)
    setView("setup")
  }

  const handleInningStart = () => {
    setView("match")
  }

  const handleInningComplete = () => {
    if (matchData.currentInning === 1) {
      // Save first innings data
      const updatedData = {
        ...matchData,
        innings: {
          ...matchData.innings,
          inning1: {
            battingTeam: matchData.battingTeam,
            bowlingTeam: matchData.bowlingTeam,
            runs: matchData.runs,
            wickets: matchData.wickets,
            overs: matchData.currentOver,
            balls: matchData.currentBall,
            deliveries: matchData.deliveries,
          },
        },
        currentInning: 2,
      }
      setMatchData(updatedData)
      setView("inning")
    } else if (matchData.currentInning === 2) {
      // Save second innings data and go to summary
      const updatedData = {
        ...matchData,
        innings: {
          ...matchData.innings,
          inning2: {
            battingTeam: matchData.battingTeam,
            bowlingTeam: matchData.bowlingTeam,
            runs: matchData.runs,
            wickets: matchData.wickets,
            overs: matchData.currentOver,
            balls: matchData.currentBall,
            deliveries: matchData.deliveries,
          },
        },
        status: "completed",
      }
      setMatchData(updatedData)
      setView("summary")
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <MainNav currentView={view} onNavigate={(newView) => setView(newView)} onBackToSetup={handleBackToHistory} />

      {view === "history" ? (
        <MatchHistory onLoadMatch={handleLoadMatch} onNewMatch={handleNewMatch} />
      ) : view === "setup" ? (
        <TeamConfig onMatchStart={handleMatchSetup} />
      ) : view === "inning" ? (
        <InningConfig matchData={matchData} setMatchData={setMatchData} onStart={handleInningStart} />
      ) : view === "summary" ? (
        <MatchSummary matchData={matchData} onBackToHistory={handleBackToHistory} />
      ) : matchData ? (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Scoreboard */}
            <div className="lg:col-span-2">
              <LiveScoreboard matchData={matchData} />
            </div>
            {/* Delivery Input */}
            <div className="lg:col-span-1">
              <DeliveryInput matchData={matchData} setMatchData={setMatchData} />
            </div>
            {/* Match Controls */}
            <div className="lg:col-span-1">
              <MatchControls
                matchData={matchData}
                setMatchData={setMatchData}
                onInningComplete={handleInningComplete}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-4">
            <PlayerStats matchData={matchData} />
          </div>
        </div>
      ) : null}
    </main>
  )
}
