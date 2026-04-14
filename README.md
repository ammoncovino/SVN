# SVN — Symbiotic Value Network

A platform where communities plant real problems with real numbers, and everyone works together to prove or disprove solutions. An AI scores every contribution for logic vs. rhetoric. Ideas that can't survive scrutiny get consumed — their energy goes to whoever dismantled them. What's left standing is the strongest answer, not the loudest voice.

**Creator:** Ammon Covino

---

## How It Works

- **Plant** a structural problem with verifiable data (not an opinion — a mechanism)
- An AI (the **Alpha-Omega Lens**) immediately scores it across 7 dimensions: logic, rhetoric, nostalgia, emotional appeal, novelty, verifiability, scope
- The **Three Monkeys Gate** screens every plant before entry — See No Evil (verifiable?), Hear No Evil (testable?), Speak No Evil (signal, not noise?)
- Other users **join** (add evidence), **consume** (prove it's rhetoric and take its energy), or **correct** (add knowledge)
- Energy transfers are deterministic. No likes. No followers. No popularity. Just structure vs. rhetoric.
- What survives is the strongest answer. What doesn't becomes **compost** — its energy returns to the ecosystem for someone else to use better.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| State | TanStack Query |
| Database | PostgreSQL (SQLite in prototype) |
| ORM | Drizzle |
| Auth | NextAuth.js |
| Real-time | Socket.io |
| AI Queue | BullMQ + Redis |
| LLM | OpenAI (abstracted for provider swap) |
| Hosting | Vercel (frontend) + Railway (backend + DB) |

---

## Prototype

The current code is a working proof of concept: React + Express + SQLite with heuristic AI scoring, 4-tier verification, 4-layer biomes, energy transfer mechanics, and composting. It proves the interaction model works.

**[Live Demo](https://www.perplexity.ai/computer/a/svn-symbiotic-value-network-ZOaBl2FaSAeFhvMgexI1gg)**

---

## Setup (Prototype)

```bash
# Clone
git clone https://github.com/ammoncovino/SVN.git
cd SVN

# Install
npm install

# Run (dev)
npm run dev

# App runs at http://localhost:5000
```

---

## Project Structure

```
/                           # Prototype source (React + Express + Drizzle)
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared schema (Drizzle)
├── .cursor/rules           # Cursor AI prompt — full system context
└── docs/
    ├── svn-technical-roadmap.md        # 3-phase dev plan with effort estimates
    ├── svn-developer-brief.md          # System summary
    ├── svn-cursor-prompt.md            # Full Cursor prompt (also in .cursor/rules)
    ├── svn-v3-system-model.md          # Complete system model
    ├── svn-v4-verification-locked.md   # Verification tiers (2/tier, max 8)
    ├── svn-biome-structure.md          # 4-layer biome design + steward mirror
    ├── svn-terminology.md              # Biology language mapping
    ├── svn-lens-evaluation.md          # Alpha-Omega evaluation of seed plants
    ├── svn-100-topics.md               # 100 structural topics for the Proving Grounds
    ├── svn-rule-change-free-planting.md # Planting costs 0 — system self-proves
    ├── svn-failure-points-final.md     # Failure analysis (7/8 resolved)
    ├── rush-power-windows-analysis.md  # Rush album structural parallels
    └── seed-plants/
        ├── README.md                   # 10 seed plants with research backing
        └── research/                   # Full research files (10 topics)
```

---

## Development Roadmap

| Phase | What | Timeline |
|---|---|---|
| **1 — MVP** | Real auth, energy economy, biomes, heuristic AI scoring | 8–10 weeks |
| **2 — LLM Scoring** | Alpha-Omega Lens, Three Monkeys Gate, WebSockets | 5–7 weeks |
| **3 — Expansion** | Geographic biomes, cross-platform auditing, energy decay, steward mirror | 8–12 weeks |

See `docs/svn-technical-roadmap.md` for the full breakdown.

---

## Language

SVN uses biological terminology. Social media language is wrong.

| Say This | Not This |
|---|---|
| Plant | Post |
| Join / Feed | Like |
| Grow | Trend |
| Signal | Engagement |
| Energy / Value | Points |
| Consume | Downvote |
| Compost | Delete |
| Biome | Category |
| Steward | Moderator |
| Proving Grounds | Feed |

---

## License

All rights reserved. © Ammon Covino
