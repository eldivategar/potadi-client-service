<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-black/8 dark:border-white/10 bg-slate-100/50 dark:bg-[#070709]/60 backdrop-blur-md pt-16 pb-12 text-slate-600 dark:text-slate-400 relative z-10 transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">

      <!-- Top Row: Brand & Status -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 overflow-hidden">
              <img
                src="/og-logo-emerald.png"
                alt="Potadi Logo"
                class="w-full h-full object-contain block dark:hidden"
              />
              <img
                src="/og-logo.png"
                alt="Potadi Logo"
                class="w-full h-full object-contain hidden dark:block"
              />
            </div>
            <span class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Potadi</span>
          </div>


          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Sistem Computer Vision Presisi untuk Deteksi Dini Hawar Daun Kentang di Lahan Pertanian.
          </p>
        </div>
      </div>

      <!-- Middle: Navigation & External Links -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-black/5 dark:border-white/5 text-xs">
        <div class="space-y-3">
          <div class="font-mono text-slate-900 dark:text-slate-300 font-semibold uppercase tracking-wider">NAVIGASI</div>
          <ul class="space-y-2 text-slate-600 dark:text-slate-400">
            <li><a href="#threat" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ancaman Hawar</a></li>
            <li><a href="#catalog" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Katalog Gejala</a></li>
            <li><a href="#how-it-works" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cara Kerja</a></li>
            <li><a href="#tech" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Spesifikasi AI</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="font-mono text-slate-900 dark:text-slate-300 font-semibold uppercase tracking-wider">APLIKASI</div>
          <ul class="space-y-2 text-slate-600 dark:text-slate-400">
            <li><NuxtLink to="/app" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Diagnostic Studio</NuxtLink></li>
            <li><a href="#benefits" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ergonomi Lapangan</a></li>
            <li><a href="#catalog" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Panduan Obat</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="font-mono text-slate-900 dark:text-slate-300 font-semibold uppercase tracking-wider">KLASIFIKASI</div>
          <ul class="space-y-2 text-slate-600 dark:text-slate-400">
            <li><span class="text-amber-500">●</span> Early Blight (A. solani)</li>
            <li><span class="text-rose-500">●</span> Late Blight (P. infestans)</li>
            <li><span class="text-emerald-500">●</span> Healthy Foliage</li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="font-mono text-slate-900 dark:text-slate-300 font-semibold uppercase tracking-wider">KONTAK & KOLABORASI</div>
          <ul class="space-y-2 text-slate-600 dark:text-slate-400">
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
                <span>Kolaborasi & Uji Lahan</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Disclaimer & Copyright -->
      <div class="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-500 dark:text-slate-500">
        <p class="max-w-2xl">
          <span class="font-bold text-slate-700 dark:text-slate-400">Disclaimer:</span> Hasil diagnosa kecerdasan buatan berfungsi sebagai instrumen skrining awal lapangan. Konsultasikan dengan petugas penyuluh pertanian setempat atau uji laboratorium untuk verifikasi fitopatologi lanjutan.
        </p>
        <p class="shrink-0 font-mono">
          &copy; {{ currentYear }} Potadi. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

