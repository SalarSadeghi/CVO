# API integration boundary

The application intentionally makes no backend requests right now.

When the API contract is available:

1. Keep the shared Axios configuration in `httpClient.ts`.
2. Add endpoint functions in domain-specific files such as `inspection.api.ts`.
3. Put request and response DTOs beside those endpoint functions; do not reuse UI view models as API DTOs.
4. Wrap GET requests with React Query query hooks and POST requests with mutation hooks.
5. Map backend responses into the domain types in `src/types/domain.ts` before the UI consumes them.
6. Do not call Axios directly from a component or a Zustand store.

`VITE_API_BASE_URL` is reserved for the future base URL. It is currently optional and unused by endpoint code.
