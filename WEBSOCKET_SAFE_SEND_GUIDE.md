# Enhanced WebSocket Safe Send - Implementation Guide

## Overview

The `safeSendWebSocket` function has been enhanced to provide robust, production-ready WebSocket message handling with automatic queuing, timeout protection, and descriptive error diagnostics.

## Key Features

### 1. **Graceful State Handling**
- **CONNECTING (0)**: Automatically queues messages until the connection opens
- **OPEN (1)**: Sends messages immediately
- **CLOSING (2)**: Rejects messages with clear error
- **CLOSED (3)**: Rejects messages with clear error

### 2. **Message Queuing with Timeout**
- Messages sent during CONNECTING state are automatically queued
- All queued messages are flushed when the WebSocket opens
- Configurable timeout (default: 5000ms) prevents stalled connections from blocking indefinitely
- Race condition protection: Single listener handles all pending promises

### 3. **Listener Cleanup**
- One-time open listener registered to prevent memory leaks
- Automatic cleanup of listeners on timeout or successful flush
- WeakMap-based storage allows garbage collection when WebSocket is destroyed

### 4. **Rich Return Type**
```javascript
{
  success: boolean,
  reason: string
}
```

All operations return structured results with diagnostic information.

## API

### Function Signature
```javascript
function safeSendWebSocket(wsClient, message, options = {})
```

### Parameters
- `wsClient` (WebSocket): The WebSocket client instance
- `message` (Object): Message to send (will be JSON stringified)
- `options` (Object, optional):
  - `queue` (boolean, default: `true`): Queue messages if not OPEN
  - `timeout` (number, default: `5000`): Timeout in milliseconds for stalled connections

### Return Value
```javascript
{
  success: boolean,  // true if message was sent or queued successfully
  reason: string     // Descriptive message about what happened
}
```

## Usage Examples

### Example 1: Simple Send (WebSocket Already Open)
```javascript
const result = safeSendWebSocket(wsClient, {
  type: 'telemetry',
  data: { cpu: 45, memory: 60 }
});

if (result.success) {
  console.log(result.reason); // "Message sent successfully"
} else {
  console.error(`Send failed: ${result.reason}`);
}
```

### Example 2: Auto-Queue During Connection
```javascript
// WebSocket is still connecting
const result = await safeSendWebSocket(wsClient, {
  type: 'status',
  data: { status: 'online' }
});

// Message is queued and will be sent when connection opens
if (result.success) {
  console.log(result.reason); // "Flushed 1 queued message(s)"
} else {
  console.error(`Timeout: ${result.reason}`);
}
```

### Example 3: Multiple Messages with Queuing
```javascript
// Send multiple messages while connecting
const promise1 = safeSendWebSocket(wsClient, { type: 'msg1' });
const promise2 = safeSendWebSocket(wsClient, { type: 'msg2' });
const promise3 = safeSendWebSocket(wsClient, { type: 'msg3' });

const results = await Promise.all([promise1, promise2, promise3]);

results.forEach((result, i) => {
  if (result.success) {
    console.log(`Message ${i+1}: ${result.reason}`);
  }
});
// Output: All three messages queued and flushed together
// "Message 1: Flushed 3 queued messages"
// "Message 2: Flushed 3 queued messages"
// "Message 3: Flushed 3 queued messages"
```

### Example 4: Disable Queuing
```javascript
// Fail immediately if not open
const result = safeSendWebSocket(wsClient, { type: 'critical' }, {
  queue: false
});

if (!result.success) {
  console.log(result.reason); 
  // "WebSocket is CONNECTING and queuing is disabled"
}
```

### Example 5: Custom Timeout
```javascript
// Use shorter timeout for real-time critical data
const result = await safeSendWebSocket(wsClient, { type: 'critical' }, {
  queue: true,
  timeout: 1000 // 1 second timeout
});

if (!result.success && result.reason.includes('Timeout')) {
  console.error('Connection taking too long, giving up');
}
```

### Example 6: Telemetry Logger Class
```javascript
class TelemetryLogger {
  constructor(wsClient) {
    this.wsClient = wsClient;
    this.stats = { sent: 0, failed: 0 };
  }

  async sendMetrics(metrics) {
    const result = await safeSendWebSocket(this.wsClient, {
      type: 'metrics',
      timestamp: Date.now(),
      data: metrics
    });

    if (result.success) {
      this.stats.sent++;
      console.log(`[METRICS] ✓ ${result.reason}`);
    } else {
      this.stats.failed++;
      console.error(`[METRICS] ✗ ${result.reason}`);
    }

    return result.success;
  }

  getStats() {
    return {
      ...this.stats,
      successRate: (this.stats.sent / (this.stats.sent + this.stats.failed) * 100).toFixed(2) + '%'
    };
  }
}

// Usage
const logger = new TelemetryLogger(wsClient);
await logger.sendMetrics({ cpu: 45, memory: 60 });
console.log(logger.getStats());
// { sent: 1, failed: 0, successRate: '100.00%' }
```

## Error Messages

### Connection Not Initialized
```
"WebSocket client not initialized"
```
**Action**: Ensure WebSocket client is created before sending

### Empty Message
```
"Message is empty or null"
```
**Action**: Provide a non-null message object

### Connection Refused
```
"WebSocket is CLOSED - cannot send message"
```
**Action**: Reconnect WebSocket or wait for connection

### Connection Closing
```
"WebSocket is CLOSING - cannot send message"
```
**Action**: Wait for connection to fully close and reconnect

### Queuing Disabled
```
"WebSocket is CONNECTING and queuing is disabled"
```
**Action**: Set `queue: true` option to automatically queue, or wait for connection

### Timeout Waiting
```
"Timeout waiting for WebSocket to open (5000ms)"
```
**Action**: Increase timeout, check network/server status

### Partial Flush Failure
```
"Flushed 2/3 messages (1 failed)"
```
**Action**: Check individual message format, retry failed messages

## Implementation Details

### Memory Management
- Uses WeakMap for queue storage - allows garbage collection when WebSocket is destroyed
- Single one-time listener per WebSocket - prevents listener accumulation
- Automatic cleanup of timeouts and listeners on success or failure

### Race Condition Protection
- Multiple simultaneous messages to same WebSocket are coalesced into single queue
- Single open event listener handles all pending promises
- All promise resolvers stored and called together when connection opens

### Timeout Behavior
- Timeout applies to the entire group of messages queued together
- If one message times out, ALL pending messages for that WebSocket timeout
- Each new WebSocket instance gets its own timeout

## Testing

### Unit Tests
Run comprehensive unit tests:
```bash
node test_websocket_safe_send.js
```

Tests cover:
- All WebSocket readyState values (CONNECTING, OPEN, CLOSING, CLOSED)
- Message queuing with single and multiple messages
- Timeout handling and cleanup
- Error scenarios and edge cases
- Return type structure validation
- Listener cleanup verification

### Integration Tests
Run real-world scenario tests:
```bash
node integration_websocket_test.js
```

Scenarios include:
- Immediate send when connection already open
- Automatic queuing during connection
- Timeout handling for stalled connections
- Disabled queuing behavior
- Closed connection handling
- Production telemetry simulation

## Migration Guide

### From Old Implementation
**Before:**
```javascript
if (!safeSendWebSocket(wsClient, message)) {
  console.log('Failed to send');
}
```

**After:**
```javascript
const result = await safeSendWebSocket(wsClient, message);
if (result.success) {
  console.log(`Success: ${result.reason}`);
} else {
  console.error(`Failed: ${result.reason}`);
}
```

### Handling Promises
The enhanced function returns a Promise when queuing is enabled and WebSocket is CONNECTING:

```javascript
// Must await when there's uncertainty about connection state
const result = await safeSendWebSocket(wsClient, message);

// OR use .then() for older code style
safeSendWebSocket(wsClient, message).then(result => {
  // Handle result
});
```

## Performance Considerations

- **No blocking**: Queuing uses non-blocking Event Emitter pattern
- **Minimal overhead**: Single listener per WebSocket, not per message
- **Memory efficient**: WeakMap ensures garbage collection
- **Timeout protection**: Prevents infinite waiting scenarios

## Troubleshooting

### Q: Why are all my messages timing out?
**A**: Check your server is actually accepting connections. If the WebSocket never opens, messages will timeout. Increase the timeout or check server logs.

### Q: Why is my listener count increasing?
**A**: The old code registered multiple listeners. The new code registers a single one-time listener that gets cleaned up. If listeners are still accumulating, ensure the version is updated.

### Q: How do I know if a message was sent vs queued?
**A**: Check the `reason` field:
- "Message sent successfully" = Sent immediately
- "Flushed N queued message(s)" = Was queued and flushed later

### Q: Can I send multiple messages simultaneously?
**A**: Yes! Use Promise.all():
```javascript
const results = await Promise.all([
  safeSendWebSocket(ws, msg1),
  safeSendWebSocket(ws, msg2),
  safeSendWebSocket(ws, msg3)
]);
```
All will be queued together and flushed when connection opens.

## Related Components

- `WS_STATES`: WebSocket readyState constants (CONNECTING, OPEN, CLOSING, CLOSED)
- `wsMessageQueues`: WeakMap storing message queues per WebSocket
- `wsTimeouts`: WeakMap storing timeout handles per WebSocket
- `wsOpenListeners`: WeakMap storing listener references per WebSocket
- `wsPendingPromises`: WeakMap storing pending promise resolvers per WebSocket

## Future Enhancements

Potential improvements:
- Message retry logic with exponential backoff
- Per-message error tracking and callback
- Priority queue for different message types
- Metrics collection (queue depth, flush times, etc.)
- Rate limiting for high-frequency sends
