# Cricket Scorer - User Guide

## Quick Start

### First Time Users (5 minutes)

1. **Open the App**
   - Navigate to Cricket Scorer URL
   - Click "New Match" button

2. **Add Teams**
   - Click "Team A (Batting)" tab
   - Add 5-11 players with jersey numbers
   - Move to "Team B (Bowling)" tab
   - Add 5-11 bowlers
   - Set total overs (default: 20)

3. **Start Match**
   - Review batting order for Team A
   - Ensure both teams configured
   - Click "Start Match" button

4. **Score First Ball**
   - Enter runs (0-6) or leave blank for dot
   - Click "Record Delivery"
   - Score updates automatically

5. **Explore**
   - View player stats in Statistics section
   - Check delivery history in scoreboard
   - Monitor live score and statistics

---

## Main Views

### 1. Match History View

**Purpose:** View, manage, and create matches

**Features:**
- List of all matches with scores and dates
- Load button to resume match
- Delete button to remove match
- Export All button for backup
- Import button to restore matches

**Common Tasks:**

Resume Previous Match:
\`\`\`
1. Find match in history list
2. Click "Load" button
3. Continue recording deliveries
\`\`\`

Backup Matches:
\`\`\`
1. Click "Export All"
2. Save JSON file to computer
3. Keep as backup copy
\`\`\`

---

### 2. Team Configuration View

**Purpose:** Set up match teams and batting order

**Components:**

**Match Configuration Section**
- Set total overs (e.g., 20 for T20, 50 for ODI)
- Minimum 1, maximum 50 overs supported

**Team Setup Section**
- Two tabs: Team A (Batting), Team B (Bowling)
- Add Players: Enter name and jersey number
- Select for Batting Order: Check players to include
- Batting Order: Displays selected players ranked

**Rules:**
- Team A (Batting) needs minimum 2 players
- Team B (Bowling) needs minimum 1 player
- Jersey numbers should be unique (not enforced)
- Batting order can have up to 11 players

**Tips:**
- Order batting lineup strategically
- Typically 11 players for full team
- 8-10 players for smaller tournaments
- Jersey numbers help identify players quickly

---

### 3. Live Match View

**Purpose:** Record, monitor, and manage live match

**Layout:**

**Left Section (Scoreboard)**
- Total score display
- Current batsmen (striker/non-striker)
- Current bowler
- Recent deliveries

**Middle Section (Delivery Input)**
- Record each ball bowled
- Select runs, wickets, extras
- Real-time validation

**Right Section (Match Controls)**
- Change bowler
- Rotate strike manually
- Undo last delivery
- Current match status

**Bottom Section (Player Statistics)**
- Batting stats (all players)
- Bowling stats (all bowlers)
- Click tabs to switch views

---

## Recording Deliveries

### Basic Delivery (Dot Ball)

\`\`\`
1. Leave "Runs" empty
2. Uncheck "Is Wicket"
3. Leave "Extra Type" empty
4. Click "Record Delivery"
\`\`\`

Result: No runs scored, next ball recorded

### Delivery with Runs

\`\`\`
1. Enter runs in "Runs" field (1-6)
   - 1-2: Single or double
   - 4: Four (boundary)
   - 6: Six (boundary)
2. Uncheck "Is Wicket"
3. Leave "Extra Type" empty
4. Click "Record Delivery"
\`\`\`

Example: Batter hits 4 runs
\`\`\`
Runs: 4
Is Wicket: unchecked
Extra Type: None
\`\`\`

Strike automatically rotates if odd runs (1, 3, 5)

### Delivery with Wicket

\`\`\`
1. Uncheck "Runs" field (or leave blank)
2. Check "Is Wicket" checkbox
3. Select "Wicket Type" from dropdown:
   - Caught
   - Bowled
   - LBW
   - Run Out
   - Stumped
   - Handled the Ball
   - Obstructing
4. Click "Record Delivery"
\`\`\`

Example: Batsman bowled out
\`\`\`
Runs: blank
Is Wicket: checked
Wicket Type: Bowled
\`\`\`

Next batsman automatically comes to crease

### Delivery with Extra

\`\`\`
1. Leave "Runs" empty (for now)
2. Uncheck "Is Wicket"
3. Select "Extra Type":
   - Wide: Delivery outside off stump
   - No-ball: Illegal delivery (free hit next)
   - Bye: Ball passes batter, no contact
   - Leg-bye: Ball hits batter's leg only
4. Click "Record Delivery"
\`\`\`

Example: Wide delivery
\`\`\`
Runs: blank
Is Wicket: unchecked
Extra Type: Wide
\`\`\`

Rules:
- Wide doesn't count as delivery
- No-ball sets free hit flag
- Run automatic added with extra
- Cannot have both wicket and extra

### Delivery with Runs + Wicket

Some deliveries have both:
- Run out after runs
- Stump before/after runs

Process:
\`\`\`
1. Enter runs scored
2. Check "Is Wicket"
3. Select wicket type
4. Click "Record Delivery"
\`\`\`

Example: Run out while running
\`\`\`
Runs: 2
Is Wicket: checked
Wicket Type: Run Out
\`\`\`

---

## Match Controls

### Change Bowler

\`\`\`
1. Find "Change Bowler" section
2. Click "Change Bowler" button
3. Next bowler cycles automatically
4. Bowler stays same across deliveries
\`\`\`

Bowlers cycle in configured order (wraps around)

### Manual Strike Rotation

\`\`\`
1. Find "Strike Status" section
2. Click "Rotate Strike" button
3. Striker and non-striker swap
\`\`\`

Use for:
- Correcting missed strike rotation
- Manual over-end rotation
- Testing different combinations

### Undo Last Delivery

\`\`\`
1. Find "Undo" button
2. Click "Undo Last Delivery"
3. Last ball is removed
4. All stats recalculated
5. Score, wickets, runs updated
\`\`\`

Effect:
- Removes last delivery from history
- Reverts striker/non-striker if needed
- Reduces over/ball count
- Restores previous batsman if was wicket

Limitations:
- Only undoes 1 delivery at a time
- Cannot undo if no deliveries recorded
- Undo multiple times to go back further

---

## Understanding the Scoreboard

### Score Section

**Total Score Display:**
\`\`\`
45/2 (8.3)
│  │  └─ Current over and ball
│  └──── Wickets down
└─────── Total runs
\`\`\`

### Batsmen Section

**Striker (Green highlight):**
- Current batter at crease
- Facing next delivery
- Shows: Name, Jersey, Runs, Balls, SR, 4s, 6s

**Non-Striker (Blue highlight):**
- Waiting batter at other end
- Will face after over completion or rotation
- Same statistics display

Strike Rate (SR) = (Runs/Balls) × 100

### Bowler Section

**Current Bowler:**
- Name of bowler bowling
- Runs conceded this over
- Wickets taken this over
- Overall: Overs bowled, runs, wickets, economy

Economy Rate = (Runs Conceded / Overs Bowled) × 6

### Recent Deliveries

Last 12 balls displayed:
- Dot (•): No runs
- Number (1-6): Runs scored
- W: Wicket
- Red: Special (wide, no-ball, bye)
- Colored: Boundaries (4, 6)

---

## Player Statistics

### Batting Table

| Column | Meaning | Calculation |
|--------|---------|-------------|
| Jersey | Player number | From setup |
| Name | Player name | From setup |
| Runs | Total runs scored | Sum of runs |
| Balls | Deliveries faced | Count of deliveries |
| 4s | Boundaries | Count of 4-run hits |
| 6s | Sixes | Count of 6-run hits |
| SR | Strike rate | (Runs/Balls) × 100 |
| Status | Out/In | In or Wicket Type |

Meanings:
- Out → Dismissal type shown
- In → Player still batting

### Bowling Table

| Column | Meaning | Calculation |
|--------|---------|-------------|
| Jersey | Player number | From setup |
| Name | Player name | From setup |
| Overs | Overs bowled | Count of 6-ball sets |
| Runs | Runs conceded | Sum of runs given |
| Wickets | Dismissals | Count of wickets |
| Economy | Economy rate | (Runs/Overs) × 6 |

Example Bowling Stats:
\`\`\`
Bowler: Joshi
Overs: 3.2 (3 full overs, 2 balls of 4th)
Runs: 18
Wickets: 1
Economy: 5.14 (18/3.2)
\`\`\`

---

## Match Completion

### Automatic Completion

Match ends when:
1. **All-out:** 10 wickets fall
2. **Final over:** All overs bowled and final ball delivered

### Match Status

- **In Progress:** Green status in history
- **Completed:** Blue status in history
- **Auto-saved:** Matches save automatically

### After Completion

- Cannot record new deliveries
- Can still view statistics
- Can undo to continue if needed
- Match appears in history as completed

---

## Export & Import

### Export Matches (Backup)

\`\`\`
1. Go to Match History
2. Click "Export All" button
3. JSON file downloads to computer
4. Filename: cricket-matches-[timestamp].json
5. Save in safe location
\`\`\`

File contains:
- All match data
- All deliveries and statistics
- Timestamps and metadata

### Import Matches (Restore)

\`\`\`
1. Go to Match History
2. Click "Import" button
3. Select JSON file from computer
4. Confirm import
5. All matches appear in history
\`\`\`

Before importing:
- Backup current matches first
- Ensure file is from this app
- Check file isn't corrupted

### Share Matches

\`\`\`
1. Export matches to JSON
2. Share JSON file via email/cloud
3. Recipient can import in their app
4. All match data preserved
\`\`\`

---

## Tips & Tricks

### Fast Data Entry

- Use keyboard enter to quickly record deliveries
- Tab between fields
- Use number pad for runs

### Common Mistakes

1. **Forgot to record delivery?**
   - Use "Undo" to reverse, re-enter correctly

2. **Wrong bowler change?**
   - Click "Change Bowler" again to cycle

3. **Missed strike rotation?**
   - Use "Rotate Strike" button manually

4. **Data loss?**
   - Check browser localStorage
   - Verify matches saved in history
   - Use export backup if available

### Performance Tips

- Close unnecessary tabs
- Clear old matches via export/delete
- Refresh page if app slows down
- Check browser storage available

### Accuracy

- Double-check jersey numbers before match
- Verify batting order before start
- Watch striker highlight during entry
- Review stats regularly

---

## Troubleshooting

### Cannot Start Match
**Problem:** "Start Match" button disabled or shows error

**Solution:**
1. Team A needs at least 2 batsmen
2. Team B needs at least 1 bowler
3. Both teams need players added
4. Check team tabs are configured

### Delivery Won't Record
**Problem:** "Record Delivery" button not responding

**Solution:**
1. Verify runs are 0-6
2. Check can't have both wicket and extra
3. If wicket selected, choose wicket type
4. Check match not already completed

### Match Data Lost
**Problem:** Match disappeared from history

**Solution:**
1. Check browser history/privacy settings
2. Verify localStorage isn't cleared
3. Use import if exported previously
4. Refresh page and check again

### Statistics Wrong
**Problem:** Numbers don't match expected values

**Solution:**
1. Verify deliveries recorded correctly
2. Use undo to fix any mistakes
3. Check strike rates calculated properly
4. Review delivery history

### Import Fails
**Problem:** "Import" button shows error

**Solution:**
1. Verify file is JSON format
2. Ensure file from cricket scorer export
3. Check file not corrupted
4. Try exporting again before importing

---

## Best Practices

1. **Before Match**
   - Review team names and players
   - Verify jersey numbers unique
   - Test one delivery to confirm setup
   - Take a screenshot/backup of setup

2. **During Match**
   - Verify striker highlighted correctly
   - Watch over/ball counter
   - Check stats make sense
   - Note any discrepancies immediately

3. **After Match**
   - Export as backup
   - Review final statistics
   - Note any issues for next match
   - Archive completed matches

4. **General**
   - Use export/import regularly
   - Don't rely solely on browser storage
   - Keep device storage available
   - Update app regularly

---

**Version:** 1.0.0
**Last Updated:** 2025
