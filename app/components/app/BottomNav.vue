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

const springTransition = { type: "spring", stiffness: 400, damping: 40, mass: 0.75 };
</script>

<template>
  <nav
    class="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-40 lg:hidden rounded-2xl bg-white/95 dark:bg-[#121216]/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 px-4 py-1.5 flex items-center justify-around shadow-[0_10px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.5)] select-none"
    aria-label="Mobile Navigasi Lapangan"
  >
    <!-- Dashboard Button -->
    <NuxtLink
      to="/app"
      class="relative flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-xl cursor-pointer"
    >
      <!-- Magic Pill Background -->
      <Motion
        v-if="isDashboard"
        layout-id="bottom-nav-active-pill"
        :transition="springTransition"
        class="absolute inset-0 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 motion-reduce:transition-none"
        aria-hidden="true"
      />
      <UIcon
        :name="isDashboard ? 'i-ph-cube-focus-fill' : 'i-ph-cube-focus-duotone'"
        class="relative z-10 size-5 transition-all duration-300"
        :class="isDashboard ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-500 dark:text-slate-400'"
        style="transition-timing-function: cubic-bezier(0.34,1.56,0.64,1)"
      />
      <span
        class="relative z-10 text-[10px] font-mono leading-none transition-colors duration-200"
        :class="isDashboard ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'"
      >{{ $t("appStudio.nav.dashboard") }}</span>
    </NuxtLink>

    <!-- Center Elevated Diagnosis Trigger Button -->
    <NuxtLink
      to="/app/diagnosis"
      class="relative -mt-6 group flex flex-col items-center"
      aria-label="Mulai Diagnosa"
    >
      <div
        class="size-13 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.5)] border-4 border-[#F8FAF9] dark:border-[#09090B] group-active:scale-95 transition-transform"
        :class="{ 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-[#09090B] scale-105': isDiagnosis }"
        style="transition-timing-function: cubic-bezier(0.34,1.56,0.64,1)"
      >
        <UIcon
          name="i-ph-scan-bold"
          class="size-6 text-slate-950 transition-transform duration-300"
          :class="isDiagnosis ? 'scale-110' : ''"
          style="transition-timing-function: cubic-bezier(0.34,1.56,0.64,1)"
        />
      </div>
      <span
        class="text-[10px] font-mono font-bold mt-1 transition-colors duration-200"
        :class="
          isDiagnosis
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-600 dark:text-slate-400'
        "
      >
        {{ $t("appStudio.nav.diagnosis") }}
      </span>
    </NuxtLink>

    <!-- History Button -->
    <NuxtLink
      to="/app/history"
      class="relative flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-xl cursor-pointer"
    >
      <!-- Magic Pill Background -->
      <Motion
        v-if="isHistory"
        layout-id="bottom-nav-active-pill"
        :transition="springTransition"
        class="absolute inset-0 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 motion-reduce:transition-none"
        aria-hidden="true"
      />
      <UIcon
        :name="
          isHistory
            ? 'i-ph-clock-countdown-fill'
            : 'i-ph-clock-countdown-duotone'
        "
        class="relative z-10 size-5 transition-all duration-300"
        :class="isHistory ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-500 dark:text-slate-400'"
        style="transition-timing-function: cubic-bezier(0.34,1.56,0.64,1)"
      />
      <span
        class="relative z-10 text-[10px] font-mono leading-none transition-colors duration-200"
        :class="isHistory ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'"
      >{{ $t("appStudio.nav.history") }}</span>
    </NuxtLink>
  </nav>
</template>
