<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const { t } = useI18n({ useScope: "global" });
const colorMode = useColorMode();
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const navLinks = computed(() => [
  { label: t("nav.threat"), targetId: "threat" },
  { label: t("nav.catalog"), targetId: "catalog" },
  { label: t("nav.howItWorks"), targetId: "how-it-works" },
  { label: t("nav.tech"), targetId: "tech" },
  { label: t("nav.benefits"), targetId: "benefits" },
]);

const scrollTo = (targetId: string) => {
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3.5 pb-2 transition-all duration-300">
    <div class="max-w-6xl mx-auto">
      <nav
        class="flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300"
        :class="[
          isScrolled
            ? 'bg-white/90 dark:bg-[#101311]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)]'
            : 'bg-white/70 dark:bg-[#101311]/60 backdrop-blur-md border border-slate-200/50 dark:border-white/5 shadow-none'
        ]"
      >
        <!-- Brand Logo -->
        <button
          type="button"
          class="flex items-center gap-2.5 group text-left cursor-pointer select-none"
          @click="scrollToTop"
        >
          <div
            class="size-9 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform shrink-0 overflow-hidden"
          >
            <img src="/og-logo-emerald.png" alt="Potadi Logo" class="w-full h-full object-contain block dark:hidden" />
            <img src="/og-logo.png" alt="Potadi Logo" class="w-full h-full object-contain hidden dark:block" />
          </div>

          <div class="flex items-center gap-1.5">
            <span
              class="text-base font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Potadi
            </span>
            <span
              class="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
            />
          </div>
        </button>

        <!-- Desktop Navigation Links (Clean Modern Text Links) -->
        <div class="hidden md:flex items-center gap-1">
          <button
            v-for="link in navLinks"
            :key="link.targetId"
            type="button"
            class="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            @click="scrollTo(link.targetId)"
          >
            {{ link.label }}
          </button>
        </div>

        <!-- Action CTA, Language & Theme Switcher -->
        <div class="flex items-center gap-2 sm:gap-2.5">
          <!-- Language Switcher Component -->
          <LanguageSwitcher />

          <!-- Clean Theme Toggle Button -->
          <button
            type="button"
            class="size-8.5 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-100/80 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer active:scale-95"
            :aria-label="$t('nav.themeToggleLight')"
            :title="$t('nav.themeToggleLight')"
            @click="toggleTheme"
          >
            <ClientOnly>
              <UIcon
                :name="
                  colorMode.value === 'dark'
                    ? 'i-ph-moon-stars-fill'
                    : 'i-ph-sun-fill'
                "
                class="size-4"
                :class="colorMode.value === 'dark' ? 'text-emerald-400' : 'text-amber-500'"
              />
              <template #fallback>
                <span class="size-4 inline-block" />
              </template>
            </ClientOnly>
          </button>

          <!-- Sign In Link -->
          <!-- <NuxtLink
            to="/auth/login"
            class="hidden md:inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {{ $t("nav.login") }}
          </NuxtLink> -->

          <!-- Primary Launch Studio CTA Button (High Contrast Pill) -->
          <NuxtLink
            to="/app"
            class="hidden md:inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <span>{{ $t("nav.ctaButton") }}</span>
            <UIcon name="i-ph-arrow-up-right-bold" class="size-3.5" />
          </NuxtLink>

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            class="md:hidden size-8.5 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle navigation menu"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <UIcon
              :name="isMobileMenuOpen ? 'i-ph-x-bold' : 'i-ph-list-bold'"
              class="size-4.5"
            />
          </button>
        </div>
      </nav>

      <!-- Mobile Dropdown Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0 scale-95"
        enter-to-class="transform translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100 scale-100"
        leave-to-class="transform -translate-y-2 opacity-0 scale-95"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden mt-2 p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#101311]/95 backdrop-blur-2xl shadow-xl flex flex-col gap-1.5 border border-slate-200 dark:border-white/10"
        >
          <button
            v-for="link in navLinks"
            :key="link.targetId"
            type="button"
            class="px-4 py-2.5 text-sm font-medium text-left text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            @click="
              scrollTo(link.targetId);
              isMobileMenuOpen = false;
            "
          >
            {{ link.label }}
          </button>

          <div
            class="pt-3 mt-1 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2"
          >
            <!-- <NuxtLink
              to="/auth/login"
              class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              @click="isMobileMenuOpen = false"
            >
              <span>{{ $t("nav.login") }}</span>
            </NuxtLink> -->

            <NuxtLink
              to="/app"
              class="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:text-slate-950 rounded-xl transition-all shadow-sm"
              @click="isMobileMenuOpen = false"
            >
              <span>{{ $t("nav.ctaButtonStudio") }}</span>
              <UIcon name="i-ph-arrow-up-right-bold" class="size-4" />
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>
