# Future API integration rules

The current frontend has no endpoint calls. Do not invent an API contract.

When real GET and POST contracts arrive:

- Configure the base URL through `VITE_API_BASE_URL`; never hard-code an environment URL.
- Define one API module per domain, using the shared client in `src/api/httpClient.ts`.
- Define exact request and response DTOs and validate/normalize uncertain response data at the boundary.
- Add React Query hooks for GET queries and POST mutations. Centralize stable query keys.
- Map results to `ImageAnalysis` rather than leaking transport fields into components.
- Make retry behavior deliberate; do not automatically retry unsafe POST requests.
- Surface actionable errors without exposing credentials, raw stack traces, or sensitive response data.
- Configure backend CORS for the deployed GitHub Pages origin.
- If the Docker build connects to a new origin, update the Nginx Content Security Policy `connect-src` directive.
- Add unit tests for mapping and error cases, and an integration test for the request lifecycle.
