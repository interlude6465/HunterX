# Simplified Baritone-Only Mining Mode

This document describes how to run a lightweight mining workflow that relies
exclusively on Baritone primitives while keeping the core `HunterX.js`
automation intact. The goal is to provide a minimal configuration surface so
the feature cannot conflict with the main bot orchestrator.

## Why This Does **Not** Conflict With `HunterX.js`

1. **No Cross-File Imports** – the simplified miner lives inside its own module
   (for example a standalone launch script or REPL snippet). It never `require`s
   or mutates `HunterX.js` internals.
2. **Namespaced Config** – mining presets are stored under
   `config.mining.baritoneOnly`. `HunterX.js` only reads that branch when
   explicitly asked to run in "baritone-only" mode, so the defaults for all
   other modes remain untouched.
3. **Opt-In Execution** – the simplified miner is launched with a dedicated CLI
   flag, e.g.:

   ```bash
   node HunterX.js --mode baritone-only --profile simple_miner.json
   ```

   If the flag is omitted, `HunterX.js` follows its existing multi-system flow.
4. **Separate Task Queue** – baritone-only mining pushes commands into
   `config.tasks.queue` with the tag `baritoneOnly`. `HunterX.js` checks that tag
   before delegating to other subsystems, so there is no contention with the
   Combat AI, Conversation AI, schematic builder, etc.
5. **Safe Defaults** – every baritone-only parameter (pathfinder cost map,
   goal radius, dig block list, pause/resume cadence) is cloned from the
   vanilla Baritone defaults at runtime. Even if the user deletes the optional
   profile file, the fallback still works.

## Quick Start

1. Copy the sample profile below into `profiles/simple_baritone_miner.json`:

   ```json
   {
     "mode": "baritone-only",
     "task": "mine",
     "veinTypes": ["iron_ore", "diamond_ore"],
     "maxRadius": 128,
     "minY": -58,
     "maxY": -10,
     "stashOnFullInventory": true,
     "returnToOrigin": true
   }
   ```
2. Start HunterX with the baritone-only flag (see command above).
3. The launcher injects a single `baritoneOnly` task into the queue. HunterX
   hands control of navigation, digging, and inventory checks to Baritone.
4. When the task completes or the user issues `!stop`, HunterX resumes its
   normal global automation cycle.

## Advanced Tips

- **Custom Filters** – add `"allowBlocks": ["stone", "deepslate"]` or
  `"denyBlocks": ["lava", "water"]` to the profile to tweak Baritone's cost
  heuristics without editing `HunterX.js`.
- **AFK Safety** – set `"panicOnPlayer": true` so the simplified miner pauses
  if a non-whitelisted player enters render distance. The panic handler simply
  toggles an internal flag; it does not kill any of the HunterX global timers.
- **Performance** – keep `maxRadius` modest (≤ 256) when running multiple bots.
  Each baritone-only miner manages its own pathfinder but still respects the
  shared `config.performance` budget enforced by HunterX.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Miner says it is "already running" | Another baritone-only task is active – use `!stop` or wait for completion. |
| Blocks are skipped | Ensure the ore name matches Baritone's registry (e.g. `diamond_ore`, not `diamonds`). |
| Inventory fills instantly | Enable `stashOnFullInventory` so HunterX invokes the built-in stash routine between legs. |

---
By keeping the simplified miner isolated and opt-in, we guarantee it never
conflicts with the main `HunterX.js` workflow while still offering a
streamlined Baritone-only experience.
