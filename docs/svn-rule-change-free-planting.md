# SVN Rule Change — Free Planting

**Date:** April 13, 2026
**Changed by:** Ammon Covino

---

## The Change

Planting no longer costs energy. Anyone can plant as many seeds as they want, at any biome level, at zero cost.

## Previous Rule

| Biome Layer | Old Cost |
|---|---|
| Plot | 1 energy |
| Grove | 2 energy |
| Forest | 3 energy |
| Biosphere | 5 energy |

## New Rule

| Biome Layer | New Cost |
|---|---|
| Plot | 0 |
| Grove | 0 |
| Forest | 0 |
| Biosphere | 0 |

## Ammon's Reasoning

> "I actually don't see why we can't have this open wide open where it doesn't cost anything to make a post. When someone consumes it, it's self-proving. So I don't think we should limit the amount of seeds you should be able to put out."

The system self-proves through consumption. If a plant is rhetoric, someone will consume it. The cost of bad ideas is that they get eaten. The barrier to entry should be zero — the barrier to survival is the lens.

## What Still Costs Energy

| Action | Cost | Unchanged |
|---|---|---|
| Join / Expand / Clarify | 1 | Yes |
| Consume (attempt) | 2 | Yes |
| Correct | 1 | Yes |

## Implications

- **No spam barrier at entry.** Spam plants get consumed instantly (free energy for predators). The more spam, the more energy for quality contributors.
- **Seed plants don't start with energy from the planter.** A new plant starts at 0 energy. It only gains energy when someone joins it.
- **Planting is unlimited.** A Seedling with 2 energy can plant 1,000 seeds. But they can only join/consume with their actual energy.
- **This makes the AI scoring even more critical.** The Three Monkeys Gate is the only pre-entry filter. Everything that passes the gate enters the ecosystem.

## What This Changes in Code

```typescript
// OLD
const plantCost = { plot: 1, grove: 2, forest: 3, biosphere: 5 };

// NEW
const plantCost = { plot: 0, grove: 0, forest: 0, biosphere: 0 };
// Plants start with 0 energy. Energy comes from contributions.
```

## Files to Update
- `svn-cursor-prompt.md` (Planting Costs table)
- `svn-technical-roadmap.md` (Energy Economy section)
- `svn-v3-system-model.md` (interaction loop)
- `svn-developer-brief.md` (economics section)
- `.cursor/rules` (Planting Costs table)
- Prototype code (if still being referenced)
