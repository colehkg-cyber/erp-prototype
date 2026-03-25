"use client";

import { useEffect, useRef } from "react";
import type { Transaction } from "@/lib/dummy-data";
import { getCardById, formatAmount } from "@/lib/dummy-data";

// 가라 사업자번호/승인번호 생성 (deterministic)
function fakeBusinessNumber(seed: string) {
  const n = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const p1 = String(100 + (n % 900)).padStart(3, "0");
  const p2 = String(10 + ((n * 7) % 90)).padStart(2, "0");
  const p3 = String(10000 + ((n * 13) % 90000)).padStart(5, "0");
  return `${p1}-${p2}-${p3}`;
}

function fakeApprovalNumber(seed: string) {
  const n = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  return String(10000000 + ((n * 31) % 90000000));
}

// 가라 품목 생성
function fakeLineItems(txn: Transaction) {
  const categoryItems: Record<string, { name: string; unit: string }[]> = {
    식비: [
      { name: "식사", unit: "식" },
      { name: "음료", unit: "잔" },
    ],
    교통비: [
      { name: "운행요금", unit: "회" },
      { name: "주유", unit: "L" },
    ],
    사무용품: [
      { name: "사무용품", unit: "개" },
      { name: "복사용지", unit: "박스" },
    ],
    접대비: [
      { name: "식사(접대)", unit: "식" },
      { name: "음료", unit: "병" },
    ],
    통신비: [{ name: "통신요금", unit: "월" }],
    복리후생: [
      { name: "복리후생", unit: "건" },
      { name: "간식", unit: "개" },
    ],
    기타: [{ name: "기타", unit: "건" }],
  };

  const items = categoryItems[txn.category] || categoryItems["기타"];
  const mainItem = items[0];

  // 부가세 포함 역산
  const supply = Math.round(txn.amount / 1.1);
  const vat = txn.amount - supply;

  return { mainItem, supply, vat, total: txn.amount };
}

interface ReceiptCanvasProps {
  transaction: Transaction;
  width?: number;
  className?: string;
}

export default function ReceiptCanvas({
  transaction: txn,
  width = 320,
  className,
}: ReceiptCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const card = getCardById(txn.cardId);
  const { mainItem, supply, vat, total } = fakeLineItems(txn);
  const bizNum = fakeBusinessNumber(txn.id);
  const approvalNum = fakeApprovalNumber(txn.id);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = 2; // retina
    const W = width;
    const H = 520;
    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);

    // 배경 — 감열지 색상
    ctx.fillStyle = "#FFFEF5";
    ctx.fillRect(0, 0, W, H);

    // 미세한 노이즈 텍스처
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const alpha = Math.random() * 0.04;
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // 좌우 감열지 테두리 효과
    const edgeGrad = ctx.createLinearGradient(0, 0, 12, 0);
    edgeGrad.addColorStop(0, "rgba(200,190,170,0.15)");
    edgeGrad.addColorStop(1, "rgba(200,190,170,0)");
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, 12, H);
    const edgeGrad2 = ctx.createLinearGradient(W - 12, 0, W, 0);
    edgeGrad2.addColorStop(0, "rgba(200,190,170,0)");
    edgeGrad2.addColorStop(1, "rgba(200,190,170,0.15)");
    ctx.fillStyle = edgeGrad2;
    ctx.fillRect(W - 12, 0, 12, H);

    // 텍스트 설정
    const textColor = "#1a1a1a";
    const lightColor = "#555";
    const px = 28; // padding x
    let y = 32;

    const font = (size: number, bold = false) => {
      ctx.font = `${bold ? "bold " : ""}${size}px "D2Coding", "Noto Sans Mono", "Courier New", monospace`;
    };

    const drawText = (
      text: string,
      x: number,
      yPos: number,
      align: CanvasTextAlign = "left"
    ) => {
      ctx.textAlign = align;
      ctx.fillText(text, x, yPos);
    };

    const drawLine = (yPos: number, char = "─") => {
      font(11);
      ctx.fillStyle = "#aaa";
      const line = char.repeat(40);
      drawText(line, W / 2, yPos, "center");
      ctx.fillStyle = textColor;
    };

    const drawDashedLine = (yPos: number) => {
      font(11);
      ctx.fillStyle = "#bbb";
      const line = "- ".repeat(24);
      drawText(line, W / 2, yPos, "center");
      ctx.fillStyle = textColor;
    };

    // === 영수증 내용 시작 ===

    // 가맹점명 (크게, 중앙정렬)
    ctx.fillStyle = textColor;
    font(18, true);
    drawText(txn.merchantName, W / 2, y, "center");
    y += 24;

    // 사업자번호
    font(11);
    ctx.fillStyle = lightColor;
    drawText(`사업자번호: ${bizNum}`, W / 2, y, "center");
    y += 16;
    drawText("서울특별시 강남구 테헤란로 123", W / 2, y, "center");
    y += 14;
    drawText("TEL: 02-1234-5678", W / 2, y, "center");
    y += 20;

    // 구분선
    drawLine(y, "═");
    y += 18;

    // 거래일시
    ctx.fillStyle = textColor;
    font(12);
    drawText("거래일시", px, y);
    drawText(`${txn.date} ${txn.time}`, W - px, y, "right");
    y += 20;

    drawDashedLine(y);
    y += 18;

    // 품목 헤더
    font(11, true);
    ctx.fillStyle = lightColor;
    drawText("품  목", px, y);
    drawText("수량", W / 2 - 10, y, "center");
    drawText("단  가", W - px - 70, y, "right");
    drawText("금  액", W - px, y, "right");
    y += 18;
    drawDashedLine(y);
    y += 18;

    // 품목
    ctx.fillStyle = textColor;
    font(12);
    drawText(mainItem.name, px, y);
    drawText(`1 ${mainItem.unit}`, W / 2 - 10, y, "center");
    drawText(formatAmount(supply), W - px - 70, y, "right");
    drawText(formatAmount(supply), W - px, y, "right");
    y += 22;

    drawLine(y);
    y += 20;

    // 공급가액 / 부가세
    font(12);
    drawText("공급가액", px, y);
    drawText(formatAmount(supply), W - px, y, "right");
    y += 20;

    drawText("부 가 세", px, y);
    drawText(formatAmount(vat), W - px, y, "right");
    y += 22;

    drawLine(y, "═");
    y += 22;

    // 합계 (크게)
    font(16, true);
    drawText("합    계", px, y);
    drawText(formatAmount(total), W - px, y, "right");
    y += 28;

    drawLine(y, "═");
    y += 22;

    // 결제 정보
    font(12);
    ctx.fillStyle = textColor;
    drawText("결제수단", px, y);
    drawText("신용카드", W - px, y, "right");
    y += 20;

    drawText("카드종류", px, y);
    drawText(card?.cardCompany ?? "-", W - px, y, "right");
    y += 20;

    drawText("카드번호", px, y);
    drawText(card?.cardNumber ?? "-", W - px, y, "right");
    y += 20;

    drawText("승인번호", px, y);
    drawText(approvalNum, W - px, y, "right");
    y += 20;

    drawText("할부기간", px, y);
    drawText("일시불", W - px, y, "right");
    y += 22;

    drawDashedLine(y);
    y += 22;

    // 하단 안내문구
    font(10);
    ctx.fillStyle = lightColor;
    drawText("이 영수증은 소득공제용으로 사용할 수 있습니다.", W / 2, y, "center");
    y += 16;
    drawText("※ 부가가치세법에 의한 신용카드 매출전표", W / 2, y, "center");
    y += 24;

    // 고객용 표시
    font(13, true);
    ctx.fillStyle = "#888";
    drawText("[ 고 객 용 ]", W / 2, y, "center");
  }, [txn, card, mainItem, supply, vat, total, bizNum, approvalNum, width]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        borderRadius: "4px",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))",
      }}
    />
  );
}

// Export helper functions for use in dialog
export { fakeBusinessNumber, fakeApprovalNumber };
