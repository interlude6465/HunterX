// Test script for Continuous Plugin Scanner
// This demonstrates the scanner functionality without running the full bot

const fs = require('fs');

// Simulate the PluginAnalyzer class (minimal version for testing)
class TestPluginAnalyzer {
  constructor() {
    this.scanQueue = [];
    this.continuousScanning = false;
    this.historicalScans = [];
    this.pluginRegistry = new Map();
    console.log('[TEST] PluginAnalyzer initialized');
  }
  
  addToScanQueue(filePath, fileName, priority = 'normal') {
    if (!fs.existsSync(filePath)) {
      console.log(`[TEST] ⚠️ File not found: ${filePath}`);
      return { success: false, message: 'File not found' };
    }
    
    this.scanQueue.push({ filePath, fileName, priority, addedAt: Date.now() });
    
    if (!this.pluginRegistry.has(fileName)) {
      this.pluginRegistry.set(fileName, {
        filePath,
        fileName,
        firstAdded: Date.now(),
        scanCount: 0,
        trendData: []
      });
    }
    
    console.log(`[TEST] ✅ Added ${fileName} to queue (priority: ${priority})`);
    return { success: true, message: 'Added to queue', queueSize: this.scanQueue.length };
  }
  
  async processQueue() {
    if (this.scanQueue.length === 0) {
      console.log('[TEST] Queue empty');
      return;
    }
    
    const item = this.scanQueue.shift();
    console.log(`[TEST] 🔍 Processing ${item.fileName}...`);
    
    try {
      const content = fs.readFileSync(item.filePath, 'utf8');
      
      // Simple pattern matching
      let riskScore = 0;
      let vulnCount = 0;
      
      const patterns = [
        { pattern: 'runTaskAsynchronously', risk: 10, name: 'Async operations' },
        { pattern: 'getInventory', risk: 8, name: 'Inventory access' },
        { pattern: 'EventHandler', risk: 5, name: 'Event handling' },
        { pattern: 'PacketPlayIn', risk: 12, name: 'Packet handling' },
        { pattern: 'Transaction', risk: 7, name: 'Transaction handling' }
      ];
      
      const foundVulns = [];
      for (const p of patterns) {
        if (content.includes(p.pattern)) {
          riskScore += p.risk;
          vulnCount++;
          foundVulns.push(p.name);
        }
      }
      
      console.log(`[TEST] 📊 Risk Score: ${riskScore}, Vulnerabilities: ${vulnCount}`);
      if (foundVulns.length > 0) {
        console.log(`[TEST] 🔴 Found: ${foundVulns.join(', ')}`);
      }
      
      // Update registry
      const pluginData = this.pluginRegistry.get(item.fileName);
      if (pluginData) {
        pluginData.scanCount++;
        pluginData.lastScan = Date.now();
        pluginData.trendData.push({
          timestamp: Date.now(),
          riskScore,
          vulnerabilityCount: vulnCount
        });
        
        // Calculate trend
        if (pluginData.trendData.length > 1) {
          const prev = pluginData.trendData[pluginData.trendData.length - 2];
          const curr = pluginData.trendData[pluginData.trendData.length - 1];
          const change = curr.riskScore - prev.riskScore;
          const trend = change > 0 ? 'increasing ⬆️' : (change < 0 ? 'decreasing ⬇️' : 'stable ➡️');
          console.log(`[TEST] 📈 Trend: ${trend} (${change > 0 ? '+' : ''}${change})`);
        }
      }
      
      return { success: true, riskScore, vulnerabilityCount: vulnCount };
    } catch (err) {
      console.log(`[TEST] ❌ Error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }
  
  startContinuousScanning(intervalMs = 5000) {
    if (this.continuousScanning) {
      return { success: false, message: 'Already running' };
    }
    
    this.continuousScanning = true;
    console.log(`[TEST] ▶️ Starting continuous scanning (interval: ${intervalMs/1000}s)`);
    
    this.scanInterval = setInterval(() => {
      if (this.scanQueue.length > 0) {
        this.processQueue();
      } else {
        console.log('[TEST] ⏳ Queue empty, waiting...');
      }
    }, intervalMs);
    
    return { success: true, message: 'Scanner started', interval: intervalMs };
  }
  
  stopContinuousScanning() {
    if (!this.continuousScanning) {
      return { success: false, message: 'Not running' };
    }
    
    this.continuousScanning = false;
    clearInterval(this.scanInterval);
    console.log('[TEST] ⏹️ Scanner stopped');
    
    return { success: true, message: 'Scanner stopped' };
  }
  
  getStatus() {
    return {
      active: this.continuousScanning,
      queueSize: this.scanQueue.length,
      totalPlugins: this.pluginRegistry.size,
      plugins: Array.from(this.pluginRegistry.entries()).map(([name, data]) => ({
        name,
        scanCount: data.scanCount,
        lastScan: data.lastScan ? new Date(data.lastScan).toISOString() : 'Never',
        trends: data.trendData.length
      }))
    };
  }
}

// Run test
async function runTest() {
  console.log('='.repeat(60));
  console.log('  CONTINUOUS PLUGIN SCANNER - TEST SUITE');
  console.log('='.repeat(60));
  console.log();
  
  const analyzer = new TestPluginAnalyzer();
  
  // Test 1: Add plugin to queue
  console.log('📝 Test 1: Add test plugin to queue');
  const result1 = analyzer.addToScanQueue(
    './dupes/test_plugin_sample.java',
    'test_plugin_sample.java',
    'high'
  );
  console.log(`Result: ${result1.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log();
  
  // Test 2: Process queue once
  console.log('📝 Test 2: Process queue manually');
  await analyzer.processQueue();
  console.log();
  
  // Test 3: Add plugin again to test trends
  console.log('📝 Test 3: Re-scan same plugin to test trends');
  analyzer.addToScanQueue(
    './dupes/test_plugin_sample.java',
    'test_plugin_sample.java',
    'normal'
  );
  await analyzer.processQueue();
  console.log();
  
  // Test 4: View status
  console.log('📝 Test 4: Get scanner status');
  const status = analyzer.getStatus();
  console.log('Status:', JSON.stringify(status, null, 2));
  console.log();
  
  // Test 5: Start continuous scanning
  console.log('📝 Test 5: Start continuous scanning (10s interval)');
  const result5 = analyzer.startContinuousScanning(10000);
  console.log(`Result: ${result5.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log();
  
  // Add more test files to queue
  console.log('📝 Test 6: Add plugin to queue again for auto-scanning');
  analyzer.addToScanQueue(
    './dupes/test_plugin_sample.java',
    'test_plugin_sample.java',
    'normal'
  );
  
  // Wait 12 seconds to allow one scan cycle
  console.log('⏳ Waiting 12 seconds for scan cycle...');
  await new Promise(resolve => setTimeout(resolve, 12000));
  
  // Test 6: Stop scanner
  console.log();
  console.log('📝 Test 7: Stop continuous scanning');
  const result7 = analyzer.stopContinuousScanning();
  console.log(`Result: ${result7.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log();
  
  // Final status
  console.log('📝 Final Status:');
  const finalStatus = analyzer.getStatus();
  console.log(JSON.stringify(finalStatus, null, 2));
  
  console.log();
  console.log('='.repeat(60));
  console.log('  TEST SUITE COMPLETE');
  console.log('='.repeat(60));
  
  process.exit(0);
}

// Run the test
runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
