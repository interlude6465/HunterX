# Dupe Discovery Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start Your Bot
Connect HunterX to your Minecraft server as usual.

### Step 2: Get Trusted Permission
Make sure you're whitelisted with `trusted` level or higher:
```
set trust YourUsername trusted
```

### Step 3: Start Discovery
In-game, type:
```
!dupe discover start
```

That's it! The bot will now autonomously test all configured duplication methods.

---

## 📊 View Results

### Check Status While Running
```
!dupe discover status
```

### View Full Report
```
!dupe discover report
```

### Stop Discovery Early
```
!dupe discover stop
```

---

## 🎯 What Happens During Discovery

1. **Randomizes Methods** - Tests in random order to avoid detection
2. **Gathers Materials** - Attempts to find required items
3. **Tests Each Method** - Executes steps for each dupe method
4. **Monitors Inventory** - Checks for item duplication
5. **Logs Results** - Records success/failure with confidence levels
6. **Generates Theories** - Creates hypotheses about why methods work/fail
7. **Creates Report** - Summarizes findings and recommendations

---

## 📁 Where Data is Stored

All results saved in `./data/` directory:
- `dupe_discovery.json` - Complete attempt history
- `dupe_hypotheses.json` - AI-generated theories
- `dupe_discovery_report.json` - Summary reports

---

## ⚙️ Quick Configuration

Edit in-game or in `./data/config.json`:

```javascript
config.dupeDiscovery = {
  enabled: true,                    // Turn on/off
  methodRetryDelay: 5000,          // Delay between methods (ms)
  confidenceThreshold: 0.7,        // Success confidence (0-1)
  antiDetection: {
    spacingDelay: 10000,           // Delay between attempts (ms)
    randomizeOrder: true,          // Randomize method order
    mixNormalActivities: true,     // Mix in normal actions
    stopOnKick: true               // Stop if kicked
  }
}
```

---

## 🔍 Pre-configured Methods

The system tests these methods automatically:

| Method | Risk | Requirements |
|--------|------|--------------|
| Crystal PvP Dupe | High | End crystal, bed, totem |
| Anchor Dupe | Medium | Respawn anchor, glowstone |
| Shulker Dupe | Low | Shulker box |
| Totem Dupe | High | Totem of undying |
| Donkey Dupe | Low | Donkey, chest |

---

## 📈 Understanding Reports

### Success Rate
- **High (>50%)**: Many dupes work - server has weak protection
- **Medium (20-50%)**: Some dupes work - mixed protection
- **Low (<20%)**: Most dupes blocked - strong protection

### Confidence Level
- **90-100%**: Very confident it worked
- **70-89%**: Likely worked
- **50-69%**: Maybe worked
- **<50%**: Probably didn't work

### Server Safety Level
- **Low**: Easy to dupe on this server
- **Medium**: Some dupes work
- **High**: Strong anti-dupe protection

---

## ⚠️ Safety Tips

1. **Test on Authorized Servers Only** - Only use on servers where you have permission
2. **Start with Low-Risk Methods** - Edit config to disable high-risk methods first
3. **Increase Spacing** - If kicked, increase `spacingDelay` in config
4. **Use During Off-Peak** - Less likely to be noticed during low player count
5. **Don't Over-Test** - Excessive testing may trigger bans

---

## 🐛 Troubleshooting

### "Dupe discovery manager not initialized"
- Wait for bot to fully connect
- Try command again

### "Only trusted+ users can start dupe discovery"
- Check your whitelist level: `trust level`
- Ask admin to set you as trusted

### All Methods Failing
- Check if materials are available nearby
- Server may have strong anti-dupe
- Try increasing `materialGatherTimeout` in config

### Bot Got Kicked
- System automatically stops on kick
- Increase `spacingDelay` in antiDetection config
- Review server rules

---

## 💡 Pro Tips

1. **Review Hypotheses** - Check `dupe_hypotheses.json` for insights
2. **Test Variations** - If a method succeeds, try with different items
3. **Adjust Timing** - Some methods need specific timing adjustments
4. **Combine Methods** - Try combining successful methods
5. **Document Success** - Take notes on exact conditions when dupes work

---

## 📚 Learn More

- **Full Documentation**: See `DUPE_DISCOVERY_README.md`
- **Implementation Details**: See `DUPE_DISCOVERY_IMPLEMENTATION.md`
- **Get Help**: Check console for `[DUPE_DISCOVERY]` log messages

---

## 🎓 Example Session

```
Player: !dupe discover start
Bot: 🔍 Initiating autonomous dupe discovery...
Bot: 🔍 Starting dupe discovery mode! Testing known methods...
Bot: Testing: Shulker box duplication [low risk]
Bot: ❌ Failed: shulker_dupe - Could not gather required materials
Bot: Testing: Respawn anchor duplication [medium risk]
Bot: ❌ Failed: anchor_dupe - No significant inventory changes detected
Bot: Testing: Crystal PvP duplication method [high risk]
Bot: 🔨 Gathering materials: end_crystal, bed, totem_of_undying
Bot: ✅ SUCCESS! crystal_pvp_dupe works! Confidence: 85%
Bot: Testing: Totem duplication variant [high risk]
Bot: ❌ Failed: totem_dupe - No significant inventory changes detected
Bot: Testing: Donkey/chest duplication [low risk]
Bot: ❌ Failed: donkey_dupe - Could not gather required materials
Bot: ✅ Dupe discovery complete! Use "!dupe report" to see results.

Player: !dupe discover report
Bot: 📊 Dupe Discovery Report:
Bot:   Methods tested: 5
Bot:   Successful: 1 | Failed: 4
Bot:   Success rate: 20.0%
Bot:   Most promising: crystal_pvp_dupe (confidence: 85%)
Bot:   Server safety: high | Anti-dupe: Active
Bot:   Next: Test variations of successful methods with different items
```

---

## 🔗 Quick Links

- [Full README](DUPE_DISCOVERY_README.md)
- [Implementation Guide](DUPE_DISCOVERY_IMPLEMENTATION.md)
- [Main HunterX Docs](README.md)

---

**Ready to start? Just type:** `!dupe discover start`

Happy hunting! 🎯
