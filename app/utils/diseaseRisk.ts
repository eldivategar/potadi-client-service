/**
 * Potato Foliar Disease Weather-Risk Heuristic Engine
 *
 * SCIENTIFIC LIMITATION NOTICE:
 * This model performs weather-based disease risk estimation, NOT plant disease diagnosis.
 * Environmental variables indicate whether conditions favor pathogen germination and sporulation.
 * Definitive diagnosis requires physical/visual leaf inspection or Potadi Computer Vision AI.
 */

import type {
  DiseaseRiskLevel,
  DiseaseRiskResult,
  HourlyPoint,
  NormalizedWeatherData,
  WeatherDiseaseRiskPayload,
} from '~/types/weather';

export const RISK_WEIGHTS = {
  temperature: 30,
  humidity: 30,
  precipitation: 20,
  duration: 20,
} as const;

/**
 * Maps a calculated score (0–100) to standard agronomic risk tier.
 */
export function getRiskLevel(score: number): DiseaseRiskLevel {
  if (score >= 75) return 'VERY_HIGH';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MODERATE';
  return 'LOW';
}

/**
 * Calculates the longest consecutive sequence of hours meeting pathogen-favorable conditions.
 */
export function calculateFavorableHours(
  hourlyPoints: HourlyPoint[],
  predicate: (point: HourlyPoint) => boolean
): number {
  let maxConsecutive = 0;
  let currentStreak = 0;

  for (const point of hourlyPoints) {
    if (predicate(point)) {
      currentStreak++;
      if (currentStreak > maxConsecutive) {
        maxConsecutive = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return maxConsecutive;
}

/**
 * Evaluates weather suitability for Late Blight (Phytophthora infestans).
 * Thrives in cool, wet/foggy conditions (10–20°C, RH >= 90%, rain/wet leaves, sustained duration).
 */
export function evaluateLateBlightRisk(
  current: NormalizedWeatherData['current'],
  hourly24h: HourlyPoint[]
): DiseaseRiskResult {
  // 1. Temperature suitability (0 - 30)
  let baseTempScore = 4;
  if (current.temperature >= 18 && current.temperature <= 22) {
    baseTempScore = 30; // Optimal for sporulation & lesion enlargement
  } else if (current.temperature >= 10 && current.temperature < 18) {
    baseTempScore = 24; // Favorable highland range
  } else if (current.temperature > 22 && current.temperature <= 25) {
    baseTempScore = 14; // Marginal
  } else {
    baseTempScore = 4; // < 10°C or > 25°C inhibits rapid late blight
  }

  // 2. Relative Humidity suitability (0 - 30)
  let humidityScore = 0;
  if (current.humidity >= 90) {
    humidityScore = 30; // High sporulation trigger
  } else if (current.humidity >= 80) {
    humidityScore = 20; // Moderate sporulation
  } else if (current.humidity >= 70) {
    humidityScore = 10;
  } else {
    humidityScore = 0; // Dry air restricts zoospore germination
  }

  // 3. Precipitation / Free moisture suitability (0 - 20)
  let precipitationScore = 0;
  const isWetFromDew = current.temperature - current.dewPoint <= 1.5;
  const isFoggyOrRainCode = [45, 48, 51, 53, 55, 61, 63, 65, 80, 81].includes(current.weatherCode);

  if (current.precipitation >= 1.0 || current.rain >= 1.0) {
    precipitationScore = 20; // Strong wetness
  } else if (current.precipitation > 0 || current.rain > 0) {
    precipitationScore = 15; // Active rain
  } else if (isWetFromDew || isFoggyOrRainCode) {
    precipitationScore = 12; // Dew / mist leaf wetness
  } else {
    precipitationScore = 0;
  }

  // Moisture gating: Fungal spores cannot infect dry leaf tissue regardless of temperature.
  const hasMoisture = current.humidity >= 80 || precipitationScore > 0;
  const temperatureScore = hasMoisture
    ? baseTempScore
    : Math.round(baseTempScore * 0.4); // Suppress temperature contribution in dry air

  // 4. Consecutive Favorable Hours Duration (0 - 20)
  // Favorable: temp 10–22°C with high humidity (>=85%) or precipitation
  const favorableHours = calculateFavorableHours(hourly24h, (p) => {
    const tempFavorable = p.temperature >= 10 && p.temperature <= 23;
    const moistureFavorable = p.humidity >= 85 || p.precipitation > 0 || p.rain > 0;
    return tempFavorable && moistureFavorable;
  });

  let durationScore = 0;
  if (favorableHours >= 8) {
    durationScore = 20; // Very favorable prolonged cycle
  } else if (favorableHours >= 6) {
    durationScore = 17; // Significant risk window
  } else if (favorableHours >= 3) {
    durationScore = 12; // Moderate risk window
  } else if (favorableHours >= 1) {
    durationScore = 6;
  } else {
    durationScore = 0;
  }

  const rawScore = temperatureScore + humidityScore + precipitationScore + durationScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));
  const level = getRiskLevel(score);

  // Agronomic Recommendation
  let recommendationKey = 'normal';
  let recommendation = 'Kondisi lingkungan normal. Lakukan inspeksi visual berkala pada bedengan.';
  if (level === 'VERY_HIGH') {
    recommendationKey = 'lateBlightVeryHigh';
    recommendation =
      'Kondisi cuaca sangat mendukung perkembangan Hawar Daun (Late Blight). Periksa kanopi bawah segera, cegah genangan air, dan persiapkan aplikasi fungisida protektif/sistemik terukur.';
  } else if (level === 'HIGH') {
    recommendationKey = 'lateBlightHigh';
    recommendation =
      'Kelembapan dan suhu mendukung penyebaran spora Phytophthora. Hindari irigasi kanopi atas di sore hari dan pantau gejala bercak basah.';
  } else if (level === 'MODERATE') {
    recommendationKey = 'lateBlightModerate';
    recommendation =
      'Potensi risiko sedang terpantau. Pastikan aerasi bedengan lancar dan singkirkan gulma penghambat sirkulasi udara.';
  }

  return {
    diseaseName: 'lateBlight',
    score,
    level,
    favorableHours,
    factors: {
      temperatureScore,
      humidityScore,
      precipitationScore,
      durationScore,
    },
    recommendation,
    recommendationKey,
  };
}

/**
 * Evaluates weather suitability for Early Blight (Alternaria solani).
 * Thrives in warm, humid conditions with alternating wet/dry leaf cycles (24–29°C, RH >= 80%).
 */
export function evaluateEarlyBlightRisk(
  current: NormalizedWeatherData['current'],
  hourly24h: HourlyPoint[]
): DiseaseRiskResult {
  // 1. Temperature suitability (0 - 30)
  let baseTempScore = 4;
  if (current.temperature >= 24 && current.temperature <= 29) {
    baseTempScore = 30; // Highly favorable for Alternaria conidia
  } else if (
    (current.temperature >= 20 && current.temperature < 24) ||
    (current.temperature > 29 && current.temperature <= 32)
  ) {
    baseTempScore = 18; // Moderate
  } else if (current.temperature < 20) {
    baseTempScore = 6; // Low (Alternaria prefers warmer weather than Late Blight)
  } else {
    baseTempScore = 4;
  }

  // 2. Relative Humidity suitability (0 - 30)
  let humidityScore = 0;
  if (current.humidity >= 90) {
    humidityScore = 30; // Very favorable
  } else if (current.humidity >= 80) {
    humidityScore = 24; // Favorable
  } else if (current.humidity >= 70) {
    humidityScore = 15; // Moderate
  } else {
    humidityScore = 0; // Low
  }

  // 3. Precipitation & Wetness suitability (0 - 20)
  let precipitationScore = 0;
  if (current.precipitation >= 1.0 || current.rain >= 1.0) {
    precipitationScore = 20;
  } else if (current.precipitation > 0 || current.rain > 0) {
    precipitationScore = 14;
  } else if (current.humidity >= 80) {
    precipitationScore = 8;
  } else {
    precipitationScore = 0;
  }

  // Moisture gating
  const hasMoisture = current.humidity >= 70 || precipitationScore > 0;
  const temperatureScore = hasMoisture
    ? baseTempScore
    : Math.round(baseTempScore * 0.35);

  // 4. Consecutive Favorable Hours Duration (0 - 20)
  // Favorable: temp 20–32°C with RH >= 75%
  const favorableHours = calculateFavorableHours(hourly24h, (p) => {
    return p.temperature >= 20 && p.temperature <= 32 && (p.humidity >= 75 || p.precipitation > 0);
  });

  let durationScore = 0;
  if (favorableHours >= 8) {
    durationScore = 20;
  } else if (favorableHours >= 6) {
    durationScore = 16;
  } else if (favorableHours >= 3) {
    durationScore = 12;
  } else if (favorableHours >= 1) {
    durationScore = 6;
  } else {
    durationScore = 0;
  }

  const rawScore = temperatureScore + humidityScore + precipitationScore + durationScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));
  const level = getRiskLevel(score);

  let recommendationKey = 'normal';
  let recommendation = 'Kondisi cuaca tidak mendukung infeksi aktif Hawar Dini.';
  if (level === 'VERY_HIGH') {
    recommendationKey = 'earlyBlightVeryHigh';
    recommendation =
      'Kondisi hangat dan lembap sangat memicu konidia Alternaria solani. Pangkas daun tua kanopi bawah dan terapkan fungisida protektif berbahan aktif mankozeb.';
  } else if (level === 'HIGH') {
    recommendationKey = 'earlyBlightHigh';
    recommendation =
      'Suhu hangat dan kelembapan tinggi mendukung pembentukan bercak cincin konsentris. Periksa daun tua bagian bawah tanaman.';
  } else if (level === 'MODERATE') {
    recommendationKey = 'earlyBlightModerate';
    recommendation =
      'Waspadai fluktuasi kelembapan di bedengan yang memicu infeksi bercak kering.';
  }

  return {
    diseaseName: 'earlyBlight',
    score,
    level,
    favorableHours,
    factors: {
      temperatureScore,
      humidityScore,
      precipitationScore,
      durationScore,
    },
    recommendation,
    recommendationKey,
  };
}

/**
 * Combines both pathogen evaluations into an overall weather disease risk payload.
 */
export function calculateOverallRisk(
  current: NormalizedWeatherData['current'],
  hourly24h: HourlyPoint[]
): {
  lateBlight: DiseaseRiskResult;
  earlyBlight: DiseaseRiskResult;
  overallScore: number;
  overallLevel: DiseaseRiskLevel;
  dominantDisease: 'lateBlight' | 'earlyBlight';
  currentRiskLevel: DiseaseRiskLevel;
  forecastRiskLevel24h: DiseaseRiskLevel;
} {
  const lateBlight = evaluateLateBlightRisk(current, hourly24h);
  const earlyBlight = evaluateEarlyBlightRisk(current, hourly24h);

  const overallScore = Math.max(lateBlight.score, earlyBlight.score);
  const overallLevel = getRiskLevel(overallScore);
  const dominantDisease = lateBlight.score >= earlyBlight.score ? 'lateBlight' : 'earlyBlight';

  // Current risk (evaluating factors without duration weighting)
  const currentInstantScore = Math.max(
    lateBlight.factors.temperatureScore + lateBlight.factors.humidityScore + lateBlight.factors.precipitationScore,
    earlyBlight.factors.temperatureScore + earlyBlight.factors.humidityScore + earlyBlight.factors.precipitationScore
  );
  // Scale instant score (max 80) to 0-100
  const normalizedInstant = Math.min(100, Math.round((currentInstantScore / 80) * 100));
  const currentRiskLevel = getRiskLevel(normalizedInstant);

  // Forecast 24h risk is the full score incorporating duration analysis
  const forecastRiskLevel24h = overallLevel;

  return {
    lateBlight,
    earlyBlight,
    overallScore,
    overallLevel,
    dominantDisease,
    currentRiskLevel,
    forecastRiskLevel24h,
  };
}
