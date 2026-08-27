<script setup lang="ts">
// Static full-page symmetrical multi-tiered harmonic waves & GPU-safe radial glow fields
</script>

<template>
  <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
    <!-- Ambient Radial Field Glows along the full scroll height -->
    <div class="absolute top-[2%] left-[5%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[140px]" />
    <div class="absolute top-[16%] right-[5%] w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[140px]" />
    <div class="absolute top-[32%] left-[8%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-emerald-600/8 dark:bg-emerald-600/12 rounded-full blur-[150px]" />
    <div class="absolute top-[48%] right-[8%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-cyan-500/8 dark:bg-cyan-500/12 rounded-full blur-[150px]" />
    <div class="absolute top-[64%] left-[6%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[140px]" />
    <div class="absolute top-[82%] right-[6%] w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] bg-teal-600/10 dark:bg-teal-600/15 rounded-full blur-[160px]" />

    <!-- Static Symmetrical Harmonic SVG Waves -->
    <svg
      class="w-full h-full transition-opacity duration-350 ease-out opacity-60 dark:opacity-40"
      viewBox="0 0 1440 4800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >

      <defs>
        <!-- Primary Botanical Emerald to Cyan Gradient -->
        <linearGradient id="wave-grad-emerald-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#059669" stop-opacity="0.95" />
          <stop offset="35%" stop-color="#10B981" stop-opacity="1" />
          <stop offset="70%" stop-color="#06B6D4" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0.85" />
        </linearGradient>

        <!-- Secondary Vivid Spring Green Gradient -->
        <linearGradient id="wave-grad-spring" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#34D399" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#10B981" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#059669" stop-opacity="0.8" />
        </linearGradient>

        <!-- Cyan Accent Gradient -->
        <linearGradient id="wave-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#0EA5E9" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.75" />
        </linearGradient>

        <!-- Translucent Left Wave Ribbon Fill -->
        <linearGradient id="wave-fill-left-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.14" />
          <stop offset="60%" stop-color="#06B6D4" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.00" />
        </linearGradient>

        <!-- Translucent Right Wave Ribbon Fill -->
        <linearGradient id="wave-fill-right-grad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.14" />
          <stop offset="60%" stop-color="#10B981" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.00" />
        </linearGradient>
      </defs>

      <!-- ==================== LEFT HARMONIC WAVES ==================== -->
      <!-- Left Wave Ribbon 1 (Filled) -->
      <path
        d="M 0,0 
           C 320,280 260,620 90,920 
           C -40,1180 340,1480 200,1820 
           C 60,2120 280,2420 120,2760 
           C -20,3060 320,3400 160,3750 
           C 20,4050 240,4380 90,4720 
           L 0,4800 Z"
        fill="url(#wave-fill-left-grad)"
      />

      <!-- Left Wave Stroke 1 (Solid Bold 2px) -->
      <path
        d="M 0,0 
           C 320,280 260,620 90,920 
           C -40,1180 340,1480 200,1820 
           C 60,2120 280,2420 120,2760 
           C -20,3060 320,3400 160,3750 
           C 20,4050 240,4380 90,4720"
        stroke="url(#wave-grad-emerald-cyan)"
        stroke-width="2.2"
        stroke-linecap="round"
        class="opacity-80 dark:opacity-90"
      />

      <!-- Left Wave Stroke 2 (Harmonic Offset, Dashed 1.8px) -->
      <path
        d="M 0,70 
           C 380,360 220,700 130,990 
           C 10,1260 390,1540 240,1880 
           C 100,2180 250,2480 160,2830 
           C 40,3130 360,3470 200,3820 
           C 60,4120 280,4450 130,4800"
        stroke="url(#wave-grad-spring)"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-dasharray="10 8"
        class="opacity-75 dark:opacity-85"
      />

      <!-- Left Wave Stroke 3 (Fine Echo 1.2px) -->
      <path
        d="M 0,140 
           C 260,420 180,750 60,1050 
           C -30,1320 310,1600 180,1940 
           C 40,2240 200,2540 100,2890 
           C -10,3190 280,3530 140,3880 
           C 20,4180 200,4510 70,4800"
        stroke="url(#wave-grad-cyan)"
        stroke-width="1.2"
        stroke-linecap="round"
        class="opacity-60 dark:opacity-75"
      />

      <!-- ==================== RIGHT HARMONIC WAVES (SYMMETRICAL) ==================== -->
      <!-- Right Wave Ribbon 1 (Filled) -->
      <path
        d="M 1440,0 
           C 1120,280 1180,620 1350,920 
           C 1480,1180 1100,1480 1240,1820 
           C 1380,2120 1160,2420 1320,2760 
           C 1460,3060 1120,3400 1280,3750 
           C 1420,4050 1200,4380 1350,4720 
           L 1440,4800 Z"
        fill="url(#wave-fill-right-grad)"
      />

      <!-- Right Wave Stroke 1 (Solid Bold 2px) -->
      <path
        d="M 1440,0 
           C 1120,280 1180,620 1350,920 
           C 1480,1180 1100,1480 1240,1820 
           C 1380,2120 1160,2420 1320,2760 
           C 1460,3060 1120,3400 1280,3750 
           C 1420,4050 1200,4380 1350,4720"
        stroke="url(#wave-grad-emerald-cyan)"
        stroke-width="2.2"
        stroke-linecap="round"
        class="opacity-80 dark:opacity-90"
      />

      <!-- Right Wave Stroke 2 (Harmonic Offset, Dashed 1.8px) -->
      <path
        d="M 1440,70 
           C 1060,360 1220,700 1310,990 
           C 1430,1260 1050,1540 1200,1880 
           C 1340,2180 1190,2480 1280,2830 
           C 1400,3130 1080,3470 1240,3820 
           C 1380,4120 1160,4450 1310,4800"
        stroke="url(#wave-grad-spring)"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-dasharray="10 8"
        class="opacity-75 dark:opacity-85"
      />

      <!-- Right Wave Stroke 3 (Fine Echo 1.2px) -->
      <path
        d="M 1440,140 
           C 1180,420 1260,750 1380,1050 
           C 1470,1320 1130,1600 1260,1940 
           C 1400,2240 1240,2540 1340,2890 
           C 1450,3190 1160,3530 1300,3880 
           C 1420,4180 1240,4510 1370,4800"
        stroke="url(#wave-grad-cyan)"
        stroke-width="1.2"
        stroke-linecap="round"
        class="opacity-60 dark:opacity-75"
      />

      <!-- ==================== SECTION CROSSING HARMONIC BRIDGES ==================== -->
      <!-- Wave Cross Connectors at Section Boundaries -->
      <g stroke="url(#wave-grad-emerald-cyan)" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="6 8" class="opacity-50 dark:opacity-65">
        <!-- Hero to Threat Transition (Y: ~750) -->
        <path d="M 90,750 C 450,820 990,680 1350,750" />

        <!-- Threat to Catalog Transition (Y: ~1650) -->
        <path d="M 200,1650 C 520,1580 920,1720 1240,1650" />

        <!-- Catalog to HowItWorks Transition (Y: ~2550) -->
        <path d="M 120,2550 C 480,2620 960,2480 1320,2550" />

        <!-- HowItWorks to TechStats Transition (Y: ~3450) -->
        <path d="M 160,3450 C 500,3380 940,3520 1280,3450" />

        <!-- TechStats to Benefits Transition (Y: ~4150) -->
        <path d="M 90,4150 C 460,4220 980,4080 1350,4150" />
      </g>
    </svg>
  </div>
</template>
