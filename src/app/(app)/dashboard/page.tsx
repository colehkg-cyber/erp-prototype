"use client";

import { useState } from "react";
import {
  Receipt,
  CreditCard,
  AlertTriangle,
  CircleDollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  transactions,
  getMonthlyStats,
  getDailyTrend,
  getCategoryBreakdown,
  getCardById,
  formatAmount,
} from "@/lib/dummy-data";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { ConfidenceBadge } from "@/components/common/confidence-badge";

const stats = getMonthlyStats();
const dailyTrend = getDailyTrend();
const categoryBreakdown = getCategoryBreakdown();
const recentTransactions = transactions.slice(0, 10);

const subTabs = [
  { id: "ai", label: "AI 자동수집" },
  { id: "accounting", label: "회계" },
  { id: "vat", label: "부가가치" },
  { id: "report", label: "리포트" },
];

const summaryCards = [
  {
    title: "이번달 거래건수",
    value: `${stats.totalCount}건`,
    icon: Receipt,
    color: "#005AE0",
    lightColor: "#2563eb",
    change: "+12%",
  },
  {
    title: "총 결제금액",
    value: formatAmount(stats.totalAmount),
    icon: CreditCard,
    color: "#00D4FF",
    lightColor: "#2563eb",
    change: "+8%",
  },
  {
    title: "미분류 건수",
    value: `${stats.unclassifiedCount}건`,
    icon: AlertTriangle,
    color: "#F59E0B",
    lightColor: "#F59E0B",
    change: "-3건",
  },
  {
    title: "예상 과금액",
    value: formatAmount(stats.estimatedBilling),
    icon: CircleDollarSign,
    color: "#10B981",
    lightColor: "#10B981",
    change: `${stats.totalCount} × 40원`,
  },
];

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState("ai");

  const tooltipStyle = isDark
    ? { backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }
    : { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 12 };

  const gridStroke = isDark ? "#1E293B" : "#e5e7eb";
  const tickFill = isDark ? "#64748B" : "#6b7280";

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title="대시보드" description="카드 결제 현황을 한눈에 확인하세요" />

      {/* Sub Tabs */}
      <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-0 border-b border-gray-200 dark:border-white/10">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative min-h-[44px] whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors sm:px-5 ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {summaryCards.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <Card className="border border-gray-200 bg-white shadow-sm dark:border-[#1E2942] dark:bg-[#121A2E] lg:col-span-2">
          <CardHeader className="border-b border-gray-100 dark:border-white/[0.04]">
            <CardTitle className="text-sm font-bold text-gray-900 dark:text-gray-200">
              일별 거래 추이 (최근 30일)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="-mx-2 sm:mx-0">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="date" tick={{ fill: tickFill, fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: tickFill, fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="거래건수"
                    stroke={isDark ? "#005AE0" : "#2563eb"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: isDark ? "#005AE0" : "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border border-gray-200 bg-white shadow-sm dark:border-[#1E2942] dark:bg-[#121A2E]">
          <CardHeader className="border-b border-gray-100 dark:border-white/[0.04]">
            <CardTitle className="text-sm font-bold text-gray-900 dark:text-gray-200">카테고리별 지출</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatAmount(Number(value))} contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {categoryBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-300">{formatAmount(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-[#1E2942] dark:bg-[#121A2E]">
        <CardHeader className="border-b border-gray-100 dark:border-white/[0.04]">
          <CardTitle className="text-sm font-bold text-gray-900 dark:text-gray-200">최근 거래 10건</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-left text-xs text-gray-500 dark:border-[#1E2942] dark:bg-white/[0.02] dark:text-gray-500">
                  <th className="px-3 py-3 font-medium">날짜</th>
                  <th className="px-3 py-3 font-medium">가맹점</th>
                  <th className="hidden px-3 py-3 font-medium sm:table-cell">카드</th>
                  <th className="px-3 py-3 font-medium">카테고리</th>
                  <th className="px-3 py-3 text-right font-medium">금액</th>
                  <th className="hidden px-3 py-3 text-center font-medium sm:table-cell">신뢰도</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => {
                  const card = getCardById(txn.cardId);
                  return (
                    <tr key={txn.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-0 dark:border-[#1E2942]/50 dark:hover:bg-white/[0.02]">
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-400">
                        <span className="hidden sm:inline">{txn.date} {txn.time}</span>
                        <span className="sm:hidden">{txn.date.slice(5)}</span>
                      </td>
                      <td className="max-w-[120px] truncate px-3 py-3 font-medium text-gray-900 sm:max-w-none dark:text-gray-200">
                        {txn.merchantName}
                      </td>
                      <td className="hidden px-3 py-3 text-gray-600 sm:table-cell dark:text-gray-400">
                        {card?.cardCompany ?? "-"}
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className="border-gray-200 text-xs text-gray-600 dark:border-white/10 dark:text-gray-300">
                          {txn.category}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-gray-900 dark:text-white">
                        {formatAmount(txn.amount)}
                      </td>
                      <td className="hidden px-3 py-3 text-center sm:table-cell">
                        <ConfidenceBadge confidence={txn.confidence} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
