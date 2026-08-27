<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();
const { t } = useI18n();

const currentPath = computed(() => route.path);

const isDashboard = computed(
  () => currentPath.value === "/app" || currentPath.value === "/app/",
);
const isDiagnosis = computed(() =>
  currentPath.value.startsWith("/app/diagnosis"),
);
const isHistory = computed(() => currentPath.value.startsWith("/app/history"));

const activeIndex = computed(() => {
  if (isDashboard.value) return 0;
  if (isDiagnosis.value) return 1;
  if (isHistory.value) return 2;
  return -1;
});

const springTransition = { type: "spring", stiffness: 400, damping: 40, mass: 0.75 };
</script>

<template>
  <nav
    class="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-40 lg:hidden rounded-2xl sm:rounded-3xl neu-glass px-2 py-1.5 select-none"
    aria-label="Mobile Navigasi Lapangan"
  >
    <div class="relative grid grid-cols-3 items-center w-full h-full">
      <!-- Absolute Sliding Pill Indicator -->
      <div
        v-if="activeIndex >= 0"
        class="absolute inset-y-0 left-0 w-1/3 transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu flex items-center justify-center pointer-events-none z-0"
        :style="{
          transform: `translateX(${activeIndex * 100}%)`,
          opacity: activeIndex === 1 ? 0 : 1,
          scale: activeIndex === 1 ? '0.7' : '1',
        }"
      >
        <div class="w-[88%] h-full rounded-xl neu-pressed"></div>
      </div>

      <!-- Dashboard Button -->
      <NuxtLink
        to="/app"
        class="relative flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl cursor-pointer transition-all duration-250 z-10"
        :class="isDashboard ? '' : 'hover:opacity-80'"
      >
        <UIcon
          :name="isDashboard ? 'i-ph-cube-focus-fill' : 'i-ph-cube-focus-duotone'"
          class="relative z-10 size-5 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          :class="isDashboard ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-600 dark:text-slate-400'"
        />
        <span
          class="relative z-10 text-[10px] font-mono leading-none transition-colors duration-250"
          :class="isDashboard ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'"
        >{{ $t("appStudio.nav.dashboard") }}</span>
      </NuxtLink>

      <!-- Center Elevated Diagnosis Trigger Button -->
      <NuxtLink
        to="/app/diagnosis"
        class="relative -mt-7 group flex flex-col items-center cursor-pointer z-20"
        aria-label="Mulai Diagnosa"
      >
        <div
          class="size-14 rounded-full neu-btn-primary flex items-center justify-center border-4 border-[#EEF3F0] dark:border-[#111413] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-lg"
          :class="isDiagnosis ? 'scale-105 ring-2 ring-emerald-500/50' : 'hover:scale-105'"
        >
          <UIcon
            name="i-ph-scan-bold"
            class="size-6 text-white transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
            :class="isDiagnosis ? 'scale-110' : ''"
          />
        </div>
        <span
          class="text-[10px] font-mono font-bold mt-1 transition-colors duration-250"
          :class="
            isDiagnosis
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-300'
          "
        >
          {{ $t("appStudio.nav.diagnosis") }}
        </span>
      </NuxtLink>

      <!-- History Button -->
      <NuxtLink
        to="/app/history"
        class="relative flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl cursor-pointer transition-all duration-250 z-10"
        :class="isHistory ? '' : 'hover:opacity-80'"
      >
        <UIcon
          :name="
            isHistory
              ? 'i-ph-clock-countdown-fill'
              : 'i-ph-clock-countdown-duotone'
          "
          class="relative z-10 size-5 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          :class="isHistory ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-600 dark:text-slate-400'"
        />
        <span
          class="relative z-10 text-[10px] font-mono leading-none transition-colors duration-250"
          :class="isHistory ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'"
        >{{ $t("appStudio.nav.history") }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
