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
import type { Transaction } from "@/lib/dummy-data";
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

  // Reset state when dialog opens/closes or transaction changes
  useEffect(() => {
    if (!open) {
      // Small delay to allow close animation
      const t = setTimeout(() => {
        setUploadedImage(null);
        setOcrState("idle");
        setIsDragOver(false);
      }, 200);
      return () => clearTimeout(t);
    }
    // If already verified, show OCR result immediately
    if (isVerified) {
      setOcrState("done");
    }
  }, [open, transaction?.id, isVerified]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
      if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    };
  }, []);

  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Start fake OCR
        setOcrState("analyzing");
        analyzeTimerRef.current = setTimeout(() => {
          setOcrState("done");
        }, 2000);
      };
      reader.readAsDataURL(file);
    },
    []
  );

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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileImage className="h-5 w-5" />
            지출증빙
            {isVerified && !uploadedImage && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-0 ml-2">
                증빙완료
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            영수증 이미지를 첨부하여 지출을 증빙합니다
          </DialogDescription>
        </DialogHeader>

        {/* 거래 정보 요약 */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#1E2942] dark:bg-[#0A0E1A]">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-500">거래일시</span>
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {transaction.date} {transaction.time}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">가맹점</span>
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {transaction.merchantName}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">결제금액</span>
              <p className="font-bold text-lg text-gray-900 dark:text-white">
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
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {transaction.category}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-500">계정과목</span>
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {transaction.accountCode}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 왼쪽: 영수증 이미지 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              영수증 이미지
            </h3>

            {isVerified && !uploadedImage ? (
              /* 이미 증빙된 건: 가라 영수증 표시 */
              <div className="space-y-3">
                <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-3 dark:border-[#1E2942] dark:bg-[#0D1322]">
                  <ReceiptCanvas transaction={transaction} width={260} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleReupload}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  영수증 재첨부
                </Button>
              </div>
            ) : uploadedImage ? (
              /* 업로드된 이미지 프리뷰 */
              <div className="space-y-3">
                <div className="relative rounded-lg border border-gray-200 bg-white dark:border-[#1E2942] dark:bg-[#0D1322] overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="영수증"
                    className="w-full object-contain max-h-[340px]"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleReupload}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  다른 이미지 선택
                </Button>
              </div>
            ) : (
              /* 업로드 영역 */
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors min-h-[260px] ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-[#1E2942] dark:bg-[#0A0E1A] dark:hover:border-[#2A3A5C] dark:hover:bg-[#0D1322]"
                }`}
              >
                <Upload className="h-10 w-10 text-gray-400 dark:text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  이미지를 드래그하거나 클릭하여 선택
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                  JPG, PNG, HEIC 지원
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" type="button" onClick={(e) => e.stopPropagation()}>
                    <Camera className="mr-2 h-4 w-4" />
                    카메라 촬영
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* 오른쪽: AI OCR 분석 결과 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              AI OCR 분석 결과
            </h3>

            {ocrState === "idle" && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 min-h-[260px] dark:border-[#1E2942] dark:bg-[#0A0E1A]">
                <Sparkles className="h-8 w-8 text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-600 text-center">
                  영수증 이미지를 업로드하면
                  <br />
                  AI가 자동으로 분석합니다
                </p>
              </div>
            )}

            {ocrState === "analyzing" && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-8 min-h-[260px] dark:border-blue-500/20 dark:bg-blue-500/5">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  AI 분석 중...
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
                  영수증 텍스트를 인식하고 있습니다
                </p>
                <div className="mt-4 w-full max-w-[200px]">
                  <div className="h-1.5 rounded-full bg-blue-200 dark:bg-blue-500/20 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 animate-pulse" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            )}

            {ocrState === "done" && (
              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-[#1E2942] dark:bg-[#0D1322] space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-2">
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
                      className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 dark:border-[#1E2942]/50"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 매칭 결과 */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        거래내역과 영수증 정보가 일치합니다
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              증빙 완료
            </Button>
          )}
          <DialogClose
            render={<Button variant="outline" />}
          >
            닫기
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
