/**
 * Integration Test: WebSocket Safe Send with Live Telemetry
 * This script demonstrates the enhanced safeSendWebSocket function with:
 * - Proper return type handling (success + reason)
 * - Actionable diagnostics logging
 * - Real-world telemetry transmission scenario
 */

const EventEmitter = require('events');
const http = require('http');

// Mock WebSocket for integration testing
class MockWebSocketClient extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
    this.readyState = 0; // CONNECTING
    this.sentMessages = [];
    this.shouldSimulateDelay = false;
    this.delayMs = 0;
  }

  send(data) {
    this.sentMessages.push({ data, timestamp: Date.now() });
  }

  simulateConnection() {
    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.emit('open');
      console.log('[WS] Connection established');
    }, this.delayMs);
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

// Global infrastructure
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
    if (!wsMessageQueues.has(wsClient)) {
      wsMessageQueues.set(wsClient, []);
    }
    
    if (!wsPendingPromises.has(wsClient)) {
      wsPendingPromises.set(wsClient, []);
    }
    
    const queue = wsMessageQueues.get(wsClient);
    queue.push(message);
    
    const pendingPromises = wsPendingPromises.get(wsClient);
    pendingPromises.push(resolve);
    
    const hasExistingTimeout = wsTimeouts.has(wsClient);
    
    if (!hasExistingTimeout) {
      const timeoutHandle = setTimeout(() => {
        const listener = wsOpenListeners.get(wsClient);
        if (listener) {
          wsClient.removeListener('open', listener);
          wsOpenListeners.delete(wsClient);
        }
        wsTimeouts.delete(wsClient);
        
        const allPending = wsPendingPromises.get(wsClient) || [];
        wsPendingPromises.delete(wsClient);
        wsMessageQueues.delete(wsClient);
        
        const reason = `Timeout waiting for WebSocket to open (${timeout}ms)`;
        for (const pendingResolve of allPending) {
          pendingResolve({ success: false, reason });
        }
      }, timeout);
      
      wsTimeouts.set(wsClient, timeoutHandle);
      
      const openListener = () => {
        const existingTimeout = wsTimeouts.get(wsClient);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          wsTimeouts.delete(wsClient);
        }
        
        wsOpenListeners.delete(wsClient);
        
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
        
        for (const pendingResolve of allPending) {
          pendingResolve({ success: successStatus, reason });
        }
      };
      
      wsOpenListeners.set(wsClient, openListener);
      wsClient.once('open', openListener);
    }
  });
}

/**
 * Example: Telemetry Logger using enhanced safeSendWebSocket
 */
class TelemetryLogger {
  constructor(wsClient) {
    this.wsClient = wsClient;
    this.messageCount = 0;
    this.failureCount = 0;
  }

  async sendTelemetry(telemetryData) {
    const message = {
      type: 'telemetry',
      timestamp: Date.now(),
      data: telemetryData
    };

    const result = await safeSendWebSocket(this.wsClient, message, {
      queue: true,
      timeout: 5000
    });

    if (result.success) {
      this.messageCount++;
      console.log(`[TELEMETRY] ✓ Sent (${this.messageCount} total) - ${result.reason}`);
      return true;
    } else {
      this.failureCount++;
      console.log(`[TELEMETRY] ✗ Failed (${this.failureCount} failures) - ${result.reason}`);
      return false;
    }
  }

  getStats() {
    return {
      messagesSent: this.messageCount,
      failureCount: this.failureCount,
      successRate: this.messageCount / (this.messageCount + this.failureCount) * 100
    };
  }
}

/**
 * Run integration test
 */
async function runIntegrationTest() {
  console.log('\n=== WEBSOCKET SAFE SEND INTEGRATION TEST ===\n');

  // Scenario 1: Immediate send (WebSocket already open)
  console.log('Scenario 1: Send when WebSocket is OPEN');
  console.log('-'.repeat(50));
  {
    const ws = new MockWebSocketClient('ws://localhost:8080');
    ws.readyState = 1; // Already open
    
    const logger = new TelemetryLogger(ws);
    await logger.sendTelemetry({ cpu: 45, memory: 60 });
    
    console.log(`Messages in queue: ${ws.sentMessages.length}\n`);
  }

  // Scenario 2: Queued send (WebSocket connecting)
  console.log('Scenario 2: Send with automatic queuing (CONNECTING state)');
  console.log('-'.repeat(50));
  {
    const ws = new MockWebSocketClient('ws://localhost:8080');
    ws.readyState = 0; // CONNECTING
    
    const logger = new TelemetryLogger(ws);
    
    // Send multiple telemetry messages while connecting
    const p1 = logger.sendTelemetry({ cpu: 50, memory: 65 });
    const p2 = logger.sendTelemetry({ cpu: 52, memory: 68 });
    const p3 = logger.sendTelemetry({ cpu: 48, memory: 62 });
    
    // Simulate connection delay
    setTimeout(() => ws.simulateConnection(), 200);
    
    await Promise.all([p1, p2, p3]);
    
    console.log(`Messages in queue: ${ws.sentMessages.length}`);
    console.log(`Logger stats:`, logger.getStats());
    console.log();
  }

  // Scenario 3: Timeout handling
  console.log('Scenario 3: Timeout when connection takes too long');
  console.log('-'.repeat(50));
  {
    const ws = new MockWebSocketClient('ws://localhost:8080');
    ws.readyState = 0; // CONNECTING
    ws.delayMs = 10000; // Will connect after 10 seconds
    
    const logger = new TelemetryLogger(ws);
    const result = await safeSendWebSocket(ws, { type: 'test' }, {
      queue: true,
      timeout: 1000 // But we timeout after 1 second
    });
    
    console.log(`Result: ${result.success ? 'Success' : 'Failed'}`);
    console.log(`Reason: ${result.reason}`);
    console.log();
  }

  // Scenario 4: Disabled queuing
  console.log('Scenario 4: Reject message with queuing disabled');
  console.log('-'.repeat(50));
  {
    const ws = new MockWebSocketClient('ws://localhost:8080');
    ws.readyState = 0; // CONNECTING
    
    const result = safeSendWebSocket(ws, { type: 'test' }, {
      queue: false // Don't queue
    });
    
    console.log(`Result: ${result.success ? 'Success' : 'Failed'}`);
    console.log(`Reason: ${result.reason}`);
    console.log();
  }

  // Scenario 5: Closed connection
  console.log('Scenario 5: Handle closed connection gracefully');
  console.log('-'.repeat(50));
  {
    const ws = new MockWebSocketClient('ws://localhost:8080');
    ws.readyState = 3; // CLOSED
    
    const logger = new TelemetryLogger(ws);
    await logger.sendTelemetry({ cpu: 45, memory: 60 });
    
    console.log(`Logger stats:`, logger.getStats());
    console.log();
  }

  // Scenario 6: Real-world production telemetry
  console.log('Scenario 6: Production telemetry scenario');
  console.log('-'.repeat(50));
  {
    const ws = new MockWebSocketClient('ws://telemetry.example.com');
    ws.readyState = 0; // Connecting
    
    const logger = new TelemetryLogger(ws);
    
    // Queue production metrics
    const metrics = [
      { cpu: 35, memory: 55, uptime: 3600 },
      { cpu: 38, memory: 58, uptime: 3610 },
      { cpu: 40, memory: 60, uptime: 3620 }
    ];
    
    const promises = metrics.map(m => logger.sendTelemetry(m));
    
    // Simulate connection after short delay
    setTimeout(() => ws.simulateConnection(), 150);
    
    await Promise.all(promises);
    
    console.log(`\nProduction telemetry stats:`, logger.getStats());
    console.log(`Total messages received by server: ${ws.sentMessages.length}`);
    console.log();
  }

  console.log('=== INTEGRATION TEST COMPLETE ===\n');
}

// Run the test
runIntegrationTest().catch(console.error);
