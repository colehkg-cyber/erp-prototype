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

const stats = getMonthlyStats();
const billingHistory = getBillingHistory();

const chartData = [...billingHistory].reverse().map((b) => ({
  month: b.month.replace("2026-", "").replace("2025-", "") + "월",
  amount: b.totalAmount,
  count: b.transactionCount,
}));

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">과금현황</h1>
        <p className="mt-1 text-sm text-gray-500">
          건당 과금 현황과 월별 이용료를 확인합니다
        </p>
      </div>

      {/* Current Month Billing */}
      <Card className="border-[#005AE0]/20 bg-gradient-to-r from-[#121A2E] to-[#0A1628]">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#005AE0]/15 p-3">
              <Calculator className="h-6 w-6 text-[#005AE0]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">이번달 예상 과금</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">
                  {formatAmount(stats.estimatedBilling)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <span className="text-[#00D4FF]">{stats.totalCount}건</span> × 40원/건
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-white/[0.06] bg-[#121A2E]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-[#00D4FF]" />
              <div>
                <p className="text-xs text-gray-500">이번달 수집건수</p>
                <p className="text-2xl font-bold text-white">{stats.totalCount}건</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-[#121A2E]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-xs text-gray-500">건당 단가</p>
                <p className="text-2xl font-bold text-white">40원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-[#121A2E]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-[#005AE0]" />
              <div>
                <p className="text-xs text-gray-500">누적 과금 (6개월)</p>
                <p className="text-2xl font-bold text-white">
                  {formatAmount(billingHistory.reduce((s, b) => s + b.totalAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-white/[0.06] bg-[#121A2E]">
        <CardHeader>
          <CardTitle className="text-base text-gray-200">월별 과금 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                }}
                formatter={(value) => formatAmount(Number(value))}
              />
              <Bar dataKey="amount" name="과금액" fill="#005AE0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Billing History Table */}
      <Card className="border-white/[0.06] bg-[#121A2E]">
        <CardHeader>
          <CardTitle className="text-base text-gray-200">월별 과금 내역</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs text-gray-500">
                  <th className="px-5 py-3.5 font-medium">월</th>
                  <th className="px-5 py-3.5 text-right font-medium">수집건수</th>
                  <th className="px-5 py-3.5 text-right font-medium">단가</th>
                  <th className="px-5 py-3.5 text-right font-medium">과금액</th>
                  <th className="px-5 py-3.5 text-center font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((b) => (
                  <tr key={b.month} className="border-b border-white/[0.03] last:border-0">
                    <td className="px-5 py-3 font-medium text-gray-200">{b.month}</td>
                    <td className="px-5 py-3 text-right text-gray-300">
                      {b.transactionCount.toLocaleString()}건
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400">{b.unitPrice}원</td>
                    <td className="px-5 py-3 text-right font-medium text-white">
                      {formatAmount(b.totalAmount)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge
                        className={`border-0 text-xs ${
                          b.status === "납부완료"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : b.status === "청구중"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-gray-500/15 text-gray-400"
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
