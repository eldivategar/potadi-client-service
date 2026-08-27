import { createAuthClient } from "better-auth/vue";

let _authClient: ReturnType<typeof createAuthClient> | null = null;

/**
 * Factory to lazily initialize better-auth client within Nuxt runtime lifecycle
 */
export const getAuthClient = () => {
  if (_authClient) {
    return _authClient;
  }

  const config = useRuntimeConfig();
  const apiBase = ((config.public?.apiBaseUrl as string) || "").replace(/\/+$/, "");
  const baseURL = apiBase ? `${apiBase}/api/v1/auth` : "/api/v1/auth";

  _authClient = createAuthClient({
    baseURL,
    fetchOptions: {
      credentials: "include",
    },
  });

  return _authClient;
};
