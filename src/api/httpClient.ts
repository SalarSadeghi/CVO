import axios from "axios";

/**
 * Shared HTTP transport for future backend endpoints.
 *
 * No endpoint is called by the application yet. Add domain-specific endpoint
 * functions under `src/api/` after the backend contract is finalized.
 */
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});
