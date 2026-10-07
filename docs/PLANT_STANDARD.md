# SVN Plant Standard (v1)

**Set:** 7 October 2026, at Ammon's order ("let's make a standard").
**Applies to:** every plant the stewards put on the Proving Grounds at ammoncovino.com/forums, and the model for what human planters will be asked to meet once planting opens.
**Owner:** Ammon Covino. Ammon rules; stewards recommend. A change to this standard is a new version number with a line in the change log at the bottom.

---

## What a plant is

A plant is a structural question with a number under it. It is not a verdict and not a side. It names a mechanism, shows the evidence, admits the strongest case against it, and hands the question to the reader.

The Alpha-Omega Lens scores every plant for logic against rhetoric. A plant that rules ("X is worse", "this should be law") reads as opinion and scores as rhetoric. A plant that asks a testable question, with its numbers sourced and its counter-case stated, scores as logic. Write the second kind.

## Every plant ships as two pieces

1. **The live plant** in `docs/seed-plants/live-plants.md`. Short, plain, first person. This is what people read on the forum.
2. **The research file** in `docs/seed-plants/research/NN-short-name.md`. Every claim, every number, every source, each claim tagged. The live plant ends with a pointer to it.

A plant with no research file does not go live.

## The shape of the live plant

Seven beats, in this order. Each is a sentence or a short paragraph.

| # | Beat | What it does |
|---|---|---|
| 1 | **Title** | A plain claim or question, under 12 words. No clickbait, no name-calling. |
| 2 | **The hook** | What people say, or the number that stops you. |
| 3 | **The mechanism** | Starts "Here's what gets me." Says how the thing works, with at least one verified number or finding. |
| 4 | **The fix or the test** | A fix that has been tried somewhere, with its result. If no fix exists, a test anyone can run. |
| 5 | **Why it matters** | One or two sentences. Plain consequence, no forecast of doom. |
| 6 | **The catch** | Required. The strongest case against the plant, stated fairly, as its defenders would put it. |
| 7 | **The question** | One question to the reader. It is the thing being proven or disproven. |

Then the pointer line: `*Full research and sources: docs/seed-plants/research/NN-short-name.md.*`

## The rules

**Three Monkeys Gate.** Before a plant goes live it passes all three:
- *See no evil:* is every claim verifiable from a source someone else can open?
- *Hear no evil:* is the question testable, meaning some evidence could answer it either way?
- *Speak no evil:* is it signal, not noise? Would the forum be poorer without it?

**Numbers.** Every number in the live plant appears in the research file with its source. No number from memory. No rounding that changes the meaning.

**Claims legend.** In the research file every claim carries one tag, the same legend the books use:
- ESTABLISHED: a published, checkable finding.
- SYNTHESIS: the steward's or Ammon's reasoning from established findings.
- POSTULATE: an assumption not yet shown. It may stay in the plant only if it is phrased as a question.

**No verdicts.** The plant asks; the forum rules. Ammon's own position can be stated in the research file, tagged, but the live plant ends on a question, not a ruling.

**The counter-case is mandatory.** Beat 6 cannot be dropped or written as a straw man. If the stewards cannot state the best case against the plant, the plant is not ready.

**Living people.** No living person is named in the live plant as an example of a fault unless the claim rests on a primary source (their own words on record, a court filing, an official document). A quote that cannot be traced to its first appearance stays out.

**Religion, nation, party.** A plant that touches belief examines a mechanism, not a people. It names the secular versions of the same mechanism where they exist, so no single faith or group is the target.

**House style.** Plain words a 14-year-old can follow. First person ("Here's what gets me"). Under 200 words for the live plant. American spelling. No em dashes; use commas, colons or a new sentence.

**Biome.** Pick by scale: Plot (your street), Grove (your school, HOA, organization), Forest (your city or state), Biosphere (whole societies).

## How a plant goes live

1. Write the research file first.
2. Write the live plant from it, using the seven beats.
3. Run the checklist below.
4. Add it to the end of `live-plants.md` as `## PLANT NN — <Biome>` then `### <Title>`, separated from the plant above by `---`. Use the next free number.
5. Merge to `main`. On its next restart the forum sees the file changed and syncs. Plants people have already contributed to are never removed.

Steward plants go in through this file. Members plant through the forum itself once per-session human verification is live (Ammon's ruling: no bots where votes or actions happen).

## Checklist before merging

- [ ] Research file exists, every claim tagged, every source linked
- [ ] Every number in the live plant is in the research file
- [ ] All seven beats present, in order
- [ ] The catch states the strongest counter fairly
- [ ] Ends on one question, not a verdict
- [ ] No living person named as a fault without a primary source
- [ ] Under 200 words, no em dashes, plain words
- [ ] Three Monkeys Gate: verifiable, testable, signal

---

## Change log

- **v1, 7 Oct 2026:** Standard written from the shape of the existing live and queued plants (11 to 20), plus the Three Monkeys Gate, the claims legend from the books, the mandatory counter-case, and the living-person rule. First plant written to it: Plant 21.
