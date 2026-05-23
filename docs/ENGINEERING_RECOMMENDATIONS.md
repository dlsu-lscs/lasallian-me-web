# lasallian.me — Engineering Consultant Report

**Post-Launch Feature, Operations & Maintenance Recommendations**
**Prepared for:** La Salle Computer Society — Research & Development Committee
**Date:** May 23, 2026

---

## Executive Summary

lasallian.me has successfully launched as a dedicated application discovery and review platform for the De La Salle University community. The platform currently supports application listings, ratings, favorites, app submission, and an administrative panel. This document outlines the recommended next steps across three dimensions: **feature development**, **platform operations**, and **ongoing maintenance**.

---

## I. Feature Recommendations

### 1. Reporting System for Applications and Reviews

**Priority: High**

Introduce a user-facing reporting mechanism to allow community members to flag problematic applications or reviews. This is a prerequisite for a healthy, self-moderating platform.

**Scope:**
- Report button on application listings and individual reviews
- Report categories: inappropriate content, spam, misleading information, broken link
- Admin dashboard view for reviewing flagged content, with accept/dismiss actions
- Automated email notification to admins on new reports above a threshold

**Affected Systems:** `lasallian-me-api` (new `reports` domain), `lasallian-me-web` (`admin` and `apps` features)

---

### 2. Review Dispute System for Authors

**Priority: High**

Allow application authors to formally dispute reviews they believe are inaccurate or violate platform guidelines. This closes the feedback loop between authors and reviewers, and reduces admin arbitration burden.

**Scope:**
- Authors can flag a review on their own application as "disputed"
- Authors provide a written reason for the dispute
- Admins review disputed items in the admin panel
- Possible outcomes: dismiss dispute, remove review, or mark review as disputed (visible to users)
- Notification to reviewer upon resolution

**Affected Systems:** `lasallian-me-api` (extend `ratings` domain or new `disputes` domain), `lasallian-me-web` (`admin`, `ratings` features)

---

### 3. Author Updates / "What's New" Section

**Priority: High**

Allow application authors to post versioned update entries to their application page — similar to a changelog. Users who favorited an application can opt into email notifications.

**Scope:**
- Authors can publish update entries with a title, description, and optional version tag
- Updates appear in a dedicated "What's New" tab on the application detail page
- Users who have favorited the application can subscribe to update emails
- Email delivery via a transactional email provider (e.g., Resend, Postmark)
- API endpoint to list and post updates per application

**Affected Systems:** `lasallian-me-api` (new `updates` domain), `lasallian-me-web` (`apps` feature), email integration

---

### 4. Reviews Section UI Redesign

**Priority: Medium**

The current reviews section would benefit from a design refresh to improve readability, hierarchy, and user engagement.

**Recommended Improvements:**
- Cleaner rating breakdown visualization (e.g., star distribution bar chart)
- Review cards with author avatar, date, and helpful vote count
- Sort/filter controls (most recent, highest rated, lowest rated)
- Highlighted "verified author" reply badge (see item 5 below)
- Responsive design improvements for mobile

**Affected Systems:** `lasallian-me-web` (`ratings` feature components)

---

### 5. Author Replies to Reviews

**Priority: Medium**

Allow application authors to post a single official reply to any review on their application. This mirrors standard app store behavior (Google Play, App Store) and encourages author accountability.

**Scope:**
- Author can post one reply per review
- Reply is visually distinct (e.g., "Developer Response" label)
- Reply is editable by the author
- Notify reviewer via email when a reply is posted

**Affected Systems:** `lasallian-me-api` (extend `ratings` domain), `lasallian-me-web` (`ratings` feature)

---

### 6. Standardized Preview Image Resolution

**Priority: Medium**

Define and enforce a canonical resolution and aspect ratio for application preview images so that authors can design their screenshots and promotional graphics with a known layout target. Currently inconsistent image sizes degrade the visual quality of app listing pages.

**Scope:**
- Define a standard preview image spec (e.g., 1280×800px, 16:10 aspect ratio) and publish it in the author-facing submission guidelines
- Enforce the spec at upload time: reject images that fall outside acceptable dimensions or aspect ratio, with a clear error message
- Apply consistent cropping and display treatment across all preview image surfaces (app cards, detail page carousel, admin panel thumbnails)
- Provide authors a downloadable design template (e.g., Figma frame, PNG overlay) reflecting the safe zones and layout
- Migrate or re-prompt existing authors whose uploaded images do not meet the new spec

**Affected Systems:** `lasallian-me-api` (image upload validation), `lasallian-me-web` (`submit` and `apps` features), author documentation

---

### 7. Markdown-Rendered Application Descriptions

**Priority: Medium**

Allow application descriptions to be authored and stored as Markdown, then rendered as rich HTML on the application detail page. This enables authors to properly structure and express their application’s purpose, features, and usage instructions.

**Scope:**
- Replace plain-text description input in the submission form with a Markdown editor (e.g., a lightweight editor with a live preview pane)
- Sanitize rendered HTML server-side or client-side to prevent XSS (use a trusted library such as `DOMPurify` paired with a Markdown parser like `marked` or `remark`)
- Apply consistent typographic styling to rendered output so it fits the platform’s design system
- Maintain backwards compatibility: existing plain-text descriptions should render without errors
- Consider a supported subset of Markdown (headings, bold, italic, lists, code blocks, links) and document it for authors

**Affected Systems:** `lasallian-me-web` (`submit` and `apps` features), `lasallian-me-api` (description storage, no schema change required)

---

### 8. Customizable / Dynamic Front Page

**Priority: Medium**

Replace a static front page layout with an admin-configurable section system. Sections are defined via a JSON configuration stored in the database, allowing the LSCS team to curate the front page without code changes.

**Proposed Configuration Schema:**

```json
[
  {
    "section_title": "Editor's Choice",
    "section_description": "Top picks from the LSCS team.",
    "section_type": "hard_define",
    "apps": ["app-id-1", "app-id-2", "app-id-3"]
  },
  {
    "section_title": "Productivity",
    "section_description": "Superboost your studying with these applications.",
    "section_type": "tags",
    "section_tags": ["Apps", "Productivity"]
  }
]
```

**Section Types:**

| Type | Behavior |
|---|---|
| `hard_define` | Displays a manually curated list of app IDs |
| `tags` | Dynamically filters and displays apps matching the given tags |
| `spotlight` | (Future) Highlights a single featured application with a hero layout |

**Scope:**
- Admin panel UI to manage front page sections (add, reorder, remove, edit)
- API endpoint to GET/PUT front page configuration
- Front page renders sections dynamically from the stored configuration
- Caching layer recommended to avoid per-request config fetches

**Affected Systems:** `lasallian-me-api` (new `front-page-config` domain), `lasallian-me-web` (`admin` feature, app home page)

---

### 9. Top Apps Per Category Algorithm

**Priority: Low (defer until catalog grows)**

Once a sufficient number of applications are indexed on the platform, introduce a scoring algorithm to surface top-performing applications per category (primary tag).

**Proposed Scoring Factors:**
- Average rating (weighted by review count)
- Number of favorites
- Recency of last update
- Number of reviews

**Scoring Formula (suggested starting point):**

```
score = (avg_rating × log(review_count + 1)) + (0.3 × favorites_count) + (0.2 × recency_score)
```

**Scope:**
- Scheduled background job (e.g., daily) to compute and cache scores per application
- API endpoint for `GET /applications?sort=top&tag=productivity`
- Front page "Top in [Category]" section type added to the dynamic front page system (see item 8)

**Affected Systems:** `lasallian-me-api` (background job, scoring logic), `lasallian-me-web` (new section rendering)

---

## II. Operations Recommendations

### Trimestral Development Cycle

The LSCS Research & Development Committee operates within DLSU's trimestral academic calendar. It is strongly recommended to align software development cycles to this schedule for predictable delivery and sustainable contributor pacing.

**Proposed Term Cadence:**

| Activity | Timing |
|---|---|
| Term Kickoff Planning Meeting | First week of the term |
| Feature scoping & assignment | Weeks 1–2 |
| Active development | Weeks 2–10 |
| QA & staging review | Weeks 11–12 |
| Production release | End of term or start of break |
| Retrospective | Last week of term |

**Term Kickoff Agenda (recommended):**
1. Review of previous term's delivered features and any outstanding bugs
2. Review of user-submitted feedback and reported issues
3. Prioritization of next feature set from the backlog (this document serves as the initial backlog)
4. Assignment of features to contributors
5. Agreement on definition of done and review standards for the term

**Backlog Management:**
- Maintain a GitHub Project board with `Backlog`, `This Term`, `In Progress`, `In Review`, and `Done` columns
- Each feature from this document should be represented as a GitHub Issue with acceptance criteria before development begins

---

### Versioning and Releases

- Follow semantic versioning (`MAJOR.MINOR.PATCH`) for the API
- Tag each production release in GitHub
- Maintain a `CHANGELOG.md` in both repositories
- Use the existing branch model (`main` → production, `staging` → pre-release, `dev` → integration)

---

## III. Maintenance Recommendations

### Routine Maintenance Tasks

| Task | Frequency | Owner |
|---|---|---|
| Dependency updates (`npm audit`, `pnpm update`) | Monthly | Backend/Frontend lead |
| Database backup verification | Monthly | DevOps / infra lead |
| Review of reported content and disputes | Weekly (once reporting is live) | Admin / content moderator |
| Performance monitoring review (response times, error rates) | Monthly | Backend lead |
| Review of front page configuration relevance | Each term | LSCS editorial team |
| Rotate secrets and API keys | Each term | DevOps lead |

---

### Technical Debt Items to Address

The following items are recommended for inclusion in a future maintenance sprint:

1. **Add integration test coverage** — The current setup has Vitest and Cypress configured but limited test coverage. Target critical paths: auth flow, app submission, rating submission.
2. **Add API rate limiting** — Prevent abuse on public-facing endpoints (ratings, submissions).
3. **Implement structured logging and error tracking** — Winston is in place; connect to an external aggregator (e.g., Sentry for errors, Loki or Datadog for logs) for production observability.
4. **Database query optimization** — As the catalog grows, audit and index columns used in filters and sorts (tags, ratings, favorites counts).
5. **Accessibility audit** — Run an a11y pass on the front-end, particularly on app listing cards and the review submission form.

---

### Handover Checklist (Per Academic Year Transition)

When a new batch of contributors takes over the project, ensure the following are transferred:

- [ ] Access to production hosting environment and CI/CD credentials
- [ ] Access to the transactional email provider account
- [ ] Access to the database (production and staging)
- [ ] Documented runbook for deployment and rollback
- [ ] Up-to-date `.env.example` in both repositories
- [ ] Briefing meeting with outgoing contributors

---

*This document serves as the engineering consultant's initial post-launch recommendations. Items should be revisited and reprioritized at each term kickoff meeting as platform usage and contributor capacity evolve.*
