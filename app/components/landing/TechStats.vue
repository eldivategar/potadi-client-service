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
    class="py-20 md:py-28 relative z-10 border-t border-b border-black/8 dark:border-white/10 bg-slate-100/30 dark:bg-neutral-950/40 backdrop-blur-[2px] transition-colors duration-300"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div
        class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <span
            class="text-xs font-mono text-emerald-700 dark:text-emerald-400 tracking-wider uppercase"
          >
            {{ $t("tech.eyebrow") }}
          </span>
          <h2
            class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1"
          >
            {{ $t("tech.title") }}
          </h2>
        </div>
        <div class="text-xs font-mono text-slate-500 dark:text-slate-400">
          {{ $t("tech.engineLabel") }}
          <span class="text-slate-900 dark:text-slate-200 font-semibold"
            >Potadi AgriVision Engine v1.0.4</span
          >
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
          class="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-black/8 dark:border-white/10 hover:border-emerald-500/40 shadow-sm dark:shadow-none transition-colors duration-200 flex flex-col justify-between space-y-4 transform-gpu"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-[11px] font-mono text-slate-500 dark:text-slate-400"
              >{{ spec.label }}</span
            >
            <UIcon
              :name="spec.icon"
              class="size-4 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div class="space-y-1 relative">
            <!-- Subtle Metric Glow -->
            <div
              class="absolute -top-3 -left-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"
            />
            <div
              class="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight relative z-10"
            >
              {{ spec.value }}
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed relative z-10"
            >
              {{ spec.subtext }}
            </p>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
