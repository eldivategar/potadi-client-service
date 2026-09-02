import { ref } from "vue";

export interface BackendDiagnosisData {
  id: string;
  userId: string;
  imageUrl: string;
  label: string;
  confidence: number;
  details?: {
    early_blight?: number;
    late_blight?: number;
    healthy?: number;
    [key: string]: any;
  };
  createdAt: string;
}

export interface BackendDiagnoseResponse {
  success: boolean;
  message: string;
  data: BackendDiagnosisData;
}

export interface BackendDiagnoseListResponse {
  success: boolean;
  message: string;
  data: {
    results: BackendDiagnosisData[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

export interface LeafTreatment {
  title: string;
  detail: string;
}

export interface LeafClassData {
  id: "early-blight" | "late-blight" | "healthy";
  catalogKey: "earlyBlight" | "lateBlight" | "healthy";
  labelKey: string;
  scientificName: string;
  image: string;
  severityKey: string;
  severityType: "moderate" | "emergency" | "safe";
  confidence: string;
  confidenceNum: number;
  latency: string;
  probabilities: {
    earlyBlight: number;
    lateBlight: number;
    healthy: number;
  };
  symptoms: string[];
  treatments: LeafTreatment[];
  chemicalSolution: string;
  organicSolution: string;
}

export const normalizeDiagnosisLabel = (
  rawLabel: string
): {
  id: "early-blight" | "late-blight" | "healthy";
  catalogKey: "earlyBlight" | "lateBlight" | "healthy";
  severityType: "moderate" | "emergency" | "safe";
  scientificName: string;
} => {
  const normalized = (rawLabel || "").toLowerCase().replace(/[-_]/g, "");

  if (normalized.includes("late") || normalized.includes("phytophthora")) {
    return {
      id: "late-blight",
      catalogKey: "lateBlight",
      severityType: "emergency",
      scientificName: "Phytophthora infestans",
    };
  }

  if (normalized.includes("health") || normalized.includes("sehat")) {
    return {
      id: "healthy",
      catalogKey: "healthy",
      severityType: "safe",
      scientificName: "Solanum tuberosum L.",
    };
  }

  // Default to early blight
  return {
    id: "early-blight",
    catalogKey: "earlyBlight",
    severityType: "moderate",
    scientificName: "Alternaria solani",
  };
};

export const useDiagnose = () => {
  const config = useRuntimeConfig();
  const apiBase = ((config.public?.apiBaseUrl as string) || "").replace(/\/+$/, "");

  const isScanning = ref(false);
  const scanError = ref<string | null>(null);

  /**
   * Send image payload to backend diagnosis endpoint: POST /api/v1/diagnose
   */
  const diagnoseImage = async (
    file: File
  ): Promise<{
    raw: BackendDiagnosisData;
    latencyMs: number;
  }> => {
    isScanning.value = true;
    scanError.value = null;

    const startTime = performance.now();

    try {
      // Compress image client-side before network transmission to minimize payload and transfer latency
      const compressedImage = await compressImageFile(file, {
        maxDimension: 1024,
        quality: 0.82,
      });

      const formData = new FormData();
      formData.append("image", compressedImage, compressedImage.name || "leaf-scan.jpg");

      const endpoint = apiBase ? `${apiBase}/api/v1/diagnose` : "/api/v1/diagnose";

      const res = await $fetch<BackendDiagnoseResponse>(endpoint, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const latencyMs = Math.max(1, Math.round(performance.now() - startTime));

      if (!res || !res.success || !res.data) {
        throw new Error(res?.message || "Gagal memperoleh hasil diagnosa dari server.");
      }

      return {
        raw: res.data,
        latencyMs,
      };
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.response?._data?.message ||
        err?.message ||
        "Terjadi kesalahan saat memproses gambar di server AI.";
      scanError.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isScanning.value = false;
    }
  };

  /**
   * Fetch paginated list of user diagnoses from backend: GET /api/v1/diagnose
   */
  const fetchUserDiagnoses = async (
    page: number = 1,
    pageSize: number = 25
  ): Promise<BackendDiagnoseListResponse["data"] | null> => {
    try {
      const endpoint = apiBase
        ? `${apiBase}/api/v1/diagnose?page=${page}&page_size=${pageSize}`
        : `/api/v1/diagnose?page=${page}&page_size=${pageSize}`;

      const res = await $fetch<BackendDiagnoseListResponse>(endpoint, {
        method: "GET",
        credentials: "include",
      });

      if (res && res.success) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.warn("Failed to fetch user diagnoses from backend:", err);
      return null;
    }
  };

  /**
   * Delete a diagnosis record from backend & storage: DELETE /api/v1/diagnose/:id
   */
  const deleteDiagnosisApi = async (id: string): Promise<boolean> => {
    try {
      const endpoint = apiBase
        ? `${apiBase}/api/v1/diagnose/${id}`
        : `/api/v1/diagnose/${id}`;

      const res = await $fetch<{ success: boolean }>(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      return !!res?.success;
    } catch (err) {
      console.warn(`Failed to delete diagnosis ${id} on backend:`, err);
      return false;
    }
  };

  return {
    isScanning,
    scanError,
    diagnoseImage,
    fetchUserDiagnoses,
    deleteDiagnosisApi,
  };
};
