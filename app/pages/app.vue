<script setup lang="ts">
import { ref } from 'vue'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

useHead({
  title: 'Diagnostic Studio - Potadi Vision AI',
  meta: [
    {
      name: 'description',
      content: 'Studio analisis dan pemindaian citra daun kentang langsung di browser.'
    }
  ]
})

interface LeafSample {
  id: string
  label: string
  scientificName: string
  image: string
  status: string
  statusColor: string
  confidence: string
  latency: string
  solution: string
}

const samples: LeafSample[] = [
  {
    id: 'early-blight',
    label: 'Hawar Dini (Early Blight)',
    scientificName: 'Alternaria solani',
    image: '/images/sample-leafs/early-blight.jpg',
    status: 'TERDETEKSI: EARLY BLIGHT',
    statusColor: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30',
    confidence: '98.4%',
    latency: '24ms',
    solution: 'Aplikasikan fungisida protektif berbahan aktif Mankozeb 80% WP (2 g/L air) dan pangkas daun bawah yang bercak cincin konsentris.'
  },
  {
    id: 'late-blight',
    label: 'Hawar Daun (Late Blight)',
    scientificName: 'Phytophthora infestans',
    image: '/images/sample-leafs/late-blight.jpg',
    status: 'TERDETEKSI: LATE BLIGHT (DARURAT)',
    statusColor: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30',
    confidence: '99.1%',
    latency: '22ms',
    solution: 'Bahaya busuk basah! Segera isolasi tanaman dan semprot fungisida sistemik Metalaksil-M / Dimetomorf sebelum merambat ke umbi.'
  },
  {
    id: 'healthy',
    label: 'Daun Sehat (Healthy Foliage)',
    scientificName: 'Solanum tuberosum L.',
    image: '/images/sample-leafs/healthy-leaf.jpg',
    status: 'STATUS: DAUN PRIMA (BEBAS PATOGEN)',
    statusColor: 'text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30',
    confidence: '99.7%',
    latency: '19ms',
    solution: 'Kondisi klorofil dan jaringan daun optimal. Pertahankan nutrisi kalium seimbang dan pantau berkala tiap 3 hari.'
  }
]

const selectedSample = ref<LeafSample>(samples[0]!)
const isScanning = ref(false)
const scanComplete = ref(true)

const triggerScan = () => {
  isScanning.value = true
  scanComplete.value = false
  setTimeout(() => {
    isScanning.value = false
    scanComplete.value = true
  }, 1200)
}
</script>

<template>
  <main class="min-h-screen bg-[#F8FAF9] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
    <!-- Studio Header -->
    <header class="border-b border-black/8 dark:border-white/10 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <UIcon name="i-ph-arrow-left-bold" class="size-3.5" />
          <span>Kembali ke Beranda</span>
        </NuxtLink>

        <div class="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

        <div class="flex items-center gap-2">
          <div class="size-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <UIcon name="i-ph-leaf-fill" class="size-3.5" />
          </div>
          <span class="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Diagnostic Studio</span>
        </div>
      </div>

      <div class="flex items-center gap-2 text-xs font-mono">
        <button
          type="button"
          class="size-8 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-150"
          :aria-label="colorMode.value === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'"
          @click="toggleTheme"
        >
          <ClientOnly>
            <UIcon
              :name="colorMode.value === 'dark' ? 'i-ph-sun-dim-duotone' : 'i-ph-moon-stars-duotone'"
              class="size-4"
            />
            <template #fallback>
              <span class="size-4 inline-block" />
            </template>
          </ClientOnly>
        </button>

        <div class="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
          <span class="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>ON-DEVICE ENGINE ACTIVE</span>
        </div>
      </div>
    </header>

    <!-- Studio Body: Split View -->
    <div class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left: Viewfinder & Input -->
      <div class="lg:col-span-6 space-y-4">
        <div class="p-2 sm:p-3 rounded-3xl bezel-outer">
          <div class="rounded-2xl bezel-inner p-4 sm:p-5 space-y-4">
            <div class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 border-b border-black/8 dark:border-white/10 pb-2">
              <span>VIEWFINDER INPUT</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">CAMERA / SAMPLE FEED</span>
            </div>

            <!-- Image Viewport -->
            <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black border border-black/10 dark:border-white/10">
              <img
                :src="selectedSample.image"
                :alt="selectedSample.label"
                class="w-full h-full object-cover"
              />

              <!-- Scanner Laser when scanning -->
              <Motion
                v-if="isScanning"
                :animate="{ top: ['0%', '94%', '0%'] }"
                :transition="{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }"
                class="absolute left-0 right-0 h-1.5 scanner-laser z-20"
              />

              <!-- Scanning Overlay -->
              <div v-if="isScanning" class="absolute inset-0 bg-emerald-950/30 backdrop-blur-[2px] flex items-center justify-center z-10">
                <div class="px-4 py-2 rounded-xl bg-neutral-900/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <UIcon name="i-ph-spinner-gap-bold" class="size-4 animate-spin text-emerald-400" />
                  <span>MEMINDAI POLA DAUN...</span>
                </div>
              </div>

              <!-- Reticle HUD -->
              <div class="absolute inset-4 pointer-events-none flex flex-col justify-between z-10 opacity-70">
                <div class="flex justify-between">
                  <div class="size-4 border-t-2 border-l-2 border-emerald-400" />
                  <div class="size-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div class="flex justify-between">
                  <div class="size-4 border-b-2 border-l-2 border-emerald-400" />
                  <div class="size-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>
            </div>

            <!-- Sample Leaf Selector -->
            <div class="space-y-2">
              <div class="text-xs font-mono text-slate-500 dark:text-slate-400">PILIH SAMPEL UJI CITRA:</div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="item in samples"
                  :key="item.id"
                  type="button"
                  class="p-2 rounded-xl text-xs font-medium border text-left transition-all flex flex-col"
                  :class="
                    selectedSample.id === item.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  "
                  @click="
                    selectedSample = item;
                    triggerScan();
                  "
                >
                  <span class="font-bold truncate">{{ item.label.split(' ')[0] }} {{ item.label.split(' ')[1] }}</span>
                  <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400">{{ item.confidence }}</span>
                </button>
              </div>
            </div>

            <!-- Action Button -->
            <button
              type="button"
              class="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              :disabled="isScanning"
              @click="triggerScan"
            >
              <UIcon name="i-ph-scan-bold" class="size-4" />
              <span>{{ isScanning ? 'Memproses Inferensi...' : 'Analisis Ulang Citra Daun' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Diagnosis Telemetry & Field Protocol -->
      <div class="lg:col-span-6 space-y-4">
        <div class="p-2 sm:p-3 rounded-3xl bezel-outer">
          <div class="rounded-2xl bezel-inner p-6 space-y-6">
            <div>
              <span class="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase">HASIL INFERENSI DIAGNOSTIK</span>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                {{ selectedSample.label }}
              </h2>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 italic">
                Pathogen: {{ selectedSample.scientificName }}
              </p>
            </div>

            <!-- Status Badge & Confidence Matrix -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1">
                <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">STATUS DIAGNOSA</div>
                <div class="text-xs font-bold rounded p-1.5 border inline-block" :class="selectedSample.statusColor">
                  {{ selectedSample.status }}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1">
                <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">TINGKAT KEYAKINAN</div>
                <div class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {{ selectedSample.confidence }}
                </div>
              </div>
            </div>

            <!-- Field Intervention -->
            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-2">
              <div class="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <UIcon name="i-ph-first-aid-kit-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>PANDUAN INTERVENSI LAPANGAN:</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {{ selectedSample.solution }}
              </p>
            </div>

            <!-- Model Telemetry Spec -->
            <div class="pt-4 border-t border-black/8 dark:border-white/10 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <div>
                <div>LATENSI:</div>
                <div class="text-slate-900 dark:text-white font-bold">{{ selectedSample.latency }}</div>
              </div>
              <div>
                <div>RESOLUSI:</div>
                <div class="text-slate-900 dark:text-white font-bold">1024 x 1024</div>
              </div>
              <div>
                <div>MODEL VERSI:</div>
                <div class="text-emerald-600 dark:text-emerald-400 font-bold">v1.0.4 Onnx</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

