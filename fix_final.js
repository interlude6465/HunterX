#!/usr/bin/env node
const fs = require('fs');

// Read the currently broken file
let content = fs.readFileSync('./HunterX.js', 'utf8');

// Remove the orphaned code that appeared after the class ended
// This is the broken duplicate code left from the refactoring

// Find the closing brace of the second-to-last class before TaskQueue
// Then find where the legitimate code resumes

// Strategy: Find "// === SUPPLY CHAIN TASK QUEUE SYSTEM ===" and extract everything up to there
const supplyChainIndex = content.indexOf('// === SUPPLY CHAIN TASK QUEUE SYSTEM ===');

if (supplyChainIndex === -1) {
  console.error('Could not find SUPPLY CHAIN marker');
  process.exit(1);
}

// Find where the orphaned methods start (after a }  \n at the end of a class)
// Look backwards from supplyChainIndex to find the last }
let lastClosingBraceIndex = content.lastIndexOf('}', supplyChainIndex);
// Find the newline after this closing brace
let startOfOrphanedCode = content.indexOf('\n', lastClosingBraceIndex) + 1;

// Get the original file from git
const gitContent = require('child_process').execSync('git show HEAD:HunterX.js').toString();

// Find where in the original file the SUPPLY CHAIN section is
const gitSupplyChainIndex = gitContent.indexOf('// === SUPPLY CHAIN TASK QUEUE SYSTEM ===');
const gitLastClosingBrace = gitContent.lastIndexOf('}', gitSupplyChainIndex);
const gitStartOfSupplyChain = gitContent.indexOf('\n', gitLastClosingBrace) + 1;

// Take everything from the original up to the SUPPLY CHAIN section
const goodPart = gitContent.substring(0, gitStartOfSupplyChain);
const supplyChainPart = gitContent.substring(gitStartOfSupplyChain);

// Now apply our equipment listener changes to the good part
let fixedContent = goodPart;

// Add the setupInventoryListener call in the constructor
if (!fixedContent.includes('this.setupInventoryListener();')) {
  fixedContent = fixedContent.replace(
    "console.log('[EQUIPMENT] Equipment Manager initialized');",
    "console.log('[EQUIPMENT] Equipment Manager initialized');\n    \n    // Set up inventory change listener for auto-equipping\n    this.setupInventoryListener();"
  );
}

// Add the setupInventoryListener method
if (!fixedContent.includes('// === INVENTORY LISTENER FOR AUTO-EQUIP ===')) {
  fixedContent = fixedContent.replace(
    '// === AUTOMATIC ARMOR EQUIPPING ===',
    `// === INVENTORY LISTENER FOR AUTO-EQUIP ===
  setupInventoryListener() {
    // Set up listeners after bot spawns to ensure inventory is ready
    if (this.bot.inventory) {
      // Listen for inventory updates to auto-equip armor
      this.bot.inventory.on('updateSlot', async (oldItem, newItem) => {
        if (newItem && this.isArmorItem(newItem.name)) {
          console.log(\`[EQUIPMENT] Detected armor pickup: \${newItem.name}\`);
          await this.autoEquipArmor(newItem);
        }
      });
      
      console.log('[EQUIPMENT] Inventory listener setup complete');
    } else {
      // If inventory not ready, set up a listener for when it becomes available
      this.bot.once('spawn', () => {
        setTimeout(() => {
          this.setupInventoryListener();
        }, 1000); // Wait a second after spawn for inventory to initialize
      });
    }
    
    // Listen for entity drops (items dropped by players/entities)
    this.bot.on('entitySpawn', (entity) => {
      if (entity.name === 'item') {
        console.log('[EQUIPMENT] Item dropped nearby');
        // Check if it's armor that we might pick up
        if (entity.metadata && entity.metadata[8] && entity.metadata[8].itemId) {
          const itemName = entity.metadata[8].itemId;
          if (this.isArmorItem(itemName)) {
            console.log(\`[EQUIPMENT] Armor item detected nearby: \${itemName}\`);
          }
        }
      }
    });
    
    // Listen for player drop events
    this.bot.on('playerCollect', (collector, collectedEntity) => {
      if (collector.username === this.bot.username && collectedEntity.name === 'item') {
        console.log('[EQUIPMENT] Bot collected an item');
        // Inventory updateSlot event will handle auto-equip
      }
    });
  }
  
  // === AUTOMATIC ARMOR EQUIPPING ===`
  );
}

// Combine the fixed equipment manager with the supply chain code
const finalContent = fixedContent + supplyChainPart;

// Write back
fs.writeFileSync('./HunterX.js', finalContent, 'utf8');

console.log('✅ Fixed HunterX.js successfully!');
