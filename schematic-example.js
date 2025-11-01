// Example usage of SchematicLoader
// This demonstrates how to use the SchematicLoader independently

const fs = require('fs');
const nbt = require('prismarine-nbt');
const { promisify } = require('util');

// Simple standalone SchematicLoader example
class SchematicLoaderExample {
  constructor() {
    this.parseNBT = promisify(nbt.parse);
  }

  async loadAndInspect(filepath) {
    console.log(`\n[EXAMPLE] Loading schematic: ${filepath}`);
    
    try {
      const buffer = fs.readFileSync(filepath);
      const { parsed } = await this.parseNBT(buffer);
      
      console.log('\n[EXAMPLE] NBT Structure:');
      console.log('- Root keys:', Object.keys(parsed));
      
      if (parsed.Schematic) {
        const schematic = parsed.Schematic;
        console.log('- Width:', schematic.Width?.value);
        console.log('- Height:', schematic.Height?.value);
        console.log('- Length:', schematic.Length?.value);
        console.log('- Version:', schematic.Version?.value || 1);
        
        if (schematic.Palette) {
          console.log('- Palette entries:', Object.keys(schematic.Palette.value).length);
          console.log('- Sample blocks:', Object.keys(schematic.Palette.value).slice(0, 5));
        }
        
        if (schematic.BlockData) {
          console.log('- Block data length:', schematic.BlockData.value.length);
        }
      }
      
      console.log('\n[EXAMPLE] Successfully parsed!');
    } catch (err) {
      console.error('[EXAMPLE] Error:', err.message);
    }
  }
}

// Usage example
if (require.main === module) {
  console.log('=== SchematicLoader Example ===');
  console.log('\nThis example shows how to inspect schematic files.');
  console.log('Usage: node schematic-example.js <path-to-schematic>');
  
  const filepath = process.argv[2];
  
  if (!filepath) {
    console.log('\n[EXAMPLE] No file provided. Showing example integration...\n');
    console.log('// In your bot code:');
    console.log('const schematic = await bot.schematicLoader.loadSchematic("./build.schem", "my-build");');
    console.log('console.log(`Loaded ${schematic.name}: ${schematic.metadata.width}x${schematic.metadata.height}x${schematic.metadata.length}`);');
    console.log('console.log(`Total blocks: ${schematic.blockCount}`);');
    console.log('console.log(`Materials:`, schematic.materialCounts);');
    process.exit(0);
  }
  
  if (!fs.existsSync(filepath)) {
    console.error(`[EXAMPLE] File not found: ${filepath}`);
    process.exit(1);
  }
  
  const example = new SchematicLoaderExample();
  example.loadAndInspect(filepath).catch(console.error);
}

module.exports = SchematicLoaderExample;
