// Check for unclosed braces before CombatAI
const fs = require('fs');

console.log('=== Checking for Unclosed Braces ===\n');

const content = fs.readFileSync('./HunterX.js', 'utf8');
const lines = content.split('\n');

const combatAILine = 10850; // CombatAI is at line 10850
let braceCount = 0;
let problematicLines = [];

console.log(`Analyzing braces from line 1 to ${combatAILine}...\n`);

for (let i = 0; i < combatAILine; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Count braces on this line
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  
  braceCount += openBraces - closeBraces;
  
  // Track significant changes
  if (openBraces > 0 || closeBraces > 0) {
    if (braceCount < 0) {
      problematicLines.push({
        line: lineNum,
        content: line.trim(),
        braceCount: braceCount,
        type: 'EXTRA_CLOSING_BRACE'
      });
    } else if (openBraces > 2 || closeBraces > 2) {
      problematicLines.push({
        line: lineNum,
        content: line.trim(),
        braceCount: braceCount,
        type: 'MANY_BRACES'
      });
    }
  }
}

console.log(`Final brace count before line ${combatAILine}: ${braceCount}`);

if (braceCount !== 0) {
  console.log('\n⚠️  UNCLOSURE DETECTED! There are unclosed blocks before CombatAI.');
  console.log('\nProblematic lines:');
  problematicLines.slice(-10).forEach(item => {
    console.log(`   Line ${item.line} (${item.type}): ${item.content} [count: ${item.braceCount}]`);
  });
  
  // Let's check around the ToolSelector class since it's right before CombatAI
  console.log('\nChecking around ToolSelector class (line 10700)...');
  for (let i = 10690; i < Math.min(10720, combatAILine); i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    
    if (openBraces > 0 || closeBraces > 0) {
      console.log(`   Line ${lineNum}: ${line.trim().substring(0, 80)} [${openBraces} open, ${closeBraces} close]`);
    }
  }
  
} else {
  console.log('\n✓ No unclosed braces detected before CombatAI');
}

// Let's also check if there are any incomplete strings or comments
console.log('\n=== Checking for Incomplete Strings ===\n');

let inString = false;
let stringChar = '';
let inComment = false;
let commentType = '';

for (let i = Math.max(0, combatAILine - 100); i < combatAILine; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    const nextChar = j < line.length - 1 ? line[j + 1] : '';
    
    // Check for comments
    if (!inString && !inComment) {
      if (char === '/' && nextChar === '/') {
        inComment = true;
        commentType = '//';
        break; // Skip rest of line
      } else if (char === '/' && nextChar === '*') {
        inComment = true;
        commentType = '/*';
        j++; // Skip the *
      } else if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
      }
    } else if (inString) {
      if (char === stringChar && (j === 0 || line[j-1] !== '\\')) {
        inString = false;
        stringChar = '';
      }
    } else if (inComment) {
      if (commentType === '/*' && char === '*' && nextChar === '/') {
        inComment = false;
        commentType = '';
        j++; // Skip the /
      }
    }
  }
  
  // Single-line comments end at line end
  if (inComment && commentType === '//') {
    inComment = false;
    commentType = '';
  }
}

if (inString) {
  console.log(`⚠️  Unclosed string detected! Started with '${stringChar}'`);
} else if (inComment) {
  console.log(`⚠️  Unclosed comment detected! Started with '${commentType}'`);
} else {
  console.log('✓ No unclosed strings or comments detected');
}

console.log('\n=== Check Complete ===');