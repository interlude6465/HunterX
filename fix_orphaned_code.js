const fs = require('fs');

// Read the file
const content = fs.readFileSync('./HunterX.js', 'utf8');
const lines = content.split('\n');

// Find the start of leftover duplicate code (around line 24614)
let startRemoving = false;
let braceCount = 0;
const fixedLines = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  
  // Check for the orphaned setupInventoryListener method
  if (line.trim() === 'setupInventoryListener() {' && i > 24000) {
    startRemoving = true;
    braceCount = 1;
    console.log(`Found orphaned method at line ${i + 1}, starting removal`);
    i++;
    continue;
  }
  
  if (startRemoving) {
    // Count braces to track when the orphaned code ends
    braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
    
    if (braceCount <= 0) {
      console.log(`Orphaned code ends at line ${i + 1}`);
      startRemoving = false;
      // Skip the closing brace and continue
      i++;
      continue;
    }
    
    // Skip lines while removing
    i++;
    continue;
  }
  
  // Keep the line if we're not removing
  fixedLines.push(line);
  i++;
}

// Write back the fixed content
fs.writeFileSync('./HunterX.js', fixedLines.join('\n'), 'utf8');
console.log(`Fixed orphaned code! Removed ${lines.length - fixedLines.length} lines.`);
console.log(`New file has ${fixedLines.length} lines.`);