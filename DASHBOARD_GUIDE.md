# HunterX Web Dashboard Guide

## Overview

The HunterX Web Dashboard is a professional, real-time control interface for monitoring and controlling your Minecraft bot. It features a dark-themed design with WebSocket-based live updates, providing instant feedback on bot status, inventory, telemetry, and chat messages.

## Quick Start

### Accessing the Dashboard

1. Start HunterX normally:
   ```bash
   node HunterX.js
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:8080
   ```

3. The dashboard will automatically connect to the WebSocket telemetry server on port 9090

### Architecture

The dashboard consists of three main components:

- **HTTP Server** (Port 8080): Serves the dashboard static files
- **WebSocket Server** (Port 9090): Real-time telemetry and control
- **Dashboard UI**: HTML/CSS/JavaScript single-page application

## Dashboard Features

### 1. Bot Status Panel

Displays real-time bot information:

- **Connection Status**: Whether bot is connected to the server
- **Username**: Bot's Minecraft username
- **Server**: Current server address
- **Version**: Minecraft protocol version
- **Uptime**: How long the bot has been running
- **Mode**: Current operational mode (PvP, Friendly, Dupe, Stash)
- **Health**: Current health points (0-20)
- **Food**: Current food level (0-20)

### 2. Control Panel

Execute commands and control the bot:

#### Control Buttons
- **Start Bot**: Initialize bot connection
- **Stop Bot**: Disconnect bot safely
- **Emergency Stop**: Immediate shutdown (with confirmation)

#### Command Input
- Enter custom commands in the text field
- Press Enter or click "Send Command" to execute
- Commands are processed through the bot's ConversationAI system

#### Quick Commands
Pre-configured buttons for common operations:
- **PvP Mode**: Switch to combat mode
- **Friendly Mode**: Switch to friendly/assistant mode
- **Dupe Mode**: Activate duplication testing
- **Stash Mode**: Start stash hunting
- **Status**: Query current bot activity
- **Come Here**: Make bot come to your location

#### Command History
- View last 10 commands executed
- Green border indicates successful execution
- Red border indicates errors
- Timestamped for reference

### 3. Telemetry & Stats Panel

Real-time operational metrics:

- **Position**: Current X, Y, Z coordinates
- **Dimension**: Current dimension (overworld, nether, end)
- **Nearby Players**: Count of players within 100 blocks
- **Kills**: Total player kills
- **Deaths**: Total deaths
- **K/D Ratio**: Kill/Death ratio calculation
- **Activity**: Current bot activity description
- **Current Task**: Active task being performed

Updates automatically every 2 seconds.

### 4. Inventory Panel

View bot's inventory in real-time:

- **Inventory Grid**: Visual display of all items with counts
- **Refresh Button**: Manually request inventory update
- **Equipment Section**: 
  - Helmet
  - Chestplate
  - Leggings
  - Boots
  - Main Hand
  - Off Hand

### 5. Console & Chat Panel

Real-time message feed:

- **Chat Messages**: All chat from the server
- **Command Responses**: Feedback from executed commands
- **System Events**: Bot status changes and notifications
- **Error Messages**: Highlighted error notifications
- **Auto-scroll**: Automatically scrolls to new messages (toggleable)
- **Clear Button**: Clear console history
- **Message Limit**: Keeps last 500 messages

Message color coding:
- 🟢 Green: Success messages
- 🔴 Red: Errors
- 🟡 Yellow: Commands
- 🔵 Blue: System events
- ⚪ White: Chat messages

### 6. Configuration Panel

View current bot configuration:

- **Load Config Button**: Request current settings
- **Bot Settings**: Name, version, etc.
- **Combat Settings**: Combat mode, crystal PvP status
- **Swarm Settings**: Swarm mode, role assignment
- Read-only display (editing not yet implemented)

## WebSocket Communication

### Connection Management

The dashboard automatically:
- Connects to `ws://localhost:9090` on load
- Reconnects every 3 seconds if connection drops
- Shows connection status in header (green = connected, red = disconnected, yellow = connecting)

### Message Types

#### Outgoing (Dashboard → Bot)

**Status Request**
```json
{
  "type": "status",
  "action": "getStatus"
}
```

**Telemetry Request**
```json
{
  "type": "telemetry",
  "action": "getTelemetry"
}
```

**Inventory Request**
```json
{
  "type": "telemetry",
  "action": "getInventory"
}
```

**Config Request**
```json
{
  "type": "config",
  "action": "getConfig"
}
```

**Command Execution**
```json
{
  "type": "command",
  "command": "change to pvp mode"
}
```

#### Incoming (Bot → Dashboard)

**Status Update**
```json
{
  "type": "status",
  "data": {
    "connected": true,
    "username": "HunterX",
    "server": "example.com",
    "version": "1.21.4",
    "mode": "pvp",
    "health": 20,
    "food": 20,
    "startTime": 1699999999999
  }
}
```

**Telemetry Update**
```json
{
  "type": "telemetry",
  "data": {
    "position": { "x": 100, "y": 64, "z": 200 },
    "dimension": "overworld",
    "nearbyPlayers": 3,
    "kills": 5,
    "deaths": 1,
    "activity": "Patrolling",
    "currentTask": "Combat mode active"
  }
}
```

**Chat Message**
```json
{
  "type": "chat",
  "data": {
    "message": "<Player> Hello!"
  }
}
```

**Command Response**
```json
{
  "type": "command_response",
  "data": {
    "success": true,
    "message": "Command executed successfully",
    "command": "change to pvp mode"
  }
}
```

## Customization

### Changing Ports

If you need to use different ports, modify these files:

**HTTP Server (HunterX.js line ~27853)**
```javascript
}).listen(8080); // Change to your desired port
```

**WebSocket Server (HunterX.js line ~27858)**
```javascript
const dashboardWss = new WebSocket.Server({ port: 9090 }); // Change port here
```

**Dashboard Client (public/dashboard.js line 3)**
```javascript
const WS_URL = 'ws://localhost:9090'; // Update to match server port
```

### Styling

Modify `public/dashboard.css` to customize the appearance:

- Colors are defined in CSS variables at the top
- Dark theme optimized for gaming aesthetic
- Responsive design works on tablets and desktops
- Monospace font for terminal feel

### Adding New Panels

To add custom panels:

1. Add HTML structure to `public/index.html`
2. Style the panel in `public/dashboard.css`
3. Add JavaScript handlers in `public/dashboard.js`
4. Implement backend data source in HunterX.js

## Troubleshooting

### Dashboard won't load

1. Ensure HunterX is running: `node HunterX.js`
2. Check console for errors
3. Verify port 8080 is not in use: `lsof -i :8080`
4. Try clearing browser cache

### WebSocket won't connect

1. Check WebSocket server status in HunterX console
2. Verify port 9090 is open
3. Check firewall settings
4. Look for `[DASHBOARD-WS]` messages in console

### Data not updating

1. Check WebSocket connection status (header indicator)
2. Verify bot is connected to Minecraft server
3. Check browser console for JavaScript errors
4. Try refreshing the page

### Commands not working

1. Ensure bot is connected (check Bot Status panel)
2. Verify command syntax is correct
3. Check Console panel for error messages
4. Confirm you're whitelisted (if whitelist is enabled)

## Security Considerations

### Local Network Only

By default, the dashboard is accessible from:
- `http://localhost:8080` (same machine)
- `http://[your-ip]:8080` (local network)

### External Access

To access from outside your network:

1. **Port Forwarding**: Forward ports 8080 and 9090 on your router
2. **Firewall**: Allow incoming connections on these ports
3. **Security**: Consider adding authentication (not currently implemented)

⚠️ **Warning**: Exposing the dashboard to the internet without authentication allows anyone to control your bot!

### Authentication (Future Enhancement)

Current version has no authentication. Planned features:
- Login system with username/password
- Session tokens
- Role-based access control
- IP whitelisting

## Performance

### Resource Usage

- **HTTP Server**: Minimal overhead, serves static files
- **WebSocket**: ~1KB/sec bandwidth per client
- **Browser**: ~20-50 MB RAM per dashboard tab

### Optimization Tips

1. Close unused dashboard tabs
2. Disable auto-scroll if not needed
3. Clear console periodically for very long sessions
4. Limit number of concurrent dashboard clients

## File Structure

```
HunterX/
├── HunterX.js              # Main bot file (includes dashboard backend)
├── public/                 # Dashboard frontend files
│   ├── index.html         # Main dashboard page
│   ├── dashboard.css      # Styling
│   └── dashboard.js       # WebSocket client and UI logic
└── DASHBOARD_GUIDE.md     # This file
```

## API Reference

### Backend Functions (HunterX.js)

#### `getBotStatusData()`
Returns current bot status for dashboard display.

#### `getTelemetryData()`
Returns real-time telemetry metrics.

#### `getInventoryData()`
Returns current inventory and equipment.

#### `getConfigData()`
Returns bot configuration settings.

#### `executeCommand(ws, command)`
Executes a dashboard command through ConversationAI.

#### `broadcastToAllDashboards(message)`
Sends a message to all connected dashboard clients.

### Frontend Functions (dashboard.js)

#### `connectWebSocket()`
Establishes WebSocket connection with auto-reconnect.

#### `sendCommand(command)`
Sends a command to the bot.

#### `requestBotStatus()`
Requests current bot status update.

#### `requestInventory()`
Requests inventory update.

#### `requestConfig()`
Requests configuration data.

#### `addConsoleMessage(message, type)`
Adds a message to the console with color coding.

## Examples

### Monitoring Multiple Bots

Run multiple HunterX instances on different ports:

```bash
# Bot 1
PORT_HTTP=8080 PORT_WS=9090 node HunterX.js

# Bot 2
PORT_HTTP=8081 PORT_WS=9091 node HunterX.js

# Bot 3
PORT_HTTP=8082 PORT_WS=9092 node HunterX.js
```

Access dashboards at:
- http://localhost:8080 (Bot 1)
- http://localhost:8081 (Bot 2)
- http://localhost:8082 (Bot 3)

### Remote Monitoring

Using SSH tunnel for secure remote access:

```bash
ssh -L 8080:localhost:8080 -L 9090:localhost:9090 user@your-server
```

Then access dashboard at `http://localhost:8080` on your local machine.

### Embedding in Applications

The dashboard can be embedded in Electron apps or other frameworks:

```javascript
const iframe = document.createElement('iframe');
iframe.src = 'http://localhost:8080';
document.body.appendChild(iframe);
```

## Future Enhancements

Planned features for future versions:

- [ ] Authentication system
- [ ] Multi-bot view (switch between bots)
- [ ] Configuration editing
- [ ] Plugin management UI
- [ ] Performance graphs and charts
- [ ] Mobile-optimized view
- [ ] Dark/light theme toggle
- [ ] Custom command macros
- [ ] Screenshot/recording from bot perspective
- [ ] Map view with bot position
- [ ] Player tracking visualization

## Support

For issues, questions, or feature requests:

1. Check this guide first
2. Review console output for errors
3. Check GitHub issues
4. Create a new issue with:
   - Dashboard version
   - Browser and version
   - Error messages
   - Steps to reproduce

## License

Same license as HunterX main project.

---

**Dashboard Version**: 1.0
**Last Updated**: 2024
**Compatible with**: HunterX v22.1+
