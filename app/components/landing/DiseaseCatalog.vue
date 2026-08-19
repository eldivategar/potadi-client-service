<script setup lang="ts">
import { ref } from 'vue'
import { useScroll, useTransform } from 'motion-v'

interface DiseaseItem {
  id: string
  tabName: string
  name: string
  scientific: string
  statusBadge: string
  statusClass: string
  image: string
  symptoms: string[]
  treatments: {
    title: string
    detail: string
  }[]
  chemicalSolution: string
  organicSolution: string
}

const diseases: DiseaseItem[] = [
  {
    id: 'early-blight',
    tabName: 'Hawar Dini (Early Blight)',
    name: 'Hawar Dini Kentang',
    scientific: 'Alternaria solani',
    statusBadge: 'Tingkat Serangan: Sedang',
    statusClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    image: '/images/sample-leafs/early-blight.jpg',
    symptoms: [
      'Bercak cokelat tua atau kehitaman dengan pola cincin melingkar konsentris (seperti target papan panah).',
      'Area daun di sekitar bercak menguning (klorosis) akibat racun yang diproduksi jamur.',
      'Gejala bermula dari daun tua di bagian bawah kanopi tanaman lalu merambat ke atas.'
    ],
    treatments: [
      {
        title: 'Pemangkasan Selektif',
        detail: 'Pangkas daun tua yang terinfeksi dan buang jauh dari area bedengan untuk menghentikan spora.'
      },
      {
        title: 'Manajemen Kelembapan',
        detail: 'Hindari penyiraman model sprinkler pada sore hari untuk menjaga daun tetap kering di malam hari.'
      }
    ],
    chemicalSolution: 'Fungisida Protektif: Mankozeb 80% WP (2-3 g/L) atau Klorotalonil 75% WP.',
    organicSolution: 'Ekstrak bio-pestisida daun mimba (neem) atau formulasi Trichoderma harzianum.'
  },
  {
    id: 'late-blight',
    tabName: 'Hawar Daun (Late Blight)',
    name: 'Hawar Daun Busuk Basah',
    scientific: 'Phytophthora infestans',
    statusBadge: 'Tingkat Serangan: Bahaya Tinggi (Darurat)',
    statusClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    image: '/images/sample-leafs/late-blight.jpg',
    symptoms: [
      'Bercak basah berwarna hijau keabu-abuan yang dengan cepat berubah menjadi cokelat kehitaman.',
      'Lapisan jamur halus berwarna putih keabuan pada sisi bawah daun saat kondisi berkabut atau lembap.',
      'Lesi menyebar dengan sangat cepat ke tangkai daun, batang, dan membusukkan umbi di dalam tanah.'
    ],
    treatments: [
      {
        title: 'Isolasi & Sanitasi Total',
        detail: 'Cabut dan musnahkan tanaman yang terinfeksi parah. Jangan jadikan kompos!'
      },
      {
        title: 'Perlindungan Bedengan',
        detail: 'Tinggikan guludan tanah di sekitar pangkal batang untuk mencegah spora terbawa air hujan ke umbi.'
      }
    ],
    chemicalSolution: 'Fungisida Sistemik: Metalaksil-M + Mankozeb, Dimetomorf, atau Simoksanil.',
    organicSolution: 'Semprotan larutan tembaga hidroksida (Bordeaux mixture) konsentrasi terukur.'
  },
  {
    id: 'healthy',
    tabName: 'Daun Sehat (Healthy)',
    name: 'Kondisi Daun Prima & Optimal',
    scientific: 'Solanum tuberosum L.',
    statusBadge: 'Status: Bebas Patogen (Aman)',
    statusClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    image: '/images/sample-leafs/healthy-leaf.jpg',
    symptoms: [
      'Permukaan helai daun berwarna hijau segar merata tanpa bercak lesi, nekrosis, atau klorosis.',
      'Tulang daun tampak kokoh, tekstur elastis, dan pembungaan berkembang sempurna.',
      'Fotosintesis optimal untuk pembentukan bobot umbi kentang grade A.'
    ],
    treatments: [
      {
        title: 'Pemupukan Berimbang',
        detail: 'Jaga rasio Kalium (K) dan Fosfor (P) untuk memperkuat dinding sel daun dari penetrasi jamur.'
      },
      {
        title: 'Inspeksi Rutin',
        detail: 'Lakukan pemindaian visual Potadi 3 hari sekali selama musim penghujan di area dataran tinggi.'
      }
    ],
    chemicalSolution: 'Tidak memerlukan fungisida kuratif. Aplikasikan fungisida kontak preventif jika musim hujan tiba.',
    organicSolution: 'Aplikasi pupuk organik cair (POC) hayati dan mikoriza untuk kekebalan alami perakaran.'
  }
]

const activeTab = ref(diseases[0]!)

// Catalog Photo Lens High-Amplitude Parallax
const { scrollYProgress } = useScroll()
const photoFrameY = useTransform(scrollYProgress, [0.15, 0.55], ['-30px', '45px'])
</script>


<template>
  <section id="catalog" class="py-24 md:py-32 relative z-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-4 mb-12">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }"
        >
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Katalog Patologi & Panduan Intervensi Cepat
          </h2>
        </Motion>
        <p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          Kenali perbedaan visual, pola serangan patogen, serta langkah penanganan standar agronomi untuk ketiga kelas daun kentang.
        </p>
      </div>

      <!-- Tab Buttons -->
      <div class="flex flex-wrap gap-2 sm:gap-3 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-neutral-900/90 border border-black/10 dark:border-white/10 max-w-2xl mb-8">
        <button
          v-for="item in diseases"
          :key="item.id"
          type="button"
          class="flex-1 min-w-[140px] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          :class="[
            activeTab.id === item.id
              ? (item.id === 'healthy'
                  ? 'bg-white dark:bg-emerald-500/20 border border-emerald-500/50 text-emerald-900 dark:text-emerald-200 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : item.id === 'early-blight'
                    ? 'bg-white dark:bg-amber-500/20 border border-amber-500/50 text-amber-900 dark:text-amber-200 shadow-sm dark:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-white dark:bg-rose-500/20 border border-rose-500/50 text-rose-900 dark:text-rose-200 shadow-sm dark:shadow-[0_0_20px_rgba(244,63,94,0.25)]')
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
          ]"
          @click="activeTab = item"
        >
          <UIcon
            :name="item.id === 'healthy' ? 'i-ph-check-circle-fill' : 'i-ph-warning-circle-fill'"
            class="size-4"
            :class="
              item.id === 'healthy'
                ? 'text-emerald-600 dark:text-emerald-400'
                : item.id === 'early-blight'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
            "
          />
          <span>{{ item.tabName }}</span>
        </button>
      </div>

      <!-- Active Disease Detail Card (Doppelrand Bezel) -->
      <div class="p-2 sm:p-3 rounded-3xl bezel-outer shadow-md dark:shadow-none">
        <div class="rounded-2xl bezel-inner p-6 sm:p-8 lg:p-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <!-- Left: Leaf Photography & Specs with Optical Reticles & Parallax -->
            <Motion
              :style="{ y: photoFrameY }"
              class="lg:col-span-5 space-y-4"
            >
              <div class="relative aspect-square rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-950 group">
                <img
                  :src="activeTab.image"
                  :alt="activeTab.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <!-- Optical Corner Reticle Marks (+ / ⌐) -->
                <div class="absolute inset-3 pointer-events-none flex flex-col justify-between z-10 opacity-70">
                  <div class="flex justify-between font-mono text-xs text-emerald-400 font-bold select-none">
                    <span>┌</span>
                    <span>┐</span>
                  </div>
                  <div class="flex justify-between font-mono text-xs text-emerald-400 font-bold select-none">
                    <span>└</span>
                    <span>┘</span>
                  </div>
                </div>

                <div class="absolute top-3 left-3 z-20">
                  <span
                    class="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border backdrop-blur-md shadow-md"
                    :class="activeTab.statusClass"
                  >
                    {{ activeTab.statusBadge }}
                  </span>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-1">
                <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">PATOGEN / TAKSONOMI:</div>
                <div class="text-sm font-semibold text-slate-900 dark:text-white font-serif italic">
                  {{ activeTab.scientific }}
                </div>
              </div>
            </Motion>



            <!-- Right: Symptoms & Practical Field Recommendations -->
            <div class="lg:col-span-7 space-y-6">
              <div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {{ activeTab.name }}
                </h3>
                <p class="text-xs font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  DIAGNOSTIC PROTOCOL SPECIFICATION
                </p>
              </div>

              <!-- Symptoms List -->
              <div class="space-y-2">
                <div class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  CIRI VISUAL GEJALA DI LAHAN:
                </div>
                <ul class="space-y-2.5">
                  <li
                    v-for="(symptom, idx) in activeTab.symptoms"
                    :key="idx"
                    class="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <UIcon name="i-ph-caret-right-bold" class="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{{ symptom }}</span>
                  </li>
                </ul>
              </div>

              <!-- Field Actions -->
              <div class="space-y-3 pt-2">
                <div class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  LANGKAH PRAKTIS PETANI:
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(action, idx) in activeTab.treatments"
                    :key="idx"
                    class="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1"
                  >
                    <div class="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                      <UIcon name="i-ph-shield-plus-duotone" class="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{{ action.title }}</span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {{ action.detail }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Fungicide / Solutions Strip -->
              <div class="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                <div class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  FORMULASI OBAT & PENGENDALIAN:
                </div>
                <div class="space-y-2">
                  <div class="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300">
                    <span class="font-bold text-emerald-800 dark:text-emerald-300">Kimiawi / Kimia Sintetik:</span> {{ activeTab.chemicalSolution }}
                  </div>
                  <div class="p-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
                    <span class="font-bold text-slate-900 dark:text-slate-200">Organik / Hayati:</span> {{ activeTab.organicSolution }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

