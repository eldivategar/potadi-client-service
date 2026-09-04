import { createAuthClient } from "better-auth/vue";

// Singleton on the client-side only
let _clientAuthClient: ReturnType<typeof createAuthClient> | null = null;

/**
 * Composable to initialize better-auth client within Nuxt runtime lifecycle.
 * Returns a singleton on the client, and a request-scoped client on the server.
 */
export const useAuthClient = () => {
  const config = useRuntimeConfig();
  let apiBase = ((config.public?.apiBaseUrl as string) || "").replace(/\/+$/, "");
  
  if (import.meta.server && !apiBase) {
    // Node.js fetch requires absolute URLs. If no apiBase is set, use the current request origin.
    const reqUrl = useRequestURL();
    apiBase = reqUrl.origin;
  }

  const baseURL = apiBase ? `${apiBase}/api/v1/auth` : "/api/v1/auth";

  // Client-side: use singleton so Nanostore reactive state is shared
  if (import.meta.client) {
    if (!_clientAuthClient) {
      _clientAuthClient = createAuthClient({
        baseURL,
        fetchOptions: {
          credentials: "include",
        },
      });
    }
    return _clientAuthClient;
  }

  // Server-side (SSR): request-scoped, pass all headers for CSRF & secure cookies
  const headers = useRequestHeaders(['cookie', 'user-agent', 'x-forwarded-for', 'referer']);

  return createAuthClient({
    baseURL,
    fetchOptions: {
      headers: headers as Record<string, string>,
      credentials: "include",
    },
  });
};
