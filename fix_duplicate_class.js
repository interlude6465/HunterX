// This script will fix the duplicate EquipmentManager class issue in HunterX.js

const fs = require('fs');

// Read the original file
const content = fs.readFileSync('./HunterX.js', 'utf8');

// Find the duplicate EquipmentManager class and remove it
// The duplicate starts around line 24476 and ends at line 24863

const lines = content.split('\n');

let inDuplicateClass = false;
let braceCount = 0;
let startRemoving = false;
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we're at the start of the duplicate class
  if (line.includes('constructor(bot) {') && i > 24000) {
    startRemoving = true;
    inDuplicateClass = true;
    braceCount = 0;
    continue;
  }
  
  if (startRemoving) {
    // Count braces to track when class ends
    braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
    
    // When we've closed all braces, we're done removing
    if (braceCount < 0 && inDuplicateClass) {
      startRemoving = false;
      inDuplicateClass = false;
      continue;
    }
    
    // Skip lines while removing
    if (startRemoving) {
      continue;
    }
  }
  
  // Keep the line if we're not removing
  if (!startRemoving) {
    fixedLines.push(line);
  }
}

// Write the fixed content back
fs.writeFileSync('./HunterX.js', fixedLines.join('\n'), 'utf8');

console.log('Fixed duplicate EquipmentManager class issue!');
console.log(`Original file had ${lines.length} lines, fixed file has ${fixedLines.length} lines`);