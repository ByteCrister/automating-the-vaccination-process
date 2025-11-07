export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}


export interface DailyBookingPoint {
  date: string;         // e.g., "2025-11-07"
  totalBookings: number;
}


export interface CenterDoseCoverage {
  centerId: string;
  centerName?: string;
  dose1: number;
  dose2: number;
  totalVaccinated: number;
}


export interface SlotUtilization {
  centerId: string;
  centerName?: string;

  totalCapacity: number;
  totalRemaining: number;
  utilization: number;   // % (0–100)
}



export interface GenderStatistic {
  gender: "male" | "female" | "other";
  count: number;
}


export interface AgeGroupStat {
  range: string;   // "0-5", "5-12", "18-30", etc.
  count: number;
}


export interface VaccineTypeDistribution {
  vaccineName: string;
  total: number;
}


export interface DivisionCoverage {
  division: string;         // Dhaka, Chattogram, etc.
  vaccinated: number;
}

export interface DistrictCoverage {
  division: string;
  district: string;
  vaccinated: number;
}


export interface CenterOverview {
  centerId: string;
  centerName: string;

  totalVaccinated: number;
  dailyVaccinations: number;
  utilizationRate: number;
}


export interface TrendInsight {
  type: "trend";
  message: string;
  metric: string;
  changePercent: number; // +25%, -15%
  period: string; // "week", "month", "7-days"
}


export interface CapacityInsight {
  type: "capacity";
  centerId: string;
  centerName: string;
  utilization: number; // %
  status: "normal" | "warning" | "critical";
}


export interface AnomalyInsight {
  type: "anomaly";
  centerId?: string;
  message: string;
  severity: "low" | "medium" | "high";
}


export interface ForecastInsight {
  type: "forecast";
  metric: string; // bookings_per_day
  predicted: number;
  date: string;
  confidence: number; // % confidence
}


export interface SmartInsights {
  trends: TrendInsight[];
  capacityAlerts: CapacityInsight[];
  anomalies: AnomalyInsight[];
  forecasts: ForecastInsight[];
}


export interface IAnalyticsEntry {
  centerId?: string;
  metric: string;
  key: string;
  value: number;
  recordedAt?: Date;
}


export interface AnalyticsEntry {
  centerId?: string;
  metric: string;
  key: string;       // date or region key
  value: number;     // aggregated number
  recordedAt?: string;
}
