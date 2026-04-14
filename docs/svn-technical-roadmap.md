# SVN — Technical Roadmap
## Symbiotic Value Network — Prioritized Development Phases

**Prepared for:** Kevin (Developer)
**Prepared by:** Ammon Covino
**Date:** April 13, 2026
**Reference:** [Live Prototype](https://www.perplexity.ai/computer/a/svn-symbiotic-value-network-ZOaBl2FaSAeFhvMgexI1gg) | Developer Brief | System Model v3 | Biome Structure Doc

---

## How to Read This Document

Three phases. Each builds on the last. Each has a clear deliverable. Effort estimates assume a single full-stack developer working full-time. If part-time, multiply accordingly.

**Phase 1** gets a working product with real users. **Phase 2** makes the AI actually smart. **Phase 3** scales the system to geographic reality.

---

# PHASE 1 — MVP (Foundation)
### Goal: Real users, real energy, real plants. Replace the demo prototype with a production system.
### Timeline: 8–12 weeks

---

## 1.1 Authentication & Identity Verification

The verification system IS the energy source. Without real auth, there's no real energy economy.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Email/password auth | Standard signup + email verification (Tier 1 — Seedling, partial) | 3–4 days |
| Phone verification | SMS/TOTP verification via Twilio or similar (completes Tier 1) | 2–3 days |
| OAuth integration — Social | Facebook, Reddit, Instagram, X login-and-link (Tier 2 — Sapling) | 5–7 days |
| OAuth integration — Deep History | Steam, Riot Games, Google Play, Xbox/PSN, YouTube, LinkedIn, GitHub (Tier 3 — Established) | 7–10 days |
| Personal verification flow | Photo upload, bio, family connections, optional gov ID (Tier 4 — Canopy) | 5–7 days |
| Verification state machine | Track tier progression, calculate energy awards (exactly 2 per tier, max 8) | 2–3 days |
| Linked account data ingestion | Pull account age, post history, friend count — store for AI to use later | 3–5 days |

### Tech Decisions

- **Auth framework:** NextAuth.js (if migrating to Next.js) or Passport.js (if staying Express). NextAuth handles OAuth providers out of the box and has adapters for most databases.
- **Session management:** JWT with refresh tokens. Stateless where possible.
- **Database:** Migrate from SQLite to PostgreSQL. SQLite won't survive concurrent writes from real users.
- **Sensitive data:** Linked account tokens encrypted at rest. Gov ID stored hashed or via third-party identity verification service (Jumio, Onfido).

### Data Model Changes

```
users
├── id (uuid)
├── email (unique, verified)
├── phone (verified)
├── password_hash
├── display_name
├── bio
├── profile_photo_url
├── verification_tier (1-4)
├── energy_balance (decimal)
├── created_at
└── updated_at

linked_accounts
├── id (uuid)
├── user_id (fk → users)
├── provider (enum: facebook, reddit, instagram, x, steam, riot, google_play, xbox, psn, youtube, linkedin, github)
├── provider_user_id
├── provider_username
├── account_age_days (int)
├── metadata (jsonb — post count, friend count, etc.)
├── access_token_encrypted
├── linked_at
└── verified_at

verification_events
├── id (uuid)
├── user_id (fk → users)
├── tier (1-4)
├── method (email, phone, social, deep_history, personal)
├── energy_awarded (always 2)
├── created_at
```

### Effort Estimate: 4–5 weeks

---

## 1.2 Energy Economy Engine

The core transaction system. Every action costs or transfers energy. This has to be airtight — if the ledger breaks, the whole system breaks.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Energy ledger | Double-entry bookkeeping for all energy transfers. Every transaction has a source and destination. | 3–4 days |
| Planting engine | Create a plant, deduct cost based on biome scope (Plot=1, Grove=2, Forest=3, Biosphere=5) | 2–3 days |
| Contribution engine | Join/Expand/Clarify (cost 1, +1 to plant), Correct (cost 1, no transfer), Consume (cost 2, conditional gain) | 3–4 days |
| Consumption logic | If rhetoric > logic on target plant: consumer gains 3, plant loses 2. If logic > rhetoric: consumer loses 2, gains nothing. | 2–3 days |
| Compost system | Failed plants decompose. Energy returns to ecosystem pool. First-come-first-served on claiming compost. | 2–3 days |
| Energy validation | Prevent negative balances. Prevent double-spending. Prevent race conditions on compost claims. | 2–3 days |
| Transaction history | Full audit trail for every energy movement | 1–2 days |

### Data Model

```
energy_transactions
├── id (uuid)
├── type (enum: verification_award, plant_cost, join, expand, clarify, correct, consume_success, consume_fail, compost_claim, decay)
├── source_user_id (nullable — null for system events)
├── target_user_id (nullable)
├── plant_id (nullable — fk → plants)
├── amount (decimal, signed)
├── balance_after (decimal)
├── metadata (jsonb)
├── created_at

plants
├── id (uuid)
├── author_id (fk → users)
├── biome_id (fk → biomes)
├── biome_layer (enum: plot, grove, forest, biosphere)
├── title
├── body (text)
├── energy_balance (decimal — current stored energy)
├── plant_cost (int — what it cost to create)
├── status (enum: living, composting, composted)
├── ai_score (jsonb — 7 dimensions)
├── created_at
├── composted_at (nullable)

contributions
├── id (uuid)
├── plant_id (fk → plants)
├── user_id (fk → users)
├── type (enum: join, expand, clarify, correct, consume)
├── body (text)
├── energy_cost (decimal)
├── energy_gained (decimal)
├── ai_score (jsonb)
├── created_at

compost_pool
├── id (uuid)
├── source_plant_id (fk → plants)
├── biome_id (fk → biomes)
├── energy_available (decimal)
├── claimed_by (fk → users, nullable)
├── created_at
├── claimed_at (nullable)
```

### Critical Rule: Use database transactions with row-level locking for all energy operations. No eventual consistency — energy is deterministic.

### Effort Estimate: 2–3 weeks

---

## 1.3 Biome CRUD & Navigation

Four-layer biome system. Users can browse by scope, create topic-specific biomes within any layer.

### What to Build

| Component | Description | Effort |
|---|---|---|
| System biomes | Pre-seed the four layers (Plot, Grove, Forest, Biosphere) with default biomes | 1 day |
| User-created biomes | Allow creation within any layer. Cost energy to create (scales with scope). | 2–3 days |
| Biome browsing | Filter/search by layer, topic, location. Show plant count, energy activity. | 2–3 days |
| Biome detail view | All plants in a biome, sorted by energy balance / recency / AI score | 2 days |
| Cross-biome linking | A plant in Plot can reference/grow into a Grove plant. Roots reach up. | 2–3 days |
| Compost flow | Failed Biosphere plant → compost flows down to Forest → Grove → Plot | 2 days |

### Data Model

```
biomes
├── id (uuid)
├── name
├── description
├── layer (enum: plot, grove, forest, biosphere)
├── created_by (fk → users, nullable — null for system biomes)
├── location (geography point, nullable — for Plot/Forest layers)
├── radius_meters (int, nullable — for geo-scoped biomes)
├── plant_count (int, denormalized)
├── total_energy (decimal, denormalized)
├── created_at
```

### Effort Estimate: 1.5–2 weeks

---

## 1.4 Basic AI Scoring (Heuristic — Upgraded)

The prototype has keyword-based scoring. Phase 1 upgrades this to a more robust heuristic that still doesn't require LLM infrastructure — that's Phase 2.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Scoring service | Standalone module that accepts text, returns 7-dimension scores (logic, rhetoric, nostalgia, emotional appeal, novelty, verifiability, scope) | 3–4 days |
| NLP-based analysis | Use spaCy or Compromise.js for sentence structure, claim detection, sentiment. Better than keyword matching. | 3–4 days |
| Score display UI | Clear breakdown of all 7 dimensions on every plant and contribution | 2 days |
| Score-based mechanics | Hook scores into consumption logic — rhetoric > logic check drives consume outcomes | 1–2 days |

### Why Not Jump Straight to LLM?

Cost. An LLM call per plant at scale is expensive. Phase 1 needs to validate the energy mechanics work before investing in LLM infrastructure. The heuristic scoring is a placeholder that proves the interaction model.

### Effort Estimate: 1.5–2 weeks

---

## 1.5 Frontend & UX

Rebuild the prototype frontend into a production-grade interface.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Auth flows | Login, signup, email verify, phone verify, OAuth linking — all with real UI | 3–4 days |
| User dashboard | Energy balance, verification tier, transaction history, active plants | 3–4 days |
| Plant creation flow | Biome picker → scope confirmation → energy cost display → write → plant | 2–3 days |
| Plant detail view | Full plant with AI scores, contributions, energy history, consume/join/correct actions | 3–4 days |
| Biome explorer | Browse all four layers, search, filter, create new biomes | 2–3 days |
| Responsive design | Mobile-first. Most users will be on phones. | 2–3 days |
| Dark forest aesthetic | Maintain the biology-rooted visual identity from the prototype | 1–2 days |

### Tech Stack Recommendation

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js (App Router) | Server components, API routes, built-in auth support, deployment simplicity |
| Styling | Tailwind CSS | Already in prototype, fast iteration |
| Components | shadcn/ui | Already in prototype, accessible, customizable |
| State | TanStack Query | Already in prototype, handles cache invalidation for energy updates |
| Database | PostgreSQL | Concurrent writes, ACID transactions, row-level locking |
| ORM | Drizzle | Already in prototype, type-safe, lightweight |
| Hosting | Vercel (frontend) + Railway/Fly.io (backend + DB) | Easy deployment, auto-scaling, reasonable cost |
| Real-time | Polling initially → WebSockets in Phase 2 | Don't over-engineer early |

### Effort Estimate: 2.5–3 weeks

---

## Phase 1 Summary

| Section | Effort |
|---|---|
| 1.1 Auth & Verification | 4–5 weeks |
| 1.2 Energy Economy | 2–3 weeks |
| 1.3 Biome CRUD | 1.5–2 weeks |
| 1.4 Basic AI Scoring | 1.5–2 weeks |
| 1.5 Frontend & UX | 2.5–3 weeks |
| **Total (sequential)** | **12–15 weeks** |
| **Total (parallelized — auth + backend, frontend concurrent)** | **8–10 weeks** |

### Phase 1 Delivers
- Real users signing up and verifying identity across 4 tiers
- Real energy economy — plant, join, consume, compost
- Four-layer biome system with cross-biome mechanics
- AI heuristic scoring on every plant (7 dimensions)
- Production-grade frontend with dark forest aesthetic

---

# PHASE 2 — LLM-Powered Scoring & The Dual Lens System
### Goal: Replace heuristic scoring with real AI analysis. Implement the Alpha-Omega Rhetoric Lens and Three Monkeys Lens as production systems.
### Timeline: 6–10 weeks (starts after Phase 1 core is stable)

---

## 2.1 Alpha-Omega Rhetoric Lens — LLM Integration

This is the core intelligence of SVN. The Alpha-Omega Lens identifies rhetoric vs. logic at a structural level. It's already designed — it needs to be implemented as an LLM evaluation pipeline.

### The Alpha-Omega Lens (6-Point Structure)

The lens operates on these principles, which become the LLM system prompt:

1. **Structure before belief** — Evaluate the structural soundness of an argument before considering whether you agree with it
2. **See input discipline** — What data is actually present? Separate observation from interpretation
3. **Hear mechanism discipline** — What causal mechanism is claimed? Is it testable?
4. **Speak output discipline** — What conclusion follows from the structure? Only output what the evidence supports
5. **Falsifiable claims** — Can the claims be proven wrong? If not, they're not claims — they're rhetoric
6. **Operational meaning** — Does the statement have concrete, testable implications? Or is it just words?

### What to Build

| Component | Description | Effort |
|---|---|---|
| LLM evaluation service | Standalone service that accepts plant text and returns structured evaluation via the Alpha-Omega lens | 4–5 days |
| System prompt engineering | Encode the 6-point Alpha-Omega structure as a system prompt. Extensive testing/iteration. | 5–7 days |
| Structured output parsing | Force LLM to return JSON with scores for all 7 dimensions + explanation text | 2–3 days |
| Confidence calibration | Test against known rhetoric-heavy and logic-heavy examples. Tune scoring thresholds. | 3–5 days |
| Fallback pipeline | If LLM fails or is slow, fall back to Phase 1 heuristic scoring. Never block a plant. | 1–2 days |
| Cost management | Token budgeting, caching, batching. Estimate: ~$0.01–0.05 per evaluation with GPT-4o-class models. | 2–3 days |
| Score comparison tooling | Side-by-side: old heuristic vs. new LLM scores on the same plants. Validate improvement. | 2–3 days |

### LLM Provider Strategy

| Option | Pros | Cons |
|---|---|---|
| OpenAI (GPT-4o / GPT-4.1) | Best structured output, function calling, proven at scale | Vendor lock-in, cost |
| Anthropic (Claude) | Strong reasoning, good at nuanced rhetoric detection | Slightly different API patterns |
| Open-source (Llama 3, Mistral) via Ollama/vLLM | No API cost, full control, privacy | Requires GPU infrastructure, lower quality on rhetoric detection |
| Multi-provider with fallback | Best of all worlds | More complex integration |

**Recommendation:** Start with OpenAI for quality, design the abstraction layer so you can swap providers. The evaluation service should take text in, return scores out — the LLM provider is an implementation detail behind that interface.

### Architecture

```
Plant Created
    │
    ▼
Evaluation Queue (Redis/BullMQ)
    │
    ▼
Alpha-Omega Evaluation Worker
    ├── Builds prompt with 6-point lens structure
    ├── Sends to LLM provider
    ├── Parses structured JSON response
    ├── Validates scores within expected ranges
    ├── Stores evaluation result
    │
    ▼
Plant Updated with AI Score
    │
    ▼
WebSocket pushes score to connected clients
```

### Sample System Prompt (Alpha-Omega Lens)

```
You are the Alpha-Omega Rhetoric Lens. Your purpose is to evaluate text
for structural soundness versus rhetorical manipulation.

EVALUATION PROTOCOL:

1. STRUCTURE BEFORE BELIEF
   Does this text present a logical structure? Identify premises and
   conclusions. Do the conclusions follow from the premises? Set aside
   whether you agree with the conclusion.

2. SEE — INPUT DISCIPLINE
   What observable data or verifiable facts are cited? Separate direct
   observation from interpretation, assumption, and hearsay.

3. HEAR — MECHANISM DISCIPLINE
   What causal mechanism is proposed? Is the mechanism testable? Could
   you design an experiment or observation to verify it?

4. SPEAK — OUTPUT DISCIPLINE
   Does the conclusion follow strictly from the structure? Or does it
   overreach beyond what the evidence supports?

5. FALSIFIABILITY
   Are the claims falsifiable? Could they be proven wrong with evidence?
   Unfalsifiable claims are rhetoric, not argument.

6. OPERATIONAL MEANING
   Does the statement have concrete, testable implications in the real
   world? Or is it abstract language with no operational consequence?

SCORE EACH DIMENSION (0.0 to 1.0):
- logic: Structural soundness of reasoning
- rhetoric: Degree of persuasion technique used instead of logic (NEGATIVE — higher = worse)
- nostalgia: "Good old days" appeals without structural basis (NEGATIVE)
- emotional_appeal: Pathos over logos (FLAG — not automatic negative)
- novelty: Genuinely new insight vs. repackaged common take
- verifiability: Can the claims be checked?
- scope: Appropriately scoped vs. over-claiming

Return JSON only.
```

### Effort Estimate: 3–4 weeks

---

## 2.2 Three Monkeys Lens — Pre-Plant Gate

The Three Monkeys Lens is the input filter. Before a plant enters the ecosystem, it passes through three checks. This is NOT moderation — it's structural validation.

### The Three Gates

| Gate | Name | Question | What It Catches |
|---|---|---|---|
| 1 | See No Evil | Is the input based on verifiable observation? | Hearsay, rumor, fabricated claims, illegal content |
| 2 | Hear No Evil | Is the mechanism grounded in testable logic? | Conspiracy logic, unfalsifiable frameworks, magical thinking |
| 3 | Speak No Evil | Does the output serve signal, not noise? | Pure venting, ad hominem, threats, doxxing |

### What to Build

| Component | Description | Effort |
|---|---|---|
| Pre-plant evaluation pipeline | Before a plant is published, run through 3 gates. Each gate returns pass/flag/block. | 3–4 days |
| Gate 1: See No Evil | LLM checks for verifiable observation vs. hearsay. Also catches illegal content, threats, doxxing. Hard floor enforcement. | 3–4 days |
| Gate 2: Hear No Evil | LLM checks for testable mechanisms vs. unfalsifiable claims | 2–3 days |
| Gate 3: Speak No Evil | LLM checks for signal vs. noise. Catches pure venting, ad hominem. | 2–3 days |
| Gate UI | Pre-plant panel showing the three checks. User sees each gate's assessment before confirming "Plant to the Proving Grounds" | 3–4 days |
| Override + appeal | If a gate flags (not blocks), user can acknowledge the flag and plant anyway. Blocked content (illegal/threats) has no override. | 2 days |
| Hard floor enforcement | CSAM, terrorism, direct threats, doxxing — blocked at Gate 1, never enters system. This is structural, not moderation. | 2–3 days |

### Architecture

```
User Writes Plant
    │
    ▼
Three Monkeys Lens (Pre-Plant)
    ├── Gate 1: See No Evil → pass / flag / BLOCK
    ├── Gate 2: Hear No Evil → pass / flag
    ├── Gate 3: Speak No Evil → pass / flag
    │
    ├── If any gate = BLOCK → Plant rejected (hard floor)
    ├── If gates = flag → User sees warnings, can proceed
    ├── If gates = pass → Plant enters ecosystem
    │
    ▼
Plant Published
    │
    ▼
Alpha-Omega Lens Evaluates (async, from 2.1)
    │
    ▼
AI Score Attached to Plant
```

### Key Distinction

The Three Monkeys Lens and Alpha-Omega Lens are NOT the same thing:

- **Three Monkeys** = input gate. Runs BEFORE publication. Binary-ish: can this enter the system?
- **Alpha-Omega** = evaluation engine. Runs AFTER publication. Scores the quality, identifies rhetoric vs. logic, drives the energy mechanics.

Both are LLM-powered. Both use the same underlying principles (structure > belief, falsifiability, testability). But they serve different roles in the pipeline.

### Effort Estimate: 2.5–3.5 weeks

---

## 2.3 Real-Time Updates (WebSockets)

Energy transfers need to be visible in real time. When someone joins your plant, you should see it happen.

### What to Build

| Component | Description | Effort |
|---|---|---|
| WebSocket server | Socket.io or ws on the Express/Node backend | 2–3 days |
| Event types | plant_created, contribution_added, energy_transferred, plant_composted, ai_score_ready, compost_claimed | 2 days |
| Client subscription | Subscribe to biome channels, plant-specific channels, user energy updates | 2–3 days |
| Optimistic UI | Show energy changes immediately, reconcile with server confirmation | 2 days |
| Connection management | Reconnection, heartbeat, auth token refresh on WebSocket connections | 1–2 days |

### Effort Estimate: 1.5–2 weeks

---

## Phase 2 Summary

| Section | Effort |
|---|---|
| 2.1 Alpha-Omega Lens (LLM) | 3–4 weeks |
| 2.2 Three Monkeys Lens (Pre-Plant Gate) | 2.5–3.5 weeks |
| 2.3 Real-Time Updates | 1.5–2 weeks |
| **Total (sequential)** | **7–9.5 weeks** |
| **Total (parallelized — lens work + WebSocket concurrent)** | **5–7 weeks** |

### Phase 2 Delivers
- Real LLM-powered rhetoric identification via the Alpha-Omega Lens
- Three Monkeys input gate with hard floor enforcement
- Every plant scored by actual AI before humans see it
- Real-time energy updates across all connected clients
- The system can now distinguish logic from rhetoric at scale

---

# PHASE 3 — Biome Expansion & Advanced Systems
### Goal: Geographic biomes, cross-platform AI auditing, energy degradation, steward accountability. This is where SVN becomes a real-world problem-solving engine.
### Timeline: 8–14 weeks (starts after Phase 2 core lenses are stable)

---

## 3.1 Geographic Biome Mapping

Plot and Forest biomes need real geography. A Plot is your street. A Forest is your city. This requires location data.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Location services | GPS/address input for users, geocoding via Google Maps or Mapbox | 3–4 days |
| Plot auto-generation | Define Plots by address radius (e.g., 0.5-mile blocks). Auto-create when first user in area plants. | 3–5 days |
| Forest auto-generation | Define Forests by metro area / city boundaries. Use census or municipal boundary data. | 3–4 days |
| Map interface | Visual map showing biome activity by geography. Zoom in = Plot, zoom out = Forest/Biosphere. | 5–7 days |
| Location-based feed | "What's being planted near me?" — default view sorted by proximity. | 2–3 days |
| Privacy controls | Users choose precision of location sharing (exact, neighborhood, city, none). | 2–3 days |

### Tech Choices

- **Geocoding:** Mapbox or Google Maps Geocoding API
- **Spatial queries:** PostGIS extension for PostgreSQL
- **Map rendering:** Mapbox GL JS or Leaflet
- **Boundary data:** US Census TIGER/Line files for city/metro boundaries

### Effort Estimate: 3–4 weeks

---

## 3.2 Cross-Platform AI Auditing

The AI doesn't just score plants — it looks at the whole person. Linked accounts become a behavioral profile. The system can identify contradictions, ego patterns, and unrecanted positions.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Account data pipeline | Periodic pull from linked accounts (post history, public statements, engagement patterns) | 5–7 days |
| Contradiction detection | LLM compares current plants against historical positions on linked platforms. Flag contradictions. | 5–7 days |
| Ego scoring | Identify positions the user has been proven wrong on but never recanted. Accumulate ego score. | 3–5 days |
| Behavioral consistency score | How consistent is the user across platforms? Does their SVN behavior match their Reddit/X behavior? | 3–5 days |
| Profile transparency view | Any user can see what the AI knows about another user (from public data only). Glass walls. | 3–4 days |
| Rate limiting & API compliance | Respect platform rate limits and ToS. Cache aggressively. | 2–3 days |

### Privacy & Ethics Notes

- Only public data from linked platforms. Never access DMs, private posts, or locked accounts.
- Users consent by linking accounts. Unlinking removes data.
- The AI summarizes patterns — it does not expose raw data from other platforms.
- "Here's what we think we know based on what others said about them" — always framed as inference, not fact.

### Effort Estimate: 3.5–5 weeks

---

## 3.3 Energy Degradation (Deciduous Model)

Energy is not permanent. Use it or lose it. Like deciduous trees shedding leaves — new growth each cycle.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Decay scheduler | Cron job that applies energy decay on a cycle (weekly or monthly — tunable). | 2–3 days |
| Decay formula | Percentage-based decay. Inactive energy decays faster. Active participants retain more. | 2–3 days |
| Evergreen threshold | High performers (consistent quality contributions) get reduced or zero decay — the evergreen model. | 2–3 days |
| Decay notifications | Tell users when energy is about to decay. Incentivize activity. | 1–2 days |
| Decay-to-compost pipeline | Decayed energy becomes compost, flows to ecosystem pool. | 1–2 days |
| Seasonal cycles | Optional: "seasons" that reset energy, create fresh starts. Think fiscal quarters for the energy economy. | 3–5 days |

### Design Parameters (To Be Tuned)

| Parameter | Starting Value | Notes |
|---|---|---|
| Decay cycle | Weekly | Too fast = punishing, too slow = hoarding |
| Base decay rate | 5% per cycle | Of inactive energy (energy not involved in any transaction that cycle) |
| Active protection | 0% decay on energy used in transactions that cycle | Reward participation |
| Evergreen threshold | Top 10% contributors by quality score | Not quantity — quality. AI scores determine this. |
| Minimum balance | 2 (Seedling energy) | You can never decay below your verification floor |

### Effort Estimate: 2–3 weeks

---

## 3.4 Steward System with Alpha-Omega Mirror

Stewards are NOT moderators. They maintain the structural integrity of biomes. The Alpha-Omega Lens watches them the same way it watches everyone else.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Steward role & permissions | Assign steward to biomes. Stewards can pin structural announcements, adjust biome metadata. They CANNOT delete plants or ban users. | 2–3 days |
| Steward action log | Every action is public. Every action is a "plant" that can be consumed. | 2–3 days |
| Alpha-Omega Mirror | Continuous AI evaluation of steward actions against 6 mirror questions (see below) | 4–5 days |
| Mirror UI | Public dashboard showing steward's mirror score over time | 2–3 days |
| Steward consumption | Users can consume steward actions the same way they consume any plant — if the action was ideological, not structural | 2–3 days |
| Steward election/rotation | How stewards are chosen. Energy-weighted? Contribution-weighted? Community vote? (Ammon to decide) | 3–5 days |

### The 6 Mirror Questions (Run on Every Steward Action)

1. **Structure or Ideology?** — Is this action based on system rules or personal belief?
2. **Signal or Noise?** — Does this action increase or decrease signal-to-noise ratio?
3. **Falsifiable?** — Can this decision be tested and proven wrong? ("Violated rule X" = yes. "Felt wrong" = no.)
4. **Reversible?** — Would the system function without this intervention? If yes, it was unnecessary.
5. **Self-Serving?** — Does this action benefit the steward's own plants or energy?
6. **Transparent?** — Can every user see what the steward did and why?

### Effort Estimate: 2.5–3.5 weeks

---

## 3.5 Advanced Biome Mechanics

Cross-biome energy flow, root propagation, and compost cascading become real systems.

### What to Build

| Component | Description | Effort |
|---|---|---|
| Root propagation | A Plot-level plant with enough energy/contribution can extend into Grove, Forest, Biosphere. Same plant, growing through layers. | 3–5 days |
| Compost cascade | When a Biosphere plant composts, energy flows: Biosphere → Forest → Grove → Plot. Nutrients from canopy to forest floor. | 2–3 days |
| Cross-biome search | Find related plants across biome layers. "This street problem connects to this city policy." | 3–4 days |
| Biome health metrics | Dashboard showing energy flow, rhetoric density, signal quality per biome. | 2–3 days |
| Biome creation costs | Scale with scope — Plot is cheap, Biosphere is expensive. Prevents biome spam. | 1–2 days |

### Effort Estimate: 2–3 weeks

---

## Phase 3 Summary

| Section | Effort |
|---|---|
| 3.1 Geographic Biome Mapping | 3–4 weeks |
| 3.2 Cross-Platform AI Auditing | 3.5–5 weeks |
| 3.3 Energy Degradation | 2–3 weeks |
| 3.4 Steward System + Mirror | 2.5–3.5 weeks |
| 3.5 Advanced Biome Mechanics | 2–3 weeks |
| **Total (sequential)** | **13.5–18.5 weeks** |
| **Total (parallelized — geo + auditing concurrent, then steward + degradation)** | **8–12 weeks** |

### Phase 3 Delivers
- Geographic biomes tied to real locations (GPS/address)
- Cross-platform AI auditing of linked accounts (contradiction detection, ego scoring)
- Energy decay prevents hoarding, rewards active contribution
- Steward accountability through the Alpha-Omega Mirror
- Full cross-biome mechanics (root propagation, compost cascade)

---

# FULL ROADMAP SUMMARY

| Phase | What It Delivers | Effort (Parallelized) |
|---|---|---|
| **Phase 1 — MVP** | Real auth, energy economy, biomes, heuristic AI scoring | 8–10 weeks |
| **Phase 2 — LLM Scoring** | Alpha-Omega Lens, Three Monkeys Gate, real-time updates | 5–7 weeks |
| **Phase 3 — Expansion** | Geographic biomes, cross-platform auditing, degradation, steward mirror | 8–12 weeks |
| **Total** | | **21–29 weeks** |

At ~5–7 months for a single developer, this is aggressive but realistic. If two developers split frontend/backend, cut ~30% off each phase.

---

# OPEN DECISIONS (For Ammon)

| # | Decision | Impact | When Needed |
|---|---|---|---|
| 1 | **Unit name** — What is 1 unit of energy called? Candidates: Life, Signal, Carbon, Sap | UI labels, documentation, everything | Phase 1 start |
| 2 | **Steward selection** — How are stewards chosen? Election, energy-weighted, appointment? | Phase 3 implementation | Phase 3 start |
| 3 | **Decay cycle timing** — Weekly? Monthly? Seasonal? | User retention, economic balance | Phase 3 start |
| 4 | **LLM provider** — OpenAI, Anthropic, open-source, or multi-provider? | Cost, infrastructure, quality | Phase 2 start |
| 5 | **Mobile app vs. mobile web** — Native iOS/Android or responsive web? | Dev effort, distribution | Post-Phase 1 |
| 6 | **Hosting budget** — Determines infrastructure choices (serverless vs. dedicated) | Architecture | Phase 1 start |

---

# LANGUAGE REFERENCE

Every variable, UI label, API endpoint, and comment should use SVN biology language.

| Say This | Not This | In Code |
|---|---|---|
| Plant | Post | `createPlant()`, `plant_id` |
| Join / Feed | Like | `joinPlant()`, `feedPlant()` |
| Grow | Trend | `growth_score` |
| Signal | Engagement | `signal_quality` |
| Energy / Value | Points | `energy_balance` |
| Life | Account | `user_life` |
| Consume | Downvote | `consumePlant()` |
| Compost | Delete | `compostPlant()` |
| Proving Grounds | Feed | `proving_grounds_view` |
| Biome | Category | `biome_id` |
| Steward | Moderator | `steward_id` |

---

**Questions → Ammon.**
**Prototype → [Live Demo](https://www.perplexity.ai/computer/a/svn-symbiotic-value-network-ZOaBl2FaSAeFhvMgexI1gg)**
