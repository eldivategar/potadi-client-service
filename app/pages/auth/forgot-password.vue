<script setup lang="ts">
import { ref } from "vue";
import AuthLayout from "~/components/auth/AuthLayout.vue";
import { forgotPasswordSchema } from "~/utils/auth-schemas";

const { t } = useI18n();
const { requestPasswordReset, isLoading, error: authError } = useAuth();

useHead({
  title: "Lupa Kata Sandi - Potadi Studio",
  meta: [
    {
      name: "description",
      content: "Pemulihan kata sandi akun Potadi Studio untuk agronomis dan petani kentang.",
    },
  ],
});

const email = ref("");
const emailError = ref<string | null>(null);
const isSubmitted = ref(false);
const localError = ref<string | null>(null);

const handleSubmit = async () => {
  localError.value = null;
  emailError.value = null;

  // Zod 4 Validation
  const validation = forgotPasswordSchema.safeParse({ email: email.value });
  if (!validation.success) {
    emailError.value = validation.error.issues[0]?.message || t("auth.errors.invalidEmail");
    return;
  }

  const result = await requestPasswordReset(validation.data.email);
  if (result.success) {
    isSubmitted.value = true;
  } else {
    localError.value = result.message || t("auth.errors.generalError");
  }
};

const handleResend = async () => {
  isSubmitted.value = false;
  await handleSubmit();
};
</script>

<template>
  <AuthLayout>
    <div class="space-y-6">
      <!-- State 1: Success Message -->
      <div v-if="isSubmitted" class="space-y-6 text-center py-2">
        <div class="size-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <UIcon name="i-ph-paper-plane-tilt-fill" class="size-8 text-emerald-500 animate-bounce" />
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ $t("auth.forgotPassword.successTitle") }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            {{ $t("auth.forgotPassword.successDesc", { email }) }}
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] text-xs text-slate-600 dark:text-slate-400 space-y-1 text-left">
          <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <UIcon name="i-ph-info-duotone" class="size-4 text-emerald-500" />
            <span>Petunjuk Pemulihan:</span>
          </div>
          <p>Jika email tidak muncul di kotak masuk, periksa folder spam atau promosi dalam 1–2 menit.</p>
        </div>

        <div class="space-y-3 pt-2">
          <button
            type="button"
            class="w-full h-11 sm:h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.07] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-all active:scale-[0.985]"
            @click="handleResend"
          >
            {{ $t("auth.forgotPassword.resendBtn") }}
          </button>

          <NuxtLink
            to="/auth/login"
            class="block w-full text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
          >
            {{ $t("auth.forgotPassword.backToLogin") }}
          </NuxtLink>
        </div>
      </div>

      <!-- State 2: Request Form -->
      <div v-else class="space-y-6">
        <!-- Title & Subtitle -->
        <div class="space-y-2 text-left">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ $t("auth.forgotPassword.title") }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            {{ $t("auth.forgotPassword.subtitle") }}
          </p>
        </div>

        <!-- Error Notification Alert -->
        <div
          v-if="localError || authError"
          class="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake"
          role="alert"
        >
          <UIcon name="i-ph-warning-octagon-duotone" class="size-4.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <span class="leading-relaxed">{{ localError || authError }}</span>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-1.5">
            <label for="forgot-email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {{ $t("auth.common.emailLabel") }}
            </label>
            <div class="relative flex items-center">
              <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                <UIcon name="i-ph-envelope-simple-duotone" class="size-4.5" />
              </div>
              <input
                id="forgot-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                :placeholder="$t('auth.common.emailPlaceholder')"
                class="w-full h-11 sm:h-12 pl-10 pr-4 rounded-2xl clean-input text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
                :class="emailError ? 'ring-2 ring-rose-500/60 border-rose-500' : ''"
              />
            </div>
            <div v-if="emailError" class="text-[11px] font-medium text-rose-500">
              {{ emailError }}
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full h-11 sm:h-12 rounded-2xl btn-solid-dark flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer transition-all active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UIcon
                v-if="isLoading"
                name="i-ph-spinner-gap-bold"
                class="size-4.5 animate-spin"
              />
              <UIcon
                v-else
                name="i-ph-paper-plane-right-bold"
                class="size-4.5"
              />
              <span>{{ isLoading ? $t("auth.forgotPassword.loadingBtn") : $t("auth.forgotPassword.submitBtn") }}</span>
            </button>
          </div>
        </form>

        <!-- Back to Login Link -->
        <div class="pt-2 text-center">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
          >
            <UIcon name="i-ph-arrow-left-bold" class="size-3.5" />
            <span>{{ $t("auth.forgotPassword.backToLogin") }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>
