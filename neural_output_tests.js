/**
 * Neural Output Normalization Tests
 * Tests the normalized output format across all ML backends
 */

const assert = require('assert');

// Mock NeuralBrainManager class for testing
class MockNeuralBrainManager {
  constructor() {
    this.type = null;
    this.models = {};
  }

  /**
   * Normalize neural network output to a consistent format
   * @param {*} rawOutput - Raw output from any backend
   * @param {string} backend - Backend type (ml5, brain.js, synaptic, tensorflow, fallback)
   * @param {string} modelName - Model name (combat, placement, conversation, etc)
   * @returns {Object} Normalized output with values array, confidence, and metadata
   */
  normalizeOutput(rawOutput, backend, modelName) {
    let values = [];
    
    // Convert various output types to plain array
    if (rawOutput === null || rawOutput === undefined) {
      values = [];
    } else if (Array.isArray(rawOutput)) {
      values = Array.from(rawOutput);
    } else if (typeof rawOutput === 'object') {
      // Handle ml5 and brain.js object outputs
      if (rawOutput.data && Array.isArray(rawOutput.data)) {
        values = Array.from(rawOutput.data);
      } else if (rawOutput.values && Array.isArray(rawOutput.values)) {
        values = Array.from(rawOutput.values);
      } else if (rawOutput.label !== undefined) {
        // ml5 classification output
        values = [rawOutput.confidence || 0];
      } else if (ArrayBuffer.isView(rawOutput)) {
        // TypedArray (Float32Array, etc) from TensorFlow
        values = Array.from(rawOutput);
      } else {
        // Generic object - try to extract numeric values
        const objValues = Object.values(rawOutput);
        if (objValues.length > 0 && objValues.every(v => typeof v === 'number')) {
          values = objValues;
        } else {
          values = [];
        }
      }
    } else if (ArrayBuffer.isView(rawOutput)) {
      // TypedArray directly
      values = Array.from(rawOutput);
    } else if (typeof rawOutput === 'number') {
      values = [rawOutput];
    } else {
      values = [];
    }
    
    // Calculate overall confidence from values
    // For classification: max probability
    // For regression: inverse of variance or just the mean
    let confidence = 0;
    if (values.length > 0) {
      const allNumeric = values.every(v => typeof v === 'number' && !isNaN(v));
      if (allNumeric) {
        confidence = Math.max(...values);
      }
    }
    
    return {
      values: values,
      confidence: confidence,
      backend: backend,
      modelName: modelName
    };
  }
}

// Test Suite
function runTests() {
  console.log('🧪 Starting Neural Output Normalization Tests...\n');
  
  const manager = new MockNeuralBrainManager();
  let passedTests = 0;
  let totalTests = 0;

  // Helper function to run a test
  function test(name, fn) {
    totalTests++;
    try {
      fn();
      console.log(`✅ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
    }
  }

  // Test 1: Plain Array (Fallback mode)
  test('Plain Array (Fallback)', () => {
    const input = [0.8, 0.1, 0.05, 0.03, 0.02];
    const result = manager.normalizeOutput(input, 'fallback', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.deepStrictEqual(result.values, input, 'values should match input');
    assert.strictEqual(result.confidence, 0.8, 'confidence should be max value');
    assert.strictEqual(result.backend, 'fallback', 'backend should be fallback');
    assert.strictEqual(result.modelName, 'combat', 'modelName should be combat');
  });

  // Test 2: TypedArray (TensorFlow)
  test('TypedArray (TensorFlow)', () => {
    const input = new Float32Array([0.7, 0.2, 0.1]);
    const result = manager.normalizeOutput(input, 'tensorflow', 'placement');
    
    assert(Array.isArray(result.values), 'values should be a plain array');
    assert.strictEqual(result.values.length, 3, 'should have 3 values');
    assert(Math.abs(result.values[0] - 0.7) < 0.01, 'first value should be approximately 0.7');
    assert(Math.abs(result.confidence - 0.7) < 0.01, 'confidence should be approximately max value');
    assert.strictEqual(result.backend, 'tensorflow', 'backend should be tensorflow');
  });

  // Test 3: ml5 Object with data property
  test('ml5 Object with data property', () => {
    const input = { data: [0.6, 0.3, 0.1], label: 'class1' };
    const result = manager.normalizeOutput(input, 'ml5', 'conversation');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.deepStrictEqual(result.values, [0.6, 0.3, 0.1], 'values should match data');
    assert.strictEqual(result.confidence, 0.6, 'confidence should be max value');
    assert.strictEqual(result.backend, 'ml5', 'backend should be ml5');
  });

  // Test 4: ml5 Classification output with label
  test('ml5 Classification with label', () => {
    const input = { label: 'aggressive', confidence: 0.85 };
    const result = manager.normalizeOutput(input, 'ml5', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.strictEqual(result.values[0], 0.85, 'should extract confidence');
    assert.strictEqual(result.confidence, 0.85, 'confidence should match');
  });

  // Test 5: brain.js Object output
  test('brain.js Object output', () => {
    const input = { attack: 0.7, defend: 0.2, retreat: 0.1 };
    const result = manager.normalizeOutput(input, 'brain.js', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.strictEqual(result.values.length, 3, 'should have 3 values');
    assert(result.values.includes(0.7), 'should include 0.7');
    assert(result.values.includes(0.2), 'should include 0.2');
  });

  // Test 6: Synaptic Array output
  test('Synaptic Array output', () => {
    const input = [0.5, 0.3, 0.2];
    const result = manager.normalizeOutput(input, 'synaptic', 'placement');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.deepStrictEqual(result.values, input, 'values should match input');
    assert.strictEqual(result.confidence, 0.5, 'confidence should be max value');
  });

  // Test 7: Null input
  test('Null input', () => {
    const result = manager.normalizeOutput(null, 'fallback', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.strictEqual(result.values.length, 0, 'values should be empty');
    assert.strictEqual(result.confidence, 0, 'confidence should be 0');
  });

  // Test 8: Undefined input
  test('Undefined input', () => {
    const result = manager.normalizeOutput(undefined, 'fallback', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.strictEqual(result.values.length, 0, 'values should be empty');
    assert.strictEqual(result.confidence, 0, 'confidence should be 0');
  });

  // Test 9: Single number input
  test('Single number input', () => {
    const result = manager.normalizeOutput(0.75, 'fallback', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.strictEqual(result.values.length, 1, 'should have 1 value');
    assert.strictEqual(result.values[0], 0.75, 'value should be 0.75');
    assert.strictEqual(result.confidence, 0.75, 'confidence should be 0.75');
  });

  // Test 10: Object with values property
  test('Object with values property', () => {
    const input = { values: [0.9, 0.05, 0.05], metadata: 'test' };
    const result = manager.normalizeOutput(input, 'ml5', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.deepStrictEqual(result.values, [0.9, 0.05, 0.05], 'values should match');
    assert.strictEqual(result.confidence, 0.9, 'confidence should be max value');
  });

  // Test 11: Empty array
  test('Empty array', () => {
    const result = manager.normalizeOutput([], 'fallback', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.strictEqual(result.values.length, 0, 'values should be empty');
    assert.strictEqual(result.confidence, 0, 'confidence should be 0');
  });

  // Test 12: Mixed type object (should return empty array)
  test('Mixed type object', () => {
    const input = { foo: 'bar', baz: 123 };
    const result = manager.normalizeOutput(input, 'fallback', 'combat');
    
    assert(Array.isArray(result.values), 'values should be an array');
    assert.strictEqual(result.values.length, 0, 'values should be empty for mixed types');
  });

  // Test 13: Float64Array (another TypedArray)
  test('Float64Array', () => {
    const input = new Float64Array([0.88, 0.12]);
    const result = manager.normalizeOutput(input, 'tensorflow', 'dupe');
    
    assert(Array.isArray(result.values), 'values should be a plain array');
    assert.strictEqual(result.values.length, 2, 'should have 2 values');
    assert.strictEqual(result.values[0], 0.88, 'first value should be 0.88');
    assert.strictEqual(result.confidence, 0.88, 'confidence should be max value');
  });

  // Test 14: Verify metadata is preserved
  test('Metadata preservation', () => {
    const input = [0.5, 0.3, 0.2];
    const result = manager.normalizeOutput(input, 'custom-backend', 'custom-model');
    
    assert.strictEqual(result.backend, 'custom-backend', 'backend should be preserved');
    assert.strictEqual(result.modelName, 'custom-model', 'modelName should be preserved');
  });

  // Test 15: Values are not mutated
  test('Values immutability', () => {
    const input = [0.6, 0.4];
    const result = manager.normalizeOutput(input, 'fallback', 'test');
    
    input[0] = 0.9;
    assert.strictEqual(result.values[0], 0.6, 'original array mutation should not affect result');
  });

  // Print summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Test Summary: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('✅ All tests passed!');
    return true;
  } else {
    console.log(`❌ ${totalTests - passedTests} test(s) failed`);
    return false;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests, MockNeuralBrainManager };
