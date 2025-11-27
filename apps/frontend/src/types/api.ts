/**
 * Base response structure from custom backend routes.
 *
 * @example
 * ```json
 * {
 *   "status": "ok",
 *   "code": 200,
 *   "data": { ... }
 * }
 * ```
 */
export interface BaseBackendResponse<T = unknown> {
  status: 'ok' | 'error';
  code: number;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

/**
 * Validation error structure returned in 422 responses.
 *
 * Contains the field path and error message for client-side validation feedback.
 */
export interface ValidationError {
  path: string;
  message: string;
}

/**
 * Frontend-friendly API response type that works with all backend endpoints.
 *
 * Preserves the backend structure while adding convenience properties like `ok` for easier checks.
 *
 * @template T The expected data type for successful responses
 *
 * @example
 * ```typescript
 * const response = await api.get<Memory[]>('/memory/get-random-memories');
 * if (response.ok) {
 *   console.log(response.data); // Memory[]
 * }
 * ```
 */
export interface ApiResponse<T = unknown> {
  status: 'ok' | 'error';
  code: number;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  ok: boolean;
  error?: string;
}

/**
 * Network error response when fetch itself fails before receiving HTTP response.
 *
 * Returns `code: 0` as convention for network-level errors like:
 * - No internet connection
 * - DNS resolution failure
 * - Request timeout
 * - CORS errors
 */
export interface NetworkErrorResponse {
  status: 'error';
  code: 0;
  ok: false;
  error: string;
  message: string;
}

/**
 * Authentication session object from better-auth.
 */
export interface Session {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  id: string;
}

/**
 * User object from better-auth.
 */
export interface User {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  id: string;
}

/**
 * Session response from better-auth `/auth/get-session` endpoint.
 *
 * Note: Better-auth responses return data directly without the `{status, code, data}` wrapper.
 */
export interface SessionResponse {
  session: Session;
  user: User;
}

/**
 * Type guard to check if response is a better-auth response.
 *
 * Better-auth responses don't have `status` and `code` fields at the root level.
 */
export function isBetterAuthResponse<T>(response: any): response is T {
  return response && !('status' in response) && !('code' in response);
}

/**
 * Type guard to check if response follows custom backend format.
 *
 * Custom backend responses have `status` ("ok" | "error") and `code` (HTTP status code).
 */
export function isCustomBackendResponse<T>(
  response: any
): response is BaseBackendResponse<T> {
  return (
    response &&
    'status' in response &&
    'code' in response &&
    (response.status === 'ok' || response.status === 'error')
  );
}
