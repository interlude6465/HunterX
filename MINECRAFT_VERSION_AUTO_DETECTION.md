# Minecraft Version Auto-Detection & Caching System

## Overview

This system enables automatic detection and caching of Minecraft server versions without requiring manual configuration. The bot automatically detects the server version on first connection and caches it for future use.

## Features

### 1. Automatic Version Detection
The bot uses a multi-step detection strategy:

**Priority Order:**
1. **Cache Check** - Uses cached version if available (24-hour TTL)
2. **Server Ping** - Attempts to extract version from server ping response
3. **Direct Connection Tests** - Tries connecting with common versions:
   - 1.21.4 (latest)
   - 1.21.1
   - 1.21
   - 1.20.4
   - 1.20.1
   - 1.20
   - 1.19.2
4. **Fallback** - Uses configured fallback version as last resort

### 2. Server Version Caching
- **Location**: `data/server_versions.json`
- **Format**: 
```json
{
  "2b2t.org": {
    "version": "1.21.4",
    "protocol": 772,
    "timestamp": 1702500000000
  },
  "8b8t.me": {
    "version": "1.20.1",
    "protocol": 763,
    "timestamp": 1702400000000
  }
}
```
- **TTL**: 24 hours (cache is refreshed after this period)
- **Auto-created**: Data directory is created automatically

### 3. Integrated Bot Spawning
Both proxy and local bots now use auto-detection:

```javascript
// Spawning a bot on a new server
const bot = await spawner.createProxyBot('2b2t.org:25565', {
  username: 'MyBot'
  // No version needed! It will auto-detect
});
```

The bot will:
1. Check if 2b2t.org version is cached
2. If not cached or expired, detect the version
3. Cache the result for next time
4. Connect with the correct version

### 4. Management Commands

#### Check Server Version
```
!server version
```
Response example:
```
🔌 Server: 2b2t.org, Version: 1.21.4 (cached 2h ago)
```

#### Server Info
```
server info
server status
```
Response example:
```
📊 Server Info:
  🔌 Host: 2b2t.org:25565
  📦 Version: 1.21.4
  ⏱️ Cache age: 2m
  📍 Bot position: 1234, 64, 5678
```

#### Force Version Re-Detection (Admin Only)
```
update version
```
Response example:
```
🔄 Attempting to re-detect server version for 2b2t.org...
✅ Version updated: 1.21.4 (source: direct_test)
```

## Implementation Details

### Core Functions

#### `detectServerVersionAutomatic(serverIP)`
Main detection function with full fallback strategy.
- Returns: `{ version, protocol, source, confidence }`
- Sources: `'cache'`, `'ping'`, `'direct_test'`, `'fallback'`
- Confidence levels: `'high'`, `'low'`

#### `getCachedServerVersion(host)`
Retrieves cached version if available and not expired.
- Checks 24-hour TTL
- Returns: `{ version, protocol, timestamp }` or `null`

#### `cacheServerVersion(host, version, protocol)`
Saves detected version to cache file.
- Automatically creates `data/` directory
- Logs cache operations

#### Cache Management
- `loadServerVersionCache()` - Reads from file
- `saveServerVersionCache()` - Writes to file
- `ensureDataDirectory()` - Creates data/ if needed

### Protocol Version Mapping

Supported versions with protocol numbers:

```javascript
PROTOCOL_VERSION_MAP = {
  760: '1.19.2',
  763: '1.20.1',
  765: '1.20.4',
  768: '1.21',
  769: '1.21.1',
  771: '1.21.3',
  772: '1.21.4'
}
```

## Usage Examples

### Example 1: First Connection
```javascript
// User connects bot to a new server
const spawner = new BotSpawner();
const bot = await spawner.createProxyBot('survival.example.com:25565', {
  username: 'MyBot'
});

// Console output:
// [SPAWNER] Auto-detecting version for survival.example.com:25565...
// [VERSION] Starting auto-detection for survival.example.com:25565
// [VERSION] Attempting to ping server...
// [VERSION] Detected version from ping: 1.20.4
// [VERSION] Cached version for survival.example.com: 1.20.4
// [SPAWNER] Auto-detection result: 1.20.4 (source: ping, confidence: high)
// [SPAWNER] ✅ Pathfinder plugin loaded for proxy bot: MyBot
```

### Example 2: Subsequent Connection
```javascript
// Later: User connects bot to same server
const bot = await spawner.createProxyBot('survival.example.com:25565', {
  username: 'MyBot2'
});

// Console output:
// [SPAWNER] Auto-detecting version for survival.example.com:25565...
// [VERSION] Starting auto-detection for survival.example.com:25565
// [VERSION] Found cached version for survival.example.com: 1.20.4 (0h old)
// [SPAWNER] Auto-detection result: 1.20.4 (source: cache, confidence: high)
// [SPAWNER] ✅ Pathfinder plugin loaded for proxy bot: MyBot2
// Bot connects instantly without detection delay!
```

### Example 3: Cache Miss (Different Server)
```javascript
// User connects to a server with different version
const bot = await spawner.createProxyBot('pvp.oldserver.com:25565', {
  username: 'MyBot3'
});

// Console output:
// [SPAWNER] Auto-detecting version for pvp.oldserver.com:25565...
// [VERSION] Starting auto-detection for pvp.oldserver.com:25565
// [VERSION] Attempting to ping server...
// [VERSION] Ping failed: Server did not respond
// [VERSION] Falling back to trying common versions...
// [VERSION] Testing version 1.21.4... (timeout after 3s)
// [VERSION] Testing version 1.21.1... (timeout after 3s)
// [VERSION] Testing version 1.21... (timeout after 3s)
// [VERSION] Testing version 1.20.4... (timeout after 3s)
// [VERSION] Testing version 1.20.1...
// [VERSION] Successfully connected with version 1.20.1
// [VERSION] Cached version for pvp.oldserver.com: 1.20.1
// [SPAWNER] Auto-detection result: 1.20.1 (source: direct_test, confidence: high)
```

### Example 4: Check Cached Versions
```
!server version
```
Output:
```
🔌 Server: 2b2t.org, Version: 1.21.4 (cached 12h ago)
```

## Configuration

### Default Fallback Version
- Defaults to: `1.21.4`
- Can be overridden in config:
```javascript
config.bot = {
  fallbackVersion: '1.20.1',
  defaultProtocolVersion: '1.20.1'
}
```

### Supported Versions
- Customizable in config:
```javascript
config.bot.supportedVersions = [
  '1.21.4', '1.21.1', '1.21',
  '1.20.4', '1.20.1', '1.20',
  '1.19.2'
]
```

## File Structure

```
/home/engine/project/
├── HunterX.js                    (Main bot file with auto-detection)
├── data/
│   └── server_versions.json      (Auto-created cache file)
└── MINECRAFT_VERSION_AUTO_DETECTION.md (This file)
```

## Error Handling

### Graceful Fallback
If all detection methods fail:
1. Logs all attempts with reasons
2. Falls back to configured default version
3. Bot still connects successfully
4. Confidence marked as 'low'

Example console output:
```
[VERSION] All detection methods failed, using fallback: 1.21.4
[SPAWNER] Auto-detection result: 1.21.4 (source: fallback, confidence: low)
```

### Connection Retry
If the detected version fails to connect:
1. Version extraction from error message is attempted
2. Alternative versions are tried
3. Falls back to direct version testing
4. Finally uses configured fallback

## Performance

### Cache Benefits
- **First connection**: 3-5 seconds (detection time)
- **Cached connection**: <100ms (no detection needed)
- **24-hour TTL**: Balances freshness vs. performance

### Detection Process Speed
- Cache hit: <1ms
- Ping: ~500ms-2s
- Direct test (successful): ~1-3s per version
- Total fallback: ~20-30s worst case

## Logging

All version operations are logged with `[VERSION]` prefix:

```
[VERSION] Created data directory
[VERSION] Loaded server version cache with 5 entries
[VERSION] Starting auto-detection for 2b2t.org:25565
[VERSION] Found cached version for 2b2t.org: 1.21.4 (0h old)
[VERSION] Attempting to ping server...
[VERSION] Detected version from ping: 1.21.4
[VERSION] Successfully connected with version 1.21.4
[VERSION] Cached version for 2b2t.org: 1.21.4
```

## Troubleshooting

### Version Detection Takes Too Long
- Check network connectivity to server
- Verify server is not blocking ping requests
- Look for timeout messages in logs

### Wrong Version Detected
- Use `update version` command to force re-detection
- Check `data/server_versions.json` for cached wrong version
- Delete cache entry manually if needed

### Cache Not Working
- Ensure `data/` directory has write permissions
- Check `data/server_versions.json` is valid JSON
- Look for save/load error messages in logs

### Always Using Fallback
- Server may be unreachable during detection
- Check that the server version is in supportedVersions list
- Try manual `update version` command with admin privileges

## Future Enhancements

Potential improvements:
- Cache statistics (hit rate, most common versions)
- Parallel version testing instead of sequential
- DNS SRV record support for Bedrock servers
- Smart cache invalidation based on server updates
- Per-server connection retry history
