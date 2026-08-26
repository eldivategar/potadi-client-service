<script setup lang="ts">
import { ref, computed } from "vue";
import { useScroll, useTransform } from "motion-v";

const { t } = useI18n();

interface DiseaseTreatment {
  title: string;
  detail: string;
}

interface DiseaseItem {
  id: string;
  tabName: string;
  name: string;
  scientific: string;
  statusBadge: string;
  statusClass: string;
  image: string;
  symptoms: string[];
  treatments: DiseaseTreatment[];
  chemicalSolution: string;
  organicSolution: string;
}

const diseases = computed<DiseaseItem[]>(() => [
  {
    id: "early-blight",
    tabName: t("catalog.diseases.earlyBlight.tabName"),
    name: t("catalog.diseases.earlyBlight.name"),
    scientific: "Alternaria solani",
    statusBadge: t("catalog.diseases.earlyBlight.statusBadge"),
    statusClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    image: "/images/sample-leafs/early-blight.jpg",
    symptoms: [
      t("catalog.diseases.earlyBlight.symptoms.0"),
      t("catalog.diseases.earlyBlight.symptoms.1"),
      t("catalog.diseases.earlyBlight.symptoms.2"),
    ],
    treatments: [
      {
        title: t("catalog.diseases.earlyBlight.treatments.0.title"),
        detail: t("catalog.diseases.earlyBlight.treatments.0.detail"),
      },
      {
        title: t("catalog.diseases.earlyBlight.treatments.1.title"),
        detail: t("catalog.diseases.earlyBlight.treatments.1.detail"),
      },
    ],
    chemicalSolution: t("catalog.diseases.earlyBlight.chemicalSolution"),
    organicSolution: t("catalog.diseases.earlyBlight.organicSolution"),
  },
  {
    id: "late-blight",
    tabName: t("catalog.diseases.lateBlight.tabName"),
    name: t("catalog.diseases.lateBlight.name"),
    scientific: "Phytophthora infestans",
    statusBadge: t("catalog.diseases.lateBlight.statusBadge"),
    statusClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    image: "/images/sample-leafs/late-blight.jpg",
    symptoms: [
      t("catalog.diseases.lateBlight.symptoms.0"),
      t("catalog.diseases.lateBlight.symptoms.1"),
      t("catalog.diseases.lateBlight.symptoms.2"),
    ],
    treatments: [
      {
        title: t("catalog.diseases.lateBlight.treatments.0.title"),
        detail: t("catalog.diseases.lateBlight.treatments.0.detail"),
      },
      {
        title: t("catalog.diseases.lateBlight.treatments.1.title"),
        detail: t("catalog.diseases.lateBlight.treatments.1.detail"),
      },
    ],
    chemicalSolution: t("catalog.diseases.lateBlight.chemicalSolution"),
    organicSolution: t("catalog.diseases.lateBlight.organicSolution"),
  },
  {
    id: "healthy",
    tabName: t("catalog.diseases.healthy.tabName"),
    name: t("catalog.diseases.healthy.name"),
    scientific: "Solanum tuberosum L.",
    statusBadge: t("catalog.diseases.healthy.statusBadge"),
    statusClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    image: "/images/sample-leafs/healthy-leaf.jpg",
    symptoms: [
      t("catalog.diseases.healthy.symptoms.0"),
      t("catalog.diseases.healthy.symptoms.1"),
      t("catalog.diseases.healthy.symptoms.2"),
    ],
    treatments: [
      {
        title: t("catalog.diseases.healthy.treatments.0.title"),
        detail: t("catalog.diseases.healthy.treatments.0.detail"),
      },
      {
        title: t("catalog.diseases.healthy.treatments.1.title"),
        detail: t("catalog.diseases.healthy.treatments.1.detail"),
      },
    ],
    chemicalSolution: t("catalog.diseases.healthy.chemicalSolution"),
    organicSolution: t("catalog.diseases.healthy.organicSolution"),
  },
]);

const activeTabId = ref("early-blight");
const activeTab = computed(
  () =>
    diseases.value.find((d) => d.id === activeTabId.value) ||
    diseases.value[0]!,
);

// Catalog Photo Lens High-Amplitude Parallax
const { scrollYProgress } = useScroll();
const photoFrameY = useTransform(
  scrollYProgress,
  [0.15, 0.55],
  ["-30px", "45px"],
);
</script>

<template>
  <section id="catalog" class="py-24 md:py-32 relative z-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-4 mb-12">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }"
        >
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            {{ $t("catalog.title") }}
          </h2>
        </Motion>
        <p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          {{ $t("catalog.subtitle") }}
        </p>
      </div>

      <!-- Tab Buttons -->
      <div
        class="flex flex-wrap gap-2 sm:gap-3 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-neutral-900/90 border border-black/10 dark:border-white/10 max-w-2xl mb-8"
      >
        <button
          v-for="item in diseases"
          :key="item.id"
          type="button"
          class="flex-1 min-w-[140px] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          :class="[
            activeTabId === item.id
              ? item.id === 'healthy'
                ? 'bg-white dark:bg-emerald-500/20 border border-emerald-500/50 text-emerald-900 dark:text-emerald-200 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : item.id === 'early-blight'
                  ? 'bg-white dark:bg-amber-500/20 border border-amber-500/50 text-amber-900 dark:text-amber-200 shadow-sm dark:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-white dark:bg-rose-500/20 border border-rose-500/50 text-rose-900 dark:text-rose-200 shadow-sm dark:shadow-[0_0_20px_rgba(244,63,94,0.25)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5',
          ]"
          @click="activeTabId = item.id"
        >
          <UIcon
            :name="
              item.id === 'healthy'
                ? 'i-ph-check-circle-fill'
                : 'i-ph-warning-circle-fill'
            "
            class="size-4"
            :class="
              item.id === 'healthy'
                ? 'text-emerald-600 dark:text-emerald-400'
                : item.id === 'early-blight'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
            "
          />
          <span>{{ item.tabName }}</span>
        </button>
      </div>

      <!-- Active Disease Detail Card (Doppelrand Bezel) -->
      <div
        class="p-2 sm:p-3 rounded-3xl bezel-outer shadow-md dark:shadow-none"
      >
        <div class="rounded-2xl bezel-inner p-6 sm:p-8 lg:p-10">
          <div
            class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            <!-- Left: Leaf Photography & Specs with Optical Reticles & Parallax -->
            <Motion :style="{ y: photoFrameY }" class="lg:col-span-5 space-y-4">
              <div
                class="relative aspect-square rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-950 group"
              >
                <img
                  :src="activeTab.image"
                  :alt="activeTab.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <!-- Optical Corner Reticle Marks (+ / ⌐) -->
                <div
                  class="absolute inset-3 pointer-events-none flex flex-col justify-between z-10 opacity-70"
                >
                  <div
                    class="flex justify-between font-mono text-xs text-emerald-400 font-bold select-none"
                  >
                    <span>┌</span>
                    <span>┐</span>
                  </div>
                  <div
                    class="flex justify-between font-mono text-xs text-emerald-400 font-bold select-none"
                  >
                    <span>└</span>
                    <span>┘</span>
                  </div>
                </div>

                <div class="absolute top-3 left-3 z-20">
                  <span
                    class="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border backdrop-blur-md shadow-md"
                    :class="activeTab.statusClass"
                  >
                    {{ activeTab.statusBadge }}
                  </span>
                </div>
              </div>

              <div
                class="p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1"
              >
                <div
                  class="text-[11px] font-mono text-slate-500 dark:text-slate-400"
                >
                  {{ $t("catalog.taxonomyLabel") }}
                </div>
                <div
                  class="text-sm font-semibold text-slate-900 dark:text-white font-serif italic"
                >
                  {{ activeTab.scientific }}
                </div>
              </div>
            </Motion>

            <!-- Right: Symptoms & Practical Field Recommendations -->
            <div class="lg:col-span-7 space-y-6">
              <div>
                <h3
                  class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
                >
                  {{ activeTab.name }}
                </h3>
                <p
                  class="text-xs font-mono text-emerald-700 dark:text-emerald-400 mt-1"
                >
                  {{ $t("catalog.diagnosticProtocol") }}
                </p>
              </div>

              <!-- Symptoms List -->
              <div class="space-y-2">
                <div
                  class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t("catalog.symptomsTitle") }}
                </div>
                <ul class="space-y-2.5">
                  <li
                    v-for="(symptom, idx) in activeTab.symptoms"
                    :key="idx"
                    class="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <UIcon
                      name="i-ph-caret-right-bold"
                      class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                    />
                    <span>{{ symptom }}</span>
                  </li>
                </ul>
              </div>

              <!-- Field Actions -->
              <div class="space-y-3 pt-2">
                <div
                  class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t("catalog.fieldActionsTitle") }}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(action, idx) in activeTab.treatments"
                    :key="idx"
                    class="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1"
                  >
                    <div
                      class="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5"
                    >
                      <UIcon
                        name="i-ph-shield-plus-duotone"
                        class="size-4 text-emerald-600 dark:text-emerald-400"
                      />
                      <span>{{ action.title }}</span>
                    </div>
                    <p
                      class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                      {{ action.detail }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Fungicide / Solutions Strip -->
              <div
                class="space-y-2 pt-2 border-t border-black/10 dark:border-white/10"
              >
                <div
                  class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t("catalog.solutionsTitle") }}
                </div>
                <div class="space-y-2">
                  <div
                    class="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span
                      class="font-bold text-emerald-800 dark:text-emerald-300"
                      >{{ $t("catalog.chemicalLabel") }}</span
                    >
                    {{ activeTab.chemicalSolution }}
                  </div>
                  <div
                    class="p-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span
                      class="font-bold text-slate-900 dark:text-slate-200"
                      >{{ $t("catalog.organicLabel") }}</span
                    >
                    {{ activeTab.organicSolution }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
