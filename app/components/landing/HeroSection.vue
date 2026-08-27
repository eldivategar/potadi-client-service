<script setup lang="ts">
import { ref, computed } from "vue";
import { useScroll, useTransform } from "motion-v";

const { t } = useI18n();

interface LeafSample {
  id: string;
  key: string;
  label: string;
  scientificName: string;
  image: string;
  status: string;
  statusBadgeBg: string;
  statusBadgeText: string;
  confidence: string;
  latency: string;
  summary: string;
}

const samples = computed<LeafSample[]>(() => [
  {
    id: "early-blight",
    key: "earlyBlight",
    label: t("hero.samples.earlyBlight.label"),
    scientificName: "Alternaria solani",
    image: "/images/sample-leafs/early-blight.jpg",
    status: "Hawar Dini Terdeteksi",
    statusBadgeBg: "bg-amber-500",
    statusBadgeText: "text-amber-300",
    confidence: "98.4%",
    latency: "24ms",
    summary: t("hero.samples.earlyBlight.summary"),
  },
  {
    id: "late-blight",
    key: "lateBlight",
    label: t("hero.samples.lateBlight.label"),
    scientificName: "Phytophthora infestans",
    image: "/images/sample-leafs/late-blight.jpg",
    status: "Hawar Daun (Bahaya)",
    statusBadgeBg: "bg-rose-500",
    statusBadgeText: "text-rose-300",
    confidence: "99.1%",
    latency: "22ms",
    summary: t("hero.samples.lateBlight.summary"),
  },
  {
    id: "healthy",
    key: "healthy",
    label: t("hero.samples.healthy.label"),
    scientificName: "Solanum tuberosum L.",
    image: "/images/sample-leafs/healthy-leaf.jpg",
    status: "Daun Sehat Prima",
    statusBadgeBg: "bg-emerald-500",
    statusBadgeText: "text-emerald-300",
    confidence: "99.7%",
    latency: "19ms",
    summary: t("hero.samples.healthy.summary"),
  },
]);

const activeSampleId = ref("early-blight");
const activeSample = computed(
  () =>
    samples.value.find((s) => s.id === activeSampleId.value) ||
    samples.value[0]!,
);

// High-End Multi-Plane Scroll Parallax
const { scrollYProgress } = useScroll();
const glowY = useTransform(scrollYProgress, [0, 0.4], ["0px", "140px"]);
const h1Y = useTransform(scrollYProgress, [0, 0.35], ["0px", "-40px"]);
const scannerY = useTransform(scrollYProgress, [0, 0.45], ["0px", "80px"]);
const imgY = useTransform(scrollYProgress, [0, 0.45], ["-25px", "35px"]);
const badgeTopY = useTransform(scrollYProgress, [0, 0.45], ["0px", "-60px"]);
const badgeBottomY = useTransform(scrollYProgress, [0, 0.45], ["0px", "50px"]);

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<template>
  <section class="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
    <!-- Ambient Background Radial Glow (Parallax Floating Drift) -->
    <Motion :style="{ y: glowY }" class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div
        class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center"
      >
        <!-- Left Column: Value Proposition & CTAs -->
        <div class="lg:col-span-6 space-y-8 text-left">
          <!-- Eyebrow Badge -->
          <Motion
            :initial="{ opacity: 0, y: 16 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{
              duration: 0.5,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
          >
            <UIcon
              name="i-ph-leaf-fill"
              class="size-3.5 text-emerald-600 dark:text-emerald-400"
            />
            <span>Deteksi Daun Kentang Berbasis AI</span>
          </Motion>

          <!-- Headline with Smooth Parallax Lift -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{
              duration: 0.6,
              delay: 0.12,
              ease: [0.16, 1, 0.3, 1],
            }"
          >
            <Motion :style="{ y: h1Y }">
              <h1
                class="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
              >
                {{ $t("hero.headlinePart1") }}
                <span
                  class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent block mt-1"
                  >{{ $t("hero.headlinePart2") }}</span
                >
              </h1>
            </Motion>
          </Motion>

          <!-- Subtext -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{
              duration: 0.6,
              delay: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }"
          >
            <p
              class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl"
            >
              {{ $t("hero.subtext") }}
            </p>
          </Motion>

          <!-- Action CTAs -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{
              duration: 0.6,
              delay: 0.24,
              ease: [0.16, 1, 0.3, 1],
            }"
            class="flex flex-wrap items-center gap-4 pt-1"
          >
            <NuxtLink
              to="/app"
              class="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-full shadow-lg shadow-emerald-600/20 active:scale-95 transition-all group"
            >
              <UIcon name="i-ph-camera-duotone" class="size-5" />
              <span>{{ $t("hero.ctaPrimary") }}</span>
              <UIcon name="i-ph-arrow-up-right-bold" class="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NuxtLink>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-white/10 hover:border-slate-300 rounded-full active:scale-95 transition-all cursor-pointer shadow-sm"
              @click="scrollTo('catalog')"
            >
              <span>{{ $t("hero.ctaSecondary") }}</span>
              <UIcon name="i-ph-caret-down-bold" class="size-4 text-slate-500" />
            </button>
          </Motion>

          <!-- Clean Metrics Row (High Contrast) -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }"
            class="p-3.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm grid grid-cols-3 gap-3"
          >
            <div class="p-3 text-center space-y-0.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent">
              <div class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                Kecepatan
              </div>
              <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                &lt; 28 ms
              </div>
            </div>

            <div class="p-3 text-center space-y-0.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent">
              <div class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                Akurasi
              </div>
              <div class="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                98.6%
              </div>
            </div>

            <div class="p-3 text-center space-y-0.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent">
              <div class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                Akses Lahan
              </div>
              <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                100% Offline
              </div>
            </div>
          </Motion>
        </div>

        <!-- Right Column: Interactive Leaf Specimen Showcase with Multi-Layer Parallax -->
        <div class="lg:col-span-6 relative">
          <!-- Floating Accent Chip Top-Right (Smooth Parallax Up) -->
          <Motion
            :style="{ y: badgeTopY }"
            class="hidden sm:flex absolute -top-4 -right-3 z-30 px-3.5 py-2 rounded-full bg-white/90 dark:bg-neutral-800/90 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-md items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <span class="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% On-Device AI</span>
          </Motion>

          <!-- Floating Accent Chip Bottom-Left (Smooth Parallax Down) -->
          <Motion
            :style="{ y: badgeBottomY }"
            class="hidden sm:flex absolute -bottom-4 -left-3 z-30 px-3.5 py-2 rounded-full bg-white/90 dark:bg-neutral-800/90 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-md items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <UIcon name="i-ph-shield-check-fill" class="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Validasi Riset 98.6%</span>
          </Motion>

          <!-- Entrance & Outer Card Scroll Parallax -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{
              duration: 0.7,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }"
          >
            <Motion :style="{ y: scannerY }">
              <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-neutral-900/95 shadow-xl border border-slate-200/80 dark:border-white/10 space-y-4">
                <!-- Specimen Image Container with Inner Optical Parallax -->
                <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 group shadow-inner">
                  <Motion :style="{ y: imgY }" class="w-full h-full scale-110">
                    <img
                      :src="activeSample.image"
                      :alt="activeSample.label"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Motion>

                  <!-- Top Status Badge (Clear High Contrast) -->
                  <div class="absolute top-3 left-3 z-10">
                    <div class="px-3 py-1.5 rounded-xl bg-black/75 text-white border border-white/20 backdrop-blur-md shadow-md flex items-center gap-2 text-xs font-semibold">
                      <span class="size-2 rounded-full" :class="activeSample.statusBadgeBg" />
                      <span>{{ activeSample.status }}</span>
                    </div>
                  </div>

                  <!-- Bottom Right Confidence Tag -->
                  <div class="absolute bottom-3 right-3 z-10">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-black/75 text-white border border-white/20 backdrop-blur-md">
                      {{ activeSample.confidence }} Akurasi
                    </span>
                  </div>
                </div>

                <!-- 3-Sample Interactive Switcher -->
                <div class="space-y-3 pt-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Uji Sampel Daun:</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-medium">Klik untuk simulasi</span>
                  </div>

                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="sample in samples"
                      :key="sample.id"
                      type="button"
                      class="px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-center cursor-pointer active:scale-95"
                      :class="[
                        activeSample.id === sample.id
                          ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300'
                      ]"
                      @click="activeSampleId = sample.id"
                    >
                      {{ sample.id === 'early-blight' ? 'Hawar Dini' : sample.id === 'late-blight' ? 'Hawar Daun' : 'Daun Sehat' }}
                    </button>
                  </div>

                  <!-- Clean Summary Note -->
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                    <UIcon
                      name="i-ph-info-fill"
                      class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                    />
                    <span class="leading-relaxed">{{ activeSample.summary }}</span>
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
