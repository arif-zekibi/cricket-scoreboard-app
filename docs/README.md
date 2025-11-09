# Cricket Scorer - Live Match Management System

A comprehensive web-based platform for managing and scoring cricket matches in real-time. This tool is designed to help locally organized cricket tournaments manage scores live with an interface that mirrors professional cricket scoreboards.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Architecture](#architecture)
- [Components](#components)
- [Data Structure](#data-structure)
- [Storage & Persistence](#storage--persistence)
- [User Workflows](#user-workflows)

---

## Overview

Cricket Scorer is a Next.js-based application that provides scorekeepers, match administrators, and tournament organizers with a professional-grade live scoring interface. It handles all aspects of match management including team configuration, live score updates, player statistics, and complete match history with import/export capabilities.

**Tech Stack:**
- Frontend: Next.js 16, React 19.2, TypeScript
- Styling: Tailwind CSS v4, shadcn/ui components
- Storage: Browser localStorage
- Deployment: Vercel-ready

---

## Features

### 1. Team Configuration & Setup
- Add teams with unlimited players
- Assign jersey numbers to each player
- Configure batting order with drag-and-drop support
- Set match format (customizable overs: T20, ODI, or custom)
- Validate team setup before match starts

### 2. Live Scoreboard
- Real-time match score display
- Current batting status (striker and non-striker)
- Individual player statistics (runs, balls faced, fours, sixes, strike rate)
- Bowling details (bowler name, runs this over, wickets this over)
- Recent deliveries history (last 12 balls)
- Run rate tracking and projected final score calculation

### 3. Delivery Recording
- One-click interface to record each ball bowled
- Run input (0-6 runs)
- Wicket recording with 7 wicket types:
  - Caught
  - Bowled
  - LBW (Leg Before Wicket)
  - Run Out
  - Stumped
  - Handled the Ball
  - Obstructing
- Extra types (Wides, No-balls, Byes, Leg-byes)
- No-ball with free hit indicator
- Automatic ball/over counting
- Input validation and error messages

### 4. Match Controls
- Manual strike rotation button
- Bowler change management
- Undo functionality (reverses last delivery with recalculation)
- Match status display
- Auto-detection of all-out and match completion

### 5. Player Statistics
- **Batting Statistics Table:**
  - Player name and jersey number
  - Runs, balls faced, fours, sixes
  - Strike rate calculation
  - Dismissal status with wicket type
  
- **Bowling Statistics Table:**
  - Bowler name and jersey number
  - Overs bowled, runs conceded, wickets taken
  - Economy rate calculation

### 6. Match History & Persistence
- Auto-save matches to browser storage every 1 second
- View complete match history with timestamps
- Load previous matches to resume or review
- Delete matches
- Export all matches to JSON file
- Import matches from JSON backup

---

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

Deploy to Vercel with one click:
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## How to Use

### Step 1: Create a New Match

1. Click "New Match" button on the Match History page
2. Configure total overs for the match (e.g., 20 for T20, 50 for ODI)
3. Click "Team A (Batting)" tab to add batting team players

### Step 2: Configure Teams

**For Batting Team (Team A):**
1. Add player name and jersey number
2. Click "Add" to add the player
3. Check players to select for batting order
4. Batting order automatically shows striker (1st) and non-striker (2nd)

**For Bowling Team (Team B):**
1. Add bowlers similarly
2. Select at least 1 bowler for the match

### Step 3: Start the Match

1. Ensure Team A has 2+ batsmen and Team B has 1+ bowler
2. Click "Start Match"
3. Live scoreboard will display with current striker and non-striker

### Step 4: Record Deliveries

1. In the "Delivery Input" section, enter:
   - **Runs:** 0-6 (or leave blank for dot ball)
   - **Is Wicket:** Check if batsman is dismissed
   - **Wicket Type:** Select from dropdown (if wicket)
   - **Extra Type:** Select if wide, no-ball, bye, or leg-bye
2. Click "Record Delivery"
3. Score updates automatically
4. Strike rotates after odd runs and at over completion

### Step 5: Monitor Match

- **Live Scoreboard:** Shows current score, striker/non-striker stats, bowling figures
- **Player Stats:** View all batting and bowling statistics
- **Match Controls:** Change bowler, manually rotate strike, or undo deliveries

### Step 6: Save & Retrieve Matches

- Matches auto-save automatically
- Return to Match History anytime to:
  - Load a previous match
  - Export match data
  - Import previously saved matches
  - Delete completed matches

---

## Architecture

\`\`\`
Cricket Scorer
├── app/
│   ├── page.tsx              (Main app component with state management)
│   ├── layout.tsx            (Root layout with metadata)
│   └── globals.css           (Tailwind CSS config & theme)
├── components/
│   ├── main-nav.tsx          (Header navigation)
│   ├── team-config.tsx       (Team setup interface)
│   ├── live-scoreboard.tsx   (Match display)
│   ├── delivery-input.tsx    (Ball recording form)
│   ├── match-controls.tsx    (Controls & undo)
│   ├── player-stats.tsx      (Statistics tables)
│   ├── match-history.tsx     (Match list & management)
│   └── ui/                   (shadcn/ui components)
├── lib/
│   ├── storage.ts            (localStorage persistence)
│   └── utils.ts              (Utility functions)
└── public/                   (Assets)
\`\`\`

### Data Flow

\`\`\`
Match History → Team Config → Live Match
    ↓              ↓              ↓
   Load      Start Match    Record Delivery
  Previous    Initialize    Update Score
  Matches     Match State   Auto-save
\`\`\`

---

## Components

### `main-nav.tsx`
Header navigation with:
- App branding (Cricket Scorer)
- View navigation (History/Match)
- New Match button

### `team-config.tsx`
Team setup with:
- Player management (add/remove)
- Batting order configuration
- Jersey number assignment
- Match format selection

### `live-scoreboard.tsx`
Match display with:
- Score summary (total runs, wickets, overs)
- Batsmen information (striker, non-striker, strike rates)
- Bowler information (runs, wickets this over)
- Recent deliveries history

### `delivery-input.tsx`
Ball recording form with:
- Run input field
- Wicket checkbox with type selector
- Extra type selector (wide, no-ball, bye, leg-bye)
- Match status indicators
- Input validation

### `match-controls.tsx`
Match management with:
- Strike rotation button
- Bowler change dropdown
- Undo last delivery button
- Current striker display

### `player-stats.tsx`
Statistics display with:
- Batsmen statistics table (runs, balls, fours, sixes, SR, status)
- Bowler statistics table (overs, runs, wickets, economy rate)
- Sortable data

### `match-history.tsx`
Match management interface with:
- List of all saved matches
- Load/Resume functionality
- Delete matches
- Export to JSON
- Import from JSON

---

## Data Structure

### Match Object
\`\`\`typescript
{
  id: string                    // Unique match identifier
  timestamp: number             // Creation timestamp
  batTeam: {
    id: string
    name: string
    players: Player[]
    battingOrder: string[]      // Player IDs in order
  }
  bowlTeam: {
    id: string
    name: string
    players: Player[]
  }
  overs: number                 // Total overs in match
  currentOver: number           // Current over number (0-indexed)
  currentBall: number           // Current ball in over (0-5)
  strikerIdx: number            // Index of current striker in batting order
  nonStrikerIdx: number         // Index of current non-striker in batting order
  bowlerIdx: number             // Index of current bowler
  runs: number                  // Total runs scored
  wickets: number               // Total wickets lost
  deliveries: Delivery[]        // Array of all balls bowled
}
\`\`\`

### Delivery Object
\`\`\`typescript
{
  ballNumber: number            // Overall ball number in match
  over: number                  // Over number
  ball: number                  // Ball in over
  striker: string               // Striker name
  nonStriker: string            // Non-striker name
  bowler: string                // Bowler name
  runs: number                  // Runs from this delivery
  isWicket: boolean            // Is dismissal
  wicketType?: string          // Type of dismissal
  extraType?: string           // Type of extra (wide, no-ball, bye, leg-bye)
  timestamp: number            // When delivery was recorded
}
\`\`\`

### Player Object
\`\`\`typescript
{
  id: string
  name: string
  jerseyNumber: number
}
\`\`\`

### Stored Match Object (in localStorage)
\`\`\`typescript
{
  id: string
  timestamp: number
  batTeamName: string
  bowlTeamName: string
  totalRuns: number
  totalWickets: number
  completedOvers: number
  totalOvers: number
  status: "in-progress" | "completed"
  matchData: MatchObject        // Full match data
}
\`\`\`

---

## Storage & Persistence

### Browser localStorage
All match data is stored in browser's localStorage under key `cricket_matches`.

**Storage Functions** (lib/storage.ts):
- `saveMatch(matchData, matchId?)` - Save or update a match
- `loadMatch(matchId)` - Load specific match by ID
- `getAllMatches()` - Retrieve all saved matches
- `deleteMatch(matchId)` - Delete a match
- `exportMatches()` - Export all matches as JSON string
- `importMatches(jsonData)` - Import matches from JSON

### Auto-save Mechanism
- Matches auto-save after 1 second of inactivity
- Triggered when `matchData` changes and view is "match"
- Manual save available via "Save Match" button
- Import/Export for backup and sharing

### Data Limits
- Browser localStorage typically supports 5-10MB per domain
- For typical matches (50-100 deliveries), storage is minimal
- Archive old matches via export if needed

---

## User Workflows

### Workflow 1: Record a Complete Match

\`\`\`
1. Match History Page
   ↓
2. Click "New Match"
   ↓
3. Team Configuration
   - Add Team A (batting) players
   - Add Team B (bowling) players
   - Set overs
   ↓
4. Start Match
   ↓
5. Live Match Page
   - Record each delivery
   - Monitor live score
   - Check player stats
   ↓
6. Match Completes (all-out or final over)
   ↓
7. Match History
   - Match automatically saved
   - View in history list
\`\`\`

### Workflow 2: Resume Previous Match

\`\`\`
1. Match History Page
2. Find match in list
3. Click "Load" button
4. Continue recording deliveries
5. Auto-save resumes
\`\`\`

### Workflow 3: Backup & Restore Matches

\`\`\`
Export:
1. Match History Page
2. Click "Export All"
3. Save JSON file locally

Restore:
1. Match History Page
2. Click "Import"
3. Select JSON file
4. All matches imported
\`\`\`

### Workflow 4: Correct a Delivery

\`\`\`
1. In Live Match view
2. Click "Undo Last Delivery"
3. Match state reverts
4. Re-record correct delivery
\`\`\`

---

## Key Features Explained

### Strike Rotation Logic
- Rotates after **odd runs** (1, 3, 5)
- Rotates after each **over completion**
- Does NOT rotate after even runs or wickets
- Automatic batsman advancement when wicket falls

### No-Ball & Free Hit
- No-ball does NOT count as official delivery
- Free hit automatically set for next delivery
- Batter cannot be dismissed on free hit (except run-out)
- Ball count remains correct

### All-Out Detection
- Triggered when **10 wickets** fall
- Match automatically completes
- No further deliveries allowed
- Displays in match history as "Completed"

### Economy Rate Calculation
Economy Rate = (Runs Conceded / Overs Bowled) × 6
Example: 24 runs in 4 overs = 6.0 economy

### Strike Rate Calculation
Strike Rate = (Runs Scored / Balls Faced) × 100
Example: 45 runs in 30 balls = 150 strike rate

---

## Troubleshooting

### Match Data Lost
- Check browser localStorage is enabled
- Verify localStorage quota not exceeded
- Use Export to backup before clearing browser data

### Cannot Start Match
- Ensure Team A has 2+ batsmen selected
- Ensure Team B has 1+ bowler added
- Check billing order configuration

### Delivery Won't Record
- Verify input values are valid
- Check for conflicting extra/wicket selections
- Ensure match isn't already completed

### Import Fails
- Verify JSON file is from this app's export
- Check file isn't corrupted
- Ensure valid JSON format

---

## Tips & Best Practices

1. **Before Match:** Review team configuration to avoid errors
2. **During Match:** Use undo feature to correct mistakes immediately
3. **Striker Tracking:** Watch the highlighted striker in scoreboard
4. **Statistics:** Use player stats to monitor performance
5. **Backup:** Regularly export matches to prevent data loss
6. **Multiple Matches:** Use match history to manage parallel matches

---

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 15+)
- Mobile browsers: Responsive design optimized

---

## Future Enhancements

Potential features for future versions:
- Database integration for cloud persistence
- Multi-user collaboration and live viewer interface
- Advanced statistics and match analytics
- Wicket partnerships and run rates tracking
- Integration with online tournament platforms
- Mobile-optimized app version
- Real-time notifications

---

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Review your browser's console for errors
3. Try clearing localStorage and starting fresh
4. Export your data before major updates

---

**Version:** 1.0.0
**Last Updated:** 2025
**License:** MIT
