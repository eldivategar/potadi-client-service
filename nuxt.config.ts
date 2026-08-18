export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'motion-v/nuxt',
    '@nuxt/image',
    '@nuxt/fonts'
  ],
  icon: {
    mode: 'css',
    clientBundle: {
      scan: true
    }
  },
  css: ['~/assets/css/main.css']
})