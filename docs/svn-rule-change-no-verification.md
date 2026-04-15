# SVN Rule Change — Verification System Removed

**Date:** April 15, 2026
**Changed by:** Ammon Covino

---

## The Change

Identity verification tiers are eliminated entirely. The only gate is a Turing test (CAPTCHA). No OAuth, no linked accounts, no phone verification, no government ID.

## What Was Removed

| Component | Status |
|---|---|
| 4 verification tiers (Seedling/Sapling/Established/Canopy) | Removed |
| OAuth account linking (Facebook, Reddit, Instagram, X, Steam, Riot, etc.) | Removed |
| Energy-from-verification model (2 per tier, max 8) | Removed |
| linked_accounts table | Removed |
| verification_events table | Removed |
| Deep history analysis (account age, post history) | Removed |
| Government ID verification (Jumio/Onfido) | Removed |
| Cross-platform AI auditing of linked accounts | Removed (was Phase 3) |
| Ego scoring from linked account contradictions | Removed (was Phase 3) |

## What Replaces It

- CAPTCHA at signup (hCaptcha or Cloudflare Turnstile)
- Everyone starts with the same base energy (8 units)
- No identity depth. No transparency tiers.
- Your plants speak for themselves through the Alpha-Omega Lens.

## Ammon's Reasoning

> "It should not make a difference that I'm a human or not beyond a Turing test. Takes all those issues away."

A bot that plants structural logic is as valuable as a human that plants structural logic. A human that plants rhetoric gets consumed the same as a bot that plants rhetoric. The lens doesn't care who you are — it cares what you said.

## Impact on Phase 2

| Before | After |
|---|---|
| Auth: 4-5 weeks (4 tiers, OAuth, phone, gov ID) | Auth: 2-3 days (signup + CAPTCHA) |
| Phase 2 total: 5-7 weeks | Phase 2 total: ~4-5 weeks |
| Phase 3 cross-platform auditing: 3.5-5 weeks | Removed entirely |

## Impact on Energy Economy

Energy is no longer earned through verification. Everyone gets 8 base energy at signup. Energy grows through quality contribution (joining plants that survive) and shrinks through failed consumption attempts.

## Files to Update
- `svn-cursor-prompt.md` — Remove verification tiers, update auth section
- `svn-technical-roadmap.md` — Remove Phase 1 section 1.1, simplify auth
- `.cursor/rules` — Remove verification tables and data models
- `svn-v4-verification-locked.md` — Archive (no longer active)
- `svn-developer-brief.md` — Update economics section
