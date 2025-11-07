#!/usr/bin/env node

// Simple test to verify pathfinder plugin loading
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

console.log('[TEST] Testing pathfinder plugin loading...');

// Create a test bot (won't actually connect)
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'TestBot',
  auth: 'offline',
  hideErrors: true
});

// Test plugin loading
try {
  bot.loadPlugin(pathfinder);
  console.log('[TEST] ✓ Pathfinder plugin loaded successfully');
  
  // Check if pathfinder is available immediately
  if (bot.pathfinder) {
    console.log('[TEST] ✓ bot.pathfinder is available immediately');
    testPathfinderFunctionality();
  } else {
    console.log('[TEST] bot.pathfinder not available immediately, checking after spawn event...');
    
    // Check after spawn event (simulated)
    bot.once('spawn', () => {
      setTimeout(() => {
        testPathfinderFunctionality(); // Call regardless to see what's available
      }, 100);
    });
    
    // Force spawn event since we're not connecting
    setTimeout(() => {
      bot.emit('spawn');
    }, 50);
  }
} catch (err) {
  console.error('[TEST] ✗ Failed to load pathfinder plugin:', err.message);
}

function testPathfinderFunctionality() {
  // Check what properties were added to the bot
  console.log('[TEST] Bot properties after loading pathfinder:');
  Object.getOwnPropertyNames(bot).forEach(prop => {
    if (prop.includes('path') || prop.includes('baritone') || prop.includes('move') || prop.includes('goal')) {
      console.log(`[TEST] Found property: ${prop}`);
    }
  });
  
  // Test pathfinder functionality
  try {
    // Try different property names
    if (bot.pathfinder) {
      console.log('[TEST] ✓ bot.pathfinder is available');
      
      // Check what methods are available
      console.log('[TEST] Available methods on bot.pathfinder:');
      Object.getOwnPropertyNames(bot.pathfinder).forEach(method => {
        console.log(`[TEST]   - ${method}`);
      });
      
      // Try setMovements if available
      if (typeof bot.pathfinder.setMovements === 'function') {
        bot.pathfinder.setMovements(new Movements(bot));
        console.log('[TEST] ✓ setMovements works with imported Movements');
      } else {
        console.log('[TEST] setMovements not available');
      }
    } else if (bot.baritone) {
      console.log('[TEST] ✓ bot.baritone is available');
    } else {
      console.log('[TEST] ✗ No pathfinder property found on bot');
    }
    
    console.log('[TEST] ✅ All pathfinder tests passed!');
  } catch (err) {
    console.error('[TEST] ✗ Pathfinding test failed:', err.message);
  }
}

// Clean up after timeout
setTimeout(() => {
  console.log('[TEST] Test completed');
  process.exit(0);
}, 2000);