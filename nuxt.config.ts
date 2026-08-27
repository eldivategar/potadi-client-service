export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      authCallbackUrl: ''
    }
  },
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
    '@nuxt/fonts',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      { code: 'id', name: 'Bahasa Indonesia', file: 'id.json', iso: 'id-ID' },
      { code: 'en', name: 'English', file: 'en.json', iso: 'en-US' }
    ],
    defaultLocale: 'id',
    restructureDir: '.',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: false
  },
  icon: {
    mode: 'css',
    clientBundle: {
      scan: true,
      icons: [
        'ph:sun-dim-duotone',
        'ph:moon-stars-duotone',
        'ph:handshake-duotone',
        'ph:envelope-simple-duotone',
        'ph:translate-duotone',
        'ph:globe-duotone',
        'ph:check-bold',
        'ph:caret-down-bold',
        'ph:house-duotone',
        'ph:leaf-duotone',
        'ph:cloud-fog-duotone',
        'ph:warning-bold',
        'ph:shield-warning-duotone',
        'ph:tray-duotone',
        'ph:arrow-right-bold',
        'ph:cube-focus-fill',
      ]
    }
  },
  css: ['~/assets/css/main.css']
})