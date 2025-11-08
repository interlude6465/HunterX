# Combat Targeting Fix - Prevent Friendly Fire

## Issues Resolved

### 1. **Auto-Combat Not Working Against Hostile Mobs**
- **Problem**: Hostile mobs would attack the bot but the bot wouldn't fight back automatically
- **Root Cause**: The `entityHurt` handler only searched for players as attackers, completely ignoring hostile mobs
- **Solution**: Updated the handler to detect BOTH players AND hostile mobs, with priority given to hostile mobs

### 2. **Bot Attacking Players Instead of Mobs**
- **Problem**: When a player was nearby and a mob hit the bot, the bot would kill the PLAYER instead of the mob
- **Root Cause**: The attacker detection logic only looked for players, so it found the nearest player and attacked them
- **Solution**: Implemented priority-based targeting that checks for hostile mobs FIRST before considering players

### 3. **No Friendly Fire Protection**
- **Problem**: Bot could attack players when it should only attack hostile mobs
- **Root Cause**: No safety checks to distinguish between hostile entities and players
- **Solution**: Added `neverAttackPlayers` config option and multiple safety checks throughout the combat system

---

## Implementation Details

### HostileMobDetector Class (Line ~8434)

Enhanced with new methods and improved detection:

```javascript
class HostileMobDetector {
  HOSTILE_MOBS = [
    'zombie', 'creeper', 'skeleton', 'spider', 'cave_spider',
    'enderman', 'witch', 'wither_skeleton', 'blaze', 'ghast',
    'magma_cube', 'silverfish', 'endermite', 'evoker', 'vindicator',
    'pillager', 'ravager', 'drowned', 'husk', 'stray',
    'piglin', 'piglin_brute', 'zoglin', 'phantom', 'shulker'
  ];
  
  isHostileMob(entity) {
    // Checks both entity.name AND entity.type for hostile mobs
    // Handles case-insensitive matching
  }
  
  isPlayer(entity) {
    // Returns true if entity.type === 'player' OR has username property
  }
  
  isPlayerAttacking(player) {
    // Checks player metadata for attacking state
  }
}
```

**Key Features:**
- Comprehensive list of hostile mobs (25+ types)
- Checks both `entity.name` and `entity.type` for reliable detection
- Case-insensitive matching (works with "Zombie" or "zombie")
- Identifies players by type or username property

---

### entityHurt Handler (Line ~22522)

Completely rewritten to properly identify attackers:

**OLD CODE (BROKEN):**
```javascript
bot.on('entityHurt', async (entity) => {
  if (entity === bot.entity) {
    const attacker = Object.values(bot.entities).find(e => 
      e.type === 'player' &&  // Only looked for players!
      e.position.distanceTo(bot.entity.position) < 5
    );
    // ... would attack the player, ignoring the mob
  }
});
```

**NEW CODE (FIXED):**
```javascript
bot.on('entityHurt', async (entity) => {
  if (entity === bot.entity) {
    // Find the actual attacker - prioritize hostile mobs over players
    let attacker = null;
    let closestDistance = Infinity;
    const attackRange = 5; // blocks
    
    // First pass: Check for hostile mobs (PRIORITY)
    for (const e of nearbyEntities) {
      if (combatAI.hostileMobDetector.isHostileMob(e) && distance < closestDistance) {
        closestDistance = distance;
        attacker = e;
      }
    }
    
    // Second pass: Check for players (only if neverAttackPlayers is false)
    if (!attacker && !config.combat.autoEngagement?.neverAttackPlayers) {
      for (const e of nearbyEntities) {
        if (e.type === 'player' && distance < closestDistance) {
          closestDistance = distance;
          attacker = e;
        }
      }
    }
    
    // Log clear information about what attacked
    console.log(`[COMBAT] 💢 Damaged by ${attackerType}: ${attackerName} (${closestDistance.toFixed(1)}m away)`);
    
    // Engage with proper safety checks
    if (attacker && combatAI && config.combat.autoEngagement?.autoRetaliate) {
      await combatAI.handleCombat(attacker);
    }
  }
});
```

**Key Improvements:**
1. **Two-pass targeting system:**
   - First pass: Find closest hostile mob
   - Second pass: Find closest player (only if allowed)
2. **Distance-based selection:** Finds the CLOSEST hostile entity
3. **Clear logging:** Shows entity type, name, and distance
4. **Respects config options:** Honors `neverAttackPlayers` and `autoRetaliate` settings

---

### handleCombat Method (Line ~8666)

Added critical safety checks at the beginning:

```javascript
async handleCombat(attacker) {
  // Null checks
  if (!attacker || !attacker.position) {
    return;
  }
  
  // CRITICAL SAFETY CHECK: Never attack players if configured
  if (this.hostileMobDetector.isPlayer(attacker)) {
    if (config.combat.autoEngagement?.neverAttackPlayers) {
      console.log(`[COMBAT] ❌ SAFETY: Target is a player (${attacker.username}), aborting combat!`);
      this.bot.chat(`I don't attack players!`);
      return;
    }
    console.log(`[COMBAT] ⚠️ Warning: Engaging player ${attacker.username}`);
  }
  
  // Safety check: Verify target is hostile
  if (!this.hostileMobDetector.isHostileMob(attacker) && !this.hostileMobDetector.isPlayer(attacker)) {
    console.log(`[COMBAT] ❌ SAFETY: Target is not hostile, aborting combat!`);
    return;
  }
  
  // ... proceed with combat
}
```

**Protection Layers:**
1. Checks if target is a player and `neverAttackPlayers` is enabled → abort
2. Verifies target is either a hostile mob or player (not passive mob) → abort if neither
3. Clear logging and in-game chat message when safety check triggers

---

### autoEngageMob Method (Line ~9049)

Added safety checks for proactive mob detection:

```javascript
async autoEngageMob(mobEntity) {
  // CRITICAL SAFETY: Never attack players if configured
  if (this.hostileMobDetector.isPlayer(mobEntity)) {
    if (config.combat.autoEngagement?.neverAttackPlayers) {
      console.log(`[COMBAT] ⚠️ Target is a player, not engaging`);
      return;
    }
  }
  
  // Safety: Only engage hostile mobs, not passive entities
  if (!this.hostileMobDetector.isHostileMob(mobEntity) && !this.hostileMobDetector.isPlayer(mobEntity)) {
    console.log(`[COMBAT] ⚠️ Target is not hostile, not engaging`);
    return;
  }
  
  // ... proceed with engagement
}
```

---

### Configuration Options

Updated `config.combat.autoEngagement`:

```javascript
autoEngagement: {
  autoEngageHostileMobs: true,    // Enable auto-combat against mobs
  engagementDistance: 3,           // Blocks to detect and engage (increased from 2)
  monitorInterval: 300,            // ms between mob checks (increased from 200)
  minHealthToFight: 4,             // Minimum health to engage
  requireMinHealth: true,          // Enforce health requirement
  avoidInWater: true,              // Avoid dangerous mobs in water
  requireArmor: true,              // Require armor to engage
  focusSingleMob: true,            // Focus on one mob at a time
  neverAttackPlayers: true,        // NEVER attack players (NEW)
  autoRetaliate: true              // Auto fight back when hit (NEW)
}
```

**New Options:**
- `neverAttackPlayers`: Prevents all player attacks (friendly fire protection)
- `autoRetaliate`: Enables automatic retaliation when damaged

---

## Testing Results

All test cases pass ✓

### Test Scenarios:
1. **Hostile Mob Detection**
   - ✓ Detects all 25+ hostile mob types
   - ✓ Case-insensitive matching works
   - ✓ Ignores passive mobs (cow, pig, sheep, etc.)

2. **Player Detection**
   - ✓ Identifies players by type
   - ✓ Identifies players by username
   - ✓ Distinguishes players from mobs

3. **Priority Targeting**
   - ✓ Scenario: Player 2m away, Zombie 3m away
   - ✓ Result: Bot attacks Zombie, NOT player
   - ✓ Hostile mobs always prioritized over players

4. **Friendly Fire Prevention**
   - ✓ `neverAttackPlayers=true`: Bot refuses to attack players
   - ✓ Safety checks in `handleCombat()` prevent player attacks
   - ✓ Safety checks in `autoEngageMob()` prevent player attacks
   - ✓ Bot sends chat message: "I don't attack players!"

5. **Auto-Retaliation**
   - ✓ Bot automatically fights back when hit by mob
   - ✓ Bot correctly identifies attacker type (mob vs player)
   - ✓ Clear logging shows attacker info and distance

---

## Acceptance Criteria Status

- [x] Hostile mobs trigger auto-combat
- [x] Bot never attacks players (when `neverAttackPlayers=true`)
- [x] Bot correctly identifies mob vs player
- [x] Combat only engages when hit (controlled by `autoRetaliate`)
- [x] Multiple mobs handled correctly (focuses on closest)
- [x] Player safety is prioritized (mobs checked first)
- [x] Clear logging of target identification
- [x] Config options respected
- [x] No friendly fire possible (multiple safety layers)

---

## Code Changes Summary

### Files Modified:
- `HunterX.js` - Main implementation

### Classes Modified:
1. **HostileMobDetector** (line ~8434)
   - Added `isPlayer()` method
   - Enhanced `isHostileMob()` to check both name and type
   - Added 'shulker' to hostile mobs list

2. **CombatAI** (line ~8459)
   - Enhanced `handleCombat()` with player safety checks
   - Enhanced `autoEngageMob()` with player safety checks
   - Updated `monitorNearbyMobs()` to focus on mobs only

3. **Bot Initialization** (line ~22522)
   - Completely rewritten `entityHurt` handler with priority targeting
   - Updated swarm alert to handle both mobs and players
   - Updated home defense to only track player attacks

### Config Changes:
- Added `neverAttackPlayers: true` to `config.combat.autoEngagement`
- Added `autoRetaliate: true` to `config.combat.autoEngagement`
- Increased `engagementDistance` from 2 to 3 blocks
- Increased `monitorInterval` from 200ms to 300ms

---

## How It Works

### When Bot Takes Damage:

1. **entityHurt event fires** → bot was hurt
2. **Find nearby entities** within 5 blocks
3. **First pass: Search for hostile mobs**
   - Check each entity with `isHostileMob()`
   - Track closest hostile mob
4. **Second pass: Search for players** (only if `neverAttackPlayers=false`)
   - Check each entity with `isPlayer()` or `type === 'player'`
   - Only consider if no hostile mobs found
5. **Log attacker information**
   - Type (player/hostile mob/entity)
   - Name
   - Distance
6. **Engage with safety checks**
   - Call `handleCombat(attacker)`
   - Multiple safety checks prevent attacking players
   - Abort if target is not hostile

### Safety Check Layers:

1. **entityHurt handler** - Prioritizes mobs over players
2. **handleCombat()** - Refuses to attack players if configured
3. **autoEngageMob()** - Refuses to engage players if configured
4. **Config option** - `neverAttackPlayers` master switch

### Logging Output:

When bot is attacked:
```
[COMBAT] 💢 Damaged by hostile mob: Zombie (3.0m away)
[COMBAT] Bot damaged by hostile mob Zombie - auto-engaging!
[COMBAT] ⚔️ Engaged with mob: Zombie!
```

When player tries to trigger player attack:
```
[COMBAT] ❌ SAFETY: Target is a player (Steve), aborting combat!
> I don't attack players!
```

---

## Migration Notes

### Backwards Compatibility:
- Existing combat functionality preserved
- Old config values still work (new options have defaults)
- No breaking changes to other systems

### Recommended Settings:
```javascript
config.combat.autoEngagement = {
  autoEngageHostileMobs: true,  // Enable auto-combat
  neverAttackPlayers: true,     // Prevent friendly fire
  autoRetaliate: true,          // Fight back when hit
  engagementDistance: 3,        // Detect mobs within 3 blocks
  requireArmor: true,           // Safety: need armor
  minHealthToFight: 4           // Safety: need health
};
```

### Testing in Production:
1. Enable `neverAttackPlayers` first
2. Test with hostile mobs nearby
3. Test with player nearby when mob attacks
4. Verify bot attacks mob, not player
5. Try to manually trigger player attack (should fail with safety message)

---

## Known Limitations

1. **5-block detection range**: Only entities within 5 blocks are considered as potential attackers
2. **Closest entity wins**: If multiple mobs hit at once, only closest is targeted
3. **No damage source tracking**: Minecraft doesn't provide damage source in entityHurt event, so we estimate based on proximity

---

## Future Enhancements

Possible improvements for future versions:
- Track damage sources more accurately
- Remember recent attackers (attack history)
- Group targeting for swarm combat
- Configurable priority list (prioritize certain mob types)
- Whitelist/blacklist for specific players
- Emergency retreat if overwhelmed by multiple mobs

---

## Conclusion

The combat targeting system now:
- ✅ Properly detects hostile mobs as attackers
- ✅ Automatically retaliates against mobs
- ✅ Prevents friendly fire by prioritizing mobs over players
- ✅ Has multiple safety checks to prevent attacking players
- ✅ Provides clear logging for debugging
- ✅ Respects configuration options

**Friendly fire is now IMPOSSIBLE when `neverAttackPlayers=true`** (default setting)
