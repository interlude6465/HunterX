# Continuous Plugin Scanner Guide

## Overview
The Continuous Plugin Scanner is an enhanced feature that automatically monitors and analyzes uploaded plugins at scheduled intervals. It tracks vulnerability trends over time, detects exploit effectiveness decay, and propagates discoveries across the swarm network.

## Features

### 1. Automated Periodic Scanning
- Plugins are automatically re-scanned at configurable intervals (default: 5 minutes)
- Queue-based processing with priority support (high, normal, low)
- Automatic re-population of queue for plugins that haven't been scanned recently

### 2. Trend Analysis
- Tracks vulnerability risk scores over time
- Detects increasing/decreasing/stable risk trends
- Identifies exploit effectiveness decay when exploit count drops
- Maintains up to 50 historical trend data points per plugin

### 3. Persistence
- All scan results stored in `./dupes/continuous_scan.json`
- Includes:
  - Historical scans with timestamps
  - Plugin registry with metadata
  - Trend data for each plugin
  - Queue state and scanning status

### 4. Swarm Integration
- Discoveries automatically propagate to all connected bots via WebSocket
- Updates shared memory with vulnerability information
- Broadcasts `PLUGIN_VULNERABILITY_DISCOVERED` messages to swarm

### 5. Analytics Integration
- New exploits automatically added to `config.analytics.dupe.activeExploits`
- Tracks discovery timestamps, attempts, and successes
- Maintains up to 50 active exploits

## Usage

### Dashboard Controls
Navigate to `http://localhost:8080` and locate the "🔄 Continuous Plugin Scanner" panel:

1. **Start Scanner**: Click "▶️ Start Scanner" button, specify interval in seconds
2. **Stop Scanner**: Click "⏹️ Stop Scanner" button
3. **Refresh**: Click "🔄 Refresh" to update status immediately
4. **View Recent Scans**: See last 10 scans with risk scores and timestamps
5. **View Tracked Plugins**: Monitor all registered plugins with scan counts and trends

### HTTP API Endpoints

#### Start Scanning
```bash
curl -X POST http://localhost:8080/scanner/start \
  -H "Content-Type: application/json" \
  -d '{"intervalMs": 300000}'
```

#### Stop Scanning
```bash
curl -X POST http://localhost:8080/scanner/stop
```

#### Get Status
```bash
curl http://localhost:8080/scanner/status
```

#### Add Plugin to Queue
```bash
curl -X POST http://localhost:8080/scanner/queue \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./dupes/test_plugin.jar",
    "fileName": "test_plugin.jar",
    "priority": "high"
  }'
```

### In-Game Commands (Admin+ only)

- `start scanner` - Start continuous scanning
- `stop scanner` - Stop continuous scanning
- `scanner status` - View current scanner status and recent findings

### Programmatic Usage

```javascript
// Access the global plugin analyzer
const analyzer = globalPluginAnalyzer;

// Add a plugin to the scan queue
analyzer.addToScanQueue('./dupes/plugin.jar', 'plugin.jar', 'high');

// Start continuous scanning (5 minute intervals)
analyzer.startContinuousScanning(300000);

// Get current status
const status = analyzer.getContinuousScanStatus();
console.log(`Active: ${status.active}, Queue: ${status.queueSize}`);

// Stop scanning
analyzer.stopContinuousScanning();
```

## Data Structure

### continuous_scan.json
```json
{
  "scans": [
    {
      "fileName": "plugin.jar",
      "timestamp": 1234567890,
      "analysis": {
        "fileName": "plugin.jar",
        "riskScore": 75,
        "vulnerabilities": [...],
        "exploitOpportunities": [...]
      },
      "queuePriority": "high",
      "scanNumber": 5
    }
  ],
  "plugins": [
    [
      "plugin.jar",
      {
        "filePath": "./dupes/plugin.jar",
        "fileName": "plugin.jar",
        "firstAdded": 1234567890,
        "scanCount": 5,
        "lastScan": 1234567890,
        "lastRiskScore": 75,
        "trendData": [
          {
            "timestamp": 1234567890,
            "riskScore": 75,
            "vulnerabilityCount": 4,
            "exploitCount": 3,
            "riskChange": 5,
            "trend": "increasing",
            "exploitEffectivenessDecay": false
          }
        ]
      }
    ]
  ],
  "lastUpdate": 1234567890,
  "scanningActive": true,
  "queueSize": 2
}
```

## Swarm Message Format

When a significant vulnerability is found (risk > 50 or exploits > 0):

```json
{
  "type": "PLUGIN_VULNERABILITY_DISCOVERED",
  "timestamp": 1234567890,
  "plugin": "plugin.jar",
  "riskScore": 75,
  "vulnerabilities": 4,
  "exploitOpportunities": [
    {
      "method": "inventory_race_dupe",
      "description": "Concurrent inventory operations race condition",
      "timing": "precise",
      "successProbability": 0.7,
      "sequence": ["open_inventory", "rapid_item_movement", "..."]
    }
  ],
  "summary": "Found 4 vulnerabilities in plugin.jar"
}
```

## Best Practices

1. **Set Appropriate Intervals**: Balance between detection speed and server load
   - Fast servers: 180000ms (3 minutes)
   - Normal servers: 300000ms (5 minutes)
   - Slow servers: 600000ms (10 minutes)

2. **Monitor Queue Size**: If queue grows too large, increase scan interval

3. **Use Priority Levels**:
   - `high`: New uploads, suspected vulnerabilities
   - `normal`: Regular re-scans
   - `low`: Stable plugins with no history of issues

4. **Review Trends**: Pay attention to plugins showing "increasing" risk trends

5. **Exploit Decay**: When effectiveness decay is detected, consider:
   - Server has patched the vulnerability
   - Anti-cheat has been updated
   - Time to discover new methods

## Troubleshooting

### Scanner won't start
- Check if already running: `scanner status`
- Verify permissions (admin+ required for commands)
- Check console logs for errors

### No plugins being scanned
- Verify plugins are in queue: Check dashboard or `/scanner/status`
- Add test plugin: Use `/scanner/queue` endpoint
- Check file paths are correct and files exist

### Trends not updating
- Ensure scanner is running continuously
- Verify `continuous_scan.json` has write permissions
- Check that plugins have been scanned multiple times

## Security Considerations

- Scanner commands require admin+ trust level
- API endpoints are accessible without authentication (consider implementing auth)
- Scan results contain sensitive exploit information
- `continuous_scan.json` should be protected from unauthorized access
- Consider rate limiting API endpoints in production

## Performance Notes

- Each scan processes one plugin from the queue
- Binary analysis limited to first 50KB of file content
- Queue sorting happens on each process cycle
- Trend data limited to last 50 entries per plugin
- Total scans limited to last 500 entries globally
