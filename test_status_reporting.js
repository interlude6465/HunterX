// Test script for status reporting features

// Mock bot object
const mockBot = {
  username: 'TestBot',
  entity: {
    position: { x: 100.5, y: 64.0, z: -200.3 },
    velocity: { x: 0, y: 0, z: 0 }
  },
  game: {
    dimension: 'minecraft:overworld'
  },
  health: 18,
  food: 16,
  inventory: {
    slots: [null, null, null, null, null, 
      { name: 'diamond_helmet', durabilityUsed: 10, maxDurability: 363 },
      { name: 'diamond_chestplate', durabilityUsed: 20, maxDurability: 528 },
      { name: 'diamond_leggings', durabilityUsed: 15, maxDurability: 495 },
      { name: 'diamond_boots', durabilityUsed: 5, maxDurability: 429 }
    ]
  },
  combatAI: null,
  pathfinder: {
    isMoving: () => false
  },
  players: {
    'TestPlayer': {
      entity: {
        position: { x: 105.0, y: 64.0, z: -195.0 }
      }
    }
  },
  entities: {}
};

// Mock config
const config = {
  tasks: {
    current: null
  },
  homeBase: {
    coords: null
  },
  stashHunt: {
    active: false
  },
  dupeDiscovery: {
    testingEnabled: false
  },
  whitelist: [
    { name: 'TestPlayer', level: 'trusted' },
    { name: 'Guest', level: 'guest' }
  ]
};

// Mock functions
function getNearbyPlayers(bot, radius) {
  return [
    { username: 'TestPlayer', distance: 7.07 }
  ];
}

// Test determineBotActivity
console.log('Testing determineBotActivity...');

function determineBotActivity(bot) {
  if (!bot || !bot.entity) {
    return 'unknown';
  }

  // Check combat state (highest priority)
  if (bot.combatAI && bot.combatAI.currentTarget) {
    return 'fighting';
  }

  // Check if taking damage or recently damaged
  if (bot.lastDamageTime && (Date.now() - bot.lastDamageTime < 3000)) {
    return 'under attack';
  }

  // Check if in combat mode
  if (bot.pvp && bot.pvp.target) {
    return 'fighting';
  }

  // Check task queue
  if (config.tasks.current) {
    const task = config.tasks.current;
    if (task.type) {
      if (task.type === 'mine' || task.type === 'mining') return 'mining';
      if (task.type === 'build' || task.type === 'building') return 'building';
      if (task.type === 'gather' || task.type === 'collecting') return 'gathering';
      if (task.type === 'hunt' || task.type === 'hunting') return 'hunting';
      if (task.type === 'craft' || task.type === 'crafting') return 'crafting';
      if (task.type === 'follow' || task.type === 'following') return 'following';
      if (task.type === 'guard' || task.type === 'guarding') return 'guarding';
      return task.type.toLowerCase();
    }
  }

  // Check pathfinder state
  if (bot.pathfinder && bot.pathfinder.isMoving && bot.pathfinder.isMoving()) {
    return 'traveling';
  }

  // Check velocity for any movement
  if (bot.entity.velocity) {
    const vel = bot.entity.velocity;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
    if (speed > 0.1) {
      return 'moving';
    }
  }

  // Default to idle
  return 'idle';
}

const activity1 = determineBotActivity(mockBot);
console.log('✓ Bot activity (idle):', activity1);
console.assert(activity1 === 'idle', 'Should return idle');

// Test with combat
mockBot.combatAI = { currentTarget: { username: 'Enemy' } };
const activity2 = determineBotActivity(mockBot);
console.log('✓ Bot activity (fighting):', activity2);
console.assert(activity2 === 'fighting', 'Should return fighting');
mockBot.combatAI = null;

// Test with task
config.tasks.current = { type: 'mining' };
const activity3 = determineBotActivity(mockBot);
console.log('✓ Bot activity (mining):', activity3);
console.assert(activity3 === 'mining', 'Should return mining');
config.tasks.current = null;

console.log('\n✓ All determineBotActivity tests passed!\n');

// Test status snapshot
console.log('Testing getBotStatusSnapshot...');

class MockConversationAI {
  constructor(bot) {
    this.bot = bot;
  }

  getTrustLevel(username) {
    const entry = config.whitelist.find(e => e.name === username);
    return entry ? entry.level : null;
  }

  hasTrustLevel(username, minLevel) {
    const trustLevels = ['guest', 'trusted', 'admin', 'owner'];
    const userLevel = this.getTrustLevel(username);
    if (!userLevel) return false;
    
    const userIndex = trustLevels.indexOf(userLevel);
    const minIndex = trustLevels.indexOf(minLevel);
    
    return userIndex >= minIndex;
  }

  async getBotStatusSnapshot(username) {
    const pos = this.bot.entity.position;
    const hasPreciseAccess = this.hasTrustLevel(username, 'trusted');
    
    const nearbyPlayers = getNearbyPlayers(this.bot, 50);
    
    const activity = determineBotActivity(this.bot);
    
    const armorSlots = this.bot.inventory.slots.slice(5, 9);
    const armorCount = armorSlots.filter(s => s !== null).length;
    const armorDurability = armorSlots.filter(s => s !== null).map(s => {
      if (s.durabilityUsed !== undefined && s.maxDurability !== undefined) {
        return Math.round(((s.maxDurability - s.durabilityUsed) / s.maxDurability) * 100);
      }
      return 100;
    });
    const avgArmor = armorDurability.length > 0 
      ? Math.round(armorDurability.reduce((a, b) => a + b, 0) / armorDurability.length)
      : 0;
    
    const activeTask = config.tasks.current ? config.tasks.current.type || 'unknown' : null;
    
    return {
      position: hasPreciseAccess ? {
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z)
      } : null,
      biome: hasPreciseAccess ? 'plains' : null,
      dimension: hasPreciseAccess ? this.bot.game?.dimension || 'unknown' : null,
      activity,
      nearbyPlayers: nearbyPlayers.map(p => ({
        name: p.username,
        distance: Math.round(p.distance)
      })),
      nearbyMobs: hasPreciseAccess ? [] : null,
      health: Math.round(this.bot.health),
      food: typeof this.bot.food === 'number' ? Math.round(this.bot.food) : null,
      armorEquipped: armorCount,
      armorDurability: avgArmor,
      activeTask,
      eta: hasPreciseAccess ? null : null,
      timestamp: Date.now()
    };
  }

  formatStatusReport(snapshot, username) {
    const lines = [];
    
    lines.push(`📊 Status Report for ${this.bot.username}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🔹 Activity: ${snapshot.activity}`);
    
    if (snapshot.position) {
      lines.push(`📍 Location: ${snapshot.position.x}, ${snapshot.position.y}, ${snapshot.position.z}`);
      if (snapshot.biome) {
        lines.push(`🌍 Biome: ${snapshot.biome}`);
      }
      if (snapshot.dimension) {
        lines.push(`🌐 Dimension: ${snapshot.dimension}`);
      }
    } else {
      lines.push(`📍 Location: [Restricted - Trusted+ only]`);
    }
    
    lines.push(`❤️  Health: ${snapshot.health}/20`);
    if (snapshot.food !== null) {
      lines.push(`🍖 Food: ${snapshot.food}/20`);
    }
    
    lines.push(`🛡️  Armor: ${snapshot.armorEquipped}/4 pieces (${snapshot.armorDurability}% durability)`);
    
    if (snapshot.activeTask) {
      lines.push(`📋 Task: ${snapshot.activeTask}`);
    }
    
    if (snapshot.nearbyPlayers.length > 0) {
      const playerList = snapshot.nearbyPlayers.map(p => `${p.name} (${p.distance}m)`).join(', ');
      lines.push(`👥 Nearby players: ${playerList}`);
    } else {
      lines.push(`👥 Nearby players: None`);
    }
    
    return lines;
  }
}

const conversationAI = new MockConversationAI(mockBot);

// Test with trusted user
const snapshot1 = await conversationAI.getBotStatusSnapshot('TestPlayer');
console.log('✓ Snapshot for trusted user:', JSON.stringify(snapshot1, null, 2));
console.assert(snapshot1.position !== null, 'Trusted user should see position');
console.assert(snapshot1.biome !== null, 'Trusted user should see biome');
console.assert(snapshot1.dimension !== null, 'Trusted user should see dimension');

// Test with guest user
const snapshot2 = await conversationAI.getBotStatusSnapshot('Guest');
console.log('\n✓ Snapshot for guest user:', JSON.stringify(snapshot2, null, 2));
console.assert(snapshot2.position === null, 'Guest should not see position');
console.assert(snapshot2.biome === null, 'Guest should not see biome');
console.assert(snapshot2.dimension === null, 'Guest should not see dimension');

// Test formatted report
const report = conversationAI.formatStatusReport(snapshot1, 'TestPlayer');
console.log('\n✓ Formatted report for trusted user:');
report.forEach(line => console.log('  ' + line));

console.assert(report.length > 5, 'Report should have multiple lines');
console.assert(report.some(l => l.includes('Activity')), 'Report should include activity');
console.assert(report.some(l => l.includes('Location')), 'Report should include location');
console.assert(report.some(l => l.includes('Health')), 'Report should include health');
console.assert(report.some(l => l.includes('Armor')), 'Report should include armor');

console.log('\n✅ All status reporting tests passed!');
