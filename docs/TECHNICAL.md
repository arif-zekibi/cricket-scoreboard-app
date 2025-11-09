# Technical Documentation

## Architecture Overview

### Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Frontend:** React 19.2
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Storage:** Browser localStorage
- **Deployment:** Vercel-ready

### Project Structure

\`\`\`
cricket-scorer/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main app component
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles & theme
│
├── components/
│   ├── main-nav.tsx              # Header navigation (160 lines)
│   ├── team-config.tsx           # Team setup (250 lines)
│   ├── live-scoreboard.tsx       # Scoreboard display (200 lines)
│   ├── delivery-input.tsx        # Ball recording form (280 lines)
│   ├── match-controls.tsx        # Match controls (180 lines)
│   ├── player-stats.tsx          # Statistics tables (220 lines)
│   ├── match-history.tsx         # Match management (280 lines)
│   ├── theme-provider.tsx        # Theme context
│   └── ui/                       # shadcn/ui components (60+ components)
│
├── lib/
│   ├── storage.ts                # localStorage persistence (100 lines)
│   └── utils.ts                  # Utility functions
│
├── public/                       # Static assets
├── docs/                         # Documentation
└── Configuration Files
    ├── package.json
    ├── tsconfig.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    └── components.json
\`\`\`

### Component Hierarchy

\`\`\`
Page (app/page.tsx)
├── MainNav
├── [View: History | Setup | Match]
│   ├── MatchHistory
│   ├── TeamConfig
│   │   └── TeamSetup (sub-component)
│   └── Match Layout
│       ├── LiveScoreboard
│       ├── DeliveryInput
│       ├── MatchControls
│       └── PlayerStats
\`\`\`

---

## Core Components

### app/page.tsx (Main)

**Responsibilities:**
- Manages global app state
- Handles view navigation (history/setup/match)
- Auto-save matches to localStorage
- Route match actions to components

**Key State:**
\`\`\`typescript
view: "history" | "setup" | "match"
matchData: any                       // Current match state
currentMatchId: string | null       // Match ID for loading
\`\`\`

**Key Functions:**
- `handleMatchSetup()` - Start new match
- `handleLoadMatch()` - Resume match
- `handleBackToHistory()` - Return to history
- `handleNewMatch()` - Go to setup

**Auto-save Logic:**
- Triggers every 1 second after matchData change
- Only saves if view is "match"
- Updates existing match or creates new
- No manual save required

---

### components/team-config.tsx

**Purpose:** Configure teams before match start

**Key Features:**
- Add unlimited players with jersey numbers
- Visual batting order configuration
- Customizable total overs
- Validation before match start
- Tab-based UI for team switching

**State:**
\`\`\`typescript
teams: Team[]              // Array of Team A and Team B
overs: number             // Match format
activeTeam: string        // Current tab view
\`\`\`

**Key Functions:**
- `addPlayer()` - Add player to team
- `setBattingOrder()` - Configure batting sequence
- `startMatch()` - Validate and start match

**Data Output:**
\`\`\`typescript
{
  batTeam: Team,
  bowlTeam: Team,
  overs: number,
  currentOver: 0,
  currentBall: 0,
  strikerIdx: 0,
  nonStrikerIdx: 1,
  bowlerIdx: 0,
  runs: 0,
  wickets: 0,
  deliveries: []
}
\`\`\`

---

### components/live-scoreboard.tsx

**Purpose:** Display real-time match information

**Props:**
\`\`\`typescript
matchData: {
  runs: number
  wickets: number
  currentOver: number
  currentBall: number
  overs: number
  batTeam: Team
  bowlTeam: Team
  strikerIdx: number
  nonStrikerIdx: number
  bowlerIdx: number
  deliveries: Delivery[]
}
\`\`\`

**Calculated Values:**
- Run rate: `(runs / overs) * 6`
- Projected score: `(runs / balls) * balls_remaining`
- Strike rate: `(runs / balls) * 100`
- Economy: `(runs / overs) * 6`

**Displays:**
- Total score with wickets and overs
- Current striker with stats
- Current non-striker with stats
- Current bowler with bowling figures
- Last 12 deliveries in visual format

---

### components/delivery-input.tsx

**Purpose:** Record each ball bowled

**Input Fields:**
\`\`\`typescript
runs?: number              // 0-6 runs
isWicket: boolean         // Dismissal flag
wicketType?: string       // Type of dismissal
extraType?: string        // Wide/no-ball/bye/leg-bye
\`\`\`

**Validation Rules:**
1. Runs must be 0-6 (or empty)
2. Cannot have both wicket and extra
3. If wicket, must select wicket type
4. Wides/no-balls don't count as deliveries
5. Match must not be completed
6. Cannot record if 10 wickets down

**Processing:**
1. Validate input
2. Calculate over/ball changes
3. Update runs and wickets
4. Handle strike rotation
5. Update statistics
6. Save delivery record
7. Auto-save to localStorage

**Error Handling:**
- User-friendly error messages
- Prevents invalid data entry
- Shows validation errors above input
- Suggests corrections

---

### components/match-controls.tsx

**Purpose:** Manage match state during play

**Features:**

**Bowler Management:**
\`\`\`typescript
// Changes bowler to next in rotation
handleChangeBowler() {
  nextBowlerIdx = (bowlerIdx + 1) % bowlTeam.players.length
}
\`\`\`

**Strike Rotation:**
\`\`\`typescript
// Swaps striker and non-striker
handleRotateStrike() {
  [strikerIdx, nonStrikerIdx] = [nonStrikerIdx, strikerIdx]
}
\`\`\`

**Undo Functionality:**
\`\`\`typescript
// Removes last delivery and recalculates
handleUndo() {
  const lastDelivery = deliveries.pop()
  
  // Recalculate: runs, wickets, over/ball
  // Restore previous batsman if wicket
  // Update all statistics
}
\`\`\`

---

### components/player-stats.tsx

**Purpose:** Display detailed player statistics

**Data Structures:**

**Batsman Stats:**
\`\`\`typescript
{
  playerId: string
  name: string
  jerseyNumber: number
  runs: number
  ballsFaced: number
  fours: number
  sixes: number
  strikeRate: number
  status: "In" | "Caught" | "Bowled" | ...
}
\`\`\`

**Bowler Stats:**
\`\`\`typescript
{
  playerId: string
  name: string
  jerseyNumber: number
  overs: number
  runs: number
  wickets: number
  economyRate: number
}
\`\`\`

**Calculations:**

\`\`\`typescript
// Batting
strikeRate = (runs / ballsFaced) * 100

// Bowling
economyRate = (runs / overs) * 6

// Over representation
overs = Math.floor(balls / 6) + "." + (balls % 6)
\`\`\`

---

### lib/storage.ts

**Purpose:** Manage match persistence with localStorage

**StoredMatch Interface:**
\`\`\`typescript
interface StoredMatch {
  id: string                  // Unique ID
  timestamp: number           // Creation time
  batTeamName: string        // Batting team
  bowlTeamName: string       // Bowling team
  totalRuns: number          // Final runs
  totalWickets: number       // Final wickets
  completedOvers: number     // Overs bowled
  totalOvers: number         // Match overs
  status: "in-progress" | "completed"
  matchData: any             // Complete match object
}
\`\`\`

**Functions:**

**saveMatch(matchData, matchId?)**
\`\`\`typescript
// Saves match to localStorage
// Updates if exists, creates if new
// Returns match ID
\`\`\`

**loadMatch(matchId)**
\`\`\`typescript
// Retrieves match by ID
// Returns complete match object
\`\`\`

**getAllMatches()**
\`\`\`typescript
// Returns all stored matches
// Handles parse errors gracefully
\`\`\`

**deleteMatch(matchId)**
\`\`\`typescript
// Removes match from storage
\`\`\`

**exportMatches()**
\`\`\`typescript
// Returns JSON string of all matches
// Ready for download/backup
\`\`\`

**importMatches(jsonData)**
\`\`\`typescript
// Parses JSON and saves matches
// Returns success/failure boolean
\`\`\`

---

## Data Flow Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        App Main State                        │
│  matchData, currentMatchId, view                            │
└──────────────┬──────────────────────────────────────────────┘
               │
        ┌──────┴──────┬──────────────────┬──────────────────┐
        │             │                  │                  │
        v             v                  v                  v
   ┌─────────┐  ┌──────────┐      ┌────────────┐    ┌─────────────┐
   │ History │  │   Setup  │      │Live Match  │    │  Components │
   │  View   │  │  View    │      │   View     │    │   Display   │
   └─────────┘  └──────────┘      └────────────┘    └─────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    v                   v                   v
            ┌───────────────┐  ┌──────────────┐  ┌──────────────┐
            │ Scoreboard    │  │Delivery Inp  │  │Match Control │
            │               │  │              │  │              │
            └───────────────┘  └──────────────┘  └──────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        v                        v
   ┌──────────┐            ┌──────────┐
   │ Live     │            │localStorage
   │  State   │────────►   │ Persistence
   │ Changes  │            │
   └──────────┘            └──────────┘
\`\`\`

---

## Styling System

### Color Palette (Tailwind v4)

**Cricket-themed colors:**
- Primary (Navy Blue): `oklch(0.25 0.08 170)`
- Accent (Gold): `oklch(0.8 0.15 50)`
- Destructive (Red): `oklch(0.577 0.245 27.325)`
- Muted (Gray): `oklch(0.93 0 0)`

**Usage in Components:**
\`\`\`typescript
// Primary button
className="bg-blue-900 text-white"

// Accent highlight
className="bg-amber-400 text-slate-900"

// Error state
className="bg-red-600 text-white"
\`\`\`

### Responsive Design

\`\`\`typescript
// Mobile-first approach
className="
  // Mobile
  p-4 text-base
  
  // Tablet
  md:p-6 md:text-lg
  
  // Desktop
  lg:p-8 lg:grid-cols-2
"
\`\`\`

### CSS Grid Layout (Main View)

\`\`\`css
.match-layout {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;  /* Responsive to 1fr on mobile */
  gap: 1.5rem;                         /* 24px gap */
}
\`\`\`

---

## State Management Strategy

### No External Store (by Design)

We use React hooks only, no Redux/Zustand:
- Simpler architecture
- Fewer dependencies
- Auto-save handles persistence
- matchData passed as prop to components

**Advantages:**
- Reduced bundle size
- Easier debugging
- No store boilerplate
- localStorage as "single source of truth"

**Trade-offs:**
- Prop drilling for deep components
- Less clear data mutations
- Could refactor to Context if needed

### State Hierarchy

\`\`\`
App (page.tsx)
├── matchData (match state)
├── currentMatchId (match ID)
├── view (current view)
│
└── Children receive:
    ├── matchData (read)
    ├── setMatchData (write)
    └── computed values (runs, wickets, etc.)
\`\`\`

---

## Performance Optimizations

### Auto-save Debouncing

\`\`\`typescript
// Waits 1 second after last change before saving
const timer = setTimeout(() => {
  saveMatch(matchData, currentMatchId)
}, 1000)

// Clears timer on next change
return () => clearTimeout(timer)
\`\`\`

Benefit: Avoids excessive localStorage writes

### Memoization Opportunities

**Current:** None (component count is small)

**Future considerations:**
\`\`\`typescript
// Memoize expensive calculations
const battersStats = useMemo(() => 
  calculateStats(deliveries), 
  [deliveries]
)

// Memoize components
const ScoreboardMemo = memo(LiveScoreboard)
\`\`\`

### Bundle Size

- Next.js production build: ~50-80KB
- Tailwind v4: ~20-30KB
- shadcn/ui (used components): ~15-25KB
- App JS: ~10-15KB
- **Total gzipped:** ~50KB

---

## Error Handling

### Delivery Input Validation

\`\`\`typescript
if (!runs && isWicket && !wicketType) {
  error = "Select wicket type"
}

if (isWicket && extraType) {
  error = "Cannot have wicket and extra"
}

if (runs > 6 && runs !== 4 && runs !== 6) {
  error = "Runs must be 0-6"
}
\`\`\`

### localStorage Error Handling

\`\`\`typescript
try {
  const data = localStorage.getItem('cricket_matches')
  return data ? JSON.parse(data) : []
} catch {
  return []  // Graceful fallback
}
\`\`\`

### Match Completion Detection

\`\`\`typescript
// Auto-detect completion
if (wickets === 10 || 
    (currentOver === overs && currentBall === 0)) {
  status = "completed"
}
\`\`\`

---

## Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 8+)

**APIs Used:**
- localStorage (IE9+)
- JSON.parse/stringify (IE8+)
- Fetch API (not used, all local)
- CSS Grid/Flexbox (IE10+)

**localStorage Limits:**
- Chrome: ~10MB
- Firefox: ~10MB
- Safari: ~5MB
- IE11: ~10MB

---

## Deployment

### Production Build

\`\`\`bash
npm run build
\`\`\`

Generates optimized output in `.next` folder

### Vercel Deployment

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Auto-deploys on git push

### Self-hosted Deployment

\`\`\`bash
# Build
npm run build

# Run
npm start
\`\`\`

Requires Node.js 18+

---

## Future Architecture Considerations

### Database Integration

For cloud persistence:
\`\`\`typescript
// Replace localStorage with:
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

export async function saveMatch(matchData) {
  return supabase
    .from('matches')
    .upsert(matchData)
}
\`\`\`

### Multi-user Collaboration

Requires:
- Realtime updates (WebSocket)
- User authentication
- Conflict resolution
- Concurrency handling

### State Management Upgrade

If app scales:
\`\`\`typescript
// Could migrate to Context
<MatchProvider>
  <App />
</MatchProvider>

// Or Zustand
const useMatchStore = create((set) => ({
  matchData: null,
  setMatchData: (data) => set({ matchData: data })
}))
\`\`\`

---

**Version:** 1.0.0
**Last Updated:** 2025
