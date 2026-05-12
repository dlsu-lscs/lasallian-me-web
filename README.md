
# lasallian-me-web

This project was bootstrapped with **create-lscs-next-app**.

---

## 1. 🚀 Development Setup

- Organized folder structure
- Prettier + ESLint (with Prettier rules)
- Placeholder feature folder structure (`[feature-name]`)
- Global styles moved into `src/styles/globals.css`

### Scripts

- `npm run dev` → Start dev server
- `npm run build` → Build production bundle
- `npm run start` → Run production build
- `npm run lint` → Run ESLint
- `npm run test` → Run Vitest

### 🧪 Testing Setup

This scaffold comes with **Vitest** (unit testing) and **Cypress** (end-to-end testing) pre-configured.

---

## 2. ⚡ Creating a New Feature

You can create a new feature module easily using the CLI command:

```bash
npx create-lscs-next-app feature <feature-name>
```

This will generate a new folder under `src/features/<feature-name>` with the following structure:

- components/
- containers/
- hooks/
- services/
- queries/
- types/
- data/
- README.md

The generated README explains the purpose of each folder.

---

## 3. 🛠️ Tech Stack (Recommended)

This scaffold does **not auto-install** feature libraries, so devs learn to set them up manually.  
Recommended libraries for future installs:

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI/Styling**: [Tailwind CSS](https://tailwindcss.com/) + (optional: [shadcn/ui](https://ui.shadcn.com/))
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **State Management**: [Zustand](https://zustand-bear.github.io/zustand/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Testing**: [Vitest](https://vitest.dev/) + [Cypress](https://www.cypress.io/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

---

## 4. 🏛️ Architecture

We employ a **Feature-Driven Architecture** in Next.js, organizing code by domain features for scalability and collaboration.  
Each feature starts from the `src/features/[feature-name]` template, which includes:

- components/
- containers/
- hooks/
- services/
- queries/
- types/
- data/

Inside features, we follow the **Container/Presentational pattern**.

### File Structure

```
src/
├── app/ # Next.js App Router
│ ├── layout.tsx
│ ├── page.tsx
│ └── providers.tsx
│
├── components/ # Global shared UI components
│
├── features/ # Domain-specific feature modules
│ ├── [feature-name]/ # Copy + rename this folder for new features
│ │ ├── components/
│ │ ├── containers/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── queries/
│ │ ├── types/
│ │ └── data/
│ └── shared/
│
├── lib/ # Utilities and global helpers
├── queries/ # Global TanStack Query configs
├── store/ # Zustand stores
├── providers/ # Global providers (Auth, Theme, Query, etc.)
├── config/ # Env, constants, query defaults
├── styles/ # Global & theme styles
├── types/ # Global TypeScript types
└── tests/ # Unit + E2E tests
```

---

## 5. 📝 Coding Standards

- Use **functional React components** with hooks.
- **Type everything** with TypeScript.
- **Zustand** for client state, **TanStack Query** for server data.
- Gracefully handle **loading & error states**.
- Use **Prettier** + **ESLint** for formatting and linting.
- Tests: **Vitest** for unit, **Cypress** for e2e.
- Comments: explain _why_, not _what_.

---

## 6. 🤝 Code Contribution Guide

### Branch Model

- `main` → production only
- `staging` → pre-release testing
- `dev` → integration branch

### Workflow

1. Create a branch: `feature/<issue-no-desc>`, `fix/<issue-no-desc>`
2. Commit using **Conventional Commits**:
   - `feat(auth): add JWT authentication`
   - `fix(api): correct null pointer`
3. Open a PR → target `dev` (or `main` for hotfix).
4. Get at least **1 approval** before merge.
5. Use **Squash and Merge** into `dev`.

### Commit Message Quick Reference

| Type     | Description            |
| -------- | ---------------------- |
| feat     | New feature            |
| fix      | Bug fix                |
| docs     | Documentation change   |
| style    | Code style (no logic)  |
| refactor | Refactor (no behavior) |
| test     | Add/update tests       |
| chore    | Maintenance            |

---

✅ Following this guide ensures our projects remain **scalable, maintainable, and collaborative**.

---

## 7. 🎨 Design System

pana uses a **Dark Liquid Glass** design language — dark-tinted frosted panels floating over a lush green backdrop. Every interactive surface is animated with **Motion spring physics** (via `motion/react`), making the UI feel physical and tactile.

### Guiding Principles

1. **Dark glass over light** — all panels use `bg-black/60` tint, not white-based glass. This keeps cards readable against the green background.
2. **Spring, not easing** — all hover and tap interactions use `type: 'spring'` via `motion/react`. CSS `transition-*` is only used for color/opacity changes.
3. **Green as life** — `green-600` anchors the palette; it evokes LSCS's identity and organic warmth.
4. **Type that breathes** — generous spacing, unhurried reading rhythm.

---

### Typography

| Role | Font | Usage |
|------|------|-------|
| Display / Headings | [Sora](https://fonts.google.com/specimen/Sora) | `h1`–`h3`, hero text, labels |
| Body | [DM Sans](https://fonts.google.com/specimen/DM+Sans) | `p`, UI text, descriptions |
| Monospace | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Code blocks, tags |

**Loading in `layout.tsx` (Next.js):**

```tsx
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});
```

**Scale:**

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-display` | 3rem (48px) | 1.1 | 700 | Hero headings |
| `text-heading` | 1.875rem (30px) | 1.2 | 600 | Section titles |
| `text-title` | 1.25rem (20px) | 1.3 | 600 | Card headings |
| `text-body` | 1rem (16px) | 1.6 | 400 | Paragraphs |
| `text-small` | 0.875rem (14px) | 1.5 | 400 | Captions, metadata |
| `text-micro` | 0.75rem (12px) | 1.4 | 500 | Tags, labels, badges |

---

### Color Palette

#### Primary — Green

Green-600 is the primary action color. It anchors interactive elements without competing with glass surfaces.

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `--color-primary-50` | `#f0fdf4` | `green-50` | Tinted backgrounds |
| `--color-primary-100` | `#dcfce7` | `green-100` | Hover states on light |
| `--color-primary-300` | `#86efac` | `green-300` | Borders, glass tints |
| `--color-primary-400` | `#4ade80` | `green-400` | Highlights, icons |
| `--color-primary-500` | `#22c55e` | `green-500` | Hover state |
| `--color-primary` | `#16a34a` | `green-600` | **Primary** — buttons, links, focus rings |
| `--color-primary-700` | `#15803d` | `green-700` | Active/pressed state |
| `--color-primary-900` | `#14532d` | `green-900` | Dark text on light |

#### Neutrals — Slate

Slate pairs cleanly with green and reads as modern without being cold.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-surface` | `#f8fafc` | Page background (light) |
| `--color-surface-dark` | `#0c1117` | Page background (dark) |
| `--color-neutral-50` | `#f8fafc` | Lightest surface |
| `--color-neutral-200` | `#e2e8f0` | Subtle dividers |
| `--color-neutral-400` | `#94a3b8` | Placeholder text |
| `--color-neutral-600` | `#475569` | Secondary text |
| `--color-neutral-800` | `#1e293b` | Primary text (light mode) |
| `--color-neutral-950` | `#020617` | Primary text (dark mode base) |

#### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#16a34a` | Same as primary |
| `--color-warning` | `#d97706` | Amber-600 |
| `--color-error` | `#dc2626` | Red-600 |
| `--color-info` | `#0284c7` | Sky-600 |

---

### Glass Surface Recipe

All floating surfaces share a single dark-glass recipe applied directly via Tailwind utilities — there are no `.glass-*` utility classes in use:

```tsx
// Standard panel / card surface
className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-xl"

// With inner shadow (profile card — gives a pressed/inset depth)
className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass-inset)] rounded-xl"
```

**Text scale on dark glass:**

| Usage | Token |
|-------|-------|
| Headings / primary text | `text-white` / `text-white/90` |
| Body text | `text-white/80` |
| Secondary / descriptions | `text-white/60` |
| Meta / email / subtitles | `text-white/45` |
| Section labels (uppercase) | `text-white/40` |
| Muted / disabled | `text-white/25` – `text-white/30` |

#### CSS Variables (`globals.css`)

```css
@theme {
  --font-display: var(--font-sora), 'Sora', sans-serif;
  --font-body:    var(--font-dm-sans), 'DM Sans', sans-serif;
  --font-mono:    var(--font-jetbrains-mono), 'JetBrains Mono', monospace;

  --color-primary-50:  #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;
  --color-primary:     #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;
}
```

---

### Border Radius

Liquid glass demands generously rounded corners. Never use sharp (0px) edges on floating surfaces.

| Token | Value | Component |
|-------|-------|-----------|
| `rounded-sm` | 8px | Chips, inline badges |
| `rounded-md` | 12px | Inputs, small buttons |
| `rounded-lg` | 16px | Image thumbnails inside cards |
| `rounded-xl` | 24px | **Cards, filter bar, dropdowns** |
| `rounded-2xl` | 32px | Modals, sheets, navbar |
| `rounded-full` | 9999px | Pill buttons, avatars, tags |

---

### Shadow Tokens

All shadows are heavier than typical UI systems — this is intentional. The dark glass panels need clear lift against the green background.

```css
/* Panels, filter bar, favorites, profile card */
--shadow-glass:       0 8px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.16);

/* Profile card variant — adds inset depth (pressed/etched feel) */
--shadow-glass-inset: 0 8px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.16),
                      inset 0 2px 16px rgba(0, 0, 0, 0.35),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.04);

/* App cards — elevated above panels */
--shadow-lifted:      0 16px 48px rgba(0, 0, 0, 0.42), 0 4px 16px rgba(0, 0, 0, 0.22);

/* Modals, dropdowns — topmost layer */
--shadow-modal:       0 24px 80px rgba(0, 0, 0, 0.52), 0 8px 24px rgba(0, 0, 0, 0.28);

/* Primary glow — green accent */
--shadow-glow:        0 0 28px rgba(22, 163, 74, 0.30), 0 0 10px rgba(22, 163, 74, 0.16);

/* Focus ring */
--shadow-focus:       0 0 0 3px rgba(134, 239, 172, 0.35);
```

---

### Component Recipes

#### Navbar

Full-width sticky dark glass bar, `h-11` (44px). Wordmark uses `font-display`, search uses a pill input with `bg-white/[0.06]`. Profile avatar opens a `rounded-xl` dropdown with `bg-black/70`.

```tsx
<header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-lg border-b border-white/10">
  <nav className="flex items-center justify-between h-11 gap-4 max-w-7xl mx-auto px-5 sm:px-8">
    {/* wordmark */}
    <Link className="font-display font-bold text-lg text-white/90 tracking-tight">
      pana<span className="text-primary-600 font-normal">.tools</span>
    </Link>
    {/* search pill */}
    <div className="bg-white/[0.06] border border-white/10 rounded-full px-3 h-7 focus-within:border-white/25">
      <input className="bg-transparent text-xs text-white/80 placeholder:text-white/30" />
    </div>
  </nav>
</header>
```

#### App Card

`motion.div` with spring lift on hover. `rounded-md` (not `rounded-xl`) keeps cards compact in the grid.

```tsx
<motion.div
  className="bg-black/60 backdrop-blur-lg shadow-[var(--shadow-lifted)] rounded-md overflow-hidden h-full flex flex-col cursor-pointer"
  whileHover={{ y: -4, scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
  {/* h-44 preview image, edge-to-edge */}
  {/* p-3 info row: title + stats left, Save pill button right */}
</motion.div>
```

#### Filter Panel

Glass panel with pill-shaped tag filter buttons. Each tag is a `motion.button` with spring scale.

```tsx
<div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-xl px-5 py-4">
  <div className="flex items-start gap-3">
    <div className="shrink-0">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Filter</p>
      <p className="text-xs text-white/25">by tag</p>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <motion.button
        className="px-3 py-1 rounded-full text-xs font-medium bg-white text-black" /* active */
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      />
    </div>
  </div>
</div>
```

#### Profile Panel

Responsive glass card with Motion spring, decorative SVG overlay, and two-initial avatar fallback.

```tsx
<motion.div
  className="
    relative overflow-hidden bg-black/60 backdrop-blur-lg border border-white/10
    shadow-[var(--shadow-glass-inset)] rounded-xl shrink-0
    flex flex-row items-center gap-4 px-5 py-4          /* mobile: horizontal */
    lg:flex-col lg:items-start lg:justify-between lg:w-80 lg:min-h-72 lg:px-8 lg:py-7
  "
  whileHover={{ y: -4, scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
  {/* Decorative overlay: /public/bow-arrow.svg, opacity-[0.04], brightness(0) invert(1) */}
  {/* Avatar: rounded-xl on mobile, rounded-full lg */}
  {/* Name (text-base / lg:text-2xl), email (text-white/45), "Lasallian" label */}
  {/* Mobile: FiChevronRight hint on the right */}
</motion.div>
```

#### Favorites Panel

Full-height glass panel with a three-dot `FiMoreHorizontal` menu. In **delete mode**, icons enter an iPhone-style jiggle loop and show a red `-` badge.

```tsx
<div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-xl flex-1 flex flex-col">
  {/* Header: "FAVORITES" label left, three-dot button right (always rendered, invisible when empty) */}
  {/* Dropdown: motion.div spring pop-in, bg-black/40 backdrop-blur-xl rounded-lg */}

  {/* Icon grid: flex flex-wrap justify-center, icon size scales with count */}
  <motion.div
    animate={isDeleteMode ? { rotate: [-2, 2] } : { rotate: 0 }}
    transition={isDeleteMode
      ? { repeat: Infinity, repeatType: 'mirror', duration: 0.15, delay: index * 0.03 }
      : { type: 'spring', stiffness: 300, damping: 20 }}
    whileHover={isDeleteMode ? {} : { scale: 1.05 }}
    whileTap={isDeleteMode ? {} : { scale: 0.95 }}
  >
    {/* rounded-xl icon, title label below */}
    {/* Delete mode: motion.button badge, -top-1.5 -right-1.5, bg-red-500, FiMinus */}
  </motion.div>
</div>
```

**Icon size scaling** (adapts to count so there's minimal dead space):

| Favorites count | Icon size | Gap |
|----------------|-----------|-----|
| ≤ 2 | `w-28 h-28` | `gap-8` |
| ≤ 4 | `w-24 h-24` | `gap-7` |
| ≤ 8 | `w-20 h-20` | `gap-6` |
| 9+ | `w-16 h-16` | `gap-x-5 gap-y-4` |

#### Dropdown Menu

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9, y: -4 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: -4 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className="absolute right-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-[var(--shadow-modal)] overflow-hidden min-w-28"
>
  <button className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/8 font-medium" />
</motion.div>
```

---

### Motion

All interactive animations use **`motion/react`** (Motion for React) spring physics — not CSS `transition` or `animation`. CSS transitions are only used for color/opacity changes (`transition-colors`).

**Standard spring presets:**

| Preset | Config | Used on |
|--------|--------|---------|
| Card lift | `stiffness: 300, damping: 20` | AppCard, ProfileCard |
| Badge bounce | `stiffness: 400, damping: 20` | Filter tags, small buttons |
| Dropdown pop | `stiffness: 400, damping: 25` | Menus, tooltips |
| Badge enter | `stiffness: 500, damping: 25` | Delete-mode `-` badge |

**Hover / tap pattern (applied to all interactive surfaces):**

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.01 }}   // cards: lift + scale
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
/>

<motion.button
  whileHover={{ scale: 1.08 }}           // small buttons: scale only
  whileTap={{ scale: 0.94 }}
  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
/>
```

**Jiggle / delete mode (iOS-style icon shake):**

```tsx
<motion.div
  animate={isDeleteMode ? { rotate: [-2, 2] } : { rotate: 0 }}
  transition={isDeleteMode
    ? { repeat: Infinity, repeatType: 'mirror', duration: 0.15, delay: index * 0.03 }
    : { type: 'spring', stiffness: 300, damping: 20 }}
/>
// delay: (index % 5) * 0.03 staggers icons so they don't all move in lockstep
```

**Presence animations (mount/unmount):**

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    />
  )}
</AnimatePresence>
```

---

### Background Treatments

The page uses `public/bg.png` — a fixed wavy green-dominant pattern — as the page backdrop. `background-attachment: fixed` keeps it still while content scrolls, giving glass panels the parallax illusion of sliding over a physical surface.

```css
body {
  background-color: #0d5c35; /* fallback if image hasn't loaded */
  background-image: url('/bg.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

The dark-based `glass-md` / `glass-lg` cards appear as deep tinted panels floating over the green waves. The light `glass-xl` navbar floats above everything, creating a clear three-layer depth stack: **bg → cards → navbar**.

---

### Accessibility Checklist

- All text on glass surfaces must meet **WCAG AA** contrast (4.5:1 for body, 3:1 for large text).
- Focus rings use `ring-primary/40` — always visible, never relying on outline alone.
- `backdrop-filter` degrades gracefully — use `@supports` guards if targeting older browsers.
- Animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### Design System Quick Reference

```
Primary color:    #16a34a (green-600)
Font – Display:   Sora        → font-display, headings, wordmark, buttons
Font – Body:      DM Sans     → font-body, UI text
Font – Mono:      JetBrains   → font-mono, code

Glass recipe:     bg-black/60 backdrop-blur-lg border border-white/10
Glass inset:      + shadow-[var(--shadow-glass-inset)]

Shadows:          --shadow-glass / --shadow-glass-inset / --shadow-lifted / --shadow-modal / --shadow-glow
Border radius:    rounded-md (cards) / rounded-xl (panels) / rounded-full (pills, avatars)
Text on glass:    white/90 → white/80 → white/60 → white/45 → white/40 → white/25

Animation lib:    motion/react (spring physics — no CSS keyframes for interactions)
Spring presets:   stiffness 300 / damping 20  (cards, panels)
                  stiffness 400 / damping 20  (small buttons, tags)
                  stiffness 400 / damping 25  (dropdowns, menus)
```

### NOTE
This design system section reflects the actual implementation as of the `feat/design-revamp` branch.