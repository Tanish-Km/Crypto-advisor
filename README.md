# CryptoCompass (3D Crypto Advisory Platform)

> **"We turn crypto confusion into confidence: personalized, explainable, advisor-verified, and risk-first."**

CryptoCompass is a risk-matched, explainable crypto guidance platform designed specifically for beginners, with a certified human advisor in the loop.

---

## Key Highlights

- **3D Deep-Space Fintech Aesthetics**: Built strictly according to [Design.md](file:///home/tanz/Projects/Crypto/Design.md) and [Plan.md](file:///home/tanz/Projects/Crypto/Plan.md).
- **Physical Depth UI**: Every button, card, input, and modal has visible elevation (`z1` to `z4`), pointer-driven physics `<Tilt>`, and specular lighting.
- **3D Risk Galaxy**: Full-bleed WebGL universe where planetary orbits reflect coin volatility and the user's risk zone glows as a translucent ring.
- **3D Portfolio Tower**: Kinetic vertical architecture representing portfolio weight distributions with real-time interactive segments.
- **Explainable Matching Engine**: 5-factor deterministic scoring (Liquidity, Stability, Size, Track Record, Category Fit) with plain-language reasons and objective risk statements. No black-box ML.
- **Human Advisor Accountability**: Certified human advisor (Elena Rostova, CFA) audits, edits, and stamps allocations with the signature 3D Gold Advisor Approved Seal.
- **Simulator & Crash Stress Test**: Historical backtest simulations and peak-to-trough crash scenarios (2018 Crypto Winter, 2022 Liquidity Contraction, and Custom Shocks) with 3D drop bars.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router) + TypeScript
- **3D Layer**: React Three Fiber (`@react-three/fiber`), `@react-three/drei`, `three`
- **UI & Animation**: Tailwind CSS, Framer Motion, Lucide Icons, CSS 3D Elevation
- **Data & Testing**: CoinGecko API client with local seed fallback, Vitest unit test suite
- **State & Store**: Zustand with complete persistent Demo Mode state management

---

## Stage Demo Flow (3-4 Minutes)

1. **Landing Page (`/`)**: 3D hero cosmos with orbiting category planets. Click **"Launch Investor Demo"** or **"Find My Match"**.
2. **3D Guided Onboarding (`/onboarding`)**: Journey through 5 procedural space stations:
   - Station 1: Goal
   - Station 2: Capital Budget
   - Station 3: Time Horizon & Income Stability
   - Station 4: Scenario Slabs (loss reaction & liquidity toggle)
   - Station 5: Preferred Sectors
3. **Persona Reveal**: Watch the kinetic 3D Gyroscope Avatar and animated Risk Gauge dial spring to the calculated persona (e.g. Balanced Builder).
4. **Investor Dashboard (`/dashboard`)**:
   - Inspect the 3D Portfolio Tower and Matched Asset Cards.
   - Open the **Coin Health Scorecard** modal for a 5-axis 3D radar polygon.
5. **3D Risk Galaxy (`/dashboard/galaxy`)**: Rotate through the 3D cosmos, filter by sector, and ask the AI Explainer why a specific coin fits your risk profile.
6. **Crash Stress Test (`/dashboard/simulator`)**: Run the historical backtest and trigger the worst-case crash test to observe the 3D drop bars in action.
7. **Switch to Advisor (`/advisor`)**:
   - Click **"Advisor"** in the top navbar.
   - See the client in the review queue and open `/advisor/reviews`.
   - Adjust coin weight sliders, verify 100% total balance, and click **"Approve & Publish"**.
   - Watch the 3D Gold Seal stamp with impact ripple!
8. **Switch Back to Investor (`/dashboard`)**:
   - The recommendation badge is now transformed into **"Advisor Approved"** with Elena Rostova's verified note.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Engine Unit Tests
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts

| Role | Account Name | Email | Purpose |
|---|---|---|---|
| **Investor** | Alex Rivera | `investor@cryptocompass.demo` | Complete onboarding, explore Risk Galaxy, run stress tests |
| **Advisor** | Elena Rostova, CFA | `advisor@cryptocompass.demo` | Audit client queue, adjust weights, stamp verified seal |

*Use the 1-click switcher pill in the top-right navbar to toggle roles instantly on stage.*

---

## Disclaimers & Regulatory Notice

*Educational information only, not financial advice. Cryptocurrency is volatile and you can lose money. Regulations vary by jurisdiction; check local laws before holding digital assets.*
