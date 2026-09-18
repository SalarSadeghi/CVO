# Architecture rules

- Keep pages in `src/pages`; pages compose features and shared components but should contain little domain logic.
- Keep feature-specific code in `src/features/<feature>`.
- Keep reusable UI in `src/components` and reusable hooks in `src/hooks`.
- Keep browser persistence behind functions in `src/storage`.
- Keep all future HTTP code in `src/api`; components must never call Axios directly.
- Keep domain models in `src/types/domain.ts`. Keep future API DTOs in `src/api` and map them to domain models.
- Use React Query for IndexedDB operations and future remote server state.
- Use Zustand only for client-owned transient state that must be shared, such as an unsaved photo set.
- Prefer component props and local state when global state is unnecessary.
- A module should have one clear responsibility and expose a small typed interface.
- Avoid circular dependencies. Features may depend on shared components, hooks, config, types, and utilities; shared modules must not depend on a feature.
- Never store image blobs or base64 data in localStorage. Use IndexedDB and short-lived object URLs.
