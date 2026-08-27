<script setup lang="ts">
import { onMounted } from "vue";
import { useDiagnosisHistory } from "~/composables/useDiagnosisHistory";

definePageMeta({
  layout: "app",
});

const { t } = useI18n();
const { metrics, syncWithBackend } = useDiagnosisHistory();

useHead({
  title: "Dashboard - Potadi Farm Vision AI",
  meta: [
    {
      name: "description",
      content:
        "Dashboard pemantauan kesehatan lahan kentang, risiko mikroiklim spora, dan riwayat diagnosa daun presisi.",
    },
  ],
});

onMounted(async () => {
  await syncWithBackend(t);
});

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
  <main
    class="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-28 lg:pb-12"
  >
        <!-- 1. HERO CARD BANNER (Neumorphic Cockpit Banner with Specimen Showcase) -->
        <section
          class="relative overflow-hidden rounded-3xl p-6 sm:p-8 neu-convex flex flex-col md:flex-row items-center justify-between gap-6"
          aria-label="Banner Pemantauan Lahan"
        >
          <!-- Left: Copy & CTA -->
          <div class="space-y-4 max-w-xl z-10">
            <!-- <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset-sm text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold">
                <span class="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                <span>{{ $t("appStudio.dashboard.hero.liveBadge") }}</span>
              </span>
              <span class="text-xs font-mono text-slate-600 dark:text-slate-400">
                100% On-Device AI
              </span>
            </div> -->

            <div class="space-y-2">
              <h1
                class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {{ $t("appStudio.dashboard.hero.headline") }}
              </h1>
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
              >
                {{ $t("appStudio.dashboard.hero.subtext") }}
              </p>
            </div>

            <div class="pt-1">
              <NuxtLink
                to="/app/diagnosis"
                class="inline-flex items-center gap-2.5 h-12 px-6 rounded-2xl text-xs sm:text-sm font-bold neu-btn-primary active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{{ $t("appStudio.dashboard.hero.startDiagnosis") }}</span>
                <UIcon name="i-ph-arrow-right-bold" class="size-4" />
              </NuxtLink>
            </div>
          </div>

          <!-- Right: Botanical Leaf Showcase Frame (Sunken Specimen Socket) -->
          <div
            class="relative shrink-0 w-full sm:w-72 md:w-64 aspect-[4/3] rounded-2xl overflow-hidden neu-inset p-1.5 group"
          >
            <div class="relative w-full h-full rounded-xl overflow-hidden bg-black">
              <img
                src="/images/sample-leafs/healthy-leaf.jpg"
                alt="Potato Leaf Telemetry"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none"
              />
              <div
                class="absolute bottom-2.5 left-3 right-3 text-[10px] font-mono text-white flex items-center justify-between pointer-events-none"
              >
                <span class="font-bold text-emerald-300"
                  >Solanum tuberosum L.</span
                >
                <span
                  class="px-2 py-0.5 rounded-md neu-btn-primary text-[10px] font-bold"
                  >Sehat</span
                >
              </div>
            </div>
          </div>
        </section>

        <!-- 2. RINGKASAN HARI INI: 4 METRIC CARDS WITH MINI SVG SPARKLINES -->
        <section class="space-y-3.5" aria-label="Metrik Ringkasan Hari Ini">
          <div class="flex items-center justify-between">
            <h2
              class="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              {{ $t("appStudio.dashboard.title") }}
            </h2>
            <div class="neu-inset-sm px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-400">
              {{ $t("appStudio.dashboard.lastInspected") }}:
              {{ formatDate(new Date().toISOString()) }}
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <!-- Card 1: Daun Diperiksa (Green Sparkline) -->
            <div
              class="rounded-3xl neu-flat p-4 sm:p-5 flex flex-col justify-between h-full space-y-4 hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                  >{{ $t("appStudio.dashboard.metrics.totalScanned") }}</span
                >
                <div class="size-8 rounded-xl neu-convex flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <UIcon
                    name="i-ph-scan-duotone"
                    class="size-4.5"
                  />
                </div>
              </div>

              <div class="flex items-baseline justify-between gap-2">
                <div
                  class="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white"
                >
                  {{ metrics.totalScanned }}
                </div>
                <!-- Mini SVG Sparkline Green -->
                <div class="w-16 h-7 shrink-0 opacity-90">
                  <svg
                    viewBox="0 0 64 28"
                    class="w-full h-full overflow-visible"
                  >
                    <path
                      d="M2,22 Q16,18 28,14 T48,8 T62,4"
                      fill="none"
                      stroke="#10B981"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div
                class="neu-inset-sm px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate"
              >
                {{ $t("appStudio.dashboard.metrics.totalScannedSub") }}
              </div>
            </div>

            <!-- Card 2: Rasio Daun Sehat (Green Ascending Sparkline) -->
            <div
              class="rounded-3xl neu-flat p-4 sm:p-5 flex flex-col justify-between h-full space-y-4 hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                  >{{ $t("appStudio.dashboard.metrics.healthyRatio") }}</span
                >
                <div class="size-8 rounded-xl neu-convex flex items-center justify-center text-emerald-500 shrink-0">
                  <UIcon
                    name="i-ph-leaf-duotone"
                    class="size-4.5"
                  />
                </div>
              </div>

              <div class="flex items-baseline justify-between gap-2">
                <div
                  class="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400"
                >
                  {{ metrics.healthyRatio }}
                </div>
                <!-- Mini SVG Sparkline Green Ascending -->
                <div class="w-16 h-7 shrink-0 opacity-90">
                  <svg
                    viewBox="0 0 64 28"
                    class="w-full h-full overflow-visible"
                  >
                    <path
                      d="M2,24 Q20,22 36,12 T62,3"
                      fill="none"
                      stroke="#10B981"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div
                class="neu-inset-sm px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate"
              >
                {{ metrics.healthyCount }}
                {{ $t("appStudio.dashboard.metrics.healthyRatioSub") }}
              </div>
            </div>

            <!-- Card 3: Hawar Dini (Amber Sparkline) -->
            <div
              class="rounded-3xl neu-flat p-4 sm:p-5 flex flex-col justify-between h-full space-y-4 hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                  >{{ $t("appStudio.dashboard.metrics.earlyBlight") }}</span
                >
                <div class="size-8 rounded-xl neu-convex flex items-center justify-center text-amber-500 shrink-0">
                  <UIcon
                    name="i-ph-warning-diamond-duotone"
                    class="size-4.5"
                  />
                </div>
              </div>

              <div class="flex items-baseline justify-between gap-2">
                <div
                  class="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400"
                >
                  {{ metrics.earlyBlightCount }}
                </div>
                <!-- Mini SVG Sparkline Amber -->
                <div class="w-16 h-7 shrink-0 opacity-90">
                  <svg
                    viewBox="0 0 64 28"
                    class="w-full h-full overflow-visible"
                  >
                    <path
                      d="M2,18 Q18,6 32,20 T62,10"
                      fill="none"
                      stroke="#F59E0B"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div
                class="neu-inset-sm px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate"
              >
                {{ $t("appStudio.dashboard.metrics.earlyBlightSub") }}
              </div>
            </div>

            <!-- Card 4: Hawar Darurat (Rose Sparkline) -->
            <div
              class="rounded-3xl neu-flat p-4 sm:p-5 flex flex-col justify-between h-full space-y-4 hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                  >{{ $t("appStudio.dashboard.metrics.lateBlight") }}</span
                >
                <div class="size-8 rounded-xl neu-convex flex items-center justify-center text-rose-500 shrink-0">
                  <UIcon
                    name="i-ph-warning-octagon-duotone"
                    class="size-4.5"
                  />
                </div>
              </div>

              <div class="flex items-baseline justify-between gap-2">
                <div
                  class="text-2xl sm:text-3xl font-bold font-mono text-rose-600 dark:text-rose-400"
                >
                  {{ metrics.lateBlightCount }}
                </div>
                <!-- Mini SVG Sparkline Red -->
                <div class="w-16 h-7 shrink-0 opacity-90">
                  <svg
                    viewBox="0 0 64 28"
                    class="w-full h-full overflow-visible"
                  >
                    <path
                      d="M2,12 Q20,24 38,8 T62,20"
                      fill="none"
                      stroke="#F43F5E"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div
                class="neu-inset-sm px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate"
              >
                {{ $t("appStudio.dashboard.metrics.lateBlightSub") }}
              </div>
            </div>
          </div>
        </section>

        <!-- 3. HIGHLAND MICROCLIMATE & SPORE RISK WIDGET -->
        <section
          class="rounded-3xl neu-flat p-5 sm:p-6 space-y-5"
          aria-label="Indeks Risiko Mikroiklim"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-9 rounded-2xl neu-convex flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0"
              >
                <UIcon name="i-ph-cloud-fog-duotone" class="size-5" />
              </div>
              <div>
                <h3
                  class="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                >
                  {{ $t("appStudio.dashboard.weather.title") }}
                </h3>
                <p
                  class="text-[10px] font-mono text-slate-600 dark:text-slate-400"
                >
                  {{ $t("appStudio.dashboard.weather.location") }}
                </p>
              </div>
            </div>

            <!-- Risk Warning Badge -->
            <div
              class="flex items-center gap-1.5 px-3.5 py-1 rounded-full neu-amber-inset text-amber-800 dark:text-amber-300 text-xs font-mono font-bold w-fit"
            >
              <UIcon name="i-ph-warning-bold" class="size-3.5 text-amber-500" />
              <span>{{ $t("appStudio.dashboard.weather.riskLevel") }}</span>
            </div>
          </div>

          <!-- Telemetry Sensor Grid (Sunken Wells with Neumorphic Numbers) -->
          <div class="grid grid-cols-3 gap-3 text-center">
            <div
              class="p-4 rounded-2xl neu-inset space-y-1"
            >
              <div
                class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase"
              >
                {{ $t("appStudio.dashboard.weather.humidity") }}
              </div>
              <div
                class="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400"
              >
                88%
              </div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Lembap Tinggi</div>
            </div>
            <div
              class="p-4 rounded-2xl neu-inset space-y-1"
            >
              <div
                class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase"
              >
                {{ $t("appStudio.dashboard.weather.temperature") }}
              </div>
              <div
                class="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white"
              >
                16.4°C
              </div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Dataran Sejuk</div>
            </div>
            <div
              class="p-4 rounded-2xl neu-inset space-y-1"
            >
              <div
                class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase"
              >
                {{ $t("appStudio.dashboard.weather.rainProb") }}
              </div>
              <div
                class="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400"
              >
                75%
              </div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Potensi Kabut</div>
            </div>
          </div>

          <!-- Agronomic Spore Alert -->
          <div
            class="p-4 rounded-2xl neu-amber-inset space-y-1.5 text-xs text-amber-900 dark:text-amber-200"
          >
            <div class="font-bold flex items-center gap-2">
              <UIcon
                name="i-ph-shield-warning-duotone"
                class="size-4 shrink-0 text-amber-600 dark:text-amber-400"
              />
              <span>{{ $t("appStudio.dashboard.weather.riskDesc") }}</span>
            </div>
            <p class="text-slate-700 dark:text-slate-300 pl-6 leading-relaxed">
              {{ $t("appStudio.dashboard.weather.mitigationAction") }}
            </p>
          </div>
        </section>

        <!-- 4. TODAY'S AGRONOMIC RECOMMENDATION CARD -->
        <section
          class="p-5 sm:p-6 rounded-3xl neu-convex border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          aria-label="Rekomendasi Hari Ini"
        >
          <div class="flex items-start gap-3.5">
            <div
              class="size-11 rounded-2xl neu-emerald-inset text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"
            >
              <UIcon name="i-ph-plant-duotone" class="size-6" />
            </div>
            <div class="space-y-1">
              <h3
                class="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide"
              >
                {{ $t("appStudio.dashboard.recommendation.title") }}
              </h3>
              <p
                class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl"
              >
                {{ $t("appStudio.dashboard.recommendation.tip") }}
              </p>
            </div>
          </div>

          <NuxtLink
            to="/app/diagnosis"
            class="h-11 px-5 rounded-2xl text-xs font-mono font-bold neu-btn-primary flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all cursor-pointer"
          >
            <span>{{ $t("appStudio.dashboard.recommendation.action") }}</span>
            <UIcon name="i-ph-arrow-right-bold" class="size-3.5" />
          </NuxtLink>
        </section>

        <!-- 5. RECENT SCANS LIST -->
        <section class="space-y-4" aria-label="Deteksi Terakhir">
          <div class="flex items-center justify-between">
            <h2
              class="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white font-mono"
            >
              {{ $t("appStudio.dashboard.recentDetections") }}
            </h2>
            <NuxtLink
              to="/app/history"
              class="neu-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{{ $t("appStudio.dashboard.viewAllHistory") }}</span>
              <UIcon name="i-ph-arrow-right-bold" class="size-3" />
            </NuxtLink>
          </div>

          <div
            v-if="metrics.recentDetections.length > 0"
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div
              v-for="record in metrics.recentDetections"
              :key="record.id"
              class="rounded-3xl neu-flat p-4 sm:p-5 space-y-3 hover:scale-[1.02] transition-all cursor-default"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-13 rounded-2xl overflow-hidden shrink-0 neu-inset p-0.5 bg-black"
                >
                  <img
                    :src="record.image"
                    :alt="record.label"
                    class="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <div
                    class="text-xs font-bold text-slate-900 dark:text-white truncate"
                  >
                    {{ record.label }}
                  </div>
                  <div class="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                    {{ formatDate(record.timestamp) }}
                  </div>
                </div>
              </div>

              <div
                class="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-xs font-mono"
              >
                <span
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  :class="
                    record.severityType === 'emergency'
                      ? 'neu-rose-inset text-rose-800 dark:text-rose-300'
                      : record.severityType === 'moderate'
                        ? 'neu-amber-inset text-amber-800 dark:text-amber-300'
                        : 'neu-emerald-inset text-emerald-800 dark:text-emerald-300'
                  "
                >
                  {{ record.confidence }}
                </span>

                <NuxtLink
                  to="/app/history"
                  class="neu-btn px-3 py-1 rounded-lg text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                >
                  Buka Resep &rarr;
                </NuxtLink>
              </div>
            </div>
          </div>

          <div
            v-else
            class="p-10 rounded-3xl neu-flat text-center space-y-3 text-xs font-mono text-slate-600 dark:text-slate-400"
          >
            <div class="size-12 rounded-2xl neu-inset flex items-center justify-center mx-auto text-slate-500">
              <UIcon name="i-ph-tray-duotone" class="size-6 opacity-60" />
            </div>
            <p>{{ $t("appStudio.dashboard.noDetections") }}</p>
          </div>
        </section>
      </main>
</template>
