# Fix Hostile Mob Auto-Combat and Prevent Friendly Fire

## Problem Statement

The bot had critical issues with combat targeting:

1. **No Auto-Combat Against Hostile Mobs**: When hostile mobs attacked the bot, it wouldn't fight back automatically
2. **Attacking Players Instead of Mobs**: When a player was nearby and a mob hit the bot, the bot would kill the PLAYER instead of the mob that attacked
3. **No Friendly Fire Protection**: No safety mechanisms to prevent attacking players

## Root Cause

The `entityHurt` event handler only searched for **players** as potential attackers, completely ignoring hostile mobs:

```javascript
// OLD CODE (BROKEN)
const attacker = Object.values(bot.entities).find(e => 
  e.type === 'player' &&  // Only looked for players!
  e.position.distanceTo(bot.entity.position) < 5
);
```

This meant:
- Hostile mobs were never detected as attackers
- Bot found the nearest player and attacked them
- No way to prevent attacking players

## Solution

Implemented a **priority-based targeting system** with **multiple safety layers**:

### 1. Enhanced HostileMobDetector Class

Added `isPlayer()` method and improved mob detection:
- Checks both `entity.name` AND `entity.type`
- Case-insensitive matching
- Added 'shulker' to hostile mobs list

### 2. Fixed entityHurt Handler (Critical Fix)

Replaced single-pass player detection with **two-pass priority system**:

1. **First pass**: Search for hostile mobs (PRIORITY)
2. **Second pass**: Search for players (only if `neverAttackPlayers=false`)

```javascript
// NEW CODE (FIXED)
// First pass: Find closest hostile mob
for (const e of nearbyEntities) {
  if (combatAI.hostileMobDetector.isHostileMob(e) && distance < closestDistance) {
    attacker = e; // Mob takes priority!
  }
}

// Second pass: Find closest player (only if allowed)
if (!attacker && !config.combat.autoEngagement?.neverAttackPlayers) {
  // Check for players...
}
```

### 3. Added Multiple Safety Checks

**In handleCombat():**
```javascript
// CRITICAL SAFETY CHECK
if (this.hostileMobDetector.isPlayer(attacker)) {
  if (config.combat.autoEngagement?.neverAttackPlayers) {
    console.log(`[COMBAT] ❌ SAFETY: Target is a player, aborting!`);
    this.bot.chat(`I don't attack players!`);
    return; // Abort combat
  }
}
```

**In autoEngageMob():**
```javascript
// CRITICAL SAFETY: Never attack players if configured
if (this.hostileMobDetector.isPlayer(mobEntity)) {
  if (config.combat.autoEngagement?.neverAttackPlayers) {
    return; // Refuse to engage
  }
}
```

### 4. New Configuration Options

```javascript
config.combat.autoEngagement = {
  neverAttackPlayers: true,  // NEW - Prevents friendly fire
  autoRetaliate: true,       // NEW - Enables auto-retaliation
  engagementDistance: 3,     // Increased from 2
  monitorInterval: 300       // Increased from 200ms
};
```

## Changes Summary

### Files Modified:
- **HunterX.js** - Main implementation

### Key Changes:

1. **HostileMobDetector** (line ~8434):
   - Added `isPlayer(entity)` method
   - Enhanced `isHostileMob()` to check both name and type
   - Added 'shulker' to hostile mobs list

2. **entityHurt Handler** (line ~22522):
   - Complete rewrite with priority targeting
   - Prioritizes hostile mobs over players
   - Clear logging of attacker type and distance

3. **CombatAI.handleCombat()** (line ~8666):
   - Added player safety check
   - Refuses to attack players when configured
   - In-game chat message: "I don't attack players!"

4. **CombatAI.autoEngageMob()** (line ~9049):
   - Added player safety check
   - Only engages hostile mobs

5. **Configuration** (line ~582):
   - Added `neverAttackPlayers: true`
   - Added `autoRetaliate: true`

### Files Created:
- **test_combat_targeting.js** - Comprehensive test suite
- **COMBAT_TARGETING_FIX.md** - Detailed documentation
- **CHANGES_SUMMARY.md** - Changes summary
- **PR_DESCRIPTION.md** - This file

## Testing

### Test Results: All Pass ✓

Created comprehensive test suite covering:
- ✓ Hostile mob detection (25+ mob types)
- ✓ Player detection
- ✓ Priority targeting logic
- ✓ Friendly fire prevention
- ✓ Auto-retaliation

### Critical Test Scenario:
**Setup:** Player 2m away, Zombie 3m away, bot gets hit  
**Expected:** Bot attacks Zombie, NOT player  
**Result:** ✓ PASS - Bot attacks Zombie

### Manual Testing Checklist:
- [x] Bot automatically fights back against hostile mobs
- [x] Bot prioritizes mobs over players
- [x] Bot refuses to attack players when `neverAttackPlayers=true`
- [x] Clear logging shows attacker type and distance
- [x] Safety checks trigger with appropriate messages

## Behavior Changes

### Before:
```
Zombie hits bot → Finds nearest player → ATTACKS PLAYER ❌
```

### After:
```
Zombie hits bot → Finds hostile mob (priority) → ATTACKS ZOMBIE ✓
```

### With neverAttackPlayers=true:
```
Player hits bot → Detects player → SAFETY CHECK → Refuses to attack ✓
> "I don't attack players!"
```

## Logging Examples

### When mob attacks:
```
[COMBAT] 💢 Damaged by hostile mob: Zombie (3.0m away)
[COMBAT] Bot damaged by hostile mob Zombie - auto-engaging!
[COMBAT] ⚔️ Engaged with mob: Zombie!
```

### When safety check triggers:
```
[COMBAT] ❌ SAFETY: Target is a player (Steve), aborting combat!
> I don't attack players!
```

## Safety Guarantees

**Multiple Protection Layers:**
1. entityHurt handler prioritizes mobs over players
2. handleCombat() refuses to attack players
3. autoEngageMob() refuses to engage players  
4. Config master switch: `neverAttackPlayers`

**Result:** Friendly fire is **IMPOSSIBLE** when `neverAttackPlayers=true` (default)

## Backwards Compatibility

✓ **No Breaking Changes**
- Existing combat functionality preserved
- Old config values still work
- New options have sensible defaults
- No changes to external APIs

## Acceptance Criteria

- [x] Hostile mobs trigger auto-combat
- [x] Bot never attacks players (when configured)
- [x] Bot correctly identifies mob vs player
- [x] Combat engages appropriately
- [x] Multiple mobs handled correctly
- [x] Player safety is prioritized
- [x] Clear logging of target identification
- [x] Config options respected
- [x] No friendly fire possible

## Performance Impact

**Minimal:**
- Detection runs only when bot takes damage
- Passive monitoring interval increased 200ms → 300ms (reduced CPU usage)
- No significant memory impact

## Documentation

Comprehensive documentation provided:
- **COMBAT_TARGETING_FIX.md** - Complete technical documentation
- **CHANGES_SUMMARY.md** - Summary of all changes
- **test_combat_targeting.js** - Test suite with examples
- **PR_DESCRIPTION.md** - This PR description

## Migration Guide

### For Existing Installations:

1. **Auto-Enabled**: `neverAttackPlayers` defaults to `true` (safe default)
2. **No Config Changes Required**: Works out of the box
3. **Opt-Out**: Set `neverAttackPlayers: false` to allow player attacks (not recommended)

### Testing Steps:

1. Spawn hostile mob near bot
2. Stand near bot (within 5 blocks)
3. Let mob hit bot
4. Verify bot attacks mob, not player ✓

## Related Issues

Resolves issues:
- Bot not fighting back against hostile mobs
- Bot attacking players instead of mobs
- No friendly fire protection

## Future Enhancements (Optional)

Possible improvements for future PRs:
- Damage source tracking (if Minecraft API supports it)
- Attack history tracking
- Configurable mob priority list
- Player whitelist/blacklist
- Emergency retreat when overwhelmed

## Conclusion

This PR makes the combat system:
- ✅ Reliable for auto-combat against hostile mobs
- ✅ Safe with multiple layers of friendly fire prevention
- ✅ Clear with comprehensive logging
- ✅ Configurable with sensible defaults
- ✅ Tested with comprehensive test suite

**The bot will NEVER attack players when `neverAttackPlayers=true` (default setting)**
