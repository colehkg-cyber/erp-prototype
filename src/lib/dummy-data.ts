// 뉴젠 AI ERP 프로토타입 더미 데이터

export interface Card {
  id: string;
  cardCompany: string;
  cardName: string;
  cardNumber: string; // 마스킹된 번호
  color: string;
  monthlyAmount: number;
  monthlyCount: number;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  cardId: string;
  merchantName: string;
  amount: number;
  category: CategoryType;
  accountCode: string;
  confidence: number; // 0-100
  status: "확인" | "미분류" | "수정됨";
}

export type CategoryType =
  | "식비"
  | "교통비"
  | "사무용품"
  | "접대비"
  | "통신비"
  | "복리후생"
  | "기타";

export interface BillingHistory {
  month: string; // YYYY-MM
  transactionCount: number;
  unitPrice: number;
  totalAmount: number;
  status: "납부완료" | "청구중" | "예정";
}

export const CATEGORIES: CategoryType[] = [
  "식비",
  "교통비",
  "사무용품",
  "접대비",
  "통신비",
  "복리후생",
  "기타",
];

export const ACCOUNT_CODES: Record<CategoryType, string> = {
  식비: "복리후생비 (522)",
  교통비: "여비교통비 (521)",
  사무용품: "소모품비 (518)",
  접대비: "접대비 (812)",
  통신비: "통신비 (523)",
  복리후생: "복리후생비 (522)",
  기타: "잡비 (835)",
};

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  식비: "#3b82f6",
  교통비: "#10b981",
  사무용품: "#f59e0b",
  접대비: "#ef4444",
  통신비: "#8b5cf6",
  복리후생: "#06b6d4",
  기타: "#6b7280",
};

// 카드 데이터
export const cards: Card[] = [
  {
    id: "card-1",
    cardCompany: "삼성카드",
    cardName: "삼성 법인카드",
    cardNumber: "9411-****-****-3578",
    color: "#1428A0",
    monthlyAmount: 2847000,
    monthlyCount: 34,
  },
  {
    id: "card-2",
    cardCompany: "현대카드",
    cardName: "현대 M포인트 법인",
    cardNumber: "5234-****-****-8821",
    color: "#000000",
    monthlyAmount: 1923000,
    monthlyCount: 22,
  },
  {
    id: "card-3",
    cardCompany: "신한카드",
    cardName: "신한 딥드림 법인",
    cardNumber: "4532-****-****-1156",
    color: "#0046FF",
    monthlyAmount: 3156000,
    monthlyCount: 41,
  },
  {
    id: "card-4",
    cardCompany: "KB국민카드",
    cardName: "KB 비즈 법인카드",
    cardNumber: "6271-****-****-4490",
    color: "#FFB300",
    monthlyAmount: 987000,
    monthlyCount: 15,
  },
  {
    id: "card-5",
    cardCompany: "롯데카드",
    cardName: "롯데 법인카드",
    cardNumber: "3782-****-****-7723",
    color: "#ED1C24",
    monthlyAmount: 654000,
    monthlyCount: 8,
  },
];

// 가맹점 데이터
const merchants: { name: string; category: CategoryType; minAmount: number; maxAmount: number }[] = [
  { name: "스타벅스 강남역점", category: "식비", minAmount: 4500, maxAmount: 15000 },
  { name: "맘스터치 역삼점", category: "식비", minAmount: 5000, maxAmount: 12000 },
  { name: "한솥도시락 선릉점", category: "식비", minAmount: 4000, maxAmount: 8000 },
  { name: "교보문고 광화문점", category: "사무용품", minAmount: 10000, maxAmount: 50000 },
  { name: "다이소 강남점", category: "사무용품", minAmount: 3000, maxAmount: 25000 },
  { name: "카카오택시", category: "교통비", minAmount: 5000, maxAmount: 35000 },
  { name: "서울교통공사", category: "교통비", minAmount: 1250, maxAmount: 1250 },
  { name: "GS주유소 역삼", category: "교통비", minAmount: 30000, maxAmount: 80000 },
  { name: "KT 통신요금", category: "통신비", minAmount: 30000, maxAmount: 120000 },
  { name: "SK텔레콤", category: "통신비", minAmount: 50000, maxAmount: 80000 },
  { name: "정", category: "접대비", minAmount: 50000, maxAmount: 300000 },
  { name: "더리버사이드호텔", category: "접대비", minAmount: 100000, maxAmount: 500000 },
  { name: "노브랜드버거 삼성점", category: "식비", minAmount: 5000, maxAmount: 15000 },
  { name: "쿠팡 온라인", category: "사무용품", minAmount: 10000, maxAmount: 100000 },
  { name: "올리브영 강남역점", category: "복리후생", minAmount: 5000, maxAmount: 30000 },
  { name: "메가박스 코엑스", category: "복리후생", minAmount: 12000, maxAmount: 24000 },
  { name: "CU편의점 테헤란로", category: "기타", minAmount: 1000, maxAmount: 10000 },
  { name: "이디야커피 삼성역점", category: "식비", minAmount: 3000, maxAmount: 12000 },
  { name: "배달의민족", category: "식비", minAmount: 15000, maxAmount: 45000 },
  { name: "티머니 충전", category: "교통비", minAmount: 10000, maxAmount: 50000 },
  { name: "네이버클라우드", category: "통신비", minAmount: 100000, maxAmount: 500000 },
  { name: "AWS Korea", category: "통신비", minAmount: 200000, maxAmount: 800000 },
  { name: "본죽 서초점", category: "식비", minAmount: 7000, maxAmount: 12000 },
  { name: "파리바게뜨 역삼역점", category: "식비", minAmount: 3000, maxAmount: 20000 },
  { name: "하나로마트 양재점", category: "복리후생", minAmount: 20000, maxAmount: 80000 },
];

// seeded random for reproducibility
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 거래내역 생성 (100건, 최근 3개월)
function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const cardIds = cards.map((c) => c.id);
  const confidences = [95, 93, 91, 89, 87, 85, 82, 78, 75, 72, 68, 65];

  for (let i = 0; i < 120; i++) {
    const seed = i + 42;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    const r3 = seededRandom(seed + 2);
    const r4 = seededRandom(seed + 3);
    const r5 = seededRandom(seed + 4);

    const daysAgo = Math.floor(r1 * 90);
    const date = new Date(2026, 2, 25); // 2026-03-25
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split("T")[0];

    const hour = 8 + Math.floor(r2 * 14);
    const minute = Math.floor(r3 * 60);
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    const merchant = merchants[Math.floor(r4 * merchants.length)];
    const amount = Math.round(
      (merchant.minAmount + r5 * (merchant.maxAmount - merchant.minAmount)) / 100
    ) * 100;

    const confidence = confidences[Math.floor(seededRandom(seed + 5) * confidences.length)];
    const status = confidence >= 80 ? "확인" : confidence >= 70 ? "미분류" : "미분류";

    transactions.push({
      id: `txn-${String(i + 1).padStart(4, "0")}`,
      date: dateStr,
      time: timeStr,
      cardId: cardIds[Math.floor(seededRandom(seed + 6) * cardIds.length)],
      merchantName: merchant.name,
      amount,
      category: merchant.category,
      accountCode: ACCOUNT_CODES[merchant.category],
      confidence,
      status: status as Transaction["status"],
    });
  }

  // Sort by date desc, then time desc
  transactions.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.time.localeCompare(a.time);
  });

  return transactions;
}

export const transactions: Transaction[] = generateTransactions();

// 이번 달 통계 계산
export function getMonthlyStats() {
  const currentMonth = "2026-03";
  const monthTxns = transactions.filter((t) => t.date.startsWith(currentMonth));
  const totalCount = monthTxns.length;
  const totalAmount = monthTxns.reduce((sum, t) => sum + t.amount, 0);
  const unclassifiedCount = monthTxns.filter((t) => t.status === "미분류").length;
  const estimatedBilling = totalCount * 40;

  return { totalCount, totalAmount, unclassifiedCount, estimatedBilling };
}

// 일별 거래 추이 (최근 30일)
export function getDailyTrend() {
  const result: { date: string; count: number; amount: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(2026, 2, 25);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayTxns = transactions.filter((t) => t.date === dateStr);
    result.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      count: dayTxns.length,
      amount: dayTxns.reduce((sum, t) => sum + t.amount, 0),
    });
  }
  return result;
}

// 카테고리별 지출 (이번 달)
export function getCategoryBreakdown() {
  const currentMonth = "2026-03";
  const monthTxns = transactions.filter((t) => t.date.startsWith(currentMonth));
  const breakdown = CATEGORIES.map((cat) => {
    const catTxns = monthTxns.filter((t) => t.category === cat);
    return {
      name: cat,
      value: catTxns.reduce((sum, t) => sum + t.amount, 0),
      count: catTxns.length,
      color: CATEGORY_COLORS[cat],
    };
  }).filter((item) => item.value > 0);
  return breakdown;
}

// 과금 히스토리
export const billingHistory: BillingHistory[] = [
  { month: "2026-03", transactionCount: 0, unitPrice: 40, totalAmount: 0, status: "청구중" },
  { month: "2026-02", transactionCount: 387, unitPrice: 40, totalAmount: 15480, status: "납부완료" },
  { month: "2026-01", transactionCount: 412, unitPrice: 40, totalAmount: 16480, status: "납부완료" },
  { month: "2025-12", transactionCount: 356, unitPrice: 40, totalAmount: 14240, status: "납부완료" },
  { month: "2025-11", transactionCount: 298, unitPrice: 40, totalAmount: 11920, status: "납부완료" },
  { month: "2025-10", transactionCount: 321, unitPrice: 40, totalAmount: 12840, status: "납부완료" },
];

// 과금 히스토리의 이번 달 데이터를 동적으로 업데이트
export function getBillingHistory(): BillingHistory[] {
  const stats = getMonthlyStats();
  return billingHistory.map((b) => {
    if (b.month === "2026-03") {
      return {
        ...b,
        transactionCount: stats.totalCount,
        totalAmount: stats.estimatedBilling,
      };
    }
    return b;
  });
}

// 카드 ID로 카드 정보 가져오기
export function getCardById(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}

// 금액 포맷
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

export function formatAmountShort(amount: number): string {
  if (amount >= 100000000) return (amount / 100000000).toFixed(1) + "억";
  if (amount >= 10000) return (amount / 10000).toFixed(0) + "만";
  return new Intl.NumberFormat("ko-KR").format(amount);
}
