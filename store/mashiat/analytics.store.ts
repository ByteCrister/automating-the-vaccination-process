import { create } from "zustand";
import {
  ApiResponse,
  DailyBookingPoint,
  CenterDoseCoverage,
  SlotUtilization,
  GenderStatistic,
  AgeGroupStat,
  VaccineTypeDistribution,
  DivisionCoverage,
  DistrictCoverage,
  CenterOverview,
  SmartInsights,
  AnalyticsEntry,
} from "@/types/mashiat/analytics";

// ✅ Map metric → Expected Response Type
export type AnalyticsMetricMap = {
  daily_bookings: DailyBookingPoint[];
  dose_coverage: CenterDoseCoverage[];
  slot_utilization: SlotUtilization[];
  gender_stats: GenderStatistic[];
  age_group_stats: AgeGroupStat[];
  vaccine_distribution: VaccineTypeDistribution[];
  division_coverage: DivisionCoverage[];
  district_coverage: DistrictCoverage[];
  center_overview: CenterOverview[];
  smart_insights: SmartInsights;
  raw_entries: AnalyticsEntry[];
};

// ✅ Extract union of metric keys
export type AnalyticsMetric = keyof AnalyticsMetricMap;

// ✅ Store interface
interface AnalyticsState {
  data: {
    [K in AnalyticsMetric]?: AnalyticsMetricMap[K];
  };

  loading: boolean;
  error: string | null;

  fetchAnalytics: <K extends AnalyticsMetric>(metric: K) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  data: {},
  loading: false,
  error: null,

  fetchAnalytics: async (metric) => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(
        `/api/mashiat/mock/analysis?metric=${metric}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch analytics: ${metric} - ${errorText}`);
      }

      const json: ApiResponse<AnalyticsMetricMap[typeof metric]> =
        await res.json();

      if (!json.success) {
        throw new Error(json.error || `Failed to fetch analytics: ${metric}`);
      }

      set({
        data: {
          ...get().data,
          [metric]: json.data,
        },
        loading: false,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error(`Error fetching ${metric}:`, err);
      set({ error: errorMessage, loading: false });
    }
  },
}));
