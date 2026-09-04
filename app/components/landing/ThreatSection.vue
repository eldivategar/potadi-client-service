<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const { t, locale } = useI18n();

const threatStats = computed(() => [
  {
    value: t("threat.stat1.value"),
    metric: t("threat.stat1.metric"),
    description: t("threat.stat1.description"),
    icon: "i-ph-warning-octagon-fill",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    border: "border-rose-500/20",
    aurora: "from-rose-500/25 via-rose-500/5 to-transparent",
  },
  {
    value: t("threat.stat2.value"),
    unit: t("threat.stat2.unit"),
    metric: t("threat.stat2.metric"),
    description: t("threat.stat2.description"),
    icon: "i-ph-clock-countdown-fill",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    border: "border-amber-500/20",
    aurora: "from-amber-500/25 via-amber-500/5 to-transparent",
  },
  {
    value: t("threat.stat3.value"),
    unit: t("threat.stat3.unit"),
    metric: t("threat.stat3.metric"),
    description: t("threat.stat3.description"),
    icon: "i-ph-lightning-fill",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    border: "border-emerald-500/20",
    aurora: "from-emerald-500/25 via-emerald-500/5 to-transparent",
  },
]);

const narrativeWords = computed(() => {
  const raw = t("threat.description", {
    p1: "Phytophthora infestans",
    p2: "Alternaria solani",
  });
  return raw.split(/\s+/).map((word) => ({
    text: word,
    isItalic:
      word.includes("Phytophthora") ||
      word.includes("infestans") ||
      word.includes("Alternaria") ||
      word.includes("solani"),
  }));
});

const sectionRef = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

const initGsap = () => {
  if (!import.meta.client) return;
  gsap.registerPlugin(ScrollTrigger);

  ctx?.revert();
  ctx = gsap.context(() => {
    // Scrubbing Text Reveal: Words light up sequentially on scroll
    gsap.fromTo(
      ".threat-word",
      {
        opacity: 0.15,
        filter: "blur(2px)",
        y: 4,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.08,
        ease: "power1.out",
        scrollTrigger: {
          trigger: "#threat-narrative",
          start: "top 85%",
          end: "bottom 48%",
          scrub: 1,
        },
      }
    );

    // Initial entrance reveal for cards
    gsap.fromTo(
      ".threat-card",
      {
        opacity: 0,
        y: 32,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".threat-cards-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Minimalist Velocity Parallax: Internal Aurora Mesh drift inside aligned cards
    gsap.to(".aurora-layer", {
      yPercent: 40,
      ease: "none",
      scrollTrigger: {
        trigger: ".threat-cards-grid",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  }, sectionRef.value ?? undefined);
};

onMounted(() => {
  nextTick(() => {
    initGsap();
  });
});

watch(locale, () => {
  nextTick(() => {
    initGsap();
  });
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <section
    id="threat"
    ref="sectionRef"
    class="py-24 md:py-36 relative z-10 border-t border-slate-200/60 dark:border-white/5 transition-colors duration-350 overflow-hidden"
  >
    <!-- Ambient Threat Urgency Depth Glow -->
    <div
      class="absolute -top-10 left-1/4 w-[450px] h-[350px] bg-rose-500/5 dark:bg-rose-500/10 blur-[140px] rounded-full pointer-events-none -z-10"
    />
    <div
      class="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-amber-500/5 dark:bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="max-w-3xl space-y-6">
        <!-- Direct Editorial Headline -->
        <div>
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 uppercase tracking-wider inline-block mb-3"
          >
            {{ $t("threat.tagRisk") }}
          </span>

          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            {{ $t("threat.headline") }}
            <span
              class="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-500 dark:from-rose-400 dark:via-amber-400 dark:to-rose-300 bg-clip-text text-transparent"
            >
              {{ $t("threat.headlineHighlight") }}
            </span>
            {{ $t("threat.headlineSuffix") }}
          </h2>
        </div>

        <!-- GSAP Scrubbing Text Reveal Paragraph -->
        <div class="py-2">
          <p
            id="threat-narrative"
            class="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed font-normal select-none"
          >
            <span
              v-for="(wordObj, wIdx) in narrativeWords"
              :key="wIdx"
              class="threat-word inline-block mr-1.5 transition-colors duration-200"
              :class="[
                wordObj.isItalic
                  ? 'font-serif italic font-semibold text-emerald-700 dark:text-emerald-400'
                  : '',
              ]"
            >
              {{ wordObj.text }}
            </span>
          </p>
        </div>
      </div>

      <!-- 3 Neatly Aligned Metric Cards with Minimalist Velocity Parallax -->
      <div
        class="threat-cards-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 sm:mt-16 items-stretch"
      >
        <div
          v-for="(stat, index) in threatStats"
          :key="stat.metric"
          class="threat-card h-full transform-gpu group"
        >
          <div
            class="h-full p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 border border-slate-200/80 dark:border-white/10 shadow-lg group-hover:shadow-2xl group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all duration-500 ease-out flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <!-- Velocity Parallax Internal Aurora Mesh -->
            <div
              class="aurora-layer pointer-events-none absolute -top-1/3 -left-1/4 w-[150%] h-[180%] bg-gradient-to-b opacity-40 dark:opacity-20 blur-3xl transition-opacity duration-700 -z-0"
              :class="stat.aurora"
            />

            <div class="flex items-center justify-between relative z-10">
              <div
                class="size-12 rounded-2xl flex items-center justify-center p-2.5 transition-transform duration-500 group-hover:scale-105"
                :class="[stat.bg, stat.color]"
              >
                <UIcon :name="stat.icon" class="size-6" />
              </div>
              <span class="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                0{{ index + 1 }}
              </span>
            </div>

            <div class="space-y-2 relative z-10">
              <div class="flex items-baseline gap-1.5 font-mono">
                <span
                  class="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  {{ stat.value }}
                </span>
                <span
                  v-if="stat.unit"
                  class="text-xl font-bold text-slate-500 dark:text-slate-400"
                >
                  {{ stat.unit }}
                </span>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">
                {{ stat.metric }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ stat.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
