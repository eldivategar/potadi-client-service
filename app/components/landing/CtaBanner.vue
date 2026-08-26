<script setup lang="ts">
import { computed } from "vue";

const { t } = useI18n();

const perks = computed(() => [
  t("cta.perks.0"),
  t("cta.perks.1"),
  t("cta.perks.2"),
  t("cta.perks.3"),
]);
</script>

<template>
  <section class="py-20 md:py-28 relative z-10 overflow-hidden">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
      <Motion
        :initial="{ opacity: 0, y: 24 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, margin: '-50px' }"
        :transition="{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }"
        class="relative transform-gpu"
      >
        <!-- Ambient Outer Glowing Aura (Synchronized with Card Entrance) -->
        <div
          class="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-emerald-600/30 rounded-[36px] blur-2xl -z-10 pointer-events-none"
        />

        <div
          class="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-emerald-500/30 bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-950/80 dark:via-neutral-900 dark:to-neutral-950 shadow-[0_12px_40px_rgba(5,150,105,0.25)] dark:shadow-[0_0_80px_rgba(16,185,129,0.25)]"
        >
          <!-- Background Radial Glow Inside -->
          <div
            class="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none"
          />
          <div
            class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 dark:bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none"
          />

          <div class="relative z-10 max-w-3xl space-y-8">
            <div class="space-y-4">
              <span
                class="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-white/20 dark:bg-emerald-500/20 text-white dark:text-emerald-300 border border-white/30 dark:border-emerald-500/30"
              >
                {{ $t("cta.badge") }}
              </span>
              <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
              >
                {{ $t("cta.title") }}
              </h2>
              <p
                class="text-base sm:text-lg text-emerald-50 dark:text-slate-300 leading-relaxed max-w-2xl"
              >
                {{ $t("cta.desc") }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <NuxtLink
                to="/app"
                class="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold bg-white text-emerald-950 hover:bg-emerald-50 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_0_35px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-all duration-150"
              >
                <span>{{ $t("cta.button") }}</span>
                <UIcon name="i-ph-arrow-up-right-bold" class="size-5" />
              </NuxtLink>
            </div>

            <!-- Feature Perks -->
            <div
              class="pt-6 border-t border-white/20 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <div
                v-for="perk in perks"
                :key="perk"
                class="flex items-center gap-2 text-xs font-medium text-white dark:text-slate-300"
              >
                <UIcon
                  name="i-ph-check-circle-fill"
                  class="size-4 text-emerald-200 dark:text-emerald-400 shrink-0"
                />
                <span>{{ perk }}</span>
              </div>
            </div>
          </div>
        </div>
      </Motion>
    </div>
  </section>
</template>
