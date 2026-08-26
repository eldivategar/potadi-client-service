<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AppSidebar from "~/components/app/Sidebar.vue";
import AppMobileHeader from "~/components/app/MobileHeader.vue";
import AppBottomNav from "~/components/app/BottomNav.vue";
import RecipeModal from "~/components/app/RecipeModal.vue";
import { useDiagnosisHistory, type ScanRecord } from "~/composables/useDiagnosisHistory";
import { useSidebar } from "~/composables/useSidebar";

const { t } = useI18n();
const { historyRecords, initHistory, deleteRecord, clearAllHistory } = useDiagnosisHistory();
const { isCollapsed } = useSidebar();

useHead({
  title: "Riwayat Diagnosa - Potadi Botanical Vision AI",
  meta: [
    {
      name: "description",
      content: "Arsip riwayat hasil diagnosa pemindaian daun kentang dan panduan resep tindakan.",
    },
  ],
});

onMounted(() => {
  initHistory();
});

const activeFilter = ref<"all" | "earlyBlight" | "lateBlight" | "healthy">("all");
const selectedRecordForRecipe = ref<ScanRecord | null>(null);
const isRecipeModalOpen = ref(false);
const showConfirmClearModal = ref(false);

const filteredRecords = computed(() => {
  if (activeFilter.value === "all") return historyRecords.value;
  return historyRecords.value.filter((r) => r.catalogKey === activeFilter.value);
});

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
  <div
    class="min-h-screen bg-[#F8FAF9] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200"
  >
    <!-- Desktop Left Fixed Sidebar (>= 1024px) -->
    <AppSidebar />

    <!-- Mobile Top Header (< 1024px) -->
    <AppMobileHeader />

    <!-- Main Content Area: Offset by lg:pl-72 / lg:pl-22 -->
    <div
      class="flex-1 flex flex-col transition-[padding] duration-300 ease-in-out"
      :class="isCollapsed ? 'lg:pl-22' : 'lg:pl-72'"
    >
      <main class="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28 lg:pb-12">
        <!-- Header Bar: Title, Description & Clear All Action -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-5">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-emerald-500" />
              <span class="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                FIELD LOG ARCHIVE
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {{ $t("appStudio.history.title") }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {{ $t("appStudio.history.subtitle") }}
            </p>
          </div>

          <!-- Clear All Button -->
          <div v-if="historyRecords.length > 0" class="flex items-center gap-2">
            <button
              type="button"
              class="h-10 px-4 rounded-xl text-xs font-mono font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              @click="showConfirmClearModal = true"
            >
              <UIcon name="i-ph-trash-duotone" class="size-4" />
              <span>{{ $t("appStudio.history.clearAll") }}</span>
            </button>
          </div>
        </div>

        <!-- Filter Tabs Switcher -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all shrink-0 cursor-pointer"
            :class="
              activeFilter === 'all'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="activeFilter = 'all'"
          >
            {{ $t("appStudio.history.filters.all") }} ({{ historyRecords.length }})
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all shrink-0 cursor-pointer"
            :class="
              activeFilter === 'earlyBlight'
                ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 shadow-sm'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="activeFilter = 'earlyBlight'"
          >
            {{ $t("appStudio.history.filters.earlyBlight") }}
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all shrink-0 cursor-pointer"
            :class="
              activeFilter === 'lateBlight'
                ? 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300 shadow-sm'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="activeFilter = 'lateBlight'"
          >
            {{ $t("appStudio.history.filters.lateBlight") }}
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all shrink-0 cursor-pointer"
            :class="
              activeFilter === 'healthy'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="activeFilter = 'healthy'"
          >
            {{ $t("appStudio.history.filters.healthy") }}
          </button>
        </div>

        <!-- History Records Grid -->
        <div v-if="filteredRecords.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="record in filteredRecords"
            :key="record.id"
            class="rounded-2xl bg-white dark:bg-[#121216] border border-black/8 dark:border-white/10 p-4 sm:p-5 space-y-4 shadow-sm group hover:border-emerald-500/30 transition-all"
          >
            <!-- Top: Image & Disease Meta -->
            <div class="flex items-start gap-3.5">
              <div class="size-16 rounded-xl overflow-hidden shrink-0 border border-black/10 dark:border-white/10 bg-black shadow-inner">
                <img :src="record.image" :alt="record.label" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
                class="px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-block"
                :class="
                  record.severityType === 'emergency'
                    ? 'text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30'
                    : record.severityType === 'moderate'
                      ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30'
                      : 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30'
                "
              >
                {{ record.severityLabel }}
              </span>
            </div>

            <!-- Bottom Actions: View Recipe & Delete Item -->
            <div class="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
              <button
                type="button"
                class="flex-1 h-9 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                @click="openRecipe(record)"
              >
                <UIcon name="i-ph-file-text-duotone" class="size-3.5" />
                <span>{{ $t("appStudio.history.viewRecipe") }}</span>
              </button>

              <button
                type="button"
                class="size-9 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-600 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
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
          class="rounded-3xl bg-white dark:bg-[#121216] border border-black/8 dark:border-white/10 p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-sm"
        >
          <div class="size-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mx-auto text-slate-500">
            <UIcon name="i-ph-clock-countdown-duotone" class="size-7" />
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ $t("appStudio.history.emptyTitle") }}
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              {{ $t("appStudio.history.emptyDesc") }}
            </p>
          </div>
          <NuxtLink
            to="/app/diagnosis"
            class="h-11 px-5 rounded-xl text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 transition-all inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <UIcon name="i-ph-scan-bold" class="size-4" />
            <span>{{ $t("appStudio.dashboard.hero.startDiagnosis") }}</span>
          </NuxtLink>
        </div>
      </main>
    </div>

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
      <div class="relative w-full max-w-md rounded-2xl bg-[#F8FAF9] dark:bg-[#121216] border border-black/10 dark:border-white/15 p-5 space-y-4 z-10 text-slate-900 dark:text-slate-100">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <UIcon name="i-ph-warning-bold" class="size-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">
              {{ $t("appStudio.history.confirmClearTitle") }}
            </h4>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ $t("appStudio.history.confirmClearDesc") }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-black/5 dark:border-white/5">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            @click="showConfirmClearModal = false"
          >
            {{ $t("appStudio.history.btnCancel") }}
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
            @click="handleConfirmClear"
          >
            {{ $t("appStudio.history.btnConfirmDelete") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Mobile Bottom Navigation (< 1024px) -->
    <AppBottomNav />
  </div>
</template>
