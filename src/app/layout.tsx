import type { Metadata } from "next";
import Link from "next/link";
import { DATA_FETCHED_AT } from "@/lib/heroData";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dota2Pick — ออกของ & แก้ทาง",
  description: "คู่มือออกของตามตำแหน่ง pos 1-5 และแก้ทางฮีโร่ฝั่งตรงข้าม",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="antialiased">
        <header className="border-b border-[var(--color-line)]/80 bg-[#0d1017]/80 backdrop-blur sticky top-0 z-20">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Dota<span className="text-[var(--color-accent)]">2</span>Pick
            </Link>
            <nav className="flex gap-4 text-sm text-[var(--color-muted)]">
              <Link href="/" className="hover:text-white">
                ฮีโร่
              </Link>
              <Link href="/counter" className="hover:text-white">
                แก้ทางฝั่งตรงข้าม
              </Link>
              <Link href="/items" className="hover:text-white">
                ไอเทม
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-10 text-xs text-[var(--color-muted)]">
          ฮีโร่ ไอเทม และ winrate จาก OpenDota · คำแนะนำการออกของและเหตุผลแก้ทางเขียนเอง · ข้อมูลสถิติดึงเมื่อ{" "}
          {new Date(DATA_FETCHED_AT).toLocaleDateString("th-TH")}
        </footer>
      </body>
    </html>
  );
}
