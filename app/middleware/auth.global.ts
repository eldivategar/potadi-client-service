import { useAuthClient } from "~/utils/auth-client";

// Module-level deduplication for client in-flight check
let clientCheckAuthPromise: Promise<void> | null = null;

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuth = useState<boolean>("auth_is_authenticated", () => false);
  const isAuthChecked = useState<boolean>("auth_is_checked", () => false);

  const authClient = useAuthClient();

  const checkAuth = async () => {
    if (import.meta.client && clientCheckAuthPromise) {
      return clientCheckAuthPromise;
    }

    const run = async () => {
      try {
        const sessionRes = await authClient.getSession();
        const raw = sessionRes?.data as any;
        isAuth.value = !!(raw?.data?.user || raw?.user);
      } catch (e) {
        isAuth.value = false;
      } finally {
        isAuthChecked.value = true;
        clientCheckAuthPromise = null;
      }
    };

    if (import.meta.client) {
      clientCheckAuthPromise = run();
      return clientCheckAuthPromise;
    }

    return run();
  };

  const isAuthRoute =
    to.path === "/auth/login" ||
    to.path === "/auth/register" ||
    to.path === "/login" ||
    to.path === "/register";

  const isProtectedRoute = to.path.startsWith("/app");

  if (import.meta.server) {
    if (isProtectedRoute || isAuthRoute) {
      await checkAuth();
    }
  } else {
    // Client-side:
    // Only check auth if navigating to a protected route and not currently marked auth,
    // or if navigating to an auth page and never checked before.
    if (isProtectedRoute && !isAuth.value) {
      if (!isAuthChecked.value) {
        await checkAuth();
      }
    } else if (isAuthRoute && !isAuthChecked.value) {
      await checkAuth();
    }
  }

  // Protected route /app
  if (isProtectedRoute && !isAuth.value) {
    return navigateTo({
      path: "/auth/login",
      query: {
        redirect: to.fullPath !== "/app" ? to.fullPath : undefined,
      },
    });
  }

  // Redirect logged in user from auth pages
  if (isAuthRoute && isAuth.value) {
    const redirectQuery = (to.query.redirect as string) || "/app";
    return navigateTo(redirectQuery);
  }
});
