<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from "vue";

const { t } = useI18n();

const props = defineProps<{
  inputMode: "preset" | "real";
  selectedPresetId: "early-blight" | "late-blight" | "healthy";
  sampleList: LeafClassData[];
  presetResults?: Record<string, LeafClassData | null>;
  currentDiagnosis: LeafClassData | null;
  activeViewfinderImage: string;
  uploadedImageUrl: string | null;
  uploadedFileName?: string | null;
  isScanning: boolean;
  hasInferenceResult: boolean;
  errorMessage?: string | null;
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

// Photo origin tracking: 'camera' | 'upload'
const photoSource = ref<"camera" | "upload">("upload");

const isCameraPhoto = computed(() => {
  return (
    photoSource.value === "camera" ||
    (props.uploadedFileName?.startsWith("leaf-camera") ?? false)
  );
});

const getSampleShortLabel = (labelKey: string): string => {
  const text = t(labelKey) || "";
  const parts = text.split("(");
  return (parts[0] || text).trim();
};

// Live Camera WebRTC state
const isCameraActive = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const mediaStream = ref<MediaStream | null>(null);
const facingMode = ref<"environment" | "user">("environment");
const cameraError = ref<string | null>(null);

const startCamera = async () => {
  cameraError.value = null;

  if (!import.meta.client) return;

  // If getUserMedia is not available in browser/context, fall back to native capture input
  if (!navigator?.mediaDevices?.getUserMedia) {
    triggerCameraInputFallback();
    return;
  }

  try {
    stopCamera();

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facingMode.value },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });

    mediaStream.value = stream;
    isCameraActive.value = true;

    await nextTick();
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      await videoRef.value.play();
    }
  } catch (err: any) {
    console.warn("getUserMedia failed, falling back to native file capture input:", err);
    stopCamera();
    // Fallback to native capture input for mobile devices / unsupported contexts
    triggerCameraInputFallback();
  }
};

const stopCamera = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  isCameraActive.value = false;
};

const switchCamera = async () => {
  facingMode.value = facingMode.value === "environment" ? "user" : "environment";
  await startCamera();
};

const capturePhoto = () => {
  if (!videoRef.value) return;

  const video = videoRef.value;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Capture frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(
    (blob) => {
      if (blob) {
        photoSource.value = "camera";
        const file = new File([blob], `leaf-camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        stopCamera();
        emit("processFile", file);
      }
    },
    "image/jpeg",
    0.85
  );
};

const triggerCameraInputFallback = () => {
  if (cameraInputRef.value) {
    cameraInputRef.value.value = "";
    cameraInputRef.value.click();
  }
};

const triggerFileClick = () => {
  stopCamera();
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
    fileInputRef.value.click();
  }
};

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    photoSource.value = "upload";
    stopCamera();
    emit("processFile", target.files[0]);
  }
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    photoSource.value = "upload";
    stopCamera();
    emit("processFile", event.dataTransfer.files[0]);
  }
};

const handleRemove = () => {
  stopCamera();
  photoSource.value = "upload";
  if (cameraInputRef.value) cameraInputRef.value.value = "";
  if (fileInputRef.value) fileInputRef.value.value = "";
  emit("removeUploadedImage");
};

// Clean up camera stream when inputMode or component unmounts
watch(
  () => props.inputMode,
  (newMode) => {
    if (newMode === "preset") {
      stopCamera();
    }
  }
);

onUnmounted(() => {
  stopCamera();
});
</script>

<template>
  <section class="space-y-4" aria-label="Input Daun & Viewfinder">
    <!-- Hidden File & Native Camera Inputs -->
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

    <div class="rounded-3xl neu-flat p-5 sm:p-6 space-y-5">
      <!-- Mode Switcher: Real Camera/Upload vs Preset Samples with Smooth Sliding Pill -->
      <div class="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-4">
        <div class="relative grid grid-cols-2 p-1 rounded-2xl neu-inset w-full sm:w-auto sm:min-w-[340px] overflow-hidden">
          <!-- Active Sliding Background Pill Indicator -->
          <div
            class="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-xl neu-convex shadow-sm transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none transform-gpu"
            :style="{
              transform: inputMode === 'real' ? 'translateX(0%)' : 'translateX(100%)'
            }"
          />

          <button
            type="button"
            class="relative z-10 flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer text-center"
            :class="
              inputMode === 'real'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="emit('update:inputMode', 'real')"
          >
            <UIcon name="i-ph-camera-bold" class="size-3.5" />
            <span>{{ $t("appStudio.inputTabs.real") }}</span>
          </button>

          <button
            type="button"
            class="relative z-10 flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer text-center"
            :class="
              inputMode === 'preset'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="emit('update:inputMode', 'preset')"
          >
            <img src="/og-logo-emerald.png" alt="Potadi Logo" class="size-3.5 object-contain block dark:hidden" />
            <img src="/og-logo.png" alt="Potadi Logo" class="size-3.5 object-contain hidden dark:block" />
            <span>{{ $t("appStudio.inputTabs.preset") }}</span>
          </button>
        </div>
      </div>

      <!-- Optical Viewfinder Frame (4:3 Aspect Ratio with Sunken Reticle) -->
      <div
        class="relative w-full aspect-[4/3] rounded-3xl neu-inset p-2 overflow-hidden select-none"
        :class="{ 'ring-2 ring-emerald-500': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div class="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
          <!-- 1. Live Camera Stream Video Feed -->
          <video
            v-if="isCameraActive"
            ref="videoRef"
            autoplay
            playsinline
            muted
            class="w-full h-full object-cover"
          />

          <!-- 2. Static / Uploaded Leaf Image Preview -->
          <img
            v-else
            :src="activeViewfinderImage"
            :alt="currentDiagnosis ? t(currentDiagnosis.labelKey) : 'Potato Leaf'"
            class="w-full h-full object-cover transition-transform duration-500 ease-out"
            :class="{ 'scale-105': isScanning }"
          />

          <!-- Live Camera Indicator Badge -->
          <div v-if="isCameraActive" class="absolute top-3 left-3 z-20 pointer-events-none">
            <span class="px-3 py-1 rounded-full neu-glass text-[10px] font-mono text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-2 shadow-lg backdrop-blur-md">
              <span class="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span>{{ $t("appStudio.camera.liveBadge") }}</span>
            </span>
          </div>

          <!-- Optical Reticle HUD Corners (+ / ⌐) -->
          <div class="absolute inset-3 sm:inset-5 pointer-events-none flex flex-col justify-between z-10 opacity-85">
            <div class="flex justify-between">
              <div class="size-4 sm:size-5 border-t-2 border-l-2 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div class="size-4 sm:size-5 border-t-2 border-r-2 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div class="flex justify-between">
              <div class="size-4 sm:size-5 border-b-2 border-l-2 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div class="size-4 sm:size-5 border-b-2 border-r-2 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
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
              class="px-5 py-3 rounded-2xl neu-flat text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-2.5 shadow-2xl border border-emerald-500/40"
            >
              <UIcon
                name="i-ph-spinner-gap-bold"
                class="size-4.5 animate-spin text-emerald-500"
              />
              <span>{{ $t("appStudio.viewfinder.scanning") }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error message alert if diagnosis request failed or camera error -->
      <div
        v-if="errorMessage || cameraError"
        class="p-3.5 rounded-2xl neu-rose-inset text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5 border border-rose-500/30"
      >
        <UIcon name="i-ph-warning-circle-fill" class="size-4.5 shrink-0 text-rose-600 dark:text-rose-400" />
        <span class="flex-1">{{ errorMessage || cameraError }}</span>
      </div>

      <!-- Live Camera Active Control Bar (Shutter, Switch, Close) -->
      <div v-if="isCameraActive" class="space-y-3">
        <div class="flex items-center gap-3">
          <!-- Main Shutter Button -->
          <button
            type="button"
            class="flex-1 h-14 rounded-2xl text-sm font-bold neu-btn-primary flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all shadow-lg"
            @click="capturePhoto"
          >
            <UIcon name="i-ph-camera-bold" class="size-5" />
            <span>{{ $t("appStudio.camera.capture") }}</span>
          </button>

          <!-- Switch Camera Button (Flip Environment / User) -->
          <button
            type="button"
            class="size-14 rounded-2xl neu-btn text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
            :title="$t('appStudio.camera.switch')"
            @click="switchCamera"
          >
            <UIcon name="i-ph-arrows-clockwise-bold" class="size-5 text-emerald-600 dark:text-emerald-400" />
          </button>

          <!-- Close Camera Stream Button -->
          <button
            type="button"
            class="size-14 rounded-2xl neu-btn text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
            :title="$t('appStudio.camera.close')"
            @click="stopCamera"
          >
            <UIcon name="i-ph-x-bold" class="size-5" />
          </button>
        </div>
      </div>

      <!-- Standard Input Controls: Real Mode (Upload / Camera Trigger) or Preset Selector -->
      <div v-else-if="inputMode === 'real'" class="space-y-3">
        <div v-if="!uploadedImageUrl" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Live Camera Trigger Button (Min. 56px ergonomic touch) -->
          <button
            type="button"
            class="h-14 px-4 rounded-2xl text-xs sm:text-sm font-bold neu-btn text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            @click="startCamera"
          >
            <UIcon name="i-ph-camera-bold" class="size-5 text-emerald-600 dark:text-emerald-400" />
            <span>{{ $t("appStudio.upload.openCamera") }}</span>
          </button>

          <!-- File Picker Trigger Button (Min. 56px ergonomic touch) -->
          <button
            type="button"
            class="h-14 px-4 rounded-2xl text-xs sm:text-sm font-bold neu-btn text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            @click="triggerFileClick"
          >
            <UIcon name="i-ph-upload-simple-bold" class="size-5 text-emerald-600 dark:text-emerald-400" />
            <span>{{ $t("appStudio.upload.chooseFile") }}</span>
          </button>
        </div>

        <!-- Uploaded Image Status Card with Change/Remove Actions -->
        <div
          v-else
          class="p-3.5 rounded-2xl neu-emerald-inset flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="size-10 rounded-xl overflow-hidden shrink-0 neu-inset p-0.5 bg-black">
              <img :src="uploadedImageUrl" alt="Uploaded leaf" class="w-full h-full object-cover rounded-lg" />
            </div>
            <div class="truncate">
              <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
                {{ uploadedFileName || $t("appStudio.upload.customLeafLabel") }}
              </div>
              <!-- <div class="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                Siap didiagnosa oleh Cloud AI
              </div> -->
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- If image was taken from Camera: provide retake via camera + option to choose file -->
            <template v-if="isCameraPhoto">
              <button
                type="button"
                class="size-9 rounded-xl neu-btn text-emerald-700 dark:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                :title="$t('appStudio.upload.retakeCamera')"
                @click="startCamera"
              >
                <UIcon name="i-ph-camera-bold" class="size-4" />
              </button>
              <button
                type="button"
                class="size-9 rounded-xl neu-btn text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                :title="$t('appStudio.upload.switchToFile')"
                @click="triggerFileClick"
              >
                <UIcon name="i-ph-upload-simple-bold" class="size-4" />
              </button>
            </template>

            <!-- If image was chosen from Files: provide file change + option to open camera -->
            <template v-else>
              <button
                type="button"
                class="size-9 rounded-xl neu-btn text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                :title="$t('appStudio.upload.changeImage')"
                @click="triggerFileClick"
              >
                <UIcon name="i-ph-arrows-clockwise-bold" class="size-4" />
              </button>
              <button
                type="button"
                class="size-9 rounded-xl neu-btn text-emerald-700 dark:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                :title="$t('appStudio.upload.switchToCamera')"
                @click="startCamera"
              >
                <UIcon name="i-ph-camera-bold" class="size-4" />
              </button>
            </template>

            <!-- Trash / Remove Image Button -->
            <button
              type="button"
              class="size-9 rounded-xl neu-btn text-rose-600 dark:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
              :title="$t('appStudio.upload.removeImage')"
              @click="handleRemove"
            >
              <UIcon name="i-ph-trash-bold" class="size-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Input Controls: Preset Samples Selector (3 Chips) -->
      <div v-else class="space-y-2.5">
        <div class="text-[11px] font-mono text-slate-600 dark:text-slate-400">
          {{ $t("appStudio.viewfinder.chooseSampleHint") }}
        </div>
        <div class="grid grid-cols-3 gap-2.5">
          <button
            v-for="sample in sampleList"
            :key="sample.id"
            type="button"
            class="p-3 rounded-2xl text-left transition-all flex flex-col justify-between cursor-pointer hover:scale-[1.02]"
            :class="
              selectedPresetId === sample.id
                ? 'neu-pressed ring-2 ring-emerald-500/40 text-slate-900 dark:text-white'
                : 'neu-flat text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            "
            @click="emit('selectPreset', sample.id)"
          >
            <div class="text-xs font-bold truncate">
              {{ getSampleShortLabel(sample.labelKey) }}
            </div>
            <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{{ presetResults?.[sample.id]?.confidence || sample.confidence }}</span>
              <span
                class="size-2 rounded-full shadow-sm"
                :class="
                  (presetResults?.[sample.id]?.severityType || sample.severityType) === 'emergency'
                    ? 'bg-rose-500 shadow-rose-500/50'
                    : (presetResults?.[sample.id]?.severityType || sample.severityType) === 'moderate'
                      ? 'bg-amber-500 shadow-amber-500/50'
                      : 'bg-emerald-500 shadow-emerald-500/50'
                "
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Primary Action Button (Emerald 56px, Tactile Feedback) -->
      <button
        v-if="!isCameraActive"
        type="button"
        class="w-full h-14 rounded-2xl text-sm font-bold neu-btn-primary flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] transition-all"
        :disabled="isScanning || (inputMode === 'real' && !uploadedImageUrl)"
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
              : hasInferenceResult
                ? $t("appStudio.buttons.reanalyze")
                : $t("appStudio.buttons.analyze")
          }}
        </span>
      </button>
    </div>
  </section>
</template>
