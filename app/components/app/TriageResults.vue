<script setup lang="ts">
import type { LeafClassData } from "~/composables/useDiagnose";

const { t } = useI18n();

const props = defineProps<{
  currentDiagnosis: LeafClassData | null;
  activeTab: "symptoms" | "protocol" | "solutions";
  isResearcherMode: boolean;
}>();

const emit = defineEmits<{
  (e: "update:activeTab", tab: "symptoms" | "protocol" | "solutions"): void;
  (e: "update:isResearcherMode", val: boolean): void;
}>();
</script>

<template>
  <section class="space-y-4" aria-label="Hasil Diagnosa & Tindakan Lapangan">
    <!-- 1. Placeholder State: Ready to Analyze (When no inference result yet) -->
    <div
      v-if="!currentDiagnosis"
      class="rounded-3xl neu-flat p-6 sm:p-8 space-y-6 select-none"
    >
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span
            class="neu-inset-sm px-3 py-1 rounded-xl text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider"
          >
            {{ $t("appStudio.results.readyToAnalyze.badge") }}
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {{ $t("appStudio.results.readyToAnalyze.title") }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {{ $t("appStudio.results.readyToAnalyze.desc") }}
        </p>
      </div>

      <!-- Feature Highlights -->
      <div class="space-y-2.5">
        <div class="p-3.5 rounded-2xl neu-inset flex items-center gap-3">
          <div class="size-8 rounded-xl neu-convex flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <UIcon name="i-ph-shield-check-bold" class="size-4.5" />
          </div>
          <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
            {{ $t("appStudio.results.readyToAnalyze.feature1") }}
          </span>
        </div>

        <div class="p-3.5 rounded-2xl neu-inset flex items-center gap-3">
          <div class="size-8 rounded-xl neu-convex flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <UIcon name="i-ph-chart-bar-bold" class="size-4.5" />
          </div>
          <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
            {{ $t("appStudio.results.readyToAnalyze.feature2") }}
          </span>
        </div>

        <div class="p-3.5 rounded-2xl neu-inset flex items-center gap-3">
          <div class="size-8 rounded-xl neu-convex flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <UIcon name="i-ph-first-aid-kit-bold" class="size-4.5" />
          </div>
          <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
            {{ $t("appStudio.results.readyToAnalyze.feature3") }}
          </span>
        </div>
      </div>

      <!-- Prompt Banner -->
      <div class="p-4 rounded-2xl neu-emerald-inset flex items-center gap-3">
        <UIcon name="i-ph-info-bold" class="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span class="text-xs font-mono font-medium text-emerald-800 dark:text-emerald-300">
          {{ $t("appStudio.results.readyToAnalyze.actionHint") }}
        </span>
      </div>
    </div>

    <!-- 2. Active Diagnosis Results (When inference result is available) -->
    <div v-else class="rounded-3xl neu-flat p-5 sm:p-6 space-y-6">
      <!-- Results Header: Disease Name & Pathogen -->
      <div>
        <div class="flex items-center justify-between">
          <span
            class="neu-inset-sm px-3 py-1 rounded-xl text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider"
          >
            {{ $t("appStudio.results.badgeLabel") }}
          </span>
        </div>
        <h2
          class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-2"
        >
          {{ t(currentDiagnosis.labelKey) }}
        </h2>
        <p
          class="text-xs font-mono text-slate-600 dark:text-slate-400 italic mt-1"
        >
          Pathogen: {{ currentDiagnosis.scientificName }}
        </p>
      </div>

      <!-- Severity Badge & Confidence Score Matrix (WCAG High Contrast) -->
      <div class="grid grid-cols-2 gap-3.5">
        <!-- Severity Card -->
        <div
          class="p-4 rounded-2xl neu-inset space-y-2"
        >
          <div
            class="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase"
          >
            {{ $t("appStudio.results.statusLabel") }}
          </div>
          <div>
            <span
              class="text-xs font-bold rounded-xl px-3 py-1.5 inline-block"
              :class="
                currentDiagnosis.severityType === 'emergency'
                  ? 'neu-rose-inset text-rose-800 dark:text-rose-300'
                  : currentDiagnosis.severityType === 'moderate'
                    ? 'neu-amber-inset text-amber-800 dark:text-amber-300'
                    : 'neu-emerald-inset text-emerald-800 dark:text-emerald-300'
              "
            >
              {{ t(currentDiagnosis.severityKey) }}
            </span>
          </div>
        </div>

        <!-- Confidence Card -->
        <div
          class="p-4 rounded-2xl neu-inset space-y-1.5"
        >
          <div
            class="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase"
          >
            {{ $t("appStudio.results.confidenceLabel") }}
          </div>
          <div
            class="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400"
          >
            {{ currentDiagnosis.confidence }}
          </div>
        </div>
      </div>

      <!-- 3 Actionable Field Tabs: Gejala, Tindakan 24 Jam, Solusi Obat -->
      <div class="space-y-4">
        <!-- Tab Switcher with Sliding Pill Indicator -->
        <div class="relative flex items-center p-1 rounded-2xl neu-inset overflow-hidden">
          <!-- Active Sliding Background Pill Indicator -->
          <div
            class="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-xl neu-convex shadow-sm transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none transform-gpu"
            :style="{
              transform:
                activeTab === 'symptoms'
                  ? 'translateX(0%)'
                  : activeTab === 'protocol'
                    ? 'translateX(100%)'
                    : 'translateX(200%)',
            }"
          />

          <button
            type="button"
            class="relative z-10 flex-1 py-2.5 px-2 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer"
            :class="
              activeTab === 'symptoms'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="emit('update:activeTab', 'symptoms')"
          >
            {{ $t("appStudio.results.tabs.symptoms") }}
          </button>
          <button
            type="button"
            class="relative z-10 flex-1 py-2.5 px-2 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer"
            :class="
              activeTab === 'protocol'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="emit('update:activeTab', 'protocol')"
          >
            {{ $t("appStudio.results.tabs.protocol") }}
          </button>
          <button
            type="button"
            class="relative z-10 flex-1 py-2.5 px-2 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer"
            :class="
              activeTab === 'solutions'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="emit('update:activeTab', 'solutions')"
          >
            {{ $t("appStudio.results.tabs.solutions") }}
          </button>
        </div>

        <!-- Sliding Tab Content Panes -->
        <div class="overflow-hidden rounded-2xl">
          <div
            class="flex w-[300%] transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu items-start"
            :style="{
              transform:
                activeTab === 'symptoms'
                  ? 'translateX(0%)'
                  : activeTab === 'protocol'
                    ? 'translateX(-33.333333%)'
                    : 'translateX(-66.666666%)',
            }"
          >
            <!-- Tab 1 Pane: Field Symptoms (Gejala Lapangan) -->
            <div class="w-1/3 shrink-0 pr-0.5">
              <div class="p-4 sm:p-5 rounded-2xl neu-flat-sm space-y-3">
                <div
                  class="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2"
                >
                  <UIcon
                    name="i-ph-warning-diamond-duotone"
                    class="size-4 text-amber-500"
                  />
                  <span>{{ $t("catalog.symptomsTitle") }}</span>
                </div>
                <ul
                  class="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <li
                    v-for="(symptom, idx) in currentDiagnosis.symptoms"
                    :key="idx"
                    class="flex items-start gap-2.5 p-3 rounded-xl neu-inset-sm leading-relaxed"
                  >
                    <UIcon
                      name="i-ph-check-circle-duotone"
                      class="size-4 text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>{{ symptom }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tab 2 Pane: 24h Protocol (Tindakan 24 Jam) -->
            <div class="w-1/3 shrink-0 px-0.5">
              <div class="p-4 sm:p-5 rounded-2xl neu-flat-sm space-y-3.5">
                <div
                  class="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2"
                >
                  <UIcon
                    name="i-ph-clock-countdown-duotone"
                    class="size-4 text-emerald-500"
                  />
                  <span>{{ $t("catalog.fieldActionsTitle") }}</span>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="(treatment, idx) in currentDiagnosis.treatments"
                    :key="idx"
                    class="p-3.5 rounded-2xl neu-convex space-y-1.5"
                  >
                    <div
                      class="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2"
                    >
                      <span
                        class="size-5 rounded-full neu-inset-sm text-[10px] font-mono font-bold flex items-center justify-center text-emerald-600 dark:text-emerald-400"
                      >
                        {{ idx + 1 }}
                      </span>
                      <span>{{ treatment.title }}</span>
                    </div>
                    <p
                      class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-7"
                    >
                      {{ treatment.detail }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab 3 Pane: Fungicide & Dosage (Solusi Obat & Dosis) -->
            <div class="w-1/3 shrink-0 pl-0.5">
              <div class="p-4 sm:p-5 rounded-2xl neu-emerald-inset space-y-3.5">
                <!-- Chemical Solution & Knapsack Tank Dosage -->
                <div class="p-4 rounded-2xl neu-convex space-y-2">
                  <div
                    class="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
                  >
                    <UIcon
                      name="i-ph-flask-duotone"
                      class="size-4 text-emerald-600 dark:text-emerald-400"
                    />
                    <span>{{ $t("appStudio.results.chemicalHeading") }}</span>
                  </div>
                  <p
                    class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium"
                  >
                    {{ currentDiagnosis.chemicalSolution }}
                  </p>
                  <div
                    class="pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400"
                  >
                    <UIcon name="i-ph-drop-duotone" class="size-3.5 shrink-0" />
                    <span>{{ $t("appStudio.results.tankDosage") }}</span>
                  </div>
                </div>

                <!-- Organic Solution -->
                <div class="p-4 rounded-2xl neu-flat-sm space-y-1.5">
                  <div
                    class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                  >
                    <UIcon
                      name="i-ph-shield-check-duotone"
                      class="size-4 text-emerald-500"
                    />
                    <span>{{ $t("appStudio.results.organicHeading") }}</span>
                  </div>
                  <p
                    class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    {{ currentDiagnosis.organicSolution }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toggle Researcher Mode (ML Telemetry Drawer) -->
      <div
        class="pt-3 border-t border-black/5 dark:border-white/5 space-y-3"
      >
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl neu-btn text-xs font-mono text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          @click="emit('update:isResearcherMode', !isResearcherMode)"
        >
          <div class="flex items-center gap-2">
            <UIcon
              name="i-ph-cube-focus-duotone"
              class="size-4 text-emerald-600 dark:text-emerald-400"
            />
            <span class="font-bold">{{
              $t("appStudio.researcher.toggle")
            }}</span>
          </div>
          <div
            class="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
          >
            <span>{{ isResearcherMode ? "HIDE [▲]" : "EXPAND [▼]" }}</span>
          </div>
        </button>

        <!-- Researcher Mode Telemetry Details & Probability Histogram -->
        <div
          v-if="isResearcherMode"
          class="p-4 sm:p-5 rounded-2xl neu-inset space-y-4 font-mono text-xs"
        >
          <!-- Probability Distribution Histogram -->
          <div class="space-y-2.5">
            <div
              class="text-[11px] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider"
            >
              {{ $t("appStudio.researcher.distributionTitle") }}
            </div>

            <div class="space-y-2.5">
              <!-- Early Blight Bar -->
              <div class="space-y-1">
                <div class="flex justify-between text-[10px]">
                  <span class="text-slate-700 dark:text-slate-300 font-medium"
                    >Early Blight (Alternaria)</span
                  >
                  <span class="font-bold text-amber-600 dark:text-amber-400"
                    >{{ currentDiagnosis.probabilities.earlyBlight }}%</span
                  >
                </div>
                <div
                  class="w-full h-2 rounded-full neu-inset-sm overflow-hidden"
                >
                  <div
                    class="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                    :style="{
                      width: `${currentDiagnosis.probabilities.earlyBlight}%`,
                    }"
                  />
                </div>
              </div>

              <!-- Late Blight Bar -->
              <div class="space-y-1">
                <div class="flex justify-between text-[10px]">
                  <span class="text-slate-700 dark:text-slate-300 font-medium"
                    >Late Blight (Phytophthora)</span
                  >
                  <span class="font-bold text-rose-600 dark:text-rose-400"
                    >{{ currentDiagnosis.probabilities.lateBlight }}%</span
                  >
                </div>
                <div
                  class="w-full h-2 rounded-full neu-inset-sm overflow-hidden"
                >
                  <div
                    class="h-full bg-rose-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    :style="{
                      width: `${currentDiagnosis.probabilities.lateBlight}%`,
                    }"
                  />
                </div>
              </div>

              <!-- Healthy Foliage Bar -->
              <div class="space-y-1">
                <div class="flex justify-between text-[10px]">
                  <span class="text-slate-700 dark:text-slate-300 font-medium"
                    >Healthy Foliage (Solanum)</span
                  >
                  <span
                    class="font-bold text-emerald-600 dark:text-emerald-400"
                    >{{ currentDiagnosis.probabilities.healthy }}%</span
                  >
                </div>
                <div
                  class="w-full h-2 rounded-full neu-inset-sm overflow-hidden"
                >
                  <div
                    class="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    :style="{
                      width: `${currentDiagnosis.probabilities.healthy}%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Hardware & Neural Telemetry Grid -->
          <div
            class="grid grid-cols-2 gap-3 pt-3 border-t border-black/5 dark:border-white/5 text-[11px]"
          >
            <div>
              <div class="text-slate-600 dark:text-slate-400">
                {{ $t("appStudio.researcher.latencyLabel") }}
              </div>
              <div class="font-bold text-slate-900 dark:text-white mt-0.5">
                {{ currentDiagnosis.latency }}
              </div>
            </div>
            <div>
              <div class="text-slate-600 dark:text-slate-400">
                {{ $t("appStudio.researcher.resolutionLabel") }}
              </div>
              <div class="font-bold text-slate-900 dark:text-white mt-0.5">
                1024 × 1024 px
              </div>
            </div>
            <!-- <div>
              <div class="text-slate-600 dark:text-slate-400">
                {{ $t("appStudio.researcher.modelArchLabel") }}
              </div>
              <div
                class="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5"
              >
                {{ $t("appStudio.researcher.modelArchValue") }}
              </div>
            </div> -->
            <!-- <div>
              <div class="text-slate-600 dark:text-slate-400">
                {{ $t("appStudio.researcher.engineLabel") }}
              </div>
              <div
                class="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5"
              >
                {{ $t("appStudio.researcher.engineValue") }}
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
