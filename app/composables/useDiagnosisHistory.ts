import { ref, computed } from "vue";

export interface ScanRecord {
  id: string;
  timestamp: string; // ISO string e.g. "2026-08-20T11:15:00.000Z"
  catalogKey: "earlyBlight" | "lateBlight" | "healthy";
  label: string;
  scientificName: string;
  severityType: "moderate" | "emergency" | "safe";
  severityLabel: string;
  confidence: string; // e.g. "98.4%"
  confidenceNum: number; // e.g. 98.4
  latency: string; // e.g. "24 ms"
  image: string;
  symptoms: string[];
  treatments: { title: string; detail: string }[];
  chemicalSolution: string;
  organicSolution: string;
}

const STORAGE_KEY = "potadi_scan_history_v1";

const defaultSeedRecords: ScanRecord[] = [
  {
    id: "seed-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    catalogKey: "earlyBlight",
    label: "Hawar Dini (Early Blight)",
    scientificName: "Alternaria solani",
    severityType: "moderate",
    severityLabel: "Tingkat Serangan: Sedang",
    confidence: "98.4%",
    confidenceNum: 98.4,
    latency: "24 ms",
    image: "/images/sample-leafs/early-blight.jpg",
    symptoms: [
      "Bercak cokelat tua atau kehitaman dengan pola cincin melingkar konsentris (seperti target papan panah).",
      "Area daun di sekitar bercak menguning (klorosis) akibat racun yang diproduksi jamur.",
      "Gejala bermula dari daun tua di bagian bawah kanopi tanaman lalu merambat ke atas.",
    ],
    treatments: [
      {
        title: "Pemangkasan Selektif",
        detail: "Pangkas daun tua yang terinfeksi dan buang jauh dari area bedengan untuk menghentikan spora.",
      },
      {
        title: "Manajemen Kelembapan",
        detail: "Hindari penyiraman model sprinkler pada sore hari untuk menjaga daun tetap kering di malam hari.",
      },
    ],
    chemicalSolution: "Fungisida Protektif: Mankozeb 80% WP (2-3 g/L) atau Klorotalonil 75% WP.",
    organicSolution: "Ekstrak bio-pestisida daun mimba (neem) atau formulasi Trichoderma harzianum.",
  },
  {
    id: "seed-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    catalogKey: "healthy",
    label: "Daun Sehat (Healthy Foliage)",
    scientificName: "Solanum tuberosum L.",
    severityType: "safe",
    severityLabel: "Status: Bebas Patogen (Aman)",
    confidence: "99.7%",
    confidenceNum: 99.7,
    latency: "19 ms",
    image: "/images/sample-leafs/healthy-leaf.jpg",
    symptoms: [
      "Permukaan helai daun berwarna hijau segar merata tanpa bercak lesi, nekrosis, atau klorosis.",
      "Tulang daun tampak kokoh, tekstur elastis, dan pembungaan berkembang sempurna.",
      "Fotosintesis optimal untuk pembentukan bobot umbi kentang grade A.",
    ],
    treatments: [
      {
        title: "Pemupukan Berimbang",
        detail: "Jaga rasio Kalium (K) dan Fosfor (P) untuk memperkuat dinding sel daun dari penetrasi jamur.",
      },
      {
        title: "Inspeksi Rutin",
        detail: "Lakukan pemindaian visual Potadi 3 hari sekali selama musim penghujan di area dataran tinggi.",
      },
    ],
    chemicalSolution: "Tidak memerlukan fungisida kuratif. Aplikasikan fungisida kontak preventif jika musim hujan tiba.",
    organicSolution: "Aplikasi pupuk organik cair (POC) hayati dan mikoriza untuk kekebalan alami perakaran.",
  },
  {
    id: "seed-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
    catalogKey: "lateBlight",
    label: "Hawar Daun (Late Blight)",
    scientificName: "Phytophthora infestans",
    severityType: "emergency",
    severityLabel: "Tingkat Serangan: Bahaya Tinggi (Darurat)",
    confidence: "99.1%",
    confidenceNum: 99.1,
    latency: "22 ms",
    image: "/images/sample-leafs/late-blight.jpg",
    symptoms: [
      "Bercak basah berwarna hijau keabu-abuan yang dengan cepat berubah menjadi cokelat kehitaman.",
      "Lapisan jamur halus berwarna putih keabuan pada sisi bawah daun saat kondisi berkabut atau lembap.",
      "Lesi menyebar dengan sangat cepat ke tangkai daun, batang, dan membusukkan umbi di dalam tanah.",
    ],
    treatments: [
      {
        title: "Isolasi & Sanitasi Total",
        detail: "Cabut dan musnahkan tanaman yang terinfeksi parah. Jangan jadikan kompos!",
      },
      {
        title: "Perlindungan Bedengan",
        detail: "Tinggikan guludan tanah di sekitar pangkal batang untuk mencegah spora terbawa air hujan ke umbi.",
      },
    ],
    chemicalSolution: "Fungisida Sistemik: Metalaksil-M + Mankozeb, Dimetomorf, atau Simoksanil.",
    organicSolution: "Semprotan larutan tembaga hidroksida (Bordeaux mixture) konsentrasi terukur.",
  },
];

// Shared singleton state
const historyRecords = ref<ScanRecord[]>([]);
const isLoaded = ref(false);

export function useDiagnosisHistory() {
  const initHistory = () => {
    if (!import.meta.client || isLoaded.value) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        historyRecords.value = JSON.parse(stored);
      } else {
        historyRecords.value = [...defaultSeedRecords];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyRecords.value));
      }
    } catch {
      historyRecords.value = [...defaultSeedRecords];
    }
    isLoaded.value = true;
  };

  const saveToStorage = () => {
    if (!import.meta.client) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyRecords.value));
    } catch (e) {
      console.error("Failed to save diagnosis history to localStorage", e);
    }
  };

  const addRecord = (
    newRecord: Omit<ScanRecord, "id" | "timestamp"> & { timestamp?: string }
  ) => {
    initHistory();
    const record: ScanRecord = {
      ...newRecord,
      id: "scan-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      timestamp: newRecord.timestamp || new Date().toISOString(),
    };
    historyRecords.value.unshift(record);
    saveToStorage();
    return record;
  };

  const deleteRecord = (id: string) => {
    initHistory();
    historyRecords.value = historyRecords.value.filter((r) => r.id !== id);
    saveToStorage();
  };

  const clearAllHistory = () => {
    historyRecords.value = [];
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const metrics = computed(() => {
    const total = historyRecords.value.length;
    const early = historyRecords.value.filter((r) => r.catalogKey === "earlyBlight").length;
    const late = historyRecords.value.filter((r) => r.catalogKey === "lateBlight").length;
    const healthy = historyRecords.value.filter((r) => r.catalogKey === "healthy").length;

    const healthyRatio = total > 0 ? ((healthy / total) * 100).toFixed(1) : "0.0";

    return {
      totalScanned: total,
      healthyCount: healthy,
      earlyBlightCount: early,
      lateBlightCount: late,
      healthyRatio: healthyRatio + "%",
      recentDetections: historyRecords.value.slice(0, 3),
    };
  });

  return {
    historyRecords,
    isLoaded,
    initHistory,
    addRecord,
    deleteRecord,
    clearAllHistory,
    metrics,
  };
}
