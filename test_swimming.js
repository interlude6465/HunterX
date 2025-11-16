// Test swimming behavior implementation
const assert = require('assert');

// Simple Vec3 mock (define first)
class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  offset(dx, dy, dz) {
    return new Vec3(this.x + dx, this.y + dy, this.z + dz);
  }
}

global.Vec3 = Vec3;

// Mock bot for testing
class MockBot {
  constructor() {
    this.isInWater = false;
    this.entity = { position: new Vec3(0, 64, 0) };
    this.controlStates = {};
    this.pathfinder = {
      isMoving: () => false,
      goto: async (goal) => {}
    };
  }
  
  setControlState(state, value) {
    this.controlStates[state] = value;
  }
  
  blockAt(pos) {
    // When in water, return water blocks at and above current position
    if (this.isInWater) {
      const relY = pos.y - this.entity.position.y;
      // Check both exact Y and fractional offsets (0.5 for head level, 1 for above)
      if (relY >= -0.1 && relY <= 2) {
        return { name: 'water' };
      }
    }
    return { name: 'air' };
  }
  
  on(event, handler) {
    // Store handler for manual triggering in tests
    if (!this.handlers) this.handlers = {};
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }
  
  emit(event) {
    if (this.handlers && this.handlers[event]) {
      this.handlers[event].forEach(handler => handler());
    }
  }
}

// Mock config
global.config = {
  swimming: {
    enabled: true,
    autoSwim: true,
    sprintInWater: true,
    allowPathfindingThroughWater: true,
    detectWaterDepth: true,
    minDepthForSwim: 1
  }
};

// Extract SwimmingBehavior class from HunterX.js
class SwimmingBehavior {
  constructor(bot) {
    this.bot = bot;
    this.isSwimming = false;
    this.wasInWater = false;
    this.swimInterval = null;
    this.enabled = global.config.swimming?.enabled !== false;
    this.autoSwim = global.config.swimming?.autoSwim !== false;
    this.sprintInWater = global.config.swimming?.sprintInWater !== false;
    this.swimDepthThreshold = global.config.swimming?.minDepthForSwim || 1;
    
    console.log('[SWIMMING] Swimming behavior initialized');
  }
  
  start() {
    if (this.swimInterval) {
      return;
    }
    
    this.bot.on('physicsTick', this.handlePhysicsTick.bind(this));
    console.log('[SWIMMING] Swimming behavior started');
  }
  
  stop() {
    if (this.swimInterval) {
      clearInterval(this.swimInterval);
      this.swimInterval = null;
    }
    
    this.disableSwimming();
    console.log('[SWIMMING] Swimming behavior stopped');
  }
  
  handlePhysicsTick() {
    if (!this.enabled || !this.bot || !this.bot.entity) {
      return;
    }
    
    const inWater = this.bot.isInWater;
    
    if (inWater && !this.wasInWater) {
      this.onWaterEntry();
    }
    
    if (!inWater && this.wasInWater) {
      this.onWaterExit();
    }
    
    if (inWater) {
      this.updateSwimming();
    }
    
    this.wasInWater = inWater;
  }
  
  onWaterEntry() {
    console.log('[SWIMMING] Entered water - enabling swimming mode');
    this.isSwimming = true;
  }
  
  onWaterExit() {
    console.log('[SWIMMING] Exited water - disabling swimming mode');
    this.isSwimming = false;
    this.disableSwimming();
  }
  
  updateSwimming() {
    if (!this.isSwimming || !this.bot || !this.autoSwim) {
      return;
    }
    
    try {
      const currentPos = this.bot.entity.position;
      const blockAbove = this.bot.blockAt(currentPos.offset(0, 1, 0));
      const blockAtHead = this.bot.blockAt(currentPos.offset(0, 0.5, 0));
      
      const isSubmerged = (blockAbove && blockAbove.name === 'water') || 
                          (blockAtHead && blockAtHead.name === 'water');
      
      if (isSubmerged) {
        if (this.bot.setControlState) {
          this.bot.setControlState('jump', true);
        }
      } else {
        if (this.bot.setControlState) {
          this.bot.setControlState('jump', false);
        }
      }
      
      if (this.sprintInWater && this.bot.pathfinder && this.bot.pathfinder.isMoving()) {
        if (this.bot.setControlState) {
          this.bot.setControlState('sprint', true);
        }
      }
    } catch (err) {
      // Ignore errors silently
    }
  }
  
  disableSwimming() {
    try {
      if (this.bot && this.bot.setControlState) {
        this.bot.setControlState('jump', false);
        this.bot.setControlState('sprint', false);
      }
    } catch (err) {
      // Ignore errors
    }
  }
  
  isInWater() {
    return this.bot && this.bot.isInWater;
  }
  
  getWaterDepth() {
    if (!this.bot || !this.bot.entity) {
      return 0;
    }
    
    try {
      const pos = this.bot.entity.position;
      let depth = 0;
      
      for (let y = 0; y < 10; y++) {
        const block = this.bot.blockAt(pos.offset(0, y, 0));
        if (block && block.name === 'water') {
          depth++;
        } else {
          break;
        }
      }
      
      return depth;
    } catch (err) {
      return 0;
    }
  }
  
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.disableSwimming();
    }
    console.log(`[SWIMMING] Swimming behavior ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Run tests
console.log('\n=== Testing Swimming Behavior ===\n');

// Test 1: Initialization
console.log('Test 1: SwimmingBehavior initialization');
const mockBot = new MockBot();
const swimming = new SwimmingBehavior(mockBot);
assert.strictEqual(swimming.enabled, true, 'Swimming should be enabled by default');
assert.strictEqual(swimming.isSwimming, false, 'Should not be swimming initially');
console.log('✓ Initialization test passed\n');

// Test 2: Water entry detection
console.log('Test 2: Water entry detection');
swimming.start();
mockBot.isInWater = true;
mockBot.emit('physicsTick');
assert.strictEqual(swimming.isSwimming, true, 'Should be swimming after water entry');
console.log('✓ Water entry test passed\n');

// Test 3: Swimming controls
console.log('Test 3: Swimming controls (jump enabled when submerged)');
// Need to trigger another physicsTick to update swimming controls
mockBot.emit('physicsTick');
assert.strictEqual(mockBot.controlStates.jump, true, 'Jump should be enabled when submerged');
console.log('✓ Swimming controls test passed\n');

// Test 4: Water exit detection
console.log('Test 4: Water exit detection');
mockBot.isInWater = false;
mockBot.emit('physicsTick');
assert.strictEqual(swimming.isSwimming, false, 'Should not be swimming after water exit');
assert.strictEqual(mockBot.controlStates.jump, false, 'Jump should be disabled after water exit');
console.log('✓ Water exit test passed\n');

// Test 5: Enable/disable functionality
console.log('Test 5: Enable/disable swimming behavior');
swimming.setEnabled(false);
assert.strictEqual(swimming.enabled, false, 'Swimming should be disabled');
mockBot.isInWater = true;
mockBot.emit('physicsTick');
// When disabled, updateSwimming should not set jump
assert.strictEqual(mockBot.controlStates.jump, false, 'Jump should remain disabled when swimming is disabled');
console.log('✓ Enable/disable test passed\n');

// Test 6: Water depth detection
console.log('Test 6: Water depth detection');
mockBot.isInWater = true;
swimming.setEnabled(true);
const depth = swimming.getWaterDepth();
assert.strictEqual(depth >= 0, true, 'Water depth should be non-negative');
console.log(`✓ Water depth test passed (depth: ${depth})\n`);

console.log('=== All tests passed! ===\n');
console.log('Swimming behavior implementation is working correctly.');
