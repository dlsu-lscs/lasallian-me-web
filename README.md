
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

pana uses a **Liquid Glass** design language — a modern, translucent aesthetic built on blur, soft edges, and layered depth. The system is intentionally tactile: surfaces feel like frosted glass resting on a lush green world.

### Guiding Principles

1. **Depth over flatness** — layers feel physical; foreground elements float over background.
2. **Softness with intent** — blur and transparency are purposeful, not decorative noise.
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

### Glass System

The glass system is the visual core of pana. Every surface that floats — cards, modals, navbars, dropdowns — uses one of these glass tiers.

#### Glass Tiers

The system uses a **split light/dark strategy**: cards and panels are dark-based (deep green-black tint) so they read as solid, weighty surfaces against the bg. The navbar stays light-based to create visual hierarchy.

```css
/* Light glass — navbar login pill, small chips */
.glass-sm:  rgba(255, 255, 255, 0.62)   blur: 12px

/* Dark glass — cards, filter bar, panels */
.glass-md:  rgba(5, 22, 12, 0.72)       blur: 22px   ← primary card tier

/* Dark glass — modals, drawers */
.glass-lg:  rgba(5, 22, 12, 0.65)       blur: 28px

/* Light glass — navbar (stays lighter to contrast with dark cards) */
.glass-xl:  rgba(255, 255, 255, 0.28)   blur: 48px

/* Green-tinted glass — primary action pill */
.glass-primary:  rgba(22, 163, 74, 0.12)  blur: 16px
```

**Text on dark glass** (`glass-md`, `glass-lg`) uses white-scale:
- Titles: `text-white/90`
- Body: `text-white/60`
- Meta / secondary: `text-white/45`
- Muted / disabled: `text-white/35`

**Text on light glass** (`glass-sm`, `glass-xl`) uses neutral-scale:
- Primary: `text-neutral-800`
- Secondary: `text-neutral-600`
- Muted: `text-neutral-400`

#### Glass Border

Glass surfaces always carry a luminous 1px border on all sides, with a brighter top edge simulating a light source above:

```css
/* Standard glass border */
border: 1px solid rgba(255, 255, 255, 0.25);

/* Primary glass border */
border: 1px solid rgba(22, 163, 74, 0.25);

/* Inner highlight using box-shadow instead of border-top */
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.45),  /* top highlight */
  0 8px 32px rgba(0, 0, 0, 0.08),            /* ambient shadow */
  0 2px 8px rgba(0, 0, 0, 0.06);             /* close shadow */
```

#### Tailwind v4 Implementation

Define these in `globals.css` under `@theme` so Tailwind can generate utilities:

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-display: var(--font-sora), 'Sora', sans-serif;
  --font-body:    var(--font-dm-sans), 'DM Sans', sans-serif;
  --font-mono:    var(--font-jetbrains-mono), 'JetBrains Mono', monospace;

  /* Primary palette */
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

  /* Radius */
  --radius-sm:  0.5rem;   /* 8px  — chips, badges */
  --radius-md:  0.75rem;  /* 12px — inputs, small cards */
  --radius-lg:  1rem;     /* 16px — cards */
  --radius-xl:  1.5rem;   /* 24px — large cards */
  --radius-2xl: 2rem;     /* 32px — modals, panels */
  --radius-pill: 9999px;  /* buttons, tags */

  /* Blur */
  --blur-glass-sm: 8px;
  --blur-glass-md: 16px;
  --blur-glass-lg: 24px;
  --blur-glass-xl: 40px;

  /* Animation easings */
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-sharp:   cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass utility classes */
@layer utilities {
  .glass-sm {
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(0, 0, 0, 0.06);
  }

  .glass-md {
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 8px 32px rgba(0, 0, 0, 0.08);
  }

  .glass-lg {
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 16px 48px rgba(0, 0, 0, 0.1);
  }

  .glass-xl {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 24px 64px rgba(0, 0, 0, 0.12);
  }

  .glass-primary {
    background: rgba(22, 163, 74, 0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(22, 163, 74, 0.22);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 32px rgba(22, 163, 74, 0.08);
  }

  /* Dark mode glass overrides */
  .dark .glass-sm  { background: rgba(15, 23, 42, 0.55); border-color: rgba(255, 255, 255, 0.08); }
  .dark .glass-md  { background: rgba(15, 23, 42, 0.50); border-color: rgba(255, 255, 255, 0.07); }
  .dark .glass-lg  { background: rgba(15, 23, 42, 0.45); border-color: rgba(255, 255, 255, 0.06); }
  .dark .glass-xl  { background: rgba(15, 23, 42, 0.40); border-color: rgba(255, 255, 255, 0.05); }
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

### Shadow & Glow

Shadows in the glass system are diffuse and optionally color-tinted. Hard shadows are avoided.

```css
/* Ambient — base floating surface */
--shadow-glass:    0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);

/* Lifted — hovered or active card */
--shadow-lifted:   0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);

/* Modal — layered above page */
--shadow-modal:    0 24px 80px rgba(0, 0, 0, 0.16), 0 8px 24px rgba(0, 0, 0, 0.08);

/* Primary glow — green highlight */
--shadow-glow:     0 0 24px rgba(22, 163, 74, 0.20), 0 0 8px rgba(22, 163, 74, 0.12);

/* Focus ring */
--shadow-focus:    0 0 0 3px rgba(22, 163, 74, 0.30);
```

---

### Component Recipes

#### Button — Primary

```tsx
// className breakdown:
// glass-primary     → green-tinted frosted glass
// rounded-pill      → full pill shape
// px-6 py-2.5      → comfortable padding
// font-display      → Sora for all buttons
// text-primary-700  → readable green text
// hover:shadow-glow → green glow on hover
// transition-all    → smooth all properties

<button className="
  glass-primary
  rounded-full
  px-6 py-2.5
  font-display text-sm font-semibold text-primary-700
  hover:bg-primary/15 hover:shadow-[var(--shadow-glow)]
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
  active:scale-[0.97]
  transition-all duration-200
">
  Get Started
</button>
```

#### Card

```tsx
<div className="
  glass-md
  rounded-2xl
  p-6
  hover:shadow-[var(--shadow-lifted)] hover:-translate-y-0.5
  transition-all duration-300 ease-[var(--ease-smooth)]
">
  {children}
</div>
```

#### Input

```tsx
<input className="
  w-full
  glass-sm
  rounded-xl
  px-4 py-2.5
  font-body text-sm text-neutral-800
  placeholder:text-neutral-400
  focus:outline-none focus:ring-2 focus:ring-primary/30
  focus:border-primary/40
  transition-all duration-200
" />
```

#### Navbar

```tsx
<nav className="
  glass-xl
  sticky top-0 z-50
  px-6 py-4
  rounded-none  /* full-width, flush */
  border-x-0 border-t-0  /* only bottom border */
  border-b border-white/15
">
```

#### Modal / Sheet

```tsx
<div className="
  glass-lg
  rounded-3xl
  p-8
  shadow-[var(--shadow-modal)]
  max-w-lg w-full
">
```

#### Badge / Tag

```tsx
<span className="
  glass-sm
  rounded-full
  px-3 py-1
  font-display text-micro font-medium text-primary-700
  tracking-wide uppercase
">
  Tag
</span>
```

---

### Motion

Animations should feel **fluid and physical** — not snappy or mechanical.

| Name | Curve | Duration | Use |
|------|-------|----------|-----|
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 400ms | Entrance, scale-up, hover lift |
| `smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | 300ms | Fade, slide, color transitions |
| `sharp` | `cubic-bezier(0.4, 0, 0.2, 1)` | 200ms | State changes (active/pressed) |

**Staggered entrance (page load):**

```css
/* Each child staggers by 60ms */
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 60ms; }
.stagger-3 { animation-delay: 120ms; }
.stagger-4 { animation-delay: 180ms; }

@keyframes glass-enter {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.animate-glass-enter {
  animation: glass-enter 500ms var(--ease-smooth) both;
}
```

**Micro-interactions:**
- Buttons: `active:scale-[0.97]` — subtle press
- Cards on hover: `hover:-translate-y-0.5 hover:shadow-lifted`
- Glass surfaces gaining focus: ring fades in with `transition-shadow`

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
Primary color:   #16a34a (green-600)
Font – Display:  Sora
Font – Body:     DM Sans
Font – Mono:     JetBrains Mono

Glass tiers:     .glass-sm / .glass-md / .glass-lg / .glass-xl / .glass-primary
Radius:          8px / 12px / 16px / 24px / 32px / pill
Shadows:         --shadow-glass / --shadow-lifted / --shadow-modal / --shadow-glow
Easing:          --ease-spring / --ease-smooth / --ease-sharp
```

### NOTE
This design system clause was generated by Claude, and will be used for mastering the frontend.