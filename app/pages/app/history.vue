<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import RecipeModal from "~/components/app/RecipeModal.vue";
import { useDiagnosisHistory, type ScanRecord } from "~/composables/useDiagnosisHistory";

definePageMeta({
  layout: "app",
});

const { t } = useI18n();
const { historyRecords, isSyncing, syncWithBackend, deleteRecord, clearAllHistory } = useDiagnosisHistory();

useHead({
  title: "Riwayat Diagnosa - Potadi Botanical Vision AI",
  meta: [
    {
      name: "description",
      content: "Arsip riwayat hasil diagnosa pemindaian daun kentang dan panduan resep tindakan.",
    },
  ],
});

onMounted(async () => {
  await syncWithBackend(t);
});

const activeFilter = ref<"all" | "earlyBlight" | "lateBlight" | "healthy">("all");
const selectedRecordForRecipe = ref<ScanRecord | null>(null);
const isRecipeModalOpen = ref(false);
const showConfirmClearModal = ref(false);

const filteredRecords = computed(() => {
  if (activeFilter.value === "all") return historyRecords.value;
  return historyRecords.value.filter((r) => r.catalogKey === activeFilter.value);
});

const filterCounts = computed(() => ({
  all: historyRecords.value.length,
  earlyBlight: historyRecords.value.filter((r) => r.catalogKey === "earlyBlight").length,
  lateBlight: historyRecords.value.filter((r) => r.catalogKey === "lateBlight").length,
  healthy: historyRecords.value.filter((r) => r.catalogKey === "healthy").length,
}));

const openRecipe = (record: ScanRecord) => {
  selectedRecordForRecipe.value = record;
  isRecipeModalOpen.value = true;
};

const closeRecipe = () => {
  isRecipeModalOpen.value = false;
  selectedRecordForRecipe.value = null;
};

const handleDelete = (id: string) => {
  deleteRecord(id);
};

const handleConfirmClear = () => {
  clearAllHistory();
  showConfirmClearModal.value = false;
};

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
  <div>
    <main class="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28 lg:pb-12">
        <!-- Header Bar: Title, Description & Clear All Action -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-5">
          <div class="space-y-1">
            <!-- <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset-sm text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                <span class="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                <span>FIELD LOG ARCHIVE</span>
              </span>
            </div> -->
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              {{ $t("appStudio.history.title") }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {{ $t("appStudio.history.subtitle") }}
            </p>
          </div>

          <!-- Clear All Button -->
          <div v-if="historyRecords.length > 0" class="flex items-center gap-2">
            <button
              type="button"
              class="h-11 px-4 rounded-2xl text-xs font-mono font-bold text-rose-600 dark:text-rose-400 neu-btn transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              @click="showConfirmClearModal = true"
            >
              <UIcon name="i-ph-trash-duotone" class="size-4" />
              <span>{{ $t("appStudio.history.clearAll") }}</span>
            </button>
          </div>
        </div>

        <!-- Filter Tabs Switcher with Smooth Sliding Indicator -->
        <div class="overflow-x-auto pb-1 max-w-full">
          <div class="relative grid grid-cols-4 p-1 rounded-2xl neu-inset min-w-[540px] sm:min-w-[580px] w-fit">
            <!-- Sliding Active Background Pill Indicator -->
            <div
              class="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/4)] rounded-xl neu-convex shadow-sm transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none transform-gpu"
              :style="{
                transform:
                  activeFilter === 'all'
                    ? 'translateX(0%)'
                    : activeFilter === 'earlyBlight'
                      ? 'translateX(100%)'
                      : activeFilter === 'lateBlight'
                        ? 'translateX(200%)'
                        : 'translateX(300%)',
              }"
            />

            <button
              type="button"
              class="relative z-10 py-2.5 px-3 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer flex items-center justify-center gap-1.5"
              :class="
                activeFilter === 'all'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="activeFilter = 'all'"
            >
              <span>{{ $t("appStudio.history.filters.all") }}</span>
              <span class="opacity-80">({{ filterCounts.all }})</span>
            </button>

            <button
              type="button"
              class="relative z-10 py-2.5 px-3 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer flex items-center justify-center gap-1.5"
              :class="
                activeFilter === 'earlyBlight'
                  ? 'text-amber-800 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="activeFilter = 'earlyBlight'"
            >
              <span>{{ $t("appStudio.history.filters.earlyBlight") }}</span>
              <span class="opacity-80">({{ filterCounts.earlyBlight }})</span>
            </button>

            <button
              type="button"
              class="relative z-10 py-2.5 px-3 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer flex items-center justify-center gap-1.5"
              :class="
                activeFilter === 'lateBlight'
                  ? 'text-rose-800 dark:text-rose-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="activeFilter = 'lateBlight'"
            >
              <span>{{ $t("appStudio.history.filters.lateBlight") }}</span>
              <span class="opacity-80">({{ filterCounts.lateBlight }})</span>
            </button>

            <button
              type="button"
              class="relative z-10 py-2.5 px-3 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer flex items-center justify-center gap-1.5"
              :class="
                activeFilter === 'healthy'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
              @click="activeFilter = 'healthy'"
            >
              <span>{{ $t("appStudio.history.filters.healthy") }}</span>
              <span class="opacity-80">({{ filterCounts.healthy }})</span>
            </button>
          </div>
        </div>

        <!-- History Records Grid -->
        <div v-if="filteredRecords.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="record in filteredRecords"
            :key="record.id"
            class="rounded-3xl neu-flat p-4 sm:p-5 space-y-4 hover:scale-[1.02] transition-all cursor-default"
          >
            <!-- Top: Image & Disease Meta -->
            <div class="flex items-start gap-3.5">
              <div class="size-16 rounded-2xl overflow-hidden shrink-0 neu-inset p-1 bg-black">
                <img :src="record.image" :alt="record.label" class="w-full h-full object-cover rounded-xl" />
              </div>

              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono text-slate-500">
                    {{ formatDate(record.timestamp) }}
                  </span>
                  <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {{ record.confidence }}
                  </span>
                </div>

                <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {{ record.label }}
                </h3>
                <p class="text-[11px] font-mono text-slate-500 italic truncate">
                  {{ record.scientificName }}
                </p>
              </div>
            </div>

            <!-- Severity Badge Tag -->
            <div>
              <span
                class="px-3 py-1 rounded-xl text-[11px] font-bold inline-block"
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

            <!-- Bottom Actions: View Recipe & Delete Item -->
            <div class="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2.5">
              <button
                type="button"
                class="flex-1 h-10 px-3 rounded-xl neu-btn-primary text-xs font-mono font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                @click="openRecipe(record)"
              >
                <UIcon name="i-ph-file-text-duotone" class="size-4" />
                <span>{{ $t("appStudio.history.viewRecipe") }}</span>
              </button>

              <button
                type="button"
                class="size-10 rounded-xl neu-btn text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                :title="$t('appStudio.history.deleteItem')"
                @click="handleDelete(record.id)"
              >
                <UIcon name="i-ph-trash-bold" class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="rounded-3xl neu-flat p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-sm"
        >
          <div class="size-16 rounded-2xl neu-inset flex items-center justify-center mx-auto text-slate-500">
            <UIcon name="i-ph-clock-countdown-duotone" class="size-7" />
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ $t("appStudio.history.emptyTitle") }}
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ $t("appStudio.history.emptyDesc") }}
            </p>
          </div>
          <NuxtLink
            to="/app/diagnosis"
            class="h-12 px-6 rounded-2xl text-xs sm:text-sm font-mono font-bold neu-btn-primary active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <UIcon name="i-ph-scan-bold" class="size-4" />
            <span>{{ $t("appStudio.dashboard.hero.startDiagnosis") }}</span>
          </NuxtLink>
        </div>
      </main>

      <!-- Recipe Modal Window -->
      <RecipeModal
        :record="selectedRecordForRecipe"
        :is-open="isRecipeModalOpen"
        @close="closeRecipe"
      />

      <!-- Clear All Confirmation Modal -->
      <div
        v-if="showConfirmClearModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showConfirmClearModal = false" />
        <div class="relative w-full max-w-md rounded-3xl neu-flat p-6 space-y-5 z-10 text-slate-900 dark:text-slate-100 border border-black/5 dark:border-white/10 shadow-2xl">
          <div class="flex items-center gap-3.5">
            <div class="size-11 rounded-2xl neu-rose-inset text-rose-600 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-warning-bold" class="size-5" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">
                {{ $t("appStudio.history.confirmClearTitle") }}
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {{ $t("appStudio.history.confirmClearDesc") }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-mono font-medium neu-btn text-slate-700 dark:text-slate-300 cursor-pointer active:scale-95"
              @click="showConfirmClearModal = false"
            >
              {{ $t("appStudio.history.btnCancel") }}
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95 shadow-md"
              @click="handleConfirmClear"
            >
              {{ $t("appStudio.history.btnConfirmDelete") }}
            </button>
          </div>
        </div>
      </div>
  </div>
</template>
