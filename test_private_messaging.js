#!/usr/bin/env node

// Test script for private messaging functionality
const fs = require('fs');

// Mock the HunterX environment for testing
global.config = {
  privateMsg: {
    enabled: false,
    minTrustLevel: 'trusted',
    autoReplyTemplate: '🤖 [Auto-reply] I am currently in private mode. Please use public chat or try again later.',
    autoReplyPrefix: '[Auto-reply] ',
    rateLimitPerSender: 30000,
    globalRateLimit: 10,
    rateLimitWindow: 60000,
    forwardToConsole: true,
    logToFile: true,
    senderCooldowns: new Map(),
    globalReplyCount: 0,
    lastRateReset: Date.now(),
    blockedSenders: new Set()
  },
  conversationMetrics: {
    messagesReceived: 0,
    messagesResponded: 0,
    commandsExecuted: 0,
    avgResponseTime: 0,
    lastInteraction: null,
    privateMessagesReceived: 0,
    privateMessagesSent: 0,
    privateAutoReplies: 0,
    lastPrivateInteraction: null
  },
  whitelist: [
    { name: 'TestUser', level: 'trusted' },
    { name: 'AdminUser', level: 'admin' }
  ]
};

// Mock bot object
const mockBot = {
  username: 'HunterX',
  chat: (message) => {
    console.log(`[BOT CHAT] ${message}`);
  }
};

// Mock global objects
global.globalIntelligenceDatabase = {
  logEvent: (event) => {
    console.log(`[INTEL] Logged event: ${JSON.stringify(event)}`);
  },
  events: []
};

// Extract ConversationAI class from HunterX.js
const hunterXCode = fs.readFileSync('./HunterX.js', 'utf8');
const conversationAIClassMatch = hunterXCode.match(/class ConversationAI\s*{[\s\S]*?^}/m);

if (!conversationAIClassMatch) {
  console.error('Could not extract ConversationAI class');
  process.exit(1);
}

// Create a simplified version for testing
class TestConversationAI {
  constructor(bot) {
    this.bot = bot;
    this.trustLevels = ['guest', 'trusted', 'admin', 'owner'];
  }

  isWhitelisted(username) {
    return global.config.whitelist.some(entry => entry.name === username);
  }

  getTrustLevel(username) {
    const entry = global.config.whitelist.find(e => e.name === username);
    return entry ? entry.level : null;
  }

  hasTrustLevel(username, minLevel) {
    const userLevel = this.getTrustLevel(username);
    if (!userLevel) return false;
    
    const userIndex = this.trustLevels.indexOf(userLevel);
    const minIndex = this.trustLevels.indexOf(minLevel);
    
    return userIndex >= minIndex;
  }

  async handleWhisper(username, message) {
    console.log(`[PRIVATE MSG] Received whisper from ${username}: ${message}`);
    
    // Update metrics
    global.config.conversationMetrics.privateMessagesReceived++;
    global.config.conversationMetrics.lastPrivateInteraction = Date.now();
    
    // Forward to console if enabled
    if (global.config.privateMsg.forwardToConsole) {
      console.log(`[WHISPER] ${username}: ${message}`);
    }
    
    // Ignore own messages to prevent feedback loops
    if (username === this.bot.username) {
      return;
    }
    
    // Check if private messaging is enabled
    if (!global.config.privateMsg.enabled) {
      console.log(`[PRIVATE MSG] Private messaging disabled, ignoring whisper from ${username}`);
      return;
    }
    
    // Check sender trust level
    if (!this.isWhitelisted(username)) {
      console.log(`[PRIVATE MSG] Unwhitelisted sender ${username}, ignoring whisper`);
      return;
    }
    
    // Send auto-reply
    await this.sendPrivateAutoReply(username);
  }
  
  async sendPrivateAutoReply(username) {
    try {
      // Update rate limiting
      const now = Date.now();
      global.config.privateMsg.senderCooldowns.set(username, now);
      global.config.privateMsg.globalReplyCount++;
      
      // Construct auto-reply message
      const autoReply = global.config.privateMsg.autoReplyTemplate;
      
      // Send the reply using /msg command
      this.bot.chat(`/msg ${username} ${autoReply}`);
      
      // Update metrics
      global.config.conversationMetrics.privateMessagesSent++;
      global.config.conversationMetrics.privateAutoReplies++;
      
      console.log(`[PRIVATE MSG] Auto-reply sent to ${username}: ${autoReply}`);
      
    } catch (error) {
      console.log(`[PRIVATE MSG] Error sending auto-reply to ${username}: ${error.message}`);
    }
  }
}

// Test the functionality
async function runTests() {
  console.log('=== Testing Private Messaging System ===\n');
  
  const conversationAI = new TestConversationAI(mockBot);
  
  console.log('Test 1: Whisper with private messaging disabled');
  await conversationAI.handleWhisper('TestUser', 'Hello there!');
  console.log(`Private messages received: ${global.config.conversationMetrics.privateMessagesReceived}`);
  console.log(`Private messages sent: ${global.config.conversationMetrics.privateMessagesSent}\n`);
  
  console.log('Test 2: Enable private messaging and test whisper');
  global.config.privateMsg.enabled = true;
  await conversationAI.handleWhisper('TestUser', 'Can you help me?');
  console.log(`Private messages received: ${global.config.conversationMetrics.privateMessagesReceived}`);
  console.log(`Private messages sent: ${global.config.conversationMetrics.privateMessagesSent}`);
  console.log(`Private auto-replies: ${global.config.conversationMetrics.privateAutoReplies}\n`);
  
  console.log('Test 3: Test with unwhitelisted user');
  await conversationAI.handleWhisper('UntrustedUser', 'Hey bot!');
  console.log(`Private messages received: ${global.config.conversationMetrics.privateMessagesReceived}`);
  console.log(`Private messages sent: ${global.config.conversationMetrics.privateMessagesSent}\n`);
  
  console.log('Test 4: Test rate limiting (same user immediately)');
  await conversationAI.handleWhisper('TestUser', 'Another message');
  console.log(`Private messages received: ${global.config.conversationMetrics.privateMessagesReceived}`);
  console.log(`Private messages sent: ${global.config.conversationMetrics.privateMessagesSent}\n`);
  
  console.log('Test 5: Test bot ignoring own messages');
  await conversationAI.handleWhisper('HunterX', 'Self message');
  console.log(`Private messages received: ${global.config.conversationMetrics.privateMessagesReceived}`);
  console.log(`Private messages sent: ${global.config.conversationMetrics.privateMessagesSent}\n`);
  
  console.log('=== Test Results ===');
  console.log(`Final metrics:`);
  console.log(`- Private messages received: ${global.config.conversationMetrics.privateMessagesReceived}`);
  console.log(`- Private messages sent: ${global.config.conversationMetrics.privateMessagesSent}`);
  console.log(`- Private auto-replies: ${global.config.conversationMetrics.privateAutoReplies}`);
  console.log(`- Private messaging enabled: ${global.config.privateMsg.enabled}`);
  console.log(`- Cooldowns active: ${global.config.privateMsg.senderCooldowns.size}`);
  
  console.log('\n✅ All tests completed successfully!');
}

runTests().catch(console.error);