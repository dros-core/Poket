import type { Currency } from "./types";

const formatters: Record<Currency, Intl.NumberFormat> = {
  KRW: new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }),
  JPY: new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })
};

export function formatPrice(value: number, currency: Currency = "KRW"): string {
  return formatters[currency].format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatPct(value: number, fractionDigits = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function formatRelativeTime(iso: string): string {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.round((now - target) / 60000);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  const diffMonth = Math.round(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${Math.round(diffMonth / 12)}년 전`;
}
