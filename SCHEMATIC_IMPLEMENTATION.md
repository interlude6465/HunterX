# Schematic Loader Implementation Summary

## Overview
Implementation of the SchematicLoader foundation for HunterX v22.0, providing comprehensive support for `.schem` and `.schematic` file formats with NBT parsing.

## Changes Made

### 1. Dependencies Added (HunterX.js lines 43-44)
- `const nbt = require('prismarine-nbt');`
- `const { promisify } = require('util');`

### 2. Safe Directories Updated (line 47)
Added `./data/schematics` to the automatic directory creation list.

### 3. SchematicLoader Class (lines 1192-1737)
Comprehensive class implementation with the following methods:

#### Core Methods
- `constructor(bot)` - Initialize with optional bot reference for block validation
- `loadSchematic(input, name)` - Main entry point, accepts file path or buffer
- `detectFormat(buffer)` - Auto-detects legacy vs Sponge format
- `parseSchematic(buffer, format)` - Routes to appropriate parser

#### Format Parsers
- `parseSpongeSchematic(data)` - Handles Sponge v2 `.schem` format
- `parseLegacySchematic(data)` - Handles MCEdit `.schematic` format
- `readVarint(buffer, startIndex)` - VarInt decoder for Sponge format

#### Block Management
- `normalizeBlockName(blockName)` - Ensures `minecraft:` namespace
- `legacyIdToName(id, data)` - Maps numeric block IDs to modern names (60+ blocks)
- `validateBlocks(schematic)` - Validates against mineflayer registry with fallbacks

#### Data Extraction
- `parseEntity(entityData)` - Extracts entity data from NBT
- `parseTileEntity(tileEntityData)` - Extracts tile entity data
- `calculateMaterialCounts(blocks, palette)` - Counts blocks by type

#### Persistence
- `saveSchematicToFile(schematic)` - Saves normalized JSON to `./data/schematics/`
- `getSchematic(name)` - Retrieves cached or stored schematic
- `listSchematics()` - Lists all available schematics
- `deleteSchematic(name)` - Removes schematic from cache and disk

#### Query API
- `getBlockAt(schematic, x, y, z)` - Get block at relative position
- `getBlocksInRegion(schematic, x1, y1, z1, x2, y2, z2)` - Get blocks in bounding box

### 4. Bot Integration (lines 7035, 7044)
- SchematicLoader instance created during bot initialization
- Reference stored at `bot.schematicLoader` for easy access

### 5. Supporting Files Created

#### package.json
- Documents all dependencies including `prismarine-nbt: ^2.0.0`
- Provides project metadata and scripts

#### .gitignore
- Ignores node_modules, data directories, and logs
- Ensures clean version control

#### README.md
- Comprehensive documentation of SchematicLoader features
- Usage examples with code snippets
- Data structure documentation
- Error handling guidelines

#### schematic-example.js
- Standalone example script
- Demonstrates NBT inspection
- Shows integration patterns

## Schematic Data Format

### Input Formats Supported
- **Sponge v2 (.schem)**: Modern format with palette-based block storage
- **MCEdit Legacy (.schematic)**: Classic format with numeric block IDs
- **Gzip Compressed**: Automatically detected and handled

### Output Format (JSON)
```json
{
  "name": "string",
  "format": "sponge_v2 | legacy",
  "metadata": {
    "width": "number",
    "height": "number", 
    "length": "number",
    "offsetX": "number",
    "offsetY": "number",
    "offsetZ": "number",
    "version": "number"
  },
  "blocks": [
    {
      "x": "number (absolute)",
      "y": "number (absolute)",
      "z": "number (absolute)",
      "relX": "number (relative)",
      "relY": "number (relative)",
      "relZ": "number (relative)",
      "name": "string (minecraft:block_name)",
      "originalName": "string (if fallback applied)"
    }
  ],
  "materialCounts": {
    "minecraft:block_name": "count"
  },
  "blockCount": "number",
  "entities": [],
  "tileEntities": [],
  "loadedAt": "timestamp"
}
```

## Key Features

### 1. Format Detection
Automatic detection based on:
- First byte analysis (0x0a for uncompressed NBT)
- Gzip header detection (0x1f, 0x8b)
- Header inspection for Schematic marker

### 2. Block Validation
- Validates against `bot.registry.blocksByName` when bot available
- Graceful fallback to `minecraft:air` for unknown blocks
- Warns about unknown blocks with [SCHEMATIC] prefix
- Preserves original block name in `originalName` field

### 3. Error Handling
- Comprehensive try-catch blocks
- Descriptive error messages with [SCHEMATIC] prefix
- Non-blocking failures (returns null instead of crashing)
- Validation warnings logged but don't prevent loading

### 4. Performance Considerations
- Sparse storage (only non-air blocks stored)
- In-memory caching via Map
- Efficient VarInt reading for Sponge format
- Material count pre-calculation

### 5. Legacy Block ID Mapping
Supports 60+ common legacy blocks:
- Building blocks (stone, dirt, planks, etc.)
- Ores (diamond, iron, coal, etc.)
- Functional blocks (chest, furnace, crafting table)
- Decorative blocks (glass, wool, terracotta)
- Technical blocks (redstone, rails, command blocks)

## API Usage Examples

### Loading from File
```javascript
const schematic = await bot.schematicLoader.loadSchematic('./builds/castle.schem', 'castle');
console.log(`Loaded ${schematic.name}: ${schematic.metadata.width}x${schematic.metadata.height}x${schematic.metadata.length}`);
```

### Loading from HTTP Upload
```javascript
// In HTTP handler
app.post('/upload-schematic', async (req, res) => {
  const buffer = req.body;
  const name = req.query.name || 'upload';
  
  try {
    const schematic = await bot.schematicLoader.loadSchematic(buffer, name);
    res.json({
      success: true,
      schematic: {
        name: schematic.name,
        dimensions: schematic.metadata,
        blockCount: schematic.blockCount,
        materials: schematic.materialCounts
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

### Querying Blocks
```javascript
const schematic = bot.schematicLoader.getSchematic('castle');

// Get single block
const block = bot.schematicLoader.getBlockAt(schematic, 5, 10, 5);
console.log(`Block at (5,10,5): ${block?.name}`);

// Get region
const foundation = bot.schematicLoader.getBlocksInRegion(
  schematic, 
  0, 0, 0,    // Start corner
  32, 1, 32   // End corner
);
console.log(`Foundation blocks: ${foundation.length}`);
```

### Listing and Managing
```javascript
// List all
const all = bot.schematicLoader.listSchematics();
console.log('Available schematics:', all);

// Delete old schematic
bot.schematicLoader.deleteSchematic('old-build');
```

## Testing Recommendations

### Unit Tests
1. Test format detection with sample buffers
2. Test legacy ID mapping for all 60+ block types
3. Test VarInt reading with edge cases
4. Test block validation with/without bot registry
5. Test material counting accuracy

### Integration Tests
1. Load actual .schem files (Sponge format)
2. Load actual .schematic files (Legacy format)
3. Test gzip-compressed files
4. Test large schematics (1000+ blocks)
5. Test schematics with entities and tile entities
6. Test HTTP upload workflow
7. Test cache persistence across reloads

### Error Handling Tests
1. Corrupted NBT data
2. Invalid buffer input
3. Missing required NBT fields
4. Unknown block IDs/names
5. File system errors (permissions, disk full)

## Future Enhancements

### Planned for Builder/Planner Tickets
1. Block placement execution engine
2. Material requirement calculator
3. Build progress tracking
4. Multi-step build planning
5. Interrupt/resume support
6. Parallel multi-bot building

### Potential Optimizations
1. Streaming NBT parser for large files
2. Block state preservation (rotation, properties)
3. Biome data support
4. Custom fallback configuration
5. Schematic merging/combining
6. Region extraction/cropping

## Acceptance Criteria Status

✅ **Uploading/loading .schem or .schematic results in normalized representation**
- Both formats supported with automatic detection
- Normalized to consistent JSON structure
- Saved to ./data/schematics/ with metadata

✅ **Unsupported blocks reported with graceful fallback**
- Validation against mineflayer registry
- Automatic fallback to minecraft:air
- Warning logs with [SCHEMATIC] prefix
- Original name preserved

✅ **Parsed schematics accessible via well-defined API**
- `loadSchematic()` - Load from file/buffer
- `getSchematic()` - Retrieve cached
- `getBlockAt()` - Query by position
- `getBlocksInRegion()` - Query by region
- `listSchematics()` - List all
- `deleteSchematic()` - Remove

## Dependencies Required

Before running, ensure these packages are installed:
```bash
npm install prismarine-nbt
```

All other dependencies should already be present for the existing bot functionality.

## Notes

- SchematicLoader can operate without bot reference (standalone)
- Block validation only occurs when bot registry is available
- Schematics persist across bot restarts (JSON cache)
- Thread-safe for multiple concurrent loads (async/await)
- Memory efficient (sparse block storage)

---

**Implementation Date**: 2024-11-01  
**Author**: AI Assistant  
**Ticket**: Schematic Loader Foundation  
**Status**: Complete ✅
