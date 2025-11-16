# Command System Implementation Summary

## Overview
Successfully implemented a comprehensive command system with single-bot (!) and swarm (!!) prefix modes, integrating with ConversationAI for natural chat responses.

## Features Implemented

### 1. Command Prefix System
- **`!command args`** → Execute command on single bot (HunterX)
- **`!!command args`** → Broadcast command to ALL spawned bots via SwarmCoordinator
- Proper command parsing with argument extraction
- Trust level enforcement for both modes

### 2. Command Catalog (COMMAND_DEFINITIONS)
Centralized catalog of 50+ commands with metadata:
- Command key and trigger phrases
- Minimum trust level requirements
- Swarm broadcast capability flag
- Command descriptions

**Command Categories:**
- **Emergency & Assistance** (5 commands): help, need help, swarm status, spawn bots, stop
- **Navigation** (7 commands): goto, follow, go home, set home, travel to, find highway
- **Combat** (5 commands): attack, coordinated attack, retreat, start guard, defense status
- **Gathering** (6 commands): mine, collect, find, hunt, fish, farm
- **Discovery** (4 commands): stash, dupe, scanner status, scanner report
- **Base & Storage** (3 commands): home status, deposit, store valuables
- **Maintenance** (9 commands): maintenance status, repair armor, swap elytra, check elytra, set xp farm
- **Building** (3 commands): start build, build schematic, build status
- **Analytics** (1 command): stats
- **Trust & Permissions** (8 commands): trust level, check trust, list whitelist, set trust, remove trust

### 3. Command Router
Enhanced ConversationAI with:
- `parsePrefixedCommand()` - Parses command triggers and extracts arguments
- `formatTrustLevel()` - Formats trust level names for display
- Proper ! and !! prefix handling in `handleMessage()`
- Command validation and trust level checking

### 4. Swarm Command Broadcasting
**Group Command Flow (!! prefix):**
1. User sends: `!!attack targetPlayer`
2. ConversationAI parses and validates command
3. Command broadcast to SwarmCoordinator
4. SwarmCoordinator sends COMMAND message to all connected bots
5. Each bot receives and executes command locally

**Implementation:**
- Enhanced `handleMessage()` to detect !! prefix
- Added COMMAND case handler in WebSocket message switch
- Command payload includes metadata (key, trigger, args, trust level)
- Automatic local execution on initiating bot

### 5. Trust Level Enforcement
**Trust Levels:**
- **Guest** - Basic commands (navigation, gathering, status)
- **Trusted** - Most commands (combat, building, maintenance)
- **Admin** - Dangerous commands (spawn bots, set trust, dupe)
- **Owner** - Configuration changes

Commands validate trust level before execution:
```javascript
if (!this.hasTrustLevel(caller, requiredTrust)) {
  this.bot.chat(`Insufficient trust level. Requires ${this.formatTrustLevel(requiredTrust)}+.`);
  return;
}
```

### 6. ConversationAI Integration
**Non-Command Message Handling:**
- Messages without ! or !! are processed by ConversationAI
- Intent analysis (GREETING, HELP_REQUEST, KNOWLEDGE_QUERY, etc.)
- Natural language responses using knowledge base
- Optional LLM integration for advanced conversation
- Context preservation for multi-turn conversations

**Command vs. Conversation:**
```javascript
if (message.startsWith('!!')) {
  // Broadcast to swarm
} else if (message.startsWith('!')) {
  // Single bot command
} else {
  // Natural conversation via ConversationAI
}
```

### 7. Error Handling
Comprehensive error handling:
- **Invalid command**: "Unknown command: {command}"
- **Insufficient trust**: "Insufficient trust level. Requires {level}+."
- **Command too long**: "Command too long! Please keep it under 160 characters."
- **Swarm unavailable**: "Swarm coordinator not available for group commands!"
- **Command execution errors**: Caught and logged with user feedback

### 8. Bug Fixes
**Fixed globalMessageInterceptor Error:**
- globalMessageInterceptor was declared but never initialized
- Fixed by assigning intelligenceDB.messageInterceptor to globalMessageInterceptor
- Prevents crash when ConversationAI tries to log conversations

## Usage Examples

### Single-Bot Commands
```
!attack targetPlayer       → Only HunterX attacks
!goto 100 64 200          → Only HunterX navigates
!mine diamond             → Only HunterX mines diamonds
!stats                    → Show HunterX stats
```

### Swarm Commands
```
!!attack targetPlayer     → ALL bots attack target
!!goto 100 64 200        → ALL bots navigate to coords
!!mine diamond           → ALL bots mine diamonds
!!retreat                → ALL bots retreat from combat
```

### Natural Conversation
```
Hunter: "what is the rarest ore?"
Bot: "Ancient debris is the rarest ore, found only in the Nether below Y=15..."

Hunter: "how to make a torch?"
Bot: "Stick + Coal or Charcoal = 4 Torches"

Hunter: "where are you?"
Bot: "I'm at 123, 64, 456 in the overworld"
```

## Technical Details

### Command Parsing
```javascript
parsePrefixedCommand(commandText) {
  const lower = commandText.toLowerCase();
  const match = COMMAND_TRIGGER_ENTRIES.find(entry =>
    lower === entry.triggerLower || lower.startsWith(`${entry.triggerLower} `)
  );
  if (!match) return null;
  
  const triggerLength = match.triggerLower.length;
  const argString = commandText.slice(triggerLength).trim();
  const args = argString ? argString.split(/\s+/) : [];
  
  return {
    key: match.definition.key,
    trigger: match.triggerLower,
    args,
    argString,
    raw: commandText,
    definition: match.definition
  };
}
```

### Swarm Broadcast
```javascript
// Broadcasting command to swarm
const localCommand = `!${parsedCommand.raw}`;
globalSwarmCoordinator.broadcastCommand(localCommand);

// Receiving command on bot
case 'COMMAND':
  const execCommand = commandData.startsWith('!') ? 
    commandData.substring(1) : commandData;
  await conversationAI.handleCommand('SYSTEM', execCommand, {
    source: 'swarm',
    bypassTrust: true
  });
  break;
```

### Trust Level Checking
```javascript
hasTrustLevel(username, minLevel, options = {}) {
  const userLevel = this.getTrustLevel(username);
  if (!userLevel) return false;
  
  const userIndex = this.trustLevels.indexOf(userLevel.toLowerCase());
  const minIndex = this.trustLevels.indexOf(minLevel.toLowerCase());
  
  return userIndex >= minIndex;
}
```

## Configuration

### Enable Swarm Mode
```javascript
config.swarm.enabled = true;
config.swarm.maxBots = 10;
```

### Set Trust Levels
```javascript
!set trust username admin    // Grant admin privileges
!list whitelist             // Show all trusted users
!remove trust username      // Remove user from whitelist
```

### Whitelist Configuration
Located in `./data/whitelist.json`:
```json
[
  { "name": "player1", "level": "admin" },
  { "name": "player2", "level": "trusted" },
  { "name": "player3", "level": "guest" }
]
```

## Testing

### Test Single-Bot Commands
```
!test                    → Run system test
!status                  → Show bot status
!goto 0 64 0            → Navigate to spawn
!attack zombie_123       → Attack entity
```

### Test Swarm Commands
```
!!spawn 3                → Spawn 3 additional bots
!!goto 100 64 200       → All bots navigate
!!attack targetPlayer   → Coordinated attack
!!retreat               → All bots retreat
```

### Test ConversationAI
```
Hunter: "hi"
Bot: "Hello there!"

Hunter: "what is the strongest block?"
Bot: "Bedrock and barriers are the strongest blocks..."

Hunter: "how are you?"
Bot: "Health: 20/20, Hunger: 20/20, Level: 5..."
```

## Acceptance Criteria

✅ **All 50+ commands work with ! prefix**
- Comprehensive command catalog implemented
- All categories covered (Emergency, Navigation, Combat, etc.)

✅ **All commands work with !! prefix (broadcast to swarm)**
- SwarmCoordinator.broadcastCommand() integration
- COMMAND case handler in WebSocket message switch
- Each bot executes command locally

✅ **Trust levels properly enforced**
- Command definitions include minTrust requirements
- hasTrustLevel() validates before execution
- Clear error messages for insufficient trust

✅ **ConversationAI responds to non-command chat**
- Intent analysis for natural language
- Knowledge base integration
- LLM support for advanced conversation

✅ **Commands execute correctly on single or multiple bots**
- ! prefix routes to single bot
- !! prefix broadcasts to all bots
- Proper argument parsing and validation

✅ **Error messages are clear and helpful**
- Command not found → "Unknown command: {command}"
- Invalid trust → "Insufficient trust level. Requires {level}+."
- Execution error → Caught and logged with feedback

✅ **No command conflicts or crashes**
- globalMessageInterceptor initialization fixed
- Comprehensive error handling
- Command parsing validates all inputs

## Future Enhancements

1. **Command Aliases** - Add shorter aliases for common commands
2. **Command History** - Track recent commands per user
3. **Command Queue** - Queue commands for execution
4. **Command Macros** - Define custom command sequences
5. **Command Permissions** - Fine-grained permission system
6. **Command Help** - Detailed help for each command
7. **Command Autocomplete** - Suggest commands based on partial input

## Conclusion

The command system implementation provides a robust, production-ready framework for bot control with comprehensive command support, proper trust enforcement, and seamless swarm coordination. The integration with ConversationAI enables natural language interaction while maintaining full backward compatibility with existing systems.
