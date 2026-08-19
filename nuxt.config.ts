export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/og-logo.png' },
        { rel: 'apple-touch-icon', href: '/og-logo.png' }
      ]
    }
  },
  modules: [
    '@nuxt/ui',
    'motion-v/nuxt',
    '@nuxt/image',
    '@nuxt/fonts'
  ],

  icon: {
    mode: 'css',
    clientBundle: {
      scan: true,
      icons: [
        'ph:sun-dim-duotone',
        'ph:moon-stars-duotone'
      ]
    }
  },
  css: ['~/assets/css/main.css']
})