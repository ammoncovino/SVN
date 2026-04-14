# SVN — Symbiotic Value Network
## Developer Brief for Kevin

**Live Prototype:** [Click to explore](https://www.perplexity.ai/computer/a/svn-symbiotic-value-network-ZOaBl2FaSAeFhvMgexI1gg)

---

## What Is This

A value-based communication platform where ideas live, grow, or die based on real contribution — not popularity. Think Reddit's structure with a biological energy economy replacing upvotes.

Users spend energy to post ("plant"). Other users can join, expand, clarify, correct, or consume those plants. Every interaction transfers energy. The AI scores every post immediately for logic, rhetoric, nostalgia, emotional appeal, novelty, verifiability, and scope. There are no likes, no followers, no popularity rankings. The only metric is: does this grow or not?

---

## How The Energy Economy Works

**Identity = Starting Energy**
Users verify identity by linking accounts (email, phone, social, gaming profiles, etc.). Four tiers, 2 energy each, max 8 from verification alone. The real energy comes from participation.

| Tier | Name | Requires |
|---|---|---|
| 1 | Seedling | Email + Phone |
| 2 | Sapling | Social accounts (Facebook, Reddit, Instagram, X) |
| 3 | Established | Deep history (Steam, League of Legends, YouTube, LinkedIn, GitHub) |
| 4 | Canopy | Personal (photos, bio, family connections, address, gov ID) |

**Planting Costs Energy**
Creating a post ("planting") costs energy based on scope:

| Biome | Scope | Cost |
|---|---|---|
| Plot | Your street / block | 1 |
| Grove | Community / org | 2 |
| Forest | City / region | 3 |
| Biosphere | National / global | 5 |

**Contributions Transfer Energy**

| Action | Cost to Contributor | Effect on Plant |
|---|---|---|
| Join / Expand / Clarify | 1 energy | +1 to plant |
| Consume (if plant is weak — rhetoric > logic) | 2 energy | Consumer gains 3, plant loses 2 |
| Consume (if plant is strong — logic > rhetoric) | 2 energy | Consumer loses 2, gains nothing |
| Correct | 1 energy | Adds knowledge, no energy transfer |

**Nothing Truly Dies**
Failed plants don't get deleted — they become compost. Their energy returns to the ecosystem. First-come-first-served on consumption.

---

## AI Scoring (First Response)

Every plant gets an immediate AI evaluation before any human sees it. The AI scores across 7 dimensions:

- **Logic** — structural soundness, reasoning quality (positive)
- **Rhetoric** — persuasion techniques instead of logic (negative)
- **Nostalgia** — "good old days" appeals without structural basis (negative)
- **Emotional Appeal** — pathos over logos (flagged)
- **Novelty** — genuinely new insight vs. repackaged take
- **Verifiability** — can the claims be checked?
- **Scope** — appropriately scoped or over-claiming?

The prototype uses keyword heuristics. Production would use LLM-based analysis with a custom rhetoric identification lens (already designed — called the Alpha-Omega Lens).

---

## The Biome System

Four layers of scope, like subreddits but organized by geographic/systemic scale:

- **Plot** — Hyperlocal. Your street, your block. "The power lines here are ugly and expensive."
- **Grove** — Community. Your school, PTA, neighborhood org. "The PTA wasted $12K on candy sales."
- **Forest** — City/Region. Infrastructure, policy, city systems. "I-35 bottleneck costs 47 hours/year."
- **Biosphere** — National/Global. Systemic problems. "The prison-industrial feedback loop."

Energy flows between layers. A local insight can grow into a global conversation. Compost flows downward — failed global ideas feed city-level thinking.

---

## Tech Stack (Prototype)

- **Frontend:** React + Tailwind CSS + shadcn/ui
- **Backend:** Express.js
- **Database:** SQLite via Drizzle ORM
- **Routing:** Wouter (hash-based)
- **State Management:** TanStack Query

Source code: `/svn-prototype/`

Key files:
- `shared/schema.ts` — Data model (users, plants, contributions)
- `server/routes.ts` — API endpoints
- `client/src/pages/` — All page components
- `client/src/lib/aiScoring.ts` — AI heuristic scoring engine (to be replaced with LLM)

---

## What The Prototype Demonstrates

- Full energy transfer mechanics (plant, join, consume, correct)
- AI first-response scoring with 7-dimension breakdown
- 4-tier user verification system
- 4-layer biome structure with real sample content
- Composting mechanic (weak posts decompose, energy returns to ecosystem)
- User switching (5 demo users across all tiers)
- Dark forest aesthetic — the UI itself reinforces the biology metaphor

---

## What Production Needs

1. **Real authentication** — OAuth flows for each verification tier
2. **LLM-based AI scoring** — Replace keyword heuristics with the Alpha-Omega rhetoric lens
3. **Real-time updates** — WebSockets for live energy transfers
4. **The Three Monkeys Lens** — Input gate that checks posts before they enter the system (See No Evil / Hear No Evil / Speak No Evil verification)
5. **Steward interface** — Admin console monitored by the Alpha-Omega lens (steward actions are public and consumable)
6. **Geographic biome mapping** — GPS/address-based Plot biomes
7. **Energy degradation** — Use-it-or-lose-it decay over time (deciduous model)
8. **Cross-platform AI auditing** — Scan linked accounts for contradictions, unrecanted positions, ego patterns

---

## Language Guide

This system uses biological terminology. If you see social media language in the code, it's wrong.

| Say This | Not This |
|---|---|
| Plant | Post |
| Join / Feed | Like |
| Grow | Trend |
| Signal | Engagement |
| Energy / Value | Points |
| Life | Account |
| Consume | Downvote |
| Compost | Delete |
| The Proving Grounds | The Feed |
| Biome | Category |

---

## The Vision

> "You can only say something if you put value behind it. If what you say helps others, they give you value. If it doesn't, you lose it. The best ideas grow because people feed them."

Built by Ammon Covino. Questions → ask Ammon.
