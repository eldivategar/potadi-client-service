<script setup lang="ts">
import { onMounted, computed } from 'vue';
import type { DiseaseRiskLevel } from '~/types/weather';

const { t, te, locale } = useI18n();

const {
  status,
  location,
  elevation,
  currentWeather,
  lateBlight,
  earlyBlight,
  overallScore,
  overallLevel,
  dominantDisease,
  currentRiskLevel,
  forecastRiskLevel24h,
  lastUpdated,
  isRefreshing,
  errorMessage,
  requestLocationAndFetch,
  refreshWeather,
  initLifecycle,
} = useWeather();

onMounted(() => {
  initLifecycle();
  if (status.value === 'IDLE') {
    requestLocationAndFetch();
  }
});

const getRiskBadgeClass = (level: DiseaseRiskLevel) => {
  switch (level) {
    case 'VERY_HIGH':
      return 'neu-rose-inset text-rose-800 dark:text-rose-300 border border-rose-500/30';
    case 'HIGH':
      return 'neu-amber-inset text-amber-800 dark:text-amber-300 border border-amber-500/30';
    case 'MODERATE':
      return 'neu-amber-inset text-amber-700 dark:text-amber-400 border border-amber-500/20';
    case 'LOW':
    default:
      return 'neu-emerald-inset text-emerald-800 dark:text-emerald-300 border border-emerald-500/30';
  }
};

const getRiskProgressBarColor = (level: DiseaseRiskLevel) => {
  switch (level) {
    case 'VERY_HIGH':
      return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
    case 'HIGH':
      return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
    case 'MODERATE':
      return 'bg-amber-400';
    case 'LOW':
    default:
      return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  }
};

const formatTime = (date: Date | null) => {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

const activeRecommendation = computed(() => {
  const target = dominantDisease.value === 'earlyBlight' ? earlyBlight.value : lateBlight.value;
  if (target?.recommendationKey) {
    const key = `appStudio.dashboard.weather.recommendations.${target.recommendationKey}`;
    if (te(key)) {
      return t(key);
    }
  }
  if (target?.recommendation) {
    return target.recommendation;
  }
  return t('appStudio.dashboard.weather.recommendations.normal');
});
</script>

<template>
  <section
    class="rounded-3xl neu-flat p-5 sm:p-6 space-y-5 transition-all duration-300"
    aria-label="Indeks Risiko Mikroiklim & Cuaca Realtime"
  >
    <!-- Top Header: Title, Location & Realtime GPS Telemetry Controls -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="size-10 rounded-2xl neu-convex flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0"
        >
          <UIcon name="i-ph-cloud-fog-duotone" class="size-5" />
        </div>
        <div>
          <h3
            class="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white"
          >
            {{ $t('appStudio.dashboard.weather.title') }}
          </h3>
          <div class="flex items-center gap-1.5 mt-0.5">
            <UIcon
              name="i-ph-map-pin-duotone"
              class="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
            />
            <p class="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
              {{ location?.displayName || $t('appStudio.dashboard.weather.location') }}
              <span v-if="elevation" class="text-slate-600 dark:text-slate-400">
                • {{ elevation }} {{ $t('appStudio.dashboard.weather.elevation') }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Header Controls: GPS Live Badge & Manual Refresh Button -->
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <div
          v-if="status === 'SUCCESS' || status === 'LOADING'"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset-sm text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold"
        >
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
          <span>{{ $t('appStudio.dashboard.weather.liveBadge') }}</span>
        </div>

        <button
          type="button"
          :disabled="isRefreshing"
          @click="refreshWeather"
          class="neu-btn px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          :title="$t('appStudio.dashboard.weather.refresh')"
        >
          <UIcon
            name="i-ph-arrows-clockwise-bold"
            class="size-3.5 text-emerald-600 dark:text-emerald-400"
            :class="{ 'animate-spin': isRefreshing }"
          />
          <span class="hidden sm:inline">
            {{ isRefreshing ? $t('appStudio.dashboard.weather.refreshing') : $t('appStudio.dashboard.weather.refresh') }}
          </span>
        </button>
      </div>
    </div>

    <!-- STATE 1: REQUESTING LOCATION / INITIAL LOADING -->
    <div
      v-if="status === 'REQUESTING_LOCATION' || (status === 'LOADING' && !currentWeather)"
      class="p-8 rounded-2xl neu-inset text-center space-y-3"
    >
      <div class="size-10 rounded-2xl neu-convex flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
        <UIcon name="i-ph-spinner-gap-bold" class="size-5 animate-spin" />
      </div>
      <p class="text-xs font-mono text-slate-600 dark:text-slate-400">
        {{ $t('appStudio.dashboard.weather.connecting') }}
      </p>
    </div>

    <!-- STATE 2: PERMISSION DENIED / GPS DISABLED -->
    <div
      v-else-if="status === 'PERMISSION_DENIED'"
      class="p-5 sm:p-6 rounded-2xl neu-amber-inset space-y-3"
    >
      <div class="flex items-start gap-3">
        <div class="size-9 rounded-xl neu-convex flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <UIcon name="i-ph-warning-bold" class="size-5" />
        </div>
        <div class="space-y-1">
          <h4 class="text-xs font-mono font-bold text-amber-900 dark:text-amber-200 uppercase">
            {{ $t('appStudio.dashboard.weather.permissionTitle') }}
          </h4>
          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ errorMessage || $t('appStudio.dashboard.weather.permissionDesc') }}
          </p>
        </div>
      </div>

      <div class="pt-2 flex justify-end">
        <button
          type="button"
          @click="requestLocationAndFetch(true)"
          class="neu-btn-primary px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <UIcon name="i-ph-map-pin-duotone" class="size-4" />
          <span>{{ $t('appStudio.dashboard.weather.btnEnableLocation') }}</span>
        </button>
      </div>
    </div>

    <!-- STATE 3: OPEN-METEO UNAVAILABLE / OFFLINE -->
    <div
      v-else-if="status === 'UNAVAILABLE'"
      class="p-5 sm:p-6 rounded-2xl neu-rose-inset space-y-3"
    >
      <div class="flex items-start gap-3">
        <div class="size-9 rounded-xl neu-convex flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
          <UIcon name="i-ph-warning-octagon-duotone" class="size-5" />
        </div>
        <div class="space-y-1">
          <h4 class="text-xs font-mono font-bold text-rose-900 dark:text-rose-200 uppercase">
            {{ $t('appStudio.dashboard.weather.unavailableTitle') }}
          </h4>
          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ errorMessage || $t('appStudio.dashboard.weather.unavailableDesc') }}
          </p>
        </div>
      </div>

      <div class="pt-2 flex justify-end">
        <button
          type="button"
          @click="refreshWeather"
          class="neu-btn px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <UIcon name="i-ph-arrows-clockwise-bold" class="size-4 text-rose-600 dark:text-rose-400" />
          <span>{{ $t('appStudio.dashboard.weather.btnRetry') }}</span>
        </button>
      </div>
    </div>

    <!-- STATE 4: TELEMETRY & DISEASE RISK LOADED (SUCCESS) -->
    <div v-else-if="currentWeather" class="space-y-5">
      <!-- 1. Overall Weather Disease Risk Banner -->
      <div
        class="p-4 rounded-2xl neu-convex flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {{ $t('appStudio.dashboard.weather.overallRisk') }}
            </span>
            <span
              v-if="dominantDisease"
              class="text-[10px] font-mono px-2 py-0.5 rounded-md neu-inset-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              {{ $t('appStudio.dashboard.weather.dominantDriver') }}:
              {{ dominantDisease === 'lateBlight' ? 'Late Blight' : 'Early Blight' }}
            </span>
          </div>

          <div class="flex items-baseline gap-2.5">
            <span class="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {{ overallScore }}%
            </span>
            <span class="text-xs font-mono text-slate-500">
              ({{ $t(`appStudio.dashboard.weather.levels.${overallLevel}`) }})
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-center">
          <span
            class="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold"
            :class="getRiskBadgeClass(overallLevel)"
          >
            {{ $t(`appStudio.dashboard.weather.levels.${overallLevel}`) }}
          </span>
        </div>
      </div>

      <!-- 2. Dual Disease Rule Engine Cards: Late Blight vs Early Blight -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <!-- Card Late Blight -->
        <div
          class="p-4 rounded-2xl neu-inset space-y-3"
          :class="{ 'ring-1 ring-rose-500/30': dominantDisease === 'lateBlight' && overallScore >= 50 }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full" :class="getRiskProgressBarColor(lateBlight?.level || 'LOW')" />
              <span class="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {{ $t('appStudio.dashboard.weather.lateBlightTitle') }}
              </span>
            </div>
            <span
              class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold"
              :class="getRiskBadgeClass(lateBlight?.level || 'LOW')"
            >
              {{ lateBlight?.score ?? 0 }}%
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-2 rounded-full neu-inset-sm overflow-hidden p-0.5">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="getRiskProgressBarColor(lateBlight?.level || 'LOW')"
              :style="{ width: `${lateBlight?.score ?? 0}%` }"
            />
          </div>

          <div class="flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400">
            <span>{{ $t('appStudio.dashboard.weather.phytophthoraSpore') }}</span>
            <span>{{ lateBlight?.favorableHours ?? 0 }} {{ $t('appStudio.dashboard.weather.favorableHours') }}</span>
          </div>
        </div>

        <!-- Card Early Blight -->
        <div
          class="p-4 rounded-2xl neu-inset space-y-3"
          :class="{ 'ring-1 ring-amber-500/30': dominantDisease === 'earlyBlight' && overallScore >= 50 }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full" :class="getRiskProgressBarColor(earlyBlight?.level || 'LOW')" />
              <span class="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {{ $t('appStudio.dashboard.weather.earlyBlightTitle') }}
              </span>
            </div>
            <span
              class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold"
              :class="getRiskBadgeClass(earlyBlight?.level || 'LOW')"
            >
              {{ earlyBlight?.score ?? 0 }}%
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-2 rounded-full neu-inset-sm overflow-hidden p-0.5">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="getRiskProgressBarColor(earlyBlight?.level || 'LOW')"
              :style="{ width: `${earlyBlight?.score ?? 0}%` }"
            />
          </div>

          <div class="flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400">
            <span>{{ $t('appStudio.dashboard.weather.alternariaConidia') }}</span>
            <span>{{ earlyBlight?.favorableHours ?? 0 }} {{ $t('appStudio.dashboard.weather.favorableHours') }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Telemetry Sensor Grid (3 Sunken Wells) -->
      <div class="grid grid-cols-3 gap-3 text-center">
        <!-- Humidity -->
        <div class="p-3.5 sm:p-4 rounded-2xl neu-inset space-y-1">
          <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
            <UIcon name="i-ph-drop-duotone" class="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>{{ $t('appStudio.dashboard.weather.humidity') }}</span>
          </div>
          <div
            class="text-lg sm:text-2xl font-bold font-mono"
            :class="currentWeather.humidity >= 85 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'"
          >
            {{ Math.round(currentWeather.humidity) }}%
          </div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            {{
              currentWeather.humidity >= 90
                ? $t('appStudio.dashboard.weather.humidityDescriptors.critical')
                : currentWeather.humidity >= 80
                  ? $t('appStudio.dashboard.weather.humidityDescriptors.high')
                  : $t('appStudio.dashboard.weather.humidityDescriptors.optimal')
            }}
          </div>
        </div>

        <!-- Temperature -->
        <div class="p-3.5 sm:p-4 rounded-2xl neu-inset space-y-1">
          <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
            <UIcon name="i-ph-thermometer-simple-duotone" class="size-3 text-amber-600 dark:text-amber-400" />
            <span>{{ $t('appStudio.dashboard.weather.temperature') }}</span>
          </div>
          <div class="text-lg sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {{ currentWeather.temperature.toFixed(1) }}°C
          </div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            {{
              currentWeather.temperature <= 18
                ? $t('appStudio.dashboard.weather.tempDescriptors.coolHighland')
                : currentWeather.temperature <= 25
                  ? $t('appStudio.dashboard.weather.tempDescriptors.mildComfort')
                  : $t('appStudio.dashboard.weather.tempDescriptors.warm')
            }}
          </div>
        </div>

        <!-- Precipitation / Rain -->
        <div class="p-3.5 sm:p-4 rounded-2xl neu-inset space-y-1">
          <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
            <UIcon name="i-ph-cloud-rain-duotone" class="size-3 text-blue-500" />
            <span>{{ $t('appStudio.dashboard.weather.rainfall') }}</span>
          </div>
          <div
            class="text-lg sm:text-2xl font-bold font-mono"
            :class="currentWeather.precipitation > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'"
          >
            {{ currentWeather.precipitation.toFixed(1) }} <span class="text-xs font-normal">mm</span>
          </div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            {{
              currentWeather.precipitation >= 2
                ? $t('appStudio.dashboard.weather.rainDescriptors.activeRain')
                : currentWeather.precipitation > 0
                  ? $t('appStudio.dashboard.weather.rainDescriptors.lightPrecip')
                  : $t('appStudio.dashboard.weather.rainDescriptors.noRain')
            }}
          </div>
        </div>
      </div>

      <!-- 4. Current vs 24h Forecast Comparison Mini Banner -->
      <div class="p-3 rounded-2xl neu-inset-sm flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
        <div class="flex items-center gap-2">
          <span class="text-slate-600 dark:text-slate-400 font-medium">{{ $t('appStudio.dashboard.weather.currentCondition') }}:</span>
          <span class="font-bold px-2 py-0.5 rounded-md neu-inset-sm" :class="getRiskBadgeClass(currentRiskLevel)">
            {{ $t(`appStudio.dashboard.weather.levels.${currentRiskLevel}`) }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-600 dark:text-slate-400 font-medium">{{ $t('appStudio.dashboard.weather.forecast24h') }}:</span>
          <span class="font-bold px-2 py-0.5 rounded-md neu-inset-sm" :class="getRiskBadgeClass(forecastRiskLevel24h)">
            {{ $t(`appStudio.dashboard.weather.levels.${forecastRiskLevel24h}`) }}
          </span>
        </div>
      </div>

      <!-- 5. Agronomic Spore Mitigation Alert Box -->
      <div
        class="p-4 rounded-2xl space-y-1.5 text-xs transition-colors duration-300"
        :class="overallLevel === 'VERY_HIGH' || overallLevel === 'HIGH' ? 'neu-amber-inset text-amber-900 dark:text-amber-200' : 'neu-emerald-inset text-emerald-900 dark:text-emerald-200'"
      >
        <div class="font-bold flex items-center gap-2">
          <UIcon
            :name="overallLevel === 'VERY_HIGH' || overallLevel === 'HIGH' ? 'i-ph-shield-warning-duotone' : 'i-ph-check-circle-duotone'"
            class="size-4 shrink-0"
            :class="overallLevel === 'VERY_HIGH' || overallLevel === 'HIGH' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'"
          />
          <span>{{ $t('appStudio.dashboard.weather.recommendationHeading') }}</span>
        </div>
        <p class="text-slate-700 dark:text-slate-300 pl-6 leading-relaxed">
          {{ activeRecommendation }}
        </p>
      </div>

      <!-- 6. Scientific Limitation & Sync Timestamp Disclaimer -->
      <div class="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-600 dark:text-slate-400">
        <div class="flex items-start gap-1.5 max-w-xl">
          <UIcon name="i-ph-info-duotone" class="size-3.5 shrink-0 mt-0.5 text-slate-600" />
          <p class="leading-normal">
            {{ $t('appStudio.dashboard.weather.scientificLimitation') }}
          </p>
        </div>
        <div v-if="lastUpdated" class="shrink-0 text-right">
          {{ $t('appStudio.dashboard.weather.sync') }}: {{ formatTime(lastUpdated) }}
        </div>
      </div>
    </div>
  </section>
</template>
