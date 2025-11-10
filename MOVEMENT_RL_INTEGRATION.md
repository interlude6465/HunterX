# Movement RL Integration

This document describes the implementation of reinforcement learning for movement decisions in HunterX.

## Overview

Movement RL provides intelligent decision-making for pathfinding and movement actions, integrated across three core movement classes: `MovementModeManager`, `MovementFramework`, and `HighwayNavigator`.

## Architecture

### Core Components

#### 1. MovementRL Class (line ~17306)
The main RL engine that manages:
- **State Encoding** (7 features):
  - Terrain classification (8 types normalized)
  - Dimension classification (3 types normalized)
  - Target distance (normalized to 0-1 for up to 1000 blocks)
  - Elevation change (normalized to world height 0-256)
  - Hazard proximity (0-1 score: lava, fire, falling risk)
  - Equipment availability (composite score)
  - Scenario context (for situational learning)

- **Actions** (7 possible):
  1. `highway_mode` - Use nether highways for long distances
  2. `standard_pathfinder` - Default pathfinding
  3. `pillar_bridge` - Bridge over gaps using blocks
  4. `water_bucket_drop` - Safe descent using water bucket
  5. `elytra_travel` - Flying with elytra
  6. `slow_walk` - Careful movement
  7. `pause_scan` - Pause for environment analysis

- **Scenarios** (3 types):
  1. `overworld_hills` - Standard overworld terrain
  2. `nether_highway` - Nether dimension travel
  3. `cave_navigation` - Underground exploration

- **Reward Signals**:
  - Success: +1.0 base
  - Fast travel (>5 blocks/sec): +0.3 bonus
  - Smooth path (<3 recalculations): +0.2 bonus
  - No stuck detections: +0.2 bonus
  - Timeout: -0.3
  - Failure: -0.5
  - Fall damage: up to -0.5 (normalized)
  - Lava contact: -1.0
  - Inefficiency/loops: -0.8

### Integration Points

#### 2. MovementModeManager Integration (line ~19172)
- Creates MovementRL instance in constructor
- Queries RL in `travelToCoords()` for action selection
- Applies safety filters to prevent unsafe actions
- Records outcomes for training
- Exposes: `getMovementRLStats()`, `trainMovementRL()`, `saveMovementRL()`, `loadMovementRL()`, `resetMovementRLStats()`

#### 3. MovementFramework Integration (line ~22344)
- Creates MovementRL instance in constructor
- Provides access to movement RL methods
- Exposes same methods as MovementModeManager for consistency

#### 4. HighwayNavigator Integration (line ~18819)
- Receives movementRL reference from MovementModeManager
- Can query RL for highway-specific decisions
- Uses parent's RL instance for consistent learning

### Safety Gating

Safety filters prevent RL from suggesting unsafe actions:

| Action | Requirements | Check |
|--------|--------------|-------|
| elytra_travel | Elytra + Rockets | Must have both items |
| water_bucket_drop | Water bucket | Must have item |
| pillar_bridge | Building blocks | Must have blocks in inventory |
| Over hazard areas | Low hazard score | Blocked if hazard > 0.7 |

Vetoed actions are logged with negative feedback for training.

## Admin Commands

```
!rl movement stats      - Display RL statistics for each scenario
!rl movement reset      - Reset statistics
!rl movement train      - Manually trigger training
!rl movement save       - Save model to disk
!rl movement load       - Load model from disk
```

**Access**: Admin+ only

## Model Persistence

- **Save location**: `./models/movement_model.json`
- **Auto-save interval**: Every 5 minutes
- **Auto-train interval**: Every 60 seconds (batch size: 32)
- **Load on startup**: Yes (line ~25189)
- **Network size**: 7 inputs → 7 outputs

## Statistics Tracking

Tracks per-scenario success metrics:
- **Overworld Hills**: Standard terrain navigation
- **Nether Highway**: Long-distance nether travel
- **Cave Navigation**: Underground exploration

Also tracks:
- Total movements
- Successful vs failed movements
- Timeout movements
- Safety vetoes

## Behavior

### Query Points
Movement RL is queried at:
1. **travelToCoords()** - Primary pathfinding decisions
2. **Hazard checks** - When hazards are detected
3. **Path recovery** - When stuck or path recalculated

### Confidence & Fallback
- Confidence threshold: 0.7
- If confidence < 0.7 or RL disabled: uses `standard_pathfinder`
- If safety filter vetoes: uses `standard_pathfinder`
- Ensures reliable destination reaching even with RL off

### Learning
- Batch training: 32 most recent experiences every 60 seconds
- Input size: 7 features
- Network iterations: 100
- Error threshold: 0.01

## Testing

Comprehensive test suite (`test_rl_movement.js`) with 20 tests:
- ✅ Action selection with high confidence
- ✅ Scenario-based action selection
- ✅ Safety gate prevents unsafe actions (elytra, pillar bridge, water bucket)
- ✅ Safety veto logging
- ✅ Reward calculation for movement outcomes
- ✅ Reward penalties (lava contact, loops, etc.)
- ✅ Outcome recording and stats tracking
- ✅ Efficiency bonuses
- ✅ Smooth path bonuses
- ✅ Stats reset functionality
- ✅ Success rate calculation
- ✅ Fallback when RL disabled
- ✅ Training data accumulation
- ✅ Timeout penalties
- ✅ Fall damage penalties
- ✅ Unstuck avoidance bonuses
- ✅ Equipment availability impact

Run tests: `node test_rl_movement.js`

## Integration with Other RL Domains

Knowledge can be shared with:
- **Mining RL**: Underground navigation scenarios
- **Building RL**: Terrain assessment for construction
- **Dialogue RL**: Context-aware movement suggestions

## Configuration

Add to config initialization (line ~1329):
```javascript
neural: {
  movement: null,  // Will be initialized by MovementRL
  // ... other neural configs
}
```

## Files Modified

1. **HunterX.js**:
   - Added MovementRL class (line ~17306)
   - Updated config.neural (line ~1329)
   - Integrated with MovementModeManager (line ~19172)
   - Integrated with MovementFramework (line ~22344)
   - Integrated with HighwayNavigator (line ~18819)
   - Added admin commands (line ~15986)
   - Added model loading on startup (line ~25189)
   - Added training/saving loops (lines ~25814, ~25823)

2. **test_rl_movement.js** (NEW):
   - 20 comprehensive integration tests
   - All tests passing ✅

3. **.gitignore**:
   - Already includes `models/` directory

## Example Usage

```javascript
// Get movement RL stats
const stats = bot.movementModeManager.getMovementRLStats();
console.log(`Success rate: ${stats.successRate}`);

// Manually train model
await bot.movementModeManager.trainMovementRL();

// Save model
bot.movementModeManager.saveMovementRL();

// Reset statistics
bot.movementModeManager.resetMovementRLStats();
```

## Future Enhancements

- Multi-path exploration for faster convergence
- Real-time path optimization
- Integration with enemy avoidance RL
- Prediction of stuck states before they occur
- Terrain difficulty assessment
- Weather/biome impact on movement decisions
