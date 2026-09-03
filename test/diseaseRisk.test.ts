import { describe, it, expect } from "bun:test";
import {
  calculateFavorableHours,
  evaluateLateBlightRisk,
  evaluateEarlyBlightRisk,
  calculateOverallRisk,
  getRiskLevel,
} from "../app/utils/diseaseRisk";
import type { HourlyPoint, NormalizedWeatherData } from "../app/types/weather";

describe("Disease Risk Engine (Weather-based heuristic)", () => {
  it("should map scores to correct risk tiers", () => {
    expect(getRiskLevel(85)).toBe("VERY_HIGH");
    expect(getRiskLevel(60)).toBe("HIGH");
    expect(getRiskLevel(35)).toBe("MODERATE");
    expect(getRiskLevel(15)).toBe("LOW");
  });

  it("should calculate consecutive favorable hours window correctly", () => {
    const points: HourlyPoint[] = [
      { time: '1', temperature: 18, humidity: 92, precipitation: 1, rain: 1, dewPoint: 17, weatherCode: 61 },
      { time: '2', temperature: 18, humidity: 92, precipitation: 1, rain: 1, dewPoint: 17, weatherCode: 61 },
      { time: '3', temperature: 18, humidity: 50, precipitation: 0, rain: 0, dewPoint: 10, weatherCode: 1 },
      { time: '4', temperature: 18, humidity: 92, precipitation: 1, rain: 1, dewPoint: 17, weatherCode: 61 },
      { time: '5', temperature: 18, humidity: 92, precipitation: 1, rain: 1, dewPoint: 17, weatherCode: 61 },
      { time: '6', temperature: 18, humidity: 92, precipitation: 1, rain: 1, dewPoint: 17, weatherCode: 61 },
      { time: '7', temperature: 18, humidity: 92, precipitation: 1, rain: 1, dewPoint: 17, weatherCode: 61 },
    ];
    const streak = calculateFavorableHours(points, (p) => p.humidity > 80);
    expect(streak).toBe(4);
  });

  it("should produce VERY_HIGH risk for severe Late Blight weather (18.5°C, 93% RH, rain, 8h streak)", () => {
    const current: NormalizedWeatherData['current'] = {
      temperature: 18.5,
      humidity: 93,
      precipitation: 2.1,
      rain: 2.1,
      dewPoint: 17.5,
      weatherCode: 63,
      windSpeed: 4.2,
    };
    const hourly24h: HourlyPoint[] = Array(12).fill({
      time: '2026-09-03T12:00',
      temperature: 19,
      humidity: 91,
      precipitation: 1.5,
      rain: 1.5,
      dewPoint: 18,
      weatherCode: 61,
    });
    const result = evaluateLateBlightRisk(current, hourly24h);
    expect(result.level).toBe("VERY_HIGH");
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it("should produce VERY_HIGH risk for warm/humid Early Blight weather (26.5°C, 88% RH, rain)", () => {
    const current: NormalizedWeatherData['current'] = {
      temperature: 26.5,
      humidity: 88,
      precipitation: 1.2,
      rain: 1.2,
      dewPoint: 24,
      weatherCode: 61,
      windSpeed: 3.1,
    };
    const hourly24h: HourlyPoint[] = Array(8).fill({
      time: '2026-09-03T12:00',
      temperature: 27,
      humidity: 85,
      precipitation: 0.5,
      rain: 0.5,
      dewPoint: 24,
      weatherCode: 61,
    });
    const result = evaluateEarlyBlightRisk(current, hourly24h);
    expect(result.level).toBe("VERY_HIGH");
    expect(result.score).toBeGreaterThanOrEqual(75);
  });

  it("should classify dry sunny conditions as LOW risk", () => {
    const current: NormalizedWeatherData['current'] = {
      temperature: 22,
      humidity: 45,
      precipitation: 0,
      rain: 0,
      dewPoint: 10,
      weatherCode: 1,
      windSpeed: 6.0,
    };
    const hourly24h: HourlyPoint[] = Array(8).fill({
      time: '2026-09-03T12:00',
      temperature: 23,
      humidity: 42,
      precipitation: 0,
      rain: 0,
      dewPoint: 9,
      weatherCode: 1,
    });
    const overall = calculateOverallRisk(current, hourly24h);
    expect(overall.overallLevel).toBe("LOW");
    expect(overall.overallScore).toBeLessThan(25);
  });
});
