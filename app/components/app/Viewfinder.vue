<script setup lang="ts">
import { ref } from "vue";

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
  inputMode: "preset" | "real";
  selectedPresetId: "early-blight" | "late-blight" | "healthy";
  sampleList: LeafClassData[];
  currentDiagnosis: LeafClassData;
  activeViewfinderImage: string;
  uploadedImageUrl: string | null;
  isScanning: boolean;
}>();

const emit = defineEmits<{
  (e: "update:inputMode", mode: "preset" | "real"): void;
  (e: "selectPreset", id: "early-blight" | "late-blight" | "healthy"): void;
  (e: "processFile", file: File): void;
  (e: "removeUploadedImage"): void;
  (e: "triggerScan"): void;
}>();

const isDragging = ref(false);
const cameraInputRef = ref<HTMLInputElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    emit("processFile", target.files[0]);
  }
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    emit("processFile", event.dataTransfer.files[0]);
  }
};

const triggerCameraClick = () => {
  cameraInputRef.value?.click();
};

const triggerFileClick = () => {
  fileInputRef.value?.click();
};
</script>

<template>
  <section class="space-y-4" aria-label="Input Daun & Viewfinder">
    <!-- Hidden File & Camera Inputs -->
    <input
      ref="cameraInputRef"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="handleFileSelection"
    />
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelection"
    />

    <div class="rounded-3xl bg-white dark:bg-[#121216] border border-black/8 dark:border-white/10 p-5 sm:p-6 space-y-4 shadow-sm">
      <!-- Mode Switcher: Real Camera/Upload vs Preset Samples -->
      <div class="flex items-center justify-between gap-2 border-b border-black/8 dark:border-white/10 pb-3">
          <div class="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 w-full sm:w-auto">
            <button
              type="button"
              class="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              :class="
                inputMode === 'real'
                  ? 'bg-white dark:bg-[#18181D] text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="emit('update:inputMode', 'real')"
            >
              <UIcon name="i-ph-camera-bold" class="size-3.5" />
              <span>{{ $t("appStudio.inputTabs.real") }}</span>
            </button>

            <button
              type="button"
              class="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              :class="
                inputMode === 'preset'
                  ? 'bg-white dark:bg-[#18181D] text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="emit('update:inputMode', 'preset')"
            >
              <UIcon name="i-ph-leaf-fill" class="size-3.5" />
              <span>{{ $t("appStudio.inputTabs.preset") }}</span>
            </button>
          </div>

          <!-- HUD Viewfinder Status -->
          <div class="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            <span class="size-1.5 rounded-full bg-emerald-500" />
            <span>{{ $t("appStudio.viewfinder.targetLock") }}</span>
          </div>
        </div>

        <!-- Optical Viewfinder Frame (4:3 Aspect Ratio) -->
        <div
          class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-black/10 dark:border-white/15 shadow-inner select-none"
          :class="{ 'ring-2 ring-emerald-500': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
        >
          <!-- Live Leaf Image Preview -->
          <img
            :src="activeViewfinderImage"
            :alt="t(currentDiagnosis.labelKey)"
            class="w-full h-full object-cover transition-transform duration-500 ease-out"
            :class="{ 'scale-105': isScanning }"
          />

          <!-- Optical Reticle HUD Corners (+ / ⌐) -->
          <div class="absolute inset-3 sm:inset-5 pointer-events-none flex flex-col justify-between z-10 opacity-80">
            <div class="flex justify-between">
              <div class="size-4 sm:size-5 border-t-2 border-l-2 border-emerald-400" />
              <div class="size-4 sm:size-5 border-t-2 border-r-2 border-emerald-400" />
            </div>
            <div class="flex justify-between">
              <div class="size-4 sm:size-5 border-b-2 border-l-2 border-emerald-400" />
              <div class="size-4 sm:size-5 border-b-2 border-r-2 border-emerald-400" />
            </div>
          </div>

          <!-- Viewfinder Live Telemetry Badges in Corners -->
          <div class="absolute top-3 left-3 z-10 pointer-events-none">
            <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
              1024×1024 RGB
            </span>
          </div>
          <div class="absolute top-3 right-3 z-10 pointer-events-none">
            <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
              FOV 78°
            </span>
          </div>

          <!-- Scanning Laser Beam Animation -->
          <Motion
            v-if="isScanning"
            :animate="{ y: ['0%', '340px', '0%'] }"
            :transition="{
              duration: 1.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }"
            class="absolute top-0 left-0 right-0 h-1.5 scanner-laser z-20 transform-gpu pointer-events-none"
          />

          <!-- Scanning Status Overlay -->
          <div
            v-if="isScanning"
            class="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-20"
          >
            <div
              class="px-4 py-2.5 rounded-xl bg-neutral-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center gap-2 shadow-2xl"
            >
              <UIcon
                name="i-ph-spinner-gap-bold"
                class="size-4 animate-spin text-emerald-400"
              />
              <span>{{ $t("appStudio.viewfinder.scanning") }}</span>
            </div>
          </div>
        </div>

        <!-- Input Controls: Real Mode (Upload/Camera) or Preset Selector -->
        <div v-if="inputMode === 'real'" class="space-y-3">
          <div v-if="!uploadedImageUrl" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <!-- Mobile Camera Trigger Button (Min. 56px ergonomic touch) -->
            <button
              type="button"
              class="h-14 px-4 rounded-xl text-xs sm:text-sm font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              @click="triggerCameraClick"
            >
              <UIcon name="i-ph-camera-bold" class="size-5 text-emerald-600 dark:text-emerald-400" />
              <span>{{ $t("appStudio.upload.openCamera") }}</span>
            </button>

            <!-- File Picker Trigger Button (Min. 56px ergonomic touch) -->
            <button
              type="button"
              class="h-14 px-4 rounded-xl text-xs sm:text-sm font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              @click="triggerFileClick"
            >
              <UIcon name="i-ph-upload-simple-bold" class="size-5 text-emerald-600 dark:text-emerald-400" />
              <span>{{ $t("appStudio.upload.chooseFile") }}</span>
            </button>
          </div>

          <!-- Uploaded Image Status Card with Change/Remove Actions -->
          <div
            v-else
            class="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="size-8 rounded-lg overflow-hidden shrink-0 border border-emerald-500/40">
                <img :src="uploadedImageUrl" alt="Uploaded leaf" class="w-full h-full object-cover" />
              </div>
              <div class="truncate">
                <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {{ $t("appStudio.upload.customLeafLabel") }}
                </div>
                <div class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  Ready for Edge Inference
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                class="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium transition-colors cursor-pointer"
                :title="$t('appStudio.upload.changeImage')"
                @click="triggerFileClick"
              >
                <UIcon name="i-ph-arrows-clockwise-bold" class="size-4" />
              </button>
              <button
                type="button"
                class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-medium transition-colors cursor-pointer"
                :title="$t('appStudio.upload.removeImage')"
                @click="emit('removeUploadedImage')"
              >
                <UIcon name="i-ph-trash-bold" class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Input Controls: Preset Samples Selector (3 Chips) -->
        <div v-else class="space-y-2">
          <div class="text-[11px] font-mono text-slate-600 dark:text-slate-400">
            {{ $t("appStudio.viewfinder.chooseSampleHint") }}
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="sample in sampleList"
              :key="sample.id"
              type="button"
              class="p-2 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer"
              :class="
                selectedPresetId === sample.id
                  ? 'bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="emit('selectPreset', sample.id)"
            >
              <div class="text-xs font-bold truncate">
                {{ t(sample.labelKey).split(" ")[0] }}
              </div>
              <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>{{ sample.confidence }}</span>
                <span
                  class="size-1.5 rounded-full"
                  :class="
                    sample.severityType === 'emergency'
                      ? 'bg-rose-500'
                      : sample.severityType === 'moderate'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  "
                />
              </div>
            </button>
          </div>
        </div>

        <!-- Primary Action Button (Emerald 56px, Tactile Feedback) -->
        <button
          type="button"
          class="w-full h-14 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          :disabled="isScanning"
          @click="emit('triggerScan')"
        >
          <UIcon
            :name="isScanning ? 'i-ph-spinner-gap-bold' : 'i-ph-scan-bold'"
            class="size-5"
            :class="{ 'animate-spin': isScanning }"
          />
          <span>
            {{
              isScanning
                ? $t("appStudio.buttons.processing")
                : uploadedImageUrl || inputMode === 'preset'
                  ? $t("appStudio.buttons.reanalyze")
                  : $t("appStudio.buttons.analyze")
            }}
          </span>
        </button>
      </div>
  </section>
</template>
