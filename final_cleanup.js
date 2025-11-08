const fs = require('fs');

// Read the file
const content = fs.readFileSync('./HunterX.js', 'utf8');
const lines = content.split('\n');

// Find and remove all orphaned methods after line 24600
// These are methods that are not inside any class definition

const fixedLines = [];
let i = 0;
let inSupplyChainOrLater = false;

while (i < lines.length) {
  const line = lines[i];
  
  // Check if we're in the SUPPLY CHAIN TASK QUEUE SYSTEM section
  if (line.includes('// === SUPPLY CHAIN TASK QUEUE SYSTEM ===')) {
    inSupplyChainOrLater = true;
    console.log(`Found SUPPLY CHAIN section at line ${i + 1}`);
  }
  
  // Skip orphaned methods that appear after line 24600
  if (inSupplyChainOrLater && i > 24600) {
    // Check if this line is the start of an orphaned method
    if ((line.trim().startsWith('async ') || line.trim().startsWith('async initialize') ||
         line.trim() === 'findBestArmorForSlot(inventory, slot) {' ||
         line.trim() === 'calculateArmorValue(item) {' ||
         line.trim() === 'async equipBestWeapon(situation = \'combat\') {' ||
         line.trim() === 'findWeapons(inventory) {' ||
         line.trim() === 'calculateWeaponScore(item, situation) {' ||
         line.trim() === 'async equipOffhand() {' ||
         line.trim() === 'async organizeHotbar() {' ||
         line.trim() === 'async switchToCombatMode() {' ||
         line.trim() === 'async switchToTaskMode(task) {' ||
         line.trim() === 'async update() {' ||
         line.trim() === 'isArmor(name) {' ||
         line.trim() === 'getSlotType(slot) {' ||
         line.trim() === 'getSlotForItem(itemName) {' ||
         line.trim() === 'getInventorySlot(equipmentSlot) {' ||
         line.trim() === 'async equipItem(itemName) {' ||
         line.trim() === 'checkEquipment() {') &&
        !inSupplyChainOrLater) {
      // Start skipping this method
      let braceCount = 1;
      i++;
      
      while (i < lines.length && braceCount > 0) {
        const methodLine = lines[i];
        braceCount += (methodLine.match(/{/g) || []).length - (methodLine.match(/}/g) || []).length;
        i++;
      }
      console.log(`Removed orphaned method`);
      continue;
    }
  }
  
  // Keep the line if we're not removing
  fixedLines.push(line);
  i++;
}

// Write back the fixed content
fs.writeFileSync('./HunterX.js', fixedLines.join('\n'), 'utf8');
console.log(`Cleanup complete! New file has ${fixedLines.length} lines (was ${lines.length}).`);