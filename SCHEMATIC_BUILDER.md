# Schematic Builder Documentation

## Overview

The Schematic Builder is an advanced placement planner/sequencer that produces physics-aware build steps, including scaffolding and validation checkpoints. It integrates seamlessly with the HunterX bot system.

## Features

### Core Functionality
- **Physics-Aware Building**: Respects gravity blocks, redstone components, and attachable blocks
- **Intelligent Scaffolding**: Automatically places temporary supports and removes them after build
- **Layer-Based Construction**: Builds from bottom-up with proper dependency ordering
- **Pathfinding Integration**: Uses mineflayer-pathfinder for optimal placement positions
- **Persistence**: Saves build progress to resume after disconnections

### Block Type Handling
- **Gravity Blocks**: Sand, gravel, concrete powder (requires support below)
- **Attachable Blocks**: Torches, buttons, levers, signs, ladders (requires adjacent support)
- **Redstone Components**: Pistons, repeaters, comparators, etc. (placed after regular blocks)
- **Regular Blocks**: Standard building blocks (placed first)

### Build States
- `idle`: No schematic loaded
- `gathering`: Loading schematic and generating build queue
- `building`: Actively placing blocks
- `paused`: Build paused (can be resumed)
- `finished`: Build completed with validation

## Usage

### Menu System
1. Start HunterX: `node HunterX.js`
2. Select option `[6] Build Mode (Schematic Builder)`
3. Enter server details
4. Bot joins and initializes schematic builder

### Chat Commands
- `build schematic <file> at <x,y,z>` - Load and start building
- `build progress` or `build status` - Show current build progress
- `pause build` - Pause current build
- `resume build` - Resume paused build
- `cancel build` - Cancel and clean up build

### Examples
```
build schematic simple_house.schem at 100,64,200
build progress
pause build
resume build
```

## Schematic Formats

### Supported Formats
- `.schem` - Sponge Schematic format
- `.schematic` - Legacy WorldEdit format
- `.nbt` - Generic NBT structure files

### File Structure
Schematics should be placed in the project root or provide full paths. Example format:
```json
{
  "name": "Structure Name",
  "width": 7,
  "height": 4,
  "length": 7,
  "palette": {
    "0": { "name": "air" },
    "1": { "name": "oak_planks" }
  },
  "blocks": [
    [x, y, z, blockId]
  ]
}
```

## Persistence

### Build States
- Saved to `./data/build_states/<build_id>.json`
- Includes placed blocks, scaffolding positions, and inventory snapshot
- Automatically resumes on restart if interrupted

### Validation
- Validates each layer after completion
- Identifies missing or incorrect blocks
- Automatically queues corrections
- Reports validation errors and correction count

## Scaffolding System

### Materials (in preference order)
1. Dirt
2. Cobblestone  
3. Stone
4. Oak Planks

### Placement Logic
- Automatically added for gravity blocks lacking support
- Added for attachable blocks without adjacent support
- Inserted into build queue before target blocks
- Removed after successful validation

## Integration

### With Other Systems
- **Swarm Coordinator**: Can coordinate multi-bot builds
- **Ender Chest**: Stores valuable materials during builds
- **Conversation AI**: Handles build commands and status queries
- **Movement System**: Uses pathfinder for optimal positioning

### Event System
- State change events for monitoring
- Progress callbacks for UI integration
- Error handling with graceful recovery

## Advanced Features

### Validation Checkpoints
- Compares world blocks to expected palette
- Queue corrections for mismatches
- Validates support structures
- Reports build accuracy

### Resource Management
- Checks inventory availability
- Integrates with resource gathering
- Supports material substitution
- Reports missing materials

### Error Recovery
- Automatic retry for failed placements
- Smart repositioning for blocked access
- Graceful handling of world changes
- Persistent error tracking

## Configuration

### Build Settings
- Default scaffolding materials configurable
- Validation sensitivity adjustable
- Build speed controls available
- Custom block type mappings

### Performance Options
- Batch placement for regular blocks
- Optimized pathing for large structures
- Memory-efficient queue management
- Configurable save intervals

## Troubleshooting

### Common Issues
1. **Missing Materials**: Ensure required blocks are in inventory
2. **Placement Failures**: Check for obstructions or unsafe positions
3. **Validation Errors**: May indicate world changes during build
4. **Scaffolding Issues**: Verify support block availability

### Debug Information
- Detailed logging for each placement attempt
- Validation error reporting with positions
- Scaffolding placement tracking
- Build queue inspection available

## API Reference

### SchematicBuilder Class
```javascript
const builder = new SchematicBuilder(bot, loader);

// Load schematic
await builder.loadSchematic('path/to/file.schem', position);

// Control building
await builder.startBuilding();
builder.pause();
builder.resume();
builder.cancel();

// Get status
const progress = builder.getBuildProgress();

// Events
builder.onStateChange((state, progress) => {
  console.log(`State: ${state}, Progress: ${progress.percentage}%`);
});
```

### SchematicLoader Class
```javascript
const loader = new SchematicLoader();

// Load different formats
const schematic = await loader.loadSchematic('file.schem');
const normalized = loader.normalizeStructure(schematic);
```

## Examples

### Simple House Build
1. Place `simple_house.schem` in project directory
2. Start bot in build mode
3. Chat: `build schematic simple_house.schem at 0,64,0`
4. Bot automatically builds with scaffolding and validation

### Large Structure
- Uses layer-by-layer approach
- Optimizes placement order for efficiency
- Manages resources intelligently
- Provides detailed progress reporting

## Future Enhancements

### Planned Features
- Multi-bot coordinated building
- Advanced NBT parsing for complex schematics
- Real-time build visualization
- Custom block property support
- Integration with external design tools

### Performance Improvements
- Parallel block placement
- Predictive pathfinding
- Cached validation results
- Optimized memory usage