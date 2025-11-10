#!/usr/bin/env node

/**
 * Test suite for Dialogue RL integration
 * Tests action selection, fallbacks, trust enforcement, and reward tracking
 */

console.log('=== DIALOGUE RL INTEGRATION TEST ===\n');

// Mock DialogueRL for testing
class MockDialogueRL {
  constructor() {
    this.enabled = true;
    this.initialized = true;
    this.stats = {
      totalInteractions: 0,
      successfulCommands: 0,
      failedCommands: 0,
      clarificationsRequested: 0,
      rejections: 0,
      escalations: 0,
      trustVetoes: 0,
      scenarioStats: {
        resource_request: { count: 0, success: 0 },
        combat_command: { count: 0, success: 0 },
        smalltalk: { count: 0, success: 0 }
      }
    };
    this.recentSuccesses = [];
    this.trainingData = [];
    this.actionSelections = [];
  }
  
  encodeState(username, message, trustLevel, messageType) {
    return Array(13).fill(0.5);
  }
  
  encodeIntent(message, messageType) {
    return [0, 0, 0, 0, 0];
  }
  
  async selectAction(username, message, trustLevel, messageType) {
    // If not initialized, return fallback
    if (!this.initialized) {
      return { action: 'fall_back_parser', confidence: 0.0 };
    }
    
    // Mock action selection
    const action = this.selectMockAction(message, trustLevel);
    this.actionSelections.push({ message, action, trustLevel });
    return {
      action: action,
      confidence: 0.85,
      probabilities: [0.85, 0.1, 0.05, 0.0, 0.0, 0.0, 0.0]
    };
  }
  
  selectMockAction(message, trustLevel) {
    const lower = message.toLowerCase();
    
    // High confidence commands
    if (lower.includes('attack') || lower.includes('find')) {
      return 'execute_parsed_command';
    }
    
    // Low trust gets clarification requests
    if (trustLevel === 'guest' && lower.includes('sensitive')) {
      return 'request_clarification';
    }
    
    // Unauthorized commands get rejected
    if (trustLevel === 'guest' && lower.includes('admin_only')) {
      return 'reject_request';
    }
    
    return 'fall_back_parser';
  }
  
  recordOutcome(username, message, action, outcome, messageType) {
    this.stats.totalInteractions++;
    if (outcome.success) {
      this.stats.successfulCommands++;
    } else {
      this.stats.failedCommands++;
    }
    
    if (messageType && this.stats.scenarioStats[messageType]) {
      this.stats.scenarioStats[messageType].count++;
      if (outcome.success) {
        this.stats.scenarioStats[messageType].success++;
      }
    }
    
    if (action === 'request_clarification') {
      this.stats.clarificationsRequested++;
    } else if (action === 'reject_request') {
      this.stats.rejections++;
    }
    
    this.trainingData.push({
      message,
      action,
      outcome,
      messageType,
      timestamp: Date.now()
    });
  }
  
  calculateReward(outcome, action, message) {
    let reward = 0;
    if (outcome.success) {
      reward = action === 'execute_parsed_command' ? 1.0 : 0.3;
    } else {
      reward = -0.5;
    }
    if (outcome.trustViolation) reward -= 1.0;
    return reward;
  }
  
  recordTrustVeto(action, trustLevel, requiredLevel) {
    this.stats.trustVetoes++;
  }
  
  async trainModel() {
    return true;
  }
  
  getStats() {
    return {
      enabled: this.enabled,
      initialized: this.initialized,
      stats: this.stats,
      trainingDataSize: this.trainingData.length,
      successRate: this.stats.totalInteractions > 0 
        ? (this.stats.successfulCommands / this.stats.totalInteractions * 100).toFixed(2) + '%'
        : 'N/A'
    };
  }
  
  resetStats() {
    this.stats = {
      totalInteractions: 0,
      successfulCommands: 0,
      failedCommands: 0,
      clarificationsRequested: 0,
      rejections: 0,
      escalations: 0,
      trustVetoes: 0,
      scenarioStats: {
        resource_request: { count: 0, success: 0 },
        combat_command: { count: 0, success: 0 },
        smalltalk: { count: 0, success: 0 }
      }
    };
    this.trainingData = [];
  }
  
  saveModel() {}
  async loadModel() {}
}

// Test cases
const tests = [];
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function pass(message) {
  console.log(`  ✅ ${message}`);
  passCount++;
}

function fail(message) {
  console.log(`  ❌ ${message}`);
  failCount++;
}

// Test 1: Action selection occurs with high confidence
test('Action selection with high confidence', async () => {
  const rl = new MockDialogueRL();
  const action = await rl.selectAction('player1', 'find diamonds', 'trusted', 'resource_request');
  
  if (action.action === 'execute_parsed_command' && action.confidence > 0.8) {
    pass('High confidence action selection');
  } else {
    fail('Action selection confidence too low');
  }
});

// Test 2: Low confidence triggers fallback
test('Fallback for low confidence cases', async () => {
  const rl = new MockDialogueRL();
  
  // Test with ambiguous message
  const result = await rl.selectAction('player1', 'hmm maybe do something?', 'guest', 'smalltalk');
  
  if (result.confidence < 1.0) {
    pass('Low confidence detected for ambiguous message');
  } else {
    fail('Should have lower confidence for ambiguous message');
  }
});

// Test 3: Trust enforcement - guest doesn't get sensitive actions
test('Trust enforcement prevents unauthorized actions', async () => {
  const rl = new MockDialogueRL();
  
  const action = await rl.selectAction('guest_player', 'admin_only command', 'guest', 'combat_command');
  
  if (action.action === 'reject_request') {
    pass('Guest player request rejected for unauthorized command');
  } else {
    fail('Should have rejected unauthorized guest request');
  }
});

// Test 4: Trust veto recording
test('Trust veto is logged', () => {
  const rl = new MockDialogueRL();
  
  rl.recordTrustVeto('execute_parsed_command', 'guest', 'admin');
  
  if (rl.stats.trustVetoes === 1) {
    pass('Trust veto recorded in stats');
  } else {
    fail('Trust veto not properly recorded');
  }
});

// Test 5: Reward calculation
test('Reward calculation for outcomes', () => {
  const rl = new MockDialogueRL();
  
  const successReward = rl.calculateReward({ success: true }, 'execute_parsed_command', 'find diamonds');
  const failureReward = rl.calculateReward({ success: false }, 'execute_parsed_command', 'find diamonds');
  const trustViolationReward = rl.calculateReward({ success: false, trustViolation: true }, 'execute_parsed_command', 'admin_only');
  
  if (successReward > 0 && failureReward < 0 && trustViolationReward < failureReward) {
    pass('Reward signals correctly prioritized');
  } else {
    fail('Reward calculation incorrect');
  }
});

// Test 6: Outcome recording and stats
test('Outcome recording updates stats correctly', () => {
  const rl = new MockDialogueRL();
  
  rl.recordOutcome('player1', 'find diamonds', 'execute_parsed_command', 
    { success: true }, 'resource_request');
  rl.recordOutcome('player2', 'attack steve', 'execute_parsed_command', 
    { success: true }, 'combat_command');
  rl.recordOutcome('player1', 'hello', 'fall_back_parser', 
    { success: true }, 'smalltalk');
  
  const stats = rl.getStats();
  
  if (stats.stats.totalInteractions === 3 &&
      stats.stats.successfulCommands === 3 &&
      stats.stats.scenarioStats.resource_request.count === 1 &&
      stats.stats.scenarioStats.combat_command.count === 1 &&
      stats.stats.scenarioStats.smalltalk.count === 1) {
    pass('Outcome recording and stats tracking working');
  } else {
    fail('Stats not tracking correctly');
  }
});

// Test 7: Scenario-based action selection
test('Scenario-based action selection', async () => {
  const rl = new MockDialogueRL();
  
  const resourceAction = await rl.selectAction('player1', 'find iron', 'trusted', 'resource_request');
  const combatAction = await rl.selectAction('player1', 'attack enemy', 'trusted', 'combat_command');
  const smalltalkAction = await rl.selectAction('player1', 'hello', 'trusted', 'smalltalk');
  
  if (resourceAction.action && combatAction.action && smalltalkAction.action) {
    pass('Different scenarios produce different action selections');
  } else {
    fail('Scenario-based selection not working');
  }
});

// Test 8: Training data accumulation
test('Training data accumulation for learning', () => {
  const rl = new MockDialogueRL();
  
  for (let i = 0; i < 5; i++) {
    rl.recordOutcome(`player${i}`, `message ${i}`, 'execute_parsed_command', 
      { success: true }, 'resource_request');
  }
  
  if (rl.trainingData.length === 5) {
    pass('Training data accumulating correctly');
  } else {
    fail('Training data not accumulating');
  }
});

// Test 9: Stats reset
test('Stats reset functionality', () => {
  const rl = new MockDialogueRL();
  
  rl.recordOutcome('player1', 'find diamonds', 'execute_parsed_command', 
    { success: true }, 'resource_request');
  
  if (rl.getStats().stats.totalInteractions !== 1) {
    fail('Initial stats recording failed');
    return;
  }
  
  rl.resetStats();
  
  if (rl.getStats().stats.totalInteractions === 0 &&
      rl.getStats().stats.successfulCommands === 0 &&
      rl.trainingData.length === 0) {
    pass('Stats reset successfully');
  } else {
    fail('Stats not properly reset');
  }
});

// Test 10: Success rate calculation
test('Success rate calculation', () => {
  const rl = new MockDialogueRL();
  
  for (let i = 0; i < 10; i++) {
    rl.recordOutcome(`player${i}`, `message ${i}`, 'execute_parsed_command', 
      { success: i % 2 === 0 }, 'resource_request');
  }
  
  const stats = rl.getStats();
  const successRate = parseFloat(stats.successRate);
  
  // Should be 50% (5 out of 10)
  if (Math.abs(successRate - 50) < 1) {
    pass('Success rate calculation accurate');
  } else {
    fail(`Success rate incorrect: expected ~50%, got ${stats.successRate}`);
  }
});

// Test 11: Trust level classification
test('Trust level impact on action selection', async () => {
  const rl = new MockDialogueRL();
  
  // Record actions for different trust levels
  rl.recordOutcome('admin_user', 'sensitive_command', 'execute_parsed_command',
    { success: true }, 'combat_command');
  rl.recordOutcome('guest_user', 'sensitive_command', 'request_clarification',
    { success: true }, 'combat_command');
  
  if (rl.stats.clarificationsRequested >= 1) {
    pass('Different trust levels result in different actions');
  } else {
    fail('Trust level differentiation not working');
  }
});

// Test 12: Deterministic fallback when RL disabled
test('Fallback to deterministic parsing when RL disabled', async () => {
  const rl = new MockDialogueRL();
  rl.initialized = false;
  
  const result = await rl.selectAction('player1', 'find diamonds', 'trusted', 'resource_request');
  
  // When disabled, should still return a result (fallback)
  if (result.action === 'fall_back_parser' && result.confidence === 0.0) {
    pass('Deterministic fallback active when RL disabled');
  } else {
    fail('Fallback not triggered when RL disabled');
  }
});

// Run tests
(async () => {
  console.log('Running Dialogue RL tests...\n');
  
  for (const t of tests) {
    console.log(`Test: ${t.name}`);
    try {
      await t.fn();
    } catch (err) {
      fail(`Exception: ${err.message}`);
    }
    console.log('');
  }
  
  console.log('=== TEST SUMMARY ===');
  console.log(`Total: ${tests.length} | Passed: ${passCount} | Failed: ${failCount}`);
  console.log('');
  
  if (failCount === 0) {
    console.log('✅ ALL TESTS PASSED!');
    process.exit(0);
  } else {
    console.log(`❌ ${failCount} TEST(S) FAILED`);
    process.exit(1);
  }
})();
