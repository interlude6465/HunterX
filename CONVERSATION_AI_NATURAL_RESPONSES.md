# ConversationAI Upgrade: Natural, Human-Like Responses

## Overview

The ConversationAI system has been completely upgraded to provide **natural, human-like conversations** similar to ChatGPT or Claude, replacing the previous rigid, robotic responses.

## Key Features

### 1. **LLM Integration (Option A)**
- ✅ **OpenAI API** (ChatGPT) support
- ✅ **Anthropic API** (Claude) support  
- ✅ **Local LLM** support (Ollama, Llama2, etc.)
- ✅ Automatic fallback to personality-based responses

### 2. **Natural Personality System (Option B)**
- ✅ Confident, aggressive, playful personality
- ✅ Casual, conversational tone
- ✅ Context-aware responses
- ✅ Multiple response variations to avoid repetition

### 3. **Hybrid Approach (Option C) - IMPLEMENTED**
- LLM for complex conversations when enabled
- Natural personality-based templates as fallback
- Minecraft-specific commands preserved
- Best of both worlds

### 4. **Conversation Features**
- ✅ Conversation history tracking per user
- ✅ Context awareness (bot health, location, activity)
- ✅ Response caching (5-minute TTL)
- ✅ Rate limiting (10 req/min per user)
- ✅ Personality traits and example phrases

## Configuration

### Enable LLM Integration

```javascript
// In HunterX.js config or data/config.json:
conversationalAI: {
  enabled: true,
  useLLM: true, // Enable LLM
  provider: {
    name: 'openai', // or 'anthropic', 'local'
    model: 'gpt-3.5-turbo', // or 'claude-3-sonnet-20240229', 'llama2'
    endpoint: null, // For local: 'http://localhost:11434/api/generate'
    maxTokens: 200,
    temperature: 0.7
  },
  apiKey: 'sk-...', // Or set OPENAI_API_KEY env variable
  requestTimeout: 15000,
  cacheTTL: 300000,
  rateLimit: {
    maxRequests: 10,
    windowMs: 60000
  }
}
```

### Option 1: OpenAI (ChatGPT)

```bash
export OPENAI_API_KEY="sk-..."
# Or add to config: apiKey: 'sk-...'
```

**Config:**
```javascript
provider: {
  name: 'openai',
  model: 'gpt-3.5-turbo', // or gpt-4
  maxTokens: 200,
  temperature: 0.7
}
```

### Option 2: Anthropic (Claude)

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# Or add to config: apiKey: 'sk-ant-...'
```

**Config:**
```javascript
provider: {
  name: 'anthropic',
  model: 'claude-3-sonnet-20240229', // or claude-3-opus-20240229
  maxTokens: 200,
  temperature: 0.7
}
```

### Option 3: Local LLM (Ollama/Llama2)

First, install and run Ollama:
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2

# Run Ollama server (runs on localhost:11434 by default)
ollama serve
```

**Config:**
```javascript
provider: {
  name: 'local',
  model: 'llama2', // or mistral, codellama, etc.
  endpoint: 'http://localhost:11434/api/generate',
  maxTokens: 200,
  temperature: 0.7
}
```

### Option 4: Personality-Based (No LLM)

If you don't want to use an external LLM:

```javascript
conversationalAI: {
  enabled: true,
  useLLM: false, // Disable LLM - use personality templates
  // ... rest of config
}
```

The bot will use natural personality-based responses as fallback.

## Conversation Examples

### Before (Old System)
```
User: "Hey Hunter"
Bot: "Sorry, I can't find that item"

User: "How are you?"
Bot: "I'm here to help with Minecraft tips"

User: "Can you get me diamonds?"
Bot: "Anything you want me to do?"
```

### After (New System)

#### With LLM Enabled:
```
User: "Hey Hunter"
Bot: "Yo! What's up? Ready to cause some chaos?"

User: "How are you doing?"
Bot: "Not bad, just vibing at 20 hearts. Looking for trouble or just hanging?"

User: "Can you get me diamonds?"
Bot: "Easy. Give me a sec and I'll grab you some."

User: "Do you like fighting?"
Bot: "Hell yeah, I do. Nothing beats a good PvP session. You in?"

User: "What's your favorite thing to do?"
Bot: "Honestly? Hunting players. But I'm also down for mining, building, whatever keeps things interesting."
```

#### Without LLM (Personality Fallback):
```
User: "Hey Hunter"
Bot: "Yo player123! What's up?"

User: "How are you?"
Bot: "Not bad, just vibing. Looking for trouble or just hanging?"

User: "Where are you?"
Bot: "I'm chilling at 1250, 64, -3400 in the overworld."

User: "Status?"
Bot: "I'm at 20 hearts, 18 hunger, level 15, 4/4 armor pieces. All good here."

User: "Thanks!"
Bot: "Anytime, player123."

User: "Bye"
Bot: "Catch you later, player123. Stay sharp out there!"
```

## Personality Definition

The bot has a defined personality that guides all responses:

```javascript
personality: {
  name: 'Hunter',
  style: 'confident, aggressive, playful',
  tone: 'casual, sometimes cocky, helpful',
  interests: ['PvP', 'finding loot', 'building', 'causing chaos', 'hunting players'],
  traits: [
    'I love combat and PvP',
    'I\'m always ready for action',
    'I\'m skilled at finding items and resources',
    'I can be a bit cocky but I back it up',
    'I enjoy causing trouble but in a fun way',
    'I\'m loyal to my friends and deadly to enemies'
  ],
  examplePhrases: [
    'Yo! What\'s up?',
    'Ready to cause some chaos?',
    'Hell yeah, I do.',
    'Easy. Give me a sec.',
    'You in?',
    'Let\'s do this.',
    'Not bad, just vibing.',
    'Looking for trouble or just hanging?'
  ]
}
```

## Intent-Based Handlers

All conversation types use natural responses:

### Greetings
- "Yo player! What's up?"
- "Hey player! Ready to cause some chaos?"
- "Sup player! Looking for trouble or just hanging?"

### Farewells
- "Catch you later, player. Stay sharp out there!"
- "Later player! Ping me if you need backup."
- "See you around, player. I'll be here when you need me."

### Gratitude
- "Anytime, player."
- "You got it, player."
- "No problem at all!"
- "Happy to help."

### Status Requests
- "I'm at 20 hearts, 18 hunger, level 15. All good here."
- "Sitting at 20 HP, 20 food, 4/4 armor pieces. Ready for action."
- "Status check: 20 health, 20 hunger. What's next?"

### Location Requests
- "I'm chilling at 1250, 64, -3400 in the overworld."
- "Right now I'm at coordinates 100, 70, -500 (nether)."
- "Currently posted up at -2000, 65, 3000 in the overworld. Need me somewhere?"

### Small Talk
- "What do you need? I'm ready for anything."
- "Just say the word and I'll make it happen."
- "I'm all ears. What's the plan?"
- "Talk to me. What are we doing?"

### Help Requests
- "I can scout, fight, build, grab loot—you name it. Toss me something like 'find me diamonds' or '!attack player'."
- "Need resources, protection, or a build thrown up? Say the word."

## Context Awareness

The bot includes context in responses:
- **Health**: Current HP/20
- **Location**: Coordinates and dimension
- **Activity**: Current task (mining, building, idle, etc.)

This context is automatically passed to LLM for even more natural responses.

## Conversation History

Each user has their own conversation history (last 10 messages) that provides context for follow-up questions:

```javascript
User: "Where are you?"
Bot: "I'm at 100, 64, -500 in the overworld."

User: "Come to spawn"
Bot: "On my way from 100, 64, -500 to spawn!"
```

## Rate Limiting & Caching

- **Rate Limit**: 10 requests per minute per user
- **Cache TTL**: 5 minutes (responses cached to reduce API costs)
- **Conversation History**: Last 10 messages per user

## API Costs (if using LLM)

### OpenAI (gpt-3.5-turbo)
- ~$0.0015 per conversation (input + output)
- 10 conversations = ~$0.015
- 100 conversations = ~$0.15

### Anthropic (Claude 3 Sonnet)
- ~$0.003 per conversation
- 10 conversations = ~$0.03
- 100 conversations = ~$0.30

### Local LLM (Ollama)
- **FREE** - runs locally
- No API costs
- Slightly slower responses

## Testing

### Test without LLM (personality-based):
```javascript
config.conversationalAI.useLLM = false;
```

Chat with the bot - it will use natural personality responses.

### Test with OpenAI:
```javascript
config.conversationalAI.useLLM = true;
config.conversationalAI.provider.name = 'openai';
config.conversationalAI.apiKey = 'sk-...'; // Or use env var
```

### Test with local LLM:
```bash
# Run Ollama server
ollama serve
```

```javascript
config.conversationalAI.useLLM = true;
config.conversationalAI.provider.name = 'local';
config.conversationalAI.provider.endpoint = 'http://localhost:11434/api/generate';
```

## Monitoring

Check LLM status:
```javascript
bot.conversationAI.llmBridge.getStatus();
// Returns:
// {
//   enabled: true,
//   provider: 'openai',
//   model: 'gpt-3.5-turbo',
//   hasApiKey: true,
//   cacheSize: 15,
//   activeConversations: 3,
//   rateLimits: [...]
// }
```

View metrics:
```javascript
config.conversationalAI.metrics;
// {
//   totalQueries: 150,
//   llmQueries: 75,
//   llmFailures: 2,
//   greetings: 20,
//   smallTalk: 30,
//   ...
// }
```

## Acceptance Criteria ✅

- ✅ Bot gives natural, human-like responses
- ✅ Conversations feel authentic
- ✅ Not rigid or scripted
- ✅ Can discuss non-game topics casually
- ✅ Stays in character as Minecraft bot
- ✅ Responses are helpful and engaging
- ✅ No more robotic "I'm here to help with Minecraft tips"
- ✅ LLM integration (OpenAI, Anthropic, Local)
- ✅ Personality system with traits and style
- ✅ Context awareness (health, location, activity)
- ✅ Conversation history tracking
- ✅ Rate limiting and caching
- ✅ Fallback to personality templates when LLM unavailable
- ✅ Commands still work as normal
- ✅ Seamless integration with existing systems

## Architecture

```
User Message
    ↓
stripBotName() → normalizeMessage()
    ↓
analyzeIntent() 
    ↓
    ├─→ GREETING → handleGreeting()
    │                ├─→ Try LLM (if enabled)
    │                └─→ Fallback: Natural personality greeting
    │
    ├─→ FAREWELL → handleFarewell()
    │                ├─→ Try LLM (if enabled)
    │                └─→ Fallback: Natural personality farewell
    │
    ├─→ STATUS_REQUEST → handleStatusRequest()
    │                     ├─→ Try LLM (if enabled)
    │                     └─→ Fallback: Natural status with context
    │
    ├─→ LOCATION_REQUEST → handleLocationRequest()
    │                       ├─→ Try LLM (if enabled)
    │                       └─→ Fallback: Natural location with coords
    │
    ├─→ SMALL_TALK → handleSmallTalk()
    │                 ├─→ Try LLM (if enabled)
    │                 └─→ Fallback: Natural personality responses
    │
    └─→ COMMAND → handleCommand()
                  └─→ Execute Minecraft commands as normal
```

## LLMBridge Features

1. **Multi-Provider Support**: OpenAI, Anthropic, Local LLMs
2. **Conversation History**: Tracks last 10 messages per user
3. **System Prompts**: Personality-driven prompts for consistent character
4. **Context Injection**: Passes bot health, location, activity to LLM
5. **Caching**: Reduces API costs with 5-minute cache
6. **Rate Limiting**: 10 requests/minute per user
7. **Fallback System**: Personality templates when LLM unavailable
8. **Error Handling**: Graceful degradation on API failures

## Summary

The ConversationAI system now provides:
- **Natural conversations** like ChatGPT/Claude
- **Personality-driven responses** that stay in character
- **Context awareness** for more relevant replies
- **Multiple LLM options** (OpenAI, Anthropic, Local)
- **Intelligent fallbacks** when LLM is unavailable
- **Conversation memory** for follow-up questions
- **Zero breaking changes** to existing commands

The bot is now engaging, helpful, and feels like talking to a real player instead of a rigid script!
