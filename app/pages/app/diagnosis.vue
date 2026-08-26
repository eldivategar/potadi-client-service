<script setup lang="ts">
import { ref, computed } from "vue";
import AppSidebar from "~/components/app/Sidebar.vue";
import AppMobileHeader from "~/components/app/MobileHeader.vue";
import AppBottomNav from "~/components/app/BottomNav.vue";
import AppViewfinder from "~/components/app/Viewfinder.vue";
import AppTriageResults from "~/components/app/TriageResults.vue";
import { useDiagnosisHistory } from "~/composables/useDiagnosisHistory";
import { useSidebar } from "~/composables/useSidebar";

const { t } = useI18n();
const { addRecord } = useDiagnosisHistory();
const { isCollapsed } = useSidebar();

useHead({
  title: "Diagnosa Daun - Potadi Botanical Vision AI",
  meta: [
    {
      name: "description",
      content:
        "Studio pemindaian daun kentang dan triage tindakan agronomi presisi berbasis on-device AI.",
    },
  ],
});

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
  confidenceNum: number;
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

const sampleList = computed<LeafClassData[]>(() => [
  {
    id: "early-blight",
    catalogKey: "earlyBlight",
    labelKey: "appStudio.samples.earlyBlight.label",
    scientificName: "Alternaria solani",
    image: "/images/sample-leafs/early-blight.jpg",
    severityKey: "appStudio.samples.earlyBlight.severity",
    severityType: "moderate",
    confidence: "98.4%",
    confidenceNum: 98.4,
    latency: "24 ms",
    probabilities: {
      earlyBlight: 98.4,
      lateBlight: 1.2,
      healthy: 0.4,
    },
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
    catalogKey: "lateBlight",
    labelKey: "appStudio.samples.lateBlight.label",
    scientificName: "Phytophthora infestans",
    image: "/images/sample-leafs/late-blight.jpg",
    severityKey: "appStudio.samples.lateBlight.severity",
    severityType: "emergency",
    confidence: "99.1%",
    confidenceNum: 99.1,
    latency: "22 ms",
    probabilities: {
      earlyBlight: 0.7,
      lateBlight: 99.1,
      healthy: 0.2,
    },
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
    catalogKey: "healthy",
    labelKey: "appStudio.samples.healthy.label",
    scientificName: "Solanum tuberosum L.",
    image: "/images/sample-leafs/healthy-leaf.jpg",
    severityKey: "appStudio.samples.healthy.severity",
    severityType: "safe",
    confidence: "99.7%",
    confidenceNum: 99.7,
    latency: "19 ms",
    probabilities: {
      earlyBlight: 0.2,
      lateBlight: 0.1,
      healthy: 99.7,
    },
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

// State management
const inputMode = ref<"preset" | "real">("real");
const selectedPresetId = ref<"early-blight" | "late-blight" | "healthy">("early-blight");
const uploadedImageUrl = ref<string | null>(null);
const customImageAnalysisId = ref<"early-blight" | "late-blight" | "healthy">("early-blight");

const activeTab = ref<"symptoms" | "protocol" | "solutions">("symptoms");
const isResearcherMode = ref(false);
const isScanning = ref(false);
const showSavedToast = ref(false);

// Active leaf data for triage display
const currentDiagnosis = computed(() => {
  const activeId =
    inputMode.value === "preset"
      ? selectedPresetId.value
      : uploadedImageUrl.value
        ? customImageAnalysisId.value
        : selectedPresetId.value;
  return sampleList.value.find((s) => s.id === activeId) || sampleList.value[0]!;
});

// Active display image in viewfinder
const activeViewfinderImage = computed(() => {
  if (inputMode.value === "real" && uploadedImageUrl.value) {
    return uploadedImageUrl.value;
  }
  return currentDiagnosis.value.image;
});

// Trigger full scan cycle with laser HUD and auto-save
const triggerScan = () => {
  if (isScanning.value) return;
  isScanning.value = true;
  setTimeout(() => {
    isScanning.value = false;

    // Auto-save result to history
    const diag = currentDiagnosis.value;
    addRecord({
      catalogKey: diag.catalogKey,
      label: t(diag.labelKey),
      scientificName: diag.scientificName,
      severityType: diag.severityType,
      severityLabel: t(diag.severityKey),
      confidence: diag.confidence,
      confidenceNum: diag.confidenceNum,
      latency: diag.latency,
      image: activeViewfinderImage.value,
      symptoms: diag.symptoms,
      treatments: diag.treatments,
      chemicalSolution: diag.chemicalSolution,
      organicSolution: diag.organicSolution,
    });

    // Show temporary toast notification
    showSavedToast.value = true;
    setTimeout(() => {
      showSavedToast.value = false;
    }, 3000);
  }, 1100);
};

// Select a preset leaf sample
const selectPreset = (id: "early-blight" | "late-blight" | "healthy") => {
  selectedPresetId.value = id;
  triggerScan();
};

const processFile = (file: File) => {
  if (!file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageUrl.value = e.target?.result as string;
    inputMode.value = "real";
    // Simulated smart on-device inference for custom uploads
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes("late") || lowerName.includes("phytophthora")) {
      customImageAnalysisId.value = "late-blight";
    } else if (lowerName.includes("health") || lowerName.includes("sehat")) {
      customImageAnalysisId.value = "healthy";
    } else {
      customImageAnalysisId.value = "early-blight";
    }
    triggerScan();
  };
  reader.readAsDataURL(file);
};

const removeUploadedImage = () => {
  uploadedImageUrl.value = null;
};
</script>

<template>
  <div
    class="min-h-screen bg-[#F8FAF9] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200"
  >
    <!-- Desktop Left Fixed Sidebar (>= 1024px) -->
    <AppSidebar />

    <!-- Mobile Top Header (< 1024px) -->
    <AppMobileHeader />

    <!-- Toast Notification for Auto-Save -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="showSavedToast"
        class="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-2"
      >
        <UIcon name="i-ph-check-circle-fill" class="size-4 text-white" />
        <span>{{ $t("appStudio.history.toastSaved") }}</span>
      </div>
    </Transition>

    <!-- Main Content Area: Offset by lg:pl-72 / lg:pl-22 -->
    <div
      class="flex-1 flex flex-col transition-[padding] duration-300 ease-in-out"
      :class="isCollapsed ? 'lg:pl-22' : 'lg:pl-72'"
    >
      <main class="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start pb-28 lg:pb-12">
        <!-- LEFT PANEL: VIEWFINDER, DUAL INPUT & ACTION -->
        <AppViewfinder
          :input-mode="inputMode"
          :selected-preset-id="selectedPresetId"
          :sample-list="sampleList"
          :current-diagnosis="currentDiagnosis"
          :active-viewfinder-image="activeViewfinderImage"
          :uploaded-image-url="uploadedImageUrl"
          :is-scanning="isScanning"
          @update:input-mode="inputMode = $event"
          @select-preset="selectPreset"
          @process-file="processFile"
          @remove-uploaded-image="removeUploadedImage"
          @trigger-scan="triggerScan"
        />

        <!-- RIGHT PANEL: ACTIONABLE TRIAGE & RESULT STUDIO -->
        <AppTriageResults
          :current-diagnosis="currentDiagnosis"
          :active-tab="activeTab"
          :is-researcher-mode="isResearcherMode"
          @update:active-tab="activeTab = $event"
          @update:is-researcher-mode="isResearcherMode = $event"
        />
      </main>
    </div>

    <!-- Floating Mobile Bottom Navigation (< 1024px) -->
    <AppBottomNav />
  </div>
</template>
