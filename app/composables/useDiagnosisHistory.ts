import { ref, computed } from "vue";
import {
  useDiagnose,
  normalizeDiagnosisLabel,
  type BackendDiagnosisData,
} from "./useDiagnose";

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

// Shared singleton state
const historyRecords = ref<ScanRecord[]>([]);
const isLoaded = ref(false);
const isSyncing = ref(false);

export function useDiagnosisHistory() {
  const { fetchUserDiagnoses, deleteDiagnosisApi } = useDiagnose();

  const saveToStorage = () => {
    if (!import.meta.client) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyRecords.value));
    } catch (e) {
      console.error("Failed to save diagnosis history to localStorage", e);
    }
  };

  const addRecord = (
    newRecord: Omit<ScanRecord, "id" | "timestamp"> & {
      id?: string;
      timestamp?: string;
    },
  ) => {
    const record: ScanRecord = {
      ...newRecord,
      id:
        newRecord.id ||
        "scan-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      timestamp: newRecord.timestamp || new Date().toISOString(),
    };

    // Avoid duplicate IDs if syncing
    const existingIdx = historyRecords.value.findIndex(
      (r) => r.id === record.id,
    );
    if (existingIdx >= 0) {
      historyRecords.value[existingIdx] = record;
    } else {
      historyRecords.value.unshift(record);
    }

    saveToStorage();
    return record;
  };

  const deleteRecord = async (id: string) => {
    historyRecords.value = historyRecords.value.filter((r) => r.id !== id);
    saveToStorage();

    // If ID looks like a UUID from backend, attempt backend deletion
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );
    if (isUuid) {
      await deleteDiagnosisApi(id);
    }
  };

  const clearAllHistory = () => {
    historyRecords.value = [];
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /**
   * Sync records from backend API
   */
  const syncWithBackend = async (t: (key: string) => string) => {
    if (isSyncing.value || !import.meta.client) return;
    isSyncing.value = true;
    try {
      const data = await fetchUserDiagnoses(1, 50);
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const backendRecords: ScanRecord[] = data.results.map((raw) => {
          const norm = normalizeDiagnosisLabel(raw.label);
          const confNum = Number(raw.confidence) || 0;
          const confValue = confNum > 1 ? confNum : confNum * 100;

          return {
            id: raw.id,
            timestamp: raw.createdAt || new Date().toISOString(),
            catalogKey: norm.catalogKey,
            label: t(`catalog.diseases.${norm.catalogKey}.tabName`),
            scientificName: norm.scientificName,
            severityType: norm.severityType,
            severityLabel: t(`catalog.diseases.${norm.catalogKey}.statusBadge`),
            confidence: `${confValue.toFixed(1)}%`,
            confidenceNum: Number(confValue.toFixed(1)),
            latency: "Cloud AI",
            image: raw.imageUrl,
            symptoms: [
              t(`catalog.diseases.${norm.catalogKey}.symptoms.0`),
              t(`catalog.diseases.${norm.catalogKey}.symptoms.1`),
              t(`catalog.diseases.${norm.catalogKey}.symptoms.2`),
            ],
            treatments: [
              {
                title: t(
                  `catalog.diseases.${norm.catalogKey}.treatments.0.title`,
                ),
                detail: t(
                  `catalog.diseases.${norm.catalogKey}.treatments.0.detail`,
                ),
              },
              {
                title: t(
                  `catalog.diseases.${norm.catalogKey}.treatments.1.title`,
                ),
                detail: t(
                  `catalog.diseases.${norm.catalogKey}.treatments.1.detail`,
                ),
              },
            ],
            chemicalSolution: t(
              `catalog.diseases.${norm.catalogKey}.chemicalSolution`,
            ),
            organicSolution: t(
              `catalog.diseases.${norm.catalogKey}.organicSolution`,
            ),
          };
        });

        // Merge: keep non-duplicate local records or replace with backend records
        const backendIds = new Set(backendRecords.map((r) => r.id));
        const nonBackendLocal = historyRecords.value.filter(
          (r) => !backendIds.has(r.id),
        );
        historyRecords.value = [...backendRecords, ...nonBackendLocal];
        saveToStorage();
      }
    } catch (e) {
      console.warn("Could not sync diagnoses with backend:", e);
    } finally {
      isSyncing.value = false;
    }
  };

  const metrics = computed(() => {
    const total = historyRecords.value.length;
    const early = historyRecords.value.filter(
      (r) => r.catalogKey === "earlyBlight",
    ).length;
    const late = historyRecords.value.filter(
      (r) => r.catalogKey === "lateBlight",
    ).length;
    const healthy = historyRecords.value.filter(
      (r) => r.catalogKey === "healthy",
    ).length;

    const healthyRatio =
      total > 0 ? ((healthy / total) * 100).toFixed(1) : "0.0";

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
    isSyncing,
    syncWithBackend,
    addRecord,
    deleteRecord,
    clearAllHistory,
    metrics,
  };
}
