"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { ROLE_LABEL } from "@/lib/types";

const NAV = [
  { href: "/admin/pesanan", label: "Riwayat pesanan" },
  { href: "/admin/menu", label: "Kelola menu" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, ready, logout, resetDemo, session } = useStore();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (ready && !isAdmin && !isLoginPage) router.replace("/admin/login");
  }, [ready, isAdmin, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!ready || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-ink-500">Memeriksa akses…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-900 text-sm font-bold text-white">
              RG
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold">Panel Admin</span>
              <span className="block text-xs text-ink-500">RM Padang Garuda</span>
            </span>
            {session && (
              <span className="ml-1.5 hidden items-center gap-2 border-l border-line pl-3 sm:inline-flex">
                <span className="text-sm text-ink-700">{session.username}</span>
                <span
                  className={`badge ${
                    session.role === "utama"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-canvas text-ink-700"
                  }`}
                >
                  {ROLE_LABEL[session.role]}
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Link href="/menu" className="btn-ghost btn-sm">
              Lihat sisi tamu
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/admin/login");
              }}
              className="btn-outline btn-sm"
            >
              Keluar
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-6xl px-4">
          <ul className="-mb-px flex gap-6">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`inline-block border-b-2 py-3 text-sm transition-colors ${
                      active
                        ? "border-brand-500 font-medium text-ink-900"
                        : "border-transparent text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pb-10 pt-4 text-xs text-ink-500">
        <button
          type="button"
          onClick={resetDemo}
          className="underline underline-offset-2 hover:text-ink-900"
        >
          Kembalikan data contoh
        </button>
      </footer>
    </div>
  );
}
