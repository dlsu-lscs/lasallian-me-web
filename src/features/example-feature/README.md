
# Feature Module: example-feature

This folder is a **template** for creating new features.  
To add a new feature:

1. **Duplicate this folder** and rename it (e.g. `posts`, `auth`, `dashboard`).
2. Replace all contents with feature-specific code.

---

## Folder Structure

- `components/` → Presentational components (UI only, no business logic).
- `containers/` → Smart components that connect logic, hooks, and services.
- `hooks/` → Custom React hooks for this feature.
- `services/` → API calls or feature-specific services.
- `queries/` → TanStack Query hooks/configs.
- `types/` → TypeScript types/interfaces for the feature.
- `data/` → Static or mock data (until API is ready).

---

## Guidelines

- Follow the **Container/Presentational pattern**.
- Keep logic inside `containers/` or `hooks/`, not in UI components.
- Always type with **TypeScript**.
- Use **Zustand** for client state if needed.
- Use **TanStack Query** for server data fetching.

✅ This structure ensures every feature stays **self-contained, scalable, and easy to maintain**.
