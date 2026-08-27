<script setup lang="ts">
import { computed } from "vue";
import { useScroll, useTransform } from "motion-v";

const { t } = useI18n();

const perks = computed(() => [
  t("cta.perks.0"),
  t("cta.perks.1"),
  t("cta.perks.2"),
  t("cta.perks.3"),
]);

const { scrollYProgress } = useScroll();
const ctaGlowY = useTransform(scrollYProgress, [0.6, 1], ["-40px", "40px"]);
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
        <!-- Ambient Glowing Aura with Parallax Shift -->
        <Motion
          :style="{ y: ctaGlowY }"
          class="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-emerald-600/25 rounded-[40px] blur-2xl -z-10 pointer-events-none"
        />

        <div
          class="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-emerald-900 via-emerald-950 to-neutral-950 text-white shadow-2xl"
        >
          <!-- Background Radial Glow Inside -->
          <div
            class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none"
          />
          <div
            class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/40 blur-[100px] rounded-full pointer-events-none"
          />

          <div class="relative z-10 max-w-3xl space-y-8">
            <div class="space-y-4">
              <span
                class="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-emerald-300 border border-white/20 inline-block"
              >
                Mulai Diagnosa Gratis
              </span>
              <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
              >
                {{ $t("cta.title") }}
              </h2>
              <p
                class="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl"
              >
                {{ $t("cta.desc") }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <NuxtLink
                to="/app"
                class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-bold bg-white text-emerald-950 hover:bg-emerald-50 rounded-full shadow-lg shadow-black/25 active:scale-95 group transition-all"
              >
                <span>{{ $t("cta.button") }}</span>
                <UIcon name="i-ph-arrow-up-right-bold" class="size-4 text-emerald-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </NuxtLink>
            </div>

            <!-- Feature Perks (High Contrast on Dark Banner) -->
            <div
              class="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
            >
              <div
                v-for="perk in perks"
                :key="perk"
                class="flex items-center gap-2 font-medium text-slate-100 bg-white/10 border border-white/10 p-3 rounded-xl"
              >
                <UIcon
                  name="i-ph-check-circle-fill"
                  class="size-4 text-emerald-400 shrink-0"
                />
                <span class="truncate">{{ perk }}</span>
              </div>
            </div>
          </div>
        </div>
      </Motion>
    </div>
  </section>
</template>
