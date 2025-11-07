"use client";

import { useEffect, useMemo, useState } from "react";
import { useAnalyticsStore } from "@/store/mashiat/analytics.store";
import {
  DailyBookingPoint,
  DivisionCoverage,
  GenderStatistic,
  DistrictCoverage,
  SmartInsights,
} from "@/types/mashiat/analytics";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";

const GENDER_COLORS: Record<GenderStatistic["gender"], string> = {
  male: "#4f46e5",
  female: "#0ea5e9",
  other: "#f59e0b",
};

const AnalyticsDashboard = () => {
  const { data, loading, error, fetchAnalytics } = useAnalyticsStore();
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedCenter, setSelectedCenter] = useState<string>("");

  // Fetch analytics for specific metrics on mount
  useEffect(() => {
    const metrics = [
      "daily_bookings",
      "division_coverage",
      "gender_stats",
      "district_coverage",
      "smart_insights",
    ] as const;

    metrics.forEach((metric) => {
      void fetchAnalytics(metric);
    });
  }, [fetchAnalytics]);

  // Debug: Log data when it changes
  useEffect(() => {
    console.log("Analytics Data:", data);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [data, loading, error]);

  const dailyBookings = useMemo(() => {
    const bookings = data.daily_bookings;
    return Array.isArray(bookings) ? (bookings as DailyBookingPoint[]) : [];
  }, [data.daily_bookings]);

  const divisionCoverage = useMemo(() => {
    const coverage = data.division_coverage;
    return Array.isArray(coverage) ? (coverage as DivisionCoverage[]) : [];
  }, [data.division_coverage]);

  const districtCoverage = useMemo(() => {
    const coverage = data.district_coverage;
    return Array.isArray(coverage) ? (coverage as DistrictCoverage[]) : [];
  }, [data.district_coverage]);

  const genderStats = useMemo(() => {
    const stats = data.gender_stats;
    return Array.isArray(stats) ? (stats as GenderStatistic[]) : [];
  }, [data.gender_stats]);

  // Get unique divisions
  const availableDivisions = useMemo(() => {
    const divisions = new Set<string>();
    divisionCoverage.forEach((item) => divisions.add(item.division));
    districtCoverage.forEach((item) => divisions.add(item.division));
    return Array.from(divisions).sort();
  }, [divisionCoverage, districtCoverage]);

  // Get centers for selected division
  const availableCenters = useMemo(() => {
    if (!selectedDivision) return [];
    return districtCoverage
      .filter((item) => item.division === selectedDivision)
      .map((item) => ({
        label: `${item.division} / ${item.district}`,
        district: item.district,
        division: item.division,
        vaccinated: item.vaccinated,
      }))
      .sort((a, b) => a.district.localeCompare(b.district));
  }, [selectedDivision, districtCoverage]);

  // Filter data based on selections
  const filteredDivisionCoverage = useMemo(() => {
    if (!selectedDivision) return divisionCoverage;
    return divisionCoverage.filter((item) => item.division === selectedDivision);
  }, [selectedDivision, divisionCoverage]);

  const filteredDistrictCoverage = useMemo(() => {
    let filtered = districtCoverage;
    if (selectedDivision) {
      filtered = filtered.filter((item) => item.division === selectedDivision);
    }
    if (selectedCenter) {
      const centerData = availableCenters.find((c) => c.label === selectedCenter);
      if (centerData) {
        filtered = filtered.filter(
          (item) => item.division === centerData.division && item.district === centerData.district
        );
      }
    }
    return filtered.map((item) => ({
      ...item,
      label: `${item.division} / ${item.district}`,
    }));
  }, [selectedDivision, selectedCenter, districtCoverage, availableCenters]);

  const filteredDailyBookings = useMemo(() => {
    // For now, daily bookings are global - could be filtered by date range or location in future
    return dailyBookings;
  }, [dailyBookings]);

  const totalVaccinated = useMemo(() => {
    if (selectedCenter) {
      const centerData = availableCenters.find((c) => c.label === selectedCenter);
      return centerData?.vaccinated || 0;
    }
    if (selectedDivision) {
      return filteredDivisionCoverage.reduce((acc, item) => acc + item.vaccinated, 0);
    }
    return divisionCoverage.reduce((acc, item) => acc + item.vaccinated, 0);
  }, [selectedDivision, selectedCenter, filteredDivisionCoverage, divisionCoverage, availableCenters]);

  const globalTotalVaccinated = useMemo(() => {
    return divisionCoverage.reduce((acc, item) => acc + item.vaccinated, 0);
  }, [divisionCoverage]);

  const filteredGenderStats = useMemo(() => {
    if (!genderStats.length) return genderStats;
    
    // If no filter is selected, return global stats
    if (!selectedDivision && !selectedCenter) {
      return genderStats;
    }

    // Calculate the ratio of selected coverage to global coverage
    const coverageRatio = globalTotalVaccinated > 0 
      ? totalVaccinated / globalTotalVaccinated 
      : 0;

    // Scale gender stats proportionally based on coverage ratio
    // This maintains the same gender distribution proportions but scaled to the selected area
    return genderStats.map((item) => ({
      ...item,
      count: Math.round(item.count * coverageRatio),
    }));
  }, [genderStats, selectedDivision, selectedCenter, totalVaccinated, globalTotalVaccinated]);

  const filteredGenderChartData = useMemo(
    () =>
      filteredGenderStats.map((item) => ({
        name: item.gender,
        value: item.count,
        fill: GENDER_COLORS[item.gender],
      })),
    [filteredGenderStats]
  );

  const smartInsights = useMemo(() => {
    const insights = data.smart_insights;
    return insights && typeof insights === "object" && "trends" in insights
      ? (insights as SmartInsights)
      : undefined;
  }, [data.smart_insights]);

  // Show loading state only if we have no data at all
  const hasAnyData = useMemo(() => {
    return (
      dailyBookings.length > 0 ||
      divisionCoverage.length > 0 ||
      districtCoverage.length > 0 ||
      genderStats.length > 0 ||
      smartInsights !== undefined
    );
  }, [dailyBookings.length, divisionCoverage.length, districtCoverage.length, genderStats.length, smartInsights]);

  if (loading && !hasAnyData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !hasAnyData) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
        <p className="text-destructive font-semibold">Error loading analytics</p>
        <p className="text-sm text-destructive/80 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of booking activity, coverage, demographics, and insights.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="division-select" className="text-sm font-medium">
            Division:
          </label>
          <select
            id="division-select"
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedCenter("");
            }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Divisions</option>
            {availableDivisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>

        {selectedDivision && availableCenters.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="center-select" className="text-sm font-medium">
              Center:
            </label>
            <select
              id="center-select"
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Centers</option>
              {availableCenters.map((center) => (
                <option key={center.label} value={center.label}>
                  {center.district}
                </option>
              ))}
            </select>
          </div>
        )}

        {(selectedDivision || selectedCenter) && (
          <button
            type="button"
            onClick={() => {
              setSelectedDivision("");
              setSelectedCenter("");
            }}
            className="ml-auto rounded-lg border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl bg-background/80 p-5 shadow-sm ring-1 ring-border transition-all">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Daily Bookings</h2>
            {(selectedDivision || selectedCenter) && (
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {selectedCenter ? "Center View" : selectedDivision ? "Division View" : "Global View"}
              </span>
            )}
          </div>
          {filteredDailyBookings.length ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredDailyBookings}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.35} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="totalBookings"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </section>

        <section className="rounded-2xl bg-background/80 p-5 shadow-sm ring-1 ring-border transition-all">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Coverage Overview</h2>
            {(selectedDivision || selectedCenter) && (
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {selectedCenter ? "Center View" : selectedDivision ? "Division View" : "Global View"}
              </span>
            )}
          </div>

          {selectedCenter ? (
            <div className="grid gap-3 sm:grid-cols-1">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Total Vaccinated
                </p>
                <p className="mt-2 text-xl font-semibold md:text-2xl">
                  {totalVaccinated.toLocaleString()}
                </p>
              </div>
            </div>
          ) : selectedDivision ? (
            filteredDistrictCoverage.length ? (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredDistrictCoverage}>
                    <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.35} />
                    <XAxis
                      dataKey="district"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-28}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number) => [`${value.toLocaleString()} vaccinated`, "Vaccinated"]}
                    />
                    <Bar dataKey="vaccinated" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available.</p>
            )
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Total Vaccinated
                </p>
                <p className="mt-2 text-xl font-semibold md:text-2xl">
                  {totalVaccinated.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Avg / Division
                </p>
                <p className="mt-2 text-xl font-semibold md:text-2xl">
                  {divisionCoverage.length
                    ? Math.round(totalVaccinated / divisionCoverage.length).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Divisions Covered
                </p>
                <p className="mt-2 text-xl font-semibold md:text-2xl">
                  {divisionCoverage.length}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className={`grid gap-6 ${selectedDivision || selectedCenter ? "xl:grid-cols-2" : "lg:grid-cols-2"}`}>
        <section className="rounded-2xl bg-background/80 p-5 shadow-sm ring-1 ring-border transition-all">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Gender Distribution</h2>
            {(selectedDivision || selectedCenter) && (
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {selectedCenter ? "Center View" : selectedDivision ? "Division View" : "Global View"}
              </span>
            )}
          </div>
          {filteredGenderChartData.length ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={32} iconSize={10} />
                  <Pie
                    data={filteredGenderChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {filteredGenderChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </section>

        {(selectedDivision || selectedCenter) && (
          <section className="rounded-2xl bg-background/80 p-5 shadow-sm ring-1 ring-border transition-all">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {selectedCenter ? "Center Details" : "Division Centers"}
              </h2>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {selectedCenter ? "Center View" : "Division View"}
              </span>
            </div>
            {selectedCenter ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Center Location
                  </p>
                  <p className="mt-2 text-base font-semibold">{selectedCenter}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Total Vaccinated
                  </p>
                  <p className="mt-2 text-xl font-semibold">{totalVaccinated.toLocaleString()}</p>
                </div>
              </div>
            ) : filteredDistrictCoverage.length ? (
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                    <tr className="border-b text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Center</th>
                      <th className="py-2 pr-4 text-right font-medium">Vaccinated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDistrictCoverage.map((item) => (
                      <tr key={item.label} className="border-b last:border-0">
                        <td className="py-2 pr-4">{item.district}</td>
                        <td className="py-2 pr-4 text-right">
                          {item.vaccinated.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available.</p>
            )}
          </section>
        )}
      </div>

      <section className="rounded-2xl bg-background/80 p-5 shadow-sm ring-1 ring-border transition-all">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Smart Insights</h2>
          {(selectedDivision || selectedCenter) && (
            <span className="text-xs font-medium uppercase text-muted-foreground">
              {selectedCenter ? "Center View" : selectedDivision ? "Division View" : "Global View"}
            </span>
          )}
        </div>
        {smartInsights ? (
          <div className="grid gap-6 md:grid-cols-2">
            {!selectedCenter && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide">Trends</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {smartInsights.trends?.map((item, idx) => (
                    <li key={`trend-${idx}`} className="rounded-md bg-muted/40 p-3">
                      <p className="font-medium text-foreground">{item.message}</p>
                      <p>
                        {item.changePercent}% over {item.period}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {selectedCenter ? "Center Capacity" : "Capacity Alerts"}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {smartInsights.capacityAlerts
                  ?.filter((item) =>
                    selectedCenter ? item.utilization >= 70 : true
                  )
                  .map((item, idx) => (
                    <li key={`capacity-${idx}`} className="rounded-md bg-muted/40 p-3">
                      <p className="font-medium text-foreground">{item.centerName}</p>
                      <p>
                        Utilization: {item.utilization}% — {item.status}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>

            {!selectedDivision && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide">Anomalies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {smartInsights.anomalies?.map((item, idx) => (
                    <li key={`anomaly-${idx}`} className="rounded-md bg-muted/40 p-3">
                      <p className="font-medium text-foreground">
                        {item.centerId ? `Center ${item.centerId}` : "Network"}
                      </p>
                      <p>Severity: {item.severity}</p>
                      <p>{item.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!selectedCenter && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide">Forecasts</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {smartInsights.forecasts?.map((item, idx) => (
                    <li key={`forecast-${idx}`} className="rounded-md bg-muted/40 p-3">
                      <p className="font-medium text-foreground">{item.metric}</p>
                      <p>
                        {item.date}: {item.predicted} (Confidence {item.confidence}%)
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No insights available.</p>
        )}
      </section>
    </div>
  );
};

export default AnalyticsDashboard;
