<script setup lang="ts">
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";

defineProps<{
  title?: string;
  subtitle?: string;
}>();

const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <div
    class="min-h-screen w-full bg-[#F4F7F5] dark:bg-[#0B0F0D] text-slate-900 dark:text-slate-100 flex flex-col justify-between relative p-3 sm:p-6 lg:p-8 transition-colors duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] selection:bg-emerald-500/25 selection:text-emerald-900 dark:selection:text-emerald-200 overflow-x-hidden"
  >
    <!-- Background Ambient Ethereal Glow Mesh -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        class="absolute -top-32 -left-32 size-[500px] rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-[130px] transition-all"
      />
      <div
        class="absolute top-1/3 -right-32 size-[550px] rounded-full bg-teal-400/15 dark:bg-teal-600/10 blur-[140px] transition-all"
      />
      <div
        class="absolute -bottom-32 left-1/4 size-[600px] rounded-full bg-sky-400/10 dark:bg-emerald-800/10 blur-[150px] transition-all"
      />
    </div>

    <!-- Top Floating Utility Header (Back to Home, Language & Theme) -->
    <header class="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 py-2 px-1 relative z-20 shrink-0">
      <!-- Back to Home Button -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-sm transition-all duration-200 active:scale-95 group"
      >
        <UIcon
          name="i-ph-arrow-left-bold"
          class="size-3.5 text-slate-500 dark:text-slate-400 group-hover:-translate-x-0.5 transition-transform"
        />
        <span>{{ $t("auth.common.backToHome") }}</span>
      </NuxtLink>

      <!-- Utility Actions: Language Switcher & Theme Toggle -->
      <div class="flex items-center gap-2">
        <LanguageSwitcher />

        <button
          type="button"
          class="size-9 rounded-full bg-white/80 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-sm active:scale-95 transition-all cursor-pointer relative overflow-hidden"
          :title="$t('nav.themeToggleLight')"
          @click="toggleTheme"
        >
          <ClientOnly>
            <div class="relative size-4 flex items-center justify-center">
              <UIcon
                name="i-ph-sun-dim-duotone"
                class="size-4 absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] text-amber-500 dark:text-slate-300"
                :class="colorMode.value === 'dark' ? 'opacity-0 rotate-90 scale-50 pointer-events-none' : 'opacity-100 rotate-0 scale-100'"
              />
              <UIcon
                name="i-ph-moon-stars-duotone"
                class="size-4 absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] text-emerald-400"
                :class="colorMode.value === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50 pointer-events-none'"
              />
            </div>
            <template #fallback>
              <span class="size-4 inline-block" />
            </template>
          </ClientOnly>
        </button>
      </div>
    </header>

    <!-- Main Central Widescreen Unified Card Container -->
    <main
      class="w-full max-w-7xl mx-auto my-auto py-3 sm:py-6 relative z-10 flex items-center justify-center"
      role="main"
    >
      <div
        class="w-full rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#111513] border border-slate-200/80 dark:border-white/[0.08] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row min-h-[640px] xl:min-h-[720px] transition-colors duration-700"
      >
        <!-- =========================================================================
             LEFT PANEL: Clean Minimalist Authentication Form Panel
             ========================================================================= -->
        <section
          class="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-white dark:bg-[#111513] relative z-10 shrink-0 transition-colors duration-700"
          aria-label="Form Autentikasi"
        >
          <!-- Brand Logo Header -->
          <div class="flex items-center justify-between mb-8 sm:mb-10">
            <NuxtLink to="/" class="inline-flex items-center gap-3 group">
              <div
                class="size-9 sm:size-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform"
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
              <div class="flex items-baseline gap-1.5">
                <span class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                  POTADI
                </span>
              </div>
            </NuxtLink>

            <!-- Tagline Badge -->
            <div class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Studio AI</span>
            </div>
          </div>

          <!-- Form Content Slot (Vertically Centered) -->
          <div class="my-auto w-full max-w-md mx-auto py-2">
            <slot />
          </div>

          <!-- Left Panel Subtle Footer (Mobile / Helper info) -->
          <!-- <div class="mt-8 pt-6 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>v1.0.4 • Edge Neural Engine</span>
            <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span class="size-1.5 rounded-full bg-emerald-500" />
              <span>100% On-Device</span>
            </span>
          </div> -->
        </section>

        <!-- =========================================================================
             RIGHT PANEL: Harmonious Living Botanical Showcase & Staggered Activity Cards
             ========================================================================= -->
        <aside
          class="hidden lg:flex flex-1 relative p-10 xl:p-14 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-sky-100/60 dark:from-[#131A16] dark:via-[#0F1512] dark:to-[#121915] border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-white/[0.06] select-none transition-colors duration-700"
          aria-label="Potadi Live Telemetry Showcase"
        >
          <!-- Background Ambient Lighting & Subtle Botanical Image Accent -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <!-- Organic Gradient Orbs -->
            <div class="absolute top-1/4 -right-16 size-80 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
            <div class="absolute bottom-10 -left-10 size-72 rounded-full bg-teal-300/25 dark:bg-teal-500/10 blur-3xl" />
            
            <!-- Soft Organic Potato Foliage Overlay -->
            <img
              src="/images/sample-leafs/healthy-leaf.jpg"
              alt="Potato Foliage"
              class="w-full h-full object-cover opacity-[0.07] dark:opacity-[0.12] mix-blend-overlay scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-emerald-100/40 via-transparent to-white/40 dark:from-[#0F1512]/90 dark:via-transparent dark:to-transparent" />
          </div>

          <!-- Top Section: Status pill & quick counter -->
          <!-- <div class="relative z-10 flex items-center justify-between">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.06] backdrop-blur-md border border-white/80 dark:border-white/10 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
              <span class="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Farm Telemetry</span>
            </div>

            <div class="text-xs font-mono text-slate-500 dark:text-slate-400">
              Dieng • Bromo • Pangalengan
            </div>
          </div> -->

          <!-- Middle Section: Staggered Dynamic Floating Status Cards (Inspired by Reference Design) -->
          <div class="relative z-10 my-auto py-6 space-y-3.5 max-w-lg mx-auto w-full">
            <!-- Card 1: Jane (Agronomist Dieng) - Top Offset Left -->
            <div class="floating-card rounded-2xl p-3.5 sm:p-4 max-w-[88%] ml-0 sm:ml-2 animate-float-1">
              <div class="flex items-start gap-3">
                <div class="size-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-300/40">
                  <UIcon name="i-ph-warning-bold" class="size-4.5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Jane • Agronomis Dieng</span>
                    <span class="text-[10px] text-slate-400 font-mono">10m lalu</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    Hawar Dini (Early Blight) terdeteksi di Blok B2. Rekomendasi fungisida protektif telah siap diaplikasikan.
                  </p>
                </div>
              </div>
            </div>

            <!-- Card 2: Plot Lahan Bromo - Top Offset Right -->
            <div class="floating-card rounded-2xl p-3.5 sm:p-4 max-w-[85%] ml-auto animate-float-2">
              <div class="flex items-start gap-3">
                <div class="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-300/40">
                  <UIcon name="i-ph-leaf-duotone" class="size-4.5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Plot Bromo • Sektor 3</span>
                    <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">1 jam lalu</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    Hasil pemindaian 18 petak: 100% Bebas Patogen. Jaringan klorofil daun prima.
                  </p>
                </div>
              </div>
            </div>

            <!-- Card 3: Edge Vision Engine - Center Staggered -->
            <div class="floating-card rounded-2xl p-3.5 sm:p-4 max-w-[90%] mx-auto animate-float-3">
              <div class="flex items-start gap-3">
                <div class="size-9 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0 border border-sky-300/40">
                  <UIcon name="i-ph-cube-focus-fill" class="size-4.5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Edge Vision Engine v1.0.4</span>
                    <span class="text-[10px] text-sky-600 dark:text-sky-400 font-bold font-mono">24ms Latensi</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    Komputasi inferensi neural berjalan 100% lokal on-device tanpa membutuhkan koneksi internet.
                  </p>
                </div>
              </div>
            </div>

            <!-- Card 4: Sensor Mikroiklim & Spora - Bottom Left Offset -->
            <div class="floating-card rounded-2xl p-3.5 sm:p-4 max-w-[86%] ml-2 sm:ml-6 animate-float-4">
              <div class="flex items-start gap-3">
                <div class="size-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-300/40">
                  <UIcon name="i-ph-cloud-fog-duotone" class="size-4.5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Sensor Cuaca • Pangalengan</span>
                    <span class="text-[10px] text-slate-400 font-mono">Kemarin</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    Kelembapan udara 88% berpotensi memicu spora. Pantau kanopi bawah secara rutin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Section: Brand Statement & Subtitle (Clean & Minimalist) -->
          <div class="relative z-10 space-y-2 pt-4">
            <h2 class="text-xl xl:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              Pantau & lindungi tanaman kentang dari ancaman hawar.
            </h2>
            <p class="text-xs xl:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
              Sistem diagnostik fitopatologi presisi dengan kecerdasan buatan on-device untuk mendampingi agronomis dan petani langsung di perkebunan.
            </p>
          </div>
        </aside>
      </div>
    </main>

    <!-- Global Minimalist Footer Bar -->
    <footer class="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 py-2 px-2 text-[11px] text-slate-500 dark:text-slate-400 relative z-20 shrink-0">
      <div>
        Potadi &copy; 2026. {{ $t("footer.rightsReserved") }}
      </div>
      <div class="flex items-center gap-4 text-[11px]">
        <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Beranda
        </NuxtLink>
        <span class="text-slate-300 dark:text-slate-700">•</span>
        <span class="hover:underline cursor-pointer">Syarat & Ketentuan</span>
        <span class="text-slate-300 dark:text-slate-700">•</span>
        <span class="hover:underline cursor-pointer">Kebijakan Privasi</span>
      </div>
    </footer>
  </div>
</template>
