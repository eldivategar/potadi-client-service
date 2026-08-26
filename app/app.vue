<script setup lang="ts">
const { locale, setLocale } = useI18n({ useScope: 'global' });
const langCookie = useCookie<string>("potadi_i18n_lang");

if (
  langCookie.value &&
  (langCookie.value === "en" || langCookie.value === "id")
) {
  if (locale.value !== langCookie.value) {
    setLocale(langCookie.value as "id" | "en");
  }
}

useHead({
  title: "Potadi - Diagnosa Penyakit Daun Kentang dalam Sekejap",
  meta: [
    {
      name: "description",
      content:
        "Sistem diagnostik botanik berbasis Computer Vision untuk mendeteksi penyakit daun kentang (Early Blight, Late Blight, Healthy) secara akurat dan instan tanpa internet.",
    },
    {
      property: "og:title",
      content: "Potadi - Diagnosa Penyakit Daun Kentang dalam Sekejap",
    },
    {
      property: "og:description",
      content:
        "Sistem diagnostik botanik berbasis Computer Vision untuk mendeteksi penyakit daun kentang secara akurat dan 100% offline.",
    },
    { property: "og:image", content: "/og-logo.png" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Potadi - Diagnosa Penyakit Daun Kentang dalam Sekejap",
    },
    {
      name: "twitter:description",
      content:
        "Sistem diagnostik botanik berbasis Computer Vision untuk mendeteksi penyakit daun kentang secara akurat dan 100% offline.",
    },
    { name: "twitter:image", content: "/og-logo.png" },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/og-logo.png" },
    { rel: "apple-touch-icon", href: "/og-logo.png" },
  ],
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <div
      class="min-h-screen bg-[#F8FAF9] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200 font-sans transition-colors duration-300"
    >
      <NuxtPage />
    </div>
  </UApp>
</template>
