<script setup lang="ts">

const props = defineProps<{
  record: ScanRecord | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const formatDate = (isoString: string) => {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return isoString;
  }
};
</script>

<template>
  <div
    v-if="isOpen && record"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    role="dialog"
    aria-modal="true"
  >
    <!-- Backdrop Overlay -->
    <div
      class="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
      @click="emit('close')"
    />

    <!-- Modal Content Window -->
    <div
      class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl neu-flat border border-black/5 dark:border-white/10 shadow-2xl p-5 sm:p-7 space-y-6 z-10 text-slate-900 dark:text-slate-100"
    >
      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 neu-inset-sm px-3 py-1 rounded-xl">
              {{ $t("appStudio.history.recipeModal.title") }}
            </span>
            <span class="text-xs font-mono text-slate-500">
              {{ formatDate(record.timestamp) }}
            </span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {{ record.label }}
          </h3>
          <p class="text-xs font-mono text-slate-500 italic">
            Pathogen: {{ record.scientificName }}
          </p>
        </div>

        <button
          type="button"
          class="size-9 rounded-2xl neu-btn flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
          :aria-label="$t('appStudio.history.recipeModal.close')"
          @click="emit('close')"
        >
          <UIcon name="i-ph-x-bold" class="size-4" />
        </button>
      </div>

      <!-- Severity & Confidence Summary Bar -->
      <div class="grid grid-cols-2 gap-3.5">
        <div class="p-4 rounded-2xl neu-inset space-y-1.5">
          <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase">
            {{ $t("appStudio.results.statusLabel") }}
          </div>
          <div>
            <span
              class="text-xs font-bold rounded-xl px-3 py-1 inline-block"
              :class="
                record.severityType === 'emergency'
                  ? 'neu-rose-inset text-rose-800 dark:text-rose-300'
                  : record.severityType === 'moderate'
                    ? 'neu-amber-inset text-amber-800 dark:text-amber-300'
                    : 'neu-emerald-inset text-emerald-800 dark:text-emerald-300'
              "
            >
              {{ record.severityLabel }}
            </span>
          </div>
        </div>

        <div class="p-4 rounded-2xl neu-inset space-y-1.5">
          <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase">
            {{ $t("appStudio.results.confidenceLabel") }}
          </div>
          <div class="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {{ record.confidence }}
          </div>
        </div>
      </div>

      <!-- Section 1: Visual Symptoms -->
      <div class="p-4 sm:p-5 rounded-2xl neu-flat-sm space-y-3">
        <div class="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-ph-warning-diamond-duotone" class="size-4 text-amber-500" />
          <span>{{ $t("catalog.symptomsTitle") }}</span>
        </div>
        <ul class="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <li v-for="(sym, idx) in record.symptoms" :key="idx" class="flex items-start gap-2.5 p-3 rounded-xl neu-inset-sm leading-relaxed">
            <UIcon name="i-ph-check-circle-duotone" class="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{{ sym }}</span>
          </li>
        </ul>
      </div>

      <!-- Section 2: 24h Field Protocol -->
      <div class="p-4 sm:p-5 rounded-2xl neu-flat-sm space-y-3.5">
        <div class="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-ph-clock-countdown-duotone" class="size-4 text-emerald-500" />
          <span>{{ $t("catalog.fieldActionsTitle") }}</span>
        </div>
        <div class="space-y-3">
          <div
            v-for="(trt, idx) in record.treatments"
            :key="idx"
            class="p-3.5 rounded-2xl neu-convex space-y-1"
          >
            <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <span class="size-5 rounded-full neu-inset-sm text-[10px] font-mono font-bold flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                {{ idx + 1 }}
              </span>
              <span>{{ trt.title }}</span>
            </div>
            <p class="text-xs text-slate-700 dark:text-slate-300 pl-7 leading-relaxed">
              {{ trt.detail }}
            </p>
          </div>
        </div>
      </div>

      <!-- Section 3: Chemical & Organic Treatment Dosage -->
      <div class="p-4 sm:p-5 rounded-2xl neu-emerald-inset space-y-3.5">
        <!-- Chemical & Knapsack Tank Dosage -->
        <div class="p-4 rounded-2xl neu-convex space-y-2">
          <div class="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <UIcon name="i-ph-flask-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>{{ $t("appStudio.results.chemicalHeading") }}</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {{ record.chemicalSolution }}
          </p>
          <div class="pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
            <UIcon name="i-ph-drop-duotone" class="size-3.5 shrink-0" />
            <span>{{ $t("appStudio.results.tankDosage") }}</span>
          </div>
        </div>

        <!-- Organic Formulation -->
        <div class="p-4 rounded-2xl neu-flat-sm space-y-1.5">
          <div class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <UIcon name="i-ph-shield-check-duotone" class="size-4 text-emerald-500" />
            <span>{{ $t("appStudio.results.organicHeading") }}</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ record.organicSolution }}
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end pt-2">
        <button
          type="button"
          class="h-11 px-6 rounded-2xl neu-btn-primary text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
          @click="emit('close')"
        >
          {{ $t("appStudio.history.recipeModal.close") }}
        </button>
      </div>
    </div>
  </div>
</template>
