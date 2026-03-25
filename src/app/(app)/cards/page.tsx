"use client";

import { CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cards, formatAmount } from "@/lib/dummy-data";

export default function CardsPage() {
  const totalMonthly = cards.reduce((s, c) => s + c.monthlyAmount, 0);
  const totalCount = cards.reduce((s, c) => s + c.monthlyCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">카드관리</h1>
        <p className="mt-1 text-sm text-gray-500">등록된 법인카드를 관리합니다</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-white/[0.06] bg-[#121A2E]">
          <CardContent className="p-5">
            <p className="text-sm text-gray-400">등록 카드</p>
            <p className="mt-1 text-3xl font-bold text-white">{cards.length}<span className="ml-1 text-base text-gray-500">장</span></p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-[#121A2E]">
          <CardContent className="p-5">
            <p className="text-sm text-gray-400">이번달 총 사용금액</p>
            <p className="mt-1 text-3xl font-bold text-white">{formatAmount(totalMonthly)}</p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-[#121A2E]">
          <CardContent className="p-5">
            <p className="text-sm text-gray-400">이번달 총 건수</p>
            <p className="mt-1 text-3xl font-bold text-white">{totalCount}<span className="ml-1 text-base text-gray-500">건</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative overflow-hidden rounded-2xl p-6"
            style={{
              background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}CC 50%, ${card.color}99 100%)`,
            }}
          >
            {/* Card pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-[-20px] top-[-20px] h-40 w-40 rounded-full border-[20px] border-white/20" />
              <div className="absolute bottom-[-30px] right-[40px] h-32 w-32 rounded-full border-[15px] border-white/10" />
            </div>

            <div className="relative z-10">
              {/* Card company */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">{card.cardCompany}</span>
                <CreditCard className="h-6 w-6 text-white/60" />
              </div>

              {/* Card number */}
              <p className="mt-6 font-mono text-lg tracking-[0.2em] text-white/90">
                {card.cardNumber}
              </p>

              {/* Card name */}
              <p className="mt-2 text-sm text-white/70">{card.cardName}</p>

              {/* Stats */}
              <div className="mt-6 flex items-end justify-between border-t border-white/20 pt-4">
                <div>
                  <p className="text-xs text-white/50">이번달 사용</p>
                  <p className="mt-0.5 text-xl font-bold text-white">{formatAmount(card.monthlyAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50">건수</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-white/60" />
                    <span className="text-lg font-semibold text-white">{card.monthlyCount}건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
