// Test file for ToolSelector functionality
const assert = require('assert');

// Mock bot object
class MockBot {
  constructor() {
    this.inventory = {
      items: () => [
        { name: 'netherite_sword', maxDurability: 2031, durability: 2000 },
        { name: 'diamond_sword', maxDurability: 1561, durability: 1500 },
        { name: 'iron_sword', maxDurability: 250, durability: 100 },
        { name: 'netherite_pickaxe', maxDurability: 2031, durability: 1800 },
        { name: 'diamond_pickaxe', maxDurability: 1561, durability: 1400 },
        { name: 'netherite_helmet', maxDurability: 407, durability: 400 },
        { name: 'diamond_helmet', maxDurability: 363, durability: 350 },
        { name: 'fishing_rod', maxDurability: 64, durability: 60 }
      ]
    };
    this.equipped = {};
  }

  async equip(item, slot) {
    this.equipped[slot] = item;
    console.log(`[MOCK] Equipped ${item.name} to ${slot}`);
  }

  chat(msg) {
    console.log(`[BOT] ${msg}`);
  }
}

// Mock ToolSelector class (simplified for testing)
class ToolSelector {
  constructor(bot) {
    this.bot = bot;
    
    this.toolMap = {
      'mining': ['netherite_pickaxe', 'diamond_pickaxe', 'iron_pickaxe', 'stone_pickaxe', 'wooden_pickaxe'],
      'mining_diamonds': ['netherite_pickaxe', 'diamond_pickaxe'],
      'combat': ['netherite_sword', 'diamond_sword', 'iron_sword', 'stone_sword', 'wooden_sword'],
      'fishing': ['fishing_rod'],
      'farming': ['netherite_hoe', 'diamond_hoe', 'iron_hoe', 'wooden_hoe'],
      'logging': ['netherite_axe', 'diamond_axe', 'iron_axe', 'stone_axe'],
      'default': ['netherite_sword', 'diamond_sword']
    };
  }
  
  isToolGoodCondition(tool) {
    if (!tool.maxDurability || tool.maxDurability === 0) return true;
    
    const durabilityPercent = (tool.durability / tool.maxDurability) * 100;
    
    if (durabilityPercent < 10) {
      console.log(`[TOOLS] ${tool.name} too damaged (${durabilityPercent.toFixed(0)}% durability left)`);
      return false;
    }
    
    return true;
  }
  
  async equipToolForAction(action) {
    console.log(`[TOOLS] Selecting tool for: ${action}`);
    
    const preferredTools = this.toolMap[action] || this.toolMap['default'];
    
    const items = this.bot.inventory.items();
    let bestTool = null;
    
    for (const preferred of preferredTools) {
      const tool = items.find(i => i.name === preferred && this.isToolGoodCondition(i));
      if (tool) {
        bestTool = tool;
        break;
      }
    }
    
    if (!bestTool) {
      console.log(`[TOOLS] No suitable tool for ${action}`);
      return false;
    }
    
    try {
      console.log(`[TOOLS] Equipping: ${bestTool.name}`);
      await this.bot.equip(bestTool, 'hand');
      console.log(`[TOOLS] ✓ Equipped: ${bestTool.name}`);
      return true;
    } catch (error) {
      console.error(`[TOOLS] Failed to equip:`, error.message);
      return false;
    }
  }
  
  async equipArmor() {
    console.log(`[TOOLS] Equipping full armor set`);
    
    const items = this.bot.inventory.items();
    
    const armorNeeded = [
      { slot: 'head', type: 'helmet' },
      { slot: 'torso', type: 'chestplate' },
      { slot: 'legs', type: 'leggings' },
      { slot: 'feet', type: 'boots' }
    ];
    
    const armorPriority = ['netherite', 'diamond', 'iron', 'gold', 'chainmail', 'leather'];
    
    for (const armor of armorNeeded) {
      for (const material of armorPriority) {
        const piece = items.find(i =>
          i.name === `${material}_${armor.type}`
        );
        
        if (piece) {
          try {
            await this.bot.equip(piece, armor.slot);
            console.log(`[TOOLS] ✓ Equipped ${armor.slot}: ${piece.name}`);
          } catch (error) {
            console.log(`[TOOLS] Failed to equip ${armor.slot}:`, error.message);
          }
          break;
        }
      }
    }
  }
  
  async equipFullGear(action) {
    console.log(`[TOOLS] Equipping full gear for: ${action}`);
    
    await this.equipArmor();
    
    await this.equipToolForAction(action);
  }
}

// Run tests
async function runTests() {
  console.log('=== ToolSelector Tests ===\n');
  
  const bot = new MockBot();
  const toolSelector = new ToolSelector(bot);
  
  // Test 1: Combat gear
  console.log('TEST 1: Equip combat gear');
  await toolSelector.equipFullGear('combat');
  assert(bot.equipped['hand'] && bot.equipped['hand'].name === 'netherite_sword', 'Combat sword should be netherite');
  assert(bot.equipped['head'] && bot.equipped['head'].name === 'netherite_helmet', 'Helmet should be netherite');
  console.log('✓ Test 1 passed\n');
  
  // Test 2: Mining gear
  console.log('TEST 2: Equip mining gear');
  bot.equipped = {};
  await toolSelector.equipFullGear('mining');
  assert(bot.equipped['hand'] && bot.equipped['hand'].name === 'netherite_pickaxe', 'Mining pickaxe should be netherite');
  console.log('✓ Test 2 passed\n');
  
  // Test 3: Fishing gear
  console.log('TEST 3: Equip fishing gear');
  bot.equipped = {};
  await toolSelector.equipFullGear('fishing');
  assert(bot.equipped['hand'] && bot.equipped['hand'].name === 'fishing_rod', 'Fishing tool should be fishing rod');
  console.log('✓ Test 3 passed\n');
  
  // Test 4: Tool durability check
  console.log('TEST 4: Check tool durability');
  const goodTool = { name: 'sword', maxDurability: 100, durability: 50 };
  const badTool = { name: 'sword', maxDurability: 100, durability: 5 };
  const noMaxDurability = { name: 'shield' };
  
  assert(toolSelector.isToolGoodCondition(goodTool) === true, 'Good tool should pass');
  assert(toolSelector.isToolGoodCondition(badTool) === false, 'Bad tool should fail');
  assert(toolSelector.isToolGoodCondition(noMaxDurability) === true, 'Tool without max durability should pass');
  console.log('✓ Test 4 passed\n');
  
  console.log('=== All tests passed! ===');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
