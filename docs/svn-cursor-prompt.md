# SVN — Cursor Project Rules
## Symbiotic Value Network

Paste this into `.cursor/rules` or use as a project-level system prompt. This is the source of truth for what SVN is, how it works, and how to write code for it.

---

## WHAT YOU'RE BUILDING

A value-based communication platform where ideas live, grow, or die based on real contribution — not popularity. Biology is the pattern, not the blueprint. Every interaction transfers energy. AI scores every post immediately. There are no likes, no followers, no popularity rankings.

**Creator:** Ammon Covino
**Codebase origin:** Prototype at `/svn-prototype/` (React + Express + SQLite). Production is a rewrite, not a fork.

---

## SYSTEM PHILOSOPHY — READ THIS FIRST

These are non-negotiable. If your code violates any of these, it's wrong.

1. **"You don't get Value by scrolling."** Passive engagement does NOT transfer value. A user must actively contribute something coherent.
2. **"They're not feeding me. They're joining me."** Contributors JOIN. This is symbiosis, not charity.
3. **"Death brings life, not the other way around."** Failed plants become compost. Nothing is deleted. Energy always returns to the ecosystem.
4. **"No reason for a seed to die — it can be reclaimed."** Value is never destroyed, only transformed.
5. **"Skilled rhetoric doesn't do shit."** Only logic consumes rhetoric. Rhetoric cannot eat rhetoric.
6. **"A plant does this, I like this for my program" ≠ "A plant does this, therefore I must."** Biology is a pattern, not a blueprint. Don't force biological analogies where they don't fit.
7. **"Verified humans should start with the same base energy."** 2 units per tier, max 8 from identity. More links = bigger window, not more sun.
8. **"I don't have to plant something myself before I can consume. All I have to do is have energy."** Any user with energy can consume. No prerequisite.
9. **AI contributions are valid.** A human is behind every AI. No AI acts without human intervention. Do not penalize AI-assisted contributions.
10. **Predators are natural and necessary.** Consuming bullshit IS value. A person who dismantles bad logic has growth potential equal to an original creator.

---

## LANGUAGE RULES — ENFORCED IN ALL CODE

SVN uses biological terminology. Social media language is wrong. This applies to variable names, function names, API endpoints, UI copy, comments, error messages, and database columns.

### Mandatory Terminology

| Use This | Never This | In Code |
|---|---|---|
| Plant | Post | `createPlant()`, `plant_id`, `PlantCard` |
| Join / Feed | Like / Upvote | `joinPlant()`, `feedPlant()` |
| Grow | Trend / Go viral | `growth_score`, `isGrowing` |
| Signal | Engagement | `signal_quality`, `signalScore` |
| Energy / Value | Points / Karma / Tokens | `energy_balance`, `energyCost` |
| Life | Account | `createLife()`, but `user` is OK in auth context |
| Consume | Downvote / Report | `consumePlant()`, `ConsumptionResult` |
| Compost | Delete / Remove | `compostPlant()`, `compost_pool` |
| Proving Grounds | Feed / Timeline | `ProvingGrounds` component |
| Biome | Category / Channel / Subreddit | `biome_id`, `BiomeExplorer` |
| Steward | Moderator / Admin | `steward_id`, `StewardMirror` |
| Contribution | Comment / Reply | `contribution_id`, `ContributionList` |

### In Error Messages
```
// WRONG
"Not enough points to post"
"Your post has been deleted"

// RIGHT
"Not enough energy to plant in this biome"
"This plant has been composted — its energy returns to the ecosystem"
```

### In UI Copy
```
// WRONG
"Post to feed" / "Like" / "Trending" / "Your engagement score"

// RIGHT
"Plant to the Proving Grounds" / "Join" / "Growing" / "Your signal"
```

---

## ENERGY ECONOMY — THE CORE MECHANIC

Every function that moves energy must be transactional. If the ledger breaks, the system breaks.

### Verification Tiers (Identity = Starting Energy)

| Tier | Name | Requires | Energy |
|---|---|---|---|
| 1 | Seedling | Email + Phone | 2 |
| 2 | Sapling | Social accounts (Facebook, Reddit, Instagram, X) | 2 |
| 3 | Established | Deep history (Steam, League of Legends, YouTube, LinkedIn, GitHub) | 2 |
| 4 | Canopy | Personal (photos, bio, family, address, gov ID) | 2 |

**Max from verification: 8.** Link one or all accounts in a tier — still 2. The benefit is transparency to the AI, not more energy.

### Planting Costs

| Biome Layer | Scope | Cost |
|---|---|---|
| Plot | Street / block | 1 |
| Grove | Community / org | 2 |
| Forest | City / region | 3 |
| Biosphere | National / global | 5 |

### Contribution Costs

| Action | Cost | Effect on Plant | Notes |
|---|---|---|---|
| Join / Expand / Clarify | 1 | +1 to plant | Symbiotic — both grow |
| Consume (rhetoric > logic) | 2 | Consumer gains 3, plant loses 2 | Predator wins — plant was weak |
| Consume (logic > rhetoric) | 2 | Consumer loses 2, gains nothing | Predator fails — plant was strong |
| Correct | 1 | No energy transfer | Adds knowledge only |

### Compost Rules
- Plants that hit 0 energy become compost
- Compost energy returns to the ecosystem pool
- Compost is claimed first-come-first-served ("like caterpillars on a defenseless plant")
- Compost flows DOWN through biome layers (Biosphere → Forest → Grove → Plot)

### Energy Transactions
All energy operations must use database transactions with row-level locking. No eventual consistency. Double-entry bookkeeping — every transaction has a source and a destination.

```typescript
// Every energy movement creates a transaction record
interface EnergyTransaction {
  id: string;
  type: 'verification_award' | 'plant_cost' | 'join' | 'expand' |
        'clarify' | 'correct' | 'consume_success' | 'consume_fail' |
        'compost_claim' | 'decay';
  sourceUserId: string | null;   // null for system events
  targetUserId: string | null;
  plantId: string | null;
  amount: number;                // signed
  balanceAfter: number;
  createdAt: Date;
}
```

---

## AI SCORING — DUAL LENS SYSTEM

Two lenses. Different jobs. Both LLM-powered in production.

### Lens 1: Three Monkeys (Pre-Plant Gate)

Runs BEFORE a plant enters the ecosystem. Three gates:

| Gate | Name | Question | Catches |
|---|---|---|---|
| 1 | See No Evil | Is input based on verifiable observation? | Hearsay, fabrication, illegal content, threats, doxxing |
| 2 | Hear No Evil | Is the mechanism grounded in testable logic? | Conspiracy logic, unfalsifiable claims, magical thinking |
| 3 | Speak No Evil | Does the output serve signal, not noise? | Pure venting, ad hominem, spam |

**Hard floor:** CSAM, terrorism, direct threats, doxxing → BLOCKED. No override. This is structural, not moderation.

**Flags:** Soft failures get flagged but the user can acknowledge and plant anyway.

```
User writes → Three Monkeys Gate → [BLOCK / FLAG / PASS] → Plant enters ecosystem
```

### Lens 2: Alpha-Omega (Post-Plant Evaluation)

Runs AFTER a plant is published. Scores across 7 dimensions. Drives the energy mechanics (rhetoric > logic = consumable).

#### The 6-Point Evaluation Protocol

1. **Structure before belief** — Evaluate logical structure before considering agreement
2. **See — Input discipline** — What data is actually present? Separate observation from interpretation
3. **Hear — Mechanism discipline** — What causal mechanism is claimed? Is it testable?
4. **Speak — Output discipline** — Does the conclusion follow from the structure?
5. **Falsifiable claims** — Can the claims be proven wrong? Unfalsifiable = rhetoric
6. **Operational meaning** — Does the statement have concrete, testable real-world implications?

#### 7 Scoring Dimensions

| Dimension | Type | What It Measures |
|---|---|---|
| `logic` | Positive | Structural soundness, reasoning quality |
| `rhetoric` | Negative | Persuasion techniques used instead of logic |
| `nostalgia` | Negative | "Good old days" appeals without structural basis |
| `emotionalAppeal` | Flag | Pathos over logos — not automatic negative |
| `novelty` | Positive | Genuinely new insight vs. repackaged take |
| `verifiability` | Positive | Can the claims be checked? |
| `scope` | Positive | Appropriately scoped vs. over-claiming |

#### LLM System Prompt (Alpha-Omega Lens)

```
You are the Alpha-Omega Rhetoric Lens. Your purpose is to evaluate text
for structural soundness versus rhetorical manipulation.

EVALUATION PROTOCOL:

1. STRUCTURE BEFORE BELIEF
   Evaluate the structural soundness of an argument before considering
   whether you agree with it. Identify premises and conclusions. Do the
   conclusions follow from the premises?

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
- rhetoric: Degree of persuasion technique used instead of logic (higher = worse)
- nostalgia: "Good old days" appeals without structural basis (higher = worse)
- emotional_appeal: Pathos over logos (flag, not automatic negative)
- novelty: Genuinely new insight vs. repackaged common take
- verifiability: Can the claims be checked?
- scope: Appropriately scoped vs. over-claiming

Also return:
- assessment: 2-3 sentence human-readable evaluation
- rhetoric_markers: Array of specific phrases identified as rhetorical techniques
- logic_markers: Array of specific phrases identified as logical structure

Return JSON only. No preamble.
```

#### Architecture

```
Plant Created
    ↓
Evaluation Queue (BullMQ + Redis)
    ↓
Alpha-Omega Worker
    ├── Build prompt with 6-point lens
    ├── Send to LLM (OpenAI primary, fallback to heuristic)
    ├── Parse structured JSON response
    ├── Validate score ranges
    ├── Store evaluation
    ↓
Plant updated with AI score → WebSocket push to clients
```

---

## THE STEWARD MIRROR

Stewards are NOT moderators. They maintain structural integrity. The Alpha-Omega Lens watches them.

### 6 Mirror Questions (Run on Every Steward Action)

1. **Structure or Ideology?** — Based on system rules or personal belief?
2. **Signal or Noise?** — Increases or decreases signal-to-noise?
3. **Falsifiable?** — Can the decision be tested? "Violated rule X" = yes. "Felt wrong" = no.
4. **Reversible?** — Would the system work without this intervention?
5. **Self-Serving?** — Benefits the steward's own plants/energy?
6. **Transparent?** — Can every user see what the steward did and why?

The mirror doesn't STOP the steward. It EXPOSES the steward. All steward actions are public, consumable plants. Users can consume a steward action if they prove it was ideological.

---

## BIOME SYSTEM

Four layers organized by geographic/systemic scale.

| Layer | Scope | Plant Cost | Think Of It As |
|---|---|---|---|
| Plot | Street / block | 1 | A single garden bed |
| Grove | Community / org | 2 | Trees sharing root systems |
| Forest | City / region | 3 | Full forest ecosystem |
| Biosphere | National / global | 5 | The entire biosphere |

### Cross-Biome Rules
- **Roots reach UP:** A Plot plant with enough energy can extend into Grove → Forest → Biosphere
- **Compost flows DOWN:** Failed Biosphere plant → energy cascades to Forest → Grove → Plot
- **Lens intensity scales with scope:** Plot = light check. Biosphere = maximum scrutiny.
- **User-created biomes** within any layer (like subreddits). Creation costs energy, scales with scope.

---

## DATA MODELS (Production — PostgreSQL)

### Core Tables

```sql
-- Users / Lives
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_photo_url TEXT,
  verification_tier INT NOT NULL DEFAULT 1,
  energy_balance DECIMAL NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Linked platform accounts
CREATE TABLE linked_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL, -- facebook, reddit, instagram, x, steam, riot, google_play, xbox, psn, youtube, linkedin, github
  provider_user_id TEXT NOT NULL,
  provider_username TEXT,
  account_age_days INT,
  metadata JSONB,
  access_token_encrypted TEXT,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ,
  UNIQUE(user_id, provider)
);

-- Verification events (energy awards)
CREATE TABLE verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  tier INT NOT NULL,
  method TEXT NOT NULL,
  energy_awarded DECIMAL NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Biomes
CREATE TABLE biomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  layer TEXT NOT NULL, -- plot, grove, forest, biosphere
  created_by UUID REFERENCES users(id),
  location GEOGRAPHY(POINT, 4326),
  radius_meters INT,
  plant_count INT NOT NULL DEFAULT 0,
  total_energy DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plants
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id),
  biome_id UUID NOT NULL REFERENCES biomes(id),
  biome_layer TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  energy_balance DECIMAL NOT NULL DEFAULT 0,
  plant_cost INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'living', -- living, composting, composted
  ai_score JSONB,
  three_monkeys_result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  composted_at TIMESTAMPTZ
);

-- Contributions
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id),
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL, -- join, expand, clarify, correct, consume
  body TEXT NOT NULL,
  energy_cost DECIMAL NOT NULL,
  energy_gained DECIMAL NOT NULL DEFAULT 0,
  ai_score JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Energy ledger (double-entry)
CREATE TABLE energy_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  source_user_id UUID REFERENCES users(id),
  target_user_id UUID REFERENCES users(id),
  plant_id UUID REFERENCES plants(id),
  amount DECIMAL NOT NULL,
  balance_after DECIMAL NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Compost pool
CREATE TABLE compost_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_plant_id UUID NOT NULL REFERENCES plants(id),
  biome_id UUID NOT NULL REFERENCES biomes(id),
  energy_available DECIMAL NOT NULL,
  claimed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_at TIMESTAMPTZ
);

-- Steward actions (public, consumable)
CREATE TABLE steward_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  steward_id UUID NOT NULL REFERENCES users(id),
  biome_id UUID NOT NULL REFERENCES biomes(id),
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  mirror_score JSONB, -- Alpha-Omega evaluation of this action
  is_consumed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes
```sql
CREATE INDEX idx_plants_biome ON plants(biome_id);
CREATE INDEX idx_plants_author ON plants(author_id);
CREATE INDEX idx_plants_status ON plants(status);
CREATE INDEX idx_contributions_plant ON contributions(plant_id);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_energy_tx_source ON energy_transactions(source_user_id);
CREATE INDEX idx_energy_tx_target ON energy_transactions(target_user_id);
CREATE INDEX idx_linked_accounts_user ON linked_accounts(user_id);
CREATE INDEX idx_compost_available ON compost_pool(energy_available) WHERE claimed_by IS NULL;
CREATE INDEX idx_biomes_layer ON biomes(layer);
CREATE INDEX idx_biomes_location ON biomes USING GIST(location);
```

---

## TECH STACK

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js (App Router) | Server components, API routes, auth, deployment |
| Styling | Tailwind CSS | Already proven in prototype |
| Components | shadcn/ui | Already proven in prototype |
| State | TanStack Query | Cache invalidation for energy updates |
| Database | PostgreSQL | ACID transactions, row-level locking, PostGIS |
| ORM | Drizzle | Type-safe, lightweight, already used in prototype |
| Auth | NextAuth.js | OAuth providers out of the box |
| Real-time | Socket.io | WebSocket with auto-reconnection, rooms for biomes |
| Queue | BullMQ + Redis | AI evaluation queue, energy decay jobs |
| LLM | OpenAI SDK (primary) | Best structured output. Abstract behind interface for swappability. |
| Hosting | Vercel (frontend) + Railway (backend + DB + Redis) | See deployment section below |

---

## RAILWAY DEPLOYMENT

### Project Structure

```
railway.toml          # Railway service config
├── services/
│   ├── api/          # Express/Next.js backend
│   ├── worker/       # BullMQ AI evaluation worker
│   └── web/          # Next.js frontend (or deploy to Vercel)
```

### railway.toml

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### Environment Variables (Railway Dashboard)

```bash
# Database (Railway provisions Postgres automatically)
DATABASE_URL=postgresql://...  # Auto-populated by Railway Postgres plugin

# Redis (Railway provisions Redis automatically)
REDIS_URL=redis://...  # Auto-populated by Railway Redis plugin

# Auth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-app.up.railway.app

# OAuth Providers (add as you implement each tier)
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
STEAM_API_KEY=
RIOT_API_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# LLM (Phase 2)
OPENAI_API_KEY=

# Twilio (Phone verification)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Geo (Phase 3)
MAPBOX_ACCESS_TOKEN=
```

### Railway Setup Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add Postgres
railway add --plugin postgresql

# Add Redis (for BullMQ)
railway add --plugin redis

# Deploy
railway up

# View logs
railway logs

# Open dashboard
railway open
```

### Database Migration Strategy

Use Drizzle Kit for migrations:

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Push to Railway Postgres
npx drizzle-kit push

# For production: use drizzle-kit migrate in your deploy pipeline
```

### Health Check Endpoint

```typescript
app.get('/api/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});
```

### Multi-Service Setup (Phase 2+)

When you add the BullMQ worker for AI evaluation:

```
Railway Project
├── Service: api          (Express/Next.js)
├── Service: worker       (BullMQ AI evaluation processor)
├── Plugin: postgresql    (shared)
├── Plugin: redis         (shared — used by BullMQ)
```

Each service gets its own `Dockerfile` or build config. They share the same Postgres and Redis via Railway's internal networking.

---

## API ENDPOINT PATTERNS

Follow these naming conventions:

```
# Plants
POST   /api/plants                    # Create (plant to proving grounds)
GET    /api/plants                    # List all
GET    /api/plants/:id                # Get one
GET    /api/plants/biome/:biomeId     # By biome
GET    /api/plants/user/:userId       # By author

# Contributions
POST   /api/contributions             # Join, expand, clarify, correct, consume
GET    /api/contributions/plant/:id   # All contributions on a plant

# Biomes
POST   /api/biomes                    # Create biome (costs energy)
GET    /api/biomes                    # List all
GET    /api/biomes/:id                # Get one with stats
GET    /api/biomes/layer/:layer       # By layer (plot/grove/forest/biosphere)
GET    /api/biomes/nearby             # Geo query (Phase 3)

# Users / Lives
POST   /api/auth/register             # Create life
POST   /api/auth/verify-email         # Tier 1
POST   /api/auth/verify-phone         # Tier 1
POST   /api/auth/link/:provider       # OAuth link (Tier 2-4)
GET    /api/users/:id                 # Public profile
GET    /api/users/:id/energy          # Energy balance + transaction history

# Compost
GET    /api/compost/:biomeId          # Available compost in biome
POST   /api/compost/claim             # First-come-first-served claim

# Steward
GET    /api/steward/:biomeId/actions  # Public steward action log
GET    /api/steward/:biomeId/mirror   # Mirror score over time
POST   /api/steward/action            # Record steward action (auto-evaluated by mirror)

# AI Evaluation
GET    /api/plants/:id/score          # Get AI evaluation for a plant
POST   /api/evaluate/preview          # Preview Three Monkeys gate result before planting
```

---

## WEBSOCKET EVENTS (Phase 2+)

```typescript
// Client subscribes to channels
socket.join(`biome:${biomeId}`);
socket.join(`plant:${plantId}`);
socket.join(`user:${userId}`);

// Server emits
io.to(`biome:${biomeId}`).emit('plant:created', { plant, aiScore });
io.to(`plant:${plantId}`).emit('contribution:added', { contribution, updatedPlant });
io.to(`plant:${plantId}`).emit('plant:composted', { plantId, compostEnergy });
io.to(`plant:${plantId}`).emit('ai:score:ready', { plantId, score });
io.to(`user:${userId}`).emit('energy:updated', { userId, newBalance, transaction });
io.to(`biome:${biomeId}`).emit('compost:claimed', { compostId, claimedBy });
```

---

## CODING STANDARDS

### File Structure (Next.js App Router)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                        # Landing / Proving Grounds
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx
│   ├── biome/
│   │   ├── [id]/page.tsx               # Biome view
│   │   └── create/page.tsx
│   ├── plant/
│   │   ├── [id]/page.tsx               # Plant detail + contributions
│   │   └── create/page.tsx             # Three Monkeys gate → plant
│   ├── life/
│   │   ├── [id]/page.tsx               # User profile
│   │   └── settings/page.tsx           # Verification, linked accounts
│   ├── steward/
│   │   └── [biomeId]/page.tsx          # Steward mirror dashboard
│   └── api/
│       ├── plants/route.ts
│       ├── contributions/route.ts
│       ├── biomes/route.ts
│       ├── auth/[...nextauth]/route.ts
│       ├── compost/route.ts
│       └── steward/route.ts
├── components/
│   ├── plant-card.tsx
│   ├── contribution-form.tsx
│   ├── energy-display.tsx
│   ├── biome-explorer.tsx
│   ├── three-monkeys-gate.tsx          # Pre-plant evaluation UI
│   ├── ai-score-breakdown.tsx          # 7-dimension radar chart
│   ├── steward-mirror.tsx
│   └── compost-pool.tsx
├── lib/
│   ├── db.ts                           # Drizzle + Postgres connection
│   ├── auth.ts                         # NextAuth config
│   ├── energy.ts                       # Energy transaction logic
│   ├── ai/
│   │   ├── alpha-omega.ts              # LLM evaluation service
│   │   ├── three-monkeys.ts            # Pre-plant gate service
│   │   └── heuristic.ts               # Fallback scoring (from prototype)
│   ├── queue.ts                        # BullMQ setup
│   └── socket.ts                       # Socket.io setup
└── schema/
    ├── users.ts                        # Drizzle schema
    ├── plants.ts
    ├── contributions.ts
    ├── biomes.ts
    ├── energy.ts
    └── steward.ts
```

### Error Handling

Always return SVN-contextual error messages:

```typescript
// Energy operations
if (user.energyBalance < cost) {
  throw new InsufficientEnergyError(
    `Not enough energy to plant in ${biome.layer}. ` +
    `Need ${cost}, have ${user.energyBalance}. ` +
    `Earn energy by joining plants or claiming compost.`
  );
}

// Consumption
if (plant.status === 'composted') {
  throw new PlantCompostedError(
    'This plant has already been composted. ' +
    'Check the compost pool for available energy.'
  );
}
```

### Testing

Every energy operation needs a test that verifies the ledger balances. At the end of any test, the total energy in the system (all user balances + all plant balances + all compost pools) must equal the total energy ever created by verification events.

```typescript
// After every energy test
const totalUserEnergy = await sumAllUserEnergy();
const totalPlantEnergy = await sumAllPlantEnergy();
const totalCompostEnergy = await sumAllCompostEnergy();
const totalVerificationEnergy = await sumAllVerificationAwards();

expect(totalUserEnergy + totalPlantEnergy + totalCompostEnergy)
  .toBe(totalVerificationEnergy);
```

---

## WHAT THE PROTOTYPE ALREADY PROVED

The prototype at `/svn-prototype/` demonstrated these mechanics work:
- Energy transfer on plant/join/consume/correct
- 7-dimension AI scoring (keyword heuristic — to be replaced with LLM)
- 4-tier verification display
- 4-layer biome navigation
- Composting (plants hitting 0 energy)
- Dark forest aesthetic

### What to Carry Forward
- The contribution type system (`join`, `expand`, `clarify`, `correct`, `consume`)
- The 7 AI scoring dimensions and their names
- The biome layer names (Plot, Grove, Forest, Biosphere)
- The verification tier names (Seedling, Sapling, Established, Canopy)
- The dark forest visual identity

### What to Replace
- SQLite → PostgreSQL
- In-memory storage → Drizzle + Postgres
- Keyword heuristic scoring → LLM via Alpha-Omega lens (Phase 2)
- No auth → NextAuth with real OAuth
- No real-time → Socket.io (Phase 2)
- Static demo users → Real registration flow

---

## REFERENCE DOCUMENTS

These are in the project workspace and contain the full system design:

| File | What It Contains |
|---|---|
| `svn-technical-roadmap.md` | 3-phase dev plan with effort estimates — your build order |
| `svn-developer-brief.md` | High-level system summary for onboarding |
| `svn-v3-system-model.md` | Complete corrected system model — philosophy, biology, value mechanics |
| `svn-v4-verification-locked.md` | Verification tier structure (locked values) |
| `svn-biome-structure.md` | 4-layer biome design, cross-biome mechanics, steward mirror, Four Rings |
| `svn-terminology.md` | Full terminology mapping (biology ↔ social media) |
| `svn-failure-points-final.md` | All failure analysis points — 7/8 resolved, unit name still open |

---

## OPEN QUESTIONS (Ask Ammon)

1. **Unit name** — What is 1 unit of energy called? Candidates: Life, Signal, Carbon, Sap. Affects every UI label.
2. **Steward selection** — How are stewards chosen for biomes?
3. **Energy decay rate** — How fast does unused energy degrade?

Everything else is defined. Build Phase 1 first. Questions → Ammon.
