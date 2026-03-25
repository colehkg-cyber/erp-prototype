// 뉴젠 AI ERP — 공통 타입 정의

export type CategoryType =
  | "식비"
  | "교통비"
  | "사무용품"
  | "접대비"
  | "통신비"
  | "복리후생"
  | "기타";

export interface Card {
  id: string;
  cardCompany: string;
  cardName: string;
  cardNumber: string;
  color: string;
  monthlyAmount: number;
  monthlyCount: number;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  cardId: string;
  merchantName: string;
  amount: number;
  category: CategoryType;
  accountCode: string;
  confidence: number;
  status: "확인" | "미분류" | "수정됨";
  receiptStatus: "증빙완료" | "미증빙";
}

export interface BillingHistory {
  month: string;
  transactionCount: number;
  unitPrice: number;
  totalAmount: number;
  status: "납부완료" | "청구중" | "예정";
}

export interface MonthlyStats {
  totalCount: number;
  totalAmount: number;
  unclassifiedCount: number;
  estimatedBilling: number;
}

export interface ReceiptStats {
  total: number;
  verified: number;
  unverified: number;
  rate: number;
}

export interface ChatQA {
  question: string;
  answer: string;
}
