<script setup lang="ts">
import { useScroll, useTransform } from 'motion-v'

// Bento Watermark High-Amplitude Parallax Transform
const { scrollYProgress } = useScroll()
const watermarkY = useTransform(scrollYProgress, [0.25, 0.65], ['-30px', '50px'])
</script>

<template>
  <section id="how-it-works" class="py-24 md:py-32 relative z-10 border-t border-black/5 dark:border-white/5 transition-colors duration-350">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-4 mb-16">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }"
        >
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {{ $t('howItWorks.title') }}
          </h2>
        </Motion>
        <p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          {{ $t('howItWorks.subtitle') }}
        </p>
      </div>

      <!-- Gapless Bento Grid (Clean Modern Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 grid-flow-dense">
        <!-- Step 1 (col-span-8) -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }"
          class="md:col-span-8 h-full transform-gpu"
        >
          <div class="h-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <!-- Large Step Watermark with Scroll Parallax -->
            <Motion
              :style="{ y: watermarkY }"
              class="font-mono text-6xl sm:text-8xl font-bold text-slate-200/60 dark:text-white/5 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
            >
              01
            </Motion>

            <div class="flex items-center justify-between z-10">
              <div class="flex items-center gap-3">
                <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                  01
                </span>
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Langkah 01</span>
              </div>
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/5">
                Kamera Ponsel
              </span>
            </div>

            <!-- Visual preview strip -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-4 z-10">
              <div class="flex items-center gap-3.5">
                <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <UIcon name="i-ph-camera-duotone" class="size-6" />
                </div>
                <div class="text-xs space-y-0.5">
                  <div class="font-bold text-slate-900 dark:text-white">Arahkan Kamera ke Daun</div>
                  <div class="text-slate-600 dark:text-slate-400">Cukup posisikan daun di tengah frame dengan pencahayaan alami</div>
                </div>
              </div>
            </div>

            <div class="z-10">
              <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                {{ $t('howItWorks.step1.title') }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {{ $t('howItWorks.step1.desc') }}
              </p>
            </div>
          </div>
        </Motion>

        <!-- Step 2 (col-span-4) -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }"
          class="md:col-span-4 h-full transform-gpu"
        >
          <div class="h-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <!-- Large Step Watermark with Scroll Parallax -->
            <Motion
              :style="{ y: watermarkY }"
              class="font-mono text-6xl sm:text-8xl font-bold text-slate-200/60 dark:text-white/5 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
            >
              02
            </Motion>

            <div class="flex items-center justify-between z-10">
              <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                02
              </span>
              <span class="px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                On-Device AI
              </span>
            </div>

            <div class="my-auto space-y-1 py-4 z-10">
              <div class="text-3xl sm:text-4xl font-mono font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                <span>&lt; 28</span>
                <span class="text-base text-emerald-600 dark:text-emerald-400 font-mono font-normal">ms</span>
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Kecepatan Komputasi Lokal</div>
            </div>

            <div class="z-10">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                {{ $t('howItWorks.step2.title') }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ $t('howItWorks.step2.desc') }}
              </p>
            </div>
          </div>
        </Motion>

        <!-- Step 3 (col-span-4) -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }"
          class="md:col-span-4 h-full transform-gpu"
        >
          <div class="h-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <!-- Large Step Watermark with Scroll Parallax -->
            <Motion
              :style="{ y: watermarkY }"
              class="font-mono text-6xl sm:text-8xl font-bold text-slate-200/60 dark:text-white/5 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
            >
              03
            </Motion>

            <div class="flex items-center justify-between z-10">
              <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                03
              </span>
              <span class="px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full">
                Hasil Akurat
              </span>
            </div>

            <div class="space-y-2 py-2 z-10 font-mono bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <div class="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 border-b border-slate-200/60 dark:border-white/5 pb-1.5">
                <span>Hawar Dini</span>
                <span class="text-amber-600 dark:text-amber-400 font-bold">98.4%</span>
              </div>
              <div class="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 border-b border-slate-200/60 dark:border-white/5 pb-1.5">
                <span>Hawar Daun</span>
                <span class="text-rose-600 dark:text-rose-400 font-bold">1.2%</span>
              </div>
              <div class="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span>Daun Sehat</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">0.4%</span>
              </div>
            </div>

            <div class="z-10">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                {{ $t('howItWorks.step3.title') }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ $t('howItWorks.step3.desc') }}
              </p>
            </div>
          </div>
        </Motion>

        <!-- Step 4 (col-span-8) -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }"
          class="md:col-span-8 h-full transform-gpu"
        >
          <div class="h-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <!-- Large Step Watermark with Scroll Parallax -->
            <Motion
              :style="{ y: watermarkY }"
              class="font-mono text-6xl sm:text-8xl font-bold text-slate-200/60 dark:text-white/5 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
            >
              04
            </Motion>

            <div class="flex items-center justify-between z-10">
              <div class="flex items-center gap-3">
                <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                  04
                </span>
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Langkah 04</span>
              </div>
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                Solusi Praktis
              </span>
            </div>

            <!-- Recommendation badges -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 z-10">
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                <div class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <UIcon name="i-ph-pill-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{{ $t('howItWorks.step4.badge1Title') }}</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ $t('howItWorks.step4.badge1Desc') }}
                </p>
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                <div class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <UIcon name="i-ph-plant-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{{ $t('howItWorks.step4.badge2Title') }}</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ $t('howItWorks.step4.badge2Desc') }}
                </p>
              </div>
            </div>

            <div class="z-10">
              <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                {{ $t('howItWorks.step4.title') }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {{ $t('howItWorks.step4.desc') }}
              </p>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
