/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IndianRupee, ShoppingCart,  } from "lucide-react";
import { useGetAnalyticsData } from "./useAnalytics";
import { Spinner } from "@/shared/components/ui/spinner";

// Types
interface ChartDataPoint {
  month: string;
  revenue: number;
  sales: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalSales: number;
  chartData: ChartDataPoint[];
}



// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

// Custom Tooltip Component
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-4 shadow-lg dark:bg-gray-800">
        <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {entry.name === "Revenue" ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, iconColor, iconBg }: any) => (
  <div className="group rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {value}
        </h2>
      </div>
      <div className={`rounded-full ${iconBg} p-3 transition-transform group-hover:scale-110`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const { data, isPending, isError } = useGetAnalyticsData();

  // Handle loading state
  if (isPending) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Handle error state
  if (isError || !data?.success) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Failed to load analytics</p>
          <p className="mt-2 text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const analytics = data.data as AnalyticsData;
  const chartData = analytics?.chartData ?? [];

  // Prepare data for pie chart (distribution of revenue by month)
  const pieData = chartData.map((item) => ({
    name: item.month,
    value: item.revenue,
    orders: item.sales,
  }));

  // Colors for pie chart
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track your revenue and sales performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 ">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analytics?.totalRevenue || 0)}
          icon={IndianRupee}
          iconColor="text-green-600"
          iconBg="bg-green-100 dark:bg-green-900/30"
        />

        <StatCard
          title="Total Orders"
          value={formatNumber(analytics?.totalSales || 0)}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
      </div>

      {/* Revenue vs Orders Chart */}
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Revenue & Orders Overview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly revenue and sales performance
            </p>
          </div>

          {chartData.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#8884d8]" />
                <span className="text-gray-600 dark:text-gray-400">
                  Total Revenue:{" "}
                  {formatCurrency(chartData.reduce((sum, d) => sum + (d.revenue || 0), 0))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#82ca9d]" />
                <span className="text-gray-600 dark:text-gray-400">
                  Total Orders:{" "}
                  {formatNumber(chartData.reduce((sum, d) => sum + (d.sales || 0), 0))}
                </span>
              </div>
            </div>
          )}
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Start making sales to see your analytics
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
                barGap={8}
                barCategoryGap="20%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                  className="dark:stroke-gray-700"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, className: "dark:fill-gray-400" }}
                  dy={10}
                />

                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, className: "dark:fill-gray-400" }}
                  dx={-10}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, className: "dark:fill-gray-400" }}
                  dx={10}
                />

                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />

                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
                  )}
                />

                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Revenue"
                  fill="#8884d8"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={80}
                  animationDuration={1000}
                  animationBegin={0}
                />

                <Bar
                  yAxisId="right"
                  dataKey="sales"
                  name="Orders"
                  fill="#82ca9d"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={80}
                  animationDuration={1000}
                  animationBegin={300}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Revenue Distribution Pie Chart */}
      {chartData.length > 1 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Revenue Distribution
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue breakdown by month</p>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, props: any) => [
                    formatCurrency(value),
                    `${props.payload.name} - Revenue`,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
