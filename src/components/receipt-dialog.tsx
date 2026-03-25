"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Camera,
  CheckCircle2,
  Loader2,
  FileImage,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ImageIcon,
} from "lucide-react";
import type { Transaction } from "@/lib/types";
import { getCardById, formatAmount } from "@/lib/dummy-data";
import ReceiptCanvas, {
  fakeBusinessNumber,
  fakeApprovalNumber,
} from "@/components/receipt-canvas";

type OcrState = "idle" | "analyzing" | "done";

interface ReceiptDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (txnId: string) => void;
}

export default function ReceiptDialog({
  transaction,
  open,
  onOpenChange,
  onVerify,
}: ReceiptDialogProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ocrState, setOcrState] = useState<OcrState>("idle");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isVerified = transaction?.receiptStatus === "증빙완료";

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setUploadedImage(null);
        setOcrState("idle");
        setIsDragOver(false);
      }, 200);
      return () => clearTimeout(t);
    }
    if (isVerified) {
      setOcrState("done");
    }
  }, [open, transaction?.id, isVerified]);

  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
      if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    };
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setOcrState("analyzing");
      analyzeTimerRef.current = setTimeout(() => {
        setOcrState("done");
      }, 2000);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleReupload = useCallback(() => {
    setUploadedImage(null);
    setOcrState("idle");
    if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
  }, []);

  if (!transaction) return null;

  const card = getCardById(transaction.cardId);
  const bizNum = fakeBusinessNumber(transaction.id);
  const approvalNum = fakeApprovalNumber(transaction.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Fullscreen on mobile, centered modal on desktop */}
      <DialogContent className="max-h-[100dvh] w-full max-w-[100vw] overflow-y-auto rounded-none sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileImage className="h-5 w-5" />
            지출증빙
            {isVerified && !uploadedImage && (
              <Badge className="ml-2 border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                증빙완료
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            영수증 이미지를 첨부하여 지출을 증빙합니다
          </DialogDescription>
        </DialogHeader>

        {/* 거래 정보 요약 */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-[#1E2942] dark:bg-[#0A0E1A]">
          <div className="grid grid-cols-2 gap-2 text-sm sm:gap-3">
            <div>
              <span className="text-gray-500 dark:text-gray-500">거래일시</span>
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {transaction.date} {transaction.time}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">가맹점</span>
              <p className="truncate font-medium text-gray-900 dark:text-gray-200">
                {transaction.merchantName}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">결제금액</span>
              <p className="text-base font-bold text-gray-900 sm:text-lg dark:text-white">
                {formatAmount(transaction.amount)}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">결제카드</span>
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {card?.cardCompany} {card?.cardNumber.slice(-4)}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">카테고리</span>
              <p className="font-medium text-gray-900 dark:text-gray-200">{transaction.category}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">계정과목</span>
              <p className="font-medium text-gray-900 dark:text-gray-200">{transaction.accountCode}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 왼쪽: 영수증 이미지 */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <ImageIcon className="h-4 w-4" />
              영수증 이미지
            </h3>

            {isVerified && !uploadedImage ? (
              <div className="space-y-3">
                <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-3 dark:border-[#1E2942] dark:bg-[#0D1322]">
                  <ReceiptCanvas transaction={transaction} width={260} />
                </div>
                <Button variant="outline" size="sm" className="min-h-[44px] w-full" onClick={handleReupload}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  영수증 재첨부
                </Button>
              </div>
            ) : uploadedImage ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#0D1322]">
                  <img src={uploadedImage} alt="영수증" className="max-h-[340px] w-full object-contain" />
                </div>
                <Button variant="outline" size="sm" className="min-h-[44px] w-full" onClick={handleReupload}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  다른 이미지 선택
                </Button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors sm:min-h-[260px] sm:p-8 ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-[#1E2942] dark:bg-[#0A0E1A] dark:hover:border-[#2A3A5C] dark:hover:bg-[#0D1322]"
                }`}
              >
                <Upload className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-600" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  이미지를 드래그하거나 클릭하여 선택
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">JPG, PNG, HEIC 지원</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" type="button" className="min-h-[44px]" onClick={(e) => e.stopPropagation()}>
                    <Camera className="mr-2 h-4 w-4" />
                    카메라 촬영
                  </Button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            )}
          </div>

          {/* 오른쪽: AI OCR 분석 결과 */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Sparkles className="h-4 w-4" />
              AI OCR 분석 결과
            </h3>

            {ocrState === "idle" && (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 sm:min-h-[260px] sm:p-8 dark:border-[#1E2942] dark:bg-[#0A0E1A]">
                <Sparkles className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-700" />
                <p className="text-center text-sm text-gray-400 dark:text-gray-600">
                  영수증 이미지를 업로드하면
                  <br />
                  AI가 자동으로 분석합니다
                </p>
              </div>
            )}

            {ocrState === "analyzing" && (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-6 sm:min-h-[260px] sm:p-8 dark:border-blue-500/20 dark:bg-blue-500/5">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">AI 분석 중...</p>
                <p className="mt-1 text-xs text-blue-500 dark:text-blue-500">영수증 텍스트를 인식하고 있습니다</p>
                <div className="mt-4 w-full max-w-[200px]">
                  <div className="h-1.5 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-500/20">
                    <div className="h-full animate-pulse rounded-full bg-blue-500" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            )}

            {ocrState === "done" && (
              <div className="space-y-3">
                <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 dark:border-[#1E2942] dark:bg-[#0D1322]">
                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    OCR 인식 결과
                  </div>

                  {[
                    { label: "가맹점명", value: transaction.merchantName },
                    { label: "결제금액", value: formatAmount(transaction.amount) },
                    { label: "결제일시", value: `${transaction.date} ${transaction.time}` },
                    { label: "사업자번호", value: bizNum },
                    { label: "승인번호", value: approvalNum },
                    { label: "카드번호", value: card?.cardNumber ?? "-" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-gray-100 py-1.5 last:border-0 dark:border-[#1E2942]/50"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-500">{item.label}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        거래내역과 영수증 정보가 일치합니다
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-500">
                        가맹점, 금액, 일시 모두 매칭 확인
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {!isVerified && (
            <Button
              disabled={ocrState !== "done"}
              onClick={() => {
                onVerify(transaction.id);
                onOpenChange(false);
              }}
              className="min-h-[44px] bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              증빙 완료
            </Button>
          )}
          <DialogClose render={<Button variant="outline" className="min-h-[44px]" />}>
            닫기
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
