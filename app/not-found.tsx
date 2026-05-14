import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-3xl font-extrabold">페이지를 찾을 수 없습니다</h1>
      <p className="text-ink-muted mt-2">요청하신 카드 또는 페이지가 존재하지 않습니다.</p>
      <Link
        href="/"
        className="inline-block mt-6 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-semibold"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
