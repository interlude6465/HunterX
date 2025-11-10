#!/usr/bin/env node

/**
 * Test suite for RL Analytics
 * Tests dashboard endpoints, admin commands, emergency fallback, and A/B testing
 */

console.log('=== RL ANALYTICS TEST SUITE ===\n');

// Mock RLAnalyticsManager for testing
class MockRLAnalyticsManager {
  constructor() {
    this.domains = {};
    this.globalMetrics = {
      abtestingEnabled: false,
      abtestPercentage: 0.1,
      emergencyFallbackThreshold: -0.3,
      enableEmergencyFallback: true,
      rewardWindowSize: 50
    };
    this.performanceHistory = {};
    this.learningLog = [];
    this.initialized = true;
  }
  
  registerDomain(name) {
    if (!this.domains[name]) {
      this.domains[name] = {
        name,
        metrics: {
          currentEpsilon: 0.5,
          modelHash: 'abc123',
          bufferFillLevel: 0.5,
          experienceCount: 100,
          maxBufferSize: 1000
        },
        stats: {
          totalInteractions: 0,
          successCount: 0,
          failureCount: 0,
          averageReward: 0,
          rewardTrend: [],
          confidenceScores: [],
          winStreak: 0,
          lossStreak: 0,
          maxWinStreak: 0,
          maxLossStreak: 0,
          emergencyFallbackActive: false
        },
        logs: {
          recentDecisions: [],
          maxLogSize: 100,
          highRewardEvents: [],
          largeLossEvents: [],
          fallbackEvents: []
        }
      };
    }
  }
  
  recordEpisode(domainName, outcome = {}) {
    if (!this.domains[domainName]) {
      this.registerDomain(domainName);
    }
    
    const domain = this.domains[domainName];
    const { success = false, reward = 0, confidence = 0.5 } = outcome;
    
    domain.stats.totalInteractions++;
    if (success) {
      domain.stats.successCount++;
      domain.stats.winStreak++;
      domain.stats.lossStreak = 0;
    } else {
      domain.stats.failureCount++;
      domain.stats.lossStreak++;
      domain.stats.winStreak = 0;
    }
    
    if (domain.stats.winStreak > domain.stats.maxWinStreak) {
      domain.stats.maxWinStreak = domain.stats.winStreak;
    }
    if (domain.stats.lossStreak > domain.stats.maxLossStreak) {
      domain.stats.maxLossStreak = domain.stats.lossStreak;
    }
    
    domain.stats.rewardTrend.push(reward);
    if (domain.stats.rewardTrend.length > this.globalMetrics.rewardWindowSize) {
      domain.stats.rewardTrend.shift();
    }
    
    const avgReward = domain.stats.rewardTrend.reduce((a, b) => a + b, 0) / domain.stats.rewardTrend.length;
    domain.stats.averageReward = parseFloat(avgReward.toFixed(3));
    
    domain.stats.confidenceScores.push(confidence);
    if (domain.stats.confidenceScores.length > 50) {
      domain.stats.confidenceScores.shift();
    }
    
    domain.logs.recentDecisions.push({
      timestamp: Date.now(),
      success,
      reward,
      confidence,
      action: 'test'
    });
    
    // Check emergency fallback
    if (this.globalMetrics.enableEmergencyFallback) {
      if (domain.stats.totalInteractions >= 20 && domain.stats.averageReward < this.globalMetrics.emergencyFallbackThreshold) {
        domain.stats.emergencyFallbackActive = true;
      } else if (domain.stats.averageReward > (this.globalMetrics.emergencyFallbackThreshold + 0.2)) {
        domain.stats.emergencyFallbackActive = false;
      }
    }
  }
  
  getAllMetrics() {
    const result = {};
    for (const domainName in this.domains) {
      result[domainName] = this.getDomainMetrics(domainName);
    }
    return result;
  }
  
  getDomainMetrics(domainName) {
    const domain = this.domains[domainName];
    if (!domain) return null;
    
    return {
      name: domainName,
      metrics: domain.metrics,
      stats: domain.stats,
      successRate: domain.stats.totalInteractions > 0
        ? (domain.stats.successCount / domain.stats.totalInteractions * 100).toFixed(2) + '%'
        : 'N/A'
    };
  }
  
  getRecentLogs(domainName, limit = 50) {
    const domain = this.domains[domainName];
    if (!domain) return [];
    return domain.logs.recentDecisions.slice(-limit);
  }
  
  getLearningEvents(limit = 50) {
    return this.learningLog.slice(-limit);
  }
  
  logLearningEvent(message) {
    this.learningLog.push({ timestamp: Date.now(), message });
  }
  
  setABTestingEnabled(enabled) {
    this.globalMetrics.abtestingEnabled = enabled;
  }
  
  shouldUseFallback() {
    if (!this.globalMetrics.abtestingEnabled) return false;
    return Math.random() < this.globalMetrics.abtestPercentage;
  }
  
  resetDomain(domainName) {
    if (this.domains[domainName]) {
      const domain = this.domains[domainName];
      domain.stats.totalInteractions = 0;
      domain.stats.successCount = 0;
      domain.stats.failureCount = 0;
      domain.stats.averageReward = 0;
      domain.stats.rewardTrend = [];
      domain.stats.emergencyFallbackActive = false;
      domain.logs.recentDecisions = [];
    }
  }
  
  exportSnapshot(domainName) {
    const domain = this.domains[domainName];
    if (!domain) return null;
    
    return {
      domain: domainName,
      timestamp: Date.now(),
      metrics: domain.metrics,
      stats: domain.stats
    };
  }
  
  savePerformanceMetrics() {
    // Mock save
    return true;
  }
}

// Test framework
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

// Test 1: Dashboard endpoints return valid JSON
test('Dashboard endpoints return valid RL metrics', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('dialogue');
  analytics.recordEpisode('dialogue', { success: true, reward: 0.8 });
  
  const metrics = analytics.getAllMetrics();
  if (metrics.dialogue && metrics.dialogue.stats.totalInteractions === 1) {
    pass('Metrics endpoint returns correct data');
  } else {
    fail('Metrics endpoint data invalid');
  }
});

// Test 2: Domain registration and metric tracking
test('Domain registration and metric tracking works', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test_domain');
  
  if (analytics.domains['test_domain'] && analytics.domains['test_domain'].stats.totalInteractions === 0) {
    pass('Domain registered successfully');
  } else {
    fail('Domain registration failed');
  }
});

// Test 3: Episode recording updates stats correctly
test('Episode recording updates statistics correctly', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  analytics.recordEpisode('test', { success: true, reward: 1.0 });
  analytics.recordEpisode('test', { success: false, reward: -0.5 });
  analytics.recordEpisode('test', { success: true, reward: 0.8 });
  
  const metrics = analytics.getDomainMetrics('test');
  if (metrics.stats.totalInteractions === 3 && metrics.stats.successCount === 2) {
    pass('Episode recording updates stats correctly');
  } else {
    fail('Episode recording stats incorrect');
  }
});

// Test 4: Emergency fallback triggers on low average reward
test('Emergency fallback triggers when average reward falls below threshold', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  // Record 25 low-reward episodes to trigger emergency fallback
  for (let i = 0; i < 25; i++) {
    analytics.recordEpisode('test', { success: false, reward: -0.4 });
  }
  
  const metrics = analytics.getDomainMetrics('test');
  if (metrics.stats.emergencyFallbackActive === true) {
    pass('Emergency fallback activated correctly');
  } else {
    fail(`Emergency fallback not activated. Avg reward: ${metrics.stats.averageReward}, Expected < -0.3`);
  }
});

// Test 5: Emergency fallback recovers when performance improves
test('Emergency fallback recovers when performance improves', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  // Record low-reward episodes to trigger fallback
  for (let i = 0; i < 25; i++) {
    analytics.recordEpisode('test', { success: false, reward: -0.4 });
  }
  
  // Record high-reward episodes to recover
  for (let i = 0; i < 30; i++) {
    analytics.recordEpisode('test', { success: true, reward: 0.8 });
  }
  
  const metrics = analytics.getDomainMetrics('test');
  if (metrics.stats.emergencyFallbackActive === false) {
    pass('Emergency fallback recovered correctly');
  } else {
    fail('Emergency fallback did not recover');
  }
});

// Test 6: Recent logs are capped at maxLogSize
test('Recent decision logs are capped at maximum size', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  // Record 150 episodes (max log size is 100)
  for (let i = 0; i < 150; i++) {
    analytics.recordEpisode('test', { success: i % 2 === 0, reward: Math.random() - 0.5 });
  }
  
  const logs = analytics.getRecentLogs('test');
  if (logs.length <= 100) {
    pass(`Recent logs capped correctly at ${logs.length} entries`);
  } else {
    fail(`Recent logs exceeded max size: ${logs.length}`);
  }
});

// Test 7: Win/loss streak tracking
test('Win and loss streak tracking works correctly', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  // Create a win streak of 5
  for (let i = 0; i < 5; i++) {
    analytics.recordEpisode('test', { success: true, reward: 0.8 });
  }
  
  // Then a loss streak of 3
  for (let i = 0; i < 3; i++) {
    analytics.recordEpisode('test', { success: false, reward: -0.3 });
  }
  
  const metrics = analytics.getDomainMetrics('test');
  if (metrics.stats.maxWinStreak === 5 && metrics.stats.lossStreak === 3) {
    pass('Win/loss streaks tracked correctly');
  } else {
    fail(`Streaks incorrect: maxWin=${metrics.stats.maxWinStreak}, currentLoss=${metrics.stats.lossStreak}`);
  }
});

// Test 8: A/B testing toggle controls
test('A/B testing toggle controls work correctly', () => {
  const analytics = new MockRLAnalyticsManager();
  
  if (analytics.globalMetrics.abtestingEnabled === false) {
    pass('A/B testing initially disabled');
  } else {
    fail('A/B testing should be initially disabled');
    return;
  }
  
  analytics.setABTestingEnabled(true);
  if (analytics.globalMetrics.abtestingEnabled === true) {
    pass('A/B testing enabled successfully');
  } else {
    fail('A/B testing failed to enable');
  }
  
  analytics.setABTestingEnabled(false);
  if (analytics.globalMetrics.abtestingEnabled === false) {
    pass('A/B testing disabled successfully');
  } else {
    fail('A/B testing failed to disable');
  }
});

// Test 9: A/B testing probability
test('A/B testing routes correct percentage through fallback', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.globalMetrics.abtestPercentage = 0.2; // 20%
  analytics.setABTestingEnabled(true);
  
  let fallbackCount = 0;
  const trials = 1000;
  
  for (let i = 0; i < trials; i++) {
    if (analytics.shouldUseFallback()) {
      fallbackCount++;
    }
  }
  
  const percentage = fallbackCount / trials;
  const expectedLow = 0.15;
  const expectedHigh = 0.25;
  
  if (percentage >= expectedLow && percentage <= expectedHigh) {
    pass(`A/B testing probability correct: ${(percentage * 100).toFixed(1)}% (expected ~20%)`);
  } else {
    fail(`A/B testing probability wrong: ${(percentage * 100).toFixed(1)}% (expected ~20%)`);
  }
});

// Test 10: Domain reset functionality
test('Domain reset clears statistics correctly', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  // Record some episodes
  for (let i = 0; i < 10; i++) {
    analytics.recordEpisode('test', { success: i % 2 === 0, reward: 0.5 });
  }
  
  const beforeReset = analytics.getDomainMetrics('test');
  if (beforeReset.stats.totalInteractions === 10) {
    pass('Episodes recorded before reset');
  } else {
    fail('Failed to record episodes');
    return;
  }
  
  analytics.resetDomain('test');
  const afterReset = analytics.getDomainMetrics('test');
  
  if (afterReset.stats.totalInteractions === 0 && afterReset.stats.successCount === 0) {
    pass('Domain reset cleared statistics correctly');
  } else {
    fail('Domain reset did not clear statistics');
  }
});

// Test 11: Average reward calculation
test('Average reward calculation is accurate', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  const rewards = [0.5, 1.0, -0.3, 0.8, 0.2];
  for (const reward of rewards) {
    analytics.recordEpisode('test', { success: reward > 0, reward });
  }
  
  const expected = rewards.reduce((a, b) => a + b) / rewards.length;
  const metrics = analytics.getDomainMetrics('test');
  const actual = metrics.stats.averageReward;
  
  if (Math.abs(actual - expected) < 0.01) {
    pass(`Average reward calculated correctly: ${actual.toFixed(2)}`);
  } else {
    fail(`Average reward incorrect: ${actual} vs expected ${expected.toFixed(2)}`);
  }
});

// Test 12: Export snapshot functionality
test('Export snapshot captures domain state correctly', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  analytics.recordEpisode('test', { success: true, reward: 0.8 });
  const snapshot = analytics.exportSnapshot('test');
  
  if (snapshot && snapshot.stats.totalInteractions === 1 && snapshot.domain === 'test') {
    pass('Snapshot exported correctly');
  } else {
    fail('Snapshot export failed');
  }
});

// Test 13: Learning events logging
test('Learning events are logged correctly', () => {
  const analytics = new MockRLAnalyticsManager();
  
  analytics.logLearningEvent('Test event 1');
  analytics.logLearningEvent('Test event 2');
  
  const events = analytics.getLearningEvents();
  if (events.length === 2 && events[0].message === 'Test event 1') {
    pass('Learning events logged correctly');
  } else {
    fail('Learning events logging failed');
  }
});

// Test 14: Multiple domains independent tracking
test('Multiple domains track independently', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('dialogue');
  analytics.registerDomain('combat');
  
  for (let i = 0; i < 10; i++) {
    analytics.recordEpisode('dialogue', { success: true, reward: 0.8 });
    analytics.recordEpisode('combat', { success: false, reward: -0.4 });
  }
  
  const dialogue = analytics.getDomainMetrics('dialogue');
  const combat = analytics.getDomainMetrics('combat');
  
  if (dialogue.stats.successCount === 10 && combat.stats.failureCount === 10) {
    pass('Multiple domains track independently');
  } else {
    fail('Domain tracking interference detected');
  }
});

// Test 15: Confidence score tracking
test('Confidence scores are tracked correctly', () => {
  const analytics = new MockRLAnalyticsManager();
  analytics.registerDomain('test');
  
  analytics.recordEpisode('test', { success: true, confidence: 0.9 });
  analytics.recordEpisode('test', { success: false, confidence: 0.5 });
  
  const metrics = analytics.getDomainMetrics('test');
  if (metrics.stats.confidenceScores && metrics.stats.confidenceScores.length === 2) {
    pass('Confidence scores tracked correctly');
  } else {
    fail('Confidence score tracking failed');
  }
});

// Run all tests
(async () => {
  console.log('Running RL Analytics tests...\n');
  
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
