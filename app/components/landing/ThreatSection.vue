<script setup lang="ts">
import { useScroll, useTransform } from 'motion-v'

const threatStats = [
  {
    value: '70%',
    metric: 'Potensi Gagal Panen',
    description: 'Kehilangan umbi total jika spora hawar daun menyebar tanpa intervensi agronomis tepat.',
    icon: 'i-ph-warning-octagon-duotone',
    color: 'text-rose-400',
    border: 'border-rose-500/20'
  },
  {
    value: '7–14',
    unit: 'Hari',
    metric: 'Siklus Kerusakan Lahan',
    description: 'Kecepatan patogen menginfeksi seluruh petak lahan pada kondisi lembap dan berkabut.',
    icon: 'i-ph-clock-countdown-duotone',
    color: 'text-amber-400',
    border: 'border-amber-500/20'
  },
  {
    value: '< 24',
    unit: 'Jam',
    metric: 'Jendela Aksi Kritis',
    description: 'Batas waktu diagnosa akurat sebelum jaringan daun mati permanen dan menurunkan kualitas umbi.',
    icon: 'i-ph-lightning-duotone',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20'
  }
]

// High-Contrast 3D Staggered Parallax Transforms
const { scrollYProgress } = useScroll()
const col1Y = useTransform(scrollYProgress, [0.08, 0.35], ['40px', '-50px'])
const col3Y = useTransform(scrollYProgress, [0.08, 0.35], ['-40px', '50px'])
</script>

<template>
  <section id="threat" class="py-24 md:py-32 relative z-10 border-t border-black/5 dark:border-white/5 bg-slate-100/30 dark:bg-neutral-950/40 backdrop-blur-[2px] transition-colors duration-300 overflow-hidden">
    <!-- Ambient Threat Urgency Glow -->
    <div class="absolute -top-10 left-1/4 w-[500px] h-[400px] bg-rose-500/8 dark:bg-rose-500/12 blur-[140px] rounded-full pointer-events-none -z-10" />
    <div class="absolute bottom-0 right-1/4 w-[450px] h-[350px] bg-amber-500/8 dark:bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />



    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="max-w-3xl space-y-6">
        <!-- Direct Editorial Headline -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }"
        >
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Ancaman Nyata Hawar Daun: Menghancurkan <span class="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-500 dark:from-rose-400 dark:via-amber-400 dark:to-rose-300 bg-clip-text text-transparent">70% Hasil Panen</span> dalam Hitungan Hari
          </h2>
        </Motion>

        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }"
        >
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Patogen <span class="text-slate-900 dark:text-slate-100 font-serif italic font-semibold">Phytophthora infestans</span> dan <span class="text-slate-900 dark:text-slate-100 font-serif italic font-semibold">Alternaria solani</span> berkembang biak sangat cepat di dataran tinggi yang dingin dan berkabut. Keterlambatan identifikasi 1–2 hari sering kali berujung pada kerusakan seluruh bedengan kentang.
          </p>
        </Motion>
      </div>

      <!-- 3 Doppelrand Threat Metric Cards with Separated 3D Parallax Wrappers -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 items-stretch">
        <Motion
          v-for="(stat, index) in threatStats"
          :key="stat.metric"
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }"
          class="h-full transform-gpu"
        >
          <!-- Dedicated Inner Scroll Parallax Motion -->
          <Motion
            :style="{ y: index === 0 ? col1Y : index === 2 ? col3Y : undefined }"
            class="h-full p-2 rounded-3xl bezel-outer hover:border-black/20 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 shadow-sm dark:shadow-none transform-gpu"
          >

            <div class="h-full p-6 rounded-2xl bezel-inner flex flex-col justify-between space-y-6">
              <div class="flex items-center justify-between">
                <div class="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" :class="stat.color">
                  <UIcon :name="stat.icon" class="size-6" />
                </div>
                <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">RISIKO LAPANGAN</span>
              </div>

              <div class="space-y-2">
                <div class="flex items-baseline gap-2 font-mono">
                  <span class="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{{ stat.value }}</span>
                  <span v-if="stat.unit" class="text-xl font-bold text-slate-500 dark:text-slate-400">{{ stat.unit }}</span>
                </div>
                <h3 class="text-base font-semibold text-slate-900 dark:text-slate-200">
                  {{ stat.metric }}
                </h3>
                <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {{ stat.description }}
                </p>
              </div>
            </div>
          </Motion>
        </Motion>
      </div>
    </div>
  </section>
</template>



