// Find the exact location of unclosed braces
const fs = require('fs');

console.log('=== Finding Exact Location of Unclosed Braces ===\n');

const content = fs.readFileSync('./HunterX.js', 'utf8');
const lines = content.split('\n');

const combatAILine = 10850;
let braceCount = 0;
let braceStack = []; // Track where each brace was opened

console.log('Tracking brace openings and closings...\n');

for (let i = 0; i < combatAILine; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Count braces on this line
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  
  // Track each opening brace
  for (let j = 0; j < openBraces; j++) {
    braceStack.push({
      line: lineNum,
      content: line.trim(),
      index: j
    });
  }
  
  // Track each closing brace
  for (let j = 0; j < closeBraces; j++) {
    if (braceStack.length > 0) {
      braceStack.pop();
    } else {
      console.log(`⚠️  Extra closing brace at line ${lineNum}: ${line.trim()}`);
    }
  }
  
  braceCount += openBraces - closeBraces;
}

console.log(`\nFinal brace count: ${braceCount}`);
console.log(`Unclosed braces remaining: ${braceStack.length}`);

if (braceStack.length > 0) {
  console.log('\n🔍 Unclosed brace locations (oldest first):');
  braceStack.forEach((brace, index) => {
    console.log(`   ${index + 1}. Line ${brace.line}: ${brace.content.substring(0, 80)}`);
  });
  
  // Let's look at the context around the oldest unclosed brace
  const oldestBrace = braceStack[0];
  console.log(`\n🔍 Context around line ${oldestBrace.line} (oldest unclosed brace):`);
  
  for (let i = Math.max(0, oldestBrace.line - 5); i < Math.min(lines.length, oldestBrace.line + 5); i++) {
    const marker = i === oldestBrace.line - 1 ? '>>> ' : '    ';
    console.log(`${marker}${i + 1}: ${lines[i]}`);
  }
}

// Let's also check the last few lines before CombatAI for any obvious issues
console.log('\n🔍 Last 20 lines before CombatAI:');
for (let i = Math.max(0, combatAILine - 20); i < combatAILine; i++) {
  const line = lines[i];
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  
  if (openBraces > 0 || closeBraces > 0) {
    console.log(`   ${i + 1}: ${line.trim()} [${openBraces} open, ${closeBraces} close]`);
  } else {
    console.log(`   ${i + 1}: ${line}`);
  }
}

console.log('\n=== Analysis Complete ===');