# Autonomous Dupe Discovery System

## Overview

The Autonomous Dupe Discovery System enables HunterX to independently test various duplication methods, gather required materials, track results, and generate hypothesis documents - all without human intervention.

## Features

### 1. Autonomous Method Testing
- Tests multiple duplication methods sequentially
- Automatically gathers required materials if missing
- Monitors success/failure with confidence levels
- Adapts based on server response

### 2. Method Registry
Pre-configured duplication methods include:
- **Crystal PvP Dupe**: High-risk method using crystals, beds, and totems
- **Anchor Dupe**: Medium-risk method using respawn anchors
- **Shulker Dupe**: Low-risk method for shulker box duplication
- **Totem Dupe**: High-risk totem duplication variant
- **Donkey Dupe**: Low-risk donkey/chest duplication

Each method includes:
- Requirements list (items needed)
- Step-by-step execution plan
- Success indicators
- Risk level assessment

### 3. Material Gathering
- Automatically detects missing materials
- Attempts to gather materials using existing systems
- Configurable timeout for gathering operations
- Falls back gracefully if materials unavailable

### 4. Result Tracking
Each attempt is logged with:
- Method name and description
- Timestamp
- Materials used
- Success/failure status with confidence level
- Server response (kicked, no response, etc.)
- Inventory changes
- Duration

Stored in: `./data/dupe_discovery.json`

### 5. Hypothesis Generation
AI-powered hypothesis generator creates theories about:
- Why certain methods worked/failed
- Server anti-cheat behaviors detected
- Patterns in method effectiveness
- Recommendations for next attempts

Stored in: `./data/dupe_hypotheses.json`

### 6. Comprehensive Reporting
Generates detailed reports including:
- Methods tested count
- Success/failure breakdown
- Success rate percentage
- Most promising method
- Server safety level assessment
- Next recommended actions

Stored in: `./data/dupe_discovery_report.json`

### 7. Anti-Detection Measures
- Configurable spacing between attempts (default: 10 seconds)
- Randomized method order
- Mix normal activities between tests
- Stop immediately if kicked
- Configurable retry limits per method

## Chat Commands

### Start Discovery
```
!dupe discover start
```
or
```
start dupe discovery
```
Requires: **trusted+** permission level

### Stop Discovery
```
!dupe discover stop
```
or
```
stop dupe discovery
```

### View Report
```
!dupe discover report
```
or
```
dupe discovery report
```
Shows summary of latest discovery run including:
- Total methods tested
- Successful/failed counts
- Success rate
- Most promising method
- Server safety assessment
- Next recommendations

### Check Status
```
!dupe discover status
```
Shows current status:
- Active/idle state
- Current method being tested
- Total attempts in history
- Number of hypotheses generated

## Configuration

Located in `config.dupeDiscovery`:

```javascript
{
  enabled: true,
  autoStartIdleThreshold: 300000, // 5 minutes idle before auto-start
  methodRetryDelay: 5000, // 5 seconds between methods
  materialGatherTimeout: 60000, // 1 minute to gather materials
  confidenceThreshold: 0.7, // Only accept 70%+ confidence results
  maxAttemptsPerMethod: 3,
  logFilePath: './data/dupe_discovery.json',
  hypothesisPath: './data/dupe_hypotheses.json',
  reportPath: './data/dupe_discovery_report.json',
  antiDetection: {
    spacingDelay: 10000, // 10 seconds between attempts
    randomizeOrder: true,
    mixNormalActivities: true,
    stopOnKick: true
  },
  methods: [
    // Array of method definitions (see config for full list)
  ]
}
```

### Configuration Options

- **enabled**: Enable/disable the discovery system
- **autoStartIdleThreshold**: Auto-start discovery after idle time (ms)
- **methodRetryDelay**: Delay between testing different methods (ms)
- **materialGatherTimeout**: Max time to spend gathering materials (ms)
- **confidenceThreshold**: Minimum confidence (0-1) to mark success
- **maxAttemptsPerMethod**: Max times to retry each method
- **antiDetection.spacingDelay**: Delay between attempts to avoid detection
- **antiDetection.randomizeOrder**: Randomize method test order
- **antiDetection.mixNormalActivities**: Mix normal activities between tests
- **antiDetection.stopOnKick**: Stop immediately if kicked

## Usage Examples

### Basic Discovery Run
1. Connect bot to server
2. Ensure bot is whitelisted as trusted+
3. Execute: `!dupe discover start`
4. Bot will test all configured methods
5. View results: `!dupe discover report`

### Monitor Progress
While discovery is running:
```
!dupe discover status
```

### Stop Early
If needed:
```
!dupe discover stop
```

## Data Files

### dupe_discovery.json
Complete history of all attempts:
```json
{
  "attempts": [
    {
      "timestamp": 1234567890,
      "method": "crystal_pvp_dupe",
      "description": "Crystal PvP duplication method",
      "success": false,
      "confidence": 0.2,
      "reason": "No significant inventory changes detected",
      "duration": 5000,
      "inventoryChange": {},
      "serverResponse": "no_kick"
    }
  ],
  "lastUpdate": 1234567890
}
```

### dupe_hypotheses.json
AI-generated theories:
```json
{
  "hypotheses": [
    {
      "type": "failure_pattern",
      "timestamp": 1234567890,
      "content": "Failed methods (5). Common reasons: Could not gather required materials",
      "confidence": 0.7,
      "recommendations": [
        "Server likely has protections against these specific methods",
        "Try alternative approaches not yet tested"
      ]
    }
  ],
  "lastUpdate": 1234567890
}
```

### dupe_discovery_report.json
Summary report:
```json
{
  "timestamp": 1234567890,
  "summary": {
    "totalMethodsTested": 5,
    "successfulDupes": 1,
    "failedAttempts": 4,
    "successRate": "20.0%"
  },
  "mostPromisingMethod": "shulker_dupe (confidence: 85%)",
  "nextRecommendations": [
    "Test variations of successful methods with different items"
  ],
  "serverBehavior": {
    "antiDupeActive": true,
    "kicksDetected": 0,
    "safetyLevel": "high"
  }
}
```

## Integration with Existing Systems

The Dupe Discovery Manager integrates with:
- **Mining Systems**: For material gathering
- **Combat AI**: For crystal-based duplication methods
- **Chat System**: For command processing and reporting
- **Analytics**: Tracks attempts in `config.analytics.dupe`

## Technical Details

### Class: DupeDiscoveryManager

Main class handling discovery operations:
- `startDiscovery()`: Begin testing all methods
- `stopDiscovery()`: Stop current discovery run
- `testMethod(method)`: Test a single method
- `gatherMaterials(materials)`: Gather required items
- `generateHypotheses()`: Create AI theories
- `generateReport()`: Create summary report
- `getReport()`: Retrieve latest report

### Success Detection

Success is determined by:
1. Inventory snapshot before/after
2. Detection of inventory increases
3. Matching against success indicators
4. Confidence calculation (0-1 scale)
5. Comparison to confidence threshold

### Anti-Detection Strategy

To avoid bot farm detection:
- Randomize method order each run
- Space out attempts with configurable delays
- Mix in normal activities (looking around, walking, mining)
- Stop immediately on kick detection
- Limit retry attempts per method

## Safety Considerations

- **Risk Levels**: Each method has a risk level (low/medium/high)
- **Server Kicks**: System stops if kicked during testing
- **Material Costs**: Some methods require expensive materials
- **Detection**: Heavy testing may trigger anti-cheat systems

## Future Enhancements

Potential improvements:
- [ ] Integration with real mining/pathfinding for material gathering
- [ ] Machine learning to optimize method selection
- [ ] Multi-bot coordinated testing
- [ ] Server plugin fingerprinting
- [ ] Timing optimization for each method
- [ ] Custom method creation from chat
- [ ] Video recording of successful dupes

## Troubleshooting

### Discovery Not Starting
- Check permission level (trusted+ required)
- Verify bot is connected to server
- Check `config.dupeDiscovery.enabled = true`

### All Methods Failing
- Check material availability
- Increase `materialGatherTimeout`
- Review server anti-dupe protection
- Check bot permissions on server

### No Report Generated
- Ensure at least one discovery run completed
- Check file permissions in `./data/` directory
- Verify config paths are correct

## Analytics Integration

Discovery attempts are tracked in `config.analytics.dupe`:
- `totalAttempts`: Total number of attempts
- `successfulDupes`: Number of successful duplications
- `hypothesesTested`: Number of hypotheses generated

Access via: `!dupe stats` or `dupe report`

## Command Reference

| Command | Permission | Description |
|---------|-----------|-------------|
| `!dupe discover start` | trusted+ | Start autonomous discovery |
| `!dupe discover stop` | any | Stop current discovery |
| `!dupe discover report` | any | View latest report |
| `!dupe discover status` | any | Check current status |
| `!dupe stats` | any | View dupe analytics |

## License & Disclaimer

This feature is for educational purposes on authorized servers only. Use responsibly and in accordance with server rules. Duplication exploits may be considered cheating on many servers.
