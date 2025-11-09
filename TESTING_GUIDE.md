# Testing Guide - Cricket Scoreboard

## Quick Start Test

### Prerequisites:
```bash
cd E:\Work\repo\cricket-scoreboard\cricket-scoreboard
npm install  # If not already done
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Test Scenario 1: Complete T20 Match (Quick Test)

### Step 1: Create Match
1. Click "New Match"
2. Select "T20" (should auto-set to 20 overs)
3. **Team 1**: Change name to "Mumbai Indians"
4. Add players:
   - #10 Rohit Sharma
   - #33 Hardik Pandya
   - #7 Ishan Kishan
5. Check all 3 players for batting order
6. **Team 2**: Change name to "Chennai Super Kings"
7. Add players:
   - #7 MS Dhoni
   - #18 Ravindra Jadeja
   - #2 Ruturaj Gaikwad
8. Check all 3 players for batting order
9. Click "Start Match"

**Expected**: Should go to Innings 1 setup

### Step 2: Set Up Innings 1
1. Verify batting order shows Mumbai Indians players
2. Select all Chennai Super Kings players as bowlers
3. Click "Start Innings 1"

**Expected**: Should go to match view with:
- Mumbai Indians batting
- Chennai Super Kings bowling
- Rohit Sharma as striker
- Hardik Pandya as non-striker

### Step 3: Record Some Deliveries

**Ball 1: Normal delivery**
- Runs: 4
- Click "Record Ball"
- **Expected**: 4 runs added, strike stays with Rohit (even runs)

**Ball 2: Single**
- Runs: 1
- Click "Record Ball"
- **Expected**: 1 run added, strike rotates to Hardik (odd runs)

**Ball 3: Wide**
- Check "Wide"
- Runs: 1 (auto-filled)
- Click "Record Ball"
- **Expected**: 1 run added, still ball 3 (wide doesn't count), still Hardik on strike

**Ball 4: No Ball with Free Hit**
- Check "No Ball"
- Runs: 2
- Click "Record Ball"
- **Expected**: 3 runs total (1 no-ball + 2 runs), still ball 4, FREE HIT indicator shows

**Ball 5: Free Hit - Wicket attempt (should not count)**
- Runs: 6
- Check "Wicket", select "Bowled"
- Click "Record Ball"
- **Expected**: ERROR - "On free hit, only run out is allowed"

**Ball 5 (retry): Free Hit - Six**
- Runs: 6
- Click "Record Ball"
- **Expected**: 6 runs added, free hit clears, still Hardik on strike

**Ball 6: Wicket**
- Runs: 0
- Check "Wicket", select "Caught"
- Click "Record Ball"
- **Expected**: Hardik out, Ishan Kishan comes in as new striker

**Ball 7 (Over 2): Auto rotation**
- Runs: 0
- Click "Record Ball"
- **Expected**: Strike rotates to Rohit (over completed)

### Step 4: Check Statistics
1. Click "Batting" tab in Player Stats
2. **Expected**:
   - Rohit: 4 runs, 1 ball
   - Hardik: 9 runs (1+2+6), OUT (Caught)
   - Ishan: 0 runs, 1 ball

3. Click "Bowling" tab
4. **Expected**: Chennai bowler shows 1 over, runs conceded, 1 wicket

### Step 5: Complete Innings 1
1. Click "Undo Last Ball" to test undo
2. **Expected**: Last delivery removed, ball count decreases
3. Continue recording deliveries OR manually complete innings
4. When innings complete, click "Start 2nd Innings"

**Expected**: Should go to Innings 2 setup

### Step 6: Set Up Innings 2
1. **Expected**: Chennai Super Kings batting, Mumbai Indians bowling
2. Select Mumbai bowlers
3. **Expected**: Target should be shown (Mumbai's score + 1)
4. Click "Start Innings 2"

### Step 7: Test Target Achievement
1. Record deliveries until Chennai's score > Mumbai's score
2. **Expected**: "TARGET ACHIEVED!" message should appear
3. Click "View Summary"

### Step 8: Verify Match Summary
**Expected to see**:
- Winner: Chennai Super Kings (or Mumbai Indians based on your test)
- Margin: "by X wickets" or "by X runs"
- Best Batsman highlighted
- Best Bowler highlighted
- Complete scorecards for both innings
- Detailed statistics

---

## Test Scenario 2: ODI Match

### Quick Setup:
1. New Match → Select "ODI"
2. Verify overs = 50
3. Add teams and players
4. Complete match workflow

**Test Points**:
- ✅ 50 overs per innings
- ✅ Longer match simulation
- ✅ All rules apply

---

## Test Scenario 3: Custom Match

### Setup:
1. New Match → Select "CUSTOM"
2. Set overs to 10
3. Complete match with 10-over format

**Test Points**:
- ✅ Custom overs work
- ✅ All features available

---

## Feature-Specific Tests

### Test: All Extras
1. **Wide**: 1 run, doesn't count as ball
2. **No Ball**: 1 run + batsman runs, doesn't count, free hit next
3. **Bye**: Runs don't credit to batsman
4. **Leg Bye**: Runs don't credit to batsman

### Test: Strike Rotation
- Odd runs (1,3,5): ✅ Rotate
- Even runs (0,2,4,6): ✅ No rotate
- Over end: ✅ Always rotate
- Wicket: ✅ No rotate

### Test: Wicket Types
Try all 8 wicket types:
1. Caught
2. Bowled
3. LBW
4. Run Out
5. Stumped
6. Hit Wicket
7. Handled Ball
8. Obstructing

### Test: Match Controls
- **Rotate Strike**: Manually swap batsmen
- **Change Bowler**: Cycle to next bowler
- **Undo**: Remove last delivery, recalculate everything
- **Save**: Save match to localStorage

### Test: Innings Completion
1. **10 Wickets**: Record 10 wickets → innings ends
2. **All Overs**: Record all overs → innings ends
3. **Target Achieved**: In innings 2, exceed target → match ends

---

## Browser Testing

### Chrome/Edge:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Verify "cricket_matches" key exists
4. Check data structure

### Storage Test:
1. Create match and record some deliveries
2. Refresh page (F5)
3. **Expected**: Match auto-saved
4. Go to Match History
5. Click "Load" on the match
6. **Expected**: Match resumes from where you left

### Export/Import Test:
1. Create complete match
2. Go to Match History
3. Click "Export All"
4. Save JSON file
5. Delete the match
6. Click "Import"
7. Select the JSON file
8. **Expected**: Match restored

---

## Edge Cases to Test

### 1. No-Ball Free Hit Chain
- Record no-ball → free hit appears
- Record another no-ball on free hit → free hit continues
- Record legal delivery → free hit clears

### 2. Last Ball of Over with Odd Runs
- Ball 6 of over, score 1 run
- **Expected**: Strike rotates twice (once for odd, once for over end)
- Result: Should end up with same batsman on strike

### 3. Wicket on Last Ball
- Ball 6 of over, wicket
- **Expected**: New batsman comes, strike rotates to other end

### 4. All Out Before Overs Complete
- Get 10 wickets in 5 overs
- **Expected**: Innings ends immediately, shows "All Out"

### 5. Exact Target Chase
- Innings 1: 100 runs
- Innings 2: Score exactly 101
- **Expected**: Match ends, winner determined

### 6. No Runs Scored
- Record deliveries with 0 runs
- **Expected**: Stats show 0, no errors

---

## Performance Testing

### Large Match:
1. Create TEST match (90 overs)
2. Simulate full match with many deliveries
3. **Expected**:
   - No lag in recording deliveries
   - Stats calculate correctly
   - Summary loads properly

### Multiple Matches:
1. Create 5-10 matches
2. Save all
3. Go to Match History
4. **Expected**:
   - All matches listed
   - Can load any match
   - Export/Import works

---

## Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Ensure all teams have players in batting order

### Issue: Strike doesn't rotate
**Solution**: Check if runs are odd/even, verify over completion logic

### Issue: Stats don't update
**Solution**: Refresh component, check deliveries array

### Issue: Match doesn't save
**Solution**: Check browser localStorage is enabled, not in private mode

### Issue: Summary doesn't load
**Solution**: Ensure both innings are completed

---

## Acceptance Criteria Checklist

### Match Setup:
- [ ] Can select T20/ODI/TEST/CUSTOM
- [ ] Can name both teams
- [ ] Can add players with jersey numbers
- [ ] Can configure batting orders
- [ ] Validation works (min 2 players per team)

### Innings 1:
- [ ] Team 1 bats, Team 2 bowls
- [ ] Can select bowlers
- [ ] Deliveries record correctly
- [ ] All extras work (Wide, No-ball, Bye, Leg-bye)
- [ ] Strike rotation correct
- [ ] Wickets handled properly
- [ ] Stats calculate correctly
- [ ] Innings ends at 10 wickets or all overs

### Innings 2:
- [ ] Teams swap correctly
- [ ] Team 2 bats, Team 1 bowls
- [ ] Target shown
- [ ] Required run rate shown
- [ ] Target achievement detected
- [ ] All innings 1 features work

### Match Summary:
- [ ] Winner determined correctly
- [ ] Margin calculated (runs or wickets)
- [ ] Best batsman identified
- [ ] Best bowler identified
- [ ] Complete scorecards shown
- [ ] Both innings statistics displayed

### Storage:
- [ ] Auto-save works
- [ ] Can load matches
- [ ] Can delete matches
- [ ] Export to JSON works
- [ ] Import from JSON works

---

## Final Verification

Run through one complete match from start to finish:

```
✅ New Match Setup
✅ Innings 1 Complete
✅ Innings 2 Setup
✅ Innings 2 Complete
✅ Match Summary
✅ Back to History
✅ Match Saved
✅ Can Reload Match
```

If all steps complete successfully, your cricket scoreboard is **FULLY FUNCTIONAL**! 🎉

---

## Troubleshooting

### Clear All Data:
```javascript
// In browser console (F12)
localStorage.removeItem('cricket_matches')
```

### Check Match Data:
```javascript
// In browser console
const matches = JSON.parse(localStorage.getItem('cricket_matches'))
console.log(matches)
```

### Force Reload:
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

---

**Happy Testing! 🏏**

If you encounter any issues, check:
1. Browser console for errors (F12)
2. Network tab for failed requests
3. React DevTools for component state
4. localStorage for data persistence
