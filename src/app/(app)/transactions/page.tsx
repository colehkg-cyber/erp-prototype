"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  FileCheck2,
  AlertTriangle,
  BarChart3,
  Paperclip,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  transactions as initialTransactions,
  CATEGORIES,
  getCardById,
  formatAmount,
  getReceiptStats,
} from "@/lib/dummy-data";
import type { Transaction } from "@/lib/types";
import { PageHeader } from "@/components/common/page-header";
import { ConfidenceBadge } from "@/components/common/confidence-badge";
import ReceiptDialog from "@/components/receipt-dialog";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [txns, setTxns] = useState<Transaction[]>(initialTransactions);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return txns.filter((t) => {
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      const matchesSearch = search === "" || t.merchantName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, categoryFilter, txns]);

  const stats = useMemo(() => getReceiptStats(filtered), [filtered]);

  const handleRowClick = useCallback((txn: Transaction) => {
    setSelectedTxn(txn);
    setDialogOpen(true);
  }, []);

  const handleVerify = useCallback((txnId: string) => {
    setTxns((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, receiptStatus: "증빙완료" as const } : t))
    );
    setSelectedTxn((prev) =>
      prev && prev.id === txnId ? { ...prev, receiptStatus: "증빙완료" as const } : prev
    );
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title="거래내역" description="카드 결제 내역을 조회하고 자동 분류 결과를 확인합니다" />

      {/* 증빙 현황 카드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card className="border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 p-3 sm:p-4">
            <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-500/15">
              <FileCheck2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">증빙완료</p>
              <p className="text-xl font-bold text-emerald-700 sm:text-2xl dark:text-emerald-400">
                {stats.verified}건
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-3 sm:p-4">
            <div className="rounded-lg bg-amber-100 p-2.5 dark:bg-amber-500/15">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-500">미증빙</p>
              <p className="text-xl font-bold text-amber-700 sm:text-2xl dark:text-amber-400">
                {stats.unverified}건
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5">
          <CardContent className="flex items-center gap-3 p-3 sm:p-4">
            <div className="rounded-lg bg-blue-100 p-2.5 dark:bg-blue-500/15">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-500">증빙률</p>
              <p className="text-xl font-bold text-blue-700 sm:text-2xl dark:text-blue-400">
                {stats.rate}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="가맹점 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400 sm:w-64 dark:border-[#1E2942] dark:bg-[#121A2E] dark:text-gray-200 dark:placeholder:text-gray-600"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="min-h-[44px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-[#1E2942] dark:bg-[#121A2E] dark:text-gray-200 dark:focus:border-[#005AE0] dark:focus:ring-[#005AE0]"
        >
          <option value="all">전체 카테고리</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 sm:ml-auto dark:text-gray-500">
          총 {filtered.length}건
        </span>
      </div>

      {/* Table */}
      <Card className="border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#121A2E]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500 dark:border-[#1E2942] dark:bg-[#0A0E1A] dark:text-gray-500">
                  <th className="px-3 py-3 font-medium sm:px-5 sm:py-3.5">날짜/시간</th>
                  <th className="px-3 py-3 font-medium sm:px-5 sm:py-3.5">가맹점</th>
                  <th className="hidden px-5 py-3.5 font-medium md:table-cell">카드</th>
                  <th className="px-3 py-3 font-medium sm:px-5 sm:py-3.5">카테고리</th>
                  <th className="px-3 py-3 text-right font-medium sm:px-5 sm:py-3.5">금액</th>
                  <th className="hidden px-5 py-3.5 text-center font-medium lg:table-cell">분류 신뢰도</th>
                  <th className="px-3 py-3 text-center font-medium sm:px-5 sm:py-3.5">증빙</th>
                  <th className="hidden px-5 py-3.5 text-center font-medium sm:table-cell">상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => {
                  const card = getCardById(txn.cardId);
                  return (
                    <tr
                      key={txn.id}
                      onClick={() => handleRowClick(txn)}
                      className="cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50 dark:border-[#1E2942]/50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-3 py-3 text-gray-600 sm:px-5 dark:text-gray-400">
                        <div className="hidden sm:block">{txn.date}</div>
                        <div className="sm:hidden">{txn.date.slice(5)}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-600">{txn.time}</div>
                      </td>
                      <td className="max-w-[100px] truncate px-3 py-3 font-medium text-gray-900 sm:max-w-none sm:px-5 dark:text-gray-200">
                        {txn.merchantName}
                      </td>
                      <td className="hidden px-5 py-3 text-gray-600 md:table-cell dark:text-gray-400">
                        {card?.cardCompany ?? "-"}
                      </td>
                      <td className="px-3 py-3 sm:px-5">
                        <Badge variant="outline" className="border-gray-200 text-xs text-gray-600 dark:border-white/10 dark:text-gray-300">
                          {txn.category}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-gray-900 sm:px-5 dark:text-white">
                        {formatAmount(txn.amount)}
                      </td>
                      <td className="hidden px-5 py-3 text-center lg:table-cell">
                        <ConfidenceBadge confidence={txn.confidence} />
                      </td>
                      <td className="px-3 py-3 text-center sm:px-5">
                        {txn.receiptStatus === "증빙완료" ? (
                          <Badge className="border-0 bg-emerald-100 text-xs text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                            <Paperclip className="mr-1 hidden h-3 w-3 sm:inline-block" />
                            <span className="hidden sm:inline">증빙완료</span>
                            <span className="sm:hidden">✓</span>
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(txn);
                            }}
                          >
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            <span className="hidden sm:inline">미증빙</span>
                            <span className="sm:hidden">!</span>
                          </Button>
                        )}
                      </td>
                      <td className="hidden px-5 py-3 text-center sm:table-cell">
                        <span
                          className={`text-xs ${
                            txn.status === "확인"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : txn.status === "수정됨"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-yellow-600 dark:text-yellow-400"
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

      <ReceiptDialog
        transaction={selectedTxn}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onVerify={handleVerify}
      />
    </div>
  );
}
