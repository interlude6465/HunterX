# HunterX v22.1 - Comprehensive Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Features & Capabilities](#features--capabilities)
- [Installation & Setup](#installation--setup)
- [Configuration Guide](#configuration-guide)
- [Usage Guide](#usage-guide)
- [Command Reference](#command-reference)
- [WebSocket Dashboard Guide](#websocket-dashboard-guide)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Safety & Ethics](#safety--ethics)
- [Technical Details](#technical-details)
- [API Reference](#api-reference)
- [Examples](#examples)
- [FAQ](#faq)
- [Credits & License](#credits--license)

---

## Project Overview

**HunterX** is an advanced AI-powered Minecraft automation system built around a sophisticated neural network architecture. It represents the pinnacle of Minecraft bot technology, combining god-tier combat capabilities, intelligent discovery systems, and coordinated multi-bot operations.

### What HunterX Is

HunterX is a comprehensive Minecraft automation framework that operates as an intelligent bot capable of:

- **Autonomous Combat**: Neural-enhanced crystal PvP with superhuman reaction times
- **Discovery Systems**: Advanced duplication testing and treasure hunting
- **Swarm Intelligence**: Multi-bot coordination via WebSocket communication
- **Intelligent Conversation**: Natural language processing and personality-driven responses
- **Automated Building**: Schematic-based construction with Baritone integration
- **Resource Management**: Intelligent maintenance and supply chain optimization

### Main Purpose & Use Cases

- **PvP Domination**: Unrivaled crystal combat performance for competitive servers
- **Exploration & Discovery**: Automated stash hunting and dupe discovery on anarchy servers
- **Base Management**: Intelligent home base defense and resource organization
- **Collaborative Operations**: Coordinated multi-bot strategies for complex tasks
- **Companion AI**: Friendly helper with natural conversation capabilities
- **Automated Building**: Large-scale construction projects with schematic support

### Key Technologies

| Technology | Purpose | Implementation |
|------------|---------|----------------|
| **mineflayer** | Core bot framework | Minecraft client emulation |
| **mineflayer-pvp** | PvP combat system | Crystal and melee combat |
| **@miner-org/mineflayer-baritone** | Pathfinding & navigation | Intelligent movement |
| **brain.js** | Neural networks | Combat AI, conversation, dupe detection |
| **WebSocket (ws)** | Real-time communication | Swarm coordination |
| **HTTP Server** | Dashboard interface | Status monitoring and control |
| **SOCKS Client** | Proxy support | Anonymous operations |
| **prismarine-nbt** | Schematic parsing | Building system |

### System Architecture

HunterX uses a **single-file architecture** with embedded classes for maximum performance and minimal dependencies:

```
HunterX.js (Main Orchestrator)
├── Configuration & State Management
├── Neural Network Models
├── Core Classes:
│   ├── SwarmCoordinator (Multi-bot management)
│   ├── CombatAI (PvP and combat systems)
│   ├── DupeTestingFramework (Discovery systems)
│   ├── EnderChestManager (Resource management)
│   ├── ConversationAI (Natural language processing)
│   ├── SchematicLoader (Building system)
│   ├── MaintenanceScheduler (Auto-repair systems)
│   └── IntelligenceDB (Data gathering)
├── WebSocket Dashboard (Port 9090)
├── HTTP API Server (Port 8080)
└── Data Storage Systems
```

---

## Features & Capabilities

### 🗡️ Combat Systems

#### Crystal PvP with Neural AI
- **Instant Crystal Placement**: <100ms reaction times with humanization
- **Predictive Targeting**: 200ms look-ahead enemy positioning
- **Optimal Damage Calculation**: Max enemy damage, min self-damage algorithms
- **Multi-Crystal Combos**: Chain reactions and strategic placement
- **Neural Strategy Selection**: AI learns optimal tactics per situation
- **Auto-Totem Management**: Predictive equipping based on threat assessment

#### Advanced Projectile Combat
- **Predictive Aiming**: Bow/crossbow/trident with velocity tracking
- **Gravity Compensation**: Realistic projectile physics calculation
- **Mace Combat**: Elytra dive attacks with wind charge combos
- **Smart Weapon Switching**: Context-aware weapon selection

#### Anti-Cheat Integration
- **Reactive Bypass**: Activates humanization when flagged
- **Tiered Humanization**: 4 tiers from overpowered to realistic
- **Automatic De-escalation**: Reduces suspicious behavior over time
- **Combat Logger**: Emergency disconnect on detection

### 🧠 Intelligence & Discovery

#### Dupe Testing Framework
- **Multiple Testing Engines**:
  - Lag-based exploit testing
  - Chunk boundary scanning
  - Entity duplication attempts
  - Plugin vulnerability analysis
  - Multi-bot coordinated testing
- **Knowledge Base**: Historical dupe patterns and success metrics
- **Analytics Engine**: Success rate tracking and pattern recognition
- **Stealth Mode**: Variable timing and detection avoidance

#### Stash Hunting System
- **Automated Scanning**: Chunk-by-chunk treasure detection
- **Value Assessment**: Intelligent item valuation and prioritization
- **Player Avoidance**: Stealth operation with threat detection
- **Heatmap Generation**: Activity density visualization
- **Pattern Recognition**: Learning from successful discoveries

#### Intelligence Gathering
- **Chat Monitoring**: Coordinate and keyword extraction
- **Player Profiling**: Behavior pattern analysis
- **Movement Tracking**: Base discovery through observation
- **Association Mapping**: Player relationship networks
- **Suspicion Scoring**: Threat level assessment

### 🤖 Automation Systems

#### Maintenance & Repair
- **Auto-Repair**: Mending-enchanted gear management
- **Elytra Management**: Durability monitoring and swapping
- **XP Farm Integration**: Automated repair location navigation
- **Supply Chain**: Task queue for resource gathering

#### Resource Management
- **Ender Chest Organization**: Intelligent item sorting
- **Auto-Backup**: Critical item protection
- **Production Tracking**: Resource generation analytics
- **Task Prioritization**: Dynamic resource allocation

#### Building System
- **Schematic Loading**: NBT-based file parsing (.schem and .schematic)
- **Material Analysis**: Block count and requirement calculation
- **Automated Construction**: Baritone-powered building
- **Progress Tracking**: Real-time build status monitoring

### 🐝 Swarm Coordination

#### Multi-Bot Management
- **WebSocket Communication**: Real-time bot coordination (Port 9090)
- **Role Assignment**: Specialized bot functions (combat, building, scouting)
- **Emergency Response**: Coordinated help and backup systems
- **Smart Spawning**: Proxy vs local bot deployment

#### Strategic Operations
- **Coordinated Attacks**: Multi-vector assault planning
- **Defensive Formations**: Base protection strategies
- **Resource Distribution**: Intelligent supply sharing
- **Live Monitoring**: Real-time video feed and status

### 🔌 Integration & Control

#### WebSocket Dashboard (Port 9090)
- **Live Video Feeds**: Bot perspective monitoring
- **Command Interface**: Real-time control capabilities
- **Status Monitoring**: Performance and health metrics
- **Multi-Bot Navigation**: Switch between bot perspectives

#### HTTP API (Port 8080)
- **REST Endpoints**: JSON-based command interface
- **Statistics Dashboard**: Analytics and performance data
- **Configuration Management**: Remote settings adjustment
- **Upload Interface**: Schematic and data file management

#### Natural Language Interface
- **Chat Commands**: Intuitive in-game control
- **Conversation AI**: Personality-driven responses
- **Context Awareness**: Memory and relationship tracking
- **Command Parsing**: Natural language understanding

### 🛡️ Security & Safety

#### Trust System
- **Tiered Permissions**: Owner, Admin, Trusted, Guest levels
- **Whitelist Management**: Secure access control
- **Command Restrictions**: Role-based feature access
- **Security Logging**: Action audit trails

#### Protection Features
- **Combat Logging**: Emergency disconnect on threats
- **Rate Limiting**: Request throttling and abuse prevention
- **Input Validation**: Command sanitization and safety checks
- **Telemetry**: Performance monitoring and anomaly detection

---

## Installation & Setup

### Prerequisites

**System Requirements:**
- **Node.js**: Version 16.0 or higher
- **Memory**: Minimum 2GB RAM (4GB+ recommended for swarm operations)
- **Storage**: 500MB+ free space for models and data
- **Network**: Stable internet connection for multiplayer

**Optional Requirements:**
- **Minecraft Account**: For premium servers (cracked support available)
- **Proxy Service**: SOCKS5 proxy for anonymous operations
- **Discord Bot Token**: For Discord integration features

### Installation Steps

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd hunterx-minecraft-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Required Directories** (automatically created on first run)
   ```bash
   mkdir -p models dupes replays logs data data/schematics data/inventory data/production
   ```

4. **Configure Bot Credentials**
   - Edit server connection settings in the interactive menu
   - Set up Minecraft account (premium or cracked)
   - Configure proxy if needed

5. **Launch HunterX**
   ```bash
   node HunterX.js
   ```

### Configuration Setup

#### Basic Configuration
1. Run `node HunterX.js` to launch the interactive menu
2. Select your desired operating mode
3. Configure server connection:
   - Server IP/hostname
   - Port (default: 25565)
   - Account credentials (if premium)
   - Proxy settings (optional)

#### Proxy Configuration
```javascript
// Example proxy setup in config.json
{
  "network": {
    "proxyEnabled": true,
    "proxyHost": "127.0.0.1",
    "proxyPort": 1080,
    "proxyType": "socks5"
  }
}
```

#### Discord Bridge Setup
```javascript
// Add to environment variables or config
{
  "discord": {
    "botToken": "YOUR_DISCORD_BOT_TOKEN",
    "channelId": "YOUR_CHANNEL_ID",
    "enabled": true
  }
}
```

### Initial Setup Checklist

- [ ] Node.js 16+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Server connection details configured
- [ ] Minecraft account ready (if premium)
- [ ] Proxy configured (if using)
- [ ] Discord token set (if using Discord bridge)
- [ ] Firewall ports open (8080, 9090) for dashboard
- [ ] Sufficient system resources available

---

## Configuration Guide

### Configuration File Structure

HunterX uses a comprehensive configuration system stored in memory and persisted to JSON files. The main configuration is defined in the `config` object within HunterX.js.

### Bot Credentials

```javascript
localAccount: {
  username: 'YourBotName',
  password: 'YourPassword',        // Premium accounts only
  authType: 'microsoft'           // 'microsoft' or 'mojang'
}
```

### Server Settings

```javascript
server: {
  host: 'mc.hypixel.net',         // Server IP/hostname
  port: 25565,                    // Server port
  version: '1.19.3',              // Minecraft version
  onlineMode: true                 // Server authentication
}
```

### Combat Parameters

```javascript
combat: {
  maxSelfDamage: 6,                // Maximum self-damage from crystals
  minEffectiveDamage: 4,           // Minimum damage to target
  crystalRange: 5,                 // Maximum crystal placement range
  engageRange: 20,                 // Combat engagement distance
  retreatHealth: 8,                // Health threshold for retreat
  totemThreshold: 8,               // Health threshold for totem equip
  autoLoot: true,                  // Automatic item collection
  smartEquip: true,                // Intelligent equipment switching
  
  // Combat logger settings
  logger: {
    enabled: true,
    healthThreshold: 6,            // Health threshold for logging
    multipleAttackers: 2,          // Number of attackers before logging
    triggerScore: 60,              // Suspicion score threshold
    cooldownMs: 20000,             // Logging cooldown period
    escapeDistance: 120,           // Distance for emergency escape
    sweepRadius: 16,               // Area sweep radius
    distressOnReconnect: true      // Auto-escape on reconnect
  }
}
```

### Dupe Testing Configuration

```javascript
dupeDiscovery: {
  testingEnabled: false,           // Enable/disable dupe testing
  stealthMode: true,               // Use stealth techniques
  minTimeBetweenAttempts: 30000,   // Minimum delay between attempts (ms)
  maxTimeBetweenAttempts: 120000,  // Maximum delay between attempts (ms)
  testLocation: null,              // Specific test coordinates
  uploadedPlugins: []              // Plugin files for analysis
}
```

### Stash Hunting Settings

```javascript
stashHunt: {
  active: false,                   // Enable/disable stash hunting
  startCoords: null,               // Starting coordinates
  searchRadius: 10000,             // Search area radius
  scanSpeed: 'fast',               // Scanning speed: 'slow', 'medium', 'fast'
  avoidPlayers: true,              // Avoid other players
  playerDetectionRadius: 100,      // Player detection distance
  flyHackEnabled: false,           // Enable flight exploits (risky)
  currentWaypoint: null,           // Current navigation target
  visitedChunks: new Set()         // Track visited chunks
}
```

### Swarm Coordination Options

```javascript
swarm: {
  initialBotCount: 3,              // Number of bots to spawn initially
  maxBots: 50,                    // Maximum concurrent bots
  autoDetectServerType: true,      // Auto-detect cracked/premium
  serverType: null,                // 'cracked' or 'premium'
  roles: {},                       // Bot role assignments
  sharedMemory: {},                // Shared data between bots
  guardZones: [],                  // Defensive areas
  activeDefense: {},               // Defense operation status
  videoFeeds: new Map()           // Bot video feeds
}
```

### WebSocket/HTTP Settings

```javascript
// WebSocket Server (Port 9090)
wsServer: {
  port: 9090,
  enabled: true
},

// HTTP Dashboard (Port 8080)
httpServer: {
  port: 8080,
  enabled: true,
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000
  }
}
```

### Neural Network Configuration

```javascript
neural: {
  combat: new brain.NeuralNetwork({
    hiddenLayers: [256, 128, 64]
  }),
  placement: new brain.NeuralNetwork({
    hiddenLayers: [128, 64, 32]
  }),
  dupe: new brain.recurrent.LSTM({
    hiddenLayers: [256, 128, 64]
  }),
  conversation: new brain.recurrent.LSTM({
    hiddenLayers: [128, 64]
  })
}
```

### Feature Toggles

```javascript
features: {
  pvp: true,                       // Enable PvP combat
  dupeTesting: false,              // Enable dupe discovery
  stashHunting: false,             // Enable stash scanning
  swarm: false,                    // Enable multi-bot coordination
  building: true,                  // Enable schematic building
  maintenance: true,               // Enable auto-repair systems
  intelligence: true,              // Enable intelligence gathering
  conversation: true,              // Enable chat AI
  homeDefense: false,              // Enable base defense
  anticheat: false                 // Enable anti-cheat bypass
}
```

### Personality Settings

```javascript
personality: {
  friendly: true,                  // Friendly conversation style
  helpful: true,                   // Helpful behavior
  curious: true,                   // Curious about environment
  cautious: true,                  // Cautious with strangers
  name: 'Hunter'                   // Bot name
}
```

---

## Usage Guide

### Starting the Bot

1. **Launch HunterX**
   ```bash
   node HunterX.js
   ```

2. **Select Operating Mode**
   - Choose from the interactive menu (1-6)
   - Configure server connection details
   - Wait for bot to connect and initialize

3. **Monitor Initialization**
   - Check console output for connection status
   - Verify all systems are loaded
   - Confirm dashboard accessibility

### Mode Descriptions

#### 1. PvP Combat Mode 🗡️
**Purpose**: God-tier crystal PvP combat with neural AI

**Features:**
- Superhuman reaction times (50-150ms)
- Predictive enemy positioning
- Optimal crystal placement algorithms
- Auto-totem management
- Combat logging and emergency escape

**When to Use:**
- Competitive PvP servers
- Practice combat scenarios
- Defense against hostile players
- Combat training and analysis

**Activation:**
```bash
# Select option 1 from menu
# Configure server and connect
# Bot will automatically engage in combat when attacked
```

#### 2. Dupe Discovery Mode 🔍
**Purpose**: Automated duplication testing and vulnerability analysis

**Features:**
- Multiple testing engines (lag, chunk, entity, plugin)
- Historical dupe pattern analysis
- Stealth operation with timing randomization
- Success rate tracking and analytics
- Multi-bot coordinated testing

**When to Use:**
- Anarchy servers (2b2t, etc.)
- Plugin vulnerability research
- Server security testing
- Educational purposes only

**Activation:**
```bash
# Select option 2 from menu
# Configure server connection
# Bot will begin systematic dupe testing
```

#### 3. Stash Hunter Mode 💎
**Purpose**: Automated treasure hunting and resource discovery

**Features:**
- Chunk-by-chunk scanning
- Intelligent value assessment
- Player avoidance and stealth
- Heatmap generation
- Pattern learning from discoveries

**When to Use:**
- Large survival servers
- Anarchy environments
- Resource gathering operations
- Exploration mapping

**Activation:**
```bash
# Select option 3 from menu
# Set starting coordinates or use current location
# Configure search parameters
```

#### 4. Friendly Companion Mode 🤝
**Purpose**: Intelligent helper with natural conversation

**Features:**
- Natural language processing
- Context-aware responses
- Helpful task assistance
- Relationship building
- Safe and cooperative behavior

**When to Use:**
- Community servers
- Building assistance
- Social interaction
- New player guidance

**Activation:**
```bash
# Select option 4 from menu
# Bot will engage in friendly conversation
# Provide help and assistance
```

#### 5. Swarm Controller Mode 🐝
**Purpose**: Multi-bot coordination and strategic operations

**Features:**
- WebSocket bot coordination
- Role-based task assignment
- Emergency response systems
- Live monitoring dashboard
- Coordinated attack/defense

**When to Use:**
- Complex operations requiring multiple bots
- Base defense coordination
- Large-scale building projects
- Strategic server operations

**Activation:**
```bash
# Select option 5 from menu
# Configure number of bots
# Access dashboard at localhost:9090
```

#### 6. Supply Chain Manager 📦
**Purpose**: Task queue system and resource optimization

**Features:**
- Automated task distribution
- Resource production tracking
- Bot performance analytics
- Priority-based scheduling
- Supply chain optimization

**When to Use:**
- Large building projects
- Resource farming operations
- Community storage management
- Economic server activities

**Activation:**
```bash
# Select option 6 from menu
# Configure production goals
# Monitor task queue progress
```

### Server Type Detection

HunterX automatically detects and adapts to server types:

#### Cracked Servers
- No authentication required
- Username-based login
-适合匿名操作

#### Premium Servers
- Microsoft/Mojang authentication
- Verified account required
- Full feature access

### Initial Bot Spawning

1. **Connection Process**
   ```
   [CONNECT] Connecting to server...
   [AUTH] Authentication successful
   [SPAWN] Bot spawned in world
   [SYSTEMS] Initializing AI modules...
   [READY] Bot fully operational
   ```

2. **System Initialization**
   - Neural networks loaded
   - Combat systems ready
   - Pathfinding initialized
   - Dashboard accessible

3. **Verification Commands**
   ```javascript
   // Test basic functionality
   !status
   !help
   !coords
   ```

---

## Command Reference

### In-Game Chat Commands

#### 🔗 Emergency & Assistance Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Help Request** | `!help <x> <y> <z>` | Request emergency backup at coordinates | Guest+ |
| **Emergency Help** | `need help` | Send all bots to current location | Guest+ |
| **Swarm Status** | `!swarm status` | Show active bots and statistics | Trusted+ |
| **Bot Spawn** | `!spawn <count>` | Spawn additional bots | Admin+ |
| **Stop Operation** | `!stop` | Stop current bot action | Trusted+ |

#### 🧭 Navigation & Movement Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Go To** | `!goto <x> <y> <z>` | Navigate to specific coordinates | Trusted+ |
| **Follow Player** | `!follow <player>` | Follow specified player | Trusted+ |
| **Go Home** | `go home` | Navigate to home base | Trusted+ |
| **Set Home** | `set home here` | Set home base at current location | Admin+ |
| **Set Home Coords** | `set home x,y,z` | Set home base at coordinates | Admin+ |
| **Travel** | `travel to <location>` | Navigate to named location | Trusted+ |
| **Highway** | `find highway` | Locate nearest highway | Trusted+ |

#### ⚔️ Combat & Attack Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Attack Player** | `!attack <player>` | Engage target in combat | Admin+ |
| **Coordinated Attack** | `coordinated attack <target>` | Multi-bot attack | Admin+ |
| **Retreat** | `retreat` | Fall back from combat | Trusted+ |
| **Fall Back** | `fall back` | Defensive retreat | Trusted+ |
| **Start Guard** | `start guard` | Begin guard duty | Trusted+ |
| **Defense Status** | `defense status` | Show defense monitoring status | Trusted+ |

#### ⛏️ Resource & Gathering Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Mine Resource** | `!mine <resource>` | Start mining specific resource | Trusted+ |
| **Collect Item** | `collect <item>` | Gather specific items | Trusted+ |
| **Find Item** | `find <item>` | Search for nearby items | Trusted+ |
| **Hunt Mob** | `hunt <mob>` | Hunt specific mobs | Trusted+ |
| **Fish For** | `fish for <fish>` | Start fishing | Trusted+ |
| **Farm** | `farm <crop>` | Start farming operation | Trusted+ |

#### 💎 Discovery & Testing Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Scan Stash** | `!stash` | Scan area for hidden stashes | Trusted+ |
| **Test Dupe** | `!dupe <item>` | Test item for duplication | Admin+ |
| **Scanner Status** | `scanner status` | Show plugin scan progress | Trusted+ |
| **Scanner Report** | `scanner report` | Detailed scan results | Trusted+ |

#### 🏠 Base & Storage Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Home Status** | `home status` | Show home base information | Trusted+ |
| **Home Info** | `home info` | Detailed base statistics | Trusted+ |
| **Deposit Items** | `deposit` | Store valuables in ender chest | Trusted+ |
| **Store Valuables** | `store valuables` | Backup important items | Trusted+ |

#### 🔧 Maintenance & Repair Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Maintenance Status** | `maintenance status` | Show maintenance system status | Trusted+ |
| **Start Maintenance** | `start maintenance` | Enable maintenance scheduler | Admin+ |
| **Stop Maintenance** | `stop maintenance` | Disable maintenance scheduler | Admin+ |
| **Repair Armor** | `repair armor` | Manually trigger armor repair | Trusted+ |
| **Fix Armor** | `fix armor` | Alternative repair command | Trusted+ |
| **Swap Elytra** | `swap elytra` | Replace damaged elytra | Trusted+ |
| **Fix Elytra** | `fix elytra` | Alternative elytra command | Trusted+ |
| **Check Elytra** | `check elytra` | Check elytra durability | Trusted+ |
| **Set XP Farm** | `set xp farm here` | Set repair location | Admin+ |
| **Set XP Farm Coords** | `set xp farm x,y,z` | Set repair coordinates | Admin+ |

#### 🏗️ Building & Construction Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Start Build** | `start build <schematic>` | Begin building schematic | Admin+ |
| **Build Schematic** | `build schematic <name>` | Load and build schematic | Admin+ |
| **Build Status** | `build status` | Show current build progress | Trusted+ |
| **Build Progress** | `build progress` | Detailed build information | Trusted+ |

#### 📊 Analytics & Statistics Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Show Stats** | `!stats` | Display performance statistics | Trusted+ |
| **Performance** | `performance` | Show system performance | Admin+ |
| **Analytics** | `analytics` | Detailed analytics report | Admin+ |

#### 👥 Trust & Permission Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Trust Level** | `trust level <player>` | Check player's trust level | Trusted+ |
| **Check Trust** | `check trust <player>` | Alternative trust check | Trusted+ |
| **List Whitelist** | `list whitelist` | Show all whitelisted players | Trusted+ |
| **Show Whitelist** | `show whitelist` | Alternative whitelist display | Trusted+ |
| **Set Trust** | `set trust <player> <level>` | Modify player trust level | Admin+ |
| **Set Level** | `set level <player> <level>` | Alternative trust command | Admin+ |
| **Remove Trust** | `remove trust <player>` | Remove player from whitelist | Admin+ |
| **Remove Whitelist** | `remove whitelist <player>` | Alternative removal command | Admin+ |

#### 💬 Communication & Social Commands

| Command | Syntax | Description | Trust Level |
|---------|--------|-------------|-------------|
| **Private Message** | `/msg <player> <message>` | Send private message | Trusted+ |
| **Whisper** | `/w <player> <message>` | Alternative private message | Trusted+ |
| **Tell** | `/tell <player> <message>` | Alternative private message | Trusted+ |

### WebSocket Commands (Port 9090)

Connect via WebSocket client to send JSON commands:

```javascript
// Emergency help request
{
  "type": "EMERGENCY_HELP",
  "coords": { "x": 100, "y": 64, "z": -200 },
  "requestedBy": "PlayerName"
}

// Bot spawn command
{
  "type": "SPAWN_BOT",
  "count": 3,
  "role": "combat"
}

// Navigation command
{
  "type": "NAVIGATE",
  "botId": "bot_1",
  "target": { "x": 0, "y": 64, "z": 0 }
}

// Attack coordination
{
  "type": "COORDINATED_ATTACK",
  "target": "EnemyPlayer",
  "participants": ["bot_1", "bot_2", "bot_3"]
}
```

### HTTP Endpoints (Port 8080)

#### GET Endpoints

| Endpoint | Description | Response |
|----------|-------------|----------|
| `/` | Main dashboard | HTML status page |
| `/stats` | Performance statistics | JSON data |
| `/bots` | Active bot list | JSON array |
| `/config` | Current configuration | JSON object |
| `/analytics` | Analytics data | JSON report |

#### POST Endpoints

| Endpoint | Description | Request Body |
|----------|-------------|--------------|
| `/command` | Execute command | `{"bot": "bot_1", "command": "attack target"}` |
| `/schematic/upload` | Upload schematic file | Multipart form data |
| `/config/update` | Update configuration | JSON config object |

#### WebSocket Upgrade

```
WS://localhost:8080/ws
```

Real-time event streaming and bidirectional communication.

---

## WebSocket Dashboard Guide

### Connecting to the Dashboard

1. **Access the Video Feed Dashboard**
   ```
   WebSocket URL: ws://localhost:9090
   Web Interface: Open HunterX.js HTML dashboard or custom client
   ```

2. **Connection Process**
   ```javascript
   const ws = new WebSocket('ws://localhost:9090');
   
   ws.onopen = () => {
     console.log('Connected to HunterX dashboard');
   };
   
   ws.onmessage = (event) => {
     const data = JSON.parse(event.data);
     console.log('Received:', data);
   };
   ```

### Live Video Feed Usage

#### Video Feed Features
- **Real-time Visualization**: Bot perspective video stream
- **Multi-Bot Switching**: Switch between different bot cameras
- **Resolution Control**: Adjustable quality settings
- **FPS Configuration**: Frame rate optimization

#### Video Feed Commands
```javascript
// Request video feed from specific bot
{
  "type": "REQUEST_VIDEO",
  "botId": "bot_1",
  "resolution": "medium",
  "fps": 5
}

// Switch to different bot
{
  "type": "SWITCH_BOT",
  "botId": "bot_2"
}

// Adjust video settings
{
  "type": "VIDEO_SETTINGS",
  "resolution": "high",  // low, medium, high
  "fps": 10              // 1-30 fps
}
```

### Navigating Between Bots

#### Bot Selection Interface
- **Bot List**: View all active bots with status
- **Quick Switch**: Click bot name to switch perspective
- **Status Indicators**: Health, activity, and connection status
- **Role Display**: Current bot role and task

#### Navigation Commands
```javascript
// Get list of available bots
{
  "type": "GET_BOT_LIST"
}

// Response format
{
  "type": "BOT_LIST",
  "bots": [
    {
      "id": "bot_1",
      "name": "Hunter_001",
      "status": "active",
      "role": "combat",
      "health": 20,
      "location": { "x": 100, "y": 64, "z": -200 }
    }
  ]
}
```

### Sending Commands via Dashboard

#### Command Interface
- **Command Input**: Text input for quick commands
- **Command History**: Previously sent commands
- **Target Selection**: Choose specific bot or all bots
- **Response Display**: Real-time command feedback

#### Command Examples
```javascript
// Send command to specific bot
{
  "type": "BOT_COMMAND",
  "botId": "bot_1",
  "command": "goto 0 64 0",
  "sender": "Dashboard"
}

// Broadcast to all bots
{
  "type": "BROADCAST",
  "message": "All bots retreat to base",
  "sender": "Dashboard"
}

// Emergency coordination
{
  "type": "EMERGENCY_COORDINATION",
  "threat": "PlayerName",
  "location": { "x": 100, "y": 64, "z": -200 },
  "action": "defend"
}
```

### Monitoring Bot Status

#### Real-time Status Updates
- **Health Monitoring**: Live health and hunger status
- **Activity Tracking**: Current tasks and objectives
- **Performance Metrics**: FPS, ping, and resource usage
- **Combat Status**: Engagement and threat assessment

#### Status Events
```javascript
// Health update
{
  "type": "HEALTH_UPDATE",
  "botId": "bot_1",
  "health": 18,
  "food": 18,
  "timestamp": 1640995200000
}

// Combat event
{
  "type": "COMBAT_EVENT",
  "botId": "bot_1",
  "action": "engaged",
  "target": "EnemyPlayer",
  "location": { "x": 100, "y": 64, "z": -200 }
}

// Task completion
{
  "type": "TASK_COMPLETE",
  "botId": "bot_1",
  "task": "navigate_to_target",
  "duration": 15000,
  "success": true
}
```

### Advanced Dashboard Features

#### Heatmap Visualization
- **Activity Density**: Player and bot activity heatmaps
- **Resource Locations**: Discovered stash and resource points
- **Danger Zones**: High-threat areas and combat zones
- **Exploration Progress**: Mapped vs unexplored territories

#### Analytics Dashboard
- **Performance Graphs**: Real-time performance metrics
- **Combat Statistics**: Kill/death ratios and combat efficiency
- **Resource Flow**: Item tracking and economic analysis
- **System Health**: Memory usage and error tracking

---

## Advanced Features

### 🧠 Neural Network Training

#### Combat AI Learning
The combat neural network continuously learns from engagements:

**Training Data Collection:**
```javascript
// Combat scenario data
{
  "input": {
    "enemyDistance": 5.2,
    "enemyHealth": 18,
    "selfHealth": 20,
    "environment": "open_terrain",
    "availableCrystals": 64,
    "enemyVelocity": { "x": 0.5, "z": -0.3 }
  },
  "output": {
    "action": "place_crystal",
    "position": { "x": 102, "y": 65, "z": -198 },
    "confidence": 0.92
  }
}
```

**Model Training Process:**
1. **Data Collection**: Gather combat scenarios
2. **Pattern Recognition**: Identify successful strategies
3. **Model Updates**: Retrain neural networks
4. **Performance Validation**: Test against real scenarios

#### Dupe Pattern Recognition
The dupe testing LSTM learns from successful and failed attempts:

**Pattern Analysis:**
```javascript
// Historical dupe patterns
{
  "method": "chunk_boundary_item_dupe",
  "successRate": 0.15,
  "indicators": [
    "chunk_edge_proximity",
    "server_lag_spike",
    "item_drop_timing"
  ],
  "serverConditions": {
    "tps": 15.2,
    "playerCount": 45,
    "plugins": ["Essentials", "WorldEdit"]
  }
}
```

#### Conversation AI Training
Natural language processing with context awareness:

**Conversation Context:**
```javascript
// Memory and relationship tracking
{
  "context": [
    { "user": "Player1", "message": "Where is your base?", "timestamp": 1640995000000 },
    { "user": "Hunter", "message": "I don't have a base yet, still exploring!", "timestamp": 1640995005000 }
  ],
  "relationships": {
    "Player1": { "trust": 0.7, "friendship": 0.5, "lastInteraction": 1640995000000 }
  }
}
```

### 🐝 Swarm Strategies

#### Coordinated Attack Patterns

**Pincer Movement:**
```javascript
// Multi-bot attack coordination
{
  "strategy": "pincer_attack",
  "participants": ["bot_1", "bot_2", "bot_3"],
  "target": "EnemyPlayer",
  "positions": {
    "bot_1": { "x": 100, "z": -200, "role": "flank_left" },
    "bot_2": { "x": 105, "z": -195, "role": "direct_assault" },
    "bot_3": { "x": 110, "z": -200, "role": "flank_right" }
  },
  "timing": {
    "engagement": "simultaneous",
    "fallback": "coordinated_retreat"
  }
}
```

**Defensive Formations:**
```javascript
// Base defense coordination
{
  "strategy": "perimeter_defense",
  "formation": "circular",
  "center": { "x": 0, "y": 64, "z": 0 },
  "radius": 20,
  "assignments": {
    "bot_1": { "angle": 0, "role": "primary_defender" },
    "bot_2": { "angle": 90, "role": "support" },
    "bot_3": { "angle": 180, "role": "backup" },
    "bot_4": { "angle": 270, "role": "flank_guard" }
  }
}
```

#### Resource Distribution

**Supply Chain Optimization:**
```javascript
// Intelligent resource allocation
{
  "resource": "diamond",
  "totalAvailable": 128,
  "distribution": [
    { "botId": "bot_1", "allocation": 64, "priority": "combat" },
    { "botId": "bot_2", "allocation": 32, "priority": "building" },
    { "botId": "bot_3", "allocation": 32, "priority": "trading" }
  ],
  "criteria": {
    "combatEffectiveness": 0.8,
    "buildingProgress": 0.6,
    "tradingOpportunities": 0.9
  }
}
```

### 📊 Analytics & Telemetry

#### Performance Metrics

**Real-time Monitoring:**
```javascript
// System performance data
{
  "timestamp": 1640995200000,
  "bot": {
    "id": "bot_1",
    "fps": 58,
    "ping": 45,
    "memoryUsage": 128,
    "cpuUsage": 12.5
  },
  "combat": {
    "kills": 3,
    "deaths": 0,
    "damageDealt": 180,
    "damageTaken": 24,
    "totemPops": 0
  },
  "efficiency": {
    "tasksCompleted": 12,
    "successRate": 0.92,
    "averageCompletionTime": 45000
  }
}
```

#### Combat Efficiency Tracking

**Performance Analysis:**
```javascript
// Combat analytics
{
  "session": {
    "duration": 3600000,
    "engagements": 8,
    "victories": 6,
    "retreats": 2
  },
  "accuracy": {
    "crystalHits": 45,
    "crystalMisses": 12,
    "hitRate": 0.79
  },
  "response": {
    "averageReactionTime": 125,
    "fastestReaction": 45,
    "slowestReaction": 280
  },
  "strategies": {
    "aggressive": 0.4,
    "defensive": 0.3,
    "tactical": 0.3
  }
}
```

#### Memory Usage Optimization

**Resource Management:**
```javascript
// Memory and performance tracking
{
  "memory": {
    "used": 256,
    "available": 512,
    "gcRuns": 12,
    "leaksDetected": 0
  },
  "dataStructures": {
    "replayBuffer": 8500,
    "trainingEpisodes": 450,
    "intelligenceData": 1200,
    "stashDiscoveries": 45
  },
  "optimization": {
    "cleanupInterval": 300000,
    "lastCleanup": 1640995000000,
    "itemsRemoved": 150
  }
}
```

#### Activity Heatmaps

**Spatial Analysis:**
```javascript
// Activity density mapping
{
  "heatmap": {
    "resolution": 10,
    "center": { "x": 0, "z": 0 },
    "radius": 500,
    "data": [
      { "x": 0, "z": 0, "intensity": 0.9, "type": "base" },
      { "x": 100, "z": -200, "intensity": 0.7, "type": "combat" },
      { "x": -50, "z": 150, "intensity": 0.4, "type": "resource" }
    ]
  },
  "insights": {
    "hotspots": ["base_area", "combat_zone"],
    "deadZones": ["far_north", "deep_south"],
    "recommendations": ["expand_south", "fortify_east"]
  }
}
```

---

## Troubleshooting

### 🔧 Common Issues & Solutions

#### Connection Failures

**Symptom:** Bot fails to connect to server
```
[CONNECT] Connection timeout
[ERROR] Failed to connect to server
```

**Solutions:**
1. **Check Server Status**
   ```bash
   # Test server connectivity
   ping mc.hypixel.net
   telnet mc.hypixel.net 25565
   ```

2. **Verify Server Details**
   ```javascript
   // Check configuration
   server: {
     host: 'correct.server.ip',
     port: 25565,
     version: '1.19.3'
   }
   ```

3. **Authentication Issues**
   - Premium servers: Verify account credentials
   - Cracked servers: Set `onlineMode: false`
   - Check firewall/router blocking

4. **Rate Limiting**
   ```javascript
   // Add delay between connection attempts
   config.network.reconnectDelay = 10000; // 10 seconds
   ```

#### Authentication Errors

**Symptom:** Authentication fails on premium servers
```
[AUTH] Failed to authenticate
[ERROR] Invalid credentials or session
```

**Solutions:**
1. **Microsoft Account Issues**
   - Refresh Microsoft token
   - Check account migration status
   - Verify security settings

2. **Mojang Authentication**
   ```javascript
   // Switch to Mojang auth if Microsoft fails
   localAccount: {
     authType: 'mojang'
   }
   ```

3. **Session Validation**
   ```javascript
   // Force session refresh
   config.localAccount.forceAuthRefresh = true;
   ```

#### Proxy Connection Problems

**Symptom:** Proxy connection fails or is slow
```
[PROXY] Connection refused
[ERROR] SOCKS connection timeout
```

**Solutions:**
1. **Verify Proxy Configuration**
   ```javascript
   network: {
     proxyEnabled: true,
     proxyHost: '127.0.0.1',
     proxyPort: 1080,
     proxyType: 'socks5'
   }
   ```

2. **Test Proxy Functionality**
   ```bash
   # Test SOCKS proxy
   curl --socks5 127.0.0.1:1080 http://example.com
   ```

3. **Fallback to Direct Connection**
   ```javascript
   config.network.proxyEnabled = false;
   ```

#### Anti-Cheat Kicks

**Symptom:** Bot gets kicked for suspicious behavior
```
[KICK] Suspicious activity detected
[ANTICHEAT] Flagged for cheating
```

**Solutions:**
1. **Enable Humanization**
   ```javascript
   anticheat: {
     enabled: true,
     tier: 2,  // Higher tier = more human-like
     reactiveMode: true
   }
   ```

2. **Adjust Combat Parameters**
   ```javascript
   combat: {
     maxSelfDamage: 4,        // Reduce aggressive behavior
     engageRange: 15,         // Shorter engagement range
     autoLoot: false          // Disable instant loot
   }
   ```

3. **Enable Combat Logger**
   ```javascript
   combat: {
     logger: {
       enabled: true,
       healthThreshold: 10,   // Earlier disconnect
       triggerScore: 40       // Lower sensitivity
     }
   }
   ```

#### Performance Issues

**Symptom:** High CPU usage or lag
```
[PERF] High CPU usage detected
[WARNING] Frame rate drop
```

**Solutions:**
1. **Reduce Bot Count**
   ```javascript
   swarm: {
     maxBots: 10,  // Reduce from 50
     initialBotCount: 2
   }
   ```

2. **Optimize Video Settings**
   ```javascript
   videoFeed: {
     enabled: true,
     fps: 3,           // Reduce frame rate
     resolution: 'low' // Lower resolution
   }
   ```

3. **Enable Cleanup**
   ```javascript
   // More frequent cleanup
   setInterval(cleanupOldData, 180000); // 3 minutes
   ```

#### Memory Leaks

**Symptom:** Memory usage continuously increases
```
[MEMORY] Usage exceeding 1GB
[WARNING] Potential memory leak
```

**Solutions:**
1. **Force Garbage Collection**
   ```javascript
   setInterval(() => {
     if (global.gc) global.gc();
   }, 300000); // Every 5 minutes
   ```

2. **Reduce Data Retention**
   ```javascript
   training: {
     maxBufferSize: 5000,  // Reduce from 10000
     maxEpisodes: 500      // Reduce from 1000
   }
   ```

3. **Clear Circular References**
   ```javascript
   // Enhanced cleanup on disconnect
   function deepCleanup(obj) {
     for (const key in obj) {
       if (typeof obj[key] === 'object') {
         deepCleanup(obj[key]);
       }
       obj[key] = null;
     }
   }
   ```

#### Bot Crashes

**Symptom:** Bot crashes with exceptions
```
[CRITICAL] Unhandled Exception
[ERROR] Bot process terminated
```

**Solutions:**
1. **Check Error Logs**
   ```bash
   # View detailed error logs
   tail -f ./logs/errors.log
   ```

2. **Enable Safe Mode**
   ```javascript
   // Conservative settings
   config.safeMode = true;
   config.anticheat.enabled = true;
   config.combat.maxSelfDamage = 2;
   ```

3. **Update Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

### 🚨 Emergency Procedures

#### Combat Emergency Disconnect
```javascript
// Immediate emergency disconnect
if (combatLogger.shouldEmergencyDisconnect()) {
  bot.end();
  console.log('[EMERGENCY] Combat safety disconnect activated');
}
```

#### Mass Bot Recall
```javascript
// Recall all bots to safety
globalSwarmCoordinator.emergencyRecall({
  reason: 'server_threat',
  rendezvous: config.homeBase.coords
});
```

#### Data Backup Procedure
```javascript
// Emergency data backup
function emergencyBackup() {
  const backupData = {
    config: config,
    analytics: config.analytics,
    whitelist: config.whitelist,
    timestamp: Date.now()
  };
  
  safeWriteJson(`./backups/emergency_${Date.now()}.json`, backupData);
}
```

### 📋 Diagnostic Commands

#### System Health Check
```javascript
// Comprehensive system diagnostic
function systemHealthCheck() {
  return {
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    botCount: activeBots.size,
    activeIntervals: activeIntervals.length,
    eventListeners: eventListeners.length,
    errors: fs.existsSync('./logs/errors.log') ? 
            fs.readFileSync('./logs/errors.log', 'utf8').split('\n').length : 0
  };
}
```

#### Network Diagnostics
```javascript
// Network connectivity test
async function networkDiagnostics() {
  const results = {};
  
  try {
    // Test WebSocket
    const wsTest = new WebSocket('ws://localhost:9090');
    results.websocket = 'connected';
    wsTest.close();
  } catch (err) {
    results.websocket = 'failed: ' + err.message;
  }
  
  try {
    // Test HTTP
    const httpTest = await fetch('http://localhost:8080/stats');
    results.http = 'connected';
  } catch (err) {
    results.http = 'failed: ' + err.message;
  }
  
  return results;
}
```

---

## Safety & Ethics

### ⚖️ Responsible Use Guidelines

#### Server Rules Compliance
- **Read Server Rules**: Always review and follow server-specific rules
- **Respect Admins**: Cooperate with server staff and moderators
- **Fair Play**: Avoid unfair advantages in competitive environments
- **Community Standards**: Maintain positive community interactions

#### Rate Limiting & Server Strain
```javascript
// Built-in rate limiting to prevent server impact
config.serverImpact = {
  maxActionsPerSecond: 10,
  chunkLoadDelay: 1000,
  reconnectDelay: 30000,
  maxConcurrentBots: 5  // Per IP limit
};
```

#### Detection Avoidance
- **Realistic Behavior**: Use humanization features appropriately
- **Timing Randomization**: Add natural delays to actions
- **Pattern Breaking**: Vary behavior to avoid detection
- **Stealth Mode**: Enable for sensitive environments

### 🚫 When NOT to Use Features

#### Combat Systems
- **Avoid Using On:**
  - Creative mode servers
  - Role-playing servers with strict combat rules
  - Small community servers where combat would be disruptive
  - Servers with explicit anti-bot policies

- **Use Responsibly On:**
  - PvP-focused servers with bot-friendly policies
  - Anarchy servers where automation is expected
  - Private servers for testing and development
  - Controlled environments with owner permission

#### Dupe Discovery
- **Educational Use Only**: For understanding game mechanics
- **Server Security Testing**: With explicit server owner permission
- **Research Purposes**: For academic or security research
- **Never on Production Servers**: Without explicit authorization

#### Stash Hunting
- **Respect Property**: Don't take from active bases
- **Avoid Griefing**: Don't damage legitimate structures
- **Community Impact**: Consider server economy impact
- **Stealth Operation**: Use discretion when exploring

### 🛡️ Security Best Practices

#### Account Security
```javascript
// Secure credential handling
localAccount: {
  username: process.env.MC_USERNAME,  // Use environment variables
  password: process.env.MC_PASSWORD,
  authType: 'microsoft'
}
```

#### Network Security
- **Proxy Usage**: Use reputable proxy services
- **Encryption**: Enable HTTPS/WSS where available
- **Firewall**: Configure appropriate port restrictions
- **VPN**: Consider VPN for additional anonymity

#### Data Protection
```javascript
// Sensitive data encryption
function encryptSensitiveData(data) {
  // Implement encryption for stored credentials
  // Use proper key management
}
```

### 📊 Impact Monitoring

#### Server Impact Tracking
```javascript
// Monitor server impact metrics
config.impactMetrics = {
  tpsImpact: 0,        // Server TPS change
  networkUsage: 0,     // Bandwidth consumption
  chunkLoads: 0,       // Chunk loading frequency
  entityCount: 0       // Entity spawning impact
};
```

#### Performance Thresholds
```javascript
// Automatic throttling based on impact
if (config.impactMetrics.tpsImpact < -2) {
  // Reduce bot activity
  config.serverImpact.maxActionsPerSecond = 5;
}
```

### 🤝 Community Guidelines

#### Positive Interactions
- **Helpful Behavior**: Assist other players when appropriate
- **Communication**: Respond politely to questions
- **Cooperation**: Work with server community goals
- **Respect**: Honor server culture and norms

#### Transparency
- **Disclosure**: Be open about bot usage when appropriate
- **Communication**: Respond to admin inquiries honestly
- **Documentation**: Keep records of permissions and approvals
- **Feedback**: Report bugs and issues to server owners

---

## Technical Details

### 🏗️ Architecture Overview

#### Class Structure
HunterX uses an embedded class architecture within a single file for optimal performance:

```javascript
// Core class hierarchy
HunterX (Main Orchestrator)
├── SwarmCoordinator
│   ├── BotManager
│   ├── RoleManager
│   └── CommunicationHub
├── CombatAI
│   ├── CrystalPvP
│   ├── ProjectileAI
│   └── MaceCombat
├── DupeTestingFramework
│   ├── LagExploiter
│   ├── ChunkBoundaryTester
│   └── SwarmDupeTester
├── ConversationAI
│   ├── NaturalLanguageProcessor
│   ├── ContextManager
│   └── TrustManager
├── SchematicLoader
│   ├── NBTParser
│   ├── BlockValidator
│   └── MaterialAnalyzer
└── IntelligenceDB
    ├── DataCollector
    ├── PatternAnalyzer
    └── ReportGenerator
```

#### Event Handling System
```javascript
// Centralized event management
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.interceptors = [];
  }
  
  on(event, handler, priority = 0) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push({ handler, priority });
    this.listeners.get(event).sort((a, b) => b.priority - a.priority);
  }
  
  emit(event, ...args) {
    if (this.listeners.has(event)) {
      for (const { handler } of this.listeners.get(event)) {
        try {
          handler(...args);
        } catch (err) {
          console.error(`[EVENT] Error in ${event} handler:`, err);
        }
      }
    }
  }
}
```

#### State Management
```javascript
// Centralized state management
class StateManager {
  constructor() {
    this.state = new Proxy({}, {
      set(target, property, value) {
        const oldValue = target[property];
        target[property] = value;
        
        // Trigger state change listeners
        eventManager.emit('stateChange', {
          property,
          oldValue,
          newValue: value
        });
        
        return true;
      }
    });
  }
  
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }
  
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.state);
    target[lastKey] = value;
  }
}
```

### 📡 Data Persistence

#### File Structure
```
hunterx-project/
├── HunterX.js              # Main application
├── package.json            # Dependencies
├── config.json             # Configuration (auto-generated)
├── data/                   # Runtime data
│   ├── whitelist.json      # Trust system
│   ├── homebase.json       # Base location
│   ├── schematics/         # Building files
│   ├── inventory/          # Item tracking
│   └── production/         # Resource data
├── models/                 # Neural networks
│   ├── combat_model.json
│   ├── placement_model.json
│   ├── dupe_model.json
│   └── conversation_model.json
├── dupes/                  # Discovery data
│   ├── knowledge_base.json
│   ├── test_results.json
│   └── patterns.json
├── stashes/                # Hunt results
│   ├── discoveries.json
│   └── valuations.json
├── logs/                   # System logs
│   ├── errors.log
│   ├── combat.log
│   └── activity.log
├── analytics/              # Performance data
│   ├── daily_stats.json
│   └── performance.json
└── backups/                # Emergency backups
    └── auto_backup.json
```

#### Data Serialization
```javascript
// Safe data persistence with validation
class DataPersistence {
  static save(key, data, validator = null) {
    if (validator && !validator(data)) {
      throw new Error('Data validation failed');
    }
    
    const filePath = `./data/${key}.json`;
    const serialized = JSON.stringify(data, this.replacer, 2);
    
    return safeWriteFile(filePath, serialized);
  }
  
  static load(key, defaultValue = null, validator = null) {
    const filePath = `./data/${key}.json`;
    const data = safeReadJson(filePath, defaultValue);
    
    if (validator && !validator(data)) {
      console.warn(`[DATA] Invalid data in ${key}, using default`);
      return defaultValue;
    }
    
    return data;
  }
  
  static replacer(key, value) {
    // Handle circular references and special types
    if (value instanceof Map) {
      return { _type: 'Map', data: Array.from(value.entries()) };
    }
    if (value instanceof Set) {
      return { _type: 'Set', data: Array.from(value) };
    }
    if (value instanceof Vec3) {
      return { _type: 'Vec3', x: value.x, y: value.y, z: value.z };
    }
    return value;
  }
}
```

### 🔌 Dependency Management

#### Core Libraries
| Library | Version | Purpose | Criticality |
|---------|---------|---------|-------------|
| **mineflayer** | ^4.0.0 | Bot framework | Critical |
| **mineflayer-pvp** | ^1.0.0 | PvP combat | Critical |
| **@miner-org/mineflayer-baritone** | ^4.1.1 | Pathfinding | Critical |
| **brain.js** | ^2.0.0-beta.24 | Neural networks | Critical |
| **ws** | ^8.0.0 | WebSocket communication | Critical |
| **socks** | ^2.7.0 | Proxy support | Optional |
| **prismarine-nbt** | ^2.0.0 | NBT parsing | Optional |
| **vec3** | ^0.1.8 | Vector math | Critical |

#### Dependency Injection
```javascript
// Modular dependency system
class DependencyContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }
  
  register(name, factory, options = {}) {
    this.services.set(name, { factory, options });
  }
  
  get(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }
    
    if (service.options.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory());
      }
      return this.singletons.get(name);
    }
    
    return service.factory();
  }
}

// Register services
const container = new DependencyContainer();
container.register('bot', () => mineflayer.createBot(config), { singleton: true });
container.register('pathfinder', (bot) => bot.pathfinder, { singleton: true });
container.register('combatAI', (bot) => new CombatAI(bot));
```

### 🔄 Memory Management

#### Garbage Collection
```javascript
// Proactive memory management
class MemoryManager {
  static cleanup() {
    // Clear event listeners
    clearAllEventListeners();
    
    // Clear intervals
    clearAllIntervals();
    
    // Break circular references
    this.breakCircularReferences();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }
  
  static breakCircularReferences() {
    // Break known circular references
    for (const bot of activeBots) {
      if (bot.combatAI) {
        bot.combatAI.bot = null;
        bot.combatAI = null;
      }
      if (bot.conversationAI) {
        bot.conversationAI.bot = null;
        bot.conversationAI = null;
      }
    }
  }
}
```

#### Resource Limits
```javascript
// Resource usage monitoring
class ResourceMonitor {
  constructor() {
    this.limits = {
      maxMemory: 1024 * 1024 * 1024, // 1GB
      maxBots: 50,
      maxIntervals: 100,
      maxListeners: 500
    };
  }
  
  checkLimits() {
    const memory = process.memoryUsage();
    
    if (memory.heapUsed > this.limits.maxMemory) {
      console.warn('[MEMORY] Approaching limit, triggering cleanup');
      MemoryManager.cleanup();
    }
    
    if (activeBots.size > this.limits.maxBots) {
      console.warn('[BOTS] Too many active bots, stopping extras');
      this.stopExcessBots();
    }
  }
}
```

### 🌐 Network Architecture

#### WebSocket Protocol
```javascript
// WebSocket message protocol
class WSP_protocol {
  static createMessage(type, data, recipient = null) {
    return {
      id: this.generateMessageId(),
      type,
      data,
      timestamp: Date.now(),
      sender: 'system',
      recipient,
      version: '1.0'
    };
  }
  
  static handleMessage(ws, message) {
    try {
      const parsed = JSON.parse(message);
      
      // Validate message structure
      if (!this.validateMessage(parsed)) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
        return;
      }
      
      // Route to appropriate handler
      this.routeMessage(parsed, ws);
      
    } catch (err) {
      console.error('[WS] Message handling error:', err);
    }
  }
  
  static validateMessage(message) {
    return message.id && 
           message.type && 
           message.timestamp && 
           message.version;
  }
}
```

#### HTTP API Design
```javascript
// RESTful API endpoints
class HTTPAPI {
  constructor() {
    this.routes = new Map();
    this.setupRoutes();
  }
  
  setupRoutes() {
    // GET routes
    this.routes.get('/', this.dashboardHandler);
    this.routes.get('/stats', this.statsHandler);
    this.routes.get('/bots', this.botsHandler);
    this.routes.get('/config', this.configHandler);
    
    // POST routes
    this.routes.post('/command', this.commandHandler);
    this.routes.post('/schematic/upload', this.uploadHandler);
    this.routes.post('/config/update', this.configUpdateHandler);
  }
  
  async handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const handler = this.routes.get(url.pathname);
    
    if (!handler) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    try {
      await handler.call(this, req, res, url);
    } catch (err) {
      console.error('[HTTP] Request error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  }
}
```

---

## API Reference

### 🤖 SwarmCoordinator Class

#### Constructor
```javascript
new SwarmCoordinator(config, wsServer)
```

#### Key Methods

##### `coordinateAttack(options)`
Coordinates multi-bot attack on target.
```javascript
await swarmCoordinator.coordinateAttack({
  target: 'EnemyPlayer',
  participants: ['bot_1', 'bot_2', 'bot_3'],
  strategy: 'pincer',
  timing: 'simultaneous'
});
```

##### `coordinateHelpOperation(options)`
Sends bots to help player at location.
```javascript
await swarmCoordinator.coordinateHelpOperation({
  coords: { x: 100, y: 64, z: -200 },
  requestedBy: 'PlayerName',
  urgency: 'high'
});
```

##### `assignRole(botId, role)`
Assigns specific role to bot.
```javascript
await swarmCoordinator.assignRole('bot_1', 'combat');
// Available roles: 'combat', 'builder', 'scout', 'support', 'transport'
```

##### `getSwarmStatus()`
Returns comprehensive swarm status.
```javascript
const status = swarmCoordinator.getSwarmStatus();
// Returns: { activeBots, roles, operations, performance }
```

##### `emergencyRecall(options)`
Recalls all bots to safety.
```javascript
await swarmCoordinator.emergencyRecall({
  reason: 'admin_detected',
  rendezvous: config.homeBase.coords
});
```

### ⚔️ CombatAI Class

#### Constructor
```javascript
new CombatAI(bot, config)
```

#### Key Methods

##### `handleCombat(target)`
Initiates combat with target entity.
```javascript
await combatAI.handleCombat(enemyPlayer);
// Returns: { success, damage, duration, outcome }
```

##### `setStrategy(strategy)`
Changes combat strategy.
```javascript
combatAI.setStrategy('aggressive');
// Strategies: 'aggressive', 'defensive', 'tactical', 'stealth'
```

##### `getCombatMetrics()`
Returns combat performance data.
```javascript
const metrics = combatAI.getCombatMetrics();
// Returns: { kills, deaths, accuracy, responseTime, efficiency }
```

##### `enableHumanization(tier)`
Enables anti-cheat humanization.
```javascript
combatAI.enableHumanization(2);
// Tiers: 0 (disabled), 1-3 (increasing humanization)
```

### 🔍 DupeTestingFramework Class

#### Constructor
```javascript
new DupeTestingFramework(bot, config)
```

#### Key Methods

##### `testHypothesis(hypothesis)`
Tests specific dupe hypothesis.
```javascript
const result = await dupeTester.testHypothesis({
  type: 'chunk_boundary',
  method: 'item_drop_dupe',
  conditions: { serverLag: true, playerCount: 20 }
});
// Returns: { success, evidence, riskLevel, recommendation }
```

##### `analyzePlugin(pluginData)`
Analyzes plugin for vulnerabilities.
```javascript
const analysis = await dupeTester.analyzePlugin({
  fileName: 'Essentials.jar',
  bytecode: pluginBytecode,
  version: '2.19.4'
});
// Returns: { vulnerabilities, exploitPotential, riskScore }
```

##### `getTestReport()`
Generates comprehensive test report.
```javascript
const report = dupeTester.getTestReport();
// Returns: { totalTests, successRate, patterns, recommendations }
```

### 🏗️ SchematicLoader Class

#### Constructor
```javascript
new SchematicLoader()
```

#### Key Methods

##### `loadSchematic(path, name)`
Loads and parses schematic file.
```javascript
const schematic = await schematicLoader.loadSchematic(
  './buildings/house.schem',
  'player_house'
);
// Returns: { name, metadata, blocks, materials, entities }
```

##### `getBlockAt(schematic, x, y, z)`
Gets block at specific coordinates.
```javascript
const block = schematicLoader.getBlockAt(schematic, 5, 10, 5);
// Returns: { name, position, data }
```

##### `getBlocksInRegion(schematic, x1, y1, z1, x2, y2, z2)`
Gets all blocks in region.
```javascript
const blocks = schematicLoader.getBlocksInRegion(
  schematic, 0, 0, 0, 10, 10, 10
);
// Returns: Array of block objects
```

##### `calculateMaterials(schematic)`
Calculates required materials.
```javascript
const materials = schematicLoader.calculateMaterials(schematic);
// Returns: { 'minecraft:oak_planks': 64, 'minecraft:stone': 128 }
```

### 🤝 ConversationAI Class

#### Constructor
```javascript
new ConversationAI(bot, config)
```

#### Key Methods

##### `handleMessage(username, message)`
Processes incoming chat message.
```javascript
await conversationAI.handleMessage('PlayerName', 'Where is your base?');
// Bot responds based on context and trust level
```

##### `setPersonality(trait, value)`
Adjusts personality traits.
```javascript
conversationAI.setPersonality('friendly', 0.8);
// Traits: friendly, helpful, curious, cautious
```

##### `getRelationship(username)`
Gets relationship data with player.
```javascript
const relationship = conversationAI.getRelationship('PlayerName');
// Returns: { trust, friendship, lastInteraction, history }
```

##### `generateResponse(context, message)`
Generates contextual response.
```javascript
const response = conversationAI.generateResponse(
  { location: 'base', activity: 'building' },
  'Need help with anything?'
);
// Returns: appropriate response string
```

### 📦 EnderChestManager Class

#### Constructor
```javascript
new EnderChestManager(bot)
```

#### Key Methods

##### `depositValuables()`
Deposits valuable items to ender chest.
```javascript
const deposited = await enderManager.depositValuables();
// Returns: { items: ['diamond', 'emerald'], quantities: [32, 16] }
```

##### `withdrawItems(items)`
Withdraws specific items.
```javascript
const withdrawn = await enderManager.withdrawItems([
  { name: 'diamond', count: 16 },
  { name: 'totem_of_undying', count: 4 }
]);
// Returns: { success, items, remaining }
```

##### `getInventory()`
Gets ender chest inventory.
```javascript
const inventory = enderManager.getInventory();
// Returns: Array of item objects with counts
```

##### `organizeItems()`
Organizes items in ender chest.
```javascript
await enderManager.organizeItems();
// Sorts by value and type
```

---

## Examples

### 🎯 Setting Up Automated Crystal PvP

#### Basic PvP Configuration
```javascript
// Configure for crystal PvP
config.mode = 'pvp';
config.combat = {
  maxSelfDamage: 6,
  minEffectiveDamage: 4,
  crystalRange: 5,
  engageRange: 20,
  retreatHealth: 8,
  autoLoot: true,
  smartEquip: true
};

// Enable combat AI
bot.combatAI = new CombatAI(bot, config);
bot.combatAI.setStrategy('aggressive');

// Start combat monitoring
bot.on('entityHurt', async (entity) => {
  if (entity === bot.entity) {
    const attacker = findAttacker(bot);
    if (attacker) {
      await bot.combatAI.handleCombat(attacker);
    }
  }
});
```

#### Advanced PvP with Humanization
```javascript
// Configure anti-cheat bypass
config.anticheat = {
  enabled: true,
  tier: 2,  // Humanized combat
  reactiveMode: true,
  autoDeescalate: true,
  maxCPS: 8,  // Limited clicks per second
  maxReach: 3.5
};

// Enable combat logger
config.combat.logger = {
  enabled: true,
  healthThreshold: 8,
  triggerScore: 50,
  escapeDistance: 100
};

// Setup emergency disconnect
const combatLogger = new CombatLogger(bot);
combatLogger.startMonitoring();
```

### 🔬 Running a Dupe Discovery Session

#### Basic Dupe Testing Setup
```javascript
// Configure dupe discovery
config.mode = 'dupe';
config.dupeDiscovery = {
  testingEnabled: true,
  stealthMode: true,
  minTimeBetweenAttempts: 45000,
  maxTimeBetweenAttempts: 180000
};

// Initialize dupe testing framework
bot.ultimateDupeEngine = new UltimateDupeEngine(bot, config);
await bot.ultimateDupeEngine.start();

// Test specific hypothesis
const hypothesis = {
  type: 'chunk_boundary',
  method: 'item_drop_dupe',
  conditions: {
    serverLag: true,
    playerCount: 20,
    timeOfDay: 'peak_hours'
  }
};

const result = await bot.ultimateDupeEngine.testHypothesis(hypothesis);
console.log('Test result:', result);
```

#### Advanced Multi-Bot Dupe Testing
```javascript
// Configure swarm for dupe testing
config.swarm.initialBotCount = 5;
config.swarm.maxBots = 10;

// Initialize swarm coordinator
const swarmCoordinator = new SwarmCoordinator(config);
await swarmCoordinator.initialize();

// Setup parallel testing
const hypotheses = [
  { type: 'chunk_boundary', method: 'item_dupe' },
  { type: 'entity_based', method: 'donkey_dupe' },
  { type: 'lag_based', method: 'inventory_desync' }
];

await swarmCoordinator.dupeTester.parallelTesting(hypotheses);
```

### 🐝 Coordinating a Swarm Attack

#### Basic Swarm Attack Setup
```javascript
// Initialize swarm
const swarmCoordinator = new SwarmCoordinator(config, wsServer);

// Spawn combat bots
for (let i = 0; i < 5; i++) {
  await spawnBot({
    role: 'combat',
    equipment: 'pvp_kit',
    strategy: 'aggressive'
  });
}

// Coordinate attack
await swarmCoordinator.coordinateAttack({
  target: 'EnemyPlayer',
  participants: ['bot_1', 'bot_2', 'bot_3'],
  strategy: 'pincer',
  positions: {
    bot_1: { x: 100, z: -200, role: 'flank_left' },
    bot_2: { x: 105, z: -195, role: 'direct_assault' },
    bot_3: { x: 110, z: -200, role: 'flank_right' }
  }
});
```

#### WebSocket Dashboard Control
```javascript
// Connect to dashboard
const ws = new WebSocket('ws://localhost:9090');

// Send attack command
ws.send(JSON.stringify({
  type: 'COORDINATED_ATTACK',
  target: 'EnemyPlayer',
  strategy: 'surround',
  participants: ['bot_1', 'bot_2', 'bot_3', 'bot_4']
}));

// Monitor progress
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'ATTACK_UPDATE') {
    console.log('Attack progress:', data.progress);
  }
};
```

### 🏠 Setting Up Emergency Help System

#### Emergency Response Configuration
```javascript
// Configure emergency help
config.swarm.emergencyResponse = {
  enabled: true,
  responseTime: 5000,  // 5 seconds
  maxResponders: 3,
  autoRecall: true
};

// Setup help command handler
bot.on('chat', async (username, message) => {
  if (message.includes('!help')) {
    const coords = extractCoords(message);
    
    if (coords && globalSwarmCoordinator) {
      await globalSwarmCoordinator.coordinateHelpOperation({
        coords,
        requestedBy: username,
        urgency: 'high'
      });
      
      bot.chat(`🆘 Sending help to ${coords.x}, ${coords.y}, ${coords.z}!`);
    }
  }
});
```

#### Automated Threat Response
```javascript
// Setup combat threat detection
bot.on('entityHurt', async (entity) => {
  if (entity === bot.entity) {
    const attacker = findAttacker(bot);
    
    if (attacker && globalSwarmCoordinator) {
      // Trigger emergency response
      await globalSwarmCoordinator.coordinateHelpOperation({
        coords: bot.entity.position,
        requestedBy: bot.username,
        urgency: 'critical',
        threat: attacker.username
      });
      
      // Log incident
      console.log(`[EMERGENCY] Under attack by ${attacker.username}!`);
    }
  }
});
```

### 🏗️ Automated Building Project

#### Schematic Building Setup
```javascript
// Load schematic
const schematicLoader = new SchematicLoader();
const schematic = await schematicLoader.loadSchematic(
  './schematics/mega_base.schem',
  'main_base'
);

// Calculate materials needed
const materials = schematicLoader.calculateMaterials(schematic);
console.log('Materials needed:', materials);

// Initialize builder
bot.schematicBuilder = new SchematicBuilder(bot, schematic);

// Start building
await bot.schematicBuilder.build({
  location: { x: 0, y: 64, z: 0 },
  priority: 'high',
  autoGather: true
});
```

#### Multi-Bot Construction
```javascript
// Coordinate building with swarm
await swarmCoordinator.coordinateBuilding({
  schematic: 'mega_base',
  location: { x: 0, y: 64, z: 0 },
  roles: {
    'bot_1': 'builder',
    'bot_2': 'supplier',
    'bot_3': 'excavator'
  },
  phases: [
    { name: 'excavation', bots: ['bot_3'], duration: 3600000 },
    { name: 'foundation', bots: ['bot_1'], duration: 7200000 },
    { name: 'walls', bots: ['bot_1'], duration: 10800000 },
    { name: 'roof', bots: ['bot_1'], duration: 5400000 },
    { name: 'detailing', bots: ['bot_1'], duration: 3600000 }
  ]
});
```

---

## FAQ

### ❓ General Questions

**Q: Can HunterX get me banned from servers?**
A: HunterX includes anti-cheat bypass features and humanization options, but bot usage always carries some risk. Use responsibly, follow server rules, and enable humanization features on strict servers.

**Q: Does HunterX work on all Minecraft servers?**
A: HunterX works on most Minecraft 1.12+ servers. It automatically detects cracked vs premium servers and adapts accordingly. Some servers with advanced anti-cheat may detect bot behavior despite humanization.

**Q: How many bots can I run simultaneously?**
A: The technical limit is 50 bots, but practical limits depend on:
- Your computer's hardware (CPU, RAM, network)
- Server's bot policies and player limits
- Network bandwidth and proxy capabilities
- Recommended: 3-5 bots for most users

**Q: What's the difference between cracked and premium server handling?**
A: 
- **Cracked servers**: No authentication required, username-based login
- **Premium servers**: Microsoft/Mojang authentication required, verified accounts
- HunterX automatically detects server type and handles authentication accordingly

### 🎯 Combat & PvP Questions

**Q: How accurate is the crystal PvP AI?**
A: The crystal PvP AI has superhuman reaction times (50-150ms) with 90%+ accuracy in optimal conditions. Accuracy depends on:
- Server latency and TPS
- Anti-cheat humanization level
- Environmental factors (obstacles, lag)

**Q: Can the combat AI beat top players?**
A: In pure mechanical skill, yes - the AI has faster reactions and perfect calculations. However, human players have tactical creativity that AI may not match. Success varies based on server rules and anti-cheat strictness.

**Q: What weapons does HunterX support?**
A: HunterX supports all Minecraft combat methods:
- Crystal PvP (primary specialty)
- Melee combat (swords, axes)
- Ranged combat (bows, crossbows, tridents)
- Mace combat with elytra diving
- Wind charge combos (1.21+)

### 🔍 Discovery & Testing Questions

**Q: How accurate is the dupe detection?**
A: Dupe detection accuracy varies by server and method:
- Historical pattern analysis: 70-80% accuracy
- Plugin vulnerability scanning: 60-70% accuracy
- Active testing: 15-40% success rate (depends on server security)
- Multi-bot coordinated testing: Higher success but more detectable

**Q: Is dupe testing safe?**
A: Dupe testing carries inherent risks:
- Account bans on strict servers
- Server security alerts
- Legal/ethical considerations
Only use on servers where you have explicit permission or for educational purposes.

**Q: How does stash hunting work?**
A: Stash hunting uses multiple methods:
- Chunk-by-chunk scanning for hidden chests
- Pattern recognition from successful discoveries
- Player behavior analysis and base prediction
- Value assessment and priority targeting
Success rate varies by server type and player activity.

### 🤖 Bot Management Questions

**Q: How do I update HunterX?**
A: 
```bash
# Backup your data
cp -r data/ backups/
cp -r models/ backups/

# Update dependencies
npm update

# Restart with new version
node HunterX.js
```

**Q: Can I customize the bot's behavior?**
A: Yes! HunterX is highly customizable:
- Edit configuration options in the code
- Adjust personality traits and responses
- Modify combat strategies and thresholds
- Create custom command handlers
- Add new neural network training data

**Q: How do I add custom commands?**
A: Add to the ConversationAI.handleCommand method:
```javascript
// Custom command example
if (lower.includes('custom command')) {
  if (!this.hasTrustLevel(username, 'trusted')) {
    this.bot.chat("Only trusted users can use this command!");
    return;
  }
  
  // Your custom logic here
  this.bot.chat("Custom command executed!");
  return;
}
```

### 📊 Performance & Technical Questions

**Q: Why is HunterX using so much memory?**
A: Memory usage comes from:
- Neural network models (10-50MB each)
- Bot instances and state data
- Intelligence databases and analytics
- Replay buffers and training data
Solutions: Reduce bot count, increase cleanup frequency, lower data retention limits.

**Q: How can I improve performance?**
A: Performance optimization tips:
- Reduce video feed resolution and FPS
- Limit active bots to what you need
- Increase cleanup intervals
- Disable unused features (dupe testing, stash hunting)
- Use SSD storage for better I/O performance

**Q: Is HunterX compatible with Minecraft 1.20+?**
A: HunterX is primarily developed for 1.19.x but often works on 1.20+. Some features may need updates:
- Combat mechanics for new weapons
- Block/item ID changes
- Protocol updates
Check the mineflayer compatibility matrix for specific versions.

### 🔒 Security & Safety Questions

**Q: Is my Minecraft account secure?**
A: HunterX handles credentials securely:
- Never shares credentials with third parties
- Uses official Microsoft/Mojang authentication
- Stores credentials locally (can use environment variables)
- Optional proxy support for additional privacy

**Q: Can HunterX be detected by anti-cheat?**
A: Detection risk depends on:
- Server anti-cheat sophistication
- Humanization settings used
- Bot behavior patterns
- Network analysis
Enable humanization features and use conservative settings on strict servers.

**Q: Is it legal to use HunterX?**
A: Legality depends on:
- Server terms of service
- Local laws regarding software automation
- Intended use (personal vs commercial)
- Jurisdiction-specific regulations
Always follow server rules and applicable laws.

### 💬 Support & Community Questions

**Q: Where can I get help with HunterX?**
A: Support resources:
- Check this documentation first
- Review error logs in `./logs/` directory
- Test with minimal configuration
- Check GitHub issues (if available)
- Community forums (if available)

**Q: How do I report bugs or request features?**
A: For bug reports:
1. Check error logs for details
2. Note reproduction steps
3. Include system information
4. Provide configuration details
For feature requests, describe the use case and desired functionality.

**Q: Can I contribute to HunterX development?**
A: While HunterX is primarily a single-file project, contributions may be welcome:
- Bug fixes and optimizations
- New features and improvements
- Documentation enhancements
- Testing and feedback
Check the project's contribution guidelines if available.

---

## Credits & License

### 👥 Development Team

**Lead Developer:** HunterX Development Team  
**Architecture:** Advanced AI & Automation Systems  
**Neural Networks:** Combat, Conversation, and Discovery Systems  
**Integration:** WebSocket, HTTP, and Multi-bot Coordination  

### 🙏 Acknowledgments

**Core Libraries & Frameworks:**
- **mineflayer** - Minecraft bot framework by PrismarineJS
- **brain.js** - Neural network implementation
- **WebSocket (ws)** - Real-time communication
- **Baritone** - Advanced pathfinding and navigation

**Community Contributors:**
- Beta testers and feedback providers
- Server administrators for testing environments
- Community members for feature suggestions
- Security researchers for vulnerability insights

**Special Thanks:**
- Minecraft server communities for testing opportunities
- Open source contributors to related projects
- Users who provided valuable feedback and bug reports

### 📜 License

```
HunterX Minecraft Automation Bot
Copyright (c) 2024 HunterX Development Team

This software is provided for educational and research purposes only.
Users are responsible for complying with server terms of service
and applicable laws in their jurisdiction.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### ⚖️ Disclaimer

**Educational Use Only:** HunterX is intended for educational purposes, security research, and understanding game mechanics. Users must comply with all applicable server rules, terms of service, and laws.

**No Warranty:** The software is provided without warranty. Users assume all responsibility for their actions and any consequences arising from the use of this software.

**Legal Compliance:** Users are responsible for ensuring their use of HunterX complies with:
- Server terms of service and rules
- Local and international laws
- Game publisher policies
- Network security regulations

### 📞 Contact & Support

**Official Channels:**
- **Documentation:** This comprehensive guide
- **Bug Reports:** Check project repository for issue reporting
- **Community:** Server-specific community channels
- **Security:** Responsible disclosure for security issues

**Support Guidelines:**
- Read documentation thoroughly before requesting help
- Provide detailed error logs and reproduction steps
- Be patient with volunteer support
- Follow community guidelines and etiquette

---

**Version:** HunterX v22.1  
**Documentation Updated:** 2024  
**Last Revision:** Comprehensive feature documentation and usage guide