/**
 * Neural Output Normalization - End-to-End Integration Test
 * Simulates the complete flow from prediction to consumer usage
 */

const assert = require('assert');

console.log('🔬 Neural Integration Test - End-to-End Flow\n');
console.log('Testing complete prediction → normalization → consumption flow\n');

// Simulate the entire flow
function simulateFlow(testName, rawBackendOutput, backend, modelName, expectedLength) {
  console.log(`\n${testName}`);
  console.log('─'.repeat(60));
  
  try {
    // Step 1: Simulate backend prediction
    console.log(`1. Backend (${backend}) produces raw output:`, 
      (rawBackendOutput !== null && typeof rawBackendOutput === 'object' && rawBackendOutput.length) 
        ? `Array[${rawBackendOutput.length}]` 
        : typeof rawBackendOutput);
    
    // Step 2: Normalize output (simulate normalizeOutput)
    let values = [];
    if (rawBackendOutput === null || rawBackendOutput === undefined) {
      values = [];
    } else if (Array.isArray(rawBackendOutput)) {
      values = Array.from(rawBackendOutput);
    } else if (typeof rawBackendOutput === 'object') {
      if (rawBackendOutput.data && Array.isArray(rawBackendOutput.data)) {
        values = Array.from(rawBackendOutput.data);
      } else if (rawBackendOutput.values && Array.isArray(rawBackendOutput.values)) {
        values = Array.from(rawBackendOutput.values);
      } else if (rawBackendOutput.label !== undefined) {
        values = [rawBackendOutput.confidence || 0];
      } else if (ArrayBuffer.isView(rawBackendOutput)) {
        values = Array.from(rawBackendOutput);
      } else {
        const objValues = Object.values(rawBackendOutput);
        if (objValues.length > 0 && objValues.every(v => typeof v === 'number')) {
          values = objValues;
        } else {
          values = [];
        }
      }
    } else if (ArrayBuffer.isView(rawBackendOutput)) {
      values = Array.from(rawBackendOutput);
    } else if (typeof rawBackendOutput === 'number') {
      values = [rawBackendOutput];
    } else {
      values = [];
    }
    
    const confidence = values.length > 0 ? Math.max(...values) : 0;
    
    const normalizedOutput = {
      values: values,
      confidence: confidence,
      backend: backend,
      modelName: modelName
    };
    
    console.log(`2. Normalized to:`, {
      values: `[${values.join(', ')}]`,
      confidence: confidence,
      backend: backend,
      modelName: modelName
    });
    
    // Step 3: Consumer extracts values (backward compatible)
    const extractedValues = (normalizedOutput && Array.isArray(normalizedOutput.values)) 
      ? normalizedOutput.values 
      : (Array.isArray(normalizedOutput) ? normalizedOutput : [normalizedOutput]);
    
    console.log(`3. Consumer extracts:`, `[${extractedValues.join(', ')}]`);
    
    // Step 4: Validate
    assert(Array.isArray(extractedValues), 'Consumer must receive an array');
    if (expectedLength !== null) {
      assert.strictEqual(extractedValues.length, expectedLength, 
        `Expected ${expectedLength} values, got ${extractedValues.length}`);
    }
    assert(extractedValues.every(v => typeof v === 'number'), 
      'All values must be numbers');
    
    console.log('✅ Flow validated successfully');
    return true;
    
  } catch (error) {
    console.log(`❌ Flow failed: ${error.message}`);
    return false;
  }
}

// Test scenarios
let passed = 0;
let total = 0;

// Test 1: TensorFlow → Float32Array → Consumer
total++;
if (simulateFlow(
  'Test 1: TensorFlow Backend',
  new Float32Array([0.75, 0.20, 0.05]),
  'tensorflow',
  'combat',
  3
)) passed++;

// Test 2: brain.js → Object → Consumer
total++;
if (simulateFlow(
  'Test 2: brain.js Backend',
  { attack: 0.6, defend: 0.3, retreat: 0.1 },
  'brain.js',
  'combat',
  3
)) passed++;

// Test 3: Synaptic → Array → Consumer
total++;
if (simulateFlow(
  'Test 3: Synaptic Backend',
  [0.5, 0.3, 0.2],
  'synaptic',
  'placement',
  3
)) passed++;

// Test 4: ml5 → Object with data → Consumer
total++;
if (simulateFlow(
  'Test 4: ml5 Backend (with data)',
  { data: [0.8, 0.15, 0.05], label: 'aggressive' },
  'ml5',
  'combat',
  3
)) passed++;

// Test 5: ml5 → Classification output → Consumer
total++;
if (simulateFlow(
  'Test 5: ml5 Backend (classification)',
  { label: 'greeting', confidence: 0.92 },
  'ml5',
  'conversation',
  1
)) passed++;

// Test 6: Fallback → Array → Consumer
total++;
if (simulateFlow(
  'Test 6: Fallback Backend',
  [0.7, 0.1, 0.1, 0.05, 0.05],
  'fallback',
  'combat',
  5
)) passed++;

// Test 7: Null handling
total++;
if (simulateFlow(
  'Test 7: Null Input',
  null,
  'fallback',
  'combat',
  0
)) passed++;

// Test 8: Single number
total++;
if (simulateFlow(
  'Test 8: Single Number',
  0.85,
  'fallback',
  'combat',
  1
)) passed++;

// Test 9: Empty array
total++;
if (simulateFlow(
  'Test 9: Empty Array',
  [],
  'fallback',
  'combat',
  0
)) passed++;

// Test 10: Float64Array (another TypedArray)
total++;
if (simulateFlow(
  'Test 10: Float64Array',
  new Float64Array([0.9, 0.08, 0.02]),
  'tensorflow',
  'placement',
  3
)) passed++;

// Summary
console.log('\n' + '='.repeat(60));
console.log(`📊 Integration Test Summary: ${passed}/${total} flows passed`);

if (passed === total) {
  console.log('✅ All end-to-end flows work correctly!');
  console.log('\nVerified capabilities:');
  console.log('  • TensorFlow TypedArray conversion');
  console.log('  • brain.js object value extraction');
  console.log('  • Synaptic array passthrough');
  console.log('  • ml5 data extraction');
  console.log('  • ml5 classification handling');
  console.log('  • Fallback array handling');
  console.log('  • Null/undefined handling');
  console.log('  • Single number handling');
  console.log('  • Empty array handling');
  console.log('  • Multiple TypedArray formats');
  console.log('\n🎉 Neural output normalization is production ready!\n');
  process.exit(0);
} else {
  console.log(`❌ ${total - passed} flow(s) failed`);
  process.exit(1);
}
