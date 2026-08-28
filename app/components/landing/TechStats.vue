<script setup lang="ts">
import { computed } from "vue";

const { t } = useI18n();

const techSpecs = computed(() => [
  {
    label: t("tech.specs.latency.label"),
    value: t("tech.specs.latency.value"),
    subtext: t("tech.specs.latency.subtext"),
    icon: "i-ph-lightning-duotone",
  },
  {
    label: t("tech.specs.accuracy.label"),
    value: t("tech.specs.accuracy.value"),
    subtext: t("tech.specs.accuracy.subtext"),
    icon: "i-ph-shield-check-duotone",
  },
  {
    label: t("tech.specs.offline.label"),
    value: t("tech.specs.offline.value"),
    subtext: t("tech.specs.offline.subtext"),
    icon: "i-ph-wifi-slash-duotone",
  },
  {
    label: t("tech.specs.classes.label"),
    value: t("tech.specs.classes.value"),
    subtext: t("tech.specs.classes.subtext"),
    icon: "i-ph-dna-duotone",
  },
]);
</script>

<template>
  <section
    id="tech"
    class="py-20 md:py-28 relative z-10 border-t border-b border-slate-200/60 dark:border-white/5 transition-colors duration-350"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div
        class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div class="space-y-3">
          <span
            class="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 tracking-wider uppercase font-semibold px-3 py-1 rounded-full inline-block"
          >
            {{ $t("tech.eyebrow") }}
          </span>
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            {{ $t("tech.title") }}
          </h2>
        </div>
      </div>

      <!-- Precision Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Motion
          v-for="(spec, index) in techSpecs"
          :key="spec.label"
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{
            duration: 0.45,
            delay: index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }"
          class="p-6 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
            >
              {{ spec.label }}
            </span>
            <div class="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UIcon
                :name="spec.icon"
                class="size-4.5 text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>

          <div class="space-y-1">
            <div
              class="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight"
            >
              {{ spec.value }}
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono"
            >
              {{ spec.subtext }}
            </p>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
