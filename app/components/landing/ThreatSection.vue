<script setup lang="ts">
import { computed } from "vue";
import { useScroll, useTransform } from "motion-v";

const { t } = useI18n();

const threatStats = computed(() => [
  {
    value: t("threat.stat1.value"),
    metric: t("threat.stat1.metric"),
    description: t("threat.stat1.description"),
    icon: "i-ph-warning-octagon-fill",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    border: "border-rose-500/20",
  },
  {
    value: t("threat.stat2.value"),
    unit: t("threat.stat2.unit"),
    metric: t("threat.stat2.metric"),
    description: t("threat.stat2.description"),
    icon: "i-ph-clock-countdown-fill",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    border: "border-amber-500/20",
  },
  {
    value: t("threat.stat3.value"),
    unit: t("threat.stat3.unit"),
    metric: t("threat.stat3.metric"),
    description: t("threat.stat3.description"),
    icon: "i-ph-lightning-fill",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    border: "border-emerald-500/20",
  },
]);

// 3D Staggered Parallax Transforms
const { scrollYProgress } = useScroll();
const col1Y = useTransform(scrollYProgress, [0.08, 0.45], ["20px", "-25px"]);
const col3Y = useTransform(scrollYProgress, [0.08, 0.45], ["-20px", "25px"]);
</script>

<template>
  <section
    id="threat"
    class="py-24 md:py-32 relative z-10 border-t border-slate-200/60 dark:border-white/5 transition-colors duration-350 overflow-hidden"
  >
    <!-- Ambient Threat Urgency Depth Glow -->
    <div
      class="absolute -top-10 left-1/4 w-[450px] h-[350px] bg-rose-500/5 dark:bg-rose-500/10 blur-[140px] rounded-full pointer-events-none -z-10"
    />
    <div
      class="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-amber-500/5 dark:bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="max-w-3xl space-y-5">
        <!-- Direct Editorial Headline -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }"
        >
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 uppercase tracking-wider inline-block mb-3"
          >
            {{ $t("threat.tagRisk") }}
          </span>

          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            {{ $t("threat.headline") }}
            <span
              class="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-500 dark:from-rose-400 dark:via-amber-400 dark:to-rose-300 bg-clip-text text-transparent"
            >
              {{ $t("threat.headlineHighlight") }}
            </span>
            {{ $t("threat.headlineSuffix") }}
          </h2>
        </Motion>

        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }"
        >
          <i18n-t
            keypath="threat.description"
            tag="p"
            class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
          >
            <template #p1>
              <span
                class="text-slate-900 dark:text-slate-100 font-serif italic font-semibold"
              >Phytophthora infestans</span>
            </template>
            <template #p2>
              <span
                class="text-slate-900 dark:text-slate-100 font-serif italic font-semibold"
              >Alternaria solani</span>
            </template>
          </i18n-t>
        </Motion>
      </div>

      <!-- 3 Clean Threat Metric Cards with Staggered Parallax -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 sm:mt-16 items-stretch">
        <Motion
          v-for="(stat, index) in threatStats"
          :key="stat.metric"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{
            duration: 0.5,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }"
          class="h-full transform-gpu"
        >
          <!-- Dedicated Inner Scroll Parallax Motion -->
          <Motion
            :style="{
              y: index === 0 ? col1Y : index === 2 ? col3Y : undefined,
            }"
            class="h-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div class="flex items-center justify-between">
              <div
                class="size-12 rounded-2xl flex items-center justify-center p-2.5"
                :class="[stat.bg, stat.color]"
              >
                <UIcon :name="stat.icon" class="size-6" />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-baseline gap-1.5 font-mono">
                <span
                  class="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
                >{{ stat.value }}</span>
                <span
                  v-if="stat.unit"
                  class="text-xl font-bold text-slate-500 dark:text-slate-400"
                >{{ stat.unit }}</span>
              </div>
              <h3
                class="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                {{ stat.metric }}
              </h3>
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                {{ stat.description }}
              </p>
            </div>
          </Motion>
        </Motion>
      </div>
    </div>
  </section>
</template>
