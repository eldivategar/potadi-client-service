<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const { t, locale } = useI18n();

const containerRef = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

// ponytail: Apple-style CSS sticky + GSAP scrub stacking cards.
// Zero memory leak via scoped gsap.context() and strict revert() on unmount.
const initStackingAnimation = () => {
  if (!import.meta.client) return;
  gsap.registerPlugin(ScrollTrigger);

  ctx?.revert();
  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".stack-card-inner");
    const wrappers = gsap.utils.toArray<HTMLElement>(".stack-card-wrapper");

    cards.forEach((card, idx) => {
      // Animate card down-scaling as the subsequent card stacks over it
      if (idx < cards.length - 1 && wrappers[idx + 1]) {
        gsap.to(card, {
          scale: 0.94,
          yPercent: -3,
          opacity: 0.6,
          filter: "blur(0.8px)",
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrappers[idx + 1],
            start: "top 80%",
            end: "top 28%",
            scrub: 0.6,
          },
        });
      }
    });
  }, containerRef.value ?? undefined);
};

onMounted(() => {
  nextTick(() => {
    initStackingAnimation();
  });
});

watch(locale, () => {
  nextTick(() => {
    initStackingAnimation();
  });
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <section
    id="how-it-works"
    ref="containerRef"
    class="py-28 md:py-40 relative z-10 border-t border-slate-200/60 dark:border-white/5 transition-colors duration-350"
  >
    <!-- Ambient Depth Background -->
    <div
      class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none -z-10"
    />

    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-4 mb-16 sm:mb-24">
        <span
          class="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-wider inline-block"
        >
          {{ $t("howItWorks.step1.phase") }}
        </span>

        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
        >
          {{ $t("howItWorks.title") }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
          {{ $t("howItWorks.subtitle") }}
        </p>
      </div>

      <!-- Apple-Style Stacking Cards Deck -->
      <div class="relative space-y-12 sm:space-y-16 pb-24">
        <!-- CARD 01: CAPTURE -->
        <div class="stack-card-wrapper sticky top-24 sm:top-32">
          <div
            class="stack-card-inner rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl p-6 sm:p-10 lg:p-12 transition-all duration-300 transform-gpu overflow-hidden relative"
          >
            <!-- Watermark Number -->
            <div class="font-mono text-7xl sm:text-9xl font-bold text-slate-100 dark:text-white/5 absolute top-4 right-6 pointer-events-none select-none tracking-tighter">
              01
            </div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="space-y-5 max-w-xl">
                <div class="flex items-center gap-3">
                  <span class="size-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm flex items-center justify-center border border-emerald-500/20">
                    01
                  </span>
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {{ $t("howItWorks.step1.phase") }}
                  </span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/5">
                    {{ $t("howItWorks.step1.badge") }}
                  </span>
                </div>

                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {{ $t("howItWorks.step1.title") }}
                </h3>

                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ $t("howItWorks.step1.desc") }}
                </p>

                <div class="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
                  <UIcon name="i-ph-camera-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span class="font-medium text-slate-900 dark:text-slate-200">{{ $t("howItWorks.step1.viewfinderTitle") }}</span>
                  <span class="text-slate-400 dark:text-slate-500">•</span>
                  <span>{{ $t("howItWorks.step1.viewfinderDesc") }}</span>
                </div>
              </div>

              <!-- Refined Specimen Visual -->
              <div class="w-full md:w-64 sm:h-52 aspect-4/3 md:aspect-auto rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shrink-0 shadow-md relative">
                <img
                  src="/images/sample-leafs/early-blight.jpg"
                  alt="Field Specimen"
                  class="w-full h-full object-cover"
                />
                <div class="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90 flex items-center justify-between">
                  <span>Solanum tuberosum</span>
                  <span class="text-emerald-400">RAW FOCUS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 02: INFERENCE -->
        <div class="stack-card-wrapper sticky top-24 sm:top-32">
          <div
            class="stack-card-inner rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl p-6 sm:p-10 lg:p-12 transition-all duration-300 transform-gpu overflow-hidden relative"
          >
            <div class="font-mono text-7xl sm:text-9xl font-bold text-slate-100 dark:text-white/5 absolute top-4 right-6 pointer-events-none select-none tracking-tighter">
              02
            </div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="space-y-5 max-w-xl">
                <div class="flex items-center gap-3">
                  <span class="size-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm flex items-center justify-center border border-emerald-500/20">
                    02
                  </span>
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {{ $t("howItWorks.step2.phase") }}
                  </span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                    {{ $t("howItWorks.step2.badge") }}
                  </span>
                </div>

                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {{ $t("howItWorks.step2.title") }}
                </h3>

                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ $t("howItWorks.step2.desc") }}
                </p>

                <div class="flex flex-wrap items-center gap-4 pt-1">
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                    <UIcon name="i-ph-cpu-duotone" class="size-4" />
                    <span>ON-DEVICE TENSOR ENGINE</span>
                  </div>
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-300">
                    <UIcon name="i-ph-wifi-slash-duotone" class="size-4" />
                    <span>ZERO CLOUD UPLOAD</span>
                  </div>
                </div>
              </div>

              <!-- High-Contrast Latency Box -->
              <div class="w-full md:w-64 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shrink-0 space-y-2 text-center md:text-left">
                <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {{ $t("howItWorks.step2.metricLabel") }}
                </div>
                <div class="text-4xl lg:text-5xl font-mono font-bold text-slate-900 dark:text-white flex items-baseline justify-center md:justify-start gap-1">
                  <span>&lt; 28</span>
                  <span class="text-lg text-emerald-600 dark:text-emerald-400 font-mono">ms</span>
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400">
                  Akselerasi GPU & NPU lokal
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 03: TRIAGE -->
        <div class="stack-card-wrapper sticky top-24 sm:top-32">
          <div
            class="stack-card-inner rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl p-6 sm:p-10 lg:p-12 transition-all duration-300 transform-gpu overflow-hidden relative"
          >
            <div class="font-mono text-7xl sm:text-9xl font-bold text-slate-100 dark:text-white/5 absolute top-4 right-6 pointer-events-none select-none tracking-tighter">
              03
            </div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="space-y-5 max-w-xl">
                <div class="flex items-center gap-3">
                  <span class="size-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm flex items-center justify-center border border-emerald-500/20">
                    03
                  </span>
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {{ $t("howItWorks.step3.phase") }}
                  </span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    {{ $t("howItWorks.step3.badge") }}
                  </span>
                </div>

                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {{ $t("howItWorks.step3.title") }}
                </h3>

                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ $t("howItWorks.step3.desc") }}
                </p>
              </div>

              <!-- Probability Telemetry Strip -->
              <div class="w-full md:w-72 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shrink-0 space-y-3 font-mono">
                <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60 dark:border-white/10">
                  <span class="text-slate-600 dark:text-slate-300">Hawar Dini (Early)</span>
                  <span class="text-amber-600 dark:text-amber-400 font-bold">98.4%</span>
                </div>
                <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60 dark:border-white/10">
                  <span class="text-slate-600 dark:text-slate-300">Hawar Daun (Late)</span>
                  <span class="text-rose-600 dark:text-rose-400 font-bold">1.2%</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600 dark:text-slate-300">Daun Sehat (Healthy)</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">0.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 04: ACTION -->
        <div class="stack-card-wrapper sticky top-24 sm:top-32">
          <div
            class="stack-card-inner rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl p-6 sm:p-10 lg:p-12 transition-all duration-300 transform-gpu overflow-hidden relative"
          >
            <div class="font-mono text-7xl sm:text-9xl font-bold text-slate-100 dark:text-white/5 absolute top-4 right-6 pointer-events-none select-none tracking-tighter">
              04
            </div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="space-y-5 max-w-xl">
                <div class="flex items-center gap-3">
                  <span class="size-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm flex items-center justify-center border border-emerald-500/20">
                    04
                  </span>
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {{ $t("howItWorks.step4.phase") }}
                  </span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                    {{ $t("howItWorks.step4.badge") }}
                  </span>
                </div>

                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {{ $t("howItWorks.step4.title") }}
                </h3>

                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ $t("howItWorks.step4.desc") }}
                </p>
              </div>

              <!-- Recommendation Dual Badges -->
              <div class="w-full md:w-72 space-y-3 shrink-0">
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
                  <div class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <UIcon name="i-ph-pill-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{{ $t("howItWorks.step4.badge1Title") }}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ $t("howItWorks.step4.badge1Desc") }}
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
                  <div class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <UIcon name="i-ph-plant-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{{ $t("howItWorks.step4.badge2Title") }}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ $t("howItWorks.step4.badge2Desc") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
