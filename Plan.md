# Plan.md: Crypto Advisory 3D Platform (Hackathon Build Spec)

> **Instruction to the AI coding tool:** Read this entire file before writing any code. Build in the phase order defined in Section 12. Do not skip the acceptance criteria. When a decision is not specified here, choose the simplest option that keeps the demo flow in Section 14 working. Never add features outside Section 3 "Must" and "Should" until all of them pass their acceptance criteria.

---

## 1. Project Overview

| Item | Detail |
|---|---|
| **Name (working)** | CryptoCompass (rename freely) |
| **One-liner** | A risk-matched, explainable crypto guidance platform for beginners, with a human advisor in the loop. |
| **Problem** | Most new investors do not understand crypto and do not know which assets fit their goals, budget, and risk comfort. |
| **Solution** | Users onboard through an interactive 3D flow, give their needs, and receive a diversified, explainable crypto allocation. An advisor reviews, edits, and approves it. |
| **Users** | (1) **Investor** (onboarded user), (2) **Advisor** |
| **Context** | Hackathon project. Priorities: polished demo, explainability, trust, visible 3D value. |
| **Positioning rule** | Never promise returns or "the best coin." Always frame as "best fit for your profile." |

---

## 2. Roles and Core Flows

| Role | Capabilities |
|---|---|
| **Investor** | Sign up, complete onboarding, see risk persona, view 3D Risk Galaxy, see matched coins with explanations, run simulator and crash test, receive advisor-reviewed recommendation, ask questions, read learn cards |
| **Advisor** | Log in, see client list, open client profile, review system-generated matches, edit allocation and rationale, approve and publish a recommendation, reply to client questions, view analytics |

**Core flow:** Investor onboards → engine generates matches → status `pending_review` → Advisor reviews/edits/approves → Investor sees "Advisor Approved" recommendation.

---

## 3. Feature Scope and Priority

| Priority | Feature | Acceptance criteria |
|---|---|---|
| **Must** | Auth with two roles (investor, advisor) | Role-based route guards work; wrong role is redirected |
| **Must** | 3D guided onboarding | Completes in under 2 minutes; saves all answers; validates inputs |
| **Must** | Risk persona | One of 3 personas (Section 6) shown with name, description, and visual |
| **Must** | Match engine with explanations | Returns ranked coins with Match % and 2-4 plain-language reasons each |
| **Must** | Live market data | At least prices, market cap, 24h volume, and 30d/90d change from CoinGecko, cached |
| **Must** | Advisor dashboard and recommendation cards | Advisor can approve/edit; investor sees "Reviewed by Advisor" badge |
| **Must** | Disclaimer system | Visible on onboarding, results, and footer |
| **Should** | 3D Risk Galaxy | Coins as planets, user zone highlights matches, click shows coin card |
| **Should** | Portfolio simulator ("What if?") | Amount slider and historical backtest chart |
| **Should** | Crash stress test | Shows worst-case drawdown for the suggested allocation |
| **Should** | Coin Health Scorecard | Per-coin sub-scores shown as bars or radar |
| **Should** | Learn cards / tooltips | Glossary terms inline in the results flow |
| **Nice** | AI explainer chat ("why this coin for me?") | Answers grounded in the user's profile and coin data only |
| **Nice** | Paper trading | Virtual balance, buy/sell at live price |
| **Nice** | Advisor alerts and rebalancing notices | Drift over threshold triggers a notification |
| **Nice** | Scam / rug-pull flag | Low-liquidity or flagged tokens carry a warning (hard-filtered from recommendations by default) |

---

## 4. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 14+ (App Router) + TypeScript** | API routes for backend |
| 3D | **React Three Fiber + @react-three/drei + three** | Lazy-load the canvas; add 2D fallback |
| Animation | framer-motion (UI), drei helpers / useFrame (3D) | |
| Styling | **Tailwind CSS** + shadcn/ui | Dark, modern fintech look |
| State | **Zustand** | Onboarding state, UI state |
| Database | **Supabase (Postgres + Auth)**, or Prisma + SQLite if no cloud | Pick one and stay consistent |
| Validation | **Zod** | Shared schemas for client and server |
| Charts | **Recharts** | Simulator and stress test |
| Market data | **CoinGecko API** | Server-side fetch and cache (5-10 min) |
| AI chat (Nice) | Anthropic Claude API via a server route | Never expose the key on the client |
| Deploy | Vercel | |

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only |
| `COINGECKO_API_KEY` | Optional demo/pro key |
| `ANTHROPIC_API_KEY` | Server-only, for AI chat |

---

## 5. Folder Structure

```
/app
  /(public)/page.tsx                 # landing
  /(auth)/login, /signup
  /onboarding/page.tsx               # 3D guided flow
  /dashboard/                        # investor
    page.tsx                         # persona + recommendation
    galaxy/page.tsx
    simulator/page.tsx
    learn/page.tsx
    messages/page.tsx
  /advisor/
    page.tsx                         # overview + analytics
    clients/page.tsx
    clients/[id]/page.tsx
    reviews/page.tsx                 # pending queue
  /api/
    market/route.ts
    profile/route.ts
    match/route.ts
    recommendations/route.ts
    recommendations/[id]/route.ts
    simulate/route.ts
    stress/route.ts
    messages/route.ts
    chat/route.ts                    # Nice
/components
  /three  (Scene, RiskGalaxy, PortfolioTower, JourneyStation, Fallback2D)
  /ui     (cards, badges, tables)
  /onboarding, /advisor, /charts, /learn
/lib
  /engine (riskScore.ts, filter.ts, rank.ts, allocate.ts, explain.ts, stress.ts, backtest.ts)
  /data   (coingecko.ts, cache.ts, seedCoins.ts, glossary.ts)
  /schemas (zod)
  /supabase.ts
/types
/Plan.md
```

---

## 6. Risk Profile and Personas

### Onboarding questions

| # | Question | Type | Maps to |
|---|---|---|---|
| 1 | Main goal (save, grow wealth, learn, short-term gain) | Single select | `goal` |
| 2 | Investment amount (currency selectable) | Number | `amount` |
| 3 | Time horizon (<1y, 1-3y, 3-5y, 5y+) | Single select | `horizonYears` |
| 4 | Crypto experience (none, beginner, intermediate) | Single select | `experience` |
| 5 | Income stability (stable, variable, uncertain) | Single select | `incomeStability` |
| 6 | Scenario: "Your portfolio drops 30% in a month. You…" (sell all / sell some / hold / buy more) | Single select | `lossReaction` |
| 7 | Scenario: pick a hypothetical outcome range (e.g., +10%/-5% vs +60%/-35%) | Single select | `riskPreference` |
| 8 | Need quick access to funds? (yes/no) | Boolean | `liquidityNeed` |
| 9 | Preferred categories (store of value, smart contract platforms, DeFi, stablecoin, no preference) | Multi-select | `categories` |

### Risk score (1-10)

Compute as a weighted sum, then round to the nearest integer within 1-10. Use these weights, with each answer normalized to 0-1:

| Input | Weight |
|---|---|
| `lossReaction` | 0.25 |
| `riskPreference` | 0.25 |
| `horizonYears` | 0.20 |
| `incomeStability` | 0.10 |
| `experience` | 0.10 |
| `goal` | 0.10 |

If `liquidityNeed` is true, subtract 1 from the score (min 1).

### Personas

| Persona | Risk score | Description | Typical allocation shape |
|---|---|---|---|
| **Cautious Saver** | 1-3 | Capital preservation first, stability over growth | Mostly BTC/ETH plus a large stablecoin buffer |
| **Balanced Builder** | 4-7 | Steady growth with controlled risk | BTC/ETH core plus a small mid-cap slice |
| **Growth Seeker** | 8-10 | Accepts large swings for higher upside | Core plus a larger mid-cap slice, smaller stable buffer |

---

## 7. Data Models

```ts
type Role = 'investor' | 'advisor';

interface User { id: string; email: string; name: string; role: Role; createdAt: string; }

interface InvestorProfile {
  userId: string;
  goal: 'save' | 'grow' | 'learn' | 'short_term';
  amount: number;
  currency: string;
  horizonYears: number;
  experience: 'none' | 'beginner' | 'intermediate';
  incomeStability: 'stable' | 'variable' | 'uncertain';
  lossReaction: 'sell_all' | 'sell_some' | 'hold' | 'buy_more';
  riskPreference: 1 | 2 | 3 | 4;
  liquidityNeed: boolean;
  categories: string[];
  riskScore: number;            // 1-10
  persona: 'cautious_saver' | 'balanced_builder' | 'growth_seeker';
  assignedAdvisorId?: string;
}

interface Coin {
  id: string;                   // coingecko id
  symbol: string; name: string;
  category: 'store_of_value' | 'smart_contract' | 'defi' | 'stablecoin' | 'other';
  marketCap: number; volume24h: number; price: number;
  change30d: number; change90d: number;
  volatility90d: number;        // stdev of daily returns, annualized
  maxDrawdown: number;          // historical, 0-1
  ageYears: number;
  flags: ('low_liquidity' | 'unaudited' | 'anonymous_team' | 'new')[];
  lastUpdated: string;
}

interface CoinScores {           // each 0-100
  liquidity: number; stability: number; size: number;
  trackRecord: number; categoryFit: number;
}

interface Match {
  coinId: string;
  matchPercent: number;         // 0-100
  scores: CoinScores;
  reasons: string[];            // 2-4 plain-language strings
  warnings: string[];
}

interface Recommendation {
  id: string;
  investorId: string;
  advisorId?: string;
  status: 'pending_review' | 'approved' | 'edited' | 'rejected';
  source: 'engine' | 'advisor';
  allocation: { coinId: string; percent: number; rationale: string; risk: string; reconsiderWhen: string }[];
  entryPlan: { type: 'lump_sum' | 'dca'; installments?: number; intervalDays?: number };
  advisorNote?: string;
  version: number;
  createdAt: string; approvedAt?: string;
}

interface Message { id: string; recommendationId?: string; fromUserId: string; toUserId: string; body: string; createdAt: string; }

interface Alert { id: string; investorId: string; type: 'rebalance' | 'risk' | 'info'; body: string; createdAt: string; read: boolean; }
```

**Constraints:** `allocation` percents must sum to exactly 100. Version increments on every advisor edit; keep prior versions in a `recommendation_versions` table for the history view.

---

## 8. Matching Engine (explainable weighted scoring, no black-box ML)

Implement as pure, unit-testable functions in `/lib/engine`.

### Step 1: Hard filter

| Rule | Condition to exclude |
|---|---|
| Liquidity | `volume24h / marketCap` below 0.01, or `volume24h` below $5M |
| Size for low risk | If `riskScore <= 3`, exclude `marketCap` below $10B (except stablecoins) |
| Size for mid risk | If `riskScore 4-7`, exclude `marketCap` below $1B |
| Volatility cap | If `riskScore <= 3`, exclude `volatility90d` above the 70th percentile of the candidate set |
| Flags | Exclude any coin with `unaudited` or `anonymous_team` flags by default |
| Liquidity need | If `liquidityNeed`, exclude low-liquidity coins |

### Step 2: Sub-scores (0-100, min-max normalized across candidates)

| Sub-score | Computation |
|---|---|
| `liquidity` | volume/marketCap ratio and absolute volume |
| `stability` | inverse of `volatility90d` and `maxDrawdown` |
| `size` | log-scaled `marketCap` |
| `trackRecord` | `ageYears` (cap at 10) |
| `categoryFit` | 100 if the coin's category is in the user's preferred categories, 50 if no preference, 20 otherwise |

### Step 3: Rank

`matchPercent = Σ(weight × subScore)` where the weights depend on the persona:

| Persona | liquidity | stability | size | trackRecord | categoryFit |
|---|---|---|---|---|---|
| Cautious Saver | 0.20 | 0.35 | 0.20 | 0.15 | 0.10 |
| Balanced Builder | 0.20 | 0.20 | 0.20 | 0.15 | 0.25 |
| Growth Seeker | 0.15 | 0.10 | 0.15 | 0.10 | 0.50 → capped, then rebalance so weights sum to 1 (use 0.15/0.10/0.15/0.10/0.50 only if categoryFit is meaningful, else fall back to 0.25/0.15/0.25/0.15/0.20) |

Keep weights in one config object so the advisor UI can display them.

### Step 4: Allocate

| Persona | Stablecoin buffer | Core (BTC + ETH) | Mid-cap slice | Max per single non-stable coin |
|---|---|---|---|---|
| Cautious Saver | 30-40% | 55-65% | 0-5% | 50% |
| Balanced Builder | 10-15% | 60-70% | 15-25% | 45% |
| Growth Seeker | 0-5% | 45-55% | 40-50% | 35% |

Use the top-ranked coins within each bucket. Round to whole percents and adjust the largest holding so the total is exactly 100.

### Step 5: Explain

Generate `reasons` from templates keyed on the strongest sub-scores and the user's answers. Example outputs:

- "Fits your low risk tolerance: this coin has been less volatile than most."
- "Highly liquid, so you can exit easily if you need funds."
- "Over 10 years of track record."
- "Matches your preferred category: smart contract platforms."

Also generate a `warnings` entry for any non-stable coin ("Price can fall sharply; invest only what you can afford to lose").

### Step 6: Output

The engine writes a `Recommendation` with `status: 'pending_review'`, `source: 'engine'`.

---

## 9. API Routes

| Method and route | Purpose | Auth |
|---|---|---|
| `GET /api/market` | Cached coin list with metrics (5-10 min TTL, fall back to seed data on API failure) | Any |
| `POST /api/profile` | Save onboarding answers, compute risk score and persona | Investor |
| `POST /api/match` | Run engine for the current investor, create a pending recommendation | Investor |
| `GET /api/recommendations` | Investor: own approved. Advisor: pending/all for assigned clients | Both |
| `PATCH /api/recommendations/[id]` | Advisor edits allocation, note, entry plan; sets status | Advisor |
| `POST /api/simulate` | Backtest allocation over a chosen window and amount | Investor |
| `POST /api/stress` | Apply crash scenarios to an allocation | Both |
| `POST /api/messages`, `GET /api/messages` | Q&A thread per recommendation | Both |
| `POST /api/chat` | AI explainer (Nice) | Investor |

Validate all bodies with Zod. Return typed JSON errors with status codes. Rate-limit `/api/market` and `/api/chat`.

---

## 10. Simulator and Stress Test

### Backtest (`/api/simulate`)

| Item | Spec |
|---|---|
| Input | allocation, amount, window (1y / 3y / max) |
| Method | Fetch daily price history per coin (cached), compute the weighted portfolio value assuming a lump-sum at window start with no rebalancing |
| Output | Time series, total return %, max drawdown, best/worst month |
| UI | Line chart plus summary stats. Label clearly: "Past performance does not predict future results" |

### Stress test (`/api/stress`)

| Item | Spec |
|---|---|
| Scenarios | "2018 bear market", "2022 crash", "Custom: -X% across risky assets" |
| Method | For each coin, compute peak-to-trough drawdown within the scenario window from historical data. If data is missing (coin did not exist yet), use a category fallback (large-cap, mid-cap, stable). Stablecoins use a small depeg assumption (e.g., -1%). |
| Output | Portfolio drawdown %, amount lost in the user's currency, per-coin contribution |
| Note | Do not hardcode historical figures from memory. Compute from fetched data, and mark any fallback values as "approximate" in the UI. |

---

## 11. 3D Experience Spec

| Scene | Description | Notes |
|---|---|---|
| **Landing hero** | Slow-rotating abstract coin or particle field | Keep under 1 MB of assets |
| **Onboarding journey** | Camera moves through stations (Goal → Amount → Horizon → Risk → Preferences) as steps advance | Form UI overlays in 2D HTML (drei `Html` or standard DOM). Do not build forms inside the canvas. |
| **Risk Galaxy** | Each coin = sphere. Size = log(marketCap). Distance from center = risk (volatility). Color = category. The user's risk zone = a translucent ring. Matched coins glow and pulse. Hover shows a tooltip. Click opens the coin card. | Use instanced meshes if over 30 coins |
| **Portfolio Tower** | Stacked segments that animate when the allocation or sliders change | Used on the advisor edit screen and simulator |
| **Persona reveal** | Short animated reveal of the persona icon | Under 3 seconds, skippable |

### 3D rules

| Rule | Detail |
|---|---|
| Performance | Target 60 fps on a mid-range laptop. Use `dpr={[1, 2]}`, dispose geometries, avoid heavy post-processing |
| Loading | `next/dynamic` with `ssr: false` for all canvases. Show a skeleton while loading |
| Fallback | Detect low-power devices or `prefers-reduced-motion` and render the 2D alternative (same data, plain SVG/DOM) |
| Accessibility | Every 3D insight must also be reachable as text (a coin list or table below the canvas). Keyboard-navigable controls. |
| Mobile | Reduce particle counts, disable orbit controls that conflict with scrolling |

---

## 12. Build Phases (follow in order)

| Phase | Tasks | Done when |
|---|---|---|
| **0. Setup** | Init Next.js + TS + Tailwind + shadcn, ESLint, env template, folder structure, Supabase/Prisma, seed script | App boots; DB connected |
| **1. Data layer** | CoinGecko client, cache, seed coin list (BTC, ETH, SOL, BNB, XRP, ADA, USDC, USDT, plus a few mid-caps), metric computation (volatility, drawdown, age) | `/api/market` returns normalized coins; fallback works offline |
| **2. Auth and roles** | Signup/login, role field, route guards, two seeded demo accounts (one investor, one advisor) | Role redirects work |
| **3. Engine** | Implement `/lib/engine` with unit tests (Vitest) for risk score, filter, rank, allocate, explain | Tests pass for all three personas; allocations sum to 100 |
| **4. Onboarding UI** | Multi-step flow, validation, progress, save profile, persona reveal, disclaimers | Full flow saves a profile and shows a persona |
| **5. Results and recommendation** | Match cards with Match %, reasons, warnings, allocation chart, learn tooltips | Engine output rendered and `pending_review` created |
| **6. Advisor dashboard** | Client list, client profile, pending queue, edit/approve flow, rationale/risk/reconsider fields, DCA plan option, versioning | Approval flips the investor view to "Reviewed by Advisor" |
| **7. 3D scenes** | Landing hero, onboarding journey, Risk Galaxy, fallback 2D | Galaxy highlights matches; fallback works |
| **8. Simulator and stress test** | Backtest and stress endpoints plus charts | Both produce results for any valid allocation |
| **9. Scorecard, learn cards, messages** | Coin Health Scorecard, glossary tooltips, Q&A thread | All render with real data |
| **10. Nice-to-haves** | AI chat, paper trading, alerts, scam flag UI | Only if phases 0-9 pass |
| **11. Polish** | Loading and empty states, error handling, responsive pass, performance pass, demo data, README | Demo flow in Section 14 runs without errors |

---

## 13. UX, Content, and Compliance Requirements

| Area | Requirement |
|---|---|
| **Tone** | Plain language for beginners. Avoid jargon, or explain it inline with learn cards. |
| **Disclaimer** | Show "Educational information, not financial advice. Crypto is volatile and you can lose money." on onboarding start, on results, on the advisor-approved card, and in the footer. |
| **No guarantees** | Never display words like "guaranteed," "sure profit," or predicted price targets. |
| **Regulation** | Add a note that crypto rules vary by country and users should check local regulations. Do not claim the platform is licensed. |
| **Privacy** | Collect only what the engine needs. Do not collect wallet keys or seed phrases. Never ask for them. |
| **Transparency** | Provide an "How we calculate this" panel showing the factors and weights used. |
| **Advisor accountability** | Every approved pick must have a rationale, a risk statement, and a "reconsider when" note. Block approval if any are empty. |
| **Visual design** | Dark fintech theme, one accent color, consistent spacing, large readable numbers. Colorblind-safe palette for categories. |
| **Accessibility** | Keyboard navigation, focus states, alt text, sufficient contrast, reduced-motion support. |

---

## 14. Demo Script (must work end to end, 3-4 minutes)

| Step | Action | Visible result |
|---|---|---|
| 1 | Open landing page | 3D hero and a clear tagline |
| 2 | Start onboarding as "new investor" | Journey through stations; scenario questions |
| 3 | Finish onboarding | Persona reveal (e.g., Balanced Builder) |
| 4 | Open Risk Galaxy | Matched coins glow inside the user's risk zone |
| 5 | View recommendation | Allocation chart, Match % with reasons, health scorecards |
| 6 | Run crash stress test | Worst-case drawdown shown with explanation |
| 7 | Switch to the advisor account | Pending review queue shows this client |
| 8 | Advisor edits one allocation, writes rationale, approves | Version saved |
| 9 | Switch back to the investor | "Reviewed by Advisor" badge and the advisor note |

Provide a one-click "Demo mode" that seeds both accounts and a sample client so this runs reliably on stage.

---

## 15. Definition of Done

| Check | Requirement |
|---|---|
| Functional | All "Must" features meet their acceptance criteria |
| Demo | Section 14 flow runs twice in a row with no console errors |
| Engine | Unit tests pass; each persona produces a distinct, sensible allocation; totals equal 100 |
| Data | Live data works, and fallback seed data works when the API is down |
| Performance | Landing page loads in under 4 seconds on a normal connection; 3D scene stays smooth |
| Responsive | Usable at 375px and 1440px widths (3D fallback on mobile) |
| Compliance | Disclaimers present everywhere listed in Section 13 |
| Docs | README with setup steps, env variables, demo credentials, and architecture notes |

---

## 16. Out of Scope (do not build)

- Real trading, custody, wallets, or payment processing
- Price predictions or "guaranteed" signals
- Personalized tax or legal advice
- Complex ML models (the weighted engine is intentional for explainability)

---

## 17. Pitch Line (for README and landing copy)

> "We turn crypto confusion into confidence: personalized, explainable, advisor-verified, and risk-first."
