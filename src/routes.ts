/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 */
export const publicRoutes = [
  "/",
  // This route is here because it can be accessed by both logged in and logged out users
  "/auth/new-verification",
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect LOGGED IN users to /settings
 * Hence, they are not accessible to logged in users. (only available to logged out users)
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API routes that are used for authentication.
 * Auth needs these routers to operate correctly.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
