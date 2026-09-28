"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useStore, ADMIN_ACCOUNTS } from "@/lib/store";
import { ROLE_LABEL } from "@/lib/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin, ready } = useStore();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && isAdmin) router.replace("/admin/pesanan");
  }, [ready, isAdmin, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (login(user, pass)) {
      router.replace("/admin/pesanan");
    } else {
      setError("Username atau password salah.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <Link href="/" className="text-sm text-ink-500 hover:text-ink-900">
        ← Halaman utama
      </Link>

      <div className="card mt-4 p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink-900 text-sm font-bold text-white">
          RG
        </span>
        <h1 className="mt-4 text-xl">Masuk sebagai admin</h1>
        <p className="mt-1 text-sm text-ink-500">
          Kelola menu, harga, dan riwayat pesanan.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="user" className="label">
              Username
            </label>
            <input
              id="user"
              className="input"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setError("");
              }}
              autoComplete="username"
              placeholder="admin"
            />
          </div>
          <div>
            <label htmlFor="pass" className="label">
              Password
            </label>
            <input
              id="pass"
              type="password"
              className="input"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-brand-600">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            Masuk
          </button>
        </form>

        <div className="mt-5 rounded-md bg-canvas p-3 text-xs leading-relaxed text-ink-500">
          <p className="font-medium text-ink-700">Akun demo untuk mockup</p>
          <ul className="mt-1.5 space-y-1">
            {ADMIN_ACCOUNTS.map((a) => (
              <li key={a.username}>
                <code className="font-semibold">{a.username}</code> /{" "}
                <code className="font-semibold">{a.password}</code> —{" "}
                {ROLE_LABEL[a.role]}
                {a.role === "utama"
                  ? " (bisa membuka riwayat tersembunyi)"
                  : " (tanpa akses riwayat tersembunyi)"}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            Pada aplikasi sungguhan, login dan pembatasan aksesnya diverifikasi
            di server.
          </p>
        </div>
      </div>
    </main>
  );
}
