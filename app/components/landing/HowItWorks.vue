<script setup lang="ts">
import { useScroll, useTransform } from 'motion-v'

// Bento Watermark High-Amplitude Parallax Transform
const { scrollYProgress } = useScroll()
const watermarkY = useTransform(scrollYProgress, [0.25, 0.65], ['-40px', '60px'])
</script>

<template>
  <section id="how-it-works" class="py-24 md:py-32 relative z-10 bg-slate-100/30 dark:bg-neutral-950/40 backdrop-blur-[2px] border-t border-black/5 dark:border-white/5 transition-colors duration-300">
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

      <!-- Gapless Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 grid-flow-dense">
        <!-- Step 1 (col-span-8) -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }"
          class="md:col-span-8 h-full transform-gpu"
        >
          <div class="h-full p-2 rounded-3xl bezel-outer group hover:border-black/20 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 relative">
            <div class="h-full p-6 sm:p-8 rounded-2xl bezel-inner flex flex-col justify-between space-y-6 relative overflow-hidden">
              <!-- Large Step Watermark with Scroll Parallax -->
              <Motion
                :style="{ y: watermarkY }"
                class="font-mono text-5xl sm:text-7xl font-bold text-emerald-600/15 dark:text-emerald-400/15 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
              >
                01
              </Motion>

              <div class="flex items-center justify-between z-10">
                <div class="flex items-center gap-3">
                  <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20 dark:border-emerald-500/30">
                    01
                  </span>
                  <span class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{{ $t('howItWorks.step1.phase') }}</span>
                </div>
                <span class="px-3 py-1 text-[11px] font-mono rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300">
                  {{ $t('howItWorks.step1.badge') }}
                </span>
              </div>

              <!-- Visual simulation strip -->
              <div class="p-4 rounded-xl bg-slate-100/80 dark:bg-black/50 border border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                <div class="flex items-center gap-3">
                  <div class="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <UIcon name="i-ph-camera-duotone" class="size-6" />
                  </div>
                  <div class="text-xs space-y-0.5">
                    <div class="font-bold text-slate-900 dark:text-white">{{ $t('howItWorks.step1.viewfinderTitle') }}</div>
                    <div class="text-slate-600 dark:text-slate-400">{{ $t('howItWorks.step1.viewfinderDesc') }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <UIcon name="i-ph-crosshair-simple-bold" class="size-3.5" />
                  <span>{{ $t('howItWorks.step1.autoTargeting') }}</span>
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
          <div class="h-full p-2 rounded-3xl bezel-outer group hover:border-black/20 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 relative">
            <div class="h-full p-6 sm:p-8 rounded-2xl bezel-inner flex flex-col justify-between space-y-6 relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-950">
              <!-- Large Step Watermark with Scroll Parallax -->
              <Motion
                :style="{ y: watermarkY }"
                class="font-mono text-5xl sm:text-7xl font-bold text-emerald-600/15 dark:text-emerald-400/15 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
              >
                02
              </Motion>

              <div class="flex items-center justify-between z-10">
                <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20 dark:border-emerald-500/30">
                  02
                </span>
                <span class="px-2.5 py-1 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 rounded-md border border-emerald-500/20 font-semibold">
                  {{ $t('howItWorks.step2.badge') }}
                </span>
              </div>

              <div class="my-auto space-y-2 py-4 z-10">
                <div class="text-3xl sm:text-4xl font-mono font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  <span>&lt; 28</span>
                  <span class="text-base text-emerald-600 dark:text-emerald-400 font-sans">ms</span>
                </div>
                <div class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ $t('howItWorks.step2.metricLabel') }}</div>
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
          <div class="h-full p-2 rounded-3xl bezel-outer group hover:border-black/20 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 relative">
            <div class="h-full p-6 sm:p-8 rounded-2xl bezel-inner flex flex-col justify-between space-y-6 relative overflow-hidden">
              <!-- Large Step Watermark with Scroll Parallax -->
              <Motion
                :style="{ y: watermarkY }"
                class="font-mono text-5xl sm:text-7xl font-bold text-emerald-600/15 dark:text-emerald-400/15 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
              >
                03
              </Motion>

              <div class="flex items-center justify-between z-10">
                <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20 dark:border-emerald-500/30">
                  03
                </span>
                <span class="px-2.5 py-1 text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-md border border-amber-500/20 font-semibold">
                  {{ $t('howItWorks.step3.badge') }}
                </span>
              </div>

              <div class="space-y-2 py-2 z-10">
                <div class="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 border-b border-black/5 dark:border-white/5 pb-1.5">
                  <span>EARLY BLIGHT</span>
                  <span class="text-amber-600 dark:text-amber-400 font-bold">98.4%</span>
                </div>
                <div class="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 border-b border-black/5 dark:border-white/5 pb-1.5">
                  <span>LATE BLIGHT</span>
                  <span class="text-rose-600 dark:text-rose-400 font-bold">1.2%</span>
                </div>
                <div class="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span>HEALTHY LEAF</span>
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
          <div class="h-full p-2 rounded-3xl bezel-outer group hover:border-black/20 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 relative">
            <div class="h-full p-6 sm:p-8 rounded-2xl bezel-inner flex flex-col justify-between space-y-6 relative overflow-hidden">
              <!-- Large Step Watermark with Scroll Parallax -->
              <Motion
                :style="{ y: watermarkY }"
                class="font-mono text-5xl sm:text-7xl font-bold text-emerald-600/15 dark:text-emerald-400/15 absolute top-2 right-4 sm:right-6 pointer-events-none select-none tracking-tighter transform-gpu"
              >
                04
              </Motion>

              <div class="flex items-center justify-between z-10">
                <div class="flex items-center gap-3">
                  <span class="size-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20 dark:border-emerald-500/30">
                    04
                  </span>
                  <span class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{{ $t('howItWorks.step4.phase') }}</span>
                </div>
                <span class="px-3 py-1 text-[11px] font-mono rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  {{ $t('howItWorks.step4.badge') }}
                </span>
              </div>

              <!-- Recommendation badges -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 z-10">
                <div class="p-3.5 rounded-xl bg-slate-100/80 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1">
                  <div class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <UIcon name="i-ph-pill-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{{ $t('howItWorks.step4.badge1Title') }}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-400">
                    {{ $t('howItWorks.step4.badge1Desc') }}
                  </p>
                </div>
                <div class="p-3.5 rounded-xl bg-slate-100/80 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1">
                  <div class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <UIcon name="i-ph-plant-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{{ $t('howItWorks.step4.badge2Title') }}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-400">
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
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
