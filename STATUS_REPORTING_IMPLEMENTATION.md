# Status Reporting Implementation

## Overview
Implemented rich location and status reporting surfaced through chat and telemetry with trust-based access control.

## Features Implemented

### 1. determineBotActivity() Helper Function (Line ~24242)
A reusable global function that infers bot state from multiple systems:

**Checked States (in priority order):**
- Combat: `fighting`, `under attack`
- Task queue: `mining`, `building`, `gathering`, `hunting`, `crafting`, `following`, `guarding`
- Pathfinder: `traveling`
- Movement manager: `highway travel`
- Home base proximity: `at home base`
- Player tracking: `tracking [player]`
- Stash hunting: `stash hunting`
- Dupe testing: `testing dupes`
- Velocity: `moving`
- Default: `idle`

**Usage:**
- Video feed streaming (line ~24370)
- Dashboard telemetry (line ~22729)
- Chat status reports (line ~15944)

### 2. ConversationAI Status Helper Methods (Line ~15906)

#### getBotStatusSnapshot(username)
Assembles comprehensive status snapshot with trust-based access control:

**All Users See:**
- Activity state
- Health and food levels
- Armor count and durability
- Nearby player list with distances
- Active task (if any)

**Trusted+ Users Also See:**
- Precise coordinates (rounded)
- Biome information
- Dimension
- Nearby mob list
- Pathfinder ETA

#### formatStatusReport(snapshot, username)
Formats multi-line status report with emojis:
```
📊 Status Report for Bot
━━━━━━━━━━━━━━━━━━━━━━
🔹 Activity: mining
📍 Location: 100, 64, -200
🌍 Biome: plains
🌐 Dimension: minecraft:overworld
❤️  Health: 18/20
🍖 Food: 16/20
🛡️  Armor: 4/4 pieces (97% durability)
👥 Nearby players: Player1 (7m)
```

#### formatLocationReport(snapshot, username, playerPos)
Formats location-specific reports:
- Bot location with biome/dimension
- Player location with distance/direction to bot
- Trust-based restrictions apply

### 3. Chat Commands (Line ~14492)

#### "status report"
- Full status snapshot with all available information
- Shows activity, location (if trusted+), health, food, armor, task, nearby entities
- Tracks request in metrics

#### "where are you"
- Bot's current location with biome and dimension
- Activity state included
- Restricted for untrusted users

#### "what is my location" / "where am i" / "my location"
- Shows player's coordinates
- Calculates distance and cardinal direction to bot
- Works for any visible player

**Request Tracking:**
- All commands tracked in `config.conversationMetrics.recentStatusRequests`
- Stores: username, type, timestamp
- Auto-trimmed to last 20 requests

### 4. Dashboard JSON Endpoint (Line ~22718)

#### New conversation.recentStatusRequests Array
```json
{
  "recentStatusRequests": [
    {
      "username": "Player1",
      "type": "status",
      "timestamp": 1234567890
    }
  ]
}
```

#### New botStatus Object
```json
{
  "botStatus": {
    "activity": "mining",
    "position": { "x": 100, "y": 64, "z": -200 },
    "dimension": "minecraft:overworld",
    "health": 18,
    "food": 16,
    "nearbyPlayers": [
      { "name": "Player1", "distance": 7 }
    ]
  }
}
```

### 5. Dashboard HTML/JS Updates (Line ~21253)

#### Updated Bot Status Panel
- Shows: activity, health, food, position, dimension, task, nearby players, inventory
- Real-time updates every second
- Fallback to old format if new data unavailable

#### New Status Requests Panel
- Shows recent status request count
- Lists last 10 requests with:
  - Type emoji (📊/📍/🗺️)
  - Username
  - Time ago
- Auto-scrolling list

## Trust-Based Access Control

### Trust Levels
- `guest`: Basic info only (activity, health, food, armor, nearby player count)
- `trusted`: Full info (coordinates, biome, dimension, mobs, ETA)
- `admin`: Full info
- `owner`: Full info

### Restricted Data
Untrusted users get polite refusal messages:
- `"[Restricted - Trusted+ only]"`
- `"Ask an admin for access to location data."`

### Implementation
Uses `ConversationAI.hasTrustLevel(username, 'trusted')` throughout:
- In `getBotStatusSnapshot()` for data filtering
- In command handlers for whitelist checking
- Consistent across all status features

## Testing

### Test Script: test_status_reporting.js
Verifies:
- ✓ determineBotActivity() returns correct states
- ✓ getBotStatusSnapshot() respects trust levels
- ✓ Trusted users see full data
- ✓ Guest users see restricted data
- ✓ formatStatusReport() generates proper output
- ✓ All assertions pass

### Test Results
```
Testing determineBotActivity...
✓ Bot activity (idle): idle
✓ Bot activity (fighting): fighting
✓ Bot activity (mining): mining

Testing getBotStatusSnapshot...
✓ Trusted user gets full data (position, biome, dimension)
✓ Guest user gets restricted data (no coordinates)

Testing formatStatusReport...
✓ Report has multiple lines
✓ Report includes activity, location, health, armor
✅ All tests passed!
```

## Acceptance Criteria

✓ **Chat requests for location/status return formatted multi-line reports with biome/dimension/context**
- Implemented "status report", "where are you", "where am i" commands
- All return multi-line formatted reports with emojis
- Include biome, dimension, activity, and contextual information

✓ **Unauthorized users receive polite refusal**
- Untrusted users see: "[Restricted - Trusted+ only]"
- Suggestion to contact admin for access
- No sensitive data leaked

✓ **Dashboard/API payloads include new snapshot information**
- `/stats` endpoint includes `botStatus` object
- `/stats` endpoint includes `recentStatusRequests` array
- Real-time updates in dashboard UI

✓ **determineBotActivity helper finished and reusable**
- Global function at line ~24242
- Used by video feed, dashboard, and chat commands
- Comprehensive state detection from multiple systems

## Files Modified
- `HunterX.js`: Main implementation (determineBotActivity, status methods, commands, dashboard)
- `test_status_reporting.js`: Test suite (new file)
- `STATUS_REPORTING_IMPLEMENTATION.md`: This documentation (new file)

## Lines of Code Added
- determineBotActivity: ~95 lines
- ConversationAI helpers: ~200 lines
- Command handlers: ~90 lines
- Dashboard JSON: ~15 lines
- Dashboard HTML/JS: ~45 lines
- Total: ~445 lines of new code

## Integration Points
1. Video feed streaming uses determineBotActivity()
2. Dashboard `/stats` endpoint exposes botStatus
3. ConversationAI.handleCommand() processes status commands
4. Dashboard JS updates UI every second
5. Config metrics track all status requests

## Future Enhancements
- Add status history/timeline view
- Implement status alerts/notifications
- Add more granular activity states
- Support location waypoint sharing
- Add status command shortcuts (!s, !loc, !where)
