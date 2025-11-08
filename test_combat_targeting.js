// Test combat targeting and hostile mob detection

class HostileMobDetector {
  constructor() {
    this.HOSTILE_MOBS = [
      'zombie', 'creeper', 'skeleton', 'spider', 'cave_spider',
      'enderman', 'witch', 'wither_skeleton', 'blaze', 'ghast',
      'magma_cube', 'silverfish', 'endermite', 'evoker', 'vindicator',
      'pillager', 'ravager', 'drowned', 'husk', 'stray',
      'piglin', 'piglin_brute', 'zoglin', 'phantom', 'shulker'
    ];
  }
  
  isHostileMob(entity) {
    if (!entity || !entity.name) return false;
    
    const mobName = entity.name.toLowerCase();
    const entityType = entity.type ? entity.type.toLowerCase() : '';
    
    // Check both name and type
    return this.HOSTILE_MOBS.some(hostile => 
      mobName.includes(hostile) || entityType.includes(hostile)
    );
  }
  
  isPlayer(entity) {
    if (!entity) return false;
    return entity.type === 'player' || entity.username !== undefined;
  }
  
  isPlayerAttacking(player) {
    // Player has their arm raised = attacking
    return player.metadata && player.metadata[1] === 1;
  }
}

// Test cases
const detector = new HostileMobDetector();

console.log('=== Testing HostileMobDetector ===\n');

// Test hostile mobs
const testMobs = [
  { name: 'Zombie', type: 'mob' },
  { name: 'Creeper', type: 'mob' },
  { name: 'Skeleton', type: 'mob' },
  { name: 'Spider', type: 'mob' },
  { name: 'Enderman', type: 'mob' },
  { name: 'Shulker', type: 'mob' },
  { name: 'zombie', type: 'mob' }, // lowercase
  { name: 'zombie_villager', type: 'mob' }, // contains zombie
  { name: 'Cow', type: 'mob' }, // passive mob
  { name: 'Pig', type: 'mob' }, // passive mob
  { name: 'Sheep', type: 'mob' } // passive mob
];

console.log('Testing isHostileMob():');
for (const mob of testMobs) {
  const result = detector.isHostileMob(mob);
  const expected = ['zombie', 'creeper', 'skeleton', 'spider', 'enderman', 'shulker', 'zombie_villager']
    .some(h => mob.name.toLowerCase().includes(h));
  const status = result === expected ? '✓' : '✗';
  console.log(`  ${status} ${mob.name}: ${result} (expected: ${expected})`);
}

console.log('\nTesting isPlayer():');
const testEntities = [
  { name: 'Steve', type: 'player', username: 'Steve' },
  { name: 'Alex', type: 'player', username: 'Alex' },
  { name: 'Zombie', type: 'mob' },
  { name: 'Creeper', type: 'mob' },
  { username: 'TestPlayer' }, // player without type
  { type: 'player' } // player without name
];

for (const entity of testEntities) {
  const result = detector.isPlayer(entity);
  const expected = entity.type === 'player' || entity.username !== undefined;
  const status = result === expected ? '✓' : '✗';
  const name = entity.username || entity.name || 'unnamed';
  console.log(`  ${status} ${name}: ${result} (expected: ${expected})`);
}

// Test priority targeting logic
console.log('\n=== Testing Priority Targeting Logic ===\n');

const mockBotPosition = { x: 0, y: 64, z: 0 };
const mockEntities = [
  { name: 'Steve', type: 'player', username: 'Steve', position: { x: 2, y: 64, z: 0 } },
  { name: 'Zombie', type: 'mob', position: { x: 3, y: 64, z: 0 } },
  { name: 'Creeper', type: 'mob', position: { x: 4, y: 64, z: 0 } },
  { name: 'Cow', type: 'mob', position: { x: 1, y: 64, z: 0 } }
];

// Calculate distances
mockEntities.forEach(e => {
  const dx = e.position.x - mockBotPosition.x;
  const dy = e.position.y - mockBotPosition.y;
  const dz = e.position.z - mockBotPosition.z;
  e.distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
});

console.log('Nearby entities:');
mockEntities.forEach(e => {
  const name = e.username || e.name;
  const type = detector.isPlayer(e) ? 'PLAYER' : (detector.isHostileMob(e) ? 'HOSTILE MOB' : 'passive mob');
  console.log(`  - ${name} (${type}) at ${e.distance.toFixed(1)}m`);
});

// Simulate targeting logic from entityHurt handler
console.log('\nSimulating targeting with neverAttackPlayers = true:');
let attacker = null;
let closestDistance = Infinity;

// First pass: prioritize hostile mobs
for (const e of mockEntities) {
  if (detector.isHostileMob(e) && e.distance < closestDistance) {
    closestDistance = e.distance;
    attacker = e;
  }
}

// Second pass: players (only if neverAttackPlayers = false)
const neverAttackPlayers = true;
if (!attacker && !neverAttackPlayers) {
  for (const e of mockEntities) {
    if (e.type === 'player' && e.distance < closestDistance) {
      closestDistance = e.distance;
      attacker = e;
    }
  }
}

if (attacker) {
  const attackerName = attacker.username || attacker.name;
  const attackerType = detector.isPlayer(attacker) ? 'player' : (detector.isHostileMob(attacker) ? 'hostile mob' : 'entity');
  console.log(`  ✓ Target selected: ${attackerName} (${attackerType}) at ${closestDistance.toFixed(1)}m`);
  console.log(`  Expected: Zombie (hostile mob) at 3.0m`);
  if (attackerName === 'Zombie') {
    console.log('  ✓ CORRECT: Bot will attack the mob, not the player!');
  } else {
    console.log('  ✗ WRONG: Bot should attack the zombie!');
  }
} else {
  console.log('  ✗ No attacker found (should have found Zombie)');
}

console.log('\nSimulating targeting with neverAttackPlayers = false:');
attacker = null;
closestDistance = Infinity;

// First pass: prioritize hostile mobs
for (const e of mockEntities) {
  if (detector.isHostileMob(e) && e.distance < closestDistance) {
    closestDistance = e.distance;
    attacker = e;
  }
}

// Second pass: players (only if neverAttackPlayers = false)
const neverAttackPlayers2 = false;
if (!attacker && !neverAttackPlayers2) {
  for (const e of mockEntities) {
    if (e.type === 'player' && e.distance < closestDistance) {
      closestDistance = e.distance;
      attacker = e;
    }
  }
}

if (attacker) {
  const attackerName = attacker.username || attacker.name;
  const attackerType = detector.isPlayer(attacker) ? 'player' : (detector.isHostileMob(attacker) ? 'hostile mob' : 'entity');
  console.log(`  ✓ Target selected: ${attackerName} (${attackerType}) at ${closestDistance.toFixed(1)}m`);
  console.log(`  Expected: Zombie (hostile mob) at 3.0m (mobs still prioritized)`);
  if (attackerName === 'Zombie') {
    console.log('  ✓ CORRECT: Bot prioritizes mob over player!');
  } else {
    console.log('  ✗ WRONG: Bot should prioritize the zombie!');
  }
}

console.log('\n=== Testing Scenario: Player near bot, mob hits bot ===\n');
console.log('Situation: Player is 2m away, Zombie is 3m away, bot gets hit');
console.log('Expected behavior: Bot attacks Zombie (closest hostile mob), not player');
console.log('Result: ' + (attacker && attacker.name === 'Zombie' ? '✓ PASS' : '✗ FAIL'));

console.log('\n=== All Tests Complete ===');
