<script setup lang="ts">
import { computed } from "vue";

const { t } = useI18n();

const benefits = computed(() => [
  {
    title: t("benefits.items.item1.title"),
    description: t("benefits.items.item1.description"),
    icon: "i-ph-sun-duotone",
    tag: t("benefits.items.item1.tag"),
    highlight: t("benefits.items.item1.highlight"),
  },
  {
    title: t("benefits.items.item2.title"),
    description: t("benefits.items.item2.description"),
    icon: "i-ph-hand-pointing-duotone",
    tag: t("benefits.items.item2.tag"),
    highlight: t("benefits.items.item2.highlight"),
  },
  {
    title: t("benefits.items.item3.title"),
    description: t("benefits.items.item3.description"),
    icon: "i-ph-wifi-slash-duotone",
    tag: t("benefits.items.item3.tag"),
    highlight: t("benefits.items.item3.highlight"),
  },
  {
    title: t("benefits.items.item4.title"),
    description: t("benefits.items.item4.description"),
    icon: "i-ph-list-checks-duotone",
    tag: t("benefits.items.item4.tag"),
    highlight: t("benefits.items.item4.highlight"),
  },
]);
</script>

<template>
  <section id="benefits" class="py-24 md:py-32 relative z-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="max-w-3xl space-y-4 mb-12 sm:mb-16">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }"
        >
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-wider inline-block mb-3"
          >
            {{ $t("benefits.standardLabel") }}
          </span>

          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            {{ $t("benefits.title") }}
          </h2>
        </Motion>
        <p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          {{ $t("benefits.subtitle") }}
        </p>
      </div>

      <!-- 2-Column Clean Modern Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Motion
          v-for="(item, index) in benefits"
          :key="item.title"
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
          <div
            class="h-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div class="flex items-center justify-between">
              <div
                class="size-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20"
              >
                <UIcon :name="item.icon" class="size-6" />
              </div>
              <span
                class="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider"
              >
                {{ item.tag }}
              </span>
            </div>

            <div class="space-y-3">
              <h3
                class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
              >
                {{ item.title }}
              </h3>
              <p
                class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                {{ item.description }}
              </p>
            </div>

            <div
              class="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
            >
              <span class="font-medium">{{ $t("benefits.standardLabel") }}</span>
              <span class="text-emerald-700 dark:text-emerald-400 font-bold font-mono">{{
                item.highlight
              }}</span>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
