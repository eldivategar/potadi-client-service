<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import AppViewfinder from "~/components/app/Viewfinder.vue";
import AppTriageResults from "~/components/app/TriageResults.vue";
import { useDiagnosisHistory } from "~/composables/useDiagnosisHistory";
import { useDiagnose, normalizeDiagnosisLabel, type LeafClassData, type BackendDiagnosisData } from "~/composables/useDiagnose";

definePageMeta({
  layout: "app",
});

const { t } = useI18n();
const { addRecord } = useDiagnosisHistory();
const { diagnoseImage, isScanning, scanError } = useDiagnose();

useHead({
  title: "Diagnosa Daun - Potadi Botanical Vision AI",
  meta: [
    {
      name: "description",
      content:
        "Studio pemindaian daun kentang dan triage tindakan agronomi presisi berbasis Cloud AI.",
    },
  ],
});

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
const selectedFile = ref<File | null>(null);
const uploadedFileName = ref<string | null>(null);
const uploadedImageUrl = ref<string | null>(null);

// Real image diagnosis result
const realDiagnosisResult = ref<LeafClassData | null>(null);

// Cache diagnosis results per preset sample
const presetResults = ref<Record<string, LeafClassData | null>>({
  "early-blight": null,
  "late-blight": null,
  "healthy": null,
});

const localErrorMessage = ref<string | null>(null);
const activeTab = ref<"symptoms" | "protocol" | "solutions">("symptoms");
const isResearcherMode = ref(false);
const showSavedToast = ref(false);

// Active leaf data for triage display
const currentDiagnosis = computed<LeafClassData | null>(() => {
  if (inputMode.value === "preset") {
    return presetResults.value[selectedPresetId.value] || null;
  }
  return realDiagnosisResult.value;
});

const hasInferenceResult = computed(() => !!currentDiagnosis.value);

// Active display image in viewfinder
const activeViewfinderImage = computed(() => {
  if (inputMode.value === "real") {
    return uploadedImageUrl.value || "/images/sample-leafs/early-blight.jpg";
  }
  const selected = sampleList.value.find((s) => s.id === selectedPresetId.value);
  return selected ? selected.image : "/images/sample-leafs/early-blight.jpg";
});

// Helper to fetch preset static image and convert to File object
const fetchImageAsFile = async (url: string, fileName: string): Promise<File> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Gagal memuat citra sampel: ${response.statusText}`);
  }
  const blob = await response.blob();
  const mimeType = blob.type || "image/jpeg";
  return new File([blob], fileName, { type: mimeType });
};

// Helper to format backend ML diagnosis response into frontend LeafClassData structure
const formatDiagnosisResult = (
  raw: BackendDiagnosisData,
  latencyMs: number,
  fallbackImage: string
): LeafClassData => {
  const norm = normalizeDiagnosisLabel(raw.label);
  const confRaw = Number(raw.confidence) || 0;
  const confValue = confRaw > 1 ? confRaw : confRaw * 100;

  const details = raw.details || {};
  const earlyRaw = Number(details.early_blight ?? (norm.id === "early-blight" ? confValue : 0));
  const lateRaw = Number(details.late_blight ?? (norm.id === "late-blight" ? confValue : 0));
  const healthyRaw = Number(details.healthy ?? (norm.id === "healthy" ? confValue : 0));

  const earlyProb = earlyRaw > 1 ? earlyRaw : earlyRaw * 100;
  const lateProb = lateRaw > 1 ? lateRaw : lateRaw * 100;
  const healthyProb = healthyRaw > 1 ? healthyRaw : healthyRaw * 100;

  return {
    id: norm.id,
    catalogKey: norm.catalogKey,
    labelKey: `catalog.diseases.${norm.catalogKey}.tabName`,
    scientificName: norm.scientificName,
    image: raw.imageUrl || fallbackImage,
    severityKey: `catalog.diseases.${norm.catalogKey}.statusBadge`,
    severityType: norm.severityType,
    confidence: `${confValue.toFixed(1)}%`,
    confidenceNum: Number(confValue.toFixed(1)),
    latency: `${latencyMs} ms`,
    probabilities: {
      earlyBlight: Number(earlyProb.toFixed(1)),
      lateBlight: Number(lateProb.toFixed(1)),
      healthy: Number(healthyProb.toFixed(1)),
    },
    symptoms: [
      t(`catalog.diseases.${norm.catalogKey}.symptoms.0`),
      t(`catalog.diseases.${norm.catalogKey}.symptoms.1`),
      t(`catalog.diseases.${norm.catalogKey}.symptoms.2`),
    ],
    treatments: [
      {
        title: t(`catalog.diseases.${norm.catalogKey}.treatments.0.title`),
        detail: t(`catalog.diseases.${norm.catalogKey}.treatments.0.detail`),
      },
      {
        title: t(`catalog.diseases.${norm.catalogKey}.treatments.1.title`),
        detail: t(`catalog.diseases.${norm.catalogKey}.treatments.1.detail`),
      },
    ],
    chemicalSolution: t(`catalog.diseases.${norm.catalogKey}.chemicalSolution`),
    organicSolution: t(`catalog.diseases.${norm.catalogKey}.organicSolution`),
  };
};

// Trigger scan: Live API Inference when user explicitly clicks the action button
const triggerScan = async () => {
  if (isScanning.value) return;
  localErrorMessage.value = null;

  try {
    let fileToDiagnose: File | null = null;
    let fallbackImageUrl = "";

    if (inputMode.value === "preset") {
      const selected = sampleList.value.find((s) => s.id === selectedPresetId.value) || sampleList.value[0]!;
      fileToDiagnose = await fetchImageAsFile(selected.image, `sample-${selected.id}.jpg`);
      fallbackImageUrl = selected.image;
    } else {
      if (!selectedFile.value) {
        localErrorMessage.value = "Silakan pilih foto daun terlebih dahulu.";
        return;
      }
      fileToDiagnose = selectedFile.value;
      fallbackImageUrl = uploadedImageUrl.value || "/images/sample-leafs/early-blight.jpg";
    }

    const { raw, latencyMs } = await diagnoseImage(fileToDiagnose);
    const realResult = formatDiagnosisResult(raw, latencyMs, fallbackImageUrl);

    if (inputMode.value === "preset") {
      presetResults.value[selectedPresetId.value] = realResult;
    } else {
      realDiagnosisResult.value = realResult;
    }

    // Save to history (stored in DB on backend & local cache)
    addRecord({
      id: raw.id,
      timestamp: raw.createdAt || new Date().toISOString(),
      catalogKey: realResult.catalogKey,
      label: t(realResult.labelKey),
      scientificName: realResult.scientificName,
      severityType: realResult.severityType,
      severityLabel: t(realResult.severityKey),
      confidence: realResult.confidence,
      confidenceNum: realResult.confidenceNum,
      latency: realResult.latency,
      image: realResult.image,
      symptoms: realResult.symptoms,
      treatments: realResult.treatments,
      chemicalSolution: realResult.chemicalSolution,
      organicSolution: realResult.organicSolution,
    });

    showSavedToast.value = true;
    setTimeout(() => {
      showSavedToast.value = false;
    }, 3000);
  } catch (err: any) {
    localErrorMessage.value = err.message || "Gagal melakukan diagnosa pada citra.";
  }
};

// Select a preset leaf sample: just updates selection, no auto-scan!
const selectPreset = (id: "early-blight" | "late-blight" | "healthy") => {
  selectedPresetId.value = id;
  localErrorMessage.value = null;
};

// Switch input tab: no auto-scan!
const setInputMode = (mode: "preset" | "real") => {
  inputMode.value = mode;
  localErrorMessage.value = null;
};

// Select/upload file: shows preview, resets previous result, no auto-scan!
const processFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    localErrorMessage.value = t("appStudio.upload.invalidFormat") || "Format berkas tidak valid. Harap pilih berkas gambar (JPG, PNG, WEBP).";
    return;
  }

  // Max 5MB size limit validation
  if (file.size > 5 * 1024 * 1024) {
    localErrorMessage.value = t("appStudio.upload.maxSizeExceeded") || "Ukuran gambar terlalu besar. Maksimum 5MB.";
    return;
  }

  localErrorMessage.value = null;
  selectedFile.value = file;
  uploadedFileName.value = file.name;
  realDiagnosisResult.value = null;
  inputMode.value = "real";

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removeUploadedImage = () => {
  selectedFile.value = null;
  uploadedFileName.value = null;
  uploadedImageUrl.value = null;
  realDiagnosisResult.value = null;
  localErrorMessage.value = null;
};

onUnmounted(() => {
  selectedFile.value = null;
  uploadedImageUrl.value = null;
});
</script>

<template>
  <div>
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
        class="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full neu-flat text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-500/30"
      >
        <UIcon name="i-ph-check-circle-fill" class="size-4 text-emerald-500" />
        <span>{{ $t("appStudio.history.toastSaved") }}</span>
      </div>
    </Transition>

    <main class="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start pb-28 lg:pb-12">
      <!-- LEFT PANEL: VIEWFINDER, DUAL INPUT & ACTION -->
      <AppViewfinder
        :input-mode="inputMode"
        :selected-preset-id="selectedPresetId"
        :sample-list="sampleList"
        :preset-results="presetResults"
        :current-diagnosis="currentDiagnosis"
        :active-viewfinder-image="activeViewfinderImage"
        :uploaded-image-url="uploadedImageUrl"
        :uploaded-file-name="uploadedFileName"
        :is-scanning="isScanning"
        :has-inference-result="hasInferenceResult"
        :error-message="localErrorMessage || scanError"
        @update:input-mode="setInputMode"
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
</template>
