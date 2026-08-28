import { useAuthClient } from "../utils/auth-client";
import { useAuth } from "../composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuth = useState<boolean>("auth_is_authenticated", () => false);
  const isAuthChecked = useState<boolean>("auth_is_checked", () => false);

  if (import.meta.server) {
    const authClient = useAuthClient();
    try {
      const sessionRes = await authClient.getSession();
      
      const raw = sessionRes?.data as any;
      isAuth.value = !!(raw?.data?.user || raw?.user);
      isAuthChecked.value = true;
    } catch (e) {
      isAuth.value = false;
      isAuthChecked.value = true;
    }
  } else {
    const nuxtApp = useNuxtApp();

    if (nuxtApp.isHydrating && isAuthChecked.value) {
      // Do nothing, trust server hydration state
    } else {
      const authClient = useAuthClient();
      try {
        const sessionRes = await authClient.getSession();
        const raw = sessionRes?.data as any;
        isAuth.value = !!(raw?.data?.user || raw?.user);
      } catch {
        isAuth.value = false;
      }
      isAuthChecked.value = true;
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
