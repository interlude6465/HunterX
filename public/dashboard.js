// HunterX Dashboard WebSocket Client

// Configuration
const WS_URL = 'ws://localhost:9090';
const RECONNECT_INTERVAL = 3000;
const HTTP_API_URL = 'http://localhost:8080';

// State
let ws = null;
let reconnectTimer = null;
let botStartTime = null;
let commandHistory = [];
let autoScroll = true;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard initialized');
  connectWebSocket();
  startUptimeCounter();
  
  // Load auto-scroll preference
  const autoScrollCheckbox = document.getElementById('autoScrollCheckbox');
  autoScrollCheckbox.addEventListener('change', (e) => {
    autoScroll = e.target.checked;
  });
});

// WebSocket Connection
function connectWebSocket() {
  updateConnectionStatus('connecting', 'Connecting...');
  
  try {
    ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      updateConnectionStatus('connected', 'Connected');
      addConsoleMessage('WebSocket connected successfully', 'success');
      
      // Request initial status
      requestBotStatus();
      requestInventory();
      
      // Clear reconnect timer
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      addConsoleMessage('WebSocket error occurred', 'error');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      updateConnectionStatus('disconnected', 'Disconnected');
      addConsoleMessage('WebSocket disconnected. Attempting to reconnect...', 'error');
      
      // Attempt to reconnect
      reconnectTimer = setTimeout(() => {
        connectWebSocket();
      }, RECONNECT_INTERVAL);
    };
  } catch (err) {
    console.error('Failed to create WebSocket:', err);
    updateConnectionStatus('disconnected', 'Connection Failed');
    
    // Retry connection
    reconnectTimer = setTimeout(() => {
      connectWebSocket();
    }, RECONNECT_INTERVAL);
  }
}

// Update connection status indicator
function updateConnectionStatus(status, text) {
  const indicator = document.getElementById('wsStatus');
  const statusText = document.getElementById('wsStatusText');
  
  indicator.className = `status-indicator ${status}`;
  statusText.textContent = text;
}

// Handle incoming WebSocket messages
function handleWebSocketMessage(message) {
  console.log('Received message:', message);
  
  switch (message.type) {
    case 'status':
      updateBotStatus(message.data);
      break;
    case 'inventory':
      updateInventory(message.data);
      break;
    case 'chat':
      addChatMessage(message.data);
      break;
    case 'telemetry':
      updateTelemetry(message.data);
      break;
    case 'config':
      updateConfig(message.data);
      break;
    case 'command_response':
      handleCommandResponse(message.data);
      break;
    case 'event':
      handleEvent(message.data);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

// Update bot status display
function updateBotStatus(data) {
  if (data.connected !== undefined) {
    document.getElementById('botConnection').textContent = data.connected ? 'Connected' : 'Disconnected';
    document.getElementById('botConnection').style.color = data.connected ? '#0f0' : '#f00';
  }
  if (data.username) {
    document.getElementById('botUsername').textContent = data.username;
  }
  if (data.server) {
    document.getElementById('botServer').textContent = data.server;
  }
  if (data.version) {
    document.getElementById('botVersion').textContent = data.version;
  }
  if (data.mode) {
    document.getElementById('botMode').textContent = data.mode;
  }
  if (data.health !== undefined) {
    document.getElementById('botHealth').textContent = `${data.health}/20`;
  }
  if (data.food !== undefined) {
    document.getElementById('botFood').textContent = `${data.food}/20`;
  }
  if (data.startTime) {
    botStartTime = data.startTime;
  }
}

// Update telemetry display
function updateTelemetry(data) {
  if (data.position) {
    const pos = data.position;
    document.getElementById('botPosition').textContent = `${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`;
  }
  if (data.dimension) {
    document.getElementById('botDimension').textContent = data.dimension;
  }
  if (data.nearbyPlayers !== undefined) {
    document.getElementById('nearbyPlayers').textContent = data.nearbyPlayers;
  }
  if (data.kills !== undefined) {
    document.getElementById('botKills').textContent = data.kills;
  }
  if (data.deaths !== undefined) {
    document.getElementById('botDeaths').textContent = data.deaths;
  }
  if (data.kills !== undefined && data.deaths !== undefined) {
    const kd = data.deaths === 0 ? data.kills.toFixed(2) : (data.kills / data.deaths).toFixed(2);
    document.getElementById('botKD').textContent = kd;
  }
  if (data.activity) {
    document.getElementById('botActivity').textContent = data.activity;
  }
  if (data.currentTask) {
    document.getElementById('currentTask').textContent = data.currentTask;
  }
}

// Update inventory display
function updateInventory(data) {
  const inventoryGrid = document.getElementById('inventoryGrid');
  inventoryGrid.innerHTML = '';
  
  if (!data.items || data.items.length === 0) {
    inventoryGrid.innerHTML = '<p class="empty-message">Inventory is empty</p>';
    return;
  }
  
  data.items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'inventory-item';
    itemDiv.innerHTML = `
      <span class="item-name">${formatItemName(item.name)}</span>
      <span class="item-count">x${item.count}</span>
    `;
    inventoryGrid.appendChild(itemDiv);
  });
  
  // Update equipment
  if (data.equipment) {
    document.getElementById('equipHelmet').textContent = data.equipment.helmet || 'Empty';
    document.getElementById('equipChestplate').textContent = data.equipment.chestplate || 'Empty';
    document.getElementById('equipLeggings').textContent = data.equipment.leggings || 'Empty';
    document.getElementById('equipBoots').textContent = data.equipment.boots || 'Empty';
    document.getElementById('equipMainHand').textContent = data.equipment.mainHand || 'Empty';
    document.getElementById('equipOffHand').textContent = data.equipment.offHand || 'Empty';
  }
}

// Update configuration display
function updateConfig(data) {
  const configDisplay = document.getElementById('configDisplay');
  configDisplay.innerHTML = '';
  
  if (!data) {
    configDisplay.innerHTML = '<p class="empty-message">No configuration data available</p>';
    return;
  }
  
  // Display key configuration sections
  const sections = [
    { key: 'mode', label: 'Bot Mode', value: data.mode },
    { key: 'server', label: 'Server', value: data.server },
    { key: 'bot', label: 'Bot Settings', value: data.bot },
    { key: 'combat', label: 'Combat Settings', value: data.combat },
    { key: 'swarm', label: 'Swarm Settings', value: data.swarm }
  ];
  
  sections.forEach(section => {
    if (section.value !== undefined) {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'config-section';
      sectionDiv.innerHTML = `<h4>${section.label}</h4>`;
      
      if (typeof section.value === 'object') {
        for (const [key, value] of Object.entries(section.value)) {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'config-item';
          itemDiv.innerHTML = `
            <span class="key">${key}:</span>
            <span class="value">${formatConfigValue(value)}</span>
          `;
          sectionDiv.appendChild(itemDiv);
        }
      } else {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'config-item';
        itemDiv.innerHTML = `
          <span class="key">${section.key}:</span>
          <span class="value">${formatConfigValue(section.value)}</span>
        `;
        sectionDiv.appendChild(itemDiv);
      }
      
      configDisplay.appendChild(sectionDiv);
    }
  });
}

// Add chat message to console
function addChatMessage(data) {
  const message = data.message || data;
  addConsoleMessage(`[CHAT] ${message}`, 'chat');
}

// Handle event messages
function handleEvent(data) {
  const eventType = data.event || data.type;
  const message = data.message || `Event: ${eventType}`;
  addConsoleMessage(`[EVENT] ${message}`, 'startup');
}

// Handle command response
function handleCommandResponse(data) {
  const success = data.success !== false;
  const message = data.message || data.response || 'Command executed';
  const type = success ? 'success' : 'error';
  
  addConsoleMessage(`[RESPONSE] ${message}`, type);
  addToHistory(data.command || 'Unknown command', success);
}

// Send message via WebSocket
function sendWebSocketMessage(message) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    addConsoleMessage('Cannot send message: WebSocket not connected', 'error');
    return false;
  }
  
  try {
    ws.send(JSON.stringify(message));
    return true;
  } catch (err) {
    console.error('Error sending WebSocket message:', err);
    addConsoleMessage(`Error sending message: ${err.message}`, 'error');
    return false;
  }
}

// Request bot status
function requestBotStatus() {
  sendWebSocketMessage({
    type: 'status',
    action: 'getStatus'
  });
}

// Request inventory
function requestInventory() {
  sendWebSocketMessage({
    type: 'telemetry',
    action: 'getInventory'
  });
}

// Request configuration
function requestConfig() {
  sendWebSocketMessage({
    type: 'config',
    action: 'getConfig'
  });
}

// Send command
function sendCommand(command) {
  const message = {
    type: 'command',
    command: command
  };
  
  if (sendWebSocketMessage(message)) {
    addConsoleMessage(`[COMMAND] ${command}`, 'command');
  }
}

// Send custom command from input
function sendCustomCommand() {
  const input = document.getElementById('commandInput');
  const command = input.value.trim();
  
  if (!command) {
    return;
  }
  
  sendCommand(command);
  input.value = '';
}

// Handle Enter key in command input
function handleCommandEnter(event) {
  if (event.key === 'Enter') {
    sendCustomCommand();
  }
}

// Quick command
function quickCommand(command) {
  sendCommand(command);
}

// Emergency stop
function emergencyStop() {
  if (confirm('Are you sure you want to emergency stop the bot?')) {
    sendCommand('emergency stop');
    addConsoleMessage('[EMERGENCY] Emergency stop initiated', 'error');
  }
}

// Add message to console
function addConsoleMessage(message, type = 'chat') {
  const consoleOutput = document.getElementById('consoleOutput');
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  
  const timestamp = new Date().toLocaleTimeString();
  line.innerHTML = `<span class="timestamp">[${timestamp}]</span>${message}`;
  
  consoleOutput.appendChild(line);
  
  // Auto-scroll if enabled
  if (autoScroll) {
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }
  
  // Limit console lines to 500
  while (consoleOutput.children.length > 500) {
    consoleOutput.removeChild(consoleOutput.firstChild);
  }
}

// Clear console
function clearConsole() {
  const consoleOutput = document.getElementById('consoleOutput');
  consoleOutput.innerHTML = '';
  addConsoleMessage('Console cleared', 'startup');
}

// Add command to history
function addToHistory(command, success) {
  commandHistory.unshift({ command, success, timestamp: Date.now() });
  
  // Limit history to 50 items
  if (commandHistory.length > 50) {
    commandHistory.pop();
  }
  
  updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  
  commandHistory.slice(0, 10).forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${item.success ? 'success' : 'error'}`;
    
    const time = new Date(item.timestamp).toLocaleTimeString();
    historyItem.textContent = `[${time}] ${item.command}`;
    
    historyList.appendChild(historyItem);
  });
}

// Start uptime counter
function startUptimeCounter() {
  setInterval(() => {
    if (botStartTime) {
      const uptime = Date.now() - botStartTime;
      document.getElementById('botUptime').textContent = formatUptime(uptime);
    }
  }, 1000);
}

// Format uptime
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Format item name
function formatItemName(name) {
  if (!name) return 'Unknown';
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Format config value
function formatConfigValue(value) {
  if (typeof value === 'boolean') {
    return value ? 'Enabled' : 'Disabled';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

// Periodic status updates
setInterval(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    requestBotStatus();
  }
}, 5000);

// Periodic telemetry updates
setInterval(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    sendWebSocketMessage({
      type: 'telemetry',
      action: 'getTelemetry'
    });
  }
}, 2000);
