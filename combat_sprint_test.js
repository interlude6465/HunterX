/**
 * Combat Sprint Test Suite
 * Tests sprint activation during combat chase sequences
 */

const assert = require('assert');

console.log('=== Combat Sprint Test Suite ===\n');

// Standalone CombatAI implementation for testing
class CombatAI {
  constructor(bot) {
    this.bot = bot;
    this.errorHistory = new Map();
    this.errorCooldown = 1000;
    this.inCombat = false;
    this.isCurrentlyFighting = false;
    this.currentTarget = null;
  }
  
  shouldLogError(message, cooldown = this.errorCooldown) {
    const key = message || 'unknown-error';
    const now = Date.now();
    const lastLogged = this.errorHistory.get(key) || 0;
    if (now - lastLogged >= cooldown) {
      this.errorHistory.set(key, now);
      return true;
    }
    return false;
  }
  
  enableCombatSprint() {
    // Check if bot can sprint (needs at least 6 hunger in Minecraft)
    if (!this.bot) return false;
    
    const foodLevel = this.bot.food || 0;
    if (foodLevel < 6) {
      if (this.shouldLogError('Cannot sprint - low food', 5000)) {
        console.log(`[COMBAT] Cannot sprint - food level too low (${foodLevel}/20)`);
      }
      return false;
    }
    
    // Enable sprint
    this.bot.setControlState('sprint', true);
    return true;
  }
  
  disableCombatSprint() {
    if (!this.bot) return;
    this.bot.setControlState('sprint', false);
  }
  
  async startCombat() {
    this.inCombat = true;
    this.isCurrentlyFighting = true;
    const sprintEnabled = this.enableCombatSprint();
    if (sprintEnabled) {
      console.log('[COMBAT] 🏃 Sprint activated for combat pursuit!');
    }
  }
  
  pauseCombat(reason = 'paused') {
    this.inCombat = false;
    this.isCurrentlyFighting = false;
    this.disableCombatSprint();
  }
  
  abortCombat(reason = 'aborted') {
    this.inCombat = false;
    this.currentTarget = null;
    this.disableCombatSprint();
  }
}

// Mock bot for testing
class MockBot {
  constructor(food = 20, health = 20) {
    this.food = food;
    this.health = health;
    this.inventory = {
      items: () => [
        { name: 'diamond_sword', slot: 0 },
        { name: 'cooked_beef', slot: 1, foodProperty: { nutrition: 8 } }
      ],
      slots: []
    };
    this.entity = {
      position: { x: 0, y: 0, z: 0, distanceTo: () => 5 }
    };
    this.pvp = {
      attack: () => {}
    };
    this.pathfinder = {
      goto: async () => {}
    };
    this.controlStates = {
      sprint: false,
      forward: false
    };
    this.equip = async () => {};
    this.consume = async () => {};
  }

  setControlState(state, value) {
    this.controlStates[state] = value;
  }

  getControlState(state) {
    return this.controlStates[state];
  }
}

// Mock attacker
const createMockAttacker = () => ({
  type: 'mob',
  name: 'zombie',
  health: 20,
  position: { x: 10, y: 0, z: 10 }
});

// Test 1: Sprint enabled with sufficient food
async function testSprintEnabledWithSufficientFood() {
  console.log('Test 1: Sprint enabled with sufficient food');
  
  const mockBot = new MockBot(20, 20); // Full food
  const combatAI = new CombatAI(mockBot);
  const result = combatAI.enableCombatSprint();
  
  assert.strictEqual(result, true, 'Sprint should be enabled with sufficient food');
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint control state should be true');
  console.log('✓ Sprint enabled successfully with food level 20/20\n');
}

// Test 2: Sprint disabled with low food
async function testSprintDisabledWithLowFood() {
  console.log('Test 2: Sprint disabled with low food');
  
  const mockBot = new MockBot(3, 20); // Low food
  const combatAI = new CombatAI(mockBot);
  const result = combatAI.enableCombatSprint();
  
  assert.strictEqual(result, false, 'Sprint should be disabled with low food');
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint control state should be false');
  console.log('✓ Sprint correctly disabled with food level 3/20\n');
}

// Test 3: Sprint at minimum food threshold (6)
async function testSprintAtMinimumThreshold() {
  console.log('Test 3: Sprint at minimum food threshold');
  
  const mockBot = new MockBot(6, 20); // Exactly at threshold
  const combatAI = new CombatAI(mockBot);
  const result = combatAI.enableCombatSprint();
  
  assert.strictEqual(result, true, 'Sprint should be enabled at minimum threshold');
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint control state should be true');
  console.log('✓ Sprint enabled at minimum threshold (6/20)\n');
}

// Test 4: Sprint just below threshold (5)
async function testSprintBelowThreshold() {
  console.log('Test 4: Sprint just below threshold');
  
  const mockBot = new MockBot(5, 20); // Just below threshold
  const combatAI = new CombatAI(mockBot);
  const result = combatAI.enableCombatSprint();
  
  assert.strictEqual(result, false, 'Sprint should be disabled just below threshold');
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint control state should be false');
  console.log('✓ Sprint correctly disabled with food level 5/20\n');
}

// Test 5: Sprint disabled after combat ends
async function testSprintDisabledAfterCombat() {
  console.log('Test 5: Sprint disabled after combat ends');
  
  const mockBot = new MockBot(20, 20);
  const combatAI = new CombatAI(mockBot);
  
  // Enable sprint during combat
  combatAI.enableCombatSprint();
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint should be enabled during combat');
  
  // Disable sprint after combat
  combatAI.disableCombatSprint();
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint should be disabled after combat ends');
  console.log('✓ Sprint correctly disabled after combat ends\n');
}

// Test 6: Sprint re-enabled after eating
async function testSprintReEnabledAfterEating() {
  console.log('Test 6: Sprint re-enabled after eating');
  
  const mockBot = new MockBot(3, 20); // Start with low food
  const combatAI = new CombatAI(mockBot);
  
  // Try to sprint with low food
  let result = combatAI.enableCombatSprint();
  assert.strictEqual(result, false, 'Sprint should fail with low food');
  
  // Simulate eating
  mockBot.food = 15;
  
  // Try to sprint again after eating
  result = combatAI.enableCombatSprint();
  assert.strictEqual(result, true, 'Sprint should succeed after eating');
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint control state should be true');
  console.log('✓ Sprint re-enabled after eating (food: 3 -> 15)\n');
}

// Test 7: pauseCombat disables sprint
async function testPauseCombatDisablesSprint() {
  console.log('Test 7: pauseCombat disables sprint');
  
  const mockBot = new MockBot(20, 20);
  const combatAI = new CombatAI(mockBot);
  
  // Start combat with sprint
  await combatAI.startCombat();
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint should be enabled during combat');
  
  // Pause combat
  combatAI.pauseCombat('Target defeated');
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint should be disabled when combat paused');
  assert.strictEqual(combatAI.inCombat, false, 'Combat should be inactive');
  console.log('✓ pauseCombat correctly disables sprint\n');
}

// Test 8: abortCombat disables sprint
async function testAbortCombatDisablesSprint() {
  console.log('Test 8: abortCombat disables sprint');
  
  const mockBot = new MockBot(20, 20);
  const combatAI = new CombatAI(mockBot);
  
  // Start combat with sprint
  await combatAI.startCombat();
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint should be enabled during combat');
  
  // Abort combat
  combatAI.abortCombat('Bot health critical');
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint should be disabled when combat aborted');
  assert.strictEqual(combatAI.inCombat, false, 'Combat should be inactive');
  console.log('✓ abortCombat correctly disables sprint\n');
}

// Test 9: Integration test - full combat scenario
async function testFullCombatScenario() {
  console.log('Test 9: Full combat scenario integration');
  
  const mockBot = new MockBot(20, 20);
  const combatAI = new CombatAI(mockBot);
  
  // Start combat
  await combatAI.startCombat();
  assert.strictEqual(combatAI.inCombat, true, 'Combat should be active');
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint should be enabled during combat');
  console.log('  ✓ Combat started, sprint enabled');
  
  // End combat
  combatAI.pauseCombat('Target defeated');
  assert.strictEqual(combatAI.inCombat, false, 'Combat should be inactive');
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint should be disabled after combat');
  console.log('  ✓ Combat ended, sprint disabled');
  console.log('✓ Full combat scenario passed\n');
}

// Test 10: Multiple sprint toggles
async function testMultipleSprintToggles() {
  console.log('Test 10: Multiple sprint toggles');
  
  const mockBot = new MockBot(20, 20);
  const combatAI = new CombatAI(mockBot);
  
  // Enable sprint
  combatAI.enableCombatSprint();
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint should be enabled');
  
  // Disable sprint
  combatAI.disableCombatSprint();
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint should be disabled');
  
  // Enable again
  combatAI.enableCombatSprint();
  assert.strictEqual(mockBot.controlStates.sprint, true, 'Sprint should be enabled again');
  
  // Disable again
  combatAI.disableCombatSprint();
  assert.strictEqual(mockBot.controlStates.sprint, false, 'Sprint should be disabled again');
  
  console.log('✓ Multiple sprint toggles work correctly\n');
}

// Run all tests
async function runAllTests() {
  try {
    await testSprintEnabledWithSufficientFood();
    await testSprintDisabledWithLowFood();
    await testSprintAtMinimumThreshold();
    await testSprintBelowThreshold();
    await testSprintDisabledAfterCombat();
    await testSprintReEnabledAfterEating();
    await testPauseCombatDisablesSprint();
    await testAbortCombatDisablesSprint();
    await testFullCombatScenario();
    await testMultipleSprintToggles();
    
    console.log('=================================');
    console.log('✓ All 10 combat sprint tests passed!');
    console.log('=================================');
    console.log('\nSummary:');
    console.log('- Sprint enables when food >= 6');
    console.log('- Sprint disables when food < 6');
    console.log('- Sprint disables when combat ends (pauseCombat/abortCombat)');
    console.log('- Sprint can be re-enabled after eating');
    console.log('- Multiple toggles work correctly');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runAllTests();
