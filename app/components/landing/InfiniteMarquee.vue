<script setup lang="ts">
interface MarqueeItem {
  icon: string
  label: string
  highlight?: string
}

const items: MarqueeItem[] = [
  { icon: 'i-ph-lightning-duotone', label: 'INFERENCE SPEED', highlight: '< 28MS' },
  { icon: 'i-ph-shield-check-duotone', label: 'FIELD ACCURACY', highlight: '98.6%' },
  { icon: 'i-ph-cpu-duotone', label: 'ENGINE', highlight: 'ON-DEVICE TENSOR' },
  { icon: 'i-ph-wifi-slash-duotone', label: 'CONNECTIVITY', highlight: '100% OFFLINE READY' },
  { icon: 'i-ph-leaf-duotone', label: 'PATHOGEN RECOGNITION', highlight: 'PHYTOPHTHORA INFESTANS' },
  { icon: 'i-ph-scan-duotone', label: 'TARGETING', highlight: 'ALTERNARIA SOLANI' },
  { icon: 'i-ph-lock-key-duotone', label: 'FARM DATA PRIVACY', highlight: 'ZERO CLOUD UPLOAD' },
  { icon: 'i-ph-flask-duotone', label: 'PRESCRIPTION', highlight: 'INSTANT DOSAGE PROTOCOL' }
]
</script>

<template>
  <div class="relative w-full overflow-hidden border-y border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-neutral-950/60 backdrop-blur-md py-4 select-none z-10">
    <!-- Edge Fade Gradients for cinematic illusion -->
    <div class="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#FBFDFB] dark:from-[#0B0E0D] to-transparent z-10" />
    <div class="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#FBFDFB] dark:from-[#0B0E0D] to-transparent z-10" />

    <!-- Continuous Marquee Track -->
    <div class="marquee-track flex gap-8 whitespace-nowrap items-center will-change-transform">
      <!-- Group 1 -->
      <div class="flex items-center gap-8 shrink-0">
        <div
          v-for="(item, idx) in items"
          :key="`g1-${idx}`"
          class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-slate-200/60 dark:border-white/10 shadow-xs hover:border-emerald-500/40 transition-colors"
        >
          <span :class="[item.icon, 'size-4 text-emerald-600 dark:text-emerald-400 shrink-0']" />
          <span class="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
            {{ item.label }}
          </span>
          <span v-if="item.highlight" class="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 border border-slate-200/50 dark:border-white/5">
            {{ item.highlight }}
          </span>
          <span class="size-1.5 rounded-full bg-emerald-500/40 animate-pulse ml-1" />
        </div>
      </div>

      <!-- Group 2 (Duplicate for infinite seamless loop) -->
      <div class="flex items-center gap-8 shrink-0" aria-hidden="true">
        <div
          v-for="(item, idx) in items"
          :key="`g2-${idx}`"
          class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-slate-200/60 dark:border-white/10 shadow-xs hover:border-emerald-500/40 transition-colors"
        >
          <span :class="[item.icon, 'size-4 text-emerald-600 dark:text-emerald-400 shrink-0']" />
          <span class="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
            {{ item.label }}
          </span>
          <span v-if="item.highlight" class="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 border border-slate-200/50 dark:border-white/5">
            {{ item.highlight }}
          </span>
          <span class="size-1.5 rounded-full bg-emerald-500/40 animate-pulse ml-1" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 32s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
