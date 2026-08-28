import { ref, computed } from "vue";
import { useAuthClient } from "../utils/auth-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const useAuth = () => {
  const router = useRouter();
  const config = useRuntimeConfig();
  const authClient = useAuthClient();

  const apiBase = ((config.public?.apiBaseUrl as string) || "").replace(/\/+$/, "");

  // Better-Auth reactive session store
  const session = authClient.useSession();

  // Reactive user computed directly from Better-Auth useSession()
  const user = computed<AuthUser | null>(() => {
    const raw = session.value?.data as any;
    const rawUser = raw?.data?.user || raw?.user;
    if (!rawUser) return null;

    return {
      id: rawUser.id,
      name: rawUser.name || "Agronomis Potadi",
      email: rawUser.email,
      role: "Agronomis • Lahan Mandiri",
      image: rawUser.image,
      emailVerified: rawUser.emailVerified,
      createdAt: rawUser.createdAt ? String(rawUser.createdAt) : undefined,
      updatedAt: rawUser.updatedAt ? String(rawUser.updatedAt) : undefined,
    };
  });

  // Token representation from Better-Auth session
  const token = computed<string | null>(() => {
    const raw = session.value?.data as any;
    const s = raw?.data?.session || raw?.session || raw?.token ? raw : null;
    return s?.token || (s ? "better-auth-session" : null);
  });

  const isAuthenticated = computed(() => {
    const raw = session.value?.data as any;
    return !!(raw?.data?.user || raw?.user);
  });

  // Global loading & error states for UI feedback
  const isLoading = useState<boolean>("auth_loading", () => false);
  const error = useState<string | null>("auth_error", () => null);

  /**
   * Helper for raw API requests (backward compatibility)
   */
  const apiFetch = async <T = any>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE";
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> => {
    if (!apiBase) {
      throw new Error(
        "API Base URL belum dikonfigurasi. Silakan atur NUXT_PUBLIC_API_BASE_URL pada file .env"
      );
    }

    return await $fetch<ApiResponse<T>>(`${apiBase}${endpoint}`, {
      method: options.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body !== undefined ? options.body : undefined,
      credentials: "include",
    });
  };

  /**
   * Fetch active session from Better-Auth
   */
  const fetchSession = async (): Promise<AuthUser | null> => {
    try {
      if (session.value?.refetch) {
        await session.value.refetch();
      }
      return user.value;
    } catch {
      return null;
    }
  };

  /**
   * Sign in with Email & Password using better-auth client
   */
  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: authErr } = await authClient.signIn.email({
        email,
        password,
      });

      if (authErr) {
        const msg = authErr.message || "Gagal masuk: Kredensial tidak valid";
        error.value = msg;
        isLoading.value = false;
        return { success: false, message: msg };
      }

      if (session.value?.refetch) {
        await session.value.refetch();
      }

      isLoading.value = false;
      return { success: true };
    } catch (err: any) {
      const msg = err?.message || "Gagal menghubungi server autentikasi";
      error.value = msg;
      isLoading.value = false;
      return { success: false, message: msg };
    }
  };

  /**
   * Sign up with Name, Email & Password using better-auth client
   */
  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: authErr } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (authErr) {
        const msg = authErr.message || "Pendaftaran akun gagal";
        error.value = msg;
        isLoading.value = false;
        return { success: false, message: msg };
      }

      if (session.value?.refetch) {
        await session.value.refetch();
      }

      isLoading.value = false;
      return { success: true };
    } catch (err: any) {
      const msg = err?.message || "Gagal mendaftarkan akun baru";
      error.value = msg;
      isLoading.value = false;
      return { success: false, message: msg };
    }
  };

  /**
   * Sign in with Google (OAuth SSO) using better-auth client
   */
  const signInWithGoogle = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const callbackURL =
        (config.public?.authCallbackUrl as string) ||
        (typeof window !== "undefined" ? `${window.location.origin}/app` : "/app");

      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (res?.error) {
        error.value = res.error.message || "Gagal menginisiasi login Google";
        return;
      }

      const redirectUrl =
        (res?.data as any)?.url ||
        (res?.data as any)?.data?.url ||
        (res as any)?.url;

      if (redirectUrl && typeof window !== "undefined") {
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      error.value = err?.message || "Gagal menginisiasi login Google";
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Request Password Reset Link using better-auth client
   */
  const requestPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; message?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/reset-password`
          : "/auth/reset-password";

      const { error: authErr } = await authClient.requestPasswordReset({
        email,
        redirectTo,
      });

      if (authErr) {
        const msg = authErr.message || "Gagal mengirim permintaan reset kata sandi";
        error.value = msg;
        isLoading.value = false;
        return { success: false, message: msg };
      }

      isLoading.value = false;
      return {
        success: true,
        message: "Tautan reset kata sandi telah dikirim ke email Anda.",
      };
    } catch (err: any) {
      const msg = err?.message || "Gagal mengirim permintaan reset kata sandi";
      error.value = msg;
      isLoading.value = false;
      return { success: false, message: msg };
    }
  };

  /**
   * Reset Password with Token using better-auth client
   */
  const resetPassword = async (
    tokenStr: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const { error: authErr } = await authClient.resetPassword({
        newPassword,
        token: tokenStr,
      });

      if (authErr) {
        const msg =
          authErr.message ||
          "Gagal mengatur ulang kata sandi. Token mungkin sudah kedaluwarsa.";
        error.value = msg;
        isLoading.value = false;
        return { success: false, message: msg };
      }

      isLoading.value = false;
      return {
        success: true,
        message: "Kata sandi berhasil diatur ulang.",
      };
    } catch (err: any) {
      const msg =
        err?.message ||
        "Gagal mengatur ulang kata sandi. Token mungkin sudah kedaluwarsa.";
      error.value = msg;
      isLoading.value = false;
      return { success: false, message: msg };
    }
  };

  /**
   * Sign Out using better-auth client
   */
  const signOut = async () => {
    try {
      await authClient.signOut();
      // Refetch session so Better Auth clears the local reactive state
      if (session.value?.refetch) {
        await session.value.refetch();
      }
    } catch {
      // Silently ignore sign out error
    } finally {
      // Reset Nuxt global state agar middleware tidak mengira user masih login
      useState("auth_is_authenticated").value = false;
      await router.push("/auth/login");
    }
  };

  return {
    apiBase,
    authClient,
    session,
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    requestPasswordReset,
    resetPassword,
    signOut,
    fetchSession,
    apiFetch,
  };
};
