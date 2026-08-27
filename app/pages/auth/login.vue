<script setup lang="ts">
import { ref, reactive } from "vue";
import AuthLayout from "~/components/auth/AuthLayout.vue";
import SocialLoginGoogle from "~/components/auth/SocialLoginGoogle.vue";
import { useAuth } from "~/composables/useAuth";
import { loginSchema } from "~/utils/auth-schemas";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { signInWithEmail, signInWithGoogle, isLoading, error: authError } = useAuth();

useHead({
  title: "Masuk ke Potadi Studio - Diagnosa Daun Kentang",
  meta: [
    {
      name: "description",
      content: "Masuk ke Potadi Studio untuk mengakses sistem diagnostik dan riwayat kesehatan lahan kentang.",
    },
  ],
});

const form = reactive({
  email: "",
  password: "",
  rememberMe: true,
});

const fieldErrors = reactive<Record<string, string>>({});
const showPassword = ref(false);
const localError = ref<string | null>(null);

const handleSubmit = async () => {
  localError.value = null;
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);

  // Zod 4 Schema Validation
  const validation = loginSchema.safeParse({
    email: form.email,
    password: form.password,
  });

  if (!validation.success) {
    validation.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
    return;
  }

  const result = await signInWithEmail(validation.data.email, validation.data.password);
  if (result.success) {
    const target = (route.query.redirect as string) || "/app";
    router.push(target);
  } else {
    localError.value = result.message || t("auth.errors.generalError");
  }
};

const handleGoogleSignIn = async () => {
  await signInWithGoogle();
};
</script>

<template>
  <AuthLayout>
    <div class="space-y-6">
      <!-- Card Title & Subtitle -->
      <div class="space-y-1.5 text-center sm:text-left">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ $t("auth.login.title") }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">
          {{ $t("auth.login.subtitle") }}
        </p>
      </div>

      <!-- Google Single Sign-On -->
      <SocialLoginGoogle
        mode="login"
        :disabled="isLoading"
        @google-click="handleGoogleSignIn"
      />

      <!-- Error Notification Alert -->
      <div
        v-if="localError || authError"
        class="p-3.5 rounded-2xl neu-rose-inset text-rose-800 dark:text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-shake"
        role="alert"
      >
        <UIcon name="i-ph-warning-octagon-duotone" class="size-4.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <span class="leading-relaxed">{{ localError || authError }}</span>
      </div>

      <!-- Email & Password Form -->
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <!-- Email Input Field -->
        <div class="space-y-1.5">
          <label for="login-email" class="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            {{ $t("auth.common.emailLabel") }}
          </label>
          <div class="relative flex items-center">
            <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <UIcon name="i-ph-envelope-simple-duotone" class="size-4.5" />
            </div>
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              :placeholder="$t('auth.common.emailPlaceholder')"
              class="w-full h-12 pl-10 pr-4 rounded-2xl neu-inset text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-mono"
              :class="fieldErrors.email ? 'ring-2 ring-rose-500/60' : 'focus:ring-emerald-500/50'"
            />
          </div>
          <div v-if="fieldErrors.email" class="text-[11px] font-mono text-rose-500">
            {{ fieldErrors.email }}
          </div>
        </div>

        <!-- Password Input Field -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label for="login-password" class="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {{ $t("auth.common.passwordLabel") }}
            </label>
            <NuxtLink
              to="/auth/forgot-password"
              class="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {{ $t("auth.common.forgotPasswordLink") }}
            </NuxtLink>
          </div>
          <div class="relative flex items-center">
            <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <UIcon name="i-ph-lock-key-duotone" class="size-4.5" />
            </div>
            <input
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              :placeholder="$t('auth.common.passwordPlaceholder')"
              class="w-full h-12 pl-10 pr-11 rounded-2xl neu-inset text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-mono"
              :class="fieldErrors.password ? 'ring-2 ring-rose-500/60' : 'focus:ring-emerald-500/50'"
            />
            <!-- Password Visibility Toggle -->
            <button
              type="button"
              class="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-1"
              :title="showPassword ? $t('auth.common.hidePassword') : $t('auth.common.showPassword')"
              @click="showPassword = !showPassword"
            >
              <UIcon
                :name="showPassword ? 'i-ph-eye-slash-duotone' : 'i-ph-eye-duotone'"
                class="size-4.5"
              />
            </button>
          </div>
          <div v-if="fieldErrors.password" class="text-[11px] font-mono text-rose-500">
            {{ fieldErrors.password }}
          </div>
        </div>

        <!-- Remember Me Checkbox -->
        <div class="flex items-center gap-2 pt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-300 font-medium">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="size-4 rounded neu-inset-sm text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
            <span>{{ $t("auth.common.rememberMe") }}</span>
          </label>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full h-12 rounded-2xl neu-btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <UIcon
              v-if="isLoading"
              name="i-ph-spinner-gap-bold"
              class="size-4.5 animate-spin"
            />
            <UIcon
              v-else
              name="i-ph-sign-in-bold"
              class="size-4.5"
            />
            <span>{{ isLoading ? $t("auth.login.loadingBtn") : $t("auth.login.submitBtn") }}</span>
          </button>
        </div>
      </form>

      <!-- Bottom Switch to Register -->
      <div class="pt-4 border-t border-black/5 dark:border-white/5 text-center text-xs text-slate-600 dark:text-slate-400">
        <span>{{ $t("auth.login.noAccount") }}</span>
        {{ " " }}
        <NuxtLink
          to="/auth/register"
          class="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          {{ $t("auth.login.registerLink") }}
        </NuxtLink>
      </div>
    </div>
  </AuthLayout>
</template>
