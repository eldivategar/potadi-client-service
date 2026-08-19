<script setup lang="ts">
import { ref } from 'vue'

const colorMode = useColorMode()
const isMobileMenuOpen = ref(false)

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navLinks = [
  { label: 'Ancaman Hawar', href: '#threat' },
  { label: 'Katalog Gejala', href: '#catalog' },
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Spesifikasi AI', href: '#tech' },
  { label: 'Ergonomi Lapangan', href: '#benefits' }
]
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 pb-2">
    <div class="max-w-6xl mx-auto">
      <nav
        class="flex items-center justify-between px-4 sm:px-6 py-3 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors duration-300"
      >
        <!-- Brand Logo -->
        <a href="#" class="flex items-center gap-3 group">
          <div
            class="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 group-hover:border-emerald-500/40 group-hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <img
              src="/og-logo-emerald.png"
              alt="Potadi Logo"
              class="w-full h-full object-contain block dark:hidden"
            />
            <img
              src="/og-logo.png"
              alt="Potadi Logo"
              class="w-full h-full object-contain hidden dark:block"
            />
          </div>

          <div class="flex flex-col">
            <span class="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Potadi
              <span class="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            </span>
            <span class="text-[9px] font-mono text-emerald-700 dark:text-emerald-400/80 -mt-1 tracking-wider uppercase">
              Potato Disease Identification
            </span>
          </div>
        </a>


        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-1 lg:gap-2">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Action CTA & Theme Switcher -->
        <div class="flex items-center gap-2">
          <!-- Theme Switcher Button -->
          <button
            type="button"
            class="size-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-150"
            :aria-label="colorMode.value === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'"
            @click="toggleTheme"
          >
            <ClientOnly>
              <UIcon
                :name="colorMode.value === 'dark' ? 'i-ph-sun-dim-duotone' : 'i-ph-moon-stars-duotone'"
                class="size-4.5"
              />
              <template #fallback>
                <span class="size-4.5 inline-block" />
              </template>
            </ClientOnly>
          </button>

          <NuxtLink
            to="/app"
            class="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] active:scale-[0.97] transition-all duration-150"
          >
            <span>Mulai Diagnosa</span>
            <UIcon name="i-ph-arrow-up-right-bold" class="size-3.5" />
          </NuxtLink>


          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            class="md:hidden size-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            aria-label="Toggle navigation menu"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <UIcon :name="isMobileMenuOpen ? 'i-ph-x-bold' : 'i-ph-list-bold'" class="size-5" />
          </button>
        </div>
      </nav>

      <!-- Mobile Dropdown Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden mt-2 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl flex flex-col gap-2"
        >
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </a>
          <div class="pt-2 border-t border-black/10 dark:border-white/10 flex items-center gap-2">
            <NuxtLink
              to="/app"
              class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all"
              @click="isMobileMenuOpen = false"
            >
              <span>Mulai Diagnosa di Studio</span>
              <UIcon name="i-ph-arrow-up-right-bold" class="size-4" />
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

