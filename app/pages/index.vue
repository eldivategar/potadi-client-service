<script setup lang="ts">
import LandingNavbar from '~/components/landing/Navbar.vue'
import LandingBackgroundWaves from '~/components/landing/BackgroundWaves.vue'
import LandingHeroSection from '~/components/landing/HeroSection.vue'
import LandingThreatSection from '~/components/landing/ThreatSection.vue'
import LandingDiseaseCatalog from '~/components/landing/DiseaseCatalog.vue'
import LandingHowItWorks from '~/components/landing/HowItWorks.vue'
import LandingTechStats from '~/components/landing/TechStats.vue'
import LandingBenefits from '~/components/landing/Benefits.vue'
import LandingCtaBanner from '~/components/landing/CtaBanner.vue'
import LandingFooter from '~/components/landing/Footer.vue'

useHead({
  title: 'Potadi - Diagnosa Penyakit Daun Kentang dalam Sekejap',
  meta: [
    {
      name: 'description',
      content:
        'Sistem diagnostik botanik berbasis Computer Vision untuk mendeteksi penyakit daun kentang (Early Blight, Late Blight, Healthy) secara akurat dan instan tanpa internet.'
    },
    {
      property: 'og:title',
      content: 'Potadi - Diagnosa Penyakit Daun Kentang dalam Sekejap'
    },
    {
      property: 'og:description',
      content:
        'Deteksi dini hawar daun kentang langsung di lahan pertanian dengan akurasi 98.6% dan latensi < 28ms.'
    }
  ]
})
</script>

<template>
  <main class="overflow-x-hidden w-full max-w-full min-h-screen bg-[#EEF3F0] dark:bg-[#111413] text-slate-900 dark:text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200 transition-colors duration-350 ease-out">
    <!-- Full-Page Symmetrical Background Harmonic Waves & Neumorphic Ambience -->
    <LandingBackgroundWaves />

    <!-- Floating Island Navbar -->
    <LandingNavbar />

    <!-- Attention: Asymmetric Split Hero & Leaf Scanner Demo -->
    <LandingHeroSection />

    <!-- Interest: Problem & 70% Harvest Threat Narrative -->
    <LandingThreatSection />

    <!-- Interest: Interactive Pathology & Disease Catalog -->
    <LandingDiseaseCatalog />

    <!-- Desire: Gapless Bento Grid 4-Step Field Workflow -->
    <LandingHowItWorks />

    <!-- Desire: Precision Monospace AI Telemetry & Specs -->
    <LandingTechStats />

    <!-- Desire: Field Ergonomics & Farmer Benefits -->
    <LandingBenefits />

    <!-- Action: High-Contrast Botanical Emerald CTA Banner -->
    <LandingCtaBanner />

    <!-- Minimalist Split System Footer -->
    <LandingFooter />
  </main>
</template>

