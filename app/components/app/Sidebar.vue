<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useSidebar } from "~/composables/useSidebar";

const route = useRoute();
const router = useRouter();
const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();
const { isCollapsed, toggle: toggleSidebar } = useSidebar();

const isProfileMenuOpen = ref(false);
const showSettingsModal = ref(false);
const showLogoutToast = ref(false);
const profileCardRef = ref<HTMLElement | null>(null);

// Spring config — natural, not bouncy
const springTransition = { type: "spring", stiffness: 380, damping: 38, mass: 0.8 };

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const toggleLanguage = () => {
  setLocale(locale.value === "id" ? "en" : "id");
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

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
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
    router.push("/");
  }, 1200);
};

const handleClickOutside = (event: MouseEvent) => {
  if (profileCardRef.value && !profileCardRef.value.contains(event.target as Node)) {
    isProfileMenuOpen.value = false;
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
    class="min-h-screen fixed left-0 top-0 bottom-0 bg-white/90 dark:bg-[#0c0c0f]/90 backdrop-blur-2xl border-r border-black/8 dark:border-white/10 flex-col justify-between z-40 hidden lg:flex select-none shadow-[0_0_30px_rgba(0,0,0,0.03)] transition-[width,padding] duration-300 ease-in-out"
    :class="isCollapsed ? 'w-22 p-3' : 'w-72 p-5'"
    aria-label="Sidebar Navigasi Potadi"
  >
    <!-- Toggle Collapse/Expand Button (Floating on edge) -->
    <button
      type="button"
      class="absolute -right-4 top-[26px] size-8 rounded-full bg-white dark:bg-[#121216] border border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#1a1a22] flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all cursor-pointer shadow-md z-50"
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
      <div class="flex items-center">
        <NuxtLink to="/app" class="flex items-center gap-3 min-w-0 group">
          <div
            class="size-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
          >
            <UIcon name="i-ph-leaf-fill" class="size-6" />
          </div>

          <div
            class="flex flex-col min-w-0 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Potadi
              </span>
              <span class="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
                Studio
              </span>
            </div>
            <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 leading-none">
              {{ $t("appStudio.nav.telemetryLabel") }}
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- MAIN NAVIGATION MENU CARDS -->
      <nav class="relative space-y-1.5 pt-2" aria-label="Menu Utama">
        <NuxtLink
          v-for="(item, index) in navItems"
          :key="item.path"
          :to="item.path"
          class="relative flex items-center gap-3.5 rounded-2xl cursor-pointer group"
          :class="[
            isCollapsed ? 'p-2.5 justify-center' : 'p-3',
          ]"
          :title="isCollapsed ? item.label : undefined"
        >
          <!-- Magic Pill Background — animates via layoutId using motion-v -->
          <Motion
            v-if="isActive(item)"
            layout-id="sidebar-active-pill"
            :transition="springTransition"
            class="absolute inset-0 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/35 border border-emerald-500/25 shadow-sm motion-reduce:transition-none"
            aria-hidden="true"
          >
            <!-- Accent left pill bar -->
            <span class="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </Motion>

          <!-- Inactive background for non-active items -->
          <div
            v-if="!isActive(item)"
            class="absolute inset-0 rounded-2xl bg-white/60 dark:bg-[#15151a]/60 border border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-hidden="true"
          />

          <!-- Squircle Icon Badge -->
          <div
            class="relative z-10 size-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
            :class="
              isActive(item)
                ? 'bg-white dark:bg-[#18181f] text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/20 scale-[1.04]'
                : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-white dark:group-hover:bg-[#1c1c24] border border-black/5 dark:border-white/5 group-hover:scale-[1.04]'
            "
            style="transition-timing-function: cubic-bezier(0.34,1.56,0.64,1)"
          >
            <UIcon
              :name="isActive(item) ? item.activeIcon : item.icon"
              class="size-5"
              :class="[
                isActive(item) ? 'scale-110' : 'group-hover:scale-110',
                'transition-transform duration-300'
              ]"
              style="transition-timing-function: cubic-bezier(0.34,1.56,0.64,1)"
            />
          </div>

          <!-- Label + Sublabel -->
          <div
            class="relative z-10 min-w-0 flex-1 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
          >
            <div
              class="text-xs font-bold truncate leading-tight transition-colors duration-250"
              :class="isActive(item) ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400'"
            >
              {{ item.label }}
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 leading-tight">
              {{ item.sublabel }}
            </div>
          </div>

          <!-- Right Chevron -->
          <UIcon
            name="i-ph-caret-right-bold"
            class="relative z-10 size-3.5 shrink-0 transition-all duration-300"
            :class="[
              isCollapsed ? 'hidden' : 'block',
              isActive(item)
                ? 'text-emerald-600 dark:text-emerald-400 translate-x-[3px]'
                : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-[2px]'
            ]"
            style="transition-timing-function: cubic-bezier(0.34,1.56,0.64,1)"
          />
        </NuxtLink>
      </nav>
    </div>

    <!-- BOTTOM SECTION: Mode, Language, Profile -->
    <div class="relative space-y-2.5 pt-4 border-t border-black/8 dark:border-white/10" ref="profileCardRef">

      <!-- 1. Mode Card Toggle -->
      <button
        type="button"
        class="w-full flex items-center gap-3 rounded-2xl bg-white/60 dark:bg-[#15151a]/60 hover:bg-white dark:hover:bg-[#1a1a22] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-200 cursor-pointer group text-left shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        :class="isCollapsed ? 'p-2.5 justify-center' : 'p-2.5'"
        :title="$t('appStudio.nav.mode')"
        @click="toggleTheme"
      >
        <div
          class="size-9 rounded-xl bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 transition-colors"
        >
          <ClientOnly>
            <UIcon
              :name="colorMode.value === 'dark' ? 'i-ph-moon-stars-duotone' : 'i-ph-sun-dim-duotone'"
              class="size-4.5"
            />
            <template #fallback>
              <span class="size-4.5 inline-block" />
            </template>
          </ClientOnly>
        </div>

        <div
          class="min-w-0 flex-1 transition-opacity duration-200"
          :class="isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
        >
          <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {{ $t("appStudio.nav.mode") }}
          </div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
            {{ colorMode.value === "dark" ? $t("appStudio.nav.modeDark") : $t("appStudio.nav.modeLight") }}
          </div>
        </div>

        <UIcon
          name="i-ph-caret-right-bold"
          class="size-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0"
          :class="isCollapsed ? 'hidden' : 'block'"
        />
      </button>

      <!-- 2. Language Card Switcher -->
      <button
        type="button"
        class="w-full flex items-center gap-3 rounded-2xl bg-white/60 dark:bg-[#15151a]/60 hover:bg-white dark:hover:bg-[#1a1a22] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-200 cursor-pointer group text-left shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        :class="isCollapsed ? 'p-2.5 justify-center' : 'p-2.5'"
        :title="$t('appStudio.nav.language')"
        @click="toggleLanguage"
      >
        <div
          class="size-9 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 text-base"
        >
          <span>{{ locale === 'id' ? '🇮🇩' : '🇬🇧' }}</span>
        </div>

        <div
          class="min-w-0 flex-1 transition-opacity duration-200"
          :class="isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
        >
          <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {{ $t("appStudio.nav.language") }}
          </div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
            {{ locale === 'id' ? 'Indonesia' : 'English' }}
          </div>
        </div>

        <UIcon
          name="i-ph-caret-down-bold"
          class="size-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0"
          :class="isCollapsed ? 'hidden' : 'block'"
        />
      </button>

      <!-- 3. User Profile Card (Interactive Dropdown Trigger) -->
      <div
        class="p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer group shadow-sm"
        :class="{ 'ring-2 ring-emerald-500/40': isProfileMenuOpen, 'justify-center p-2': isCollapsed }"
        :title="$t('appStudio.userProfile.profileMenu')"
        @click="toggleProfileMenu"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <!-- User Avatar with Green Dot -->
          <div
            class="relative size-9 rounded-full bg-emerald-400/30 dark:bg-emerald-400/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner"
          >
            <UIcon name="i-ph-user-fill" class="size-5 text-emerald-800 dark:text-emerald-300" />
            <span
              class="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0c0f]"
            />
          </div>

          <!-- User Details -->
          <div
            class="min-w-0 flex-1 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
          >
            <div
              class="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight"
            >
              {{ $t("appStudio.userProfile.name") }}
            </div>
            <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
              {{ $t("appStudio.userProfile.role") }}
            </div>
          </div>
        </div>

        <!-- Three Dots Action Icon -->
        <div
          class="size-6 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors shrink-0"
          :class="isCollapsed ? 'hidden' : 'flex'"
        >
          <UIcon name="i-ph-dots-three-vertical-bold" class="size-4" />
        </div>
      </div>

      <!-- POPUP DROPDOWN MENU (Floating Above Profile Card) -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="transform scale-95 opacity-0 translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-2"
      >
        <div
          v-if="isProfileMenuOpen"
          class="absolute bottom-20 left-2 right-2 z-50 rounded-2xl bg-white/95 dark:bg-[#141419]/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-2xl p-1.5 space-y-1 select-none"
        >
          <div class="px-3 py-2 border-b border-black/5 dark:border-white/10">
            <div class="text-xs font-bold text-slate-900 dark:text-white">
              {{ $t("appStudio.userProfile.name") }}
            </div>
            <div class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
              <span class="size-1.5 rounded-full bg-emerald-500" />
              <span>Dieng Highland Hub</span>
            </div>
          </div>

          <button
            type="button"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
            @click="openSettings"
          >
            <UIcon name="i-ph-gear-six-duotone" class="size-4 text-slate-500" />
            <span>{{ $t("appStudio.userProfile.settings") }}</span>
          </button>

          <NuxtLink
            to="/"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            @click="isProfileMenuOpen = false"
          >
            <UIcon name="i-ph-house-line-duotone" class="size-4 text-slate-500" />
            <span>{{ $t("appStudio.userProfile.backToLanding") }}</span>
          </NuxtLink>

          <div class="h-px bg-black/5 dark:border-white/10 my-1" />

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
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showSettingsModal = false" />
      <div class="relative w-full max-w-md rounded-3xl bg-[#F8FAF9] dark:bg-[#121216] border border-black/10 dark:border-white/15 p-6 space-y-4 z-10 text-slate-900 dark:text-slate-100 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/8 dark:border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-ph-gear-six-duotone" class="size-5 text-emerald-600 dark:text-emerald-400" />
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">
              {{ $t("appStudio.userProfile.settings") }}
            </h3>
          </div>
          <button
            type="button"
            class="size-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            @click="showSettingsModal = false"
          >
            <UIcon name="i-ph-x-bold" class="size-3.5" />
          </button>
        </div>

        <div class="space-y-3 font-mono text-xs">
          <div class="p-3.5 rounded-2xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
            <div class="text-[10px] text-slate-500">OPERATOR ID</div>
            <div class="font-bold text-slate-900 dark:text-white">AGR-2026-DIENG-04</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
            <div class="text-[10px] text-slate-500">ML INFERENCE ACCELERATOR</div>
            <div class="font-bold text-emerald-600 dark:text-emerald-400">WASM SIMD + WebGPU Core</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
            <div class="text-[10px] text-slate-500">STORAGE CACHE STATUS</div>
            <div class="font-bold text-slate-900 dark:text-white">Offline Synced (Local)</div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            class="h-10 px-5 rounded-xl text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 cursor-pointer transition-colors"
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
        class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-2"
      >
        <UIcon name="i-ph-check-circle-fill" class="size-4 text-emerald-400" />
        <span>{{ $t("appStudio.userProfile.logoutToast") }}</span>
      </div>
    </Transition>
  </aside>
</template>
