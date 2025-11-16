#!/usr/bin/env node

/**
 * Ghost Bots Fix Test Script
 * 
 * This script tests the fixes for spawned bot responsiveness.
 * Run this after implementing the ghost bots fixes to validate they work.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 GHOST BOTS FIX VALIDATION');
console.log('=====================================\n');

// Test 1: Check if BotSpawner enhancements exist
console.log('📋 Test 1: BotSpawner Initialization Methods');
try {
  const hunterXPath = path.join(__dirname, 'HunterX.js');
  const hunterXContent = fs.readFileSync(hunterXPath, 'utf8');
  
  const hasInitializeSpawnedBot = hunterXContent.includes('initializeSpawnedBot(bot, username, mode)');
  const hasHandleGroupCommand = hunterXContent.includes('handleGroupCommand(bot, message, senderUsername)');
  const hasRegisterBotsWithSwarm = hunterXContent.includes('registerBotsWithSwarmCoordinator()');
  
  if (hasInitializeSpawnedBot && hasHandleGroupCommand && hasRegisterBotsWithSwarm) {
    console.log('✅ BotSpawner enhancements found');
    console.log('   - initializeSpawnedBot method: ✅');
    console.log('   - handleGroupCommand method: ✅');
    console.log('   - registerBotsWithSwarmCoordinator method: ✅');
  } else {
    console.log('❌ BotSpawner enhancements missing');
    console.log('   - initializeSpawnedBot method:', hasInitializeSpawnedBot ? '✅' : '❌');
    console.log('   - handleGroupCommand method:', hasHandleGroupCommand ? '✅' : '❌');
    console.log('   - registerBotsWithSwarmCoordinator method:', hasRegisterBotsWithSwarm ? '✅' : '❌');
  }
} catch (error) {
  console.log('❌ Error checking BotSpawner:', error.message);
}

console.log('');

// Test 2: Check SwarmCoordinator broadcast fixes
console.log('📋 Test 2: SwarmCoordinator Command Broadcasting');
try {
  const hunterXPath = path.join(__dirname, 'HunterX.js');
  const hunterXContent = fs.readFileSync(hunterXPath, 'utf8');
  
  const hasEnhancedBroadcast = hunterXContent.includes('Also send to direct spawned bots');
  const hasGlobalBotSpawnerCheck = hunterXContent.includes('if (globalBotSpawner)');
  const hasActiveBotsCheck = hunterXContent.includes('if (typeof activeBots !== \'undefined\')');
  const hasBotEmit = hunterXContent.includes('bot.emit(\'chat\', \'system\', `!!${command}`)');
  
  if (hasEnhancedBroadcast && hasGlobalBotSpawnerCheck && hasActiveBotsCheck && hasBotEmit) {
    console.log('✅ SwarmCoordinator broadcast enhancements found');
    console.log('   - Direct bot broadcasting: ✅');
    console.log('   - Global bot spawner check: ✅');
    console.log('   - Active bots check: ✅');
    console.log('   - Bot emit mechanism: ✅');
  } else {
    console.log('❌ SwarmCoordinator broadcast enhancements missing');
    console.log('   - Direct bot broadcasting:', hasEnhancedBroadcast ? '✅' : '❌');
    console.log('   - Global bot spawner check:', hasGlobalBotSpawnerCheck ? '✅' : '❌');
    console.log('   - Active bots check:', hasActiveBotsCheck ? '✅' : '❌');
    console.log('   - Bot emit mechanism:', hasBotEmit ? '✅' : '❌');
  }
} catch (error) {
  console.log('❌ Error checking SwarmCoordinator:', error.message);
}

console.log('');

// Test 3: Check proxy warnings
console.log('📋 Test 3: Proxy Configuration Warnings');
try {
  const hunterXPath = path.join(__dirname, 'HunterX.js');
  const hunterXContent = fs.readFileSync(hunterXPath, 'utf8');
  
  const hasProxyWarning = hunterXContent.includes('WARNING: Spawning');
  const hasRateLimitWarning = hunterXContent.includes('server rate limiting or bans');
  const hasSetupSuggestion = hunterXContent.includes('Configure proxies with');
  
  if (hasProxyWarning && hasRateLimitWarning && hasSetupSuggestion) {
    console.log('✅ Proxy warnings implemented');
    console.log('   - Multiple bot warning: ✅');
    console.log('   - Rate limit warning: ✅');
    console.log('   - Setup suggestion: ✅');
  } else {
    console.log('❌ Proxy warnings missing');
    console.log('   - Multiple bot warning:', hasProxyWarning ? '✅' : '❌');
    console.log('   - Rate limit warning:', hasRateLimitWarning ? '✅' : '❌');
    console.log('   - Setup suggestion:', hasSetupSuggestion ? '✅' : '❌');
  }
} catch (error) {
  console.log('❌ Error checking proxy warnings:', error.message);
}

console.log('');

// Test 4: Check test command
console.log('📋 Test 4: Test Command Implementation');
try {
  const hunterXPath = path.join(__dirname, 'HunterX.js');
  const hunterXContent = fs.readFileSync(hunterXPath, 'utf8');
  
  const hasTestCommand = hunterXContent.includes('!test') && hunterXContent.includes('bot');
  const hasTestBotCount = hunterXContent.includes('getActiveBotCount() === 0');
  const hasTestBroadcast = hunterXContent.includes('broadcastCommand("stop")');
  
  if (hasTestCommand && hasTestBotCount && hasTestBroadcast) {
    console.log('✅ Test command implemented');
    console.log('   - Command detection: ✅');
    console.log('   - Bot count check: ✅');
    console.log('   - Test broadcast: ✅');
  } else {
    console.log('❌ Test command missing');
    console.log('   - Command detection:', hasTestCommand ? '✅' : '❌');
    console.log('   - Bot count check:', hasTestBotCount ? '✅' : '❌');
    console.log('   - Test broadcast:', hasTestBroadcast ? '✅' : '❌');
  }
} catch (error) {
  console.log('❌ Error checking test command:', error.message);
}

console.log('');

// Test 5: Check attack command enhancements
console.log('📋 Test 5: Attack Command Enhancements');
try {
  const hunterXPath = path.join(__dirname, 'HunterX.js');
  const hunterXContent = fs.readFileSync(hunterXPath, 'utf8');
  
  const hasFallbackMovement = hunterXContent.includes('Fallback: Try to move towards target');
  const hasCommandBroadcast = hunterXContent.includes('broadcastCommand(`attack ${targetPlayer}`)');
  const hasPathfinderGoto = hunterXContent.includes('goto(new goals.GoalNear(target.position, 2))');
  
  if (hasFallbackMovement && hasCommandBroadcast && hasPathfinderGoto) {
    console.log('✅ Attack command enhancements found');
    console.log('   - Fallback movement: ✅');
    console.log('   - Command broadcast: ✅');
    console.log('   - Pathfinder goto: ✅');
  } else {
    console.log('❌ Attack command enhancements missing');
    console.log('   - Fallback movement:', hasFallbackMovement ? '✅' : '❌');
    console.log('   - Command broadcast:', hasCommandBroadcast ? '✅' : '❌');
    console.log('   - Pathfinder goto:', hasPathfinderGoto ? '✅' : '❌');
  }
} catch (error) {
  console.log('❌ Error checking attack command:', error.message);
}

console.log('');

// Summary
console.log('📊 SUMMARY');
console.log('===========');
console.log('Run these commands in-game to test the fixes:');
console.log('');
console.log('1. Spawn bots (should show proxy warnings):');
console.log('   !spawn 5 bots');
console.log('');
console.log('2. Test bot responsiveness:');
console.log('   !test bot');
console.log('');
console.log('3. Test attack command (should make bots move):');
console.log('   !!attack playername');
console.log('');
console.log('4. Test movement command:');
console.log('   !!goto 100 64 200');
console.log('');
console.log('5. Check swarm status:');
console.log('   !swarm status');
console.log('');
console.log('Expected results:');
console.log('✅ Bots spawn with full initialization');
console.log('✅ Proxy warnings appear for multiple bots');
console.log('✅ Group commands reach spawned bots');
console.log('✅ Bots move when commanded');
console.log('✅ No more "ghost" bots');
console.log('');
console.log('📝 See GHOST_BOTS_FIX.md for detailed documentation.');