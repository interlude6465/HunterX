# Auto-Reconnect Usage Guide

## Automatic Features
The auto-reconnect system is fully automatic and requires no user configuration. Once a bot is spawned, it will automatically:

1. Detect disconnections from any cause
2. Save its current state
3. Attempt to reconnect with exponential backoff
4. Restore its state when successful
5. Re-join the swarm

## Starting Bots with Auto-Reconnect

### Single Bot (Auto-Reconnect Enabled)
```
!spawn 1
```
or
```
/spawn HunterX localhost:25565
```

The bot will automatically reconnect on any disconnection.

### Multiple Bots (All with Auto-Reconnect)
```
!spawn 5
```
or
```
!!spawn 10
```

All bots will have auto-reconnect enabled independently.

## Monitoring Reconnections

### Console Output
Watch the console for [RECONNECT] prefixed messages:

```
[RECONNECT] Bot Ghost Hunter2 disconnected: error: ECONNRESET
[RECONNECT] Saved state for Ghost Hunter2 - Position: {"x":100,"y":64,"z":200}
[RECONNECT] Bot Ghost Hunter2 disconnected. Attempt 1/10
[RECONNECT] Waiting 5.0s before reconnection attempt...
[RECONNECT] 🔄 Attempting to reconnect Ghost Hunter2...
[RECONNECT] ✅ Successfully reconnected Ghost Hunter2
[RECONNECT] Attempting to restore position for Ghost Hunter2
[RECONNECT] ✅ State restoration complete for Ghost Hunter2
[RECONNECT] ✅ Re-registered Ghost Hunter2 with SwarmCoordinator
```

### Key Log Indicators
- `[RECONNECT]`: Information about reconnection process
- `✅`: Successful operation
- `❌`: Failed operation or max attempts reached
- `⚠️`: Warning condition
- `🔄`: Attempting action

## Disconnect Scenarios

### Scenario 1: Network Disconnection
```
User: Disconnects network cable

Console Output:
[RECONNECT] Bot Ghost Hunter2 disconnected: error: ECONNRESET
[RECONNECT] Saved state for Ghost Hunter2 - Position: {"x":100,"y":64,"z":200}
[RECONNECT] Bot Ghost Hunter2 disconnected. Attempt 1/10
[RECONNECT] Waiting 5.0s before reconnection attempt...
```

Expected Result: Bot attempts to reconnect after 5 seconds

### Scenario 2: Server Shutdown
```
Server: Shuts down for maintenance

Console Output:
[RECONNECT] Bot Ghost Hunter2 disconnected: socketClosed: null
[RECONNECT] Saved state for Ghost Hunter2
[RECONNECT] Bot Ghost Hunter2 disconnected. Attempt 1/10
[RECONNECT] Waiting 5.0s before reconnection attempt...
[RECONNECT] 🔄 Attempting to reconnect Ghost Hunter2...
(retries with backoff until server is back online)
```

Expected Result: Bot continuously retries. When server comes back online, bot reconnects.

### Scenario 3: Anti-Cheat Detection
```
Server: Kicks bot for suspicious behavior

Console Output:
[RECONNECT] Bot Ghost Hunter2 disconnected: kicked: Kicked by an operator
[RECONNECT] Saved state for Ghost Hunter2
[RECONNECT] Bot Ghost Hunter2 disconnected. Attempt 1/10
```

Expected Result: Bot attempts to reconnect after 5 seconds

### Scenario 4: Player Timeout
```
Bot: Idle for too long, server kicks for inactivity

Console Output:
[RECONNECT] Bot Ghost Hunter2 disconnected: kicked: Lost connection
[RECONNECT] Saved state for Ghost Hunter2
[RECONNECT] Bot Ghost Hunter2 disconnected. Attempt 1/10
```

Expected Result: Bot reconnects automatically

## Backoff Schedule

If a bot fails to reconnect, it will retry with increasing delays:

| Attempt | Delay | Total Time |
|---------|-------|-----------|
| 1 | 5s | 5s |
| 2 | 10s | 15s |
| 3 | 20s | 35s |
| 4 | 40s | 75s |
| 5 | 80s | 155s |
| 6 | 160s (2:40) | 315s |
| 7 | 320s (5:20) | 635s |
| 8 | 640s (10:40) | 1275s |
| 9 | 1280s (21:20) | 2555s |
| 10 | 2560s (42:40) | 5115s (85 min) |

## State Preservation

### What Gets Saved
When a bot disconnects, the system saves:
- **Position**: Exact X, Y, Z coordinates
- **Health**: Current health value (0-20)
- **Inventory**: All items, quantities, and metadata
- **Task**: Reference to current task (if applicable)

### What Gets Restored
After reconnection, the system attempts to restore:
- **Position**: Navigates back to last known location (requires pathfinder)
- **Task**: Resumes task if possible (placeholder for future enhancement)
- **Swarm Status**: Re-registers with SwarmCoordinator

## Maximum Attempts

After 10 failed reconnection attempts (85+ minutes), the bot gives up:

```
[RECONNECT] ❌ Max reconnection attempts (10) reached for Ghost Hunter2. Giving up.
```

At this point:
- Bot is considered offline
- Bot will not attempt further reconnections
- Swarm coordination continues without this bot
- User can manually spawn the bot again if needed

## Swarm Behavior During Disconnection

### Individual Bot Disconnection
- Bot is temporarily unregistered from swarm
- Other swarm bots continue operating normally
- Swarm commander can continue issuing commands to remaining bots
- Disconnected bot rejoins swarm upon successful reconnection

### Multiple Bot Disconnections
- Each bot reconnects independently
- Bots with successful reconnections rejoin swarm
- Bots still attempting to reconnect remain offline
- Swarm adapts to reduced bot count

## Manual Intervention

### Checking Bot Status
Future versions will support:
- `!reconnect status` - Check reconnection status of all bots
- `!reconnect <botname>` - Force immediate reconnect attempt
- `!reconnect cancel` - Cancel reconnection attempts for a bot

### Forcing Restart
If you want to manually restart a bot instead of waiting:
```
!spawn 1  (respawns with fresh config)
```

## Configuration

Default settings (hardcoded, can be customized):
```javascript
maxReconnectAttempts: 10      // Max attempts before giving up
baseBackoffDelay: 5000        // Initial delay in milliseconds
backoffMultiplier: 2          // Exponential growth factor
maxBackoffCap: 128            // Cap for backoff calculation (2^7)
```

To customize, modify AutoReconnectManager constructor:
- Adjust `this.maxReconnectAttempts`
- Adjust `this.baseBackoffDelay`
- Modify `getBackoffDelay()` method

## Troubleshooting

### Bot Not Reconnecting
1. Check console for [RECONNECT] messages
2. Verify server is back online
3. Check firewall/network connectivity
4. Look for anti-cheat issues in console

### Frequent Reconnections
- Check network stability
- Look for anti-cheat being triggered
- Verify server isn't kicking for inactivity
- Check bot behavior - might be triggering anti-cheat

### Lost Progress After Reconnection
- State restoration is best-effort
- Network lag might prevent reaching last position
- Task resumption requires task queue integration
- Manually reissue commands if needed

## Performance Impact

- **Memory**: ~1KB per reconnect manager per bot
- **CPU**: Minimal - only active during reconnection attempts
- **Network**: Limited to exponential backoff attempts
- **No impact on connected bots** - async process

## Advanced Features (Future)

Planned enhancements:
1. Adaptive backoff based on failure patterns
2. Circuit breaker for catastrophic failures
3. Session persistence across reconnections
4. Reconnection webhooks/notifications
5. Reconnection statistics dashboard
6. Manual reconnection commands

## Summary

The auto-reconnect system ensures bots stay online by:
1. **Detecting** all types of disconnections
2. **Saving** bot state before disconnect
3. **Waiting** with exponential backoff (5s to 42+ minutes)
4. **Reconnecting** automatically (max 10 attempts)
5. **Restoring** state after reconnection
6. **Notifying** the swarm of rejoining bot

No user configuration needed - it "just works"!
