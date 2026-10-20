# Design.md: Crypto Advisory 3D Platform (Design System and 3D Spec)

> **Instruction to the AI coding tool:** This file is the single source of truth for visual design. Read it fully before building any UI. It works together with `Plan.md` (which defines features, data, and logic). **Every component in this project must have visible depth (a 3D presentation).** No flat, unstyled elements are allowed. Use only the tokens defined here; do not invent colors, fonts, spacing, or motion values. If a component is not listed, build it by following the rules in Section 2 and Section 3.

---

## 1. Design Intent

| Item | Detail |
|---|---|
| **Feeling** | Calm, premium, trustworthy, futuristic. Crypto is confusing, so the design must feel clear and safe, not hype-driven. |
| **Visual theme** | "Deep-space fintech": dark navy void, soft glowing accents, glassy depth surfaces, floating objects. |
| **Metaphor** | The user travels through space to find coins that fit them. Coins are planets, the portfolio is a structure they build, the advisor is a "verified" layer on top. |
| **Core rule** | Depth communicates meaning: closer and brighter means more important or more relevant. Farther and dimmer means secondary. |
| **Anti-goals** | No neon overload, no casino or "to the moon" aesthetics, no flashing price tickers, no clutter, no motion that blocks reading. |

---

## 2. The 3D Rule: Every Component Gets Depth

### 2.1 Three rendering tiers

| Tier | Technology | Used for | Rule |
|---|---|---|---|
| **A. CSS 3D UI** | CSS `perspective`, `transform: translateZ / rotateX / rotateY`, layered shadows, `backdrop-filter` | Buttons, cards, inputs, nav, modals, tables, badges, tooltips, toasts | All text and form controls stay in the DOM (accessible). Depth is faked with transforms and lighting. |
| **B. WebGL scene** | React Three Fiber + drei + three | Hero, onboarding journey, Risk Galaxy, Portfolio Tower, 3D charts, persona avatars, gauges | Rendered inside lazy-loaded `<Canvas>`. Always paired with a text equivalent. |
| **C. Hybrid** | Canvas object plus drei `<Html>` overlay | Coin planets with labels, chart bars with values, tower segments with tooltips | 3D object carries the shape; DOM carries the text. |

### 2.2 Mandatory depth rules

| # | Rule |
|---|---|
| 1 | Every interactive component has at least 3 depth states: **rest**, **hover/focus** (lifts toward the viewer), **pressed/active** (pushes back). |
| 2 | Every card-like surface uses the elevation scale in Section 4.5 (never a bare flat rectangle). |
| 3 | Every page has a **3D background layer** (WebGL or parallax CSS layers) behind the content. |
| 4 | Every chart is presented as a 3D object (Section 7). A 2D version exists only as the fallback. |
| 5 | Every page transition and component entrance uses a 3D motion (fly-in on Z, rotate-in, or depth fade). See Section 6. |
| 6 | Text must never be rendered inside the WebGL canvas as the only source of information. Use DOM text (drei `<Html>` or overlays). |
| 7 | Never place body text on a surface that is mid-rotation or heavily tilted. Cap tilt at 8° on content cards and 12° on decorative cards. |
| 8 | Every 3D visual has a documented **fallback** (static 2D styled version) for low-power devices and `prefers-reduced-motion`. |

---

## 3. Global Scene and Lighting

### 3.1 Scene defaults (React Three Fiber)

| Setting | Value |
|---|---|
| Camera | Perspective, fov 45, position `[0, 0, 9]`, near 0.1, far 200 |
| Canvas | `dpr={[1, 1.75]}`, `gl={{ antialias: true, alpha: true }}`, transparent background (page color shows through) |
| Background | Starfield: 800 points (desktop), 250 (mobile), size 0.02-0.05, slow drift |
| Fog | `fog color=#070A14 near=12 far=40` for depth fade |
| Ambient light | intensity 0.35, color `#9AA7C7` |
| Key light | Directional, intensity 1.1, color `#CFE8FF`, position `[5, 6, 5]` |
| Rim light | Point, intensity 1.4, color `#3DDCFF`, position `[-6, 2, -4]` |
| Fill light | Point, intensity 0.6, color `#8B7CFF`, position `[4, -3, 3]` |
| Environment | drei `<Environment preset="city" />` at low intensity (0.3) for reflections, or a tiny custom HDR |
| Post-processing | Optional bloom only: threshold 0.85, intensity 0.5, radius 0.6. Disable on mobile and low-power. No other effects. |
| Shadows | Contact shadows (drei `<ContactShadows>`) only on the Portfolio Tower. Off elsewhere. |

### 3.2 Standard materials

| Material | three.js definition | Used for |
|---|---|---|
| `glassPanel` | `MeshPhysicalMaterial` transmission 0.9, roughness 0.15, thickness 0.5, ior 1.4, color `#1A2440` | Floating panels, rings |
| `coinMetal` | `MeshStandardMaterial` metalness 0.85, roughness 0.25, color from category | Coin planets |
| `glowEmissive` | `MeshBasicMaterial` with category color, `toneMapped={false}` | Match highlights |
| `matteSurface` | `MeshStandardMaterial` roughness 0.8, metalness 0.1, color `#121A2F` | Base platforms |
| `verifiedGold` | `MeshStandardMaterial` metalness 1, roughness 0.2, color `#F0B429`, emissive `#6b4a00` | Advisor Approved seal |

---

## 4. Design Tokens

Define these as CSS variables in `app/globals.css` and mirror them in `tailwind.config.ts`.

### 4.1 Color

| Token | Hex | Usage |
|---|---|---|
| `--bg-void` | `#070A14` | Page background |
| `--bg-deep` | `#0B1020` | Section background |
| `--surface` | `#121A2F` | Cards (rest) |
| `--surface-raised` | `#1A2440` | Cards (hover), modals |
| `--surface-glass` | `rgba(26,36,64,0.55)` | Glass panels (with blur) |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Dividers, card edges |
| `--border-glow` | `rgba(61,220,255,0.35)` | Focus and active edges |
| `--text-primary` | `#EAF0FF` | Main text (contrast 12:1 on void) |
| `--text-secondary` | `#9AA7C7` | Secondary text (contrast above 4.5:1) |
| `--text-muted` | `#6B7799` | Captions only, never for essential info |
| `--accent` | `#3DDCFF` | Primary actions, focus, highlights |
| `--accent-2` | `#8B7CFF` | Secondary accents, gradients |
| `--success` | `#35D399` | Positive, approved |
| `--warning` | `#FFB84D` | Cautions, risk notes |
| `--danger` | `#FF5C7A` | Errors, drawdown, high risk |
| `--gold` | `#F0B429` | Advisor Approved / verified |

### 4.2 Category colors (colorblind-safe; also differentiate by shape/icon, never by color alone)

| Category | Color | Planet detail |
|---|---|---|
| Store of value | `#F0B429` | Smooth sphere with a thin equatorial ring |
| Smart contract platform | `#56B4E9` | Sphere with a faceted/lattice overlay |
| DeFi | `#CC79A7` | Sphere with small orbiting satellites |
| Stablecoin | `#009E73` | Perfectly smooth, matte sphere (calm look) |
| Other | `#9AA7C7` | Plain sphere |

### 4.3 Persona colors

| Persona | Primary | Secondary | 3D avatar form |
|---|---|---|---|
| Cautious Saver | `#2DD4BF` | `#0F766E` | A shielded, rounded vault-sphere with a soft ring |
| Balanced Builder | `#3DDCFF` | `#8B7CFF` | A balanced gyroscope: three nested rings rotating gently |
| Growth Seeker | `#FF8A4C` | `#FF5C7A` | A faceted rocket-crystal with an upward trail |

### 4.4 Typography

| Role | Font | Size / weight | Notes |
|---|---|---|---|
| Display / H1 | Space Grotesk | 56px / 700 (desktop), 36px (mobile) | Letter-spacing -0.02em |
| H2 | Space Grotesk | 36px / 600 | |
| H3 | Space Grotesk | 24px / 600 | |
| Body | Inter | 16px / 400, line-height 1.6 | Max line length 70 characters |
| Small | Inter | 14px / 400 | |
| Caption | Inter | 12px / 500 | Uppercase tracking 0.06em for labels |
| Numbers / prices | JetBrains Mono | 16-48px / 500 | Use tabular numerals for all figures |

Text on 3D-tilted surfaces: add `text-shadow: 0 1px 2px rgba(0,0,0,0.5)` and use `-webkit-font-smoothing: antialiased`.

### 4.5 Elevation / depth scale (used on every surface)

| Level | `translateZ` | Shadow stack | Usage |
|---|---|---|---|
| `z0` | 0px | `0 1px 0 rgba(255,255,255,0.04) inset` | Page background, flat regions |
| `z1` | 8px | `0 6px 14px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06) inset` | Cards (rest), table rows |
| `z2` | 20px | `0 14px 30px rgba(0,0,0,0.45), 0 0 0 1px var(--border-subtle)` | Cards (hover), dropdowns |
| `z3` | 36px | `0 24px 50px rgba(0,0,0,0.55), 0 0 24px rgba(61,220,255,0.12)` | Modals, popovers, focused panels |
| `z4` | 56px | `0 34px 70px rgba(0,0,0,0.6), 0 0 40px rgba(61,220,255,0.2)` | Toasts, the Advisor Approved seal, hero elements |

### 4.6 Spacing, radius, layout

| Token | Values |
|---|---|
| Spacing scale (px) | 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| Radius | `--r-sm 8px`, `--r-md 14px`, `--r-lg 22px`, `--r-pill 999px` |
| Max content width | 1200px (content), 1440px (full-bleed scenes) |
| Grid | 12 columns, 24px gutter desktop, 16px mobile |
| Breakpoints | 375, 768, 1024, 1440 |

### 4.7 Motion tokens

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--dur-fast` | 150ms |
| `--dur-base` | 280ms |
| `--dur-slow` | 600ms |
| `--dur-scene` | 1200ms |
| Spring (framer-motion) | `{ type: "spring", stiffness: 220, damping: 22 }` |

---

## 5. Component Library: 3D Presentation for Every Component

Each component must implement the listed **3D presentation**, **states**, and **fallback**. Build each as a reusable component in `/components/ui` (CSS 3D tier) or `/components/three` (WebGL tier).

### 5.1 Base mechanics (build these first, reuse everywhere)

| Utility | Spec |
|---|---|
| `.scene-3d` | `perspective: 1200px; transform-style: preserve-3d;` on any parent holding 3D children |
| `<Tilt>` wrapper | Pointer-driven tilt. On mousemove, set `rotateX/rotateY` up to the cap from rule 7 (max 8° content, 12° decorative), smoothing with a spring. Adds a moving specular highlight (radial-gradient following the pointer). Resets on leave. Disabled on touch and reduced-motion. |
| `<DepthLayer z={n}>` | Applies `translateZ(n px)` plus the matching elevation shadow, for stacking children inside a card (e.g., title at z 24, badge at z 36, background at z 0) |
| `<GlassSurface>` | `background: var(--surface-glass); backdrop-filter: blur(14px) saturate(140%); border: 1px solid var(--border-subtle);` plus a 1px top-edge highlight gradient |
| `useLowPower()` | Returns true on low-end devices, `prefers-reduced-motion`, or battery saver. All 3D components read it to switch to the fallback. |

### 5.2 Core UI components (Tier A)

| Component | 3D presentation | States | Fallback |
|---|---|---|---|
| **Button (primary)** | Chunky extruded key: gradient `#3DDCFF → #8B7CFF`, 6px visible "side wall" (darker bottom edge via inset shadow), `z1` at rest | Hover: lifts to `z2`, glow, 2px up. Pressed: pushes down 4px, side wall shrinks (feels physically pressed). Focus: `--border-glow` ring. Disabled: flat, no glow | Flat gradient button, same colors |
| **Button (secondary)** | Glass key with 1px glow edge, `z1` | Same lift/press behavior, border brightens | Flat outlined button |
| **Button (ghost)** | Text with a subtle floor-shadow underline that appears on hover | Hover: text lifts 2px | Plain text button |
| **Card (generic)** | `GlassSurface` at `z1`, wrapped in `<Tilt>` (max 8°), inner content on `DepthLayer`s | Hover: `z2`, edge glow. Active: `z1` | Flat surface with shadow |
| **Input / Textarea** | Inset "engraved" field: inner shadow makes it look recessed, label floats above at z 12 | Focus: field rises slightly, glow ring, label lifts. Error: red edge glow plus a gentle shake (4px, 2 cycles) | Standard bordered input |
| **Select / Dropdown** | Trigger is a recessed field. The panel unfolds as a `z3` glass sheet that rotates in from `rotateX(-12deg)` | Option hover: row lifts to `z1` | Native-like dropdown |
| **Radio card (option tile)** | Selectable tile that looks like a physical slab. Selected state: the slab rises (`z3`), gets an accent edge and a tiny orbiting spark | Hover: `z2`. Selected: `z3` plus glow | Bordered tile with a check icon |
| **Checkbox / Toggle** | Toggle is a 3D switch: a spherical knob (radial-gradient shading) sliding in a recessed track; glow when on | On/off animates knob with spring | Flat toggle |
| **Slider** | Recessed track with a glowing filled portion; the thumb is a shaded sphere that lifts when dragged and casts a small shadow on the track | Drag: thumb scales 1.15, shadow tightens | Flat slider |
| **Tabs** | Tabs are segments of a raised bar. The active tab is a raised block (`z2`) with accent underline; the content panel slides in on Z | Hover: tab lifts 2px | Flat tabs with underline |
| **Navbar (top)** | Floating glass bar at `z2`, detached from the top edge by 12px, with a soft shadow beneath | Scroll: compresses and increases blur; nav items lift on hover | Sticky flat bar |
| **Sidebar (advisor)** | Vertical glass slab at `z2`. Active item is a protruding block with glow. Icons are small extruded glyphs | Hover: item slides forward 4px on Z | Flat sidebar |
| **Table / data rows** | Rows are thin floating strips (`z1`). Header is a raised strip (`z2`). Row hover lifts to `z2` and tilts 1° toward pointer | Selected row: accent edge, `z2` | Zebra table |
| **Modal / Dialog** | Appears from depth: scales 0.92 → 1 and translates Z from -80px → 0, at `z3`. Backdrop is a blurred, dimmed copy of the page that pushes back (scale 0.98) | Close: reverse | Fade and scale |
| **Tooltip / Learn card** | Small floating glass card at `z3`, anchored with a tiny pointer, rises 8px as it appears. Learn cards add a 3D "book corner" fold icon | Hover/focus trigger | Standard tooltip |
| **Badge (default)** | Embossed pill with a soft inner highlight at `z1` | Static | Flat pill |
| **Badge: Advisor Approved** | **Signature element.** A gold 3D seal (`verifiedGold` material) slowly rotating on Y, with a subtle sheen sweep. Use a small R3F canvas (96×96) or, on fallback, a CSS-gradient gold seal with a CSS rotateY loop | Hover: spins faster once, shows a tooltip with advisor name and date | Static gold seal image |
| **Badge: Pending Review** | Amber hourglass-shaped glass pill with a slow pulse | Static | Flat amber pill |
| **Progress stepper** | Stations as spheres connected by a rod. Completed spheres are glowing and slightly larger; the current sphere hovers (bobs ±4px); the rod fills with light | Step change: the rod animates, the new sphere lights up | Flat dots and line |
| **Toast / Notification** | Slides in from the top-right on Z (from -60px) at `z4`, with an accent edge by type (success/warning/danger) | Auto-dismiss 5s; hover pauses | Fade and slide |
| **Skeleton loader** | Dim glass slab with a diagonal shimmer sweep that also shifts slightly in depth | n/a | Flat shimmer |
| **Avatar** | Round coin-like disc with a bevel and a rim light | Hover: flips gently on Y (180° reveal of initials/role badge) | Flat circle |
| **Chat bubble** | Bubbles float at `z1`. User bubbles accent-tinted and tilt 2° toward the right; advisor bubbles neutral and tilt 2° toward the left; a small 3D "verified" mark on the advisor's | New message: pops in on Z with spring | Flat bubbles |
| **Disclaimer banner** | A slim glass strip at `z1` with an amber edge; never covers content; collapsible | Expand: unfolds downward | Flat banner |
| **Footer** | A wide dark slab with an inset top edge, links lift on hover | n/a | Flat footer |
| **Empty state** | A small floating 3D object (e.g., a lone wireframe planet) with text below | Idle bob animation | Static icon |

### 5.3 Domain components (Tier B and C)

| Component | 3D presentation | Interaction | Fallback |
|---|---|---|---|
| **Coin Planet** (used in galaxy and cards) | Sphere with `coinMetal`, details by category (Section 4.2). Radius = `0.3 + log10(marketCap/1e9) * 0.25`, clamped 0.3-1.6. Matched coins get a `glowEmissive` halo | Hover: scales 1.15, label shows. Click: opens the coin detail panel | Colored circle sized by market cap |
| **Coin Card** | Tier A card (`<Tilt>`) with a miniature rotating coin planet (R3F canvas 96×96 or a pre-rendered sprite sheet) in the corner. Price in mono font, change % in green/red with an arrow | Hover: planet spins faster | Card with a flat coin icon |
| **Match Card** | Coin Card plus a **Match % ring**: a 3D torus whose filled arc equals the percent, glowing in the accent color, number in the center (DOM). Reasons appear as stacked floating chips at increasing Z (z1, z2, z3) | Hover: chips fan out. Click: expands "Why this coin" | Flat progress ring and a list |
| **Persona Card** | Large panel with the 3D persona avatar (Section 4.3) floating above a glass base. Name and description in DOM | Pointer move: avatar turns toward the cursor (max 20°) | Flat illustration |
| **Risk Gauge** | 3D half-dial: a curved arc extruded from 1 to 10 with gradient (green → amber → red) and a needle with a glowing tip. The needle springs to the user's score | Drag-free (display only); hover shows the zone label | Flat SVG gauge |
| **Allocation visual** | See Portfolio Tower (Section 7.2) | See Section 7.2 | Flat donut |
| **Coin Health Scorecard** | 3D radar: a 5-axis extruded polygon (liquidity, stability, size, track record, category fit) floating above a grid plane; vertices are glowing spheres | Hover vertex: shows the value and a one-line meaning | Flat radar or bars |
| **Learn glossary chip** | Underlined term with a small floating "i" orb; click opens the Learn card | Hover: orb pulses | Dotted underline |
| **Client Card (advisor)** | Slim 3D card with the persona avatar thumbnail, risk score gauge (mini), status badge, and amount | Hover: lifts and tilts. Click: opens the client profile | Flat row |
| **Recommendation Card** | Wide `z2` card showing the allocation mini-tower on the left and rationale blocks on the right. Footer has the Advisor Approved seal or Pending badge | Hover: tower rotates slowly | Card with a flat donut |

---

## 6. Motion Spec

| Motion | Spec |
|---|---|
| **Page transition** | Outgoing page translates Z -120px and fades to 0 over `--dur-base`. Incoming page flies from Z +120px to 0 with `--ease-out`. The background scene stays persistent and only shifts camera slightly (parallax) |
| **Component entrance** | Staggered (60ms) fly-in on Z (-40px → 0) plus opacity 0 → 1, `--ease-out` |
| **Scroll parallax** | Background layers move at 0.2x, 0.4x, and 0.7x scroll speed (far to near). Floating decorative objects at 1.1x for foreground feel. Cap total parallax travel to 120px |
| **Idle motion** | Planets rotate 0.1-0.3 rad/s; floating objects bob ±4px at 0.4 Hz. Pause when the tab is hidden |
| **Pointer parallax** | Hero and background shift up to 24px opposite the pointer |
| **Camera moves** | Onboarding station changes: camera travels along a smooth path (`THREE.CatmullRomCurve3`) in `--dur-scene` with `--ease-out`. Never faster than 1.2s, never jerky |
| **Number counters** | Prices, amounts, and Match % count up over 700ms using ease-out |
| **Reduced motion** | When `prefers-reduced-motion: reduce`, disable tilt, parallax, idle motion, and camera travel. Keep opacity fades only. Show the fallback visuals |

---

## 7. 3D Charts (every chart is a 3D object)

| Chart | 3D version | Fallback | Data source |
|---|---|---|---|
| **7.1 Allocation** | See Portfolio Tower below | 2D donut | `Recommendation.allocation` |
| **7.2 Portfolio Tower** | Vertical stack of rounded segments. Height of each = its allocation percent. Color = category. Segments animate (spring) when sliders change. Base is a `matteSurface` platform with `ContactShadows`. Labels are DOM overlays attached via `<Html>` with leader lines. Hovering a segment pulls it out 0.3 units | Stacked bar or donut | Allocation |
| **7.3 Backtest line chart** | A ribbon (extruded thin strip) following portfolio value over time with depth equal to a width that scales with volatility. The camera sits at a slight angle (15°). A glowing marker rides the ribbon on hover with a DOM tooltip. Each coin can be shown as a parallel ribbon at different Z depths | 2D line chart (Recharts) | `/api/simulate` |
| **7.4 Stress test** | 3D bars (one per coin plus a total bar). Bar height = drawdown percent, colored red-to-amber. Bars **drop** from their pre-crash height to the post-crash height, animated over 1.4s, so the loss is felt. A translucent "floor line" marks the starting level | 2D bar chart | `/api/stress` |
| **7.5 Scorecard radar** | See Coin Health Scorecard (Section 5.3) | 2D radar or bars | `CoinScores` |
| **7.6 Risk zone ring** | Used in the Risk Galaxy: a translucent torus around the center with radius from the user's risk score | A ring overlay on a 2D scatter | `riskScore` |

All 3D charts must: show values as DOM text (not baked into textures), provide a data table below (collapsible) for accessibility, and expose axis meaning in a legend.

---

## 8. Page-by-Page Design

Each page lists its **3D background scene**, **layout**, and **key components**.

### 8.1 Landing page

| Region | Design |
|---|---|
| **Scene** | Full-viewport starfield with a large slowly rotating glass coin/orb at center-right, ringed by 5-8 small planets in category colors orbiting at different radii. Pointer parallax shifts layers |
| **Hero text** | Left column: H1 "From crypto confusion to confidence", subcopy (one sentence), primary button "Find my match", secondary "I'm an advisor". Text sits on a transparent area (no card needed) over the dimmed left side of the scene |
| **Trust strip** | Three glass cards (`z1`, Tilt) below the fold: "Matched to your risk", "Explained in plain words", "Verified by an advisor". Each has a small 3D icon (shield, lens, seal) |
| **How it works** | Horizontal 4-step path (Profile → Persona → Match → Advisor Approved). As the user scrolls, the camera flies along a path linking four floating stations |
| **Footer** | Disclaimer plus links |

### 8.2 Auth (login / signup)

| Region | Design |
|---|---|
| **Scene** | Dim starfield with a single large glass door/portal ring slowly rotating behind the form |
| **Form** | Centered `z3` glass card (max width 440px) with engraved inputs. Role selector as two Radio cards (Investor, Advisor) with their respective mini 3D icons. Submit is the primary button |
| **Feedback** | Errors shake the card 4px; success makes the portal ring brighten and the page fly forward |

### 8.3 Onboarding (3D guided journey)

| Region | Design |
|---|---|
| **Scene** | The camera moves through 5 stations in space: Goal, Amount, Horizon, Risk, Preferences. Each station is a distinct floating object: Goal = a compass orb, Amount = a stack of floating coins, Horizon = an hourglass-like ring, Risk = a dial, Preferences = a cluster of category planets |
| **Form overlay** | Right or center `z3` glass card showing one question at a time (Radio cards, Slider, Number input). The stepper (Section 5.2) sits at the top |
| **Scenario questions** | Presented as two or three large slabs the user "picks up" by clicking; the chosen slab rises while the others sink and dim |
| **Navigation** | Back (ghost) and Next (primary). Next is disabled until valid. Keyboard: Enter = next |
| **Completion** | Camera rushes forward, flash fades to the Persona reveal |
| **Disclaimer** | Banner at the top of the first station |

### 8.4 Persona reveal

| Region | Design |
|---|---|
| **Scene** | Darkened space, spotlight cone from above, the persona avatar assembling from particles at center (≤3s, skippable) |
| **Content** | Persona name (H1), description, Risk Gauge animating to the score, then a primary button "See my matches" |

### 8.5 Investor dashboard (recommendation)

| Region | Design |
|---|---|
| **Scene** | Calm background with a faint grid floor receding to the horizon; slow drifting dust |
| **Layout** | Top: status bar (Pending Review or Advisor Approved seal). Left (7 cols): Portfolio Tower with allocation labels. Right (5 cols): Match Cards list. Below: tabs (Why these picks, Risks, Entry plan, History) |
| **Key components** | Portfolio Tower, Match Cards, Risk Gauge, Recommendation Card, Learn chips, Disclaimer banner |
| **Advisor note** | A raised parchment-style glass panel at `z2` with the advisor's avatar and the verified mark |

### 8.5.1 Risk Galaxy page

| Region | Design |
|---|---|
| **Scene** | Full-bleed 3D space. The center is the user's "home" marker. The risk zone ring (Section 7.6) surrounds it. Coin planets orbit by risk distance. Matches glow; non-matches dim to 25% opacity |
| **Controls** | Orbit controls (limited polar angle), filter chips (category), a "Focus on my matches" toggle that moves the camera to frame them |
| **Detail panel** | Clicking a planet opens a side `z3` glass panel with the Coin Card, scorecard radar, reasons, and warnings |
| **Text equivalent** | A collapsible ranked table under the canvas |

### 8.6 Simulator and stress test

| Region | Design |
|---|---|
| **Scene** | Dark stage with a reflective floor |
| **Layout** | Left: control panel (Amount slider, window select, scenario select) as `z2` glass. Center: the 3D chart (ribbon or bars). Right/below: summary stats cards (return, max drawdown, best/worst month) |
| **Behavior** | Changing a control animates the chart (spring). The stress "Run test" button triggers the bar-drop animation with a subtle camera shake (≤4px, 300ms; skip on reduced motion) |
| **Disclaimer** | "Past performance does not predict future results" in a glass strip beneath the chart |

### 8.7 Learn page and cards

| Region | Design |
|---|---|
| **Scene** | Quiet starfield |
| **Layout** | Grid of glossary Cards. Each shows a small 3D icon for the concept (market cap = scale, liquidity = flowing water droplet, volatility = wave) |
| **Detail** | Opens a Learn card modal with a plain explanation (max 80 words) and an example |

### 8.8 Messages

| Region | Design |
|---|---|
| **Scene** | Minimal background |
| **Layout** | Thread list (left), conversation (right) with Chat bubbles. Recommendation context card pinned at the top of the thread |

### 8.9 Advisor dashboard

| Region | Design |
|---|---|
| **Scene** | A cooler, more "control room" variant: a darker void with a subtle holographic grid floor and slow data-particle streams |
| **Layout** | Left Sidebar. Top: 4 KPI cards (Clients, Pending reviews, Approved this month, Avg risk score) each with a 3D mini-visual (tower, hourglass, seal, gauge). Below: two panels, "Pending review queue" and "Allocation overview" (aggregate 3D tower) |

### 8.9.1 Advisor client list and profile

| Region | Design |
|---|---|
| **Client list** | Grid or table of Client Cards. Filters on persona and status |
| **Client profile** | Header with avatar, persona avatar, Risk Gauge. Tabs: Profile answers, Engine match, Recommendation history, Messages |

### 8.9.2 Advisor review/edit screen

| Region | Design |
|---|---|
| **Layout** | Left: the Portfolio Tower, which is **directly manipulable** (drag a segment edge or use sliders; the tower reshapes live; percents always total 100) |
| **Right** | Per-coin editor cards with fields: Rationale, Risk statement, Reconsider when (all required; empty fields glow amber and block approval). Entry plan selector (Lump sum or DCA with installments) |
| **Footer bar** | Floating `z4` action bar with "Save draft", "Reject", and primary "Approve and publish". On approve: the gold seal stamps down onto the card with a small impact ripple |
| **History** | A vertical timeline of versions as stacked translucent layers; hovering a layer lifts it out |

---

## 9. Responsive and Fallback Design

| Viewport / condition | Behavior |
|---|---|
| **Desktop ≥1024** | Full 3D scenes, tilt, parallax, bloom (if the device is capable) |
| **Tablet 768-1023** | Reduced particle counts, tilt disabled (touch), single-column dashboard |
| **Mobile 375-767** | Simplified scenes (no bloom, ≤250 stars, ≤12 planets visible), no tilt, buttons keep the pressed-depth effect, Risk Galaxy uses touch orbit with a "Tap a planet" hint and defaults to the ranked list view. Stepper becomes a compact bar |
| **Low power / reduced motion** | Tier B scenes replaced with the static 2D fallback listed per component. Tier A keeps shadows and elevation (static) but drops transforms and tilt |
| **WebGL unsupported** | Detect once; render the fallback everywhere with a small note in the footer |
| **Performance budget** | First meaningful paint under 2.5s. Total 3D assets under 2 MB (prefer procedural geometry over models). Max 150 draw calls per scene. Use instanced meshes for more than 30 planets. Target 60 fps desktop, 30 fps minimum mobile |

---

## 10. Accessibility Requirements

| Requirement | Detail |
|---|---|
| Contrast | Text 4.5:1 minimum, large text 3:1, against its actual surface |
| Keyboard | All controls reachable and operable; visible focus ring (`--border-glow`, 2px offset); 3D scenes expose controls as buttons |
| Screen readers | Each canvas has `role="img"` and an `aria-label` summarizing it, plus a linked text/table equivalent. Live regions announce match results and approval status |
| Color independence | Never rely on color alone; category = color + shape/icon; gains/losses = color + arrow + sign |
| Motion | Honor `prefers-reduced-motion`. Provide an in-app "Reduce motion" toggle that overrides |
| Touch targets | Minimum 44×44px |
| Flashing | No flashes above 3 per second |

---

## 11. Implementation Conventions

### 11.1 Files

| File | Purpose |
|---|---|
| `app/globals.css` | CSS variables (Section 4), `.scene-3d`, base styles |
| `tailwind.config.ts` | Extends colors, radius, shadows (`z1`-`z4`), fonts, animations from tokens |
| `components/ui/Tilt.tsx`, `DepthLayer.tsx`, `GlassSurface.tsx` | Base mechanics (Section 5.1) |
| `components/three/Scene.tsx` | Shared canvas wrapper: camera, lights, fog, starfield, `useLowPower` fallback switch |
| `components/three/materials.ts` | Standard materials (Section 3.2) |
| `components/three/*` | CoinPlanet, RiskGalaxy, PortfolioTower, RiskGauge3D, RadarScorecard3D, RibbonChart, StressBars, PersonaAvatar, AdvisorSeal, JourneyStation |
| `lib/design/tokens.ts` | The same tokens as typed constants for use inside three.js code |

### 11.2 Reference snippets

**Elevation utilities (CSS):**

```css
.scene-3d { perspective: 1200px; transform-style: preserve-3d; }
.elev-z1 { box-shadow: 0 6px 14px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset; transform: translateZ(8px); }
.elev-z2 { box-shadow: 0 14px 30px rgba(0,0,0,.45), 0 0 0 1px var(--border-subtle); transform: translateZ(20px); }
.elev-z3 { box-shadow: 0 24px 50px rgba(0,0,0,.55), 0 0 24px rgba(61,220,255,.12); transform: translateZ(36px); }
.elev-z4 { box-shadow: 0 34px 70px rgba(0,0,0,.6), 0 0 40px rgba(61,220,255,.2); transform: translateZ(56px); }

.btn-3d {
  background: linear-gradient(135deg, #3DDCFF, #8B7CFF);
  box-shadow: 0 6px 0 #2a4fa8, 0 14px 24px rgba(0,0,0,.45);
  transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.btn-3d:hover  { transform: translateY(-2px); box-shadow: 0 8px 0 #2a4fa8, 0 20px 30px rgba(61,220,255,.25); }
.btn-3d:active { transform: translateY(4px);  box-shadow: 0 2px 0 #2a4fa8, 0 6px 12px rgba(0,0,0,.4); }
```

**Tilt behavior (logic outline):**

```ts
// On pointermove over the card:
// x, y = pointer position normalized to -0.5..0.5
// rotateY = x * maxTilt   (maxTilt = 8 for content cards, 12 for decorative)
// rotateX = -y * maxTilt
// animate with a spring; set CSS vars --mx/--my for the specular radial-gradient highlight
// on pointerleave: spring back to 0
// skip entirely if useLowPower() or pointer is coarse (touch)
```

**Scene wrapper (structure):**

```tsx
<Canvas dpr={[1, 1.75]} camera={{ fov: 45, position: [0, 0, 9] }} gl={{ alpha: true, antialias: true }}>
  <fog attach="fog" args={['#070A14', 12, 40]} />
  <ambientLight intensity={0.35} color="#9AA7C7" />
  <directionalLight intensity={1.1} color="#CFE8FF" position={[5, 6, 5]} />
  <pointLight intensity={1.4} color="#3DDCFF" position={[-6, 2, -4]} />
  <pointLight intensity={0.6} color="#8B7CFF" position={[4, -3, 3]} />
  <Stars count={lowPower ? 250 : 800} />
  {children}
</Canvas>
```

### 11.3 Coding rules

| Rule | Detail |
|---|---|
| Single source of truth | Colors, spacing, durations come only from tokens. No hardcoded hex in components |
| Lazy loading | All canvases through `next/dynamic` with `ssr: false` and a skeleton |
| Cleanup | Dispose geometries, materials, and textures on unmount |
| Reuse | One shared `Scene` wrapper; one shared set of materials |
| Props | Every domain 3D component accepts `data` and `lowPower` and renders its own fallback |
| Testing | Visual check at 375, 768, 1440; test with reduced motion on; test with WebGL disabled |

---

## 12. Design Acceptance Checklist

| # | Check | Pass condition |
|---|---|---|
| 1 | Every component in Section 5 exists with rest, hover, and pressed depth states | Verified by visual review |
| 2 | Every page in Section 8 has a 3D background and entrance motion | Verified |
| 3 | Every chart is a 3D object with a text/table equivalent and a 2D fallback | Verified |
| 4 | No hardcoded colors or durations outside tokens | Lint or grep passes |
| 5 | Tilt capped at 8° (content) and 12° (decorative); no tilted body text issues | Verified |
| 6 | Reduced-motion and low-power modes show complete, usable fallbacks | Verified |
| 7 | WebGL-off mode renders the whole app usably | Verified |
| 8 | Contrast, keyboard, and screen-reader requirements met (Section 10) | Verified |
| 9 | Performance budget met (Section 9) | Lighthouse and FPS check |
| 10 | Advisor Approved seal appears correctly on approval, and the stamp animation plays once | Verified in the demo flow |
| 11 | Visual consistency: the same card, button, and spacing patterns across all pages | Verified |
| 12 | Disclaimers visible per `Plan.md` Section 13 and styled per the Disclaimer banner spec | Verified |
