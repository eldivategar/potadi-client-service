<script setup lang="ts">
const { t } = useI18n();

interface LeafTreatment {
  title: string;
  detail: string;
}

interface LeafClassData {
  id: "early-blight" | "late-blight" | "healthy";
  catalogKey: "earlyBlight" | "lateBlight" | "healthy";
  labelKey: string;
  scientificName: string;
  image: string;
  severityKey: string;
  severityType: "moderate" | "emergency" | "safe";
  confidence: string;
  latency: string;
  probabilities: {
    earlyBlight: number;
    lateBlight: number;
    healthy: number;
  };
  symptoms: string[];
  treatments: LeafTreatment[];
  chemicalSolution: string;
  organicSolution: string;
}

const props = defineProps<{
  currentDiagnosis: LeafClassData;
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
    <div class="rounded-3xl bg-white dark:bg-[#121216] border border-black/8 dark:border-white/10 p-5 sm:p-6 space-y-6 shadow-sm">
      <!-- Results Header: Disease Name & Pathogen -->
        <div>
          <div class="flex items-center justify-between">
            <span
              class="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider"
            >
              {{ $t("appStudio.results.badgeLabel") }}
            </span>
            <!-- <span class="text-[10px] font-mono text-slate-600 dark:text-slate-400">
              Engine: v1.0.4 ONNX
            </span> -->
          </div>
          <h2
            class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1"
          >
            {{ t(currentDiagnosis.labelKey) }}
          </h2>
          <p
            class="text-xs font-mono text-slate-600 dark:text-slate-400 italic mt-0.5"
          >
            Pathogen: {{ currentDiagnosis.scientificName }}
          </p>
        </div>

        <!-- Severity Badge & Confidence Score Matrix (WCAG High Contrast) -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Severity Card -->
          <div
            class="p-3.5 sm:p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1.5"
          >
            <div
              class="text-[11px] font-mono text-slate-600 dark:text-slate-400"
            >
              {{ $t("appStudio.results.statusLabel") }}
            </div>
            <div
              class="text-xs font-bold rounded-lg px-2.5 py-1 border inline-block"
              :class="
                currentDiagnosis.severityType === 'emergency'
                  ? 'text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30'
                  : currentDiagnosis.severityType === 'moderate'
                    ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30'
                    : 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30'
              "
            >
              {{ t(currentDiagnosis.severityKey) }}
            </div>
          </div>

          <!-- Confidence Card -->
          <div
            class="p-3.5 sm:p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1.5"
          >
            <div
              class="text-[11px] font-mono text-slate-600 dark:text-slate-400"
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
        <div class="space-y-3">
          <!-- Tab Switcher -->
          <div
            class="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
          >
            <button
              type="button"
              class="flex-1 py-2 px-1 text-center rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              :class="
                activeTab === 'symptoms'
                  ? 'bg-white dark:bg-[#18181D] text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="emit('update:activeTab', 'symptoms')"
            >
              {{ $t("appStudio.results.tabs.symptoms") }}
            </button>
            <button
              type="button"
              class="flex-1 py-2 px-1 text-center rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              :class="
                activeTab === 'protocol'
                  ? 'bg-white dark:bg-[#18181D] text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="emit('update:activeTab', 'protocol')"
            >
              {{ $t("appStudio.results.tabs.protocol") }}
            </button>
            <button
              type="button"
              class="flex-1 py-2 px-1 text-center rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              :class="
                activeTab === 'solutions'
                  ? 'bg-white dark:bg-[#18181D] text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="emit('update:activeTab', 'solutions')"
            >
              {{ $t("appStudio.results.tabs.solutions") }}
            </button>
          </div>

          <!-- Tab 1 Content: Field Symptoms (Gejala Lapangan) -->
          <div
            v-if="activeTab === 'symptoms'"
            class="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-black/5 dark:border-white/5 space-y-2.5"
          >
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
              class="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
            >
              <li
                v-for="(symptom, idx) in currentDiagnosis.symptoms"
                :key="idx"
                class="flex items-start gap-2 leading-relaxed"
              >
                <UIcon
                  name="i-ph-check-circle-duotone"
                  class="size-4 text-emerald-500 shrink-0 mt-0.5"
                />
                <span>{{ symptom }}</span>
              </li>
            </ul>
          </div>

          <!-- Tab 2 Content: 24h Protocol (Tindakan 24 Jam) -->
          <div
            v-if="activeTab === 'protocol'"
            class="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-black/5 dark:border-white/5 space-y-3"
          >
            <div
              class="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <UIcon
                name="i-ph-clock-countdown-duotone"
                class="size-4 text-emerald-500"
              />
              <span>{{ $t("catalog.fieldActionsTitle") }}</span>
            </div>
            <div class="space-y-2.5">
              <div
                v-for="(treatment, idx) in currentDiagnosis.treatments"
                :key="idx"
                class="p-3 rounded-lg bg-white dark:bg-neutral-900/80 border border-black/5 dark:border-white/5 space-y-1"
              >
                <div
                  class="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"
                >
                  <span
                    class="size-4 rounded-full bg-emerald-500/10 text-[10px] font-mono flex items-center justify-center border border-emerald-500/30"
                  >
                    {{ idx + 1 }}
                  </span>
                  <span>{{ treatment.title }}</span>
                </div>
                <p
                  class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-5"
                >
                  {{ treatment.detail }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tab 3 Content: Fungicide & Dosage (Solusi Obat & Dosis) -->
          <div
            v-if="activeTab === 'solutions'"
            class="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3"
          >
            <!-- Chemical Solution & Knapsack Tank Dosage -->
            <div
              class="p-3 rounded-lg bg-white dark:bg-neutral-900/80 border border-black/5 dark:border-white/5 space-y-1.5"
            >
              <div
                class="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5"
              >
                <UIcon
                  name="i-ph-flask-duotone"
                  class="size-4 text-emerald-600 dark:text-emerald-400"
                />
                <span>{{ $t("appStudio.results.chemicalHeading") }}</span>
              </div>
              <p
                class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
              >
                {{ currentDiagnosis.chemicalSolution }}
              </p>
              <div
                class="pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400"
              >
                <UIcon name="i-ph-drop-duotone" class="size-3.5 shrink-0" />
                <span>{{ $t("appStudio.results.tankDosage") }}</span>
              </div>
            </div>

            <!-- Organic Solution -->
            <div
              class="p-3 rounded-lg bg-white dark:bg-neutral-900/80 border border-black/5 dark:border-white/5 space-y-1"
            >
              <div
                class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <UIcon
                  name="i-ph-shield-check-duotone"
                  class="size-4 text-emerald-500"
                />
                <span>{{ $t("appStudio.results.organicHeading") }}</span>
              </div>
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                {{ currentDiagnosis.organicSolution }}
              </p>
            </div>
          </div>
        </div>

        <!-- Toggle Researcher Mode (ML Telemetry Drawer) -->
        <div
          class="pt-3 border-t border-black/8 dark:border-white/10 space-y-3"
        >
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
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
              class="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              <span>{{ isResearcherMode ? "HIDE [▲]" : "EXPAND [▼]" }}</span>
            </div>
          </button>

          <!-- Researcher Mode Telemetry Details & Probability Histogram -->
          <div
            v-if="isResearcherMode"
            class="p-4 rounded-xl bg-black/5 dark:bg-black/50 border border-black/8 dark:border-white/10 space-y-4 font-mono text-xs"
          >
            <!-- Probability Distribution Histogram -->
            <div class="space-y-2">
              <div
                class="text-[11px] text-slate-600 dark:text-slate-400 font-bold"
              >
                {{ $t("appStudio.researcher.distributionTitle") }}
              </div>

              <div class="space-y-2">
                <!-- Early Blight Bar -->
                <div class="space-y-1">
                  <div class="flex justify-between text-[10px]">
                    <span class="text-slate-700 dark:text-slate-300"
                      >Early Blight (Alternaria)</span
                    >
                    <span class="font-bold text-amber-600 dark:text-amber-400"
                      >{{ currentDiagnosis.probabilities.earlyBlight }}%</span
                    >
                  </div>
                  <div
                    class="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden"
                  >
                    <div
                      class="h-full bg-amber-500 rounded-full transition-all duration-500"
                      :style="{
                        width: `${currentDiagnosis.probabilities.earlyBlight}%`,
                      }"
                    />
                  </div>
                </div>

                <!-- Late Blight Bar -->
                <div class="space-y-1">
                  <div class="flex justify-between text-[10px]">
                    <span class="text-slate-700 dark:text-slate-300"
                      >Late Blight (Phytophthora)</span
                    >
                    <span class="font-bold text-rose-600 dark:text-rose-400"
                      >{{ currentDiagnosis.probabilities.lateBlight }}%</span
                    >
                  </div>
                  <div
                    class="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden"
                  >
                    <div
                      class="h-full bg-rose-500 rounded-full transition-all duration-500"
                      :style="{
                        width: `${currentDiagnosis.probabilities.lateBlight}%`,
                      }"
                    />
                  </div>
                </div>

                <!-- Healthy Foliage Bar -->
                <div class="space-y-1">
                  <div class="flex justify-between text-[10px]">
                    <span class="text-slate-700 dark:text-slate-300"
                      >Healthy Foliage (Solanum)</span
                    >
                    <span
                      class="font-bold text-emerald-600 dark:text-emerald-400"
                      >{{ currentDiagnosis.probabilities.healthy }}%</span
                    >
                  </div>
                  <div
                    class="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden"
                  >
                    <div
                      class="h-full bg-emerald-500 rounded-full transition-all duration-500"
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
              class="grid grid-cols-2 gap-3 pt-3 border-t border-black/8 dark:border-white/10 text-[11px]"
            >
              <div>
                <div class="text-slate-600 dark:text-slate-400">
                  {{ $t("appStudio.researcher.latencyLabel") }}
                </div>
                <div class="font-bold text-slate-900 dark:text-white mt-0.5">
                  {{ currentDiagnosis.latency }} (Local CPU/GPU)
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
              <div>
                <div class="text-slate-600 dark:text-slate-400">
                  {{ $t("appStudio.researcher.modelArchLabel") }}
                </div>
                <div
                  class="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5"
                >
                  {{ $t("appStudio.researcher.modelArchValue") }}
                </div>
              </div>
              <div>
                <div class="text-slate-600 dark:text-slate-400">
                  {{ $t("appStudio.researcher.engineLabel") }}
                </div>
                <div
                  class="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5"
                >
                  {{ $t("appStudio.researcher.engineValue") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>
