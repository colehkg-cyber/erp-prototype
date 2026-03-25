"use client";

import { CircleDollarSign, Receipt, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMonthlyStats, getBillingHistory, formatAmount } from "@/lib/dummy-data";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/common/page-header";

const stats = getMonthlyStats();
const billingHistory = getBillingHistory();

const chartData = [...billingHistory].reverse().map((b) => ({
  month: b.month.replace("2026-", "").replace("2025-", "") + "월",
  amount: b.totalAmount,
  count: b.transactionCount,
}));

export default function BillingPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const tooltipStyle = isDark
    ? { backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }
    : { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 12 };

  const gridStroke = isDark ? "#1E293B" : "#e5e7eb";
  const tickFill = isDark ? "#64748B" : "#6b7280";
  const barFill = isDark ? "#005AE0" : "#2563eb";

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title="과금현황" description="건당 과금 현황과 월별 이용료를 확인합니다" />

      {/* Current Month Billing */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 dark:border-[#005AE0]/20 dark:from-[#121A2E] dark:to-[#0A1628]">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2.5 sm:p-3 dark:bg-[#005AE0]/15">
              <Calculator className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6 dark:text-[#005AE0]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">이번달 예상 과금</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                  {formatAmount(stats.estimatedBilling)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 sm:mt-2 dark:text-gray-500">
                <span className="text-blue-600 dark:text-[#00D4FF]">{stats.totalCount}건</span> × 40원/건
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card className="border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#121A2E]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-blue-600 dark:text-[#00D4FF]" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">이번달 수집건수</p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">{stats.totalCount}건</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#121A2E]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">건당 단가</p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">40원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#121A2E]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-blue-600 dark:text-[#005AE0]" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">누적 과금 (6개월)</p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                  {formatAmount(billingHistory.reduce((s, b) => s + b.totalAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#121A2E]">
        <CardHeader>
          <CardTitle className="text-sm text-gray-900 sm:text-base dark:text-gray-200">월별 과금 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="-mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="month" tick={{ fill: tickFill, fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: tickFill, fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatAmount(Number(value))} />
                <Bar dataKey="amount" name="과금액" fill={barFill} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Billing History Table */}
      <Card className="border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#121A2E]">
        <CardHeader>
          <CardTitle className="text-sm text-gray-900 sm:text-base dark:text-gray-200">월별 과금 내역</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500 dark:border-[#1E2942] dark:bg-[#0A0E1A] dark:text-gray-500">
                  <th className="px-3 py-3 font-medium sm:px-5 sm:py-3.5">월</th>
                  <th className="px-3 py-3 text-right font-medium sm:px-5 sm:py-3.5">수집건수</th>
                  <th className="hidden px-5 py-3.5 text-right font-medium sm:table-cell">단가</th>
                  <th className="px-3 py-3 text-right font-medium sm:px-5 sm:py-3.5">과금액</th>
                  <th className="px-3 py-3 text-center font-medium sm:px-5 sm:py-3.5">상태</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((b) => (
                  <tr key={b.month} className="border-b border-gray-100 last:border-0 dark:border-[#1E2942]/50">
                    <td className="px-3 py-3 font-medium text-gray-900 sm:px-5 dark:text-gray-200">{b.month}</td>
                    <td className="px-3 py-3 text-right text-gray-600 sm:px-5 dark:text-gray-300">
                      {b.transactionCount.toLocaleString()}건
                    </td>
                    <td className="hidden px-5 py-3 text-right text-gray-500 sm:table-cell dark:text-gray-400">
                      {b.unitPrice}원
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-gray-900 sm:px-5 dark:text-white">
                      {formatAmount(b.totalAmount)}
                    </td>
                    <td className="px-3 py-3 text-center sm:px-5">
                      <Badge
                        className={`border-0 text-xs ${
                          b.status === "납부완료"
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : b.status === "청구중"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
                        }`}
                      >
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
