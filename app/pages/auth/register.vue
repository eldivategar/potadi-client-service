<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from "vue";
import AuthLayout from "~/components/auth/AuthLayout.vue";
import SocialLoginGoogle from "~/components/auth/SocialLoginGoogle.vue";
import { registerSchema } from "~/utils/auth-schemas";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { signUpWithEmail, signInWithGoogle, isLoading, error: authError, isAuthenticated } = useAuth();

watchEffect(() => {
  if (isAuthenticated.value) {
    const target = (route.query.redirect as string) || "/app";
    router.push(target);
  }
});

useHead({
  title: "Daftar Akun Potadi Studio - Diagnosa Daun Kentang",
  meta: [
    {
      name: "description",
      content: "Buat akun Potadi untuk menyimpan riwayat patologi tanaman dan resep pengendalian hawar daun.",
    },
  ],
});

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const fieldErrors = reactive<Record<string, string>>({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const localError = ref<string | null>(null);

// Password strength calculation
const passwordStrength = computed(() => {
  const p = form.password;
  if (!p) return { score: 0, text: "", color: "bg-slate-300 dark:bg-slate-700" };
  
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p) || (p.length >= 12 && /[0-9]/.test(p))) score++;

  if (score === 1) {
    return { score: 1, text: t("auth.register.strengthWeak"), color: "bg-rose-500", textColor: "text-rose-500" };
  } else if (score === 2) {
    return { score: 2, text: t("auth.register.strengthMedium"), color: "bg-amber-500", textColor: "text-amber-500" };
  } else {
    return { score: 3, text: t("auth.register.strengthStrong"), color: "bg-emerald-500", textColor: "text-emerald-500" };
  }
});

const isPasswordMatching = computed(() => {
  if (!form.confirmPassword) return true;
  return form.password === form.confirmPassword;
});

const handleSubmit = async () => {
  localError.value = null;
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);

  // Zod 4 Schema Validation
  const validation = registerSchema.safeParse({
    name: form.name,
    email: form.email,
    password: form.password,
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

  const result = await signUpWithEmail(validation.data.name, validation.data.email, validation.data.password);
  if (result.success) {
    const target = (route.query.redirect as string) || "/app";
    router.push(target);
  } else {
    localError.value = result.message || t("auth.errors.generalError");
  }
};

const handleGoogleSignUp = async () => {
  await signInWithGoogle();
};
</script>

<template>
  <AuthLayout>
    <div class="space-y-6">
      <!-- Card Title & Subtitle -->
      <div class="space-y-2 text-left">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ $t("auth.register.title") }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          {{ $t("auth.register.subtitle") }}
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

      <!-- Registration Form -->
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <!-- Full Name Input Field -->
        <div class="space-y-1.5">
          <label for="register-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {{ $t("auth.common.nameLabel") }}
          </label>
          <div class="relative flex items-center">
            <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <UIcon name="i-ph-user-duotone" class="size-4.5" />
            </div>
            <input
              id="register-name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              :placeholder="$t('auth.common.namePlaceholder')"
              class="w-full h-11 sm:h-12 pl-10 pr-4 rounded-2xl clean-input text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
              :class="fieldErrors.name ? 'ring-2 ring-rose-500/60 border-rose-500' : ''"
            />
          </div>
          <div v-if="fieldErrors.name" class="text-[11px] font-medium text-rose-500">
            {{ fieldErrors.name }}
          </div>
        </div>

        <!-- Email Input Field -->
        <div class="space-y-1.5">
          <label for="register-email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {{ $t("auth.common.emailLabel") }}
          </label>
          <div class="relative flex items-center">
            <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <UIcon name="i-ph-envelope-simple-duotone" class="size-4.5" />
            </div>
            <input
              id="register-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              :placeholder="$t('auth.common.emailPlaceholder')"
              class="w-full h-11 sm:h-12 pl-10 pr-4 rounded-2xl clean-input text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
              :class="fieldErrors.email ? 'ring-2 ring-rose-500/60 border-rose-500' : ''"
            />
          </div>
          <div v-if="fieldErrors.email" class="text-[11px] font-medium text-rose-500">
            {{ fieldErrors.email }}
          </div>
        </div>

        <!-- Password Input Field & Strength Indicator -->
        <div class="space-y-1.5">
          <label for="register-password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {{ $t("auth.common.passwordLabel") }}
          </label>
          <div class="relative flex items-center">
            <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <UIcon name="i-ph-lock-key-duotone" class="size-4.5" />
            </div>
            <input
              id="register-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              :placeholder="$t('auth.common.passwordPlaceholder')"
              class="w-full h-11 sm:h-12 pl-10 pr-11 rounded-2xl clean-input text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
              :class="fieldErrors.password ? 'ring-2 ring-rose-500/60 border-rose-500' : ''"
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

          <!-- Field error for password -->
          <div v-if="fieldErrors.password" class="text-[11px] font-medium text-rose-500">
            {{ fieldErrors.password }}
          </div>

          <!-- Password Strength Meter -->
          <div v-if="form.password" class="space-y-1 pt-1">
            <div class="grid grid-cols-3 gap-1.5 h-1.5 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200 dark:bg-white/10'"
              />
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200 dark:bg-white/10'"
              />
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200 dark:bg-white/10'"
              />
            </div>
            <div class="flex items-center justify-between text-[10px] font-mono">
              <span class="text-slate-500">Kekuatan Sandi:</span>
              <span :class="passwordStrength.textColor" class="font-bold">{{ passwordStrength.text }}</span>
            </div>
          </div>
        </div>

        <!-- Confirm Password Input Field -->
        <div class="space-y-1.5">
          <label for="register-confirm-password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {{ $t("auth.common.confirmPasswordLabel") }}
          </label>
          <div class="relative flex items-center">
            <div class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <UIcon name="i-ph-check-circle-duotone" class="size-4.5" />
            </div>
            <input
              id="register-confirm-password"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              :placeholder="$t('auth.common.confirmPasswordPlaceholder')"
              class="w-full h-11 sm:h-12 pl-10 pr-11 rounded-2xl clean-input text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
              :class="fieldErrors.confirmPassword || (form.confirmPassword && !isPasswordMatching) ? 'ring-2 ring-rose-500/60 border-rose-500' : ''"
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

        <!-- Terms Notice -->
        <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {{ $t("auth.common.termsNotice") }}
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
              name="i-ph-user-plus-bold"
              class="size-4.5"
            />
            <span>{{ isLoading ? $t("auth.register.loadingBtn") : $t("auth.register.submitBtn") }}</span>
          </button>
        </div>
      </form>

      <!-- Google Single Sign-On -->
      <SocialLoginGoogle
        mode="register"
        :disabled="isLoading"
        @google-click="handleGoogleSignUp"
      />

      <!-- Bottom Switch to Login -->
      <div class="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>{{ $t("auth.register.hasAccount") }}</span>
        {{ " " }}
        <NuxtLink
          to="/auth/login"
          class="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
        >
          {{ $t("auth.register.loginLink") }}
        </NuxtLink>
      </div>
    </div>
  </AuthLayout>
</template>
