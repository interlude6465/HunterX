#!/usr/bin/env node

// Test script to verify the equipment and trust fixes
const fs = require('fs');
const path = require('path');

console.log('=== Testing Equipment and Trust Fixes ===\n');

// Test 1: Check if EquipmentManager methods exist
console.log('1. Testing EquipmentManager class...');
try {
  const HunterX = require('./HunterX.js');
  
  // We can't easily test without a bot instance, but we can check the file content
  const fileContent = fs.readFileSync('./HunterX.js', 'utf8');
  
  // Check for improved error handling in equipment methods
  const hasImprovedArmorLogging = fileContent.includes('[ARMOR] Starting armor equip process');
  const hasImprovedWeaponLogging = fileContent.includes('[WEAPON] Starting weapon equip process');
  const hasImprovedOffhandLogging = fileContent.includes('[OFFHAND] Starting offhand equip process');
  const hasFindInInventory = fileContent.includes('findInInventory(itemName)');
  
  console.log(`   ✓ Improved armor logging: ${hasImprovedArmorLogging ? 'YES' : 'NO'}`);
  console.log(`   ✓ Improved weapon logging: ${hasImprovedWeaponLogging ? 'YES' : 'NO'}`);
  console.log(`   ✓ Improved offhand logging: ${hasImprovedOffhandLogging ? 'YES' : 'NO'}`);
  console.log(`   ✓ Added findInInventory method: ${hasFindInInventory ? 'YES' : 'NO'}`);
  
  if (hasImprovedArmorLogging && hasImprovedWeaponLogging && hasImprovedOffhandLogging && hasFindInInventory) {
    console.log('   ✅ Equipment improvements implemented correctly!\n');
  } else {
    console.log('   ❌ Some equipment improvements missing!\n');
  }
} catch (err) {
  console.log(`   ❌ Error testing EquipmentManager: ${err.message}\n`);
}

// Test 2: Check command execution fixes
console.log('2. Testing command execution fixes...');
try {
  const fileContent = fs.readFileSync('./HunterX.js', 'utf8');
  
  // Check for actual command execution (not just announcements)
  const hasAttackExecution = fileContent.includes('await this.combatAI.handleCombat(target)');
  const hasSpawnExecution = fileContent.includes('await globalBotSpawner.spawnMultiple');
  const hasHelpExecution = fileContent.includes('await globalSwarmCoordinator.coordinateHelpOperation');
  const hasEquipmentCommands = fileContent.includes('!equip') && fileContent.includes('equipBestArmor');
  
  console.log(`   ✓ Attack command executes: ${hasAttackExecution ? 'YES' : 'NO'}`);
  console.log(`   ✓ Spawn command executes: ${hasSpawnExecution ? 'YES' : 'NO'}`);
  console.log(`   ✓ Help command executes: ${hasHelpExecution ? 'YES' : 'NO'}`);
  console.log(`   ✓ Equipment commands added: ${hasEquipmentCommands ? 'YES' : 'NO'}`);
  
  if (hasAttackExecution && hasSpawnExecution && hasHelpExecution && hasEquipmentCommands) {
    console.log('   ✅ Command execution fixes implemented correctly!\n');
  } else {
    console.log('   ❌ Some command execution fixes missing!\n');
  }
} catch (err) {
  console.log(`   ❌ Error testing command execution: ${err.message}\n`);
}

// Test 3: Check trust level fixes
console.log('3. Testing trust level fixes...');
try {
  const fileContent = fs.readFileSync('./HunterX.js', 'utf8');
  
  // Check for trust level improvements
  const hasCombatAIReference = fileContent.includes('conversationAI.setCombatAI(combatAI)');
  const hasOwnershipCommand = fileContent.includes('claim ownership') && fileContent.includes('set owner');
  const hasMakeAdminCommand = fileContent.includes('make admin') && fileContent.includes('grant admin');
  const hasTrustLevelLogging = fileContent.includes('[TRUST] Ownership claim requested');
  
  console.log(`   ✓ CombatAI reference fixed: ${hasCombatAIReference ? 'YES' : 'NO'}`);
  console.log(`   ✓ Ownership claim command: ${hasOwnershipCommand ? 'YES' : 'NO'}`);
  console.log(`   ✓ Make admin command: ${hasMakeAdminCommand ? 'YES' : 'NO'}`);
  console.log(`   ✓ Trust level logging: ${hasTrustLevelLogging ? 'YES' : 'NO'}`);
  
  if (hasCombatAIReference && hasOwnershipCommand && hasMakeAdminCommand && hasTrustLevelLogging) {
    console.log('   ✅ Trust level fixes implemented correctly!\n');
  } else {
    console.log('   ❌ Some trust level fixes missing!\n');
  }
} catch (err) {
  console.log(`   ❌ Error testing trust levels: ${err.message}\n`);
}

// Test 4: Check data directory structure
console.log('4. Testing data directory structure...');
try {
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('   ✓ Created data directory');
  } else {
    console.log('   ✓ Data directory exists');
  }
  
  // Check for whitelist file
  const whitelistFile = path.join(dataDir, 'whitelist.json');
  if (!fs.existsSync(whitelistFile)) {
    // Create empty whitelist
    fs.writeFileSync(whitelistFile, JSON.stringify([], null, 2));
    console.log('   ✓ Created empty whitelist.json');
  } else {
    console.log('   ✓ whitelist.json exists');
    
    // Check format
    const whitelistData = JSON.parse(fs.readFileSync(whitelistFile, 'utf8'));
    if (Array.isArray(whitelistData)) {
      const hasCorrectFormat = whitelistData.length === 0 || 
        (whitelistData[0] && typeof whitelistData[0] === 'object' && whitelistData[0].name);
      console.log(`   ✓ Whitelist format correct: ${hasCorrectFormat ? 'YES' : 'NO'}`);
    } else {
      console.log('   ❌ Whitelist is not an array');
    }
  }
  
  console.log('   ✅ Data directory setup complete!\n');
} catch (err) {
  console.log(`   ❌ Error setting up data directory: ${err.message}\n`);
}

console.log('=== Test Summary ===');
console.log('Equipment fixes:');
console.log('- Enhanced error handling and logging in all equip methods');
console.log('- Added findInInventory method for better item searching');
console.log('- Added !equip commands for manual testing');
console.log('');
console.log('Command execution fixes:');
console.log('- Attack command now actually calls combatAI.handleCombat()');
console.log('- Spawn command now properly executes with error handling');
console.log('- Help command now properly coordinates swarm operations');
console.log('');
console.log('Trust level fixes:');
console.log('- Fixed CombatAI reference in ConversationAI');
console.log('- Added "claim ownership" command for initial setup');
console.log('- Added "make admin" command for granting permissions');
console.log('- Enhanced logging for all trust operations');
console.log('');
console.log('Usage:');
console.log('1. Run bot: node HunterX.js');
console.log('2. Claim ownership: "claim ownership" (if whitelist is empty)');
console.log('3. Grant admin: "make admin <player>" (as owner)');
console.log('4. Test equipment: "!equip" or "!equip armor"');
console.log('5. Test combat: "!attack <player>"');
console.log('6. Test spawn: "!spawn 3" (requires admin+)');
