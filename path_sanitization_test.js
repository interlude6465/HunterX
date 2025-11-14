const fs = require('fs');
const path = require('path');
const assert = require('assert');

const {
  sanitizeFileName,
  ensureSafeFileName,
  resolveSafePath,
  createSafeFileName
} = require('./utils/pathSecurity');

const PROJECT_ROOT = __dirname;
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const SCHEMATIC_DIR = path.join(DATA_DIR, 'schematics');
const RL_SNAPSHOT_DIR = path.join(DATA_DIR, 'rl_snapshots');
const DUPES_DIR = path.join(PROJECT_ROOT, 'dupes');

[SCHEMATIC_DIR, RL_SNAPSHOT_DIR, DUPES_DIR].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

function isWithin(baseDir, targetPath) {
  const relative = path.relative(baseDir, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

console.log('=== PATH SANITIZATION TESTS ===\n');

// Test 1: Schematic upload sanitization blocks traversal attempts
(() => {
  const userProvided = '../evil.schem';
  const timestamp = Date.now();
  const incomingName = path.basename(userProvided);
  const safeFileName = createSafeFileName(incomingName, {
    fallbackBase: `schematic_${timestamp}`,
    allowedExtensions: ['.schem', '.schematic', '.nbt'],
    defaultExtension: '.schem'
  });
  const safeBaseName = ensureSafeFileName(safeFileName.replace(/\.[^.]+$/, ''), `schematic_${timestamp}`);
  const storagePath = resolveSafePath(SCHEMATIC_DIR, `${safeBaseName}.json`);

  assert.ok(isWithin(SCHEMATIC_DIR, storagePath), 'Schematic path escaped safe directory');
  assert.strictEqual(path.basename(storagePath), `${safeBaseName}.json`);
  assert.ok(!storagePath.includes('..'));
  console.log('✓ Schematic traversal attempt neutralized');
})();

// Test 2: Plugin upload sanitization keeps files under dupes directory
(() => {
  const userProvided = '../evil.jar';
  const timestamp = Date.now();
  const incomingName = path.basename(userProvided);
  const safeFileName = createSafeFileName(incomingName, {
    fallbackBase: `plugin_${timestamp}`,
    allowedExtensions: ['.jar'],
    defaultExtension: '.jar'
  });
  const uploadPath = resolveSafePath(DUPES_DIR, `uploaded_${timestamp}_${safeFileName}`);

  assert.ok(isWithin(DUPES_DIR, uploadPath), 'Plugin upload path escaped dupes directory');
  assert.ok(uploadPath.endsWith(`${safeFileName}`));
  console.log('✓ Plugin traversal attempt neutralized');
})();

// Test 3: RL export sanitization keeps snapshots inside data/rl_snapshots
(() => {
  const domainName = '../danger';
  const timestamp = Date.now();
  const safeDomain = ensureSafeFileName(domainName, `domain_${timestamp}`);
  const snapshotFile = `${safeDomain}_${timestamp}.json`;
  const snapshotPath = resolveSafePath(RL_SNAPSHOT_DIR, snapshotFile);

  assert.ok(isWithin(RL_SNAPSHOT_DIR, snapshotPath), 'RL snapshot escaped safe directory');
  assert.strictEqual(path.basename(snapshotPath), snapshotFile);
  console.log('✓ RL snapshot traversal attempt neutralized');
})();

// Test 4: Valid schematic names remain unchanged
(() => {
  const userProvided = 'mega_castle.schem';
  const timestamp = Date.now();
  const safeFileName = createSafeFileName(userProvided, {
    fallbackBase: `schematic_${timestamp}`,
    allowedExtensions: ['.schem', '.schematic', '.nbt'],
    defaultExtension: '.schem'
  });

  assert.strictEqual(safeFileName, userProvided, 'Valid schematic name was altered unnecessarily');
  console.log('✓ Valid schematic upload remains intact');
})();

// Test 5: Fallback triggers when sanitization results in empty base name
(() => {
  const userProvided = '.schem';
  const timestamp = Date.now();
  const safeFileName = createSafeFileName(userProvided, {
    fallbackBase: `schematic_${timestamp}`,
    allowedExtensions: ['.schem'],
    defaultExtension: '.schem'
  });
  const safeBaseName = ensureSafeFileName(safeFileName.replace(/\.[^.]+$/, ''), `schematic_${timestamp}`);

  assert.ok(safeBaseName.startsWith('schematic_'), 'Fallback base name was not applied');
  assert.ok(sanitizeFileName(safeBaseName).length > 0, 'Sanitized fallback should not be empty');
  console.log('✓ Empty base names receive sanitized fallback');
})();

// Test 6: resolveSafePath rejects direct traversal attempts
(() => {
  assert.throws(() => resolveSafePath(SCHEMATIC_DIR, '../outside.json'), /Path traversal attempt/, 'resolveSafePath should reject traversal');
  console.log('✓ resolveSafePath rejects traversal paths');
})();

console.log('\n✅ All path sanitization tests passed');
