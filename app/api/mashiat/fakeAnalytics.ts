import { faker } from "@faker-js/faker";
import {
  DailyBookingPoint,
  DivisionCoverage,
  GenderStatistic,
  DistrictCoverage,
  SmartInsights,
  CapacityInsight,
  TrendInsight,
  AnomalyInsight,
  ForecastInsight,
  CenterDoseCoverage,
  SlotUtilization,
  ApiResponse,
} from "@/types/mashiat/analytics";

export function generateFakeAnalytics(
  metric:string 
): ApiResponse<any> {
  let data: any[] | SmartInsights = [];

  switch (metric) {
    case "daily_bookings":
      data = Array.from({ length: 14 }, () => {
        const date = faker.date.recent({ days: 14 }).toISOString().split("T")[0];
        return { date, totalBookings: faker.number.int({ min: 50, max: 300 }) } as DailyBookingPoint;
      });
      break;

    case "division_coverage":
      data = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Barisal", "Rajshahi", "Rangpur", "Mymensingh"].map(
        (division) =>
          ({
            division,
            vaccinated: faker.number.int({ min: 10000, max: 50000 }),
          } as DivisionCoverage)
      );
      break;

    case "district_coverage":
      data = ["Dhaka", "Chittagong", "Khulna"].flatMap((division) =>
        Array.from({ length: 5 }, (_, i) => ({
          division,
          district: `District ${i + 1}`,
          vaccinated: faker.number.int({ min: 2000, max: 20000 }),
        } as DistrictCoverage))
      );
      break;

    case "gender_stats":
      data = ["male", "female", "other"].map(
        (gender) =>
          ({
            gender: gender as "male" | "female" | "other",
            count: faker.number.int({ min: 5000, max: 60000 }),
          } as GenderStatistic)
      );
      break;

    case "slot_utilization":
      data = Array.from({ length: 5 }, (_, i) => {
        const totalCapacity = faker.number.int({ min: 50, max: 200 });
        const totalRemaining = faker.number.int({ min: 0, max: totalCapacity });
        return {
          centerId: `center_${i + 1}`,
          centerName: `Center ${i + 1}`,
          totalCapacity,
          totalRemaining,
          utilization: Math.round(((totalCapacity - totalRemaining) / totalCapacity) * 100),
        } as SlotUtilization;
      });
      break;

    case "coverage":
      data = Array.from({ length: 5 }, (_, i) => ({
        centerId: `center_${i + 1}`,
        centerName: `Center ${i + 1}`,
        dose1: faker.number.int({ min: 5000, max: 20000 }),
        dose2: faker.number.int({ min: 3000, max: 15000 }),
        totalVaccinated: faker.number.int({ min: 10000, max: 40000 }),
      })) as CenterDoseCoverage[];
      break;

    case "smart_insights":
      const trends: TrendInsight[] = Array.from({ length: 3 }, () => ({
        type: "trend",
        message: faker.lorem.sentence(),
        metric: "bookings_per_day",
        changePercent: faker.number.float({ min: -50, max: 50, precision: 0.1 }),
        period: ["week", "month", "7-days"][faker.number.int({ min: 0, max: 2 })],
      }));

      const capacityAlerts: CapacityInsight[] = Array.from({ length: 3 }, (_, i) => ({
        type: "capacity",
        centerId: `center_${i + 1}`,
        centerName: `Center ${i + 1}`,
        utilization: faker.number.int({ min: 50, max: 100 }),
        status: ["normal", "warning", "critical"][faker.number.int({ min: 0, max: 2 })] as
          | "normal"
          | "warning"
          | "critical",
      }));

      const anomalies: AnomalyInsight[] = Array.from({ length: 2 }, () => ({
        type: "anomaly",
        centerId: faker.helpers.arrayElement(["center_1", "center_2", undefined]),
        message: faker.lorem.sentence(),
        severity: ["low", "medium", "high"][faker.number.int({ min: 0, max: 2 })] as "low" | "medium" | "high",
      }));

      const forecasts: ForecastInsight[] = Array.from({ length: 5 }, () => ({
        type: "forecast",
        metric: "bookings_per_day",
        predicted: faker.number.int({ min: 50, max: 500 }),
        date: faker.date.soon({ days: 14 }).toISOString().split("T")[0],
        confidence: faker.number.int({ min: 70, max: 99 }),
      }));

      data = {
        trends,
        capacityAlerts,
        anomalies,
        forecasts,
      } as SmartInsights;

      break;

    default:
      data = [];
  }

  return {
    success: true,
    data,
  } as ApiResponse<any>;
}
