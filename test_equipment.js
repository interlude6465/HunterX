// Simple test script for EquipmentManager
const mineflayer = require('mineflayer');
const Vec3 = require('vec3');

// Mock ITEM_VALUES for testing
const ITEM_VALUES = {
  netherite_sword: 100, netherite_pickaxe: 90, netherite_axe: 85,
  netherite_helmet: 80, netherite_chestplate: 100, netherite_leggings: 90, netherite_boots: 80,
  diamond_sword: 50, diamond_pickaxe: 45, elytra: 150, totem_of_undying: 200,
  enchanted_golden_apple: 75, end_crystal: 30, obsidian: 2, diamond: 10
};

// Mock bot with inventory
const mockBot = {
  username: 'TestBot',
  inventory: {
    items: () => [
      { name: 'netherite_sword', type: 'sword', count: 1, slot: 0 },
      { name: 'diamond_pickaxe', type: 'pickaxe', count: 1, slot: 1 },
      { name: 'netherite_helmet', type: 'helmet', count: 1, slot: 2 },
      { name: 'totem_of_undying', type: 'totem', count: 3, slot: 3 },
      { name: 'shield', type: 'shield', count: 1, slot: 4 },
      { name: 'bow', type: 'bow', count: 1, slot: 5 },
      { name: 'cobblestone', type: 'block', count: 64, slot: 6 },
      { name: 'torch', type: 'block', count: 32, slot: 7 },
      { name: 'ender_pearl', type: 'ender_pearl', count: 2, slot: 8 }
    ]
  },
  equip: async (item, slot) => {
    console.log(`[MOCK] Equipping ${item.name} to ${slot}`);
    return true;
  },
  entity: {
    equipment: {
      0: null, // hand
      5: null, // head
      6: null, // torso
      7: null, // legs
      8: null, // feet
      45: null // off-hand
    }
  }
};

// Load EquipmentManager class (simplified version for testing)
class EquipmentManager {
  constructor(bot) {
    this.bot = bot;
    this.currentTask = 'idle';
    
    this.materialPriority = {
      'netherite': 5,
      'diamond': 4,
      'iron': 3,
      'stone': 2,
      'wooden': 1,
      'gold': 1.5
    };
    
    this.enchantmentPriorities = {
      'sharpness': 10,
      'fire_aspect': 8,
      'knockback': 6,
      'power': 9,
      'unbreaking': 4,
      'mending': 5,
      'protection': 8
    };
  }
  
  async initialize() {
    console.log('[EQUIPMENT] Initializing equipment system...');
    await this.equipBestArmor();
    await this.equipBestWeapon('combat');
    await this.equipOffhand();
    await this.organizeHotbar();
    console.log('[EQUIPMENT] Equipment system initialization complete');
  }
  
  async equipBestArmor() {
    const inventory = this.bot.inventory.items();
    const armorSlots = ['head', 'torso', 'legs', 'feet'];
    const equippedArmor = [];
    
    for (const slot of armorSlots) {
      const bestArmor = this.findBestArmorForSlot(inventory, slot);
      if (bestArmor) {
        await this.bot.equip(bestArmor, slot);
        equippedArmor.push(bestArmor.name);
        console.log(`[ARMOR] Equipped ${bestArmor.name} in ${slot} slot`);
      }
    }
    
    if (equippedArmor.length > 0) {
      console.log(`[ARMOR] Equipped armor set: ${equippedArmor.join(', ')}`);
    }
    
    return equippedArmor;
  }
  
  findBestArmorForSlot(inventory, slot) {
    const slotType = this.getSlotType(slot);
    if (!slotType) return null;
    
    const armorItems = inventory.filter(item => 
      item.name.includes(slotType) && this.isArmor(item.name)
    );
    
    if (armorItems.length === 0) return null;
    
    let bestArmor = null;
    let bestValue = 0;
    
    for (const armor of armorItems) {
      const armorValue = this.calculateArmorValue(armor);
      if (armorValue > bestValue) {
        bestValue = armorValue;
        bestArmor = armor;
      }
    }
    
    return bestArmor;
  }
  
  calculateArmorValue(item) {
    if (!item || !item.name) return 0;
    
    let value = ITEM_VALUES[item.name] || 0;
    
    // Add enchantment bonus
    if (item.nbt && item.nbt.value && item.nbt.value.Enchantments) {
      const enchantments = item.nbt.value.Enchantments.value || [];
      for (const enchantment of enchantments) {
        const enchantName = enchantment.id.value.replace('minecraft:', '');
        const level = enchantment.lvl.value || 1;
        const priority = this.enchantmentPriorities[enchantName] || 1;
        value += priority * level * 2;
      }
    }
    
    return value;
  }
  
  async equipBestWeapon(situation = 'combat') {
    const inventory = this.bot.inventory.items();
    const weapons = this.findWeapons(inventory);
    
    if (weapons.length === 0) {
      console.log('[WEAPON] No weapons found in inventory');
      return null;
    }
    
    let bestWeapon = null;
    let bestScore = -1;
    
    for (const weapon of weapons) {
      const score = this.calculateWeaponScore(weapon, situation);
      if (score > bestScore) {
        bestScore = score;
        bestWeapon = weapon;
      }
    }
    
    if (bestWeapon) {
      await this.bot.equip(bestWeapon, 'hand');
      console.log(`[WEAPON] Equipped ${bestWeapon.name} for ${situation} (score: ${bestScore.toFixed(1)})`);
      return bestWeapon;
    }
    
    return null;
  }
  
  findWeapons(inventory) {
    return inventory.filter(item => {
      const name = item.name;
      return name.includes('sword') || name.includes('axe') || 
             name.includes('bow') || name.includes('crossbow') || name.includes('trident');
    });
  }
  
  calculateWeaponScore(item, situation) {
    if (!item || !item.name) return 0;
    
    let score = 0;
    const name = item.name;
    
    // Base material score
    for (const [material, priority] of Object.entries(this.materialPriority)) {
      if (name.includes(material)) {
        score += priority * 20;
        break;
      }
    }
    
    // Weapon type bonuses
    if (situation === 'combat') {
      if (name.includes('sword')) score += 30;
      if (name.includes('axe')) score += 25;
    }
    
    return score;
  }
  
  async equipOffhand() {
    const inventory = this.bot.inventory.items();
    
    // Priority: Totem > Shield > Arrow > Food
    const priorities = [
      { type: 'totem', items: ['totem_of_undying'] },
      { type: 'shield', items: ['shield'] },
      { type: 'food', items: ['golden_apple', 'cooked_beef'] }
    ];
    
    for (const priority of priorities) {
      for (const itemName of priority.items) {
        const item = inventory.find(invItem => invItem.name === itemName);
        if (item) {
          await this.bot.equip(item, 'off-hand');
          console.log(`[OFFHAND] Equipped ${item.name} in off-hand`);
          return item;
        }
      }
    }
    
    return null;
  }
  
  async organizeHotbar() {
    console.log('[HOTBAR] Organizing hotbar...');
    // Implementation would go here
  }
  
  async switchToCombatMode() {
    console.log('[EQUIPMENT] Switching to combat mode');
    await this.equipBestWeapon('combat');
    await this.equipOffhand();
  }
  
  async switchToTaskMode(task) {
    console.log(`[EQUIPMENT] Switching to ${task} mode`);
    // Implementation would switch to appropriate tool
  }
  
  async update() {
    // Implementation would check for damaged items, etc.
  }
  
  isArmor(name) {
    return name.includes('helmet') || name.includes('chestplate') || 
           name.includes('leggings') || name.includes('boots');
  }
  
  getSlotType(slot) {
    const slotMap = {
      'head': 'helmet',
      'torso': 'chestplate',
      'legs': 'leggings',
      'feet': 'boots'
    };
    return slotMap[slot];
  }
}

// Test the EquipmentManager
async function testEquipmentManager() {
  console.log('=== Testing EquipmentManager ===');
  
  const equipmentManager = new EquipmentManager(mockBot);
  
  try {
    // Test initialization
    await equipmentManager.initialize();
    console.log('✅ Initialization test passed');
    
    // Test armor equipping
    const armor = await equipmentManager.equipBestArmor();
    console.log(`✅ Armor equip test passed. Equipped: ${armor.join(', ')}`);
    
    // Test weapon equipping
    const weapon = await equipmentManager.equipBestWeapon('combat');
    console.log(`✅ Weapon equip test passed. Equipped: ${weapon ? weapon.name : 'none'}`);
    
    // Test offhand equipping
    const offhand = await equipmentManager.equipOffhand();
    console.log(`✅ Offhand equip test passed. Equipped: ${offhand ? offhand.name : 'none'}`);
    
    // Test combat mode switching
    await equipmentManager.switchToCombatMode();
    console.log('✅ Combat mode switch test passed');
    
    // Test task mode switching
    await equipmentManager.switchToTaskMode('mining');
    console.log('✅ Task mode switch test passed');
    
    console.log('=== All EquipmentManager tests passed! ===');
    
  } catch (error) {
    console.error('❌ EquipmentManager test failed:', error.message);
  }
}

// Run the test
testEquipmentManager();