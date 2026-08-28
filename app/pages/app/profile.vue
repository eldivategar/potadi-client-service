<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useDiagnosisHistory } from "~/composables/useDiagnosisHistory";

definePageMeta({
  layout: "app",
});

const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();
const { user } = useAuth();
const { clearHistory } = useDiagnosisHistory();

useHead({
  title: "Pengaturan Profil & Lahan - Potadi",
  meta: [
    {
      name: "description",
      content: "Kelola profil agronomis, data lahan perkebunan, dan preferensi telemetri Potadi.",
    },
  ],
});

// Active Sub-Navigation Tab
type TabType = "profile" | "farm" | "security" | "preferences" | "danger";
const activeTab = ref<TabType>("profile");

// Form Data (Bound to User & Local Defaults)
const nameParts = computed(() => {
  const fullName = user.value?.name || "Petani Potadi";
  const parts = fullName.trim().split(" ");
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
});

const form = ref({
  firstName: nameParts.value.firstName,
  lastName: nameParts.value.lastName,
  email: user.value?.email || "petani@potadi.id",
  phone: "+62 812-3456-7890",
  role: "farmer",
  bio: "Petani kentang dataran tinggi spesialis varietas Granola Lembang dan bibit bersertifikasi G0/G2.",
  // Farm Settings
  farmName: "Kebun Kentang Dieng Makmur",
  region: "Dieng Plateau, Jawa Tengah",
  elevation: "1850",
  area: "2.5",
  variety: "granola",
  soilType: "andosol",
  // Security Form
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  // Preferences / Alerts
  sporeAlert: true,
  weatherAlert: true,
  weeklyDigest: false,
});

// Keep form in sync if user changes
watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      const parts = (newUser.name || "").trim().split(" ");
      form.value.firstName = parts[0] || "";
      form.value.lastName = parts.slice(1).join(" ") || "";
      form.value.email = newUser.email || "";
    }
  },
  { immediate: true }
);

// State Feedback
const isSaving = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const imageLoadError = ref(false);
const showDeleteModal = ref(false);

const handleSave = async () => {
  isSaving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  isSaving.value = false;
  toastMessage.value = t("profileSettings.saveSuccess");
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3500);
};

const handleClearCache = async () => {
  try {
    clearHistory();
    toastMessage.value = t("profileSettings.dangerTab.clearCacheSuccess");
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3500);
  } catch (err) {
    console.error("Failed to clear local cache", err);
  }
};

const handleUpdatePassword = () => {
  toastMessage.value = t("profileSettings.securityTab.passwordSuccess");
  showToast.value = true;
  form.value.currentPassword = "";
  form.value.newPassword = "";
  form.value.confirmPassword = "";
  setTimeout(() => {
    showToast.value = false;
  }, 3500);
};

const tabs = computed(() => [
  {
    id: "profile" as TabType,
    label: t("profileSettings.tabs.profile"),
    icon: "i-ph-user-duotone",
  },
  {
    id: "farm" as TabType,
    label: t("profileSettings.tabs.farm"),
    icon: "i-ph-plant-duotone",
  },
  {
    id: "security" as TabType,
    label: t("profileSettings.tabs.security"),
    icon: "i-ph-shield-check-duotone",
  },
  {
    id: "preferences" as TabType,
    label: t("profileSettings.tabs.preferences"),
    icon: "i-ph-bell-ringing-duotone",
  },
  {
    id: "danger" as TabType,
    label: t("profileSettings.tabs.danger"),
    icon: "i-ph-warning-octagon-duotone",
    danger: true,
  },
]);

const activeTabIndex = computed(() => {
  const idx = tabs.value.findIndex((t) => t.id === activeTab.value);
  return idx >= 0 ? idx : 0;
});
</script>

<template>
  <main class="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-28 lg:pb-12">
    <!-- TOP HEADER & BREADCRUMB -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-5">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>{{ $t("profileSettings.breadcrumb") }}</span>
          <span class="text-slate-400">/</span>
          <span class="text-slate-500 dark:text-slate-400 capitalize">
            {{ tabs.find(t => t.id === activeTab)?.label }}
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ $t("profileSettings.title") }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {{ $t("profileSettings.subtitle") }}
        </p>
      </div>

      <!-- Header Action: Save Changes Button -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          type="button"
          :disabled="isSaving"
          class="h-10 px-5 rounded-xl neu-btn-primary flex items-center gap-2 text-xs font-semibold shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          @click="handleSave"
        >
          <UIcon
            :name="isSaving ? 'i-ph-spinner-gap-bold' : 'i-ph-floppy-disk-back-duotone'"
            class="size-4"
            :class="isSaving ? 'animate-spin' : ''"
          />
          <span>{{ isSaving ? $t("profileSettings.saving") : $t("profileSettings.saveChanges") }}</span>
        </button>
      </div>
    </div>

    <!-- MAIN TWO-COLUMN LAYOUT -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <!-- LEFT SIDE NAVIGATION PANEL (Sticky Pinned on Scroll) -->
      <aside class="lg:col-span-4 xl:col-span-3 sticky top-4 sm:top-6 z-30">
        <div class="rounded-3xl neu-flat p-3.5 sm:p-4 space-y-2 select-none shadow-sm">
          <div class="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Navigation Menu
          </div>

          <!-- Desktop Navigation with Smooth Vertical Sliding Well -->
          <nav class="hidden lg:flex relative flex-col gap-1.5" aria-label="Menu Navigasi Profil">
            <!-- Absolute Vertical Sliding Well Indicator -->
            <div
              class="absolute left-0 right-0 top-0 h-11 rounded-2xl pointer-events-none transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu overflow-hidden"
              :class="
                activeTab === 'danger'
                  ? 'neu-rose-inset border border-rose-500/30'
                  : 'neu-pressed'
              "
              :style="{
                transform: `translateY(${activeTabIndex * 50}px)`
              }"
            >
              <!-- Left Accent Pill -->
              <span
                class="absolute left-0 top-[20%] bottom-[20%] w-[3.5px] rounded-r-full shadow-sm"
                :class="
                  activeTab === 'danger'
                    ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                    : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                "
              />
            </div>

            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="relative z-10 w-full h-11 flex items-center gap-2.5 px-3.5 rounded-2xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer text-left"
              :class="[
                activeTab === tab.id
                  ? tab.danger
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-700 dark:text-emerald-400'
                  : tab.danger
                    ? 'text-rose-500/80 hover:text-rose-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
              @click="activeTab = tab.id"
            >
              <UIcon
                :name="tab.icon"
                class="size-4.5 transition-colors duration-250 shrink-0"
                :class="
                  activeTab === tab.id
                    ? tab.danger
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                "
              />
              <span class="whitespace-nowrap">{{ tab.label }}</span>
            </button>
          </nav>

          <!-- Mobile Navigation with Horizontal Smooth Sliding Pill -->
          <div class="lg:hidden overflow-x-auto pb-1 max-w-full">
            <div class="relative grid grid-cols-5 p-1 rounded-2xl neu-inset min-w-[560px] w-fit">
              <!-- Sliding Active Background Pill Indicator -->
              <div
                class="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/5)] rounded-xl pointer-events-none transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu"
                :style="{
                  transform: `translateX(${activeTabIndex * 100}%)`
                }"
                :class="
                  activeTab === 'danger'
                    ? 'neu-rose-inset border border-rose-500/30'
                    : 'neu-convex shadow-sm'
                "
              />

              <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="relative z-10 py-2 px-2 text-center rounded-xl text-xs font-mono font-bold transition-colors duration-250 cursor-pointer flex items-center justify-center gap-1.5"
                :class="[
                  activeTab === tab.id
                    ? tab.danger
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                    : tab.danger
                      ? 'text-rose-500/80 hover:text-rose-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
                @click="activeTab = tab.id"
              >
                <UIcon :name="tab.icon" class="size-3.5 shrink-0" />
                <span class="whitespace-nowrap">{{ tab.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- RIGHT CONTENT AREA -->
      <section class="lg:col-span-8 xl:col-span-9 space-y-6">
        <!-- TAB 1: PROFIL & BIODATA -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <!-- Card 1: Avatar Header Summary -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div class="flex items-center gap-4">
                <!-- Avatar with Google / Initial fallback -->
                <div class="relative size-16 sm:size-18 rounded-full neu-convex p-1 shrink-0 overflow-hidden">
                  <img
                    v-if="user?.image && !imageLoadError"
                    :src="user.image"
                    :alt="user?.name || 'User'"
                    referrerpolicy="no-referrer"
                    class="w-full h-full object-cover rounded-full"
                    @error="imageLoadError = true"
                  />
                  <div
                    v-else-if="user?.name"
                    class="size-full flex items-center justify-center font-bold text-xl text-emerald-700 dark:text-emerald-300"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <UIcon
                    v-else
                    name="i-ph-user-fill"
                    class="size-8 text-emerald-700 dark:text-emerald-300 m-auto"
                  />
                </div>

                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                      {{ user?.name || form.firstName + ' ' + form.lastName }}
                    </h3>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <UIcon name="i-ph-seal-check-fill" class="size-3 text-emerald-500" />
                      <span>{{ $t("profileSettings.profileTab.verified") }}</span>
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {{ user?.email || form.email }}
                  </p>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>📍</span>
                    <span>{{ form.region }}</span>
                  </p>
                </div>
              </div>

              <!-- Change Photo Action -->
              <div class="self-end sm:self-center">
                <button
                  type="button"
                  class="px-3.5 py-1.5 rounded-xl neu-btn text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  @click="handleSave"
                >
                  <UIcon name="i-ph-camera-duotone" class="size-4" />
                  <span>{{ $t("profileSettings.profileTab.changePhoto") }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Card 2: Personal Details & Contact -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div class="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-ph-identification-card-duotone" class="size-4.5 text-emerald-500" />
                <span>{{ $t("profileSettings.profileTab.personalTitle") }}</span>
              </h4>
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer transition-colors"
                @click="handleSave"
              >
                <UIcon name="i-ph-pencil-simple-line-duotone" class="size-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- First Name -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.profileTab.firstName") }}
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <!-- Last Name -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.profileTab.lastName") }}
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.profileTab.email") }}
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  disabled
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-100/60 dark:bg-white/5 text-xs text-slate-500 cursor-not-allowed opacity-80"
                />
                <span class="text-[10px] text-slate-400">{{ $t("profileSettings.profileTab.emailHint") }}</span>
              </div>

              <!-- Phone / WhatsApp -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.profileTab.phone") }}
                </label>
                <input
                  v-model="form.phone"
                  type="text"
                  :placeholder="$t('profileSettings.profileTab.phonePlaceholder')"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
                <span class="text-[10px] text-slate-400">{{ $t("profileSettings.profileTab.phoneHint") }}</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Professional & Agronomy Information -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div class="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-ph-briefcase-duotone" class="size-4.5 text-emerald-500" />
                <span>{{ $t("profileSettings.profileTab.role") }}</span>
              </h4>
            </div>

            <div class="space-y-4">
              <!-- Role Selection -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.profileTab.role") }}
                </label>
                <select
                  v-model="form.role"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                >
                  <option value="farmer">{{ $t("profileSettings.profileTab.roleOptions.farmer") }}</option>
                  <option value="agronomist">{{ $t("profileSettings.profileTab.roleOptions.agronomist") }}</option>
                  <option value="researcher">{{ $t("profileSettings.profileTab.roleOptions.researcher") }}</option>
                  <option value="consultant">{{ $t("profileSettings.profileTab.roleOptions.consultant") }}</option>
                </select>
              </div>

              <!-- Bio / Notes -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.profileTab.bio") }}
                </label>
                <textarea
                  v-model="form.bio"
                  rows="3"
                  :placeholder="$t('profileSettings.profileTab.bioPlaceholder')"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: DATA LAHAN & KOMODITAS -->
        <div v-else-if="activeTab === 'farm'" class="space-y-6">
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div class="border-b border-black/5 dark:border-white/5 pb-3">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-ph-mountains-duotone" class="size-4.5 text-emerald-500" />
                <span>{{ $t("profileSettings.farmTab.title") }}</span>
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {{ $t("profileSettings.farmTab.subtitle") }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Farm Name -->
              <div class="sm:col-span-2 space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.farmTab.farmName") }}
                </label>
                <input
                  v-model="form.farmName"
                  type="text"
                  :placeholder="$t('profileSettings.farmTab.farmNamePlaceholder')"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <!-- Region -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.farmTab.region") }}
                </label>
                <input
                  v-model="form.region"
                  type="text"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <!-- Elevation -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.farmTab.elevation") }}
                </label>
                <div class="relative">
                  <input
                    v-model="form.elevation"
                    type="number"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                  <span class="absolute right-3 top-2.5 text-[10px] font-semibold text-slate-400">mdpl</span>
                </div>
                <span class="text-[10px] text-slate-400">{{ $t("profileSettings.farmTab.elevationHint") }}</span>
              </div>

              <!-- Cultivated Area -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.farmTab.area") }}
                </label>
                <div class="relative">
                  <input
                    v-model="form.area"
                    type="number"
                    step="0.1"
                    :placeholder="$t('profileSettings.farmTab.areaPlaceholder')"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                  <span class="absolute right-3 top-2.5 text-[10px] font-semibold text-slate-400">Ha</span>
                </div>
              </div>

              <!-- Soil Type -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.farmTab.soilType") }}
                </label>
                <select
                  v-model="form.soilType"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                >
                  <option value="andosol">{{ $t("profileSettings.farmTab.soilTypes.andosol") }}</option>
                  <option value="latosol">{{ $t("profileSettings.farmTab.soilTypes.latosol") }}</option>
                  <option value="regosol">{{ $t("profileSettings.farmTab.soilTypes.regosol") }}</option>
                </select>
              </div>

              <!-- Primary Potato Variety -->
              <div class="sm:col-span-2 space-y-1.5">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.farmTab.variety") }}
                </label>
                <select
                  v-model="form.variety"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                >
                  <option value="granola">{{ $t("profileSettings.farmTab.varieties.granola") }}</option>
                  <option value="atlantic">{{ $t("profileSettings.farmTab.varieties.atlantic") }}</option>
                  <option value="medians">{{ $t("profileSettings.farmTab.varieties.medians") }}</option>
                  <option value="spunta">{{ $t("profileSettings.farmTab.varieties.spunta") }}</option>
                  <option value="other">{{ $t("profileSettings.farmTab.varieties.other") }}</option>
                </select>
                <span class="text-[10px] text-slate-400">{{ $t("profileSettings.farmTab.varietyHint") }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: KEAMANAN & AKUN -->
        <div v-else-if="activeTab === 'security'" class="space-y-6">
          <!-- Linked Google SSO Card -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-ph-link-duotone" class="size-4.5 text-emerald-500" />
              <span>{{ $t("profileSettings.securityTab.linkedAccounts") }}</span>
            </h4>

            <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 flex items-center justify-center p-1.5 shadow-xs">
                  <svg class="size-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-slate-900 dark:text-white">
                    {{ $t("profileSettings.securityTab.googleAccount") }}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">
                    {{ $t("profileSettings.securityTab.googleDesc") }}
                  </div>
                </div>
              </div>

              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span class="size-1.5 rounded-full bg-emerald-500" />
                <span>{{ $t("profileSettings.securityTab.connected") }}</span>
              </span>
            </div>
          </div>

          <!-- Password Change Form -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-ph-key-duotone" class="size-4.5 text-emerald-500" />
              <span>{{ $t("profileSettings.securityTab.changePassword") }}</span>
            </h4>

            <div class="space-y-3 max-w-md">
              <div class="space-y-1">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ $t("profileSettings.securityTab.currentPassword") }}</label>
                <input
                  v-model="form.currentPassword"
                  type="password"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ $t("profileSettings.securityTab.newPassword") }}</label>
                <input
                  v-model="form.newPassword"
                  type="password"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ $t("profileSettings.securityTab.confirmPassword") }}</label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div class="pt-2">
                <button
                  type="button"
                  class="px-4 py-2 rounded-xl neu-btn text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer active:scale-95 transition-all"
                  @click="handleUpdatePassword"
                >
                  {{ $t("profileSettings.securityTab.updatePasswordBtn") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: PREFERENSI & NOTIFIKASI -->
        <div v-else-if="activeTab === 'preferences'" class="space-y-6">
          <!-- Theme & Language Switchers -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-ph-sliders-duotone" class="size-4.5 text-emerald-500" />
              <span>{{ $t("profileSettings.preferencesTab.title") }}</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Language Switcher -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.preferencesTab.interfaceLang") }}
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all border"
                    :class="locale === 'id' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100'"
                    @click="setLocale('id')"
                  >
                    <span>🇮🇩</span>
                    <span>Indonesia</span>
                  </button>
                  <button
                    type="button"
                    class="px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all border"
                    :class="locale === 'en' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100'"
                    @click="setLocale('en')"
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              </div>

              <!-- Theme Toggle -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ $t("profileSettings.preferencesTab.themeMode") }}
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all border"
                    :class="colorMode.value === 'light' ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 font-semibold' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100'"
                    @click="colorMode.preference = 'light'"
                  >
                    <UIcon name="i-ph-sun-duotone" class="size-4 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    class="px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all border"
                    :class="colorMode.value === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/10'"
                    @click="colorMode.preference = 'dark'"
                  >
                    <UIcon name="i-ph-moon-stars-duotone" class="size-4 text-emerald-400" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Alert Notification Switches -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-ph-bell-ringing-duotone" class="size-4.5 text-emerald-500" />
              <span>{{ $t("profileSettings.preferencesTab.alertsTitle") }}</span>
            </h4>

            <div class="space-y-3">
              <!-- Spore Alert -->
              <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-900 dark:text-white">
                    {{ $t("profileSettings.preferencesTab.sporeAlert") }}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">
                    {{ $t("profileSettings.preferencesTab.sporeAlertDesc") }}
                  </div>
                </div>
                <button
                  type="button"
                  class="neu-switch-track w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer shrink-0 transition-colors"
                  :class="form.sporeAlert ? 'bg-emerald-500/20' : ''"
                  @click="form.sporeAlert = !form.sporeAlert"
                >
                  <div
                    class="neu-switch-thumb size-5 rounded-full transition-transform"
                    :class="form.sporeAlert ? 'translate-x-5 bg-emerald-500' : 'translate-x-0'"
                  />
                </button>
              </div>

              <!-- Extreme Weather Alert -->
              <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-900 dark:text-white">
                    {{ $t("profileSettings.preferencesTab.weatherAlert") }}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">
                    {{ $t("profileSettings.preferencesTab.weatherAlertDesc") }}
                  </div>
                </div>
                <button
                  type="button"
                  class="neu-switch-track w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer shrink-0 transition-colors"
                  :class="form.weatherAlert ? 'bg-emerald-500/20' : ''"
                  @click="form.weatherAlert = !form.weatherAlert"
                >
                  <div
                    class="neu-switch-thumb size-5 rounded-full transition-transform"
                    :class="form.weatherAlert ? 'translate-x-5 bg-emerald-500' : 'translate-x-0'"
                  />
                </button>
              </div>

              <!-- Weekly Digest -->
              <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-900 dark:text-white">
                    {{ $t("profileSettings.preferencesTab.weeklyDigest") }}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">
                    {{ $t("profileSettings.preferencesTab.weeklyDigestDesc") }}
                  </div>
                </div>
                <button
                  type="button"
                  class="neu-switch-track w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer shrink-0 transition-colors"
                  :class="form.weeklyDigest ? 'bg-emerald-500/20' : ''"
                  @click="form.weeklyDigest = !form.weeklyDigest"
                >
                  <div
                    class="neu-switch-thumb size-5 rounded-full transition-transform"
                    :class="form.weeklyDigest ? 'translate-x-5 bg-emerald-500' : 'translate-x-0'"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5: ZONA BAHAYA -->
        <div v-else-if="activeTab === 'danger'" class="space-y-6">
          <!-- Clear Cache -->
          <div class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/6 dark:border-white/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UIcon name="i-ph-trash-simple-duotone" class="size-4.5 text-amber-500" />
                  <span>{{ $t("profileSettings.dangerTab.clearCacheTitle") }}</span>
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ $t("profileSettings.dangerTab.clearCacheDesc") }}
                </p>
              </div>

              <button
                type="button"
                class="px-4 py-2 rounded-xl neu-btn text-xs font-semibold text-amber-600 dark:text-amber-400 cursor-pointer shrink-0 active:scale-95 transition-all"
                @click="handleClearCache"
              >
                {{ $t("profileSettings.dangerTab.clearCacheBtn") }}
              </button>
            </div>
          </div>

          <!-- Delete Account -->
          <div class="bg-rose-500/5 dark:bg-rose-950/20 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <UIcon name="i-ph-warning-octagon-duotone" class="size-4.5 text-rose-500" />
                  <span>{{ $t("profileSettings.dangerTab.deleteAccountTitle") }}</span>
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ $t("profileSettings.dangerTab.deleteAccountDesc") }}
                </p>
              </div>

              <button
                type="button"
                class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/30 cursor-pointer shrink-0 active:scale-95 transition-all"
                @click="showDeleteModal = true"
              >
                {{ $t("profileSettings.dangerTab.deleteAccountBtn") }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- TOAST NOTIFICATION -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95"
    >
      <div
        v-if="showToast"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl neu-flat shadow-2xl border border-emerald-500/30 flex items-center gap-2.5 text-xs font-mono text-slate-800 dark:text-slate-200"
      >
        <UIcon name="i-ph-check-circle-fill" class="size-4.5 text-emerald-500 shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </main>
</template>
