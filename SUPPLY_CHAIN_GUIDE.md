# Supply Chain Task Queue System

## Overview
The Supply Chain Task Queue System provides a comprehensive autonomous bot coordination platform with web-based task management. Users can queue tasks like "collect wood", "find diamonds", "craft items" and bots will automatically work through the queue.

## Features

### 🎯 Task Queue System
- **Priority-based queuing**: urgent > high > normal > low
- **Task types**: collect, find, craft, build
- **Auto-retry**: Failed tasks automatically re-queued with lower priority
- **Real-time progress**: Live progress tracking for all tasks
- **Multi-bot support**: Multiple bots work on different tasks simultaneously

### 📦 Global Inventory
- **Centralized tracking**: Home base, ender chest, and bot inventories
- **Persistent storage**: Data saved to `./data/inventory/`
- **Valuable items tracking**: Automatic tracking of diamonds, emeralds, etc.
- **Real-time updates**: Inventory updates as bots complete tasks

### 📊 Production Analytics
- **Performance metrics**: Items per hour, success rates, efficiency
- **Bot leaderboard**: Compare performance across all worker bots
- **Production history**: Track what's been produced over time
- **Persistent stats**: Data saved to `./data/production/`

### 🌐 Web Dashboard
- **Modern UI**: Clean, responsive interface
- **Real-time updates**: Auto-refresh every 3 seconds
- **Task management**: Add, monitor, and track tasks
- **Inventory view**: See all collected resources
- **Mobile friendly**: Works on all devices

## Usage

### Starting the System
1. Run `node HunterX.js`
2. Select option `6` for "Supply Chain Manager"
3. Enter server IP:PORT
4. Choose number of worker bots (1-5)
5. Access dashboard at `http://localhost:8081/task-queue`

### Adding Tasks
**Via Web Interface:**
1. Open `http://localhost:8081/task-queue`
2. Fill in task form:
   - Type: collect/find/craft/build
   - Item: Minecraft item name
   - Quantity: Amount needed
   - Priority: urgent/high/normal/low
3. Click "Add to Queue"

**Via API:**
```bash
curl -X POST http://localhost:8081/api/task-queue/add \
  -H "Content-Type: application/json" \
  -d '{"type":"collect","item":"oak_log","quantity":64,"priority":"normal"}'
```

### API Endpoints
- `GET /task-queue` - Web dashboard
- `GET /api/task-queue` - Get queue status
- `POST /api/task-queue/add` - Add new task
- `GET /api/supply-chain/status` - Full system status

## Task Types

### 🪓 Collect Tasks
- Bots mine/gather specified resources
- Supports any mineable block (wood, stone, ores, etc.)
- Progress tracking shows collection progress
- Items automatically deposited at home base

### 🔍 Find Tasks
- Specialized for rare items (diamonds, emeralds, etc.)
- Extended search radius
- Higher priority processing
- Strategic pathfinding for efficiency

### 🔨 Craft Tasks
- Automatic crafting using available recipes
- Progress tracking for multi-item crafts
- Resource checking before starting
- Error handling for missing materials

### 🏗️ Build Tasks
- Placeholder for schematic building
- Integration with existing schematic system
- Future expansion point
- Task completion tracking

## Bot Behavior

### Task Assignment
- Bots automatically pick up available tasks
- Priority-based assignment
- Load balancing across multiple bots
- Automatic failover handling

### Work Patterns
- Idle bots immediately claim new tasks
- Progress updates every 5 seconds
- Error handling with retry logic
- graceful task completion/cleanup

### Resource Management
- Automatic inventory management
- Home base deposit on completion
- Ender chest integration
- Global inventory synchronization

## Data Storage

### File Structure
```
data/
├── inventory/
│   └── global_inventory.json    # Global inventory state
├── production/
│   └── production_stats.json    # Production analytics
└── ... (other existing data)
```

### Data Persistence
- Automatic saving on every change
- JSON format for easy editing
- Backup-friendly structure
- Migration-safe design

## Integration

### Existing Systems
- **Home Base**: Uses configured home base coordinates
- **Whitelist**: Respects existing trust system
- **Analytics**: Integrates with global analytics
- **Error Handling**: Uses existing safe I/O wrappers

### Bot Modes
- **Supply Chain**: Dedicated worker mode
- **Multi-mode**: Can work alongside other modes
- **Swarm Compatible**: Integrates with swarm coordination
- **Graceful Cleanup**: Proper disconnection handling

## Configuration

### Home Base Setup
1. Set home base coordinates in existing system
2. Bots will automatically deposit items there
3. Used as central resource hub
4. Required for inventory management

### Task Priorities
- **Urgent**: Diamonds, critical resources
- **High**: Building materials, tools
- **Normal**: Common resources, food
- **Low**: Decorative items, extras

## Monitoring

### Dashboard Features
- **Live Statistics**: Real-time task counts
- **Progress Bars**: Visual progress tracking
- **Time Tracking**: Task duration monitoring
- **Success Rates**: Completion percentage
- **Bot Status**: Online/working/idle counts

### Performance Metrics
- **Items/Hour**: Production efficiency
- **Task Success**: Completion rates
- **Bot Efficiency**: Performance comparison
- **Resource Flow**: Input/output tracking

## Troubleshooting

### Common Issues
1. **Port Conflict**: Supply chain uses 8081, not 8080
2. **No Home Base**: Set home base for inventory management
3. **Bot Idle**: Check network connectivity and permissions
4. **Task Stuck**: Failed tasks auto-retry after 30 seconds

### Debug Information
- All operations logged to console
- Error details in task results
- Performance metrics in production stats
- HTTP requests logged for API debugging

## Future Enhancements

### Planned Features
- **Advanced Crafting**: Recipe optimization
- **Trading Integration**: Automatic resource trading
- **Machine Learning**: Task optimization
- **Mobile App**: Native mobile interface
- **Cluster Support**: Multi-server coordination

### Extension Points
- **Custom Task Types**: Plugin system for new tasks
- **Custom Analytics**: Metrics collection framework
- **Custom Storage**: Alternative storage backends
- **Custom UI**: Theming and layout system

## Security

### Rate Limiting
- HTTP endpoints rate limited (100 requests/minute)
- IP-based tracking
- Automatic cleanup of expired limits
- DDoS protection

### Input Validation
- All API inputs validated
- SQL injection prevention
- XSS protection in web UI
- Safe file path handling

## Support

For issues or questions:
1. Check console logs for error details
2. Verify network connectivity to Minecraft server
3. Ensure proper home base configuration
4. Review API response codes for debugging

The supply chain system provides a robust foundation for autonomous resource management and bot coordination in your Minecraft automation setup.