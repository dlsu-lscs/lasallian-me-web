# Component Documentation

This document covers every component in the `lasallian-me-web` frontend — how they're built, how they're used, and how to extend or create new ones.

---

## Architecture Overview

Components are split across two layers:

**Shared layer** (`src/components/`) — reusable, domain-agnostic UI primitives organized by complexity:

```
src/components/
├── atoms/       # Smallest, self-contained UI elements
├── molecules/   # Composed from atoms; still generic
└── organisms/   # Layout-level components with their own logic/state
```

**Feature layer** (`src/features/<feature>/`) — domain-specific, collocated with the logic that drives them:

```
src/features/<feature>/
├── components/  # Presentational; receive props only, no hooks or side-effects
└── containers/  # Smart; own hooks, mutations, and local state
```

**The rule**: if a component could exist in a different app unchanged, it belongs in `src/components/`. If it's specific to one domain (apps, ratings, admin…), it belongs in `src/features/`.

---

## Design System

All components share the same dark glass-morphism visual language.

### Colors & Opacity

| Token | Usage |
|---|---|
| `text-white` / `text-white/90` | Primary text |
| `text-white/60` | Secondary text, labels |
| `text-white/40` | Tertiary text, placeholders |
| `text-white/20` | Disabled / decorative |
| `bg-black/40–80` | Surface backgrounds |
| `border-white/10` | Default borders |
| `border-white/20` | Focused/elevated borders |

### Surfaces

```
glass-md  →  backdrop-blur-lg + bg-black/60 + border-white/10
```

Components use `bg-black/40`, `bg-black/70`, `bg-black/80` with `backdrop-blur-*` for depth. Borders use `border-white/10` to separate surfaces.

### Shadows

CSS variables set in `globals.css`:

- `--shadow-glass` — card-level shadow
- `--shadow-lifted` — hover state
- `--shadow-modal` — modals and dropdowns

### Animation

All motion uses **Framer Motion** (`motion/react`). Standard spring config:

```ts
{ type: 'spring', stiffness: 300, damping: 20 }
```

Use `AnimatePresence` for components that mount/unmount conditionally so exit animations fire.

### Typography

Three font families loaded at root:

| Variable | Family | Use |
|---|---|---|
| `font-sans` | DM Sans | Body copy |
| `font-display` | Sora | Headings, wordmarks |
| `font-mono` | JetBrains Mono | Code, slugs |

### Responsive Breakpoints

Mobile-first. Key breakpoints: `md:` (768px), `lg:` (1024px). The pattern for responsive layout is hiding/showing at `sm:` (640px):

- Mobile: stacked, tabs at top
- Desktop: side-by-side split or sidebar

---

## Atoms

Smallest building blocks. Accept all standard HTML attributes via spread and add minimal opinionated styling.

---

### `Button`

**File:** [src/components/atoms/Button.tsx](src/components/atoms/Button.tsx)

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

| Variant | Appearance |
|---|---|
| `primary` | White fill, black text — the main call-to-action |
| `secondary` | Translucent white fill + border |
| `outline` | Border only, white text |
| `ghost` | Text only, white/60, hover reveals subtle fill |

All variants: `rounded-full`, `font-semibold`, `disabled:opacity-40`.

```tsx
<Button variant="primary" size="lg" onClick={handleSubmit}>
  Submit App
</Button>

<Button variant="ghost" size="sm" disabled={isPending}>
  Cancel
</Button>
```

**Used in:** everywhere — forms, modals, cards, the Navbar.

---

### `Input`

**File:** [src/components/atoms/Input.tsx](src/components/atoms/Input.tsx)

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ElementType;
}
```

Renders a `<label>` (optional), the `<input>`, and an error message (optional). Pass a React icon component (not a JSX element) to `startIcon` — it renders at 16×16 inside the input left padding.

```tsx
<Input
  label="App URL"
  placeholder="https://your-app.com"
  error={errors.url}
  value={url}
  onChange={(e) => setUrl(e.target.value)}
/>

<Input
  startIcon={FiSearch}
  placeholder="Search..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

**Used in:** all forms — submit, edit, login, admin.

---

### `Badge`

**File:** [src/components/atoms/Badge.tsx](src/components/atoms/Badge.tsx)

```ts
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'overlay' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}
```

| Variant | Appearance |
|---|---|
| `default` | Translucent white fill, white/55 text — generic tags |
| `overlay` | Dark semi-opaque fill — sits on top of images |
| `primary` | Primary-tinted fill + border |
| `secondary` | Same as `default` |
| `success` | White fill, black text — approved state |
| `warning` | Yellow-tinted |
| `danger` | Red-tinted |

Always `rounded-full`, `text-xs`.

```tsx
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Changes Requested</Badge>
<Badge variant="danger">Removed</Badge>
<Badge>Open Source</Badge>  {/* default */}
```

**Used in:** app cards (category tags), admin status indicators, profile "Lasallian" tag.

---

### `Modal`

**File:** [src/components/atoms/Modal.tsx](src/components/atoms/Modal.tsx)

```ts
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

A controlled modal with backdrop. Handles Escape key, click-outside-to-close, and body scroll lock automatically. Renders `null` when `isOpen` is false (no `AnimatePresence` — use the caller's `AnimatePresence` if you need exit animations).

```tsx
<Modal isOpen={isBanModalOpen} onClose={() => setIsBanModalOpen(false)} title="Ban User">
  <p className="text-white/60 mb-4">This will prevent the user from signing in.</p>
  <Button onClick={confirmBan}>Confirm Ban</Button>
</Modal>
```

**Used in:** `BanModal`, `RejectModal`, `RemoveModal`, `ClaimModal` — all wrap this atom.

---

### `Skeleton`

**File:** [src/components/atoms/Skeleton.tsx](src/components/atoms/Skeleton.tsx)

```ts
interface SkeletonProps {
  className?: string;
}
```

A pulsing `animate-pulse bg-white/12` block. Size and shape entirely via `className`.

```tsx
<Skeleton className="h-5 w-40" />             // line
<Skeleton className="h-40 w-full rounded-xl" /> // image placeholder
<Skeleton className="h-5 w-12 rounded-full" /> // tag pill
```

**Used in:** `AppCardSkeleton`, and inline within containers while data is loading.

---

### `Toaster`

**File:** [src/components/atoms/Toaster.tsx](src/components/atoms/Toaster.tsx)

No props. Reads from `useToastStore` (Zustand) and renders active toasts fixed at bottom-right. Each toast auto-dismisses after 3.5 seconds.

Mounted once in the root layout. Don't render it again. To trigger toasts, call the store:

```ts
import { useToastStore } from '@/store/toast.store';

const addToast = useToastStore((s) => s.addToast);

addToast('App approved!', 'success');
addToast('Something went wrong.', 'error');
```

---

## Molecules

Composed from atoms. Still generic (not tied to any feature domain), but carry a specific UI pattern.

---

### `SearchBar`

**File:** [src/components/molecules/SearchBar.tsx](src/components/molecules/SearchBar.tsx)

```ts
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

A thin controlled wrapper around `Input`. Abstracts the `onChange` signature to return just the string value.

> **Note:** The Navbar uses its own inline `<input>` with custom styling rather than this component. `SearchBar` is available for use in other contexts.

---

### `FilterButton`

**File:** [src/components/molecules/FilterButton.tsx](src/components/molecules/FilterButton.tsx)

```ts
interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}
```

A `Button` variant that toggles between `primary` (active) and `outline` (inactive). Optionally shows a count badge. Used in horizontal scrollable filter rows.

```tsx
<FilterButton
  label="Open Source"
  isActive={selectedTags.includes('open-source')}
  onClick={() => toggleTag('open-source')}
  count={12}
/>
```

**Used in:** `AppsContainer` — the category filter row at the top of the apps listing.

---

### `Pagination`

**File:** [src/components/molecules/Pagination.tsx](src/components/molecules/Pagination.tsx)

```ts
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

Previous/Next pagination with a page indicator. Renders `null` when `totalPages <= 1`. 

> **Note:** Uses light theme styling (gray/white), which differs from the rest of the design system. If used in new UI, consider restyling to match the dark theme.

**Used in:** `MembersPanel`, `AdminsPanel`, `PublishersPanel`.

---

### `ProfileTabs`

**File:** [src/components/molecules/ProfileTabs.tsx](src/components/molecules/ProfileTabs.tsx)

```ts
interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

Hardcoded three-tab switcher for user profile sections. Tab IDs are `'apps'`, `'my reviews'`, `'favorites'`. Renders as `rounded-full` pill buttons.

> **Note:** The tab labels are hardcoded. If you need a configurable tab bar, use `SidebarLayout` instead — it's generic and accepts a `sections` array.

---

### `AppCardSkeleton`

**File:** [src/components/molecules/AppCardSkeleton.tsx](src/components/molecules/AppCardSkeleton.tsx)

No props. A loading placeholder that mirrors the layout of `AppCard` (image area, title, description lines, tag pills). Built from `Skeleton` atoms.

**Used in:** `AppsContainer` while the apps query is loading.

---

## Organisms

Complex, layout-level components. May carry their own state or connect to global stores.

---

### `Navbar`

**File:** [src/components/organisms/Navbar.tsx](src/components/organisms/Navbar.tsx)

No props. Sticky header rendered once in the root layout.

**What it does:**
- Logo/wordmark link to `/`
- Inline search input (synced to `useUIStore.searchQuery`)
- Nav links: Apps, LSCS (external), Submit App (authenticated only)
- Auth state: login button (unauthenticated) or avatar dropdown (authenticated)
- Avatar dropdown: My Profile, Admin Dashboard (admin only), Log out
- Mobile hamburger with full menu (search, nav, auth)
- Renders `ProfileContainer` as a slide-over modal when `isProfileModalOpen` is true

**State sources:**
- `authClient.useSession()` — user session
- `useUIStore()` — search query, modal open/close actions
- `useIsAdmin()` — admin link visibility

---

### `Footer`

**File:** [src/components/organisms/Footer.tsx](src/components/organisms/Footer.tsx)

No props. Static footer with copyright, link to LSCS, and links to `/terms` and `/privacy`.

---

### `ProfileHeader`

**File:** [src/components/organisms/ProfileHeader.tsx](src/components/organisms/ProfileHeader.tsx)

```ts
interface ProfileHeaderProps {
  name?: string;
  email?: string;
  image?: string;
}
```

Large profile header: avatar (image or initial fallback), name, email.

> **Note:** Uses a light theme (white/gray/black) that doesn't match the dark design system. Currently not used in any active page — `ProfileContainer` renders its own profile info via `SidebarLayout`'s `sidebarHeader` slot.

---

### `SidebarLayout`

**File:** [src/components/organisms/SidebarLayout.tsx](src/components/organisms/SidebarLayout.tsx)

```ts
interface SidebarNavItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface SidebarNavSection<T extends string = string> {
  label?: string;
  items: SidebarNavItem<T>[];
}

interface SidebarLayoutProps<T extends string = string> {
  sections: SidebarNavSection<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  children: React.ReactNode;
  title?: string;
  sidebarHeader?: React.ReactNode;
  sidebarWidth?: string;  // default: 'w-52'
}
```

A generic responsive layout shell:

- **Mobile:** horizontal scrollable tab bar at the top of the page
- **Desktop:** vertical sidebar on the left, `children` in the main content area

Sections group items under optional headings. Items support icons and badge counts (auto-capped at `9+` on mobile, `99+` on desktop).

```tsx
<SidebarLayout
  sections={[
    {
      label: 'Applications',
      items: [
        { id: 'pending', label: 'Pending', icon: <FiClock />, badge: pendingCount },
        { id: 'approved', label: 'Approved', icon: <FiCheck /> },
      ],
    },
    {
      label: 'Users',
      items: [{ id: 'members', label: 'Members', icon: <FiUsers /> }],
    },
  ]}
  activeId={activeTab}
  onSelect={setActiveTab}
  sidebarHeader={<AdminHeader />}
>
  {activeTab === 'pending' && <ApprovalContainer />}
  {activeTab === 'members' && <MembersContainer />}
</SidebarLayout>
```

**Used in:** `AdminDashboardContainer`, `ProfileContainer`.

---

## Feature Components

### Auth

#### `LoginForm`

**File:** [src/features/auth/components/LoginForm.tsx](src/features/auth/components/LoginForm.tsx)

```ts
interface LoginFormProps {
  onGoogleSignIn: () => void;
  isLoading: boolean;
  error?: string | null;
}
```

Full-page layout: left brand panel + right sign-in form. Shows a Google OAuth button, loading state, and error message.

**Used by:** `LoginFormContainer` in page mode (`/login`).

---

#### `LoginModal`

**File:** [src/features/auth/components/LoginModal.tsx](src/features/auth/components/LoginModal.tsx)

```ts
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => void;
  isLoading: boolean;
  error?: string | null;
}
```

Compact modal version of the login screen with Framer Motion spring entrance animation.

**Used by:** `LoginFormContainer` in modal mode.

---

#### `LoginFormContainer`

**File:** [src/features/auth/containers/LoginFormContainer.tsx](src/features/auth/containers/LoginFormContainer.tsx)

```ts
interface LoginFormContainerProps {
  mode?: 'page' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
}
```

Owns the `isLoading` + `error` state. Calls `authClient.signIn.social({ provider: 'google' })`. Routes to `LoginForm` (page) or `LoginModal` (modal) based on `mode`.

---

#### `GlobalLoginModal`

**File:** [src/features/auth/containers/GlobalLoginModal.tsx](src/features/auth/containers/GlobalLoginModal.tsx)

No props. Subscribes to `useUIStore.isLoginModalOpen` and renders `LoginFormContainer` in modal mode. Mounted once in the root layout — always ready.

---

### Apps

#### `AppCard`

**File:** [src/features/apps/components/AppCard.tsx](src/features/apps/components/AppCard.tsx)

```ts
interface AppCardProps {
  app: Application;
  onClick?: (app: Application) => void;
  showTags?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
  action?: React.ReactNode;
  badge?: React.ReactNode;
  iconOverlay?: React.ReactNode;
  subtitle?: React.ReactNode;
}
```

The core card for displaying an app.

| Variant | Layout |
|---|---|
| `default` | Vertical card: preview image, icon+title row, description, tags, favorite button |
| `compact` | Horizontal inline row: icon, title+subtitle, right action slot |

Content slots: `action` (renders top-right), `badge` (overlaid on preview image), `iconOverlay` (overlaid on app icon — used for status dots), `subtitle` (below app name in compact mode).

Internally uses `useFavoriteToggle()` for the save button in default mode. Keyboard-accessible (Enter/Space triggers click).

```tsx
// Default card in a grid
<AppCard app={app} />

// Compact with admin actions
<AppCard
  app={app}
  variant="compact"
  iconOverlay={<StatusDot status={app.status} />}
  subtitle={<span className="text-white/40 text-xs">{app.userEmail}</span>}
  action={<Button size="sm" onClick={() => onApprove(app.id)}>Approve</Button>}
/>
```

**Used in:** `AppsContainer`, `ProfileContainer`, `FavoritesContainer`, `PendingAppCard`.

---

#### `AppDetail`

**File:** [src/features/apps/components/AppDetail.tsx](src/features/apps/components/AppDetail.tsx)

```ts
interface AppDetailProps {
  app: Application;
  favoritesCount?: number;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  isFavoritePending?: boolean;
  isLoggedIn?: boolean;
  averageScore?: number;
  totalRatings?: number;
  ratingsSection?: React.ReactNode;  // slot
  preview?: boolean;
  onClaim?: () => void;
  backLabel?: string;
  onBack?: () => void;
}
```

Full-detail view of a single app. Layout:

1. Hero image with icon, title, tagline, action buttons
2. Meta row (ratings, favorites, category, author)
3. Unclaimed notice (if `app.userId` is null and `!preview`)
4. Screenshot carousel with lightbox
5. Description with expand/collapse
6. `ratingsSection` slot (inject `RatingsContainer` here)
7. Tag pills

The `preview` prop disables all interactive actions (favorites, claims, back button) for use in the edit preview panel.

**Used in:** `AppDetailContainer`, `AppDetailPreview`.

---

#### `AppDetailPreview`

**File:** [src/features/apps/components/AppDetailPreview.tsx](src/features/apps/components/AppDetailPreview.tsx)

```ts
interface AppDetailPreviewProps {
  app: Application;
}
```

Read-only wrapper around `AppDetail` with `preview={true}` in a scrollable container. Used as the right panel in the split edit/preview layout.

---

#### `AppEditSidebar`

**File:** [src/features/apps/components/AppEditSidebar.tsx](src/features/apps/components/AppEditSidebar.tsx)

```ts
interface AppEditSidebarProps {
  formState: AppEditFormState;
  onFormChange: (updates: Partial<AppEditFormState>) => void;
  onSave: () => void;
  isSaving: boolean;
  error?: string | null;
  sidebarTop?: React.ReactNode;  // slot — e.g. status banner
  iconPreviewUrl?: string | null;
  newPreviewUrls?: string[];
}
```

The form panel in the split edit/preview layout. Scrollable form body, sticky save button at bottom. Accepts a `sidebarTop` slot for banners (e.g. "Changes Requested" notices).

---

#### `AppEditPreviewPanel`

**File:** [src/features/apps/components/AppEditPreviewPanel.tsx](src/features/apps/components/AppEditPreviewPanel.tsx)

```ts
interface AppEditPreviewPanelProps {
  app: Application;
  onClose?: () => void;
  onSave: (updates: Partial<Application>) => void;
  isSaving: boolean;
  saveError?: string | null;
  sidebarTop?: React.ReactNode;
}
```

Orchestrates the complete edit UX:

- Manages form state
- Handles file uploads (images, icon) → blob URL previews
- **Mobile:** two tabs — Edit / Preview
- **Desktop:** `AppEditSidebar` left + `AppDetailPreview` right, side-by-side
- When `onClose` is provided: wraps in a full-screen modal overlay

**Used in:** `EditApplicationContainer` (owner editing own app), `ApprovalContainer` (admin editing any app).

---

#### `EditApplicationForm`

**File:** [src/features/apps/components/EditApplicationForm.tsx](src/features/apps/components/EditApplicationForm.tsx)

```ts
interface EditApplicationFormProps {
  application: Application;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (updates: {...}, newPreviewFiles: File[], iconFile: File | null, removeIcon: boolean) => void;
  onCancel: () => void;
}
```

Full-page form layout (non-split version). All fields in a single scrollable column. Available as an alternative to `AppEditPreviewPanel` when no live preview is needed.

> **Note:** `AppEditPreviewPanel` / `AppEditSidebar` is the preferred edit surface in the current app. `EditApplicationForm` exists for cases where the split-pane layout isn't appropriate.

---

#### `ImageGallery`

**File:** [src/features/apps/components/ImageGallery.tsx](src/features/apps/components/ImageGallery.tsx)

```ts
interface ImageGalleryProps {
  images: string[] | null;
  title: string;
}
```

Simple carousel (previous/next buttons, dot indicators). Generic — not tied to `Application`. `AppDetail` has its own screenshot carousel with lightbox built in; `ImageGallery` is available for simpler cases.

---

#### `ClaimModal`

**File:** [src/features/apps/components/ClaimModal.tsx](src/features/apps/components/ClaimModal.tsx)

```ts
interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  applicationTitle: string;
  user: { name: string; email: string; image?: string | null };
}
```

Modal wrapping `Modal` atom. Shows user info and a textarea for context. Calls `useClaimApplicationMutation()` internally on submit. Shows a success checkmark state after submission.

**Used in:** `AppDetailContainer` when the app is unclaimed.

---

#### `UserProfileCard`

**File:** [src/features/apps/components/UserProfileCard.tsx](src/features/apps/components/UserProfileCard.tsx)

```ts
interface UserProfileCardProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  onClick?: () => void;
}
```

Compact user card: avatar (image or initial), name, email, "Lasallian" badge. Hover lifts with scale animation. Decorative SVG overlay on the right side.

**Used in:** `AppsContainer` (top-right when logged in, triggers profile modal).

---

#### `GuestPanel`

**File:** [src/features/apps/components/GuestPanel.tsx](src/features/apps/components/GuestPanel.tsx)

No props. Shows a sign-in prompt to guests. Opens the login modal on click.

**Used in:** `AppsContainer` (replaces `UserProfileCard` when not authenticated).

---

#### `AppsContainer`

**File:** [src/features/apps/containers/AppsContainer.tsx](src/features/apps/containers/AppsContainer.tsx)

Home page container. Owns: infinite scroll (IntersectionObserver on a sentinel div), tag filter state (via `useUIStore`), search query (via `useUIStore`). Renders `UserProfileCard` or `GuestPanel`, `FavoritesPreviewContainer`, filter pills, app grid, and loading skeletons.

---

#### `AppDetailContainer`

**File:** [src/features/apps/containers/AppDetailContainer.tsx](src/features/apps/containers/AppDetailContainer.tsx)

```ts
interface AppDetailContainerProps {
  slug: string;
  from?: string;
}
```

Fetches the app by `slug`, favorites count, and ratings. Manages favorite toggle and claim modal state. Calls `notFound()` if slug doesn't resolve.

---

#### `EditApplicationContainer`

**File:** [src/features/apps/containers/EditApplicationContainer.tsx](src/features/apps/containers/EditApplicationContainer.tsx)

```ts
interface EditApplicationContainerProps {
  slug: string;
}
```

For app owners editing their own app. Redirects to `/login` if unauthenticated. Fetches own app by slug, manages the update mutation, passes a "Changes Requested" banner to `AppEditPreviewPanel.sidebarTop` if applicable.

---

#### `ProfileContainer`

**File:** [src/features/apps/containers/ProfileContainer.tsx](src/features/apps/containers/ProfileContainer.tsx)

```ts
interface ProfileContainerProps {
  slug: string;
  onClose?: () => void;
}
```

User profile view via `SidebarLayout` with three tabs:

| Tab | Content |
|---|---|
| Apps | User's submitted apps (with status indicators and edit buttons) |
| My Reviews | `UserReviewItem` list (authenticated user only) |
| Favorites | `FavoritesContainer` |

When `onClose` is provided, renders as a full-screen modal overlay with slide-in animation. When omitted, renders as a full page.

**Used in:** `Navbar` (modal via `isProfileModalOpen`), `/users/[slug]/page.tsx` (full page).

---

### Ratings

#### `StarRating`

**File:** [src/features/ratings/components/StarRating.tsx](src/features/ratings/components/StarRating.tsx)

```ts
interface StarRatingProps {
  value: number;
  interactive?: boolean;
  onChange?: (score: number) => void;
  size?: 'sm' | 'md';
}
```

1–5 star display. In interactive mode, hover previews filled stars and click calls `onChange`. In read-only mode (default), shows a static filled/empty star row.

---

#### `RatingForm`

**File:** [src/features/ratings/components/RatingForm.tsx](src/features/ratings/components/RatingForm.tsx)

```ts
interface RatingFormProps {
  onSubmit: (payload: CreateRatingPayload) => void;
  onCancel?: () => void;
  initialValues?: Partial<CreateRatingPayload>;
  isPending: boolean;
  isEditMode?: boolean;
}
```

Review submission form: interactive `StarRating`, comment textarea (max 255 chars), post-anonymously checkbox. Validates that a score is selected before enabling submit.

---

#### `ReviewItem`

**File:** [src/features/ratings/components/ReviewItem.tsx](src/features/ratings/components/ReviewItem.tsx)

```ts
interface ReviewItemProps {
  rating: Rating;
}
```

Read-only review card: avatar + initial fallback, display name, `StarRating`, truncated comment text.

---

#### `UserReviewItem`

**File:** [src/features/ratings/components/UserReviewItem.tsx](src/features/ratings/components/UserReviewItem.tsx)

```ts
interface UserReviewItemProps {
  rating: UserRatingItem;
}
```

Review card in the profile "My Reviews" tab. Includes a link to the reviewed app and an "Anonymous" badge if the review was posted anonymously.

---

#### `RatingsContainer`

**File:** [src/features/ratings/containers/RatingsContainer.tsx](src/features/ratings/containers/RatingsContainer.tsx)

The full rating experience for an app. Renders as a horizontal carousel of review cards. Cards include:

- The user's own review (if they have one) with Edit and Delete buttons
- A "Leave a Review" form card (if the user hasn't reviewed yet)
- Other users' reviews as `ReviewItem` cards

Manages create, update, and delete mutations. Caches anonymous reviews in localStorage so anonymous reviewers can edit their own reviews.

**Used in:** `AppDetail.ratingsSection` slot (injected by `AppDetailContainer`).

---

### Submit

#### `SubmitForm`

**File:** [src/features/submit/components/SubmitForm.tsx](src/features/submit/components/SubmitForm.tsx)

```ts
interface SubmitFormProps {
  onSubmit: (data: SubmitApplicationForm, files: File[], iconFile?: File) => void;
  isSubmitting: boolean;
  submitLabel: string;
  error: string | null;
  isSuccess: boolean;
  onReset: () => void;
}
```

New-app submission form. Layout mirrors `EditApplicationForm`. Auto-generates slug from title. Supports drag-drop image upload with previews. Shows a success checkmark state after submission with a reset button.

---

#### `SubmitContainer`

**File:** [src/features/submit/containers/SubmitContainer.tsx](src/features/submit/containers/SubmitContainer.tsx)

Redirects to `/login` if unauthenticated. Uploads images/icon to S3 via the Next.js API route (`/api/upload`), then posts the full application payload to the backend.

---

### Favorites

#### `FavoritesContainer`

**File:** [src/features/favorites/containers/FavoritesContainer.tsx](src/features/favorites/containers/FavoritesContainer.tsx)

```ts
interface FavoritesContainerProps {
  userId: string;
}
```

Fetches the user's favorites and renders them as a grid of compact `AppCard`s. Shows an empty state with a hint if the list is empty.

**Used in:** `ProfileContainer` "Favorites" tab.

---

#### `FavoritesPreviewContainer`

**File:** [src/features/favorites/containers/FavoritesPreviewContainer.tsx](src/features/favorites/containers/FavoritesPreviewContainer.tsx)

```ts
interface FavoritesPreviewContainerProps {
  userId: string;
}
```

Visual showcase of favorited apps as app icons (not cards). Icon size adapts based on count (2–4 → large, 5–8 → medium, 9+ → small). Has a "Modify" mode (triggered by a button) where icons shake Framer-Motion–style and show a remove badge. Click-outside exits modify mode.

**Used in:** `AppsContainer` (the panel above the app grid when logged in).

---

### Admin

#### `PendingAppCard`

**File:** [src/features/admin/components/PendingAppCard.tsx](src/features/admin/components/PendingAppCard.tsx)

```ts
interface PendingAppCardProps {
  app: Application;
  tab: AdminApplicationStatus;
  onClick?: (app: Application) => void;
  onApprove: (id: number) => void;
  onRequestChanges: (id: number) => void;
  onRemove: (id: number) => void;
  isApproving: boolean;
  isRequestingChanges: boolean;
  isRemoving: boolean;
}
```

`AppCard` (compact) extended with admin action buttons. Which buttons appear depends on `tab` (status). Shows a rejection reason if the app has one.

---

#### `BanModal`

**File:** [src/features/admin/components/BanModal.tsx](src/features/admin/components/BanModal.tsx)

```ts
interface BanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
  memberName: string;
}
```

Wraps `Modal`. Requires a reason before the Confirm button enables.

---

#### `RejectModal`

**File:** [src/features/admin/components/RejectModal.tsx](src/features/admin/components/RejectModal.tsx)

```ts
interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}
```

Same pattern as `BanModal` but for requesting changes on a pending app submission.

---

#### `RemoveModal`

**File:** [src/features/admin/components/RemoveModal.tsx](src/features/admin/components/RemoveModal.tsx)

Confirmation modal for removing an approved app. Same pattern as `BanModal` / `RejectModal`.

---

#### `ClaimRequestCard`

**File:** [src/features/admin/components/ClaimRequestCard.tsx](src/features/admin/components/ClaimRequestCard.tsx)

Displays a single claim request: app info, claimant info, their message, and Approve/Reject action buttons.

**Used in:** `ClaimApprovalContainer`.

---

#### `MemberAvatar`

**File:** [src/features/admin/components/MemberAvatar.tsx](src/features/admin/components/MemberAvatar.tsx)

Reusable avatar with initial fallback. Used throughout the admin member panels.

---

#### `AddAdminModal`, `EditModal`, `MemberAppsModal`, `MemberReviewsModal`

Admin-specific modals for user management actions (promoting to admin, editing app inline, viewing a member's apps, viewing a member's reviews). All wrap the `Modal` atom.

---

#### `AdminsPanel`, `PublishersPanel`, `MembersPanel`

**File:** `src/features/admin/components/`

Three presentational panels for different user segments. Each renders a paginated table/list of users with role-specific actions (ban, promote, view apps/reviews). Use `Pagination` and `MemberAvatar`.

---

#### `AdminDashboardContainer`

**File:** [src/features/admin/containers/AdminDashboardContainer.tsx](src/features/admin/containers/AdminDashboardContainer.tsx)

Root admin container. Checks `isAdmin` and redirects if false. Owns `SidebarLayout` with three sections: Apps (`ApprovalContainer`), Claim Requests (`ClaimApprovalContainer`), Members (`MembersContainer`). Badge counts on tabs from live queries.

---

#### `ApprovalContainer`

**File:** [src/features/admin/containers/ApprovalContainer.tsx](src/features/admin/containers/ApprovalContainer.tsx)

The app review workflow. Status tabs (Pending, Approved, Changes Requested, Removed) with per-tab counts. Clicking a `PendingAppCard` opens `AppEditPreviewPanel` in modal mode. The sidebar of that panel gets context-aware action cards (approve button, reject button, etc.) injected via `sidebarTop`.

---

#### `ClaimApprovalContainer`

**File:** [src/features/admin/containers/ClaimApprovalContainer.tsx](src/features/admin/containers/ClaimApprovalContainer.tsx)

Lists pending claim requests as `ClaimRequestCard`s. Manages approve/reject mutations.

---

#### `MembersContainer`

**File:** [src/features/admin/containers/MembersContainer.tsx](src/features/admin/containers/MembersContainer.tsx)

Composes `AdminsPanel`, `PublishersPanel`, and `MembersPanel` in a stacked layout.

---

## Global State

### UI Store

**File:** [src/store/uiStore.ts](src/store/uiStore.ts)

Zustand store for global UI state. Read it with selectors to avoid unnecessary re-renders.

| State | Type | Description |
|---|---|---|
| `searchQuery` | `string` | Current search input value |
| `isLoginModalOpen` | `boolean` | Login modal visibility |
| `isProfileModalOpen` | `boolean` | Profile modal visibility |
| `selectedTags` | `string[]` | Active filter tags |

| Action | Description |
|---|---|
| `setSearchQuery(value)` | Update search input |
| `openLoginModal()` / `closeLoginModal()` | Toggle login modal |
| `openProfileModal()` / `closeProfileModal()` | Toggle profile modal |
| `toggleTag(tag)` | Add or remove a filter tag |
| `clearFilters()` | Reset all tags |

### Toast Store

**File:** [src/store/toast.store.ts](src/store/toast.store.ts)

```ts
addToast(message: string, type: 'success' | 'error'): void
removeToast(id: string): void
```

Call `addToast` from any container after a mutation resolves. The `Toaster` atom subscribes and handles display.

---

## Providers & Root Layout

### `QueryProvider`

**File:** [src/providers/QueryProvider.tsx](src/providers/QueryProvider.tsx)

Creates a `QueryClient` per session and wraps children in `QueryClientProvider`. Mounted once in the root layout. All `useQuery`/`useMutation` hooks depend on it being in the tree.

### Root Layout

**File:** [src/app/layout.tsx](src/app/layout.tsx)

Mounts in order: `QueryProvider` → `Navbar` → page content → `Footer` → `Toaster` → `GlobalLoginModal`.

---

## Extending and Writing Components

### Decision tree: where does this component go?

```
Is it purely visual with no domain knowledge?
├── Yes → src/components/
│   ├── One element, no composition → atoms/
│   ├── Composes atoms, still generic → molecules/
│   └── Has layout logic or own state, still generic → organisms/
└── No → src/features/<feature>/
    ├── Receives data via props, no hooks → components/
    └── Owns hooks, mutations, or state → containers/
```

### Extending an existing shared component

**Example: adding an `IconButton` variant to `Button`**

1. Open [src/components/atoms/Button.tsx](src/components/atoms/Button.tsx).
2. Add the variant to the `variant` union and the `variants` map.
3. Update any TypeScript interface that references the old union (your editor's "Find all references" covers this).
4. Don't change existing variant styles — consumers already depend on them.

**Example: adding a prop to `AppCard`**

1. Add the prop to `AppCardProps` with `?` (optional) and a safe default.
2. Thread it through the JSX.
3. Search for existing call sites (`grep -r "AppCard" src/`) — verify they all still compile without changes.

### Adding a new shared component

1. Choose the layer (atom / molecule / organism).
2. Create the file: `src/components/<layer>/ComponentName.tsx`.
3. Export a named export (`export function ComponentName`), not a default export.
4. Keep the component purely presentational — no `useQuery`, no store subscriptions.
5. Accept `className?: string` so callers can override layout concerns.
6. If the component needs motion, import from `motion/react` and use the standard spring config.

### Adding a new feature component

1. Run the scaffolder:
   ```bash
   npx create-lscs-next-app feature <feature-name>
   ```
   This creates the full directory structure under `src/features/<feature-name>/`.

2. Define types in `types/`.

3. Write the service:
   ```ts
   // features/<feature>/services/<feature>.service.ts
   export async function fetchThings(): Promise<Thing[]> {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/things`, {
       credentials: 'include',
     });
     if (!res.ok) throw new Error('Failed to fetch things');
     return res.json();
   }
   ```

4. Wrap it in a TanStack Query hook:
   ```ts
   // features/<feature>/queries/useThings.ts
   export function useThings() {
     return useQuery({ queryKey: ['things'], queryFn: fetchThings });
   }
   ```

5. Write a presentational component in `components/`:
   ```tsx
   // features/<feature>/components/ThingCard.tsx
   interface ThingCardProps {
     thing: Thing;
   }

   export function ThingCard({ thing }: ThingCardProps) {
     return (
       <div className="glass-md rounded-xl p-4">
         <h3 className="text-white font-semibold">{thing.name}</h3>
       </div>
     );
   }
   ```

6. Wire it up in a container:
   ```tsx
   // features/<feature>/containers/ThingsContainer.tsx
   export function ThingsContainer() {
     const { data, isPending } = useThings();

     if (isPending) return <Skeleton className="h-40 w-full" />;

     return (
       <div className="grid gap-4">
         {data?.map((thing) => <ThingCard key={thing.id} thing={thing} />)}
       </div>
     );
   }
   ```

7. Add a route page that imports the container:
   ```tsx
   // app/things/page.tsx
   import { ThingsContainer } from '@/features/<feature>/containers/ThingsContainer';

   export default function ThingsPage() {
     return <ThingsContainer />;
   }
   ```

### Mutation pattern

```ts
// queries/useCreateThing.ts
export function useCreateThing() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: createThing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['things'] });
      addToast('Thing created!', 'success');
    },
    onError: () => {
      addToast('Failed to create thing.', 'error');
    },
  });
}
```

### Modal pattern

Use the `Modal` atom for simple confirmation dialogs. For animated entry/exit, wrap the call site in `AnimatePresence` and use Framer Motion on the inner element:

```tsx
// In the container managing state:
<AnimatePresence>
  {isOpen && (
    <Modal isOpen={isOpen} onClose={close} title="Confirm">
      ...
    </Modal>
  )}
</AnimatePresence>
```

For full-screen overlays (like `ProfileContainer` or `AppEditPreviewPanel`), build the backdrop and panel yourself using `motion.div` and position `fixed inset-0`.

### Design conventions checklist

When writing any new component, verify:

- [ ] Dark glass-morphism surface: `bg-black/[40–80] backdrop-blur-* border border-white/10`
- [ ] Text hierarchy: `text-white/90` → `/60` → `/40` → `/20`
- [ ] Rounded: `rounded-xl` for cards, `rounded-lg` for inputs, `rounded-full` for pills/buttons/avatars
- [ ] Named exports only (no `export default` — easier to grep and refactor)
- [ ] Optional `className` prop on any reusable component
- [ ] Mobile-first responsive (`md:`, `lg:` for progressive enhancement)
- [ ] Loading state: `Skeleton` while query is pending
- [ ] Error state: surface the message; use `addToast` for transient errors
- [ ] Motion: `motion/react`, standard spring `{ stiffness: 300, damping: 20 }`, `AnimatePresence` for unmount
