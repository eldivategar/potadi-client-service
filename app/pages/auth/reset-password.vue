<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AuthLayout from "~/components/auth/AuthLayout.vue";
import { useAuth } from "~/composables/useAuth";
import { resetPasswordSchema } from "~/utils/auth-schemas";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { resetPassword, isLoading, error: authError } = useAuth();

useHead({
  title: "Atur Ulang Kata Sandi - Potadi Studio",
  meta: [
    {
      name: "description",
      content: "Atur kata sandi baru untuk akun Potadi Studio Anda.",
    },
  ],
});

const token = ref("");
const form = reactive({
  newPassword: "",
  confirmPassword: "",
});

const fieldErrors = reactive<Record<string, string>>({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSuccess = ref(false);
const localError = ref<string | null>(null);

onMounted(() => {
  if (route.query.token) {
    token.value = String(route.query.token);
  }
});

const handleSubmit = async () => {
  localError.value = null;
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);

  // Zod 4 Validation
  const validation = resetPasswordSchema.safeParse({
    newPassword: form.newPassword,
    confirmPassword: form.confirmPassword,
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

  const result = await resetPassword(token.value || "default-token", validation.data.newPassword);
  if (result.success) {
    isSuccess.value = true;
    setTimeout(() => {
      router.push("/auth/login");
    }, 2500);
  } else {
    localError.value = result.message || t("auth.errors.generalError");
  }
};
</script>

<template>
  <AuthLayout>
    <div class="space-y-6">
      <!-- Success State -->
      <div v-if="isSuccess" class="space-y-6 text-center py-4">
        <div class="size-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <UIcon name="i-ph-check-circle-fill" class="size-8 text-emerald-500 animate-pulse" />
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ $t("auth.resetPassword.successTitle") }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">
            {{ $t("auth.resetPassword.successDesc") }}
          </p>
        </div>

        <div class="pt-2">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center justify-center w-full h-11 sm:h-12 rounded-2xl btn-solid-dark text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Menuju Halaman Masuk &rarr;
          </NuxtLink>
        </div>
      </div>

      <!-- Form State -->
      <div v-else class="space-y-6">
        <!-- Title & Subtitle -->
        <div class="space-y-2 text-left">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ $t("auth.resetPassword.title") }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            {{ $t("auth.resetPassword.subtitle") }}
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
          <!-- New Password Input Field -->
          <div class="space-y-1.5">
            <label for="reset-new-password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {{ $t("auth.resetPassword.newPasswordLabel") }}
            </label>
            <div class="relative flex items-center">
              <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                <UIcon name="i-ph-lock-key-duotone" class="size-4.5" />
              </div>
              <input
                id="reset-new-password"
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                :placeholder="$t('auth.common.passwordPlaceholder')"
                class="w-full h-11 sm:h-12 pl-10 pr-11 rounded-2xl clean-input text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
                :class="fieldErrors.newPassword ? 'ring-2 ring-rose-500/60 border-rose-500' : ''"
              />
              <button
                type="button"
                class="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-1 transition-colors"
                :title="showPassword ? $t('auth.common.hidePassword') : $t('auth.common.showPassword')"
                @click="showPassword = !showPassword"
              >
                <UIcon
                  :name="showPassword ? 'i-ph-eye-slash-duotone' : 'i-ph-eye-duotone'"
                  class="size-4.5"
                />
              </button>
            </div>
            <div v-if="fieldErrors.newPassword" class="text-[11px] font-medium text-rose-500">
              {{ fieldErrors.newPassword }}
            </div>
          </div>

          <!-- Confirm New Password Input Field -->
          <div class="space-y-1.5">
            <label for="reset-confirm-password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {{ $t("auth.common.confirmPasswordLabel") }}
            </label>
            <div class="relative flex items-center">
              <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                <UIcon name="i-ph-check-circle-duotone" class="size-4.5" />
              </div>
              <input
                id="reset-confirm-password"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                :placeholder="$t('auth.common.confirmPasswordPlaceholder')"
                class="w-full h-11 sm:h-12 pl-10 pr-11 rounded-2xl clean-input text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
                :class="fieldErrors.confirmPassword ? 'ring-2 ring-rose-500/60 border-rose-500' : ''"
              />
              <button
                type="button"
                class="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-1 transition-colors"
                :title="showConfirmPassword ? $t('auth.common.hidePassword') : $t('auth.common.showPassword')"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <UIcon
                  :name="showConfirmPassword ? 'i-ph-eye-slash-duotone' : 'i-ph-eye-duotone'"
                  class="size-4.5"
                />
              </button>
            </div>
            <div v-if="fieldErrors.confirmPassword" class="text-[11px] font-medium text-rose-500">
              {{ fieldErrors.confirmPassword }}
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
                name="i-ph-floppy-disk-bold"
                class="size-4.5"
              />
              <span>{{ isLoading ? $t("auth.resetPassword.loadingBtn") : $t("auth.resetPassword.submitBtn") }}</span>
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
