<script setup lang="ts">
import { ref } from 'vue'
import { useScroll, useTransform } from 'motion-v'

interface LeafSample {
  id: string
  label: string
  scientificName: string
  image: string
  status: string
  statusColor: string
  confidence: string
  latency: string
  severity: string
  summary: string
}

const samples: LeafSample[] = [
  {
    id: 'early-blight',
    label: 'Hawar Dini (Early Blight)',
    scientificName: 'Alternaria solani',
    image: '/images/sample-leafs/early-blight.jpg',
    status: 'TERDETEKSI INFEKSI',
    statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    confidence: '98.4%',
    latency: '24ms',
    severity: 'Sedang (Bercak Konsentris)',
    summary: 'Bercak cokelat melingkar seperti cincin target. Perlu fungisida protektif segera.'
  },
  {
    id: 'late-blight',
    label: 'Hawar Daun (Late Blight)',
    scientificName: 'Phytophthora infestans',
    image: '/images/sample-leafs/late-blight.jpg',
    status: 'BAHAYA TINGGI (DARURAT)',
    statusColor: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
    confidence: '99.1%',
    latency: '22ms',
    severity: 'Tinggi (Busuk Basah)',
    summary: 'Lesi basah kehitaman yang menyebar cepat. Risiko gagal panen total dalam 7 hari.'
  },
  {
    id: 'healthy',
    label: 'Daun Sehat (Healthy)',
    scientificName: 'Solanum tuberosum',
    image: '/images/sample-leafs/healthy-leaf.jpg',
    status: 'JARINGAN OPTIMAL',
    statusColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    confidence: '99.7%',
    latency: '19ms',
    severity: 'Aman (Klorofil Prima)',
    summary: 'Struktur daun hijau segar tanpa gejala nekrotik. Lanjutkan pemantauan berkala.'
  }
]

const activeSample = ref<LeafSample>(samples[0]!)

// High-Amplitude Element-Level Parallax Transforms
const { scrollYProgress } = useScroll()
const scannerY = useTransform(scrollYProgress, [0, 0.35], ['0px', '90px'])
const badgeY = useTransform(scrollYProgress, [0, 0.35], ['0px', '-70px'])
const imgY = useTransform(scrollYProgress, [0, 0.35], ['-20px', '30px'])
const h1Y = useTransform(scrollYProgress, [0, 0.35], ['0px', '-35px'])
</script>

<template>
  <section class="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
    <!-- Background Ambient Glow & Grid -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />
    <div class="absolute inset-0 bg-grid-tactile opacity-30 dark:opacity-20 pointer-events-none -z-10" />



    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- Left Column: Copy & Value Proposition -->
        <div class="lg:col-span-6 space-y-8 text-left">
          <!-- Stagger 1: Eyebrow -->
          <Motion
            :initial="{ opacity: 0, y: 16 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono tracking-wide"
          >
            <UIcon name="i-ph-shield-check-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>SISTEM DIAGNOSTIK BOTANIK VISION AI</span>
          </Motion>

          <!-- Stagger 2: Sharp 2-line Headline (Outer: Entrance, Inner: Parallax) -->
          <Motion
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }"
          >
            <Motion :style="{ y: h1Y }">
              <h1 class="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Diagnosa Penyakit Daun Kentang <span class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">dalam Sekejap</span>
              </h1>
            </Motion>
          </Motion>

          <!-- Stagger 3: Agronomic Subtext (18 words) -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }"
          >
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Identifikasi dini hawar daun (Early & Late Blight) langsung di lahan kentang secara presisi dan 100% offline.
            </p>
          </Motion>

          <!-- Stagger 4: Action CTAs -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }"
            class="flex flex-wrap items-center gap-4 pt-2"
          >
            <NuxtLink
              to="/app"
              class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] active:scale-[0.98] transition-all duration-150"
            >
              <UIcon name="i-ph-camera-duotone" class="size-5" />
              <span>Mulai Diagnosa Sekarang</span>
              <UIcon name="i-ph-arrow-up-right-bold" class="size-4" />
            </NuxtLink>

            <a
              href="#catalog"
              class="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl active:scale-[0.98] transition-all duration-150"
            >
              <span>Lihat Gejala Lapangan</span>
              <UIcon name="i-ph-caret-down-bold" class="size-4" />
            </a>
          </Motion>

          <!-- Stagger 5: Hardware & Agritech Trust Matrix (Encapsulated) -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }"
            class="bg-black/[0.02] dark:bg-white/[0.03] border border-black/8 dark:border-white/10 rounded-2xl p-4 grid grid-cols-3 gap-4 shadow-sm dark:shadow-none"
          >
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">LATENSI MODEL</div>
              <div class="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1 mt-0.5">
                <UIcon name="i-ph-lightning-fill" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>&lt; 28 ms</span>
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">AKURASI VALIDASI</div>
              <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <UIcon name="i-ph-check-circle-fill" class="size-3.5" />
                <span>98.6%</span>
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">AKSES LAHAN</div>
              <div class="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1 mt-0.5">
                <UIcon name="i-ph-wifi-slash-bold" class="size-3.5 text-slate-500 dark:text-slate-400" />
                <span>100% Offline</span>
              </div>
            </div>
          </Motion>
        </div>

        <!-- Right Column: Interactive Leaf Scanner Demo with Separated Multi-Layer Parallax -->
        <div class="lg:col-span-6 relative">
          <!-- Floating Glass Badge 1: Top-Right (Pure Parallax Shift upwards) -->
          <Motion
            :style="{ y: badgeY }"
            class="absolute -top-5 -right-2 sm:-right-4 z-30 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold shadow-xl flex items-center gap-1.5"
          >
            <span class="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% On-Device ML</span>
          </Motion>

          <!-- Floating Glass Badge 2: Bottom-Left (Pure Parallax Shift upwards) -->
          <Motion
            :style="{ y: badgeY }"
            class="absolute -bottom-5 -left-2 sm:-left-4 z-30 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-emerald-500/30 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold shadow-xl flex items-center gap-1.5"
          >
            <UIcon name="i-ph-check-circle-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Validasi Riset 98.6%</span>
          </Motion>

          <!-- Outer Motion: Entry Transition (Scale & Opacity) -->
          <Motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ type: 'spring', stiffness: 100, damping: 18, delay: 0.2 }"
            class="relative"
          >
            <!-- Inner Motion: Dedicated Scroll Parallax -->
            <Motion :style="{ y: scannerY }">
              <!-- Outer Double-Bezel Hardware Wrapper -->
              <div class="p-2 sm:p-3 rounded-3xl bezel-outer shadow-2xl">
                <div class="rounded-2xl bezel-inner p-4 sm:p-5 relative overflow-hidden">
                  <!-- Scanner Header Telemetry -->
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/10 text-xs font-mono">
                    <div class="flex items-center gap-2">
                      <span class="size-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                      <span class="text-slate-700 dark:text-slate-300 font-bold tracking-wider">LIVE VISION TELEMETRY</span>
                    </div>
                    <div class="text-slate-500 dark:text-slate-400">
                      INFERENCE: <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ activeSample.latency }}</span>
                    </div>
                  </div>

                  <!-- Leaf Viewport & Scanning Plane with Optical Lens Parallax -->
                  <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-black/10 dark:border-white/10 group">
                    <!-- Leaf Sample Image with Continuous Lens Shift -->
                    <Motion
                      :style="{ y: imgY }"
                      class="w-full h-full scale-110"
                    >
                      <img
                        :src="activeSample.image"
                        :alt="activeSample.label"
                        class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </Motion>

                    <!-- Dark Scrim Gradient for HUD Readability -->
                    <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/40 pointer-events-none" />

                    <!-- Looping Motion Laser Beam (GPU Transform Accelerated) -->
                    <Motion
                      :animate="{ y: ['0px', '220px', '0px'] }"
                      :transition="{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }"
                      class="absolute top-0 left-0 right-0 h-1.5 scanner-laser z-20 pointer-events-none transform-gpu"
                    />


                    <!-- Corner Reticle HUD (Crosshair Focus) -->
                    <div class="absolute inset-4 pointer-events-none flex flex-col justify-between z-10">
                      <div class="flex justify-between">
                        <div class="size-4 border-t-2 border-l-2 border-emerald-400" />
                        <div class="size-4 border-t-2 border-r-2 border-emerald-400" />
                      </div>
                      <div class="flex justify-between">
                        <div class="size-4 border-b-2 border-l-2 border-emerald-400" />
                        <div class="size-4 border-b-2 border-r-2 border-emerald-400" />
                      </div>
                    </div>

                    <!-- Live HUD Detection Pill -->
                    <div class="absolute bottom-3 left-3 right-3 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-neutral-900/90 dark:bg-neutral-900/90 backdrop-blur-md border border-white/15 shadow-lg">
                      <div class="space-y-0.5">
                        <div class="text-[10px] font-mono text-slate-400 uppercase">
                          Pathogen: <span class="italic text-slate-200 font-serif">{{ activeSample.scientificName }}</span>
                        </div>
                        <div class="text-xs font-bold text-white">
                          {{ activeSample.label }}
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span
                          class="px-2 py-1 text-[11px] font-mono font-bold rounded border"
                          :class="activeSample.statusColor"
                        >
                          {{ activeSample.status }}
                        </span>
                        <span class="px-2 py-1 text-[11px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {{ activeSample.confidence }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Sample Switcher Controls (Interactive Demo) -->
                  <div class="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                    <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                      <span>UJI SAMPEL DAUN LAPANGAN:</span>
                      <span class="text-emerald-600 dark:text-emerald-400 font-medium">Klik untuk simulasi diagnosa</span>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                      <button
                        v-for="sample in samples"
                        :key="sample.id"
                        type="button"
                        class="px-2.5 py-2 rounded-lg text-xs font-medium border text-left transition-all duration-200 flex flex-col gap-0.5"
                        :class="
                          activeSample.id === sample.id
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10'
                        "
                        @click="activeSample = sample"
                      >
                        <span class="truncate font-semibold">{{ sample.label.split(' ')[0] }} {{ sample.label.split(' ')[1] }}</span>
                        <span class="text-[10px] font-mono opacity-75">{{ sample.confidence }} acc</span>
                      </button>
                    </div>

                    <div class="mt-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-black/40 rounded-lg p-2.5 border border-black/5 dark:border-white/5 flex items-start gap-2">
                      <UIcon name="i-ph-info-duotone" class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{{ activeSample.summary }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Motion>
          </Motion>
        </div>
      </div>
    </div>
  </section>
</template>




