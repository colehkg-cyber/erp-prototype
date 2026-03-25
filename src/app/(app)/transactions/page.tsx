"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  transactions,
  CATEGORIES,
  getCardById,
  formatAmount,
  type CategoryType,
} from "@/lib/dummy-data";

function confidenceBadge(confidence: number) {
  if (confidence >= 95)
    return (
      <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs">
        {confidence}%
      </Badge>
    );
  if (confidence >= 80)
    return (
      <Badge className="bg-yellow-500/15 text-yellow-400 border-0 text-xs">
        {confidence}%
      </Badge>
    );
  return (
    <Badge className="bg-red-500/15 text-red-400 border-0 text-xs">
      {confidence}%
    </Badge>
  );
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesCategory =
        categoryFilter === "all" || t.category === categoryFilter;
      const matchesSearch =
        search === "" ||
        t.merchantName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, categoryFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">거래내역</h1>
        <p className="mt-1 text-sm text-gray-500">
          카드 결제 내역을 조회하고 자동 분류 결과를 확인합니다
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="가맹점 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 border-white/[0.08] bg-[#121A2E] pl-10 text-gray-200 placeholder:text-gray-600"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-white/[0.08] bg-[#121A2E] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#005AE0] focus:ring-1 focus:ring-[#005AE0]"
        >
          <option value="all">전체 카테고리</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm text-gray-500">
          총 {filtered.length}건
        </span>
      </div>

      {/* Table */}
      <Card className="border-white/[0.06] bg-[#121A2E]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs text-gray-500">
                  <th className="px-5 py-3.5 font-medium">날짜/시간</th>
                  <th className="px-5 py-3.5 font-medium">가맹점</th>
                  <th className="px-5 py-3.5 font-medium">카드</th>
                  <th className="px-5 py-3.5 font-medium">카테고리</th>
                  <th className="px-5 py-3.5 text-right font-medium">금액</th>
                  <th className="px-5 py-3.5 text-center font-medium">
                    분류 신뢰도
                  </th>
                  <th className="px-5 py-3.5 text-center font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => {
                  const card = getCardById(txn.cardId);
                  return (
                    <tr
                      key={txn.id}
                      className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] last:border-0"
                    >
                      <td className="px-5 py-3 text-gray-400">
                        <div>{txn.date}</div>
                        <div className="text-xs text-gray-600">{txn.time}</div>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-200">
                        {txn.merchantName}
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {card?.cardCompany ?? "-"}
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant="outline"
                          className="border-white/10 text-xs text-gray-300"
                        >
                          {txn.category}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-white">
                        {formatAmount(txn.amount)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {confidenceBadge(txn.confidence)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`text-xs ${
                            txn.status === "확인"
                              ? "text-emerald-400"
                              : txn.status === "수정됨"
                              ? "text-blue-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {txn.status}
                        </span>
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
