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
          {matches.map((match) => (
            <Card key={match.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {match.batTeamName} ({match.totalRuns}/{match.totalWickets}) vs {match.bowlTeamName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {match.completedOvers} overs • {formatDate(match.timestamp)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-bold ${match.status === "completed" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {match.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </p>
                </div>
                <div className="space-x-2 flex">
                  <Button
                    onClick={() => onLoadMatch(match.matchData)}
                    className="bg-blue-600 hover:bg-blue-700 text-sm"
                  >
                    Load
                  </Button>
                  <Button onClick={() => handleDelete(match.id)} className="bg-red-600 hover:bg-red-700 text-sm">
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
