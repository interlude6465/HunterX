# Tunnel Digging Test Cases

## Test Case 1: Underground Diamond - Surrounded by Stone

**Scenario**: Diamond ore at Y=-20, completely surrounded by stone blocks

```
World State:
  - Bot position: 0, 64, 0 (above ground)
  - Target ore: -6, -20, -15
  - Surroundings: Stone, deepslate, granite

Test Steps:
  1. Bot scans for diamond ore
  2. Finds ore at (-6, -20, -15)
  3. Attempts standard pathfinding
  4. Pathfinding fails (no accessible path)
  5. Activates tunnel digging
  6. Tunnels downward and horizontally
  7. Breaks stone, deepslate blocks
  8. Creates 3x3 tunnel

Expected Output:
  [HUNTER] 🔍 Starting hunt for 5x diamond
  [HUNTER] ⚠️ Standard pathfinding failed: Path was stopped before it could be completed!
  [HUNTER] 🕳️ Attempting tunnel digging to ore at -6, -20, -15...
  [TUNNEL] 🕳️ Starting tunnel from 0.5, 64.5, 0.5 to -6, -20, -15
  [TUNNEL] ⛏️ Breaking stone at -1, 63, 0
  [TUNNEL] ⛏️ Breaking deepslate at -2, 62, -1
  ... (multiple break messages)
  [TUNNEL] ✅ Reached target block (0.8 blocks away) after 45 attempts
  [HUNTER] ✅ Tunnel digging successful!
  [HUNTER] ✅ Successfully mined deepslate_diamond_ore with diamond_pickaxe
  [HUNTER] ✅ Success! Found 5x diamond

Expected Result: ✅ PASS - Ore successfully mined
```

## Test Case 2: Ore in Cavern

**Scenario**: Iron ore in underground cavern with no surface-level access

```
World State:
  - Bot position: 100, 64, 100
  - Target ore: 50, -30, 50
  - Surroundings: Mixed cavern with stone, ore, air pockets

Test Steps:
  1. Bot finds iron ore at (50, -30, 50)
  2. Multiple approach positions attempted
  3. Standard pathfinding fails (cavern is partially air-filled)
  4. Tunnel digging activated
  5. Digs through stone walls to reach cavern
  6. Navigates within cavern to ore

Expected Output:
  [HUNTER] 🔍 Starting hunt for 10x iron_ore
  [HUNTER] ⚠️ Standard pathfinding failed: Path was stopped before it could be completed!
  [HUNTER] 🕳️ Attempting tunnel digging to ore at 50, -30, 50...
  [TUNNEL] 🕳️ Starting tunnel from 100.5, 64.5, 100.5 to 50, -30, 50
  [TUNNEL] ⛏️ Breaking stone at 99, 63, 99
  [TUNNEL] 📍 Progress: 87.2 blocks away (attempt 20/200)
  [TUNNEL] 📍 Progress: 42.5 blocks away (attempt 40/200)
  [TUNNEL] ✅ Reached target block (1.2 blocks away) after 72 attempts
  [HUNTER] ✅ Tunnel digging successful!
  [HUNTER] ✅ Successfully mined iron_ore with iron_pickaxe

Expected Result: ✅ PASS - Cavern ore accessed and mined
```

## Test Case 3: Multiple Ore in Sequence

**Scenario**: Three ore blocks requiring sequential tunneling

```
World State:
  - Ore 1: -10, -20, -15 (surrounded by stone)
  - Ore 2: -20, -20, -25 (40 blocks from Ore 1)
  - Ore 3: -30, -20, -35 (50 blocks from Ore 2)
  - All surrounded by solid blocks

Test Steps:
  1. Bot mines first ore with tunnel digging
  2. Bot moves to second ore location
  3. Tunnels to second ore
  4. Mines second ore
  5. Moves to third ore location
  6. Tunnels to third ore
  7. Mines third ore

Expected Output:
  [HUNTER] 🔍 Starting hunt for 15x diamond
  [TUNNEL] 🕳️ Starting tunnel from 0.5, 64.5, 0.5 to -10, -20, -15
  [TUNNEL] ✅ Reached target block after 45 attempts
  [HUNTER] ✅ Successfully mined deepslate_diamond_ore
  
  [TUNNEL] 🕳️ Starting tunnel from -10.5, -20.5, -15.5 to -20, -20, -25
  [TUNNEL] ✅ Reached target block after 32 attempts
  [HUNTER] ✅ Successfully mined deepslate_diamond_ore
  
  [TUNNEL] 🕳️ Starting tunnel from -20.5, -20.5, -25.5 to -30, -20, -35
  [TUNNEL] ✅ Reached target block after 38 attempts
  [HUNTER] ✅ Successfully mined deepslate_diamond_ore
  
  [HUNTER] ✅ Success! Found 15x diamond

Expected Result: ✅ PASS - All ore in sequence successfully mined
```

## Test Case 4: Ore Under Water/Lava

**Scenario**: Diamond ore under water lake

```
World State:
  - Bot position: 0, 64, 0
  - Target ore: -50, -30, -50 (under water)
  - Water level: 60-35
  - Ore surrounded by stone below water

Test Steps:
  1. Bot finds ore under water
  2. Attempts standard pathfinding (fails)
  3. Tunnel digging activated
  4. Bot digs through stone (not through water)
  5. Creates tunnel up to water level
  6. Stops at water (cannot tunnel through)

Expected Output:
  [HUNTER] ⚠️ Standard pathfinding failed: Path was stopped before it could be completed!
  [HUNTER] 🕳️ Attempting tunnel digging to ore at -50, -30, -50...
  [TUNNEL] 🕳️ Starting tunnel from 0.5, 64.5, 0.5 to -50, -30, -50
  [TUNNEL] ⛏️ Breaking stone at -1, 63, 0
  ... (continues digging)
  [TUNNEL] ❌ Failed to tunnel to block after 200 attempts (15.3 blocks away)
  [HUNTER] ❌ Tunnel digging also failed: Failed to tunnel to block after 200 attempts

Expected Result: ✅ PASS - Graceful failure due to water obstacle
Note: Future enhancement will add water bucket support
```

## Test Case 5: Already Near Ore

**Scenario**: Bot starts very close to ore (within 2.5 blocks)

```
World State:
  - Bot position: -5.5, -20, -14.5
  - Target ore: -6, -20, -15
  - Distance: 0.7 blocks

Test Steps:
  1. Bot finds ore at (-6, -20, -15)
  2. Calculates initial distance: 0.7 blocks
  3. tunnelToBlock() called
  4. Immediate return (within threshold)

Expected Output:
  [TUNNEL] 🕳️ Starting tunnel from -5.5, -20, -14.5 to -6, -20, -15
  [TUNNEL] ✅ Already near target block (0.7 blocks away)
  [HUNTER] ✅ Successfully mined deepslate_diamond_ore

Expected Result: ✅ PASS - Early exit, mining proceeds immediately
```

## Test Case 6: Pathfinding Partially Works

**Scenario**: Pathfinding reaches close to ore but not exact position

```
World State:
  - Bot position: 0, 64, 0
  - Target ore: 30, 20, 30
  - Candidate positions: [31,21,30], [30,21,31], [30,20,30] (some accessible)
  - One candidate reachable via pathfinding

Test Steps:
  1. Bot attempts pathfinding to first candidate (fails)
  2. Bot attempts second candidate (fails)
  3. Bot attempts third candidate (succeeds)
  4. Bot reaches position, mines ore

Expected Output:
  [HUNTER] ⚠️ Standard pathfinding failed for position 1
  [HUNTER] ⚠️ Standard pathfinding failed for position 2
  [HUNTER] ✅ Standard pathfinding succeeded for position 3
  [HUNTER] ✅ Successfully mined diamond_ore

Expected Result: ✅ PASS - Standard pathfinding preferred when available
Note: Tunnel digging only used after ALL candidates fail
```

## Test Case 7: Long Distance Tunneling

**Scenario**: Ore 150 blocks away (within 200-attempt limit)

```
World State:
  - Bot position: 0, 64, 0
  - Target ore: 150, 20, 0
  - Distance: 150 blocks
  - Surrounded by stone

Test Steps:
  1. Bot attempts pathfinding (fails - underground)
  2. Tunnel digging activated
  3. Tunnel digs 150 blocks horizontally
  4. Progress updates every 20 attempts
  5. Reaches ore after ~200 attempts

Expected Output:
  [TUNNEL] 🕳️ Starting tunnel from 0.5, 64.5, 0.5 to 150, 20, 0
  [TUNNEL] 📍 Progress: 150.0 blocks away (attempt 20/200)
  [TUNNEL] 📍 Progress: 120.3 blocks away (attempt 40/200)
  [TUNNEL] 📍 Progress: 90.1 blocks away (attempt 60/200)
  [TUNNEL] 📍 Progress: 60.5 blocks away (attempt 80/200)
  [TUNNEL] 📍 Progress: 30.2 blocks away (attempt 100/200)
  [TUNNEL] ✅ Reached target block (0.4 blocks away) after 200 attempts
  [HUNTER] ✅ Successfully mined ore

Expected Result: ✅ PASS - Long distance tunneling successful
```

## Test Case 8: Very Deep Underground

**Scenario**: Ore at bedrock level (Y=-63)

```
World State:
  - Bot position: 0, 64, 0
  - Target ore: 0, -63, 0 (bedrock level)
  - Must descend 127 blocks

Test Steps:
  1. Bot finds ore at bedrock
  2. Pathfinding fails
  3. Tunnel digging attempts downward
  4. Digs 127 blocks down to reach ore

Expected Output:
  [TUNNEL] 🕳️ Starting tunnel from 0.5, 64.5, 0.5 to 0, -63, 0
  [TUNNEL] ⛏️ Breaking stone at 0, 63, 0
  [TUNNEL] ⛏️ Breaking deepslate at 0, 62, 0
  [TUNNEL] 📍 Progress: 127.0 blocks away (attempt 20/200)
  [TUNNEL] 📍 Progress: 95.2 blocks away (attempt 40/200)
  [TUNNEL] ✅ Reached target block after 150 attempts

Expected Result: ✅ PASS - Deep vertical mining successful
```

## Test Case 9: Disconnection During Tunneling

**Scenario**: Bot disconnects mid-tunnel

```
World State:
  - Bot tunneling to ore
  - After 50 attempts, bot.entity becomes null

Test Steps:
  1. tunnelToBlock() called
  2. Loop iteration 50: bot.entity check fails
  3. Error thrown

Expected Output:
  [TUNNEL] 🕳️ Starting tunnel from 0.5, 64.5, 0.5 to -6, -20, -15
  ... (progress messages)
  [TUNNEL] ❌ Bot disconnected during tunneling
  [HUNTER] ❌ Tunnel digging also failed: Bot disconnected during tunneling
  [AUTO_RECONNECT] 🔄 Bot disconnected, attempting reconnect...

Expected Result: ✅ PASS - Graceful error handling, auto-reconnect triggered
```

## Test Case 10: Invalid Target Position

**Scenario**: Invalid ore position (NaN coordinates)

```
World State:
  - mineBlockEntry receives invalid position
  - position: {x: NaN, y: NaN, z: NaN}

Test Steps:
  1. tunnelToBlock() called with invalid position
  2. Validation check fails

Expected Output:
  [HUNTER] ❌ Invalid target block position
  [HUNTER] ❌ Tunnel digging also failed: Invalid target block position

Expected Result: ✅ PASS - Invalid position caught and reported
```

## Test Case 11: Tunnel Success, But Block Changed

**Scenario**: Ore changes during tunneling (block broken/replaced)

```
World State:
  - Bot tunnels successfully to ore position
  - During tunneling, ore is replaced with stone

Test Steps:
  1. tunnelToBlock() reaches target successfully
  2. Returns to mineBlockEntry()
  3. Block verification fails

Expected Output:
  [TUNNEL] ✅ Reached target block (0.5 blocks away) after 45 attempts
  [HUNTER] ⚠️ Target block no longer exists at position
  [HUNTER] ❌ Failed to mine (block changed)

Expected Result: ✅ PASS - Block change detected and handled
```

## Test Case 12: Multiple Ores at Same Level

**Scenario**: Three ore blocks at same Y-level, in a line

```
World State:
  - Ore 1: (-10, -20, -15)
  - Ore 2: (-20, -20, -15)  (10 blocks away horizontally)
  - Ore 3: (-30, -20, -15)  (10 blocks away from Ore 2)
  - All same Y-level, separated horizontally

Test Steps:
  1. Bot tunnels to Ore 1
  2. From Ore 1 position, tunnels horizontally to Ore 2
  3. From Ore 2 position, tunnels horizontally to Ore 3

Expected Output:
  [TUNNEL] 🕳️ Starting tunnel from 0.5, 64.5, 0.5 to -10, -20, -15
  [TUNNEL] ✅ Reached target block after 50 attempts
  
  [TUNNEL] 🕳️ Starting tunnel from -10.5, -20.5, -15.5 to -20, -20, -15
  [TUNNEL] ✅ Reached target block after 25 attempts (shorter distance)
  
  [TUNNEL] 🕳️ Starting tunnel from -20.5, -20.5, -15.5 to -30, -20, -15
  [TUNNEL] ✅ Reached target block after 25 attempts

Expected Result: ✅ PASS - Sequential horizontal mining efficient
```

## Summary

All test cases validate:
- ✅ Core tunneling functionality
- ✅ Fallback from pathfinding to tunneling
- ✅ Error handling and edge cases
- ✅ Long-distance and deep mining
- ✅ Multiple ore mining sequences
- ✅ Block change detection
- ✅ Graceful failure modes

## Automation

To run these tests automatically:

```bash
# Enable tunnel digging logging
node HunterX.js --log tunnel

# Run test scenarios
npm test -- --tunnel-digging
```

## Notes

- Each test case includes expected console output for verification
- Status updates occur every 20 attempts (configurable)
- Tunnel digging timeout: 200 attempts per ore
- Distance threshold for "reached": 2.5 blocks
- All emoji indicators help identify operation type during logging
