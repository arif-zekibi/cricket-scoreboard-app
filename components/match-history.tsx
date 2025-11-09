"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getAllMatches, deleteMatch, exportMatches, importMatches, deleteAllMatches } from "@/lib/storage"

interface MatchHistoryProps {
  onLoadMatch: (matchData: any) => void
  onNewMatch: () => void
}

export function MatchHistory({ onLoadMatch, onNewMatch }: MatchHistoryProps) {
  const [matches, setMatches] = useState<any[]>([])
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importError, setImportError] = useState("")
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = () => {
    setMatches(getAllMatches())
  }

  const handleDelete = (matchId: string) => {
    if (confirm("Are you sure you want to delete this match?")) {
      deleteMatch(matchId)
      loadMatches()
    }
  }

  const handleExport = () => {
    const data = exportMatches()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cricket-matches-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (importMatches(content)) {
          setShowImportDialog(false)
          setImportError("")
          loadMatches()
        } else {
          setImportError("Invalid match data format")
        }
      } catch {
        setImportError("Error reading file")
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete ALL matches? This cannot be undone.")) {
      deleteAllMatches()
      loadMatches()
      setShowDeleteAllDialog(false)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Match History</h1>
        <div className="space-x-2">
          <Button onClick={onNewMatch} className="bg-blue-600 hover:bg-blue-700">
            New Match
          </Button>
          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
            Export All
          </Button>
          <Button onClick={() => setShowImportDialog(true)} className="bg-purple-600 hover:bg-purple-700">
            Import
          </Button>
          <Button onClick={() => setShowDeleteAllDialog(true)} className="bg-red-600 hover:bg-red-700">
            Delete All
          </Button>
        </div>
      </div>

      {showDeleteAllDialog && (
        <Card className="p-6 bg-red-50 border-2 border-red-300">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-red-700">Delete All Matches?</h3>
            <p className="text-sm text-red-600">
              This will permanently delete all stored matches. This action cannot be undone.
            </p>
            <div className="flex space-x-2">
              <Button onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700">
                Confirm Delete All
              </Button>
              <Button onClick={() => setShowDeleteAllDialog(false)} className="bg-gray-600 hover:bg-gray-700">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {showImportDialog && (
        <Card className="p-6 bg-yellow-50 border-2 border-yellow-300">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Import Match Data</h3>
            <input type="file" accept=".json" onChange={handleImportFile} className="block w-full" />
            {importError && <p className="text-red-600 text-sm">{importError}</p>}
            <Button onClick={() => setShowImportDialog(false)} className="bg-gray-600 hover:bg-gray-700">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {matches.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">No matches recorded yet. Create a new match to get started.</p>
          <Button onClick={onNewMatch} className="bg-blue-600 hover:bg-blue-700">
            Create First Match
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            // Calculate match details
            const inning1 = match.innings?.inning1
            const inning2 = match.innings?.inning2
            const isCompleted = match.status === "completed"

            // Determine winner and result
            let matchResult = null
            if (isCompleted && inning1 && inning2) {
              if (inning2.runs > inning1.runs) {
                matchResult = {
                  winner: match.team2Name,
                  margin: `by ${10 - inning2.wickets} wickets`,
                  color: "text-green-700"
                }
              } else {
                matchResult = {
                  winner: match.team1Name,
                  margin: `by ${inning1.runs - inning2.runs} runs`,
                  color: "text-green-700"
                }
              }
            }

            return (
              <Card key={match.id} className="p-4 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Match Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-gray-900">
                        {match.team1Name || "Team 1"} vs {match.team2Name || "Team 2"}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {isCompleted ? "COMPLETED" : "IN PROGRESS"}
                      </span>
                    </div>

                    {/* Match Info */}
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {match.matchType || "Match"}
                      </span>
                      <span>•</span>
                      <span>{match.overs || 0} overs per innings</span>
                      <span>•</span>
                      <span>{formatDate(match.timestamp)}</span>
                    </div>

                    {/* Scores */}
                    {(inning1 || inning2) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {/* Innings 1 */}
                        {inning1 && (
                          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                            <p className="text-xs font-semibold text-blue-700 mb-1">INNINGS 1</p>
                            <p className="font-bold text-gray-900">
                              {match.team1Name}: {inning1.runs}/{inning1.wickets}
                            </p>
                            <p className="text-xs text-gray-600">
                              ({inning1.overs}.{inning1.balls || 0} overs)
                            </p>
                          </div>
                        )}

                        {/* Innings 2 */}
                        {inning2 && (
                          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                            <p className="text-xs font-semibold text-amber-700 mb-1">INNINGS 2</p>
                            <p className="font-bold text-gray-900">
                              {match.team2Name}: {inning2.runs}/{inning2.wickets}
                            </p>
                            <p className="text-xs text-gray-600">
                              ({inning2.overs}.{inning2.balls || 0} overs)
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Match Result */}
                    {matchResult && (
                      <div className="bg-green-50 p-3 rounded border-l-4 border-green-500 mt-2">
                        <p className="text-sm font-bold text-green-800">
                          🏆 {matchResult.winner} won {matchResult.margin}
                        </p>
                      </div>
                    )}

                    {/* In Progress Status */}
                    {!isCompleted && (
                      <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400 mt-2">
                        <p className="text-xs text-yellow-800">
                          📊 Innings {match.currentInning || 1} in progress
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => onLoadMatch(match.matchData)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                    >
                      Load
                    </Button>
                    <Button
                      onClick={() => handleDelete(match.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
