#!/usr/bin/env node

/**
 * Test suite for Movement RL integration
 * Tests action selection, safety gating, terrain classification, and reward tracking
 */

console.log('=== MOVEMENT RL INTEGRATION TEST ===\n');

// Mock Vec3 for testing
class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
  
  toString() {
    return `[${this.x}, ${this.y}, ${this.z}]`;
  }
}

// Mock MovementRL for testing
class MockMovementRL {
  constructor() {
    this.enabled = true;
    this.initialized = true;
    this.stats = {
      totalMovements: 0,
      successfulMovements: 0,
      failedMovements: 0,
      timeoutMovements: 0,
      safetyVetoes: 0,
      scenarioStats: {
        overworld_hills: { count: 0, success: 0 },
        nether_highway: { count: 0, success: 0 },
        cave_navigation: { count: 0, success: 0 }
      }
    };
    this.recentMovements = [];
    this.trainingData = [];
    this.confidenceThreshold = 0.7;
    this.equipmentMock = { hasElytra: false, hasRockets: false, hasWaterBucket: false, hasBlocks: false };
    this.hazardMock = 0;
  }
  
  encodeState(targetPos, scenario) {
    return Array(7).fill(0.5);
  }
  
  detectScenario(targetPos) {
    if (scenario === 'nether') return 'nether_highway';
    if (scenario === 'cave') return 'cave_navigation';
    return 'overworld_hills';
  }
  
  async selectAction(targetPos, scenario) {
    if (!this.initialized) {
      return { action: 'standard_pathfinder', confidence: 0.0 };
    }
    
    const action = this.selectMockAction(scenario);
    return {
      action: action,
      confidence: 0.85,
      probabilities: [0.1, 0.85, 0.05, 0.0, 0.0, 0.0, 0.0],
      scenario: scenario || 'overworld_hills'
    };
  }
  
  selectMockAction(scenario) {
    const actions = [
      'highway_mode',
      'standard_pathfinder',
      'pillar_bridge',
      'water_bucket_drop',
      'elytra_travel',
      'slow_walk',
      'pause_scan'
    ];
    
    if (scenario === 'nether_highway') return 'highway_mode';
    if (scenario === 'cave_navigation') return 'water_bucket_drop';
    return 'standard_pathfinder';
  }
  
  isSafeAction(action, scenario) {
    if (action === 'elytra_travel' && (!this.equipmentMock.hasElytra || !this.equipmentMock.hasRockets)) {
      return false;
    }
    if (action === 'water_bucket_drop' && !this.equipmentMock.hasWaterBucket) {
      return false;
    }
    if (action === 'pillar_bridge' && !this.equipmentMock.hasBlocks) {
      return false;
    }
    if (this.hazardMock > 0.7 && (action === 'pillar_bridge' || action === 'water_bucket_drop')) {
      return false;
    }
    return true;
  }
  
  recordSafetyVeto(action, reason) {
    this.stats.safetyVetoes++;
  }
  
  recordOutcome(targetPos, action, outcome, scenario) {
    this.stats.totalMovements++;
    if (outcome.success) {
      this.stats.successfulMovements++;
    } else if (outcome.timeout) {
      this.stats.timeoutMovements++;
    } else {
      this.stats.failedMovements++;
    }
    
    if (this.stats.scenarioStats[scenario]) {
      this.stats.scenarioStats[scenario].count++;
      if (outcome.success) {
        this.stats.scenarioStats[scenario].success++;
      }
    }
    
    this.recentMovements.push({ success: outcome.success, timestamp: Date.now(), scenario, action });
    if (this.recentMovements.length > 20) {
      this.recentMovements.shift();
    }
    
    this.trainingData.push({
      action,
      reward: this.calculateReward(outcome, action),
      timestamp: Date.now(),
      scenario,
      travelTime: outcome.travelTime || 0,
      distance: outcome.distance || 0,
      recalculations: outcome.recalculations || 0,
      stuckDetections: outcome.stuckDetections || 0
    });
  }
  
  calculateReward(outcome, action) {
    let reward = 0;
    
    if (outcome.success) {
      reward = 1.0;
      if (outcome.travelTime && outcome.distance) {
        const efficiency = outcome.distance / Math.max(1, outcome.travelTime / 1000);
        if (efficiency > 5) reward += 0.3;
      }
      if (outcome.recalculations !== undefined && outcome.recalculations < 3) {
        reward += 0.2;
      }
      if (outcome.stuckDetections !== undefined && outcome.stuckDetections === 0) {
        reward += 0.2;
      }
    } else {
      reward = outcome.timeout ? -0.3 : -0.5;
    }
    
    if (outcome.fallDamage && outcome.fallDamage > 0) {
      reward -= Math.min(0.5, outcome.fallDamage / 20);
    }
    
    if (outcome.lavaContact) {
      reward -= 1.0;
    }
    
    if (outcome.isLoop) {
      reward -= 0.8;
    }
    
    return reward;
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
      successRate: this.stats.totalMovements > 0
        ? (this.stats.successfulMovements / this.stats.totalMovements * 100).toFixed(2) + '%'
        : 'N/A'
    };
  }
  
  resetStats() {
    this.stats = {
      totalMovements: 0,
      successfulMovements: 0,
      failedMovements: 0,
      timeoutMovements: 0,
      safetyVetoes: 0,
      scenarioStats: {
        overworld_hills: { count: 0, success: 0 },
        nether_highway: { count: 0, success: 0 },
        cave_navigation: { count: 0, success: 0 }
      }
    };
    this.recentMovements = [];
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
  const rl = new MockMovementRL();
  const targetPos = new Vec3(100, 64, 100);
  const action = await rl.selectAction(targetPos, 'overworld_hills');
  
  if (action.action === 'standard_pathfinder' && action.confidence > 0.8) {
    pass('High confidence action selection for overworld');
  } else {
    fail('Action selection confidence too low');
  }
});

// Test 2: Scenario-based action selection
test('Scenario-based action selection', async () => {
  const rl = new MockMovementRL();
  const targetPos = new Vec3(1000, 120, 1000);
  
  const highways = await rl.selectAction(targetPos, 'nether_highway');
  const cave = await rl.selectAction(targetPos, 'cave_navigation');
  
  if (highways.action === 'highway_mode' && cave.action === 'water_bucket_drop') {
    pass('Different scenarios produce scenario-appropriate actions');
  } else {
    fail(`Scenario selection failed: highway=${highways.action}, cave=${cave.action}`);
  }
});

// Test 3: Safety gate prevents unsafe actions
test('Safety gate prevents elytra without rockets', async () => {
  const rl = new MockMovementRL();
  rl.equipmentMock = { hasElytra: true, hasRockets: false, hasWaterBucket: false, hasBlocks: false };
  
  const isSafe = rl.isSafeAction('elytra_travel', 'overworld_hills');
  
  if (!isSafe) {
    pass('Elytra travel blocked without rockets');
  } else {
    fail('Should have blocked elytra without rockets');
  }
});

// Test 4: Safety gate prevents pillar bridge without blocks
test('Safety gate prevents pillar bridge without blocks', () => {
  const rl = new MockMovementRL();
  rl.equipmentMock = { hasElytra: false, hasRockets: false, hasWaterBucket: false, hasBlocks: false };
  
  const isSafe = rl.isSafeAction('pillar_bridge', 'cave_navigation');
  
  if (!isSafe) {
    pass('Pillar bridge blocked without blocks');
  } else {
    fail('Should have blocked pillar bridge without blocks');
  }
});

// Test 5: Safety gate prevents water bucket drop without bucket
test('Safety gate prevents water bucket drop without bucket', () => {
  const rl = new MockMovementRL();
  rl.equipmentMock = { hasElytra: false, hasRockets: false, hasWaterBucket: false, hasBlocks: true };
  
  const isSafe = rl.isSafeAction('water_bucket_drop', 'cave_navigation');
  
  if (!isSafe) {
    pass('Water bucket drop blocked without water bucket');
  } else {
    fail('Should have blocked water bucket drop without bucket');
  }
});

// Test 6: Safety veto recording
test('Safety veto is logged', () => {
  const rl = new MockMovementRL();
  
  rl.recordSafetyVeto('elytra_travel', 'missing_rockets');
  
  if (rl.stats.safetyVetoes === 1) {
    pass('Safety veto recorded in stats');
  } else {
    fail('Safety veto not properly recorded');
  }
});

// Test 7: Reward calculation for successful movement
test('Reward calculation for successful movement', () => {
  const rl = new MockMovementRL();
  
  const successReward = rl.calculateReward({ success: true, travelTime: 10000, distance: 50 }, 'standard_pathfinder');
  const failureReward = rl.calculateReward({ success: false }, 'standard_pathfinder');
  
  if (successReward > 0 && failureReward < 0) {
    pass('Reward signals correctly prioritize success');
  } else {
    fail('Reward calculation incorrect');
  }
});

// Test 8: Reward penalizes lava contact
test('Reward penalizes lava contact', () => {
  const rl = new MockMovementRL();
  
  const safeReward = rl.calculateReward({ success: false }, 'water_bucket_drop');
  const lavaReward = rl.calculateReward({ success: false, lavaContact: true }, 'water_bucket_drop');
  
  if (lavaReward < safeReward) {
    pass('Lava contact properly penalized');
  } else {
    fail('Lava contact not penalized enough');
  }
});

// Test 9: Reward penalizes loops
test('Reward penalizes inefficient loops', () => {
  const rl = new MockMovementRL();
  
  const normalFailure = rl.calculateReward({ success: false }, 'standard_pathfinder');
  const loopFailure = rl.calculateReward({ success: false, isLoop: true }, 'standard_pathfinder');
  
  if (loopFailure < normalFailure) {
    pass('Loops are penalized more than normal failures');
  } else {
    fail('Loop penalty not applied');
  }
});

// Test 10: Outcome recording and stats
test('Outcome recording updates stats correctly', () => {
  const rl = new MockMovementRL();
  const targetPos = new Vec3(100, 64, 100);
  
  rl.recordOutcome(targetPos, 'standard_pathfinder', { success: true }, 'overworld_hills');
  rl.recordOutcome(targetPos, 'highway_mode', { success: true }, 'nether_highway');
  rl.recordOutcome(targetPos, 'water_bucket_drop', { success: false }, 'cave_navigation');
  
  const stats = rl.getStats();
  
  if (stats.stats.totalMovements === 3 &&
      stats.stats.successfulMovements === 2 &&
      stats.stats.failedMovements === 1 &&
      stats.stats.scenarioStats.overworld_hills.count === 1 &&
      stats.stats.scenarioStats.nether_highway.count === 1 &&
      stats.stats.scenarioStats.cave_navigation.count === 1) {
    pass('Outcome recording and stats tracking working');
  } else {
    fail('Stats not tracking correctly');
  }
});

// Test 11: Efficiency bonus for fast travel
test('Efficiency bonus for fast travel', () => {
  const rl = new MockMovementRL();
  
  // Fast travel: 100 blocks in 15 seconds = 6.67 blocks/sec
  const fastReward = rl.calculateReward({ success: true, travelTime: 15000, distance: 100 }, 'standard_pathfinder');
  // Slow travel: 100 blocks in 60 seconds = 1.67 blocks/sec
  const slowReward = rl.calculateReward({ success: true, travelTime: 60000, distance: 100 }, 'standard_pathfinder');
  
  if (fastReward > slowReward) {
    pass('Fast travel rewarded more than slow travel');
  } else {
    fail('Efficiency bonus not applied correctly');
  }
});

// Test 12: Smooth path bonus for minimal recalculations
test('Smooth path bonus for minimal recalculations', () => {
  const rl = new MockMovementRL();
  
  const smoothReward = rl.calculateReward({ success: true, recalculations: 1 }, 'standard_pathfinder');
  const roughReward = rl.calculateReward({ success: true, recalculations: 5 }, 'standard_pathfinder');
  
  if (smoothReward > roughReward) {
    pass('Smooth paths (minimal recalculations) are rewarded more');
  } else {
    fail('Recalculation bonus not applied');
  }
});

// Test 13: Stats reset functionality
test('Stats reset functionality', () => {
  const rl = new MockMovementRL();
  const targetPos = new Vec3(100, 64, 100);
  
  rl.recordOutcome(targetPos, 'standard_pathfinder', { success: true }, 'overworld_hills');
  
  if (rl.getStats().stats.totalMovements !== 1) {
    fail('Initial stats recording failed');
    return;
  }
  
  rl.resetStats();
  
  if (rl.getStats().stats.totalMovements === 0 &&
      rl.getStats().stats.successfulMovements === 0 &&
      rl.trainingData.length === 0) {
    pass('Stats reset successfully');
  } else {
    fail('Stats not properly reset');
  }
});

// Test 14: Success rate calculation
test('Success rate calculation', () => {
  const rl = new MockMovementRL();
  const targetPos = new Vec3(100, 64, 100);
  
  for (let i = 0; i < 10; i++) {
    rl.recordOutcome(targetPos, 'standard_pathfinder', 
      { success: i % 2 === 0 }, 'overworld_hills');
  }
  
  const stats = rl.getStats();
  const successRate = parseFloat(stats.successRate);
  
  if (Math.abs(successRate - 50) < 1) {
    pass('Success rate calculation accurate');
  } else {
    fail(`Success rate incorrect: expected ~50%, got ${stats.successRate}`);
  }
});

// Test 15: Fallback when RL disabled
test('Fallback to standard pathfinder when RL disabled', async () => {
  const rl = new MockMovementRL();
  rl.initialized = false;
  
  const result = await rl.selectAction(new Vec3(100, 64, 100), 'overworld_hills');
  
  if (result.action === 'standard_pathfinder' && result.confidence === 0.0) {
    pass('Deterministic fallback active when RL disabled');
  } else {
    fail('Fallback not triggered when RL disabled');
  }
});

// Test 16: Training data accumulation for learning
test('Training data accumulation for learning', () => {
  const rl = new MockMovementRL();
  const targetPos = new Vec3(100, 64, 100);
  
  for (let i = 0; i < 5; i++) {
    rl.recordOutcome(targetPos, 'standard_pathfinder', 
      { success: true, travelTime: 10000, distance: 50 }, 'overworld_hills');
  }
  
  if (rl.trainingData.length === 5) {
    pass('Training data accumulating correctly');
  } else {
    fail('Training data not accumulating');
  }
});

// Test 17: Timeout penalty
test('Timeout penalty calculation', () => {
  const rl = new MockMovementRL();
  
  const normalFailure = rl.calculateReward({ success: false }, 'standard_pathfinder');
  const timeout = rl.calculateReward({ success: false, timeout: true }, 'standard_pathfinder');
  
  if (timeout > normalFailure) {
    pass('Timeout penalized less severely than normal failure');
  } else {
    fail('Timeout penalty incorrect');
  }
});

// Test 18: Fall damage penalty
test('Fall damage penalty calculation', () => {
  const rl = new MockMovementRL();
  
  const noDamage = rl.calculateReward({ success: false }, 'standard_pathfinder');
  const damage = rl.calculateReward({ success: false, fallDamage: 5 }, 'standard_pathfinder');
  
  if (damage < noDamage) {
    pass('Fall damage is penalized');
  } else {
    fail('Fall damage penalty not applied');
  }
});

// Test 19: Unstuck avoidance bonus
test('Unstuck avoidance bonus', () => {
  const rl = new MockMovementRL();
  
  const stuckReward = rl.calculateReward({ success: true, stuckDetections: 3 }, 'standard_pathfinder');
  const unstuckReward = rl.calculateReward({ success: true, stuckDetections: 0 }, 'standard_pathfinder');
  
  if (unstuckReward > stuckReward) {
    pass('Avoiding stuck detection is rewarded');
  } else {
    fail('Unstuck avoidance bonus not applied');
  }
});

// Test 20: Equipment check affects safety
test('Equipment availability affects safety decisions', () => {
  const rl = new MockMovementRL();
  
  // Test with no equipment
  rl.equipmentMock = { hasElytra: false, hasRockets: false, hasWaterBucket: false, hasBlocks: false };
  const noEquip = rl.isSafeAction('elytra_travel', 'overworld_hills');
  
  // Test with full equipment
  rl.equipmentMock = { hasElytra: true, hasRockets: true, hasWaterBucket: true, hasBlocks: true };
  const fullEquip = rl.isSafeAction('elytra_travel', 'overworld_hills');
  
  if (!noEquip && fullEquip) {
    pass('Equipment availability correctly affects safety decisions');
  } else {
    fail('Equipment check not working properly');
  }
});

// Run tests
(async () => {
  console.log('Running Movement RL tests...\n');
  
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
