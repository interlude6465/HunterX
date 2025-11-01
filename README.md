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
