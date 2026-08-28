<script setup lang="ts">
import { useScroll, useTransform } from "motion-v";

// Multi-plane ambient radial parallax
const { scrollYProgress } = useScroll();

// Parallax movement calibrated for natural depth without heavy layout shifts
const glowTopY = useTransform(scrollYProgress, [0, 1], ["0px", "120px"]);
const glowMidY = useTransform(scrollYProgress, [0, 1], ["-40px", "90px"]);
const glowBottomY = useTransform(scrollYProgress, [0, 1], ["-80px", "60px"]);
</script>

<template>
  <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
    <!-- Clean Micro-Grid Texture Overlay -->
    <div class="absolute inset-0 bg-grid-subtle opacity-60 dark:opacity-40" />

    <!-- Ambient Radial Botanical Depth Fields (Subtle, GPU-accelerated drift) -->
    <Motion
      :style="{ y: glowTopY }"
      class="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[450px] sm:h-[600px] bg-emerald-500/8 dark:bg-emerald-500/12 rounded-full blur-[140px] pointer-events-none -z-10"
    />

    <Motion
      :style="{ y: glowMidY }"
      class="absolute top-[38%] left-[-10%] sm:left-[5%] w-[450px] sm:w-[700px] h-[450px] sm:h-[650px] bg-teal-500/6 dark:bg-teal-500/10 rounded-full blur-[150px] pointer-events-none -z-10"
    />

    <Motion
      :style="{ y: glowBottomY }"
      class="absolute top-[72%] right-[-10%] sm:right-[5%] w-[500px] sm:w-[750px] h-[500px] sm:h-[700px] bg-emerald-600/7 dark:bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none -z-10"
    />

    <!-- Subtle Top Edge Gradient Fade for Seamless Navbar Blend -->
    <div class="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#F8FAF9] dark:from-[#09090B] to-transparent pointer-events-none" />
  </div>
</template>
