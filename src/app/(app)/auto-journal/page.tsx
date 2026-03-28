"use client";

import { useState, useCallback } from "react";
import {
  CreditCard,
  Building2,
  Coffee,
  Fuel,
  Package,
  Heart,
  Banknote,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Check,
  RotateCcw,
  FileText,
  Zap,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface Transaction {
  id: number;
  icon: React.ReactNode;
  name: string;
  date: string;
  amount: number;
  type: "expense" | "income";
  journal: JournalEntry;
}

interface JournalEntry {
  debit: { account: string; amount: string }[];
  credit: { account: string; amount: string }[];
  memo: string;
  confidence: number;
  alts: string[];
  reason: string;
}

/* ─── Sample Data ─── */
const CARD_DATA: Transaction[] = [
  {
    id: 1,
    icon: <Coffee className="h-4 w-4" />,
    name: "스타벅스 강남역점",
    date: "2026-03-28",
    amount: -15000,
    type: "expense",
    journal: {
      debit: [{ account: "복리후생비", amount: "15,000" }],
      credit: [{ account: "미지급금", amount: "15,000" }],
      memo: "직원 커피 / 카드결제",
      confidence: 94,
      alts: ["접대비", "소모품비"],
      reason: '과거 3개월간 "스타벅스" 거래 47건 중 45건(96%)이 복리후생비로 분개됨. 금액대(1~2만원)도 복리후생비 패턴과 일치.',
    },
  },
  {
    id: 2,
    icon: <Fuel className="h-4 w-4" />,
    name: "GS칼텍스 서초점",
    date: "2026-03-28",
    amount: -82000,
    type: "expense",
    journal: {
      debit: [{ account: "차량유지비", amount: "82,000" }],
      credit: [{ account: "미지급금", amount: "82,000" }],
      memo: "업무용 차량 주유",
      confidence: 97,
      alts: ["여비교통비"],
      reason: '"GS칼텍스", "주유" 키워드 → 차량유지비 패턴. 과거 6개월 주유 거래 100% 차량유지비 처리.',
    },
  },
  {
    id: 3,
    icon: <Heart className="h-4 w-4" />,
    name: "한솥도시락 역삼점",
    date: "2026-03-27",
    amount: -8500,
    type: "expense",
    journal: {
      debit: [{ account: "복리후생비", amount: "8,500" }],
      credit: [{ account: "미지급금", amount: "8,500" }],
      memo: "직원 중식",
      confidence: 91,
      alts: ["접대비", "회의비"],
      reason: "음식점 카테고리 + 1만원 미만 → 직원 식대 패턴. 동일 사무소 과거 분개 91% 복리후생비.",
    },
  },
  {
    id: 4,
    icon: <Package className="h-4 w-4" />,
    name: "쿠팡 주식회사",
    date: "2026-03-27",
    amount: -152700,
    type: "expense",
    journal: {
      debit: [
        { account: "소모품비", amount: "150,000" },
        { account: "부가세대급금", amount: "2,700" },
      ],
      credit: [{ account: "미지급금", amount: "152,700" }],
      memo: "사무용품 구매 (복합 분개 — AI 자동 분할)",
      confidence: 88,
      alts: ["비품", "수선비"],
      reason: "금액 152,700원 → 부가세 포함 가격으로 판단. 자동 분할: 공급가액 150,000 + VAT 2,700. 쿠팡 거래 과거 패턴: 소모품비 78%.",
    },
  },
  {
    id: 5,
    icon: <Building2 className="h-4 w-4" />,
    name: "(주)우리빌딩관리",
    date: "2026-03-25",
    amount: -1100000,
    type: "expense",
    journal: {
      debit: [
        { account: "임차료", amount: "1,000,000" },
        { account: "부가세대급금", amount: "100,000" },
      ],
      credit: [{ account: "미지급금", amount: "1,100,000" }],
      memo: "3월 사무실 임대료 (세금계산서)",
      confidence: 99,
      alts: [],
      reason: '세금계산서 매칭 + "빌딩관리" 키워드 → 임차료. 매월 동일 금액 반복 패턴 감지 (6개월 연속).',
    },
  },
  {
    id: 6,
    icon: <Heart className="h-4 w-4" />,
    name: "국민건강보험공단",
    date: "2026-03-25",
    amount: -340000,
    type: "expense",
    journal: {
      debit: [{ account: "보험료", amount: "340,000" }],
      credit: [{ account: "보통예금", amount: "340,000" }],
      memo: "3월 건강보험료 사업주 부담분",
      confidence: 96,
      alts: ["복리후생비"],
      reason: '"건강보험공단" → 4대보험 자동 매칭. 매월 25일 전후 출금 패턴.',
    },
  },
];

const BANK_DATA: Transaction[] = [
  {
    id: 7,
    icon: <Banknote className="h-4 w-4" />,
    name: "(주)삼성전자",
    date: "2026-03-28",
    amount: 5500000,
    type: "income",
    journal: {
      debit: [{ account: "보통예금", amount: "5,500,000" }],
      credit: [{ account: "매출", amount: "5,500,000" }],
      memo: "컨설팅 서비스 대금 입금",
      confidence: 92,
      alts: ["선수금", "외상매출금 회수"],
      reason: '거래처 DB "삼성전자" → 매출처. 과거 입금 패턴: 컨설팅 대금 92% 확률.',
    },
  },
  {
    id: 8,
    icon: <Building2 className="h-4 w-4" />,
    name: "신한은행 이자",
    date: "2026-03-27",
    amount: 12340,
    type: "income",
    journal: {
      debit: [{ account: "보통예금", amount: "12,340" }],
      credit: [{ account: "이자수익", amount: "12,340" }],
      memo: "보통예금 이자 입금",
      confidence: 99,
      alts: [],
      reason: '"은행" + "이자" 키워드 → 이자수익 자동 매칭. 99% 확신.',
    },
  },
  {
    id: 9,
    icon: <CreditCard className="h-4 w-4" />,
    name: "카드매출 정산",
    date: "2026-03-26",
    amount: 3200000,
    type: "income",
    journal: {
      debit: [
        { account: "보통예금", amount: "3,168,000" },
        { account: "카드수수료", amount: "32,000" },
      ],
      credit: [{ account: "매출", amount: "3,200,000" }],
      memo: "3/26 카드매출 정산 (수수료 1% 자동 분리)",
      confidence: 95,
      alts: [],
      reason: '"카드매출 정산" 패턴 인식 + 수수료율 1% 자동 계산. 정산금액과 수수료 자동 분리.',
    },
  },
  {
    id: 10,
    icon: <Banknote className="h-4 w-4" />,
    name: "김철수 (거래처)",
    date: "2026-03-25",
    amount: 800000,
    type: "income",
    journal: {
      debit: [{ account: "보통예금", amount: "800,000" }],
      credit: [{ account: "외상매출금", amount: "800,000" }],
      memo: "외상대금 회수 (김철수 거래처)",
      confidence: 87,
      alts: ["선수금", "가수금"],
      reason: '거래처원장 "김철수" 외상매출금 잔액 확인 → 회수 처리. 다만 선수금/가수금 가능성 13%.',
    },
  },
  {
    id: 11,
    icon: <TrendingUp className="h-4 w-4" />,
    name: "국세청 환급",
    date: "2026-03-24",
    amount: 2150000,
    type: "income",
    journal: {
      debit: [{ account: "보통예금", amount: "2,150,000" }],
      credit: [{ account: "부가세예수금", amount: "2,150,000" }],
      memo: "2025년 2기 부가세 환급",
      confidence: 93,
      alts: ["미수금"],
      reason: '"국세청" + 입금 → 세금 환급. 시기(3월) + 금액대로 부가세 환급 판단.',
    },
  },
];

/* ─── Helper ─── */
function formatAmount(n: number) {
  const abs = Math.abs(n);
  return (n > 0 ? "+" : "-") + abs.toLocaleString() + "원";
}

/* ─── Components ─── */

function StatCard({
  label,
  value,
  unit,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  unit: string;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        <span className="ml-1 text-sm font-normal text-gray-500">{unit}</span>
      </div>
      {sub && <div className="mt-1 text-xs text-emerald-500">{sub}</div>}
    </div>
  );
}

function TransactionItem({
  tx,
  selected,
  onClick,
}: {
  tx: Transaction;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
        selected
          ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:bg-[#111827] dark:hover:border-gray-700 dark:hover:bg-gray-800/50"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          tx.type === "expense"
            ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        )}
      >
        {tx.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
          {selected && (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-500" />
          )}
          <span className="truncate">{tx.name}</span>
        </div>
        <div className="text-xs text-gray-500">{tx.date}</div>
      </div>
      <div
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          tx.type === "expense" ? "text-red-500" : "text-emerald-500"
        )}
      >
        {formatAmount(tx.amount)}
      </div>
    </button>
  );
}

function JournalResult({
  tx,
  onConfirm,
}: {
  tx: Transaction;
  onConfirm: () => void;
}) {
  const j = tx.journal;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="h-4 w-4" />
            AI 추천 분개전표
          </div>
          <div
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              j.confidence >= 90
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
            )}
          >
            정확도 {j.confidence}%
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 dark:border-gray-800">
                <th className="px-4 py-2.5 text-left font-medium">차변 (Debit)</th>
                <th className="px-4 py-2.5 text-right font-medium">금액</th>
                <th className="px-4 py-2.5 text-left font-medium">대변 (Credit)</th>
                <th className="px-4 py-2.5 text-right font-medium">금액</th>
              </tr>
            </thead>
            <tbody>
              {j.debit.map((d, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                  <td className="px-4 py-3 font-medium text-red-600 dark:text-red-400">
                    {d.account}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {d.amount}
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                    {i === 0 ? j.credit[0]?.account : j.credit[i]?.account || ""}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {i === 0 ? j.credit[0]?.amount : j.credit[i]?.amount || ""}
                  </td>
                </tr>
              ))}
              {/* 대변이 debit보다 적으면 나머지 출력 */}
              {j.credit.length > j.debit.length &&
                j.credit.slice(j.debit.length).map((c, i) => (
                  <tr key={`c-${i}`} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                      {c.account}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {c.amount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Memo */}
        <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3 text-xs text-gray-500 dark:border-gray-800">
          <FileText className="h-3.5 w-3.5" />
          적요: {j.memo}
        </div>

        {/* Alt suggestions */}
        {j.alts.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
              <RotateCcw className="h-3 w-3" />
              다른 추천 계정과목:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {j.alts.map((alt) => (
                <button
                  key={alt}
                  className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:text-blue-400"
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Reason */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          AI 판단 근거
        </div>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {j.reason}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
          <Edit2 className="h-3.5 w-3.5" />
          수정
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Check className="h-4 w-4" />
          확인 — 전표 생성
        </button>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function AutoJournalPage() {
  const [dataType, setDataType] = useState<"card" | "bank" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmedIds, setConfirmedIds] = useState<Set<number>>(new Set());
  const [analyzing, setAnalyzing] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState(0);

  const txList = dataType === "card" ? CARD_DATA : dataType === "bank" ? BANK_DATA : [];
  const selectedTx = txList.find((t) => t.id === selectedId) || null;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  function handleSelectTx(id: number) {
    setAnalyzing(true);
    setBulkDone(false);
    setSelectedId(null);
    setTimeout(() => {
      setSelectedId(id);
      setConfirmedIds((prev) => new Set(prev).add(id));
      setAnalyzing(false);
    }, 600 + Math.random() * 400);
  }

  function handleConfirm() {
    if (selectedTx) {
      setProcessedCount((c) => c + 1);
      showToast(`"${selectedTx.name}" 전표가 생성되었습니다!`);
    }
  }

  function handleSelectAll() {
    setAnalyzing(true);
    setSelectedId(null);
    setBulkDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= txList.length) {
        clearInterval(interval);
        setAnalyzing(false);
        setBulkDone(true);
        return;
      }
      setConfirmedIds((prev) => new Set(prev).add(txList[i].id));
      i++;
    }, 200);
  }

  function handleBulkCreate() {
    const count = confirmedIds.size;
    setProcessedCount((c) => c + count);
    showToast(`${count}건 전표가 일괄 생성되었습니다!`);
    setConfirmedIds(new Set());
    setBulkDone(false);
    setSelectedId(null);
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          AI 자동 분개
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          거래 내역을 AI가 분석하여 계정과목을 자동 추천합니다
        </p>
      </div>

      {/* Explainer */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 dark:border-blue-900 dark:from-blue-950/40 dark:to-indigo-950/30">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
          <Sparkles className="h-4 w-4" />
          자동 분개란?
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">분개(分介)</strong>란 모든
          거래를{" "}
          <strong className="text-red-500">차변(돈 나간 곳)</strong>과{" "}
          <strong className="text-blue-500">대변(돈 들어온 곳)</strong>으로 나누어
          기록하는 회계의 기본 작업입니다.
          <br />
          예: 카드로 커피 구매 →{" "}
          <strong className="text-red-500">복리후생비 15,000원(차변)</strong> /{" "}
          <strong className="text-blue-500">미지급금 15,000원(대변)</strong>
          <br />
          세무사무소 직원들은 이걸{" "}
          <strong className="text-amber-600 dark:text-amber-400">
            하루 100~200건 수동으로
          </strong>{" "}
          입력합니다. AI가 자동으로 해주면?
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg border border-blue-200 bg-white p-3 text-center dark:border-blue-800 dark:bg-blue-950/40">
            <div className="text-lg">📥</div>
            <div className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              거래 내역 업로드
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-blue-400" />
          <div className="flex-1 rounded-lg border border-blue-200 bg-white p-3 text-center dark:border-blue-800 dark:bg-blue-950/40">
            <div className="text-lg">🤖</div>
            <div className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              AI 계정과목 추천
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-blue-400" />
          <div className="flex-1 rounded-lg border border-blue-200 bg-white p-3 text-center dark:border-blue-800 dark:bg-blue-950/40">
            <div className="text-lg">✅</div>
            <div className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              확인 후 전표 생성
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="오늘 처리 건수"
          value={String(processedCount)}
          unit="건"
          icon={FileText}
        />
        <StatCard
          label="AI 정확도"
          value="94"
          unit="%"
          sub="▲ 지난달 대비 +3%"
          icon={Target}
        />
        <StatCard
          label="수동 대비 절약"
          value="2.5"
          unit="시간"
          sub="건당 평균 3초"
          icon={Clock}
        />
        <StatCard
          label="수정 필요"
          value="0"
          unit="건"
          icon={AlertCircle}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Transactions */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0D1117]">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <CreditCard className="h-4 w-4 text-gray-500" />
              거래 내역
            </h3>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setDataType("card");
                  setSelectedId(null);
                  setConfirmedIds(new Set());
                  setBulkDone(false);
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition",
                  dataType === "card"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                💳 카드
              </button>
              <button
                onClick={() => {
                  setDataType("bank");
                  setSelectedId(null);
                  setConfirmedIds(new Set());
                  setBulkDone(false);
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition",
                  dataType === "bank"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                🏦 통장
              </button>
            </div>
          </div>
          <div className="space-y-2 p-4">
            {txList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <CreditCard className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">샘플 데이터를 선택하세요</p>
              </div>
            ) : (
              txList.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  tx={tx}
                  selected={confirmedIds.has(tx.id)}
                  onClick={() => handleSelectTx(tx.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: AI Result */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0D1117]">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI 분개 추천
            </h3>
          </div>
          <div className="p-4">
            {analyzing ? (
              <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  AI가 거래를 분석 중...
                </span>
              </div>
            ) : selectedTx ? (
              <JournalResult tx={selectedTx} onConfirm={handleConfirm} />
            ) : bulkDone ? (
              <div className="flex flex-col items-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  전체 {txList.length}건 분석 완료!
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  평균 정확도{" "}
                  <strong className="text-emerald-600">94%</strong> · 처리 시간{" "}
                  <strong className="text-blue-600">
                    {(txList.length * 0.8).toFixed(1)}초
                  </strong>
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  수동 입력 시: 약 {txList.length * 3}분 → AI:{" "}
                  {(txList.length * 0.8).toFixed(0)}초
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Sparkles className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">거래를 클릭하면 AI가 분개를 추천합니다</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-[#111827]">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-blue-600">
            {confirmedIds.size}
          </span>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              건 선택됨
            </div>
            <div className="text-xs text-gray-500">
              AI 추천 확인 후 일괄 전표 생성
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            disabled={txList.length === 0}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            전체 선택
          </button>
          <button
            onClick={handleBulkCreate}
            disabled={confirmedIds.size === 0}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-40"
          >
            <Zap className="h-4 w-4" />
            일괄 전표 생성
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 shadow-lg dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
