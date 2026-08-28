<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    mode?: "login" | "register";
    disabled?: boolean;
  }>(),
  {
    mode: "login",
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "google-click"): void;
}>();
</script>

<template>
  <div class="space-y-4">
    <!-- Google Single Sign-On Button -->
    <button
      type="button"
      :disabled="disabled"
      class="w-full h-11 sm:h-12 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.07] hover:border-slate-300 dark:hover:border-white/20 flex items-center justify-center gap-3 text-slate-800 dark:text-slate-100 font-medium text-xs sm:text-sm cursor-pointer transition-all duration-200 active:scale-[0.985] shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
      @click="emit('google-click')"
    >
      <!-- Google Official Color SVG Icon -->
      <svg class="size-4.5 sm:size-5 shrink-0 transition-transform group-hover:scale-105 duration-200" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>

      <span class="font-semibold tracking-tight">
        {{ mode === 'register' ? $t('auth.common.googleSignUp') : $t('auth.common.googleContinue') }}
      </span>
    </button>

    <!-- Divider: Or with email -->
    <div class="relative flex items-center justify-center py-1">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-200/80 dark:border-white/[0.08]" />
      </div>
      <div class="relative px-3 bg-white dark:bg-[#111513] text-[11px] font-medium text-slate-400 dark:text-slate-500">
        {{ mode === 'register' ? $t('auth.common.orRegisterWithEmail') : $t('auth.common.orWithEmail') }}
      </div>
    </div>
  </div>
</template>
