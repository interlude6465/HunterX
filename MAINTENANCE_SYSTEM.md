# Maintenance System - Auto-Repair & Elytra Management

## Overview

The Maintenance System provides automated armor repair via mending and intelligent elytra durability management with ender chest swapping for long-term autonomous bot operation.

## Components

### 1. AutoRepair Class

Automatically monitors and repairs armor durability using mending enchantments.

**Location:** Lines 2293-2443 in HunterX.js

**Key Methods:**
- `checkArmorDurability()` - Scans all armor slots for durability
- `hasMendingGear()` - Verifies armor has mending enchantment
- `repairRoutine()` - Full repair workflow (navigate, repair, return)
- `setXPFarmLocation(coords)` - Configure XP farm location

**Features:**
- Monitors helmet, chestplate, leggings, boots
- Configurable durability threshold (default 50%)
- Automatic XP farm navigation
- Waits until full repair (timeout: 5 minutes)
- Prevents concurrent repair operations

### 2. ElytraManager Class

Monitors elytra durability and swaps with fresh elytras from ender chest.

**Location:** Lines 2445-2615 in HunterX.js

**Key Methods:**
- `checkElytraDurability()` - Check current elytra condition
- `swapElytraFromEnderChest()` - Full swap workflow
- `findNearbyEnderChest()` - Locate ender chest within 32 blocks
- `goToEnderChest()` - Navigate to home base or place ender chest

**Features:**
- Checks every 10 seconds
- Configurable threshold (default 100 durability)
- Deposits damaged elytra
- Withdraws fresh elytra
- Auto-equips fresh elytra
- Works with home base or placed ender chests

### 3. MaintenanceScheduler Class

Orchestrates both systems with background scheduling.

**Location:** Lines 2617-2710 in HunterX.js

**Key Methods:**
- `start()` - Initialize background checks
- `stop()` - Stop all maintenance intervals
- `getStatus()` - Comprehensive status report

**Features:**
- Auto-repair: checks every 60 seconds (when not moving)
- Elytra swap: checks every 10 seconds
- Safe interval tracking and cleanup
- Independent enable/disable for each system

## Configuration

```javascript
config.maintenance = {
  autoRepair: {
    enabled: true,              // Enable auto-repair
    durabilityThreshold: 0.5,   // 50% damaged triggers repair
    xpFarmLocation: null        // Vec3 coordinates
  },
  elytraSwap: {
    enabled: true,              // Enable elytra swap
    durabilityThreshold: 100,   // Swap when < 100 durability
    keepSpares: 3               // Recommended spares
  },
  lastRepair: null,             // Timestamp of last repair
  lastElytraSwap: null,         // Timestamp of last swap
  schedulerActive: false        // Scheduler running status
}
```

## Commands

### Maintenance Status
```
maintenance status
repair status
```
Shows comprehensive maintenance status including armor condition, elytra durability, last repair times, and scheduler status.

### Start/Stop Scheduler
```
start maintenance
stop maintenance
```
Control the background maintenance scheduler.

### Manual Operations
```
repair armor         - Trigger immediate armor repair
fix armor           - Alias for repair armor
swap elytra         - Trigger immediate elytra swap
fix elytra          - Alias for swap elytra
check elytra        - Check current elytra durability
```

### Configuration
```
set xp farm here    - Set XP farm at current position
set xp farm x,y,z   - Set XP farm at coordinates
```

## Dashboard Integration

The maintenance system is integrated into the HTTP dashboard at `http://localhost:8080/stats`:

```json
{
  "maintenance": {
    "schedulerActive": true,
    "autoRepairEnabled": true,
    "elytraSwapEnabled": true,
    "armorStatus": "Good condition | Needs repair (65.3% damaged)",
    "elytraStatus": "Good condition (432 durability) | No elytra equipped",
    "lastRepair": "12/3/2024, 10:30:00 AM | Never",
    "lastElytraSwap": "12/3/2024, 9:15:00 AM | Never",
    "xpFarmSet": true
  }
}
```

## Initialization

The maintenance scheduler is automatically initialized when the bot spawns:

```javascript
// Auto-initialization in spawn event (line 13037-13044)
bot.maintenanceScheduler = new MaintenanceScheduler(bot);
if (config.maintenance.autoRepair.enabled || config.maintenance.elytraSwap.enabled) {
  bot.maintenanceScheduler.start();
  console.log('[MAINTENANCE] Scheduler initialized and started');
} else {
  console.log('[MAINTENANCE] Scheduler initialized (disabled)');
}
```

## Usage Examples

### Basic Setup
1. Ensure you have mending-enchanted armor equipped
2. Set XP farm location: `set xp farm here` (at your XP farm)
3. Place spare elytras in ender chest
4. Maintenance runs automatically in background

### Manual Operations
```javascript
// Check status
const status = bot.maintenanceScheduler.getStatus();
console.log(status);

// Trigger manual repair
await bot.maintenanceScheduler.autoRepair.repairRoutine();

// Trigger manual elytra swap
await bot.maintenanceScheduler.elytraManager.swapElytraFromEnderChest();

// Configure XP farm
const coords = new Vec3(100, 64, 200);
bot.maintenanceScheduler.autoRepair.setXPFarmLocation(coords);
```

### Disable/Enable Systems
```javascript
// Disable auto-repair
config.maintenance.autoRepair.enabled = false;

// Disable elytra swap
config.maintenance.elytraSwap.enabled = false;

// Restart scheduler to apply changes
bot.maintenanceScheduler.stop();
bot.maintenanceScheduler.start();
```

## Error Handling

The system includes comprehensive error handling:

- **No mending gear:** Logs warning and skips repair
- **No XP farm set:** Logs message and provides command hint
- **No ender chest:** Attempts to place from inventory or goes to home base
- **No spare elytra:** Logs warning and continues with damaged elytra
- **Navigation failures:** Caught and logged without crashing
- **Concurrent operations:** Prevented via isRepairing/isSwapping flags

## Best Practices

1. **XP Farm Setup:**
   - Set a reliable XP farm location before enabling auto-repair
   - Ensure the farm is always accessible and producing XP
   - Consider setting it at your home base

2. **Ender Chest Management:**
   - Keep at least 3 spare elytras in ender chest
   - Periodically repair damaged elytras using mending
   - Always have an ender chest in inventory as backup

3. **Scheduler Configuration:**
   - Enable both systems for full autonomous operation
   - Adjust thresholds based on your use case
   - Monitor dashboard for maintenance status

4. **Mending Armor:**
   - All armor pieces should have mending for auto-repair
   - Check `hasMendingGear()` before relying on auto-repair
   - Manually repair gear without mending

## Integration Points

- **ConversationAI:** Commands handled in lines 6948-7048
- **Config:** Configuration in lines 547-562
- **Dashboard:** Status in lines 12257-12266
- **Spawn Event:** Auto-initialization in lines 13037-13044
- **Command Prefixes:** Added to isCommand() in line 6770

## Troubleshooting

**Repair not triggering:**
- Check if armor has mending enchantment
- Verify XP farm location is set
- Ensure scheduler is started
- Check if durability is below threshold

**Elytra swap failing:**
- Verify ender chest has spare elytras
- Check spare elytras have sufficient durability
- Ensure bot can access ender chest
- Verify bot has ender chest in inventory or at home base

**Scheduler not running:**
- Check config.maintenance.schedulerActive
- Verify enabled flags in config
- Check for errors in logs
- Try manual start: `start maintenance`

## Future Enhancements

Potential improvements for future versions:

- Auto-locate XP farms (mob spawners, guardian farms)
- Build simple XP farms automatically
- Support for anvil repair when mending unavailable
- Tool durability monitoring and swapping
- Shield durability management
- Totem of undying management
- Automatic enchantment application

## Credits

Implemented as part of HunterX v22.1+ maintenance system for long-term autonomous operation.
