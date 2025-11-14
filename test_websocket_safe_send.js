/**
 * Unit Tests for Enhanced safeSendWebSocket Function
 * Tests cover all readyState values, message queuing, timeout handling, and listener cleanup
 */

const EventEmitter = require('events');

// Mock WebSocket class for testing
class MockWebSocket extends EventEmitter {
  constructor(url = 'ws://localhost') {
    super();
    this.url = url;
    this.readyState = 0; // CONNECTING
    this.sentMessages = [];
    this.shouldThrow = false;
    this.throwMessage = 'Send failed';
  }

  send(data) {
    if (this.shouldThrow) {
      throw new Error(this.throwMessage);
    }
    this.sentMessages.push(data);
  }

  setReadyState(state) {
    this.readyState = state;
  }

  simulateOpen() {
    this.readyState = 1; // OPEN
    this.emit('open');
  }

  simulateError(err) {
    this.emit('error', err);
  }

  simulateClose() {
    this.readyState = 3; // CLOSED
    this.emit('close');
  }
}

// WebSocket state constants
const WS_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

// Global infrastructure (would be in HunterX.js)
const wsMessageQueues = new WeakMap();
const wsTimeouts = new WeakMap();
const wsOpenListeners = new WeakMap();
const wsPendingPromises = new WeakMap();

/**
 * Enhanced WebSocket send with queuing, timeout, and descriptive error handling
 */
function safeSendWebSocket(wsClient, message, options = {}) {
  const { queue = true, timeout = 5000 } = options;
  
  if (!wsClient) {
    const reason = 'WebSocket client not initialized';
    console.log(`[WS] ${reason}`);
    return { success: false, reason };
  }
  
  if (!message) {
    const reason = 'Message is empty or null';
    console.log(`[WS] ${reason}`);
    return { success: false, reason };
  }
  
  const readyState = wsClient.readyState;
  
  if (readyState === WS_STATES.OPEN || readyState === 1) {
    try {
      wsClient.send(JSON.stringify(message));
      return { success: true, reason: 'Message sent successfully' };
    } catch (err) {
      const reason = `Send failed: ${err.message}`;
      console.log(`[WS] ${reason}`);
      return { success: false, reason };
    }
  }
  
  switch (readyState) {
    case WS_STATES.CONNECTING: {
      if (!queue) {
        const reason = 'WebSocket is CONNECTING and queuing is disabled';
        return { success: false, reason };
      }
      return queueMessageUntilOpen(wsClient, message, timeout);
    }
    
    case WS_STATES.CLOSING: {
      const reason = 'WebSocket is CLOSING - cannot send message';
      return { success: false, reason };
    }
    
    case WS_STATES.CLOSED: {
      const reason = 'WebSocket is CLOSED - cannot send message';
      return { success: false, reason };
    }
    
    default: {
      const reason = `Unknown WebSocket state: ${readyState}`;
      return { success: false, reason };
    }
  }
}

function queueMessageUntilOpen(wsClient, message, timeout) {
  return new Promise((resolve) => {
    // Initialize queue for this WebSocket if needed
    if (!wsMessageQueues.has(wsClient)) {
      wsMessageQueues.set(wsClient, []);
    }
    
    // Initialize pending promises array
    if (!wsPendingPromises.has(wsClient)) {
      wsPendingPromises.set(wsClient, []);
    }
    
    const queue = wsMessageQueues.get(wsClient);
    queue.push(message);
    
    // Store the resolve function so it can be called when messages flush
    const pendingPromises = wsPendingPromises.get(wsClient);
    pendingPromises.push(resolve);
    
    // Check if this is the first message being queued (no existing timeout)
    const hasExistingTimeout = wsTimeouts.has(wsClient);
    
    if (!hasExistingTimeout) {
      // This is the first message - set timeout and register listener
      
      // Set timeout for stalled connection
      const timeoutHandle = setTimeout(() => {
        // Clean up listener
        const listener = wsOpenListeners.get(wsClient);
        if (listener) {
          wsClient.removeListener('open', listener);
          wsOpenListeners.delete(wsClient);
        }
        wsTimeouts.delete(wsClient);
        
        // Resolve all pending promises with timeout error
        const allPending = wsPendingPromises.get(wsClient) || [];
        wsPendingPromises.delete(wsClient);
        wsMessageQueues.delete(wsClient);
        
        const reason = `Timeout waiting for WebSocket to open (${timeout}ms)`;
        for (const pendingResolve of allPending) {
          pendingResolve({ success: false, reason });
        }
      }, timeout);
      
      wsTimeouts.set(wsClient, timeoutHandle);
      
      // Register one-time open listener to flush queued messages
      const openListener = () => {
        // Clean up the timeout
        const existingTimeout = wsTimeouts.get(wsClient);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          wsTimeouts.delete(wsClient);
        }
        
        // Remove listener reference
        wsOpenListeners.delete(wsClient);
        
        // Flush queued messages
        const messagesToSend = wsMessageQueues.get(wsClient) || [];
        wsMessageQueues.delete(wsClient);
        
        const allPending = wsPendingPromises.get(wsClient) || [];
        wsPendingPromises.delete(wsClient);
        
        let successCount = 0;
        const failures = [];
        
        for (const queuedMessage of messagesToSend) {
          try {
            wsClient.send(JSON.stringify(queuedMessage));
            successCount++;
          } catch (err) {
            failures.push(err.message);
          }
        }
        
        const totalMessages = messagesToSend.length;
        let successStatus = true;
        let reason = '';
        
        if (failures.length === 0) {
          reason = `Flushed ${totalMessages} queued message${totalMessages !== 1 ? 's' : ''}`;
        } else {
          successStatus = successCount === totalMessages;
          reason = `Flushed ${successCount}/${totalMessages} messages (${failures.length} failed)`;
        }
        
        // Resolve all pending promises with the same result
        for (const pendingResolve of allPending) {
          pendingResolve({ success: successStatus, reason });
        }
      };
      
      wsOpenListeners.set(wsClient, openListener);
      wsClient.once('open', openListener);
    }
  });
}

// ===== TESTS =====

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('\n=== WEBSOCKET SAFE SEND TESTS ===\n');

  // Test 1: Send when OPEN
  console.log('Test 1: Send message when WebSocket is OPEN');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.OPEN);
    const result = safeSendWebSocket(ws, { type: 'test' });
    
    if (result.success && ws.sentMessages.length === 1) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected success with one message sent\n');
      failed++;
    }
  }

  // Test 2: Null client
  console.log('Test 2: Handle null WebSocket client');
  {
    const result = safeSendWebSocket(null, { type: 'test' });
    
    if (!result.success && result.reason.includes('not initialized')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected error for null client\n');
      failed++;
    }
  }

  // Test 3: Null message
  console.log('Test 3: Handle null message');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.OPEN);
    const result = safeSendWebSocket(ws, null);
    
    if (!result.success && result.reason.includes('empty')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected error for null message\n');
      failed++;
    }
  }

  // Test 4: CONNECTING state with queuing disabled
  console.log('Test 4: CONNECTING state with queuing disabled');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CONNECTING);
    const result = safeSendWebSocket(ws, { type: 'test' }, { queue: false });
    
    if (!result.success && result.reason.includes('CONNECTING')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected error for CONNECTING with queue disabled\n');
      failed++;
    }
  }

  // Test 5: CLOSING state
  console.log('Test 5: Reject message when WebSocket is CLOSING');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CLOSING);
    const result = safeSendWebSocket(ws, { type: 'test' });
    
    if (!result.success && result.reason.includes('CLOSING')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected error for CLOSING state\n');
      failed++;
    }
  }

  // Test 6: CLOSED state
  console.log('Test 6: Reject message when WebSocket is CLOSED');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CLOSED);
    const result = safeSendWebSocket(ws, { type: 'test' });
    
    if (!result.success && result.reason.includes('CLOSED')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected error for CLOSED state\n');
      failed++;
    }
  }

  // Test 7: CONNECTING state with queuing enabled
  console.log('Test 7: Queue message when CONNECTING (with default timeout)');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CONNECTING);
    const promise = safeSendWebSocket(ws, { type: 'test1' });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    ws.simulateOpen();
    
    const result = await promise;
    
    if (result.success && ws.sentMessages.length === 1) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected queued message to be sent on open\n');
      failed++;
    }
  }

  // Test 8: Timeout waiting for connection
  console.log('Test 8: Timeout when WebSocket takes too long to open');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CONNECTING);
    const promise = safeSendWebSocket(ws, { type: 'test' }, { timeout: 100 });
    
    const result = await promise;
    
    if (!result.success && result.reason.includes('Timeout')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected timeout error\n');
      failed++;
    }
  }

  // Test 9: Multiple messages queued
  console.log('Test 9: Queue multiple messages and flush them on open');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CONNECTING);
    
    const promise1 = safeSendWebSocket(ws, { type: 'msg1' });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const promise2 = safeSendWebSocket(ws, { type: 'msg2' });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const promise3 = safeSendWebSocket(ws, { type: 'msg3' });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    ws.simulateOpen();
    
    const [r1, r2, r3] = await Promise.all([promise1, promise2, promise3]);
    
    // Each message should generate a flush event with one message
    // But they all queue into the same queue, so only one event fires
    // All 3 messages get flushed at once
    if (ws.sentMessages.length === 3) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected 3 messages sent. Got ${ws.sentMessages.length}\n`);
      console.log(`Details: r1=${r1.success}, r2=${r2.success}, r3=${r3.success}\n`);
      failed++;
    }
  }

  // Test 10: Send error handling
  console.log('Test 10: Handle send errors gracefully');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.OPEN);
    ws.shouldThrow = true;
    ws.throwMessage = 'Buffer full';
    
    const result = safeSendWebSocket(ws, { type: 'test' });
    
    if (!result.success && result.reason.includes('Buffer full')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Expected error from send()\n');
      failed++;
    }
  }

  // Test 11: Listener cleanup on timeout
  console.log('Test 11: Clean up listeners on timeout');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CONNECTING);
    
    const promise = safeSendWebSocket(ws, { type: 'test' }, { timeout: 50 });
    await promise;
    
    // Check listener count (should be 0 after timeout cleanup)
    const listenerCount = ws.listenerCount('open');
    
    if (listenerCount === 0) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected 0 listeners, got ${listenerCount}\n`);
      failed++;
    }
  }

  // Test 12: Listener cleanup on successful send
  console.log('Test 12: Clean up listeners after successful flush');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CONNECTING);
    
    const promise = safeSendWebSocket(ws, { type: 'test' });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    ws.simulateOpen();
    
    await promise;
    
    const listenerCount = ws.listenerCount('open');
    
    if (listenerCount === 0) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected 0 listeners, got ${listenerCount}\n`);
      failed++;
    }
  }

  // Test 13: Return type structure
  console.log('Test 13: Return object has correct structure');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.OPEN);
    const result = safeSendWebSocket(ws, { type: 'test' });
    
    if (typeof result === 'object' && 
        'success' in result && 
        'reason' in result &&
        typeof result.success === 'boolean' &&
        typeof result.reason === 'string') {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Return object structure incorrect\n');
      failed++;
    }
  }

  // Test 14: CONNECTING state (numeric value 0)
  console.log('Test 14: Numeric state comparison (CONNECTING = 0)');
  {
    const ws = new MockWebSocket();
    ws.readyState = 0; // Explicitly set numeric value
    const result = safeSendWebSocket(ws, { type: 'test' }, { queue: false });
    
    if (!result.success && result.reason.includes('CONNECTING')) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Numeric state 0 not handled correctly\n');
      failed++;
    }
  }

  // Test 15: Options parameter defaults
  console.log('Test 15: Options parameter has correct defaults');
  {
    const ws = new MockWebSocket();
    ws.setReadyState(WS_STATES.CONNECTING);
    
    // Should use default queue=true and timeout=5000
    const promise = safeSendWebSocket(ws, { type: 'test' });
    
    // Simulate open within the default timeout window
    await new Promise(resolve => setTimeout(resolve, 100));
    ws.simulateOpen();
    
    const result = await promise;
    
    if (result.success) {
      console.log('✓ PASSED\n');
      passed++;
    } else {
      console.log('✗ FAILED: Default options not applied correctly\n');
      failed++;
    }
  }

  // Summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  } else {
    console.log(`\n✗ ${failed} test(s) failed`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
