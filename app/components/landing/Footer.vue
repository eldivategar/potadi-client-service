<script setup lang="ts">
const currentYear = new Date().getFullYear()

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <footer class="border-t border-slate-200/60 dark:border-white/5 pt-16 pb-12 text-slate-600 dark:text-slate-400 relative z-10 transition-colors duration-350">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
      <!-- Top Row: Brand & Status -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2.5">
          <div class="flex items-center gap-3">
            <div class="size-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
              <img src="/og-logo-emerald.png" alt="Potadi Logo" class="w-full h-full object-contain block dark:hidden" />
              <img src="/og-logo.png" alt="Potadi Logo" class="w-full h-full object-contain hidden dark:block" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Potadi</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 leading-tight">
                Studio
              </span>
            </div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            {{ $t('footer.brandDesc') }}
          </p>
        </div>

        <div class="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{{ $t('footer.engineReady') }}</span>
          <span class="text-slate-300 dark:text-neutral-700">•</span>
          <span>{{ $t('footer.engineModel') }}</span>
        </div>
      </div>

      <!-- Middle: Navigation & External Links -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-slate-200/60 dark:border-white/5 text-xs">
        <div class="space-y-3">
          <div class="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">{{ $t('footer.navHeading') }}</div>
          <ul class="space-y-2.5 text-slate-600 dark:text-slate-400">
            <li><button type="button" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer" @click="scrollTo('threat')">{{ $t('nav.threat') }}</button></li>
            <li><button type="button" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer" @click="scrollTo('catalog')">{{ $t('nav.catalog') }}</button></li>
            <li><button type="button" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer" @click="scrollTo('how-it-works')">{{ $t('nav.howItWorks') }}</button></li>
            <li><button type="button" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer" @click="scrollTo('tech')">{{ $t('nav.tech') }}</button></li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">{{ $t('footer.appHeading') }}</div>
          <ul class="space-y-2.5 text-slate-600 dark:text-slate-400">
            <li><NuxtLink to="/app" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Diagnostic Studio</NuxtLink></li>
            <li><button type="button" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer" @click="scrollTo('benefits')">{{ $t('nav.benefits') }}</button></li>
            <li><button type="button" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer" @click="scrollTo('catalog')">{{ $t('nav.catalog') }}</button></li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">{{ $t('footer.classificationHeading') }}</div>
          <ul class="space-y-2.5 text-slate-600 dark:text-slate-400 font-mono">
            <li class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500 shrink-0" /> Early Blight (A. solani)</li>
            <li class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-rose-500 shrink-0" /> Late Blight (P. infestans)</li>
            <li class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-emerald-500 shrink-0" /> Healthy Foliage</li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">{{ $t('footer.contactHeading') }}</div>
          <ul class="space-y-2.5 text-slate-600 dark:text-slate-400">
            <li>
              <a
                href="mailto:contact@potadi.com"
                class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <UIcon name="i-ph-envelope-simple-duotone" class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span class="truncate">contact@potadi.com</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@potadi.com?subject=Kolaborasi%20Riset%20%26%20Uji%20Lahan%20Potadi"
                class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <UIcon name="i-ph-handshake-duotone" class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{{ $t('footer.collabAction') }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Disclaimer & Copyright -->
      <div class="pt-8 border-t border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-600 dark:text-slate-400 bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 p-4 sm:p-5 rounded-2xl">
        <p class="max-w-2xl text-[11px] leading-relaxed">
          <span class="font-bold text-slate-900 dark:text-slate-200">{{ $t('footer.disclaimerTitle') }}</span> {{ $t('footer.disclaimerText') }}
        </p>
        <p class="shrink-0 font-semibold text-[11px]">
          &copy; {{ currentYear }} Potadi. {{ $t('footer.rightsReserved') }}
        </p>
      </div>
    </div>
  </footer>
</template>
