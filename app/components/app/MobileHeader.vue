<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";
import { useAuth } from "~/composables/useAuth";

const colorMode = useColorMode();
const { t } = useI18n();
const { user, signOut } = useAuth();

const isProfileOpen = ref(false);
const showLogoutToast = ref(false);
const imageLoadError = ref(false);
const profileMenuRef = ref<HTMLElement | null>(null);

watch(
  () => user.value?.image,
  () => {
    imageLoadError.value = false;
  }
);

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const handleLogout = () => {
  isProfileOpen.value = false;
  showLogoutToast.value = true;
  setTimeout(() => {
    showLogoutToast.value = false;
    signOut();
  }, 800);
};

const handleClickOutside = (e: MouseEvent) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(e.target as Node)) {
    isProfileOpen.value = false;
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
  <header
    class="lg:hidden sticky top-0 z-30 bg-[#EEF3F0]/95 dark:bg-[#111413]/95 backdrop-blur-xl border-b border-white/70 dark:border-white/5 shadow-[0_4px_16px_rgba(164,184,174,0.2)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] px-4 py-2.5 flex items-center justify-between select-none"
  >
    <!-- Left: Brand Logo & Back Action -->
    <div class="flex items-center gap-2.5">
      <!-- <NuxtLink
        to="/"
        class="size-8 rounded-xl neu-btn flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        :aria-label="$t('appStudio.nav.backToLanding')"
      >
        <UIcon name="i-ph-arrow-left-bold" class="size-4" />
      </NuxtLink> -->

    <NuxtLink to="/app" class="flex items-center gap-2">
        <div class="size-7 rounded-xl neu-convex flex items-center justify-center p-1 shrink-0 overflow-hidden">
          <img src="/og-logo-emerald.png" alt="Potadi Logo" class="w-full h-full object-contain block dark:hidden" />
          <img src="/og-logo.png" alt="Potadi Logo" class="w-full h-full object-contain hidden dark:block" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Potadi
          </span>
          <span class="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold neu-btn-primary shadow-xs">
            Studio
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- Right: Controls & User Profile -->
    <div class="flex items-center gap-2 text-xs font-mono">
      <LanguageSwitcher />

      <!-- Mobile Tactile Neumorphic Switch -->
      <button
        type="button"
        class="neu-switch-track w-13 h-7.5 rounded-full p-0.5 flex items-center cursor-pointer relative shrink-0 active:scale-95 transition-all duration-750"
        :aria-label="$t('appStudio.nav.mode')"
        :title="$t('appStudio.nav.mode')"
        @click="toggleTheme"
      >
        <ClientOnly>
          <div
            class="neu-switch-thumb size-6 rounded-full flex items-center justify-center text-xs transition-transform duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
            :class="colorMode.value === 'dark' ? 'translate-x-5.5' : 'translate-x-0'"
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
          <template #fallback>
            <div class="neu-switch-thumb size-6 rounded-full flex items-center justify-center text-xs">
              <span class="size-3.5 inline-block" />
            </div>
          </template>
        </ClientOnly>
      </button>

      <!-- User Profile & Logout Action on Mobile -->
      <div ref="profileMenuRef" class="relative">
        <button
          type="button"
          class="size-8 rounded-full neu-convex flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform"
          :class="isProfileOpen ? 'ring-2 ring-emerald-500/50' : ''"
          aria-label="User Profile"
          @click="isProfileOpen = !isProfileOpen"
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
            class="size-4 text-emerald-700 dark:text-emerald-300"
          />
        </button>

        <!-- Mobile Profile Dropdown -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0 -translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 -translate-y-2"
        >
          <div
            v-if="isProfileOpen"
            class="absolute right-0 top-10 w-56 rounded-2xl neu-flat shadow-2xl p-1.5 space-y-1 z-50 select-none text-left"
          >
            <div class="px-3 py-2 border-b border-black/5 dark:border-white/5">
              <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
                {{ user?.name || $t("appStudio.userProfile.name") }}
              </div>
              <div class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                {{ user?.email || "petani@potadi.id" }}
              </div>
            </div>

            <NuxtLink
              to="/app/profile"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:neu-inset-sm transition-all"
              @click="isProfileOpen = false"
            >
              <UIcon name="i-ph-user-gear-duotone" class="size-4 text-emerald-500" />
              <span>{{ $t("appStudio.nav.profile") }}</span>
            </NuxtLink>

            <NuxtLink
              to="/"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:neu-inset-sm transition-all"
              @click="isProfileOpen = false"
            >
              <UIcon name="i-ph-house-line-duotone" class="size-4 text-slate-500" />
              <span>{{ $t("appStudio.userProfile.backToLanding") }}</span>
            </NuxtLink>

            <div class="h-px bg-black/5 dark:bg-white/5 my-0.5" />

            <button
              type="button"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer font-bold"
              @click="handleLogout"
            >
              <UIcon name="i-ph-sign-out-bold" class="size-4 text-rose-500" />
              <span>{{ $t("appStudio.userProfile.logout") }}</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- LOGOUT TOAST NOTIFICATION -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95"
    >
      <div
        v-if="showLogoutToast"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl neu-flat shadow-2xl border border-emerald-500/30 flex items-center gap-2.5 text-xs font-mono text-slate-800 dark:text-slate-200"
      >
        <UIcon name="i-ph-check-circle-fill" class="size-4 text-emerald-500 shrink-0" />
        <span>{{ $t("appStudio.userProfile.loggingOut") }}...</span>
      </div>
    </Transition>
  </header>
</template>
