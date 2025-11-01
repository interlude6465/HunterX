# SchematicLoader Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. The SchematicLoader is automatically initialized when the bot starts.

## Basic Usage

### Load a Schematic File

```javascript
// After bot spawns and is ready
const schematic = await bot.schematicLoader.loadSchematic('./my-build.schem', 'my-build');

// Check what was loaded
console.log(`Loaded: ${schematic.name}`);
console.log(`Size: ${schematic.metadata.width}x${schematic.metadata.height}x${schematic.metadata.length}`);
console.log(`Blocks: ${schematic.blockCount}`);
console.log(`Materials needed:`, schematic.materialCounts);
```

### Upload via HTTP (Future Dashboard Integration)

```javascript
// Example HTTP endpoint handler (to be added)
app.post('/api/schematic/upload', async (req, res) => {
  const buffer = req.body;
  const name = req.query.name || `upload_${Date.now()}`;
  
  try {
    const schematic = await bot.schematicLoader.loadSchematic(buffer, name);
    res.json({
      success: true,
      name: schematic.name,
      dimensions: schematic.metadata,
      blockCount: schematic.blockCount,
      materials: schematic.materialCounts
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

### Query Blocks

```javascript
// Get a specific block
const block = bot.schematicLoader.getBlockAt(schematic, 10, 5, 10);
if (block) {
  console.log(`Block at (10,5,10): ${block.name}`);
}

// Get all blocks in a region (e.g., foundation)
const foundation = bot.schematicLoader.getBlocksInRegion(
  schematic,
  0, 0, 0,     // Start corner
  schematic.metadata.width, 3, schematic.metadata.length  // First 3 layers
);
console.log(`Foundation has ${foundation.length} blocks`);
```

### List and Manage Schematics

```javascript
// List all cached schematics
const all = bot.schematicLoader.listSchematics();
console.log('Available:', all);

// Get cached schematic (no reload needed)
const cached = bot.schematicLoader.getSchematic('my-build');

// Remove old schematic
bot.schematicLoader.deleteSchematic('old-design');
```

## Schematic File Formats Supported

### Sponge v2 (.schem)
Modern format used by:
- WorldEdit 7.x+
- Sponge Schematic Specification v2
- Most modern Minecraft tools

### Legacy (.schematic)
Classic format used by:
- WorldEdit 6.x and earlier
- MCEdit
- Older schematic tools

Both formats are automatically detected - just point to the file!

## Inspecting a Schematic

Use the provided example script:

```bash
node schematic-example.js ./path/to/build.schem
```

This will show:
- Dimensions
- Format version
- Block palette preview
- NBT structure

## Data Storage

Loaded schematics are saved as JSON in:
```
./data/schematics/<name>.json
```

This allows:
- Fast reloading without NBT parsing
- Easy inspection/debugging
- Version control friendly format

## Common Patterns

### 1. Load and Validate Materials

```javascript
const schematic = await bot.schematicLoader.loadSchematic('./build.schem', 'fortress');

// Check if we have materials
const inventory = bot.inventory.items();
const needed = schematic.materialCounts;

for (const [block, count] of Object.entries(needed)) {
  const blockName = block.replace('minecraft:', '');
  const available = inventory.filter(item => item.name === blockName)
    .reduce((sum, item) => sum + item.count, 0);
  
  console.log(`${block}: need ${count}, have ${available}`);
}
```

### 2. Extract Build Layers

```javascript
const schematic = bot.schematicLoader.getSchematic('tower');
const layerHeight = 4;

for (let y = 0; y < schematic.metadata.height; y += layerHeight) {
  const layer = bot.schematicLoader.getBlocksInRegion(
    schematic,
    0, y, 0,
    schematic.metadata.width, y + layerHeight, schematic.metadata.length
  );
  
  console.log(`Layer ${y / layerHeight + 1}: ${layer.length} blocks`);
  // Process layer for building...
}
```

### 3. Calculate Build Time Estimate

```javascript
const schematic = bot.schematicLoader.getSchematic('house');
const blocksPerMinute = 60; // Conservative estimate
const minutes = Math.ceil(schematic.blockCount / blocksPerMinute);

console.log(`Estimated build time: ${minutes} minutes (${Math.floor(minutes / 60)}h ${minutes % 60}m)`);
```

## Error Handling

### Unknown Blocks

If a schematic contains blocks not in the bot's version:

```
[SCHEMATIC] Unknown blocks found (using fallbacks):
  - minecraft:copper_ore -> minecraft:air
  - minecraft:calcite -> minecraft:air
```

These are automatically replaced with air (or configured fallback).
The original name is preserved in `block.originalName`.

### Corrupted Files

```javascript
try {
  const schematic = await bot.schematicLoader.loadSchematic('./broken.schem');
} catch (err) {
  console.error('Failed to load:', err.message);
  // Handle error - maybe try a different file
}
```

### Missing Files

```javascript
const schematic = bot.schematicLoader.getSchematic('nonexistent');
if (!schematic) {
  console.log('Schematic not found - need to load it first');
}
```

## Integration with Bot Commands

Example conversation command:

```javascript
// In your ConversationAI message handler
if (message.includes('load schematic')) {
  const filename = message.split(' ').pop(); // Get last word
  
  try {
    const schematic = await bot.schematicLoader.loadSchematic(
      `./schematics/${filename}.schem`,
      filename
    );
    
    bot.chat(`Loaded ${schematic.name}: ${schematic.blockCount} blocks, ` +
             `${schematic.metadata.width}x${schematic.metadata.height}x${schematic.metadata.length}`);
  } catch (err) {
    bot.chat(`Failed to load: ${err.message}`);
  }
}

if (message.includes('list schematics')) {
  const all = bot.schematicLoader.listSchematics();
  bot.chat(`Available: ${all.join(', ')}`);
}
```

## Next Steps

The SchematicLoader provides the foundation. Upcoming features will include:

1. **Build Planner**: Optimizes block placement order
2. **Build Executor**: Actually places blocks in-game
3. **Material Gatherer**: Collects required materials
4. **Multi-bot Builder**: Coordinates multiple bots
5. **Dashboard Integration**: Web UI for uploads

## Tips

1. **Pre-load schematics** during bot startup for faster access
2. **Use descriptive names** for easy management
3. **Test with small schematics** first (10x10x10 or less)
4. **Check material counts** before starting builds
5. **Save common designs** as schematics for reuse

## Troubleshooting

### "Cannot find module 'prismarine-nbt'"
Run `npm install` to install dependencies.

### "No such file or directory"
Check the file path - use absolute paths or paths relative to the HunterX.js location.

### "Invalid NBT data"
The file might be corrupted or not a valid schematic. Try opening it in WorldEdit first.

### Schematic loads but has wrong blocks
The schematic might be from a different Minecraft version. Check the console for fallback warnings.

## Support

For issues or questions:
1. Check the `[SCHEMATIC]` console logs
2. Verify file format with `schematic-example.js`
3. Review SCHEMATIC_IMPLEMENTATION.md for technical details

---

Happy Building! 🏗️
