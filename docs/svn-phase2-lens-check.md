# SVN Phase 2 — Alpha-Omega Rhetoric Lens Check

**Analyst:** Alpha-Omega Rhetoric Lens  
**Date:** 2025-07-14  
**Input:** `create-phase2-issues.sh` — 17 GitHub issue descriptions  
**Framework:** 6-point evaluation protocol (Structure Before Belief → See → Hear → Speak → Falsifiability → Operational Meaning)

---

## Rating Key

- **PASS** — All 6 points solid. Developer can start immediately.
- **CONCERN** — Weaknesses that should be addressed before significant dev work starts.
- **FLAG** — Structural problems. Ticket needs revision. Starting work risks wasted effort.

---

## Summary Table

| # | Title | Rating |
|---|-------|--------|
| 1 | Build Alpha-Omega Lens LLM evaluation service | CONCERN |
| 2 | System prompt engineering and calibration | CONCERN |
| 3 | Structured output parsing and validation | PASS |
| 4 | Build async evaluation queue (BullMQ + Redis) | PASS |
| 5 | LLM cost management: token budgeting, caching, batching | CONCERN |
| 6 | Build Three Monkeys Gate: pre-plant evaluation pipeline | FLAG |
| 7 | Three Monkeys Gate UI | CONCERN |
| 8 | Tier 1 verification: email + phone auth | PASS |
| 9 | Tier 2 verification: social account OAuth linking | CONCERN |
| 10 | Tier 3 verification: deep history account linking | FLAG |
| 11 | Tier 4 verification: personal identity confirmation | FLAG |
| 12 | Biome layer routing: scope-based plant assignment and cross-biome linking | FLAG |
| 13 | Biome browsing and navigation UI | CONCERN |
| 14 | Implement free planting rule: zero cost to plant | CONCERN |
| 15 | Migrate energy ledger to double-entry PostgreSQL | PASS |
| 16 | WebSocket real-time updates (Socket.io) | CONCERN |
| 17 | Steward role with Alpha-Omega Mirror evaluation | FLAG |

---

## Detailed Evaluations

---

### Ticket 1 — Build Alpha-Omega Lens LLM evaluation service
**Rating: CONCERN**

**1. Structure Before Belief**  
The problem statement is structural: "keyword heuristic scoring cannot distinguish logic from rhetoric." That is a testable claim about the current system's failure mode. Clean.

**2. See — Input Discipline**  
"Accepts plant text" is the input. Undefined: what is "plant text"? Is it the title, body, tags, metadata, or all of the above? Maximum input length? Language support? These are observable questions that have no answer in the ticket.

**3. Hear — Mechanism Discipline**  
The mechanism steps are listed (prompt → LLM → parse JSON → validate → store). That's a valid pipeline. But step 1 ("Build prompt with 6-point evaluation protocol") defers the entire substance of the mechanism to another ticket (#2). This is acceptable if the dependency is explicit — and it is not listed under "Depends On." The ticket claims it "can start immediately" but the evaluation protocol is the core of the mechanism, and it isn't here.

**4. Speak — Output Discipline**  
The output is "structured 7-dimension scores." The body mentions 6-point protocol but promises 7-dimension scores. That's a contradiction — 6 ≠ 7. The seventh dimension is never named. Developer cannot build a schema without knowing what all 7 dimensions are.

**5. Falsifiability**  
The testable outcome is specific: same inputs → scores differ by ≥ 0.3 on the rhetoric dimension across 100 runs. This is falsifiable. **However:** "known rhetoric-heavy input" and "known logic-heavy input" are not defined in the ticket. The test is only valid if the ground-truth examples are pre-committed. If the developer picks the examples after tuning the model, this test is trivially passable and meaningless.

**6. Operational Meaning**  
No acceptance criteria for the "store evaluation result" step. Store where? What schema? Linked to which plant record?

**Rhetoric Markers:**  
- "at any meaningful level" — rhetorical filler. Remove it.

**Structural Gaps:**  
- 6 vs. 7 dimension contradiction must be resolved before any schema work  
- "Depends On: Nothing" is wrong — implicitly depends on #2 for the prompt  
- Test inputs must be pre-committed and locked, not chosen post-hoc  
- Input definition (what is "plant text"?) is missing

---

### Ticket 2 — System prompt engineering and calibration for Alpha-Omega Lens
**Rating: CONCERN**

**1. Structure Before Belief**  
"Prompt drift, temperature variance, and model updates can all degrade consistency" — this is a real structural problem. No rhetoric here.

**2. See — Input Discipline**  
"50+ known-quality inputs (25 high-logic, 25 high-rhetoric)" — who labels them? How? By what criteria is a text classified as "high-logic" vs "high-rhetoric" before the system being built exists? There is a circularity problem: the system being calibrated is the only thing that would produce such labels. If labels are assigned by human judgment, that process needs to be defined. If labels are assigned by an existing tool, that tool needs to be referenced.

**3. Hear — Mechanism Discipline**  
"Run calibration passes to tune scoring thresholds" — this is a process, not a mechanism. What does "tune" mean operationally? Adjust the prompt wording? Change the few-shot examples? Adjust temperature? All of these are different interventions with different effects.

**4. Speak — Output Discipline**  
Two outcomes are stated:
- Inter-run variance < 0.1 across 20 runs  
- 90%+ classification accuracy on the calibration set  

Both are measurable. **But:** classifying 90%+ of 50 inputs correctly is only meaningful if the 50 inputs are not the same ones used to tune the prompt. Using the calibration set as both training signal and test set is a methodological failure.

**5. Falsifiability**  
The 0.1 variance threshold is falsifiable. The 90% accuracy claim would be falsifiable IF a held-out test set is defined. Currently, no held-out set is specified.

**6. Operational Meaning**  
"Document prompt version with hash for reproducibility" — this is concrete and good. The rest of the deliverable is ambiguous: what gets delivered? A tuned prompt string? A JSON config? A test suite file?

**Structural Gaps:**  
- Circular labeling problem — define how ground truth is established before the system is tuned  
- No train/test split defined — calibration set and evaluation set must be separate  
- "Calibration passes" undefined — enumerate the specific variables being adjusted  
- No stated relationship between this ticket and #1 in "Depends On"

---

### Ticket 3 — Structured output parsing and validation for LLM scores
**Rating: PASS**

**1. Structure Before Belief**  
"LLMs return variable-format responses" — observable fact about LLM behavior. Structural.

**2. See — Input Discipline**  
Input is well-defined: LLM responses that need to produce a valid score object with 7 dimensions + assessment text + markers.

**3. Hear — Mechanism Discipline**  
Mechanism is precise: JSON forcing → schema validation (Zod) → retry on malformed → range enforcement. Each step is independently testable.

**4. Speak — Output Discipline**  
"100% of responses parsed or caught and retried" follows directly from the mechanism. "Zero unhandled parse failures in production" is a clean derivation.

**5. Falsifiability**  
"Zero unhandled parse failures" is falsifiable: you inject a malformed response and observe whether it is caught or crashes. Retry logic can be unit-tested with mock LLM responses.

**6. Operational Meaning**  
Concrete: Zod schema, retry loop, range validator. Developer knows what to build.

**Minor Issues:**  
- "Zero unhandled parse failures in production" is aspirationally correct but cannot be proven in a test suite — production cannot be fully simulated. Restate as "zero unhandled parse failures in the test suite covering N malformed response patterns" for testability.
- The 7-dimension contradiction from #1 carries over: the schema depends on knowing what all 7 dimensions are.

---

### Ticket 4 — Build async evaluation queue (BullMQ + Redis)
**Rating: PASS**

**1. Structure Before Belief**  
"LLM evaluation takes 2–10 seconds per plant. Synchronous evaluation blocks the planting flow." Observable, measurable problem. Clean.

**2. See — Input Discipline**  
Input defined: plant creation event → queue. Technology stack specified (BullMQ + Redis). 

**3. Hear — Mechanism Discipline**  
Pipeline diagram is the clearest mechanism statement in the entire file:  
`Plant Created → Queue → Worker → Plant Updated → WebSocket push`  
Dead letter queue, fallback to heuristic scoring, and rate limiting are all enumerated. These are testable.

**4. Speak — Output Discipline**  
Three testable outcomes:
- Plant creation returns in < 500ms  
- AI score appears within 15 seconds via WebSocket  
- 100 plants processed without dropping any  

All follow from the mechanism.

**5. Falsifiability**  
All three are falsifiable with load tests. Numbers are specific.

**6. Operational Meaning**  
Concrete stack. Concrete latency SLAs. Rate limiting is mentioned but has no target (rate per second? per minute?). This is the only gap.

**Structural Gaps:**  
- Rate limiting target is unspecified — define the LLM call rate cap  
- "Fallback to heuristic scoring" references a system not defined in Phase 2 scope — where does heuristic scoring live post-migration?

---

### Ticket 5 — LLM cost management: token budgeting, caching, batching
**Rating: CONCERN**

**1. Structure Before Belief**  
"At scale, LLM calls per plant become expensive" — valid structural concern, but "at scale" is undefined. At what scale does this become a problem? 100 plants/day? 10,000? The urgency of this ticket depends on that number, and it isn't given.

**2. See — Input Discipline**  
Inputs are mostly defined: 2000 token cap, caching on identical plant text, batching for backfill. But "identical plant text" as cache key is too narrow — minor edits would bypass the cache entirely. Is fuzzy matching intended? If not, the actual cache hit rate will be far below 5%.

**3. Hear — Mechanism Discipline**  
"Provider abstraction layer — swap OpenAI for Anthropic or open-source without changing evaluation logic" — this is architecturally significant. A provider abstraction layer is not a trivial addition. It needs its own interface specification. Burying it in a cost management ticket means it will likely be scoped incorrectly.

**4. Speak — Output Discipline**  
- "< $0.05 per evaluation with GPT-4o-class models" — valid, but GPT-4o pricing changes. The test should pin a model version and a date, or define it in terms of token counts and a reference price point.  
- "Cache hit rate > 5% in steady state" — 5% is an extremely low bar. This outcome does not validate the cache is useful; it validates only that the cache is not completely broken. The threshold needs justification.  
- "Provider swap requires changing one config file" — this is testable and specific. Good.

**5. Falsifiability**  
The $0.05 target is falsifiable if tied to a specific model and token budget. The 5% cache target is falsifiable but trivially so. The config-file target is falsifiable.

**6. Operational Meaning**  
The cost tracking dashboard is mentioned but has no acceptance criteria. What charts? What granularity? What alerts? A "dashboard" without spec is a UI wildcard.

**Rhetoric Markers:**  
- "bleeds money on every interaction" — emotionally loaded. Replace with the actual projected cost per evaluation.

**Structural Gaps:**  
- Define "at scale" — the urgency justification for this ticket  
- Cache key strategy needs to be explicit (exact match vs. fuzzy)  
- Provider abstraction layer is Phase 2 scope-creep; should be its own ticket or explicitly scoped out  
- Cost dashboard has no acceptance criteria  
- 5% cache hit rate needs justification or should be raised

---

### Ticket 6 — Build Three Monkeys Gate: pre-plant evaluation pipeline
**Rating: FLAG**

**1. Structure Before Belief**  
"Without a pre-entry filter, the system must evaluate and store every piece of content before the community can act on it." — This is presented as a structural problem but embeds a design assumption: that storing content before community action is bad. The alternative (store everything, filter later) is not evaluated. The gate being "structural, not moderation" is an assertion, not a demonstrated distinction.

**2. See — Input Discipline**  
The three-gate table defines what each gate "catches," but the input criteria for each gate are behavioral descriptions, not observable specifications:  
- Gate 1: "Is input based on verifiable observation?" — How does an LLM determine verifiability? For what domain? A claim like "my neighbor is dealing drugs" is unverifiable but may be an honest observation. This gate boundary will produce false positives at an unknown rate.  
- Gate 2: "Is the mechanism grounded in testable logic?" — "Conspiracy logic" and "magical thinking" are not operationally defined. These are rhetoric labels, not observable categories.  
- Gate 3: "Does the output serve signal, not noise?" — "Pure venting" is undefined. A user expressing anger about a structural injustice is both venting and signal.

**3. Hear — Mechanism Discipline**  
The mechanism is three sequential LLM calls (implied). The ticket does not specify:  
- Whether each gate is a separate LLM call or one combined call  
- What "flag" means in terms of the prompt — is it a probability threshold? A binary classification?  
- How "user override" is enforced — if the user can always override a flag, what is the gate doing?

**4. Speak — Output Discipline**  
"Hard floor content is blocked 100% of the time" — this is not an LLM outcome. LLMs can and do fail to classify CSAM, terrorism, and threats with 100% reliability. Either this is enforced by regex/keyword filter (not LLM), or the 100% claim is false. The ticket needs to specify the actual mechanism for hard floor enforcement.

**5. Falsifiability**  
"Pass-through content enters the ecosystem within 3 seconds" — falsifiable.  
"Hard floor content is blocked 100% of the time" — this claim is unfalsifiable in the general case because it depends on an adversary creating novel content designed to evade the filter. A test suite can pass; the real world will not.

**6. Operational Meaning**  
Effort estimate is split: "3-4 days for pipeline, 2-3 days per gate prompt engineering." This is honest but implies 3 separate prompt engineering efforts, each with their own calibration needs. There is no testable outcome for each individual gate — only for the combined pipeline.

**Rhetoric Markers:**  
- "structural, not moderation" — this phrase is doing significant philosophical work without being defined. If a developer asks "what's the difference," the ticket has no answer.  
- "hearsay, fabrication" — hearsay is a legal/evidentiary term. Does Gate 1 reject all hearsay, including eyewitness accounts?

**Structural Gaps:**  
- Hard floor MUST be implemented as a deterministic filter (keyword/regex/hash-match), not LLM. The ticket does not distinguish this.  
- "User override" mechanism for flagged content needs a data model  
- Gate failure modes are undefined: what happens if the LLM gate itself fails (timeout, API error)?  
- No per-gate testable outcomes  
- "Signal, not noise" is not operationally defined and will produce inconsistent LLM behavior

---

### Ticket 7 — Three Monkeys Gate UI: pre-plant panel with gate visualization
**Rating: CONCERN**

**1. Structure Before Belief**  
"This is not a loading spinner — it's a transparency mechanism." — Fine as design intent, but it is an assertion. The testable difference between a spinner and a transparency mechanism is not defined.

**2. See — Input Discipline**  
The UI requirements are specific: pass/flag/BLOCK states, colors, acknowledgment flow, structural reason for block (not generic message). These are observable.

**3. Hear — Mechanism Discipline**  
The mechanism depends entirely on #6's pipeline output. The UI is a display layer. The mechanism here is: receive gate results → render appropriate state. That's well-defined.

**4. Speak — Output Discipline**  
Three outcomes:  
- "User can see each gate result within 5 seconds" — follows from the pipeline SLA in #6  
- "Blocked content never reaches the 'Plant' button" — this is enforced by frontend state only. If frontend enforcement is the only barrier, a user with devtools open can bypass it. Is there a backend enforcement layer?  
- "Flagged content requires explicit acknowledgment" — follows from the UI spec

**5. Falsifiability**  
"5 seconds" is falsifiable. "Never reaches the Plant button" is testable in the UI but not at the API layer without backend enforcement specified.

**6. Operational Meaning**  
Specific enough for a frontend developer to work from. Missing: what does "structural reason" look like? Is it a pre-written string from the gate logic, or does it require the gate to return a human-readable explanation?

**Structural Gaps:**  
- Backend enforcement of BLOCK status is not specified — frontend state alone is bypassable  
- "Structural reason" for block needs a schema from #6  
- 5-second SLA depends on #6's pipeline latency, which is not guaranteed in #6's outcomes

---

### Ticket 8 — Tier 1 verification: email + phone auth
**Rating: PASS**

**1. Structure Before Belief**  
"Without real verification, there is no real energy economy. Identity IS the energy source." — This is a foundational design axiom, clearly stated. It's an assumption, but it's explicitly presented as one, not hidden.

**2. See — Input Discipline**  
Inputs are specific: NextAuth.js for email, Twilio SMS/TOTP for phone. No ambiguity.

**3. Hear — Mechanism Discipline**  
State machine progression is described. The data model is given in SQL. Mechanism is clear.

**4. Speak — Output Discipline**  
"User signs up → verifies email → adds phone → verifies phone → energy_balance = 2, verification_tier = 1." This is a complete, traceable path from input to output.

**5. Falsifiability**  
End state is precisely specified (energy_balance = 2, verification_tier = 1). Falsifiable: complete the flow, query the DB, check the values.

**6. Operational Meaning**  
Concrete: specific library (NextAuth.js), specific vendor (Twilio), SQL schema provided. Developer can start.

**Minor Issues:**  
- "2 energy per tier, max 8" is stated in the problem but not enforced in the data model shown. Where is the max-8 constraint implemented?  
- TOTP and SMS are listed as alternatives ("SMS/TOTP") — are both required, or is either sufficient? This affects implementation scope.

---

### Ticket 9 — Tier 2 verification: social account OAuth linking
**Rating: CONCERN**

**1. Structure Before Belief**  
"A Facebook account with 10 years of history is harder to fake than an email." — This is stated as a structural argument but is actually an empirical claim. Facebook accounts ARE commercially sold and farmed with long histories. The assumption that social account age = identity depth needs to be acknowledged as a heuristic, not a guarantee.

**2. See — Input Discipline**  
OAuth for Facebook, Reddit, Instagram, X. These are observable integrations. But "account_age_days" is not available from all four providers' OAuth scopes — X's API has significant restrictions post-2023, and Instagram's Graph API does not expose account creation date for personal accounts.

**3. Hear — Mechanism Discipline**  
"Pull account age and basic metadata" — the mechanism assumes this data is accessible via OAuth. It is not for all listed providers. This is a blocking technical assumption that will fail in implementation for at least two of the four platforms.

**4. Speak — Output Discipline**  
"User links Facebook → account_age_days populated" — the outcome only tests Facebook. If the mechanism works for Facebook but fails for X (because X doesn't expose account_age), what happens? The outcome spec doesn't address partial success.

**5. Falsifiability**  
The Facebook test case is falsifiable. The general claim ("linking any Tier 2 account") is not tested — only one platform's outcome is specified.

**6. Operational Meaning**  
"Basic metadata (JSONB)" is vague. What fields specifically? The schema says `provider, account_age_days, metadata (JSONB)` — the JSONB is a catch-all that defers the data model decision. What metadata is required for each provider to constitute a valid Tier 2 link?

**Structural Gaps:**  
- API access assumption for account_age on X and Instagram is likely false — verify before building  
- Partial success case (some providers supply age, others don't) is unaddressed  
- JSONB "metadata" must be specified per provider  
- The social account age = identity depth heuristic should be documented as an assumption, not stated as fact

---

### Ticket 10 — Tier 3 verification: deep history account linking
**Rating: FLAG**

**1. Structure Before Belief**  
"A decade of gaming history proves a real human with sustained behavior patterns." — This is an assertion embedded as a premise. It does not prove identity; it proves account persistence. The claim "hardest to fabricate" is stated as fact but is not compared against Tier 1 or Tier 2 attack surfaces. It is presented as a conclusion before the mechanism has been examined.

**2. See — Input Discipline**  
The listed platforms present serious API access problems:  
- **Riot Games**: Has a developer API, but pulling "10-year account history" for production use requires partnership approval, not standard API keys  
- **Xbox/PSN**: No public API for account age or play history without platform certification  
- **YouTube**: Google's OAuth/API does not expose account creation date in a straightforward way  
- **LinkedIn**: Terms of Service explicitly prohibit scraping or automated data collection for this purpose  
- **Steam**: Has a public API, but friend count and play history require the profile to be public  

The ticket lists these as buildable integrations without verifying API access. At least 3 of 6 platforms will hit legal or technical walls.

**3. Hear — Mechanism Discipline**  
"OAuth/API integration" is listed for platforms that do not have uniform OAuth flows. PSN/Xbox require platform SDKs and developer agreements, not OAuth. The mechanism is underspecified to the point of being incorrect for several targets.

**4. Speak — Output Discipline**  
"User links Steam account with 10-year history → metadata includes account_age_days=3650+, game count, friend count." This is testable only for Steam. The other five platforms have no specified outcomes.

**5. Falsifiability**  
The Steam outcome is falsifiable. The general "Tier 3" claim is not tested — only one platform is specified.

**6. Operational Meaning**  
7-10 day estimate is almost certainly wrong given the API access research required. A developer who proceeds without checking platform ToS will burn days before hitting walls.

**Rhetoric Markers:**  
- "proves a real human" — overstatement. Accounts can be sold. Revise to "increases signal of persistent human behavior."  
- "hardest to fabricate" — comparative claim with no reference point

**Structural Gaps:**  
- API access feasibility for each platform must be verified before ticket is assigned  
- LinkedIn ToS is a hard blocker — remove or replace  
- Xbox/PSN require platform certification — 7-10 day estimate does not account for this  
- Per-platform testable outcomes missing for 5 of 6 platforms  
- "Rich metadata" is undefined

---

### Ticket 11 — Tier 4 verification: personal identity confirmation
**Rating: FLAG**

**1. Structure Before Belief**  
"The user is saying 'I am real and I stand behind everything I plant.'" — This is rhetorical framing. Whether a government ID verification actually produces this commitment is an assumption, not a demonstrated structural property.

**2. See — Input Discipline**  
"Photo upload and bio entry" — observable. But:  
- What makes a photo valid? Is any image accepted, or is there face detection?  
- "Family/connection linking (optional)" — how? Link to another SVN user? Verify a relationship? This is entirely undefined.  
- "Optionally government ID verification via Jumio or Onfido" — both vendors are named, but their integration requirements, costs, and legal obligations are not noted.

**3. Hear — Mechanism Discipline**  
The mechanism for "family/connection linking" is absent. This is either a social graph feature (users link to each other) or an identity verification feature (verify a family relationship externally). These require entirely different implementations. A developer cannot build this from the current description.

**4. Speak — Output Discipline**  
"Gov ID data is never stored in plaintext." — This is a security requirement, not an outcome of the feature. It is necessary but not sufficient. What is the positive outcome? The outcome states only the tier and energy balance.

**5. Falsifiability**  
"Never stored in plaintext" is testable only by auditing the storage layer. There is no test harness defined. "Stored hashed" and "stored via third-party" are two different mechanisms — which one applies?

**6. Operational Meaning**  
This ticket touches government-regulated identity data. There are no notes on:  
- GDPR/CCPA implications of storing government ID references  
- Data retention policy  
- Right-to-deletion implications  
- Jumio/Onfido cost per verification  
- What happens if the third-party vendor rejects the ID  

These are not optional concerns for a ticket of this nature. Shipping this without legal review is a liability.

**Rhetoric Markers:**  
- "full transparency" — loaded phrase. Transparency to whom? For what purpose?  
- "I am real and I stand behind everything I plant" — this is marketing copy embedded in a dev ticket

**Structural Gaps:**  
- "Family/connection linking" is undefined — scope must be clarified or removed  
- Photo validation criteria missing  
- Hashed vs. third-party storage must be chosen, not listed as alternatives  
- Legal/compliance review is a prerequisite, not a post-ship task  
- No mechanism for failed ID verification  
- No rejection/appeal flow

---

### Ticket 12 — Biome layer routing: scope-based plant assignment and cross-biome linking
**Rating: FLAG**

**1. Structure Before Belief**  
"A street-level problem goes to Plot. A national policy question goes to Biosphere." — These examples are clean. But the broader claim — that "scope" is an objectively determinable property of a text — is an assumption. Scope is often contested. A pothole can be a local issue or evidence of a national infrastructure policy failure. The routing mechanism will either make a judgment call (who decides?) or defer to the user (which renders the AI routing irrelevant).

**2. See — Input Discipline**  
"AI scope suggestion: analyze plant text and recommend appropriate layer" — observable input. But:  
- What model does this?  
- What is the prompt?  
- How is accuracy measured?  
- The two test cases ("my street's pothole" → Plot, "federal highway funding" → Biosphere) are trivially easy. Neither tests the contested middle where real routing decisions will occur.

**3. Hear — Mechanism Discipline**  
"Cross-biome linking: a Plot plant with enough energy/contribution can extend into Grove → Forest → Biosphere" — "enough energy/contribution" is undefined. What is the threshold? Who controls it? Can it be changed? This is a core game mechanic described with no numbers.

"Biome creation by users within any layer (costs energy — amount TBD now that planting is free)" — "TBD" in a Phase 2 ticket is a red flag. If biome creation costs are undefined, the energy economy model is incomplete, and any work depending on it is on unstable ground.

**4. Speak — Output Discipline**  
"A Plot plant with 20+ energy can be linked up to Grove" — 20 is mentioned in the testable outcome but not in the mechanism spec. The number appears without justification or configuration reference.

"Composted Biosphere plant distributes energy downward through all layers" — this is stated as an outcome but the distribution algorithm is not specified. Equal split? Proportional to biome size? This is a financial calculation with no formula.

**5. Falsifiability**  
The two scope routing tests are falsifiable but not representative. The cross-biome threshold (20 energy) is testable only if that number is locked in, but the ticket says "TBD." The compost cascade is unstestable because the distribution formula doesn't exist.

**6. Operational Meaning**  
"TBD" on biome creation cost is a concrete gap that will block development. The compost distribution formula is a concrete gap. The cross-biome threshold being set to 20 in the test but not in the spec is a concrete inconsistency.

**Rhetoric Markers:**  
- "ideas to grow through layers" — metaphorical, not operational  
- "enough energy/contribution" — needs a number

**Structural Gaps:**  
- Cross-biome energy threshold: specify the number or mark as config-driven with a default  
- Compost cascade distribution formula: must be specified before implementation  
- Biome creation cost: "TBD" must be resolved before this ticket goes to a developer  
- AI routing accuracy metrics: define before building  
- Contested scope cases: no handling specified

---

### Ticket 13 — Biome browsing and navigation UI
**Rating: CONCERN**

**1. Structure Before Belief**  
"Users need to discover what's being planted across all four layers" — valid structural statement. Clean.

**2. See — Input Discipline**  
The navigation components are enumerated: layer tabs, search, detail view, cross-biome links, health metrics. Observable.

**3. Hear — Mechanism Discipline**  
"Biome health metrics: energy flow, rhetoric density, signal quality per biome" — these are not defined in any ticket in this file. "Rhetoric density" and "signal quality" require computed aggregates that have no schema or calculation method anywhere in Phase 2. These are features hanging in the air.

**4. Speak — Output Discipline**  
"User can navigate from Biosphere overview → specific biome → individual plant in 3 clicks." — Testable. Good.  
"Cross-biome links are visually connected." — Testable visually but needs a definition of "visually connected." Tooltip? Drawn line? Icon badge?  
"Search returns relevant plants across all layers." — "Relevant" is not defined. Full-text match? Semantic similarity? Relevance rank?

**5. Falsifiability**  
"3 clicks" is falsifiable. "Relevant" is not, without a definition of relevance.

**6. Operational Meaning**  
Biome health metrics (rhetoric density, signal quality) depend on computed fields that are not defined in Phase 2. Building this UI panel before those fields exist will result in placeholder values or scope creep into the LLM scoring work.

**Structural Gaps:**  
- "Rhetoric density" and "signal quality" aggregates need specification or should be deferred  
- "Relevant" search results need a definition  
- Cross-biome link visual treatment needs a design spec or at minimum a description  
- Depends on #12 for cross-biome data, but also implicitly depends on #1/#2 for rhetoric density — this dependency is not listed

---

### Ticket 14 — Implement free planting rule: zero cost to plant
**Rating: CONCERN**

**1. Structure Before Belief**  
This ticket is a rule change, not a new feature. The problem statement structure is fine — it documents a decision made by a named person with their reasoning quoted directly. That is good traceability.

**2. See — Input Discipline**  
The code diff is explicit:  
```typescript
const plantCost = { plot: 0, grove: 0, forest: 0, biosphere: 0 };
```  
This is unambiguous.

**3. Hear — Mechanism Discipline**  
The implications section describes second-order effects: spam gets consumed, Gate becomes the only filter, AI scoring is more critical. These are stated as consequences, not mechanisms. The mechanism (change the cost constant) is trivial. The consequences are the actual engineering challenge, and they are just described, not assigned.

**4. Speak — Output Discipline**  
"User with 2 energy can plant 1000 seeds. Each starts at 0. User's energy_balance unchanged after planting." — This is testable. But 1000 is an arbitrary number. The actual limit (if any) is not stated. Can a user plant 1,000,000 seeds? Is there any rate limiting, or is the Three Monkeys Gate the sole barrier?

**5. Falsifiability**  
The stated test is falsifiable. The rate-limit question cannot be tested because it is not defined.

**6. Operational Meaning**  
This ticket is missing a critical operational question: are there any database, API, or UI rate limits on planting frequency? If a user plants 10,000 seeds per minute, what happens? The ticket's logic says they all pass through (energy not affected), but that's a potential DoS vector with no mitigation stated beyond the Three Monkeys Gate (which has its own unresolved issues — see #6).

**Structural Gaps:**  
- Rate limit policy on planting frequency must be defined  
- The consequences described in "Implications" should each trigger sub-tasks or cross-ticket references, not just be noted as afterthoughts  
- The reference to `docs/svn-rule-change-free-planting.md` suggests there is a separate document — is there anything in that doc not captured here?

---

### Ticket 15 — Migrate energy ledger to double-entry PostgreSQL with row-level locking
**Rating: PASS**

**1. Structure Before Belief**  
"SQLite with no transaction safety" — this is a factual, observable problem. The invariant is mathematically stated. No rhetoric.

**2. See — Input Discipline**  
The invariant is precise:  
```
sum(all user energy) + sum(all plant energy) + sum(all compost energy) = sum(all verification awards)
```  
This is a conservation law. Every transaction either preserves it or violates it. Observable.

**3. Hear — Mechanism Discipline**  
PostgreSQL migration + double-entry bookkeeping + `SELECT FOR UPDATE` + constraint enforcement. These are standard, well-understood database mechanisms. Each is independently verifiable.

**4. Speak — Output Discipline**  
"100 concurrent consume operations on the same plant: exactly one succeeds per unit of plant energy." — This is a precise test case that maps directly to the row-level locking mechanism.  
"No negative balances" — DB constraint.  
"Ledger invariant holds" — queryable after every transaction.

**5. Falsifiability**  
All three outcomes are falsifiable with a load test. The invariant check is a simple SQL query.

**6. Operational Meaning**  
Concrete. Developer knows the stack, the constraint, and the test. 

**Minor Issues:**  
- "Every test must verify this" — this is a strong requirement. Does this mean every unit test in the entire test suite checks the invariant? That may be over-specified and slow. Clarify whether this means every ledger-specific integration test.

---

### Ticket 16 — WebSocket real-time updates (Socket.io)
**Rating: CONCERN**

**1. Structure Before Belief**  
"Energy transfers need to be visible in real time." — This is a design requirement stated as a structural need. It would be strengthened by noting the actual failure mode without WebSockets (e.g., "currently users must poll or refresh to see energy changes, which breaks the contribution loop").

**2. See — Input Discipline**  
Event types are enumerated: plant_created, contribution_added, energy_transferred, plant_composted, ai_score_ready, compost_claimed. These are observable system events.

**3. Hear — Mechanism Discipline**  
Socket.io on Express, biome channels, plant-specific channels, user energy channels. Standard WebSocket architecture. Reconnection and heartbeat are noted.  
"Optimistic UI: show energy changes immediately, reconcile with server" — this is a significant client-side complexity that is listed as a bullet but deserves its own specification. Optimistic UI with reconciliation has well-known failure modes (optimistic state that can't be reconciled, double-application of updates). These are not addressed.

**4. Speak — Output Discipline**  
"User A joins User B's plant → User B sees energy update within 1 second without refreshing." — Testable.  
"All viewers of that plant see the score appear live." — Testable.

**5. Falsifiability**  
Both outcomes are falsifiable. The 1-second SLA is specific.

**6. Operational Meaning**  
"1.5–2 weeks" is the longest estimate in the file. It is probably realistic but the estimate is not decomposed. What are the two weeks actually spent on? Backend WebSocket server? Client subscription layer? Optimistic UI? Each of these should be a task or sub-task.

**Structural Gaps:**  
- Optimistic UI reconciliation failure modes are unaddressed — this will produce bugs  
- "Auth token refresh" is mentioned but the mechanism is undefined  
- No defined behavior for channel fan-out under load (e.g., 1000 users watching the same plant)  
- Effort estimate is not decomposed

---

### Ticket 17 — Steward role with Alpha-Omega Mirror evaluation
**Rating: FLAG**

**1. Structure Before Belief**  
"Stewards are NOT moderators." — This is a philosophical distinction that is not operationally defined. The ticket says stewards can pin announcements and adjust biome metadata, but cannot delete plants or ban users. That's a permissions spec, not a distinction between steward and moderator. The claim that the Alpha-Omega Lens "watches them the same way it watches everyone else" embeds the assumption that symmetric evaluation produces accountability — this is asserted, not demonstrated.

**2. See — Input Discipline**  
"Steward can: pin structural announcements, adjust biome metadata." — What is "biome metadata"? Name? Description? Rules? Geographic scope? This is undefined. A developer cannot build metadata editing without knowing what fields exist.

**3. Hear — Mechanism Discipline**  
The 6 Mirror Questions are listed:  
1. Structure or Ideology?  
2. Signal or Noise?  
3. Falsifiable?  
4. Reversible?  
5. Self-Serving?  
6. Transparent?  

These are not the same 6 questions as the Alpha-Omega Lens evaluation protocol (structure before belief, see/hear/speak discipline, falsifiability, operational meaning). The Mirror uses different questions from the Lens. This is not flagged anywhere in the ticket. Are these two separate LLM prompts? If the Mirror is a different evaluation than the Lens, it needs its own calibration, its own prompt, its own validation — none of which is specified.

**4. Speak — Output Discipline**  
"Any user can consume the action if they prove it was ideological." — The phrase "prove it was ideological" is doing enormous amounts of work here and is entirely undefined. How does a user "prove" this? By posting a challenge? By getting a certain score from the Lens? By community vote? This is the core mechanic of steward accountability and it has no implementation path.

**5. Falsifiability**  
"Score is publicly visible" — falsifiable.  
"Any user can consume the action if they prove it was ideological" — this is not falsifiable because "prove" has no defined process. This outcome cannot be tested until the mechanism is defined.

**6. Operational Meaning**  
4-5 day estimate for a ticket that involves:
- A new role system  
- A new LLM prompt (Mirror ≠ Lens)  
- A new evaluation pipeline for steward actions  
- A new "consume a steward action" mechanic  
- An undefined "proving" mechanism  

This estimate is not credible given the undefined scope.

**Rhetoric Markers:**  
- "Every steward action is public, logged, and consumable" — these are three separate engineering requirements buried in what reads as a manifesto sentence  
- "NOT moderators" — the repetition of "not" suggests this distinction is being defended philosophically rather than defined operationally

**Structural Gaps:**  
- "Biome metadata" fields must be specified  
- Mirror 6 questions vs. Lens 6 questions: reconcile or document as intentionally different  
- "Prove it was ideological" requires a defined mechanism before this ticket is buildable  
- The "consume a steward action" mechanic requires a data model  
- Steward assignment process is described but not implemented — who assigns stewards? How? What prevents a bad actor from becoming a steward?  
- 4-5 day estimate is implausible given the open questions

---

## Cross-Cutting Issues

These are problems that affect multiple tickets and should be resolved at the project level before Phase 2 begins.

### 1. The "7 dimensions" vs. "6-point protocol" contradiction
Tickets #1 and #3 promise 7 scored dimensions. The evaluation protocol has 6 points. One dimension is unaccounted for. This must be resolved before any schema or parsing work begins, since the entire LLM scoring stack depends on knowing the output structure.

### 2. Calibration data provenance
Tickets #2 and #6 both require "known-quality" labeled inputs. Neither specifies who labels them, by what criteria, or how labeling is kept separate from tuning. If the same person who writes the prompt also labels the calibration data, the calibration is self-confirming.

### 3. "At scale" is never defined
Multiple tickets (#5, #6, #14) reason about scale without defining it. A system with 50 users has different cost, performance, and spam characteristics than one with 50,000. The Phase 2 target scale should be stated once and referenced everywhere.

### 4. The Three Monkeys Gate is the load-bearing arch of the free-planting model, but is the least defined component
Ticket #14 moves all spam prevention to the Gate. Ticket #6 (the Gate) has the most structural holes of any ticket in the file. These two tickets are tightly coupled and both need to be solid before free planting ships.

### 5. Social/gaming platform API feasibility is assumed, not verified
Tickets #9, #10 assume API access to X, Instagram, Xbox, PSN, LinkedIn, Riot Games. Several of these have changed or restricted their APIs significantly. API feasibility should be a research spike before building starts.

### 6. Legal review prerequisites
Ticket #11 (gov ID) requires legal review before implementation. Ticket #9 (social OAuth) has ToS implications for automated data collection. Neither ticket flags legal review as a prerequisite gate.

### 7. Missing explicit dependency graph
Several tickets use "Depends On" inconsistently:
- #1 says "Depends On: Nothing" but implicitly depends on #2  
- #13 depends on both #12 (listed) and #1/#2 (unlisted) for rhetoric density metrics  
- #17 depends on the Mirror prompt, which is not a defined artifact anywhere  

The full dependency graph should be drawn before sprint planning.

---

## Verdict

| Category | PASS | CONCERN | FLAG |
|----------|------|---------|------|
| Alpha-Omega Lens (5 tickets) | 2 | 2 | 1 |
| Three Monkeys Gate (2 tickets) | 0 | 1 | 1 |
| Identity Verification (4 tickets) | 1 | 1 | 2 |
| Biome Routing (2 tickets) | 0 | 1 | 1 |
| Energy Economy (2 tickets) | 1 | 1 | 0 |
| WebSockets (1 ticket) | 0 | 1 | 0 |
| Steward Mirror (1 ticket) | 0 | 0 | 1 |
| **Total** | **4** | **7** | **6** |

**4 of 17 tickets are clean enough to start immediately.**  
**6 tickets have structural problems that will produce wasted dev work if started as written.**  
**The most critical pre-work items before Phase 2 sprint planning:**

1. Resolve 6-dimension vs. 7-dimension contradiction (#1, #3)  
2. Audit platform API access for Tier 2/3 verification (#9, #10) — at minimum X, Instagram, LinkedIn, Riot, PSN/Xbox  
3. Define hard floor enforcement mechanism as deterministic (not LLM) in #6  
4. Define the "proving ideological intent" mechanic in #17 or remove the feature from Phase 2  
5. Resolve biome creation cost "TBD" in #12  
6. Legal review prerequisite for #11 before it enters any sprint
