<script setup lang="ts">
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";

defineProps<{
  title?: string;
  subtitle?: string;
}>();

const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <div
    class="min-h-screen w-full bg-[#EEF3F0] dark:bg-[#111413] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative lg:h-screen lg:overflow-hidden transition-colors duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200"
  >
    <!-- =========================================================================
         LEFT COLUMN: Fixed / Sticky Minimalist Botanical Visual Panel (Desktop >= 1024px)
         ========================================================================= -->
    <aside
      class="hidden lg:flex lg:w-[48%] xl:w-[45%] lg:h-full lg:sticky lg:top-0 relative p-10 xl:p-14 flex-col justify-between bg-[#0B0F0D] text-white z-10 select-none overflow-hidden shrink-0"
      aria-label="Potadi Visual Panel"
    >
      <!-- Background Botanical Photography with Dark Ambient Scrim -->
      <div class="absolute inset-0 pointer-events-none">
        <img
          src="/images/sample-leafs/healthy-leaf.jpg"
          alt="Potato Foliage"
          class="w-full h-full object-cover opacity-25 scale-105 filter saturate-150 contrast-125"
        />
        <!-- Multi-layer Soft Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/60 to-[#0B0F0D]/80" />
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B0F0D]" />
        <div class="absolute -top-24 -left-24 size-96 rounded-full bg-emerald-500/15 blur-[100px]" />
        <div class="absolute -bottom-24 -right-24 size-96 rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <!-- Top: Minimalist Clean Brand Header -->
      <div class="relative z-10">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <div
            class="size-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform overflow-hidden"
          >
            <img src="/og-logo-emerald.png" alt="Potadi Logo" class="w-full h-full object-contain" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold text-white tracking-tight leading-none">
              Potadi
            </span>
            <span class="size-1.5 rounded-full bg-emerald-400" />
          </div>
        </NuxtLink>
      </div>

      <!-- Center / Bottom: Ultra-clean Statement & Floating Metric -->
      <div class="relative z-10 space-y-8 my-auto py-8 max-w-md">
        <!-- Clean Headline -->
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-mono">
            <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Farm Telemetry AI</span>
          </div>

          <h1 class="text-2xl xl:text-3xl font-semibold text-white/95 leading-snug tracking-tight">
            Diagnosa fitopatologi daun kentang secara presisi dan 100% offline.
          </h1>
        </div>

        <!-- Sleek Floating Glass Quote Pill -->
        <div class="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-3">
          <p class="text-xs text-white/80 leading-relaxed font-normal">
            "Sistem deteksi dini yang dirancang khusus untuk kenyamanan agronomis dan petani di area perkebunan dataran tinggi."
          </p>
          <div class="flex items-center justify-between text-[11px] font-mono text-white/50 border-t border-white/5 pt-2.5">
            <span>Dieng • Bromo • Pangalengan</span>
            <span class="text-emerald-400 font-medium">98.6% Accuracy</span>
          </div>
        </div>
      </div>

      <!-- Bottom: Status Indicator -->
      <div class="relative z-10 flex items-center justify-between text-xs font-mono text-white/40 border-t border-white/10 pt-4">
        <span>v1.0.4 • Edge Neural Engine</span>
        <span class="flex items-center gap-1.5 text-emerald-400/90">
          <span class="size-1.5 rounded-full bg-emerald-400" />
          <span>Offline Ready</span>
        </span>
      </div>
    </aside>

    <!-- =========================================================================
         RIGHT COLUMN: Scrollable Interactive Auth Form Area
         ========================================================================= -->
    <main
      class="flex-1 w-full min-h-screen lg:min-h-0 lg:h-full lg:overflow-y-auto flex flex-col justify-between p-4 sm:p-6 lg:p-10 xl:p-12 z-10 scroll-smooth"
      role="main"
    >
      <!-- Top Actions Bar: Back Button, Language, Theme Switcher -->
      <div class="w-full max-w-md mx-auto flex items-center justify-between gap-3 pb-6 shrink-0">
        <!-- Back to Home -->
        <NuxtLink
          to="/"
          class="neu-btn px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
        >
          <UIcon name="i-ph-arrow-left-bold" class="size-3.5" />
          <span>{{ $t("auth.common.backToHome") }}</span>
        </NuxtLink>

        <!-- Utility Controls: Language & Theme -->
        <div class="flex items-center gap-2">
          <!-- Language Switcher Component -->
          <LanguageSwitcher />

          <!-- Theme Mode Toggle Button -->
          <button
            type="button"
            class="size-9 rounded-2xl neu-btn flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all cursor-pointer relative overflow-hidden"
            :title="$t('nav.themeToggleLight')"
            @click="toggleTheme"
          >
            <ClientOnly>
              <div class="relative size-4.5 flex items-center justify-center">
                <UIcon
                  name="i-ph-sun-dim-duotone"
                  class="size-4.5 absolute inset-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] text-amber-500 dark:text-slate-300"
                  :class="colorMode.value === 'dark' ? 'opacity-0 rotate-90 scale-50 pointer-events-none' : 'opacity-100 rotate-0 scale-100'"
                />
                <UIcon
                  name="i-ph-moon-stars-duotone"
                  class="size-4.5 absolute inset-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] text-emerald-400"
                  :class="colorMode.value === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50 pointer-events-none'"
                />
              </div>
              <template #fallback>
                <span class="size-4.5 inline-block" />
              </template>
            </ClientOnly>
          </button>
        </div>
      </div>

      <!-- Mobile Brand Header (< 1024px) -->
      <div class="lg:hidden w-full max-w-md mx-auto mb-6 text-center shrink-0">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 group">
          <div
            class="size-10 rounded-2xl neu-convex flex items-center justify-center p-1.5 shrink-0 overflow-hidden"
          >
            <img src="/og-logo-emerald.png" alt="Potadi Logo" class="w-full h-full object-contain block dark:hidden" />
            <img src="/og-logo.png" alt="Potadi Logo" class="w-full h-full object-contain hidden dark:block" />
          </div>
          <span class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Potadi Studio
          </span>
        </NuxtLink>
      </div>

      <!-- Main Card Container with Slot (Vertically Centered when not overflowing) -->
      <div class="w-full max-w-md mx-auto my-auto py-4">
        <div class="rounded-3xl neu-flat p-6 sm:p-8 space-y-6">
          <slot />
        </div>
      </div>

      <!-- Bottom Disclaimer -->
      <div class="w-full max-w-md mx-auto pt-6 pb-2 text-center text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
        Potadi Botanical AI &copy; 2026. {{ $t("footer.rightsReserved") }}
      </div>
    </main>
  </div>
</template>
