import { getAuthClient } from "../utils/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authClient = getAuthClient();

  // Validate authentication using Better-Auth getSession()
  let isAuthenticated = false;
  try {
    const sessionRes = await authClient.getSession({
      fetchOptions: {
        headers: import.meta.server
          ? (useRequestHeaders(["cookie"]) as Record<string, string>)
          : undefined,
      },
    });

    const raw = sessionRes?.data as any;
    const sessionUser = raw?.data?.user || raw?.user;

    isAuthenticated = !!sessionUser;
  } catch {
    isAuthenticated = false;
  }

  // 1. Route Interceptor: Protect /app and its subroutes
  if (to.path.startsWith("/app")) {
    if (!isAuthenticated) {
      return navigateTo({
        path: "/auth/login",
        query: {
          redirect: to.fullPath !== "/app" ? to.fullPath : undefined,
        },
      });
    }
  }

  // 2. Prevent already logged-in users from visiting login/register pages
  const isAuthPage =
    to.path === "/auth/login" ||
    to.path === "/auth/register" ||
    to.path === "/login" ||
    to.path === "/register";

  if (isAuthPage && isAuthenticated) {
    const redirectQuery = (to.query.redirect as string) || "/app";
    return navigateTo(redirectQuery);
  }
});
