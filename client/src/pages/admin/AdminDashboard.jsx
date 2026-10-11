import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api.js";

export default function AdminDashboard() {
  // Fetch Admin Analytics Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await API.get("/admin/stats")).data.data.stats,
  });

  // Fetch recent novels or inventory summary count
  const { data: novelsData } = useQuery({
    queryKey: ["novels-catalog"],
    queryFn: async () => (await API.get("/novels")).data.data.novels,
  });

  const totalNovelsCount = novelsData?.length || 0;

  // Extract sales history array from MongoDB data (fallback to mock trend if empty)
  const salesHistory = statsData?.salesHistory || [
    { label: "Mon", amount: 0 },
    { label: "Tue", amount: 0 },
    { label: "Wed", amount: 0 },
    { label: "Thu", amount: 0 },
    { label: "Fri", amount: 0 },
    { label: "Sat", amount: 0 },
    { label: "Sun", amount: 0 },
  ];

  // Calculate max amount for proportional bar/line scaling
  const maxSales = Math.max(...salesHistory.map((item) => item.amount), 100);

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-stone-800 pb-4">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-200">
          Admin Console
        </span>
        <h1 className="text-3xl font-serif text-amber-100 mt-1">
          Dashboard & Metrics
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          Quick overview of storefront metrics, inventory, and user activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-stone-900/50 border border-stone-800/80 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Total Novels
          </span>
          <p className="text-2xl font-bold text-amber-200">
            {statsLoading ? "—" : totalNovelsCount}
          </p>
        </div>
        <div className="bg-stone-900/50 border border-stone-800/80 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Total Users
          </span>
          <p className="text-2xl font-bold text-amber-200">
            {statsLoading ? "—" : statsData?.totalUsers || 0}
          </p>
        </div>
        <div className="bg-stone-900/50 border border-stone-800/80 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Active Users
          </span>
          <p className="text-2xl font-bold text-amber-200">
            {statsLoading ? "—" : statsData?.activeUsers || 0}
          </p>
        </div>
        <div className="bg-stone-900/50 border border-stone-800/80 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Total Orders
          </span>
          <p className="text-2xl font-bold text-amber-200">
            {statsLoading ? "—" : statsData?.totalOrders || 0}
          </p>
        </div>
      </div>

      {/* Sales Overview Graph with Real MongoDB Data */}
      <div className="bg-stone-900/50 border border-stone-800/80 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif text-amber-100">
            Sales Overview Performance
          </h2>
          <span className="text-xs font-mono text-stone-400">
            Live MongoDB Aggregation
          </span>
        </div>

        {statsLoading ? (
          <div className="w-full h-64 bg-stone-900 animate-pulse rounded flex items-center justify-center text-xs text-stone-500 font-mono">
            Loading sales metrics...
          </div>
        ) : (
          <div className="w-full h-64 flex flex-col justify-between pt-4">
            {/* Graph Visual Area */}
            <div className="relative flex-1 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-stone-800 pb-2">
              {salesHistory.map((item, index) => {
                const heightPercentage = Math.round(
                  (item.amount / maxSales) * 100,
                );
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 bg-stone-950 border border-stone-700 text-amber-200 text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      ${item.amount.toFixed(2)}
                    </div>

                    {/* Bar Fill */}
                    <div
                      style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                      className="w-full max-w-10 bg-linear-to-t from-amber-600/40 to-amber-400 rounded-t transition-all duration-500 group-hover:from-amber-500 group-hover:to-amber-300"
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between gap-2 sm:gap-4 px-2 pt-3">
              {salesHistory.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
