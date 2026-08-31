import { useAuthClient } from "../utils/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuth = useState<boolean>("auth_is_authenticated", () => false);
  const isAuthChecked = useState<boolean>("auth_is_checked", () => false);

  const authClient = useAuthClient();

  const checkAuth = async () => {
    try {
      const sessionRes = await authClient.getSession();
      const raw = sessionRes?.data as any;
      isAuth.value = !!(raw?.data?.user || raw?.user);
    } catch (e) {
      isAuth.value = false;
    } finally {
      isAuthChecked.value = true;
    }
  };

  if (import.meta.server) {
    await checkAuth();
  } else {
    const nuxtApp = useNuxtApp();
    
    // Always double check on client if navigating to protected route and not auth
    if (to.path.startsWith("/app") && !isAuth.value) {
      await checkAuth();
    } else if (!nuxtApp.isHydrating && !isAuthChecked.value) {
      await checkAuth();
    }
  }

  // Protected route /app
  if (to.path.startsWith("/app")) {
    if (!isAuth.value) {
      return navigateTo({
        path: "/auth/login",
        query: {
          redirect: to.fullPath !== "/app" ? to.fullPath : undefined,
        },
      });
    }
  }

  // Redirect logged in user from auth pages
  const isAuthPage =
    to.path === "/auth/login" ||
    to.path === "/auth/register" ||
    to.path === "/login" ||
    to.path === "/register";

  if (isAuthPage && isAuth.value) {
    const redirectQuery = (to.query.redirect as string) || "/app";
    return navigateTo(redirectQuery);
  }
});
