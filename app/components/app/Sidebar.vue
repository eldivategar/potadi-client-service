<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const route = useRoute();
const router = useRouter();
const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();
const { isCollapsed, toggle: toggleSidebar } = useSidebar();
const { user, signOut } = useAuth();

const isProfileMenuOpen = ref(false);
const isLangMenuOpen = ref(false);
const showSettingsModal = ref(false);
const showLogoutToast = ref(false);
const imageLoadError = ref(false);
const profileCardRef = ref<HTMLElement | null>(null);
const langDropdownRef = ref<HTMLElement | null>(null);

watch(
  () => user.value?.image,
  () => {
    imageLoadError.value = false;
  }
);

const availableLocales = [
  { code: "id", name: "Bahasa Indonesia", short: "ID", flag: "🇮🇩" },
  { code: "en", name: "English", short: "EN", flag: "🇬🇧" },
];

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const selectLanguage = (code: "id" | "en") => {
  setLocale(code);
  isLangMenuOpen.value = false;
};

const currentPath = computed(() => route.path);

const navItems = computed(() => [
  {
    path: "/app",
    label: t("appStudio.nav.dashboard"),
    sublabel: t("appStudio.nav.dashboardSub"),
    icon: "i-ph-house-duotone",
    activeIcon: "i-ph-house-fill",
    exact: true,
  },
  {
    path: "/app/diagnosis",
    label: t("appStudio.nav.diagnosis"),
    sublabel: t("appStudio.nav.diagnosisSub"),
    icon: "i-ph-scan-duotone",
    activeIcon: "i-ph-scan-fill",
    exact: false,
  },
  {
    path: "/app/history",
    label: t("appStudio.nav.history"),
    sublabel: t("appStudio.nav.historySub"),
    icon: "i-ph-clock-duotone",
    activeIcon: "i-ph-clock-fill",
    exact: false,
  },
]);

const isActive = (item: { path: string; exact: boolean }) => {
  if (item.exact) {
    return currentPath.value === item.path || currentPath.value === `${item.path}/`;
  }
  return currentPath.value.startsWith(item.path);
};

const activeIndex = computed(() => {
  if (currentPath.value.startsWith("/app/diagnosis")) return 1;
  if (currentPath.value.startsWith("/app/history")) return 2;
  if (currentPath.value === "/app" || currentPath.value === "/app/") return 0;
  return -1;
});

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
  if (isProfileMenuOpen.value) isLangMenuOpen.value = false;
};

const toggleLangMenu = () => {
  isLangMenuOpen.value = !isLangMenuOpen.value;
  if (isLangMenuOpen.value) isProfileMenuOpen.value = false;
};

const openSettings = () => {
  isProfileMenuOpen.value = false;
  showSettingsModal.value = true;
};

const handleLogout = () => {
  isProfileMenuOpen.value = false;
  showLogoutToast.value = true;
  setTimeout(() => {
    showLogoutToast.value = false;
    signOut();
  }, 1000);
};

const handleClickOutside = (event: MouseEvent) => {
  if (profileCardRef.value && !profileCardRef.value.contains(event.target as Node)) {
    isProfileMenuOpen.value = false;
  }
  if (langDropdownRef.value && !langDropdownRef.value.contains(event.target as Node)) {
    isLangMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <aside
    class="min-h-screen fixed left-0 top-0 bottom-0 bg-[#EEF3F0] dark:bg-[#111413] border-r border-white/70 dark:border-white/5 flex-col justify-between z-40 hidden lg:flex select-none shadow-[6px_0_20px_rgba(164,184,174,0.3)] dark:shadow-[8px_0_24px_rgba(0,0,0,0.7)] transition-[width,padding,background-color,border-color,box-shadow] duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
    :class="isCollapsed ? 'w-[88px] p-3' : 'w-72 p-5'"
    aria-label="Sidebar Navigasi Potadi"
  >
    <!-- Toggle Collapse/Expand Button (Floating on edge) -->
    <button
      type="button"
      class="absolute -right-4 top-[26px] size-8 rounded-full neu-btn flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all cursor-pointer z-50"
      :title="isCollapsed ? $t('appStudio.nav.expandSidebar') : $t('appStudio.nav.collapseSidebar')"
      @click="toggleSidebar"
    >
      <UIcon
        :name="isCollapsed ? 'i-ph-caret-right-bold' : 'i-ph-caret-left-bold'"
        class="size-3.5 transition-transform"
      />
    </button>

    <!-- TOP SECTION: Brand Header -->
    <div class="space-y-6">
      <div class="flex items-center transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]">
        <NuxtLink to="/app" class="flex items-center min-w-0 group transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]" :class="isCollapsed ? 'pl-[10px] gap-0' : 'gap-3'">
          <div
            class="size-11 rounded-2xl neu-convex flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden"
          >
            <img src="/og-logo-emerald.png" alt="Potadi Logo" class="w-full h-full object-contain block dark:hidden" />
            <img src="/og-logo.png" alt="Potadi Logo" class="w-full h-full object-contain hidden dark:block" />
          </div>

          <div
            class="flex flex-col min-w-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden whitespace-nowrap"
            :class="isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Potadi
              </span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold neu-btn-primary shadow-sm leading-tight">
                Studio
              </span>
            </div>
            <span class="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1 leading-none">
              {{ $t("appStudio.nav.telemetryLabel") }}
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- MAIN NAVIGATION MENU CARDS WITH SMOOTH SLIDING WELL -->
      <nav class="relative flex flex-col gap-2" aria-label="Menu Utama">
        <!-- Absolute Sliding Well Indicator -->
        <div
          v-if="activeIndex >= 0"
          class="absolute left-0 right-0 top-0 h-16 rounded-2xl neu-pressed pointer-events-none transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu overflow-hidden"
          :style="{
            transform: `translateY(${activeIndex * 72}px)`
          }"
        >
          <!-- Accent left sliding emerald bar -->
          <span
            class="absolute left-0 top-[20%] bottom-[20%] w-[3.5px] bg-emerald-500 rounded-r-full shadow-[0_0_12px_rgba(16,185,129,0.9)]"
          />
        </div>

        <NuxtLink
          v-for="(item, index) in navItems"
          :key="item.path"
          :to="item.path"
          class="relative z-10 flex items-center rounded-2xl cursor-pointer group transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          :class="[
            'h-16 p-3',
            isCollapsed ? 'gap-0' : 'gap-3.5',
            isActive(item) ? '' : 'hover:neu-flat-sm'
          ]"
          :title="isCollapsed ? item.label : undefined"
        >
          <!-- Squircle Icon Badge -->
          <div
            class="relative z-10 size-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
            :class="
              isActive(item)
                ? 'neu-convex text-emerald-600 dark:text-emerald-400 scale-[1.05]'
                : 'neu-inset-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:scale-[1.03]'
            "
          >
            <UIcon
              :name="isActive(item) ? item.activeIcon : item.icon"
              class="size-5 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
              :class="[
                isActive(item) ? 'scale-110 text-emerald-600 dark:text-emerald-400' : 'group-hover:scale-110'
              ]"
            />
          </div>

          <!-- Label + Sublabel -->
          <div
            class="relative z-10 min-w-0 flex-1 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden whitespace-nowrap"
            :class="isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'"
          >
            <div
              class="text-xs font-bold truncate leading-tight transition-colors duration-200"
              :class="isActive(item) ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'"
            >
              {{ item.label }}
            </div>
            <div class="text-[10px] text-slate-600 dark:text-slate-400 truncate mt-0.5 leading-tight font-medium">
              {{ item.sublabel }}
            </div>
          </div>

          <!-- Right Chevron -->
        </NuxtLink>
      </nav>
    </div>

    <!-- BOTTOM SECTION: Tactile Switch, Dropdown Language, Profile -->
    <div class="relative space-y-2.5 pt-4 border-t border-black/5 dark:border-white/5">

      <!-- 1. THEME MODE NEUMORPHIC TOGGLE SWITCH -->
      <button
        type="button"
        class="w-full flex items-center justify-between rounded-2xl neu-btn cursor-pointer group text-left transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
        :class="isCollapsed ? 'p-[14px] gap-0' : 'p-2.5 gap-2.5'"
        :title="$t('appStudio.nav.mode')"
        @click="toggleTheme"
      >
        <ClientOnly>
          <div class="flex items-center min-w-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]" :class="isCollapsed ? 'gap-0' : 'gap-2.5'">
            <div
              class="size-9 rounded-xl neu-inset-sm text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center justify-center shrink-0 transition-colors relative overflow-hidden"
            >
              <div class="relative size-4.5 flex items-center justify-center">
                <UIcon
                  name="i-ph-sun-dim-duotone"
                  class="size-4.5 absolute inset-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  :class="colorMode.value === 'dark' ? 'opacity-0 rotate-90 scale-50 pointer-events-none' : 'opacity-100 rotate-0 scale-100'"
                />
                <UIcon
                  name="i-ph-moon-stars-duotone"
                  class="size-4.5 absolute inset-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  :class="colorMode.value === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50 pointer-events-none'"
                />
              </div>
            </div>

            <div
              class="min-w-0 flex-1 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden whitespace-nowrap"
              :class="isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'"
            >
              <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {{ $t("appStudio.nav.mode") }}
              </div>
              <div class="text-[10px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5 font-medium transition-colors duration-750">
                {{ colorMode.value === "dark" ? $t("appStudio.nav.modeDark") : $t("appStudio.nav.modeLight") }}
              </div>
            </div>
          </div>

          <!-- Tactile Switch Slider -->
          <div
            class="neu-switch-track h-7 rounded-full p-0.5 flex items-center shrink-0 relative transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden"
            :class="isCollapsed ? 'w-0 opacity-0 scale-0' : 'w-13 opacity-100 scale-100'"
          >
            <div
              class="neu-switch-thumb size-6 rounded-full flex items-center justify-center text-xs transition-transform duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
              :class="colorMode.value === 'dark' ? 'translate-x-6' : 'translate-x-0'"
            >
              <div class="relative size-3.5 flex items-center justify-center">
                <UIcon
                  name="i-ph-sun-fill"
                  class="size-3.5 absolute inset-0 text-amber-500 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  :class="colorMode.value === 'dark' ? 'opacity-0 rotate-180 scale-50 pointer-events-none' : 'opacity-100 rotate-0 scale-100'"
                />
                <UIcon
                  name="i-ph-moon-stars-fill"
                  class="size-3.5 absolute inset-0 text-emerald-400 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  :class="colorMode.value === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-50 pointer-events-none'"
                />
              </div>
            </div>
          </div>

          <template #fallback>
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="size-9 rounded-xl neu-inset-sm flex items-center justify-center shrink-0">
                <span class="size-4.5 inline-block" />
              </div>
              <div
                class="min-w-0 flex-1"
                :class="isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
              >
                <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {{ $t("appStudio.nav.mode") }}
                </div>
                <div class="text-[10px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5 font-medium">
                  &nbsp;
                </div>
              </div>
            </div>
            <div
              class="neu-switch-track w-13 h-7 rounded-full p-0.5 flex items-center shrink-0 relative"
              :class="isCollapsed ? 'hidden' : 'flex'"
            >
              <div class="neu-switch-thumb size-6 rounded-full flex items-center justify-center text-xs">
                <span class="size-3.5 inline-block" />
              </div>
            </div>
          </template>
        </ClientOnly>
      </button>

      <!-- 2. LANGUAGE NEUMORPHIC DROPDOWN SELECTOR -->
      <div class="relative" ref="langDropdownRef">
        <button
          type="button"
          class="w-full flex items-center rounded-2xl neu-btn cursor-pointer group text-left transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
          :class="[
            isCollapsed ? 'p-[14px] gap-0' : 'p-2.5 gap-2.5',
            isLangMenuOpen ? 'ring-2 ring-emerald-500/40' : ''
          ]"
          :title="$t('appStudio.nav.language')"
          @click="toggleLangMenu"
        >
          <div
            class="size-9 rounded-xl neu-inset-sm flex items-center justify-center shrink-0 text-base transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
          >
            <span>{{ locale === 'id' ? '🇮🇩' : '🇬🇧' }}</span>
          </div>

          <div
            class="min-w-0 flex-1 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden whitespace-nowrap"
            :class="isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'"
          >
            <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {{ $t("appStudio.nav.language") }}
            </div>
            <div class="text-[10px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5 font-medium">
              {{ locale === 'id' ? 'Bahasa Indonesia' : 'English' }}
            </div>
          </div>

          <UIcon
            name="i-ph-caret-down-bold"
            class="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
            :class="[
              isCollapsed ? 'opacity-0 w-0 h-0 scale-0' : 'opacity-100 w-3.5 h-3.5 scale-100',
              isLangMenuOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
            ]"
          />
        </button>

        <!-- Floating Language Selection Menu -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          :enter-from-class="isCollapsed ? 'transform scale-95 opacity-0 -translate-x-2' : 'transform scale-95 opacity-0 translate-y-2'"
          enter-to-class="transform scale-100 opacity-100 translate-x-0 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-x-0 translate-y-0"
          :leave-to-class="isCollapsed ? 'transform scale-95 opacity-0 -translate-x-2' : 'transform scale-95 opacity-0 translate-y-2'"
        >
          <div
            v-if="isLangMenuOpen"
            class="absolute z-50 rounded-2xl neu-flat shadow-2xl p-1.5 space-y-1 select-none border border-black/5 dark:border-white/10"
            :class="
              isCollapsed
                ? 'left-[calc(100%+14px)] -bottom-2 w-56'
                : 'bottom-14 left-0 right-0'
            "
          >
            <div class="px-3 py-1.5 border-b border-black/5 dark:border-white/5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Pilih Bahasa / Language
            </div>

            <button
              v-for="loc in availableLocales"
              :key="loc.code"
              type="button"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer text-left"
              :class="
                locale === loc.code
                  ? 'neu-pressed text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:neu-inset-sm'
              "
              @click="selectLanguage(loc.code as 'id' | 'en')"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ loc.flag }}</span>
                <span>{{ loc.name }}</span>
              </div>
              <UIcon
                v-if="locale === loc.code"
                name="i-ph-check-bold"
                class="size-3.5 text-emerald-600 dark:text-emerald-400"
              />
            </button>
          </div>
        </Transition>
      </div>

      <!-- 3. User Profile Card (Interactive Dropdown Trigger) -->
      <div class="relative" ref="profileCardRef">
        <button
          type="button"
          class="w-full flex items-center rounded-2xl neu-btn border border-emerald-500/30 dark:border-emerald-500/20 cursor-pointer group text-left transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
          :class="[
            isCollapsed ? 'p-[14px] gap-0' : 'p-2.5 gap-2.5',
            isProfileMenuOpen ? 'ring-2 ring-emerald-500/40' : ''
          ]"
          :title="$t('appStudio.userProfile.profileMenu')"
          @click="toggleProfileMenu"
        >
          <!-- User Avatar -->
          <div
            class="relative size-9 rounded-full neu-convex text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden"
          >
            <img
              v-if="user?.image && !imageLoadError"
              :src="user.image"
              :alt="user.name || 'User'"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover rounded-full"
              @error="imageLoadError = true"
            />
            <div
              v-else-if="user?.name"
              class="size-full flex items-center justify-center font-bold text-xs text-emerald-700 dark:text-emerald-300"
            >
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <UIcon
              v-else
              name="i-ph-user-fill"
              class="size-5 text-emerald-700 dark:text-emerald-300"
            />
          </div>

          <!-- User Details -->
          <div
            class="min-w-0 flex-1 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden whitespace-nowrap"
            :class="isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'"
          >
            <div class="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
              {{ user?.name || $t("appStudio.userProfile.name") }}
            </div>
            <div class="text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate leading-tight mt-0.5">
              {{ user?.email || "" }}
            </div>
          </div>

          <!-- Three dots icon -->
          <UIcon
            name="i-ph-dots-three-vertical-bold"
            class="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0 transition-all duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
            :class="isCollapsed ? 'opacity-0 w-0 h-0 scale-0' : 'opacity-100 w-4 h-4 scale-100'"
          />
        </button>

        <!-- Floating Profile Menu -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          :enter-from-class="isCollapsed ? 'transform scale-95 opacity-0 -translate-x-2' : 'transform scale-95 opacity-0 translate-y-2'"
          enter-to-class="transform scale-100 opacity-100 translate-x-0 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-x-0 translate-y-0"
          :leave-to-class="isCollapsed ? 'transform scale-95 opacity-0 -translate-x-2' : 'transform scale-95 opacity-0 translate-y-2'"
        >
          <div
            v-if="isProfileMenuOpen"
            class="absolute z-50 rounded-2xl neu-flat shadow-2xl p-1.5 space-y-1 select-none border border-black/5 dark:border-white/10"
            :class="
              isCollapsed
                ? 'left-[calc(100%+14px)] bottom-0 w-60'
                : 'bottom-14 left-0 right-0'
            "
          >
            <div class="px-3 py-2 border-b border-black/5 dark:border-white/5">
              <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
                {{ user?.name || $t("appStudio.userProfile.name") }}
              </div>
              <div class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span class="size-1.5 rounded-full bg-emerald-500" />
                <span class="truncate">{{ user?.email || 'Dieng Highland Hub' }}</span>
              </div>
            </div>

            <NuxtLink
              to="/app/profile"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:neu-inset-sm transition-all cursor-pointer text-left"
              @click="isProfileMenuOpen = false"
            >
              <UIcon name="i-ph-gear-six-duotone" class="size-4 text-slate-500" />
              <span>{{ $t("appStudio.userProfile.settings") }}</span>
            </NuxtLink>

            <NuxtLink
              to="/"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:neu-inset-sm transition-all"
              @click="isProfileMenuOpen = false"
            >
              <UIcon name="i-ph-house-line-duotone" class="size-4 text-slate-500" />
              <span>{{ $t("appStudio.userProfile.backToLanding") }}</span>
            </NuxtLink>

            <div class="h-px bg-black/5 dark:bg-white/5 my-1" />

            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left font-bold"
              @click="handleLogout"
            >
              <UIcon name="i-ph-sign-out-bold" class="size-4 text-rose-500" />
              <span>{{ $t("appStudio.userProfile.logout") }}</span>
            </button>
          </div>
        </Transition>
      </div>

    <!-- SETTINGS MODAL DIALOG -->
    <div
      v-if="showSettingsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" @click="showSettingsModal = false" />
      <div class="relative w-full max-w-md rounded-3xl neu-flat p-6 space-y-4 z-10 text-slate-900 dark:text-slate-100 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-ph-gear-six-duotone" class="size-5 text-emerald-600 dark:text-emerald-400" />
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">
              {{ $t("appStudio.userProfile.settings") }}
            </h3>
          </div>
          <button
            type="button"
            class="size-7 rounded-lg neu-btn flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            @click="showSettingsModal = false"
          >
            <UIcon name="i-ph-x-bold" class="size-3.5" />
          </button>
        </div>

        <div class="space-y-3 font-mono text-xs">
          <div class="p-3.5 rounded-2xl neu-inset space-y-1">
            <div class="text-[10px] text-slate-600 dark:text-slate-400">OPERATOR ID</div>
            <div class="font-bold text-slate-900 dark:text-white">AGR-2026-DIENG-04</div>
          </div>

          <div class="p-3.5 rounded-2xl neu-inset space-y-1">
            <div class="text-[10px] text-slate-600 dark:text-slate-400">ML INFERENCE ACCELERATOR</div>
            <div class="font-bold text-emerald-600 dark:text-emerald-400">WASM SIMD + WebGPU Core</div>
          </div>

          <div class="p-3.5 rounded-2xl neu-inset space-y-1">
            <div class="text-[10px] text-slate-600 dark:text-slate-400">STORAGE CACHE STATUS</div>
            <div class="font-bold text-slate-900 dark:text-white">Offline Synced (Local)</div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            class="h-10 px-5 rounded-xl text-xs font-mono font-bold neu-btn-primary cursor-pointer transition-all"
            @click="showSettingsModal = false"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION FOR LOGOUT -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="showLogoutToast"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full neu-flat text-slate-900 dark:text-white font-mono text-xs font-bold shadow-xl flex items-center gap-2"
      >
        <UIcon name="i-ph-check-circle-fill" class="size-4 text-emerald-500" />
        <span>{{ $t("appStudio.userProfile.logoutToast") }}</span>
      </div>
    </Transition>
    </div>
  </aside>
</template>
