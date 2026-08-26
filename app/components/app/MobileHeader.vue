<script setup lang="ts">
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";

const colorMode = useColorMode();
const { t } = useI18n();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <header
    class="lg:hidden sticky top-0 z-30 bg-[#F8FAF9]/90 dark:bg-[#09090B]/90 backdrop-blur-xl border-b border-black/8 dark:border-white/10 px-4 py-2.5 flex items-center justify-between select-none"
  >
    <!-- Left: Brand Logo -->
    <div class="flex items-center gap-2.5">
      <NuxtLink
        to="/"
        class="size-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        :aria-label="$t('appStudio.nav.backToLanding')"
      >
        <UIcon name="i-ph-arrow-left-bold" class="size-4" />
      </NuxtLink>

      <NuxtLink to="/app" class="flex items-center gap-2">
        <div class="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <UIcon name="i-ph-leaf-fill" class="size-4" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Potadi
          </span>
          <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
            Studio
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- Right: Controls -->
    <div class="flex items-center gap-2 text-xs font-mono">
      <LanguageSwitcher />

      <button
        type="button"
        class="size-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all cursor-pointer"
        :aria-label="
          colorMode.value === 'dark'
            ? $t('nav.themeToggleLight')
            : $t('nav.themeToggleDark')
        "
        @click="toggleTheme"
      >
        <ClientOnly>
          <UIcon
            :name="
              colorMode.value === 'dark'
                ? 'i-ph-sun-dim-duotone'
                : 'i-ph-moon-stars-duotone'
            "
            class="size-4"
          />
          <template #fallback>
            <span class="size-4 inline-block" />
          </template>
        </ClientOnly>
      </button>

      <div
        class="size-2 rounded-full bg-emerald-500 animate-pulse ml-0.5"
        :title="$t('appStudio.statusActive')"
      />
    </div>
  </header>
</template>
