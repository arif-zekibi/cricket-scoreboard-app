# Cricket Scoreboard - Full Implementation Plan

## Overview
This document outlines the complete implementation plan to transform your cricket scoreboard into a fully functional match management system with two-innings support, international cricket rules, and comprehensive statistics.

## ✅ Completed Tasks

### 1. Team Configuration Component (team-config.tsx)
- ✅ Added match type selection (T20, ODI, TEST, CUSTOM)
- ✅ Implemented custom team naming functionality
- ✅ Auto-set overs based on match type
- ✅ Improved validation for team setup
- ✅ Enhanced UI with team name inputs

### 2. Match Data Structure (page.tsx)
- ✅ Updated to support new match configuration format
- ✅ Proper innings data structure with inning1 and inning2
- ✅ Added match metadata (type, timestamp, teams)
- ✅ Improved innings completion logic

### 3. Innings Configuration (inning-config.tsx)
- ✅ Fixed team swap logic for second innings
- ✅ Proper bowling order selection
- ✅ Display target score for second innings
- ✅ Clear visual distinction between innings setup
- ✅ Proper initialization of innings data

## 🔧 Remaining Tasks

### Task 1: Fix Delivery Input Component (PRIORITY: HIGH)
**File**: `components/delivery-input.tsx`

**Issues to Fix**:
1. **Extras handling not following international rules**:
   - Wide: Should add 1 run + any runs scored + re-bowl
   - No-ball: Should add 1 run + any runs scored + re-bowl + free hit next ball
   - Bye/Leg-bye: Should allow runs scored without crediting to batsman
   - No-ball with runs: Currently broken

2. **Strike rotation logic incomplete**:
   - Should rotate on odd runs (1, 3, 5)
   - Should NOT rotate on even runs (0, 2, 4, 6)
   - Should rotate at end of over
   - Should NOT rotate on wicket
   - Wide/No-ball should not count as legal delivery

**Required Changes**:

```typescript
// Update runs calculation
let totalRuns = runs || 0
let extraRuns = 0

if (isWide) {
  extraRuns = 1
  totalRuns += extraRuns
}

if (isNoBall) {
  extraRuns = 1
  totalRuns += extraRuns
}

// For bye/leg-bye, runs go to team but not to batsman
if (isBye || isLegBye) {
  // Runs are extras, not credited to batsman
  extraRuns += runs || 0
  totalRuns = extraRuns
}

// Update match data
updatedData.runs += totalRuns
updatedData.extras += extraRuns

// Ball counting: Wide and No-ball don't count as legal deliveries
const isLegalDelivery = !isWide && !isNoBall

if (isLegalDelivery) {
  updatedData.currentBall += 1

  if (updatedData.currentBall === 6) {
    updatedData.currentBall = 0
    updatedData.currentOver += 1
    // Rotate strike at over end
    [updatedData.strikerIdx, updatedData.nonStrikerIdx] =
      [updatedData.nonStrikerIdx, updatedData.strikerIdx]
    // Change bowler
    updatedData.bowlerIdx = (updatedData.bowlerIdx + 1) %
      updatedData.bowlingTeam.bowlingOrder.length
  } else {
    // Rotate strike for odd runs (only if not wicket)
    if (!isWicket && [1, 3, 5].includes(runs || 0)) {
      [updatedData.strikerIdx, updatedData.nonStrikerIdx] =
        [updatedData.nonStrikerIdx, updatedData.strikerIdx]
    }
  }
}

// Wicket handling
if (isWicket) {
  updatedData.wickets += 1
  // New batsman comes in (advance striker index)
  const nextBatsmanIdx = updatedData.strikerIdx + 2
  if (nextBatsmanIdx < updatedData.battingTeam.battingOrder.length) {
    updatedData.strikerIdx = nextBatsmanIdx - 1
  }
}

// Free hit for no-ball
if (isNoBall) {
  updatedData.nextBallIsFreeHit = true
} else {
  updatedData.nextBallIsFreeHit = false
}
```

### Task 2: Update Live Scoreboard Component
**File**: `components/live-scoreboard.tsx`

**Required Updates**:
1. Display current batsmen (striker and non-striker) with correct highlights
2. Show current bowler with over stats
3. Display extras breakdown (wides, no-balls, byes, leg-byes)
4. Show required run rate for second innings
5. Display recent deliveries with proper symbols

**Example Structure**:
```typescript
// Get current batsmen
const striker = matchData.battingTeam.players.find(
  p => p.id === matchData.battingTeam.battingOrder[matchData.strikerIdx]
)
const nonStriker = matchData.battingTeam.players.find(
  p => p.id === matchData.battingTeam.battingOrder[matchData.nonStrikerIdx]
)

// Get current bowler
const currentBowler = matchData.bowlingTeam.players.find(
  p => p.id === matchData.bowlingTeam.bowlingOrder[matchData.bowlerIdx]
)

// Calculate stats from deliveries
const batterStats = calculateBatterStats(matchData.deliveries, striker.id)
const bowlerStats = calculateBowlerStats(matchData.deliveries, currentBowler.id)
```

### Task 3: Implement Player Stats Component
**File**: `components/player-stats.tsx`

**Required Calculations**:

**Batting Statistics**:
- Runs scored
- Balls faced
- Fours (boundaries)
- Sixes
- Strike rate: (Runs / Balls) × 100
- Dismissal type

**Bowling Statistics**:
- Overs bowled (format: overs.balls, e.g., "3.2")
- Runs conceded
- Wickets taken
- Economy rate: (Runs / Overs) × 6
- Maidens (overs with 0 runs)

**Implementation**:
```typescript
function calculateBattingStats(deliveries: any[], battingOrder: string[]) {
  const stats = {}

  battingOrder.forEach(playerId => {
    const playerDeliveries = deliveries.filter(d => d.batsmanId === playerId)

    stats[playerId] = {
      runs: playerDeliveries.reduce((sum, d) => sum + (d.runs || 0), 0),
      balls: playerDeliveries.filter(d => !d.isWide && !d.isNoBall).length,
      fours: playerDeliveries.filter(d => d.runs === 4).length,
      sixes: playerDeliveries.filter(d => d.runs === 6).length,
      strikeRate: 0, // Calculate: (runs / balls) * 100
      status: 'Not Out', // or dismissal type
    }
  })

  return stats
}
```

### Task 4: Create Match Summary Component
**File**: `components/match-summary.tsx`

**Required Features**:
1. **Match Result Display**:
   - Winner team
   - Margin of victory (runs or wickets)
   - Match type and date

2. **Innings Scorecards**:
   - Complete batting and bowling figures for both innings
   - Extras breakdown
   - Fall of wickets

3. **Best Performers**:
   - Best batsman (each team)
   - Best bowler (each team)
   - Player of the match (overall best performance)

4. **Match Statistics**:
   - Total runs scored
   - Total wickets fallen
   - Partnerships
   - Run rate comparison

**Example Implementation**:
```typescript
function determineWinner(matchData: any) {
  const inning1 = matchData.innings.inning1
  const inning2 = matchData.innings.inning2

  if (inning2.runs > inning1.runs) {
    return {
      winner: matchData.team2.name,
      margin: `by ${10 - inning2.wickets} wickets`,
      team1Score: `${inning1.runs}/${inning1.wickets}`,
      team2Score: `${inning2.runs}/${inning2.wickets}`,
    }
  } else {
    return {
      winner: matchData.team1.name,
      margin: `by ${inning1.runs - inning2.runs} runs`,
      team1Score: `${inning1.runs}/${inning1.wickets}`,
      team2Score: `${inning2.runs}/${inning2.wickets}`,
    }
  }
}

function getBestBatsman(deliveries: any[]) {
  // Find highest run scorer
  const batsmen = {}
  deliveries.forEach(d => {
    if (!batsmen[d.batsmanId]) {
      batsmen[d.batsmanId] = { runs: 0, balls: 0 }
    }
    batsmen[d.batsmanId].runs += d.runs || 0
    batsmen[d.batsmanId].balls += (!d.isWide && !d.isNoBall) ? 1 : 0
  })

  return Object.entries(batsmen).sort((a, b) => b[1].runs - a[1].runs)[0]
}
```

### Task 5: Fix Match Controls Component
**File**: `components/match-controls.tsx`

**Required Updates**:
1. **Undo functionality**:
   - Properly reverse all statistics
   - Handle wicket reversal (bring back dismissed batsman)
   - Handle extras reversal
   - Recalculate overs and balls

2. **Innings completion detection**:
   - Check if all overs bowled
   - Check if 10 wickets down
   - For second innings, check if target achieved

3. **Add controls**:
   - Manual strike rotation (for corrections)
   - Manual bowler change
   - End innings button

**Example**:
```typescript
function checkInningsComplete(matchData: any) {
  const allOversComplete = matchData.currentOver >= matchData.overs
  const allOut = matchData.wickets >= 10

  if (matchData.currentInning === 2 && matchData.innings.inning1) {
    const targetAchieved = matchData.runs > matchData.innings.inning1.runs
    return allOversComplete || allOut || targetAchieved
  }

  return allOversComplete || allOut
}
```

### Task 6: Update Storage Component
**File**: `lib/storage.ts`

**Required Changes**:
1. Update `StoredMatch` interface to include new fields:
   - matchType
   - team1Name, team2Name
   - innings data
   - match status

2. Fix save/load logic to handle complete match data

**Updated Interface**:
```typescript
interface StoredMatch {
  id: string
  timestamp: number
  matchType: "T20" | "ODI" | "TEST" | "CUSTOM"
  team1Name: string
  team2Name: string
  overs: number
  currentInning: number
  innings: {
    inning1: InningData | null
    inning2: InningData | null
  }
  status: "setup" | "in-progress" | "completed"
  matchData: any
}
```

### Task 7: Test Complete Workflow

**Test Cases**:
1. ✅ Create new match with custom team names
2. ✅ Select match type (T20, ODI, etc.)
3. ✅ Configure both teams with players
4. ✅ Start first innings
5. ⬜ Record deliveries with all types of extras
6. ⬜ Test strike rotation on odd/even runs
7. ⬜ Test wicket handling and new batsman
8. ⬜ Test free hit after no-ball
9. ⬜ Complete first innings (10 wickets or all overs)
10. ⬜ Start second innings with team swap
11. ⬜ Complete second innings
12. ⬜ View match summary with statistics
13. ⬜ Save and reload match
14. ⬜ Export/import match data

## International Cricket Rules Implementation

### Extras Rules:
1. **Wide**: +1 run to team, re-bowl, no ball counted
2. **No-ball**: +1 run to team, re-bowl, next ball is free hit
3. **Bye**: Runs to team (not batsman), legal delivery
4. **Leg-bye**: Runs to team (not batsman), legal delivery
5. **Free hit**: Batsman can't be dismissed (except run-out)

### Strike Rotation Rules:
1. Rotate after odd runs (1, 3, 5)
2. No rotation after even runs (0, 2, 4, 6)
3. Rotate at end of over
4. No rotation on wicket
5. Extras don't affect rotation

### Wicket Rules:
1. New batsman takes striker position
2. Non-striker remains
3. 10 wickets = innings complete
4. Free hit: Only run-out dismissal allowed

### Over Rules:
1. 6 legal deliveries = 1 over
2. Wide/No-ball don't count toward over
3. Bowler changes at over end
4. Strike rotates at over end

## File Structure Summary

```
cricket-scoreboard/
├── app/
│   └── page.tsx                  ✅ Updated (match flow)
├── components/
│   ├── team-config.tsx           ✅ Updated (match types, team names)
│   ├── inning-config.tsx         ✅ Updated (proper team swap)
│   ├── delivery-input.tsx        ⬜ Needs update (extras, rotation)
│   ├── live-scoreboard.tsx       ⬜ Needs update (display logic)
│   ├── player-stats.tsx          ⬜ Needs update (calculations)
│   ├── match-controls.tsx        ⬜ Needs update (completion detection)
│   └── match-summary.tsx         ⬜ Needs complete rewrite
└── lib/
    └── storage.ts                ⬜ Needs update (new data structure)
```

## Next Steps

1. **Priority 1**: Fix delivery-input.tsx (extras and rotation logic)
2. **Priority 2**: Update live-scoreboard.tsx (proper display)
3. **Priority 3**: Implement player-stats.tsx (statistics calculations)
4. **Priority 4**: Create match-summary.tsx (match result and best players)
5. **Priority 5**: Fix match-controls.tsx (innings completion)
6. **Priority 6**: Update storage.ts (save/load logic)
7. **Priority 7**: Comprehensive testing of entire flow

## Tips for Implementation

1. **Test incrementally**: After each component update, test the flow
2. **Use console.log**: Debug match data structure changes
3. **Check deliveries array**: Ensure each delivery is stored correctly
4. **Validate data**: Add checks for null/undefined values
5. **Handle edge cases**: Empty batting order, no bowlers, etc.

Would you like me to continue implementing these remaining tasks?
