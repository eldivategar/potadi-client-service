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
  statusBadgeBg: string;
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
    statusBadgeBg: "bg-amber-500",
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
    statusBadgeBg: "bg-rose-500",
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
    statusBadgeBg: "bg-emerald-500",
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

// Catalog Photo Lens Subtle Parallax
const { scrollYProgress } = useScroll();
const photoFrameY = useTransform(
  scrollYProgress,
  [0.15, 0.55],
  ["-15px", "25px"],
);
</script>

<template>
  <section id="catalog" class="py-24 md:py-32 relative z-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-4 mb-10 sm:mb-12">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }"
        >
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-wider inline-block mb-3"
          >
            {{ $t("catalog.taxonomyLabel") }}
          </span>

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

      <!-- Segmented Tab Bar -->
      <div
        class="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 max-w-2xl mb-8 border border-slate-200/80 dark:border-white/10 shadow-sm"
      >
        <button
          v-for="item in diseases"
          :key="item.id"
          type="button"
          class="flex-1 min-w-[140px] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          :class="[
            activeTabId === item.id
              ? item.id === 'healthy'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : item.id === 'early-blight'
                  ? 'bg-amber-600 text-white font-bold shadow-md'
                  : 'bg-rose-600 text-white font-bold shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5',
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
            :class="activeTabId === item.id ? 'text-white' : item.id === 'healthy' ? 'text-emerald-600 dark:text-emerald-400' : item.id === 'early-blight' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'"
          />
          <span>{{ item.tabName }}</span>
        </button>
      </div>

      <!-- Active Disease Detail Card -->
      <div
        class="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/95 dark:bg-neutral-900/95 shadow-xl border border-slate-200/80 dark:border-white/10"
      >
        <div
          class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          <!-- Left: Leaf Photography & Taxonomy with Parallax -->
          <Motion :style="{ y: photoFrameY }" class="lg:col-span-5 space-y-4">
            <div
              class="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-neutral-950 group shadow-inner"
            >
              <img
                :src="activeTab.image"
                :alt="activeTab.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div class="absolute top-3.5 left-3.5 z-20">
                <span
                  class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-black/80 text-white border border-white/20 backdrop-blur-md shadow-md flex items-center gap-2"
                >
                  <span class="size-2 rounded-full" :class="activeTab.statusBadgeBg" />
                  <span>{{ activeTab.statusBadge }}</span>
                </span>
              </div>
            </div>

            <div
              class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1 text-xs"
            >
              <div
                class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider"
              >
                {{ $t("catalog.taxonomyLabel") }}
              </div>
              <div
                class="text-sm font-bold text-slate-900 dark:text-white font-serif italic"
              >
                {{ activeTab.scientific }}
              </div>
            </div>
          </Motion>

          <!-- Right: Symptoms & Practical Recommendations -->
          <div class="lg:col-span-7 space-y-6">
            <div>
              <h3
                class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
              >
                {{ activeTab.name }}
              </h3>
            </div>

            <!-- Symptoms List -->
            <div class="space-y-2.5">
              <div
                class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {{ $t("catalog.symptomsTitle") }}
              </div>
              <ul class="space-y-2">
                <li
                  v-for="(symptom, idx) in activeTab.symptoms"
                  :key="idx"
                  class="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 leading-relaxed"
                >
                  <UIcon
                    name="i-ph-check-circle-fill"
                    class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                  />
                  <span>{{ symptom }}</span>
                </li>
              </ul>
            </div>

            <!-- Field Actions -->
            <div class="space-y-3 pt-1">
              <div
                class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {{ $t("catalog.fieldActionsTitle") }}
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(action, idx) in activeTab.treatments"
                  :key="idx"
                  class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1.5"
                >
                  <div
                    class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5"
                  >
                    <UIcon
                      name="i-ph-shield-check-fill"
                      class="size-4 text-emerald-600 dark:text-emerald-400"
                    />
                    <span>{{ action.title }}</span>
                  </div>
                  <p
                    class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {{ action.detail }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Fungicide / Solutions Strip -->
            <div
              class="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-white/5"
            >
              <div
                class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {{ $t("catalog.solutionsTitle") }}
              </div>
              <div class="space-y-2.5 text-xs">
                <div
                  class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 leading-relaxed"
                >
                  <span
                    class="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-0.5"
                  >
                    {{ $t("catalog.chemicalLabel") }}
                  </span>
                  {{ activeTab.chemicalSolution }}
                </div>
                <div
                  class="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-slate-800 dark:text-slate-200 leading-relaxed"
                >
                  <span
                    class="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-0.5"
                  >
                    {{ $t("catalog.organicLabel") }}
                  </span>
                  {{ activeTab.organicSolution }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
