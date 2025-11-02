# HunterX v22.0 - Ultimate Minecraft Automation Bot

Advanced Minecraft automation bot with god-tier Crystal PvP, dupe discovery, stash hunting, swarm coordination, and schematic building capabilities.

## Features

### Core Systems
- **Crystal PvP AI**: Superhuman reaction times with neural network strategy selection
- **Dupe Discovery Engine**: Advanced duplication testing and analytics
- **Stash Scanner**: Automated discovery and valuation of hidden chest stashes
- **Swarm Coordination**: Multi-bot coordination via WebSocket (port 9090)
- **Conversation AI**: Intelligent NPC companion with personality
- **Schematic Loader**: NBT-based schematic parsing for automated building
- **Maintenance System**: Auto-repair armor via mending and intelligent elytra management

### Schematic Builder Foundation

The SchematicLoader class provides comprehensive support for `.schem` and `.schematic` file formats:

#### Features
- **Format Detection**: Automatically detects legacy `.schematic` (MCEdit) and Sponge `.schem` formats
- **NBT Parsing**: Uses prismarine-nbt for robust NBT data extraction
- **Block Validation**: Validates blocks against mineflayer's registry with fallback support
- **Material Analysis**: Calculates material counts and metadata
- **Persistent Storage**: Saves normalized schematics to `./data/schematics/` as JSON
- **Query API**: Access blocks by position or region

#### Usage

```javascript
// Access via bot reference
const schematicLoader = bot.schematicLoader;

// Load from file
const schematic = await schematicLoader.loadSchematic('./path/to/build.schem', 'my-build');

// Load from buffer (e.g., HTTP upload)
const buffer = req.body; // From HTTP POST
const schematic = await schematicLoader.loadSchematic(buffer, 'uploaded-build');

// Query schematic data
const block = schematicLoader.getBlockAt(schematic, 5, 10, 5);
const region = schematicLoader.getBlocksInRegion(schematic, 0, 0, 0, 10, 10, 10);

// List available schematics
const schematics = schematicLoader.listSchematics();

// Retrieve cached schematic
const cached = schematicLoader.getSchematic('my-build');
```

#### Schematic Data Structure

```javascript
{
  name: 'my-build',
  format: 'sponge_v2' | 'legacy',
  metadata: {
    width: 32,
    height: 16,
    length: 32,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    version: 2
  },
  blocks: [
    {
      x: 0, y: 0, z: 0,           // Absolute position (with offset)
      relX: 0, relY: 0, relZ: 0,  // Relative position
      name: 'minecraft:stone',
      originalName: 'minecraft:stone' // Present if fallback was applied
    },
    // ...
  ],
  materialCounts: {
    'minecraft:stone': 145,
    'minecraft:oak_planks': 64,
    // ...
  },
  blockCount: 209,
  entities: [],
  tileEntities: [],
  loadedAt: 1699999999999
}
```

#### Error Handling

- **Unknown Blocks**: Automatically replaced with `minecraft:air` (or configured fallback)
- **Corrupted NBT**: Throws descriptive error with `[SCHEMATIC]` prefix
- **Missing Files**: Returns null from `getSchematic()` if not found

### Maintenance System

Automated armor repair and elytra management for long-term autonomous operation.

#### Auto-Repair System

The AutoRepair class automatically detects low armor durability and repairs gear using mending enchantments at configured XP farms.

**Features:**
- Monitors all armor pieces (helmet, chestplate, leggings, boots)
- Configurable durability threshold (default: 50%)
- Automatic detection of mending enchanted gear
- Navigates to XP farm and waits for repair completion
- Background checks every 60 seconds

**Configuration:**
```javascript
config.maintenance.autoRepair = {
  enabled: true,
  durabilityThreshold: 0.5,  // Repair when 50% damaged
  xpFarmLocation: null        // Set via command
}
```

**Commands:**
- `maintenance status` - View current maintenance status
- `start maintenance` - Start the maintenance scheduler
- `stop maintenance` - Stop the maintenance scheduler
- `repair armor` - Manually trigger armor repair
- `set xp farm here` - Set XP farm location at current position
- `set xp farm x,y,z` - Set XP farm location at coordinates

#### Elytra Manager

The ElytraManager class monitors elytra durability and automatically swaps damaged elytras with fresh ones from the ender chest.

**Features:**
- Checks elytra durability every 10 seconds
- Configurable durability threshold (default: 100 remaining)
- Automatic ender chest location and access
- Deposits damaged elytra and withdraws fresh one
- Works with home base ender chest or placed ender chests

**Configuration:**
```javascript
config.maintenance.elytraSwap = {
  enabled: true,
  durabilityThreshold: 100,   // Swap when < 100 durability
  keepSpares: 3               // Number of spares in ender chest
}
```

**Commands:**
- `check elytra` - Check current elytra durability
- `swap elytra` - Manually trigger elytra swap
- `fix elytra` - Alias for swap elytra

#### Maintenance Scheduler

The MaintenanceScheduler orchestrates both repair and elytra management systems in the background.

**Features:**
- Automatic initialization on bot spawn
- Independent control for each system
- Safe interval tracking and cleanup
- Status reporting via dashboard and commands

**Usage:**
```javascript
// Initialize (done automatically on spawn)
bot.maintenanceScheduler = new MaintenanceScheduler(bot);

// Start scheduler
bot.maintenanceScheduler.start();

// Get status
const status = bot.maintenanceScheduler.getStatus();

// Stop scheduler
bot.maintenanceScheduler.stop();
```

**Dashboard Integration:**

The maintenance system is integrated into the HTTP dashboard at `http://localhost:8080/stats`:

```json
{
  "maintenance": {
    "schedulerActive": true,
    "autoRepairEnabled": true,
    "elytraSwapEnabled": true,
    "armorStatus": "Good condition",
    "elytraStatus": "Good condition (432 durability)",
    "lastRepair": "12/3/2024, 10:30:00 AM",
    "lastElytraSwap": "12/3/2024, 9:15:00 AM",
    "xpFarmSet": true
  }
}
```

## Installation

```bash
npm install
```

### Dependencies
- `mineflayer`: Bot framework
- `mineflayer-pvp`: PvP plugin
- `mineflayer-pathfinder`: Navigation
- `vec3`: Vector math
- `brain.js`: Neural networks
- `ws`: WebSocket client/server
- `socks`: SOCKS proxy support
- `prismarine-nbt`: NBT parsing for schematics

## Usage

```bash
node HunterX.js
```

Follow the interactive CLI menu to select mode:
1. **PvP Mode**: God-tier crystal combat
2. **Dupe Discovery**: Advanced dupe testing
3. **Stash Hunter**: Automated stash scanning
4. **Friendly Companion**: Conversational helper
5. **Swarm Controller**: Multi-bot coordination

## Configuration

Bot state and configuration stored in:
- `./data/config.json`: Server settings, whitelist, mode
- `./data/schematics/`: Parsed schematic files
- `./models/`: Neural network models
- `./dupes/`: Dupe discovery results
- `./stashes/`: Stash scan reports
- `./logs/`: Operation logs

## Dashboard & API

- **HTTP Dashboard**: Port 8080 - Status and command interface
- **WebSocket Swarm**: Port 9090 - Bot coordination

## Trust System

Whitelist-based trust levels:
- `owner`: Full control
- `admin`: Mode changes, trust management
- `trusted`: Location access, private messaging
- `guest`: Basic commands

## License

MIT
