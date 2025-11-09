interface StoredMatch {
  id: string
  timestamp: number
  matchType: string
  team1Name: string
  team2Name: string
  overs: number
  currentInning: number
  status: "setup" | "in-progress" | "completed"
  innings: {
    inning1: any | null
    inning2: any | null
  }
  matchData: any
}

export function saveMatch(matchData: any, matchId?: string): string {
  const id = matchId || matchData.id || `match-${Date.now()}`

  // Determine status
  let status: "setup" | "in-progress" | "completed" = "in-progress"
  if (matchData.status === "completed") {
    status = "completed"
  } else if (matchData.status === "setup") {
    status = "setup"
  }

  const storedMatch: StoredMatch = {
    id,
    timestamp: matchData.timestamp || Date.now(),
    matchType: matchData.matchType || "T20",
    team1Name: matchData.team1?.name || "Team 1",
    team2Name: matchData.team2?.name || "Team 2",
    overs: matchData.overs || 20,
    currentInning: matchData.currentInning || 1,
    status,
    innings: matchData.innings || { inning1: null, inning2: null },
    matchData,
  }

  const matches = getAllMatches()
  const existingIndex = matches.findIndex((m) => m.id === id)

  if (existingIndex >= 0) {
    matches[existingIndex] = storedMatch
  } else {
    matches.push(storedMatch)
  }

  localStorage.setItem("cricket_matches", JSON.stringify(matches))
  return id
}

export function loadMatch(matchId: string): any | null {
  const matches = getAllMatches()
  const match = matches.find((m) => m.id === matchId)
  return match || null
}

export function getAllMatches(): StoredMatch[] {
  try {
    const data = localStorage.getItem("cricket_matches")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function deleteMatch(matchId: string): void {
  const matches = getAllMatches()
  const filtered = matches.filter((m) => m.id !== matchId)
  localStorage.setItem("cricket_matches", JSON.stringify(filtered))
}

export function exportMatches(): string {
  const matches = getAllMatches()
  return JSON.stringify(matches, null, 2)
}

export function importMatches(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    if (Array.isArray(data)) {
      localStorage.setItem("cricket_matches", JSON.stringify(data))
      return true
    }
    return false
  } catch {
    return false
  }
}

export function deleteAllMatches(): void {
  localStorage.setItem("cricket_matches", JSON.stringify([]))
}
