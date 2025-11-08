# Baritone Block Finder - Usage Examples

## Basic Commands

### Find Specific Blocks
```
findblock diamond
findblock obsidian
findblock iron ore
findblock coal
findblock emerald
```

### Get Blocks with Return
```
getblock diamond
getblock obsidian
getblock iron ore
```

### Enhanced Find/Get Commands
```
find me diamonds
find me diamond ore
find me a diamond block
get me 5 iron ore
get me some coal
```

## How It Works

### 1. Direct Block Commands
- `findblock <name>` - Searches for and retrieves the specified block
- `getblock <name>` - Same as findblock, alternative syntax
- Returns to player after successful retrieval

### 2. Smart Detection
- "diamond" → Searches for diamond_ore
- "diamond block" → Searches for diamond_block
- "iron ore" → Searches for iron_ore
- Non-block requests fall back to existing item hunting

### 3. Search Strategy
1. **Fast Search**: Scans 100x100x100 block area around player
2. **Exploration**: Pathfinds to spiral points if not found nearby
3. **Timeout**: 60-second maximum search time
4. **Return**: Automatically returns to player after success

### 4. Safety Features
- Checks for dangerous blocks (lava, TNT, etc.)
- Selects appropriate tools automatically
- Won't mine hazardous blocks
- Provides clear feedback

## Example Session

```
Player: findblock diamond
Bot: 🔍 Looking for diamond...
Bot: [FINDER] 🔍 Looking for: diamond
Bot: [FINDER] 📝 Normalized: diamond_ore
Bot: [FINDER] 🗺️ Strategy 1: Searching loaded chunks...
Bot: [FINDER] 🗺️ Searching 100x100x100 area around 100,64,200
Bot: [FINDER] ✅ Found diamond_ore at 105 62 198 (15.2 blocks away)
Bot: [FINDER] 🎯 Found 1 instances, closest is 15.2 blocks away
Bot: ✅ Found diamond at 105 62 198
Bot: [FINDER] 🚶 Pathfinding to 105 62 198
Bot: [FINDER] 🔧 Equipped diamond_pickaxe for mining
Bot: [FINDER] ✅ Successfully dug diamond_ore
Bot: 🚶 Returning to PlayerName...
Bot: ✅ Successfully found and returned with diamond!
```

## Supported Block Types

### Ores
- diamond, coal, iron, gold, lapis, redstone, emerald, copper
- "diamond ore", "iron ore", "gold ore", etc.

### Blocks
- obsidian, stone, dirt, sand, gravel
- wood, logs, planks
- "diamond block", "iron block", "gold block"

### Special Blocks
- nether_wart_block, ancient_debris (Nether only)
- end_stone, purpur_block, dragon_egg (End only)

## Performance

### Speed Comparison
- **Strip Mining**: 5-10 minutes for nearby ore
- **Block Finder**: 5-30 seconds for nearby ore
- **Medium Distance**: 1-3 minutes vs 10-30 minutes

### Efficiency
- No wasted mining of unwanted blocks
- Direct path to target
- Minimal landscape disruption
- Automatic tool selection

## Error Handling

### Common Scenarios
```
Player: findblock diamond
Bot: ❌ Couldn't find diamond, trying item hunting...
Bot: [HUNTER] 🔍 Starting hunt for diamond...

Player: findblock lava
Bot: ⚠️ That block looks dangerous to mine!

Player: findblock ancient_debris
Bot: ⚠️ That block is in the Nether, need to travel there!

Player: find me something
Bot: Sorry PlayerName, I couldn't understand that item request.
```

## Integration with Existing Features

### Item Hunting Fallback
- Non-block requests use existing ItemHunter system
- Maintains all existing functionality
- Seamless user experience

### Trust System
- Respects existing trust levels
- All users can use basic find commands
- Admin features remain unchanged

### Swarm Coordination
- Works with existing swarm system
- Multiple bots can search simultaneously
- Coordinated block finding operations

## Tips

### Best Practices
1. **Be Specific**: Use "diamond ore" instead of "diamond" for ores
2. **Check Tools**: Ensure bot has appropriate tools for target blocks
3. **Consider Distance**: Nearby blocks found much faster
4. **Use Direct Commands**: `findblock diamond` is faster than `find me diamonds`

### Common Patterns
```
# Quick ore gathering
findblock iron ore
findblock coal
findblock diamond

# Building materials
findblock stone
findblock obsidian
findblock wood

# Specific requests
find me a diamond block
get me 5 iron ore
findblock emerald
```

This implementation provides a much more efficient and user-friendly alternative to traditional strip mining strategies while maintaining full compatibility with the existing HunterX bot ecosystem.