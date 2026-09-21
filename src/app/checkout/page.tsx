"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import FoodThumb from "@/components/FoodThumb";
import GuestHeader from "@/components/GuestHeader";
import QtyStepper from "@/components/QtyStepper";
import { useStore } from "@/lib/store";
import { rupiah } from "@/lib/format";
import type { Category, PaymentMethod } from "@/lib/types";

function QrisIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <path d="M14 14h3v3h-3zM19 19h2M19 14h2v2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-5 9 5z" />
        <path d="M5 9v8M10 9v8M14 9v8M19 9v8" />
        <path d="M3 20h18" />
      </g>
    </svg>
  );
}

const PAYMENTS: {
  value: PaymentMethod;
  title: string;
  detail: string;
  icon: () => JSX.Element;
}[] = [
  {
    value: "qris",
    title: "QRIS",
    detail: "Pindai kode QR lewat aplikasi bank atau e-wallet.",
    icon: QrisIcon,
  },
  {
    value: "transfer",
    title: "Transfer bank",
    detail: "Transfer ke rekening kasir, lalu konfirmasi pembayaran.",
    icon: BankIcon,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, cartCount, setQty, setItemNote, createOrder, menus, ready } =
    useStore();

  const [name, setName] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("qris");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Nama pemesan wajib diisi minimal 2 huruf.");
      return;
    }
    const order = createOrder({
      customerName: name,
      tableNo,
      note,
      paymentMethod: payment,
    });
    if (!order) {
      setError("Keranjang masih kosong.");
      return;
    }
    router.push(`/pembayaran/${order.id}`);
  }

  if (ready && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-canvas">
        <GuestHeader title="Keranjang" back="/menu" />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-ink-300" aria-hidden="true">
              <path
                d="M4 6h3l2 11h9l2-8H8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.3" fill="currentColor" />
              <circle cx="18" cy="20" r="1.3" fill="currentColor" />
            </svg>
          </div>
          <h1 className="mt-4 text-lg">Keranjang masih kosong</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Pilih dulu menu yang ingin dipesan.
          </p>
          <Link href="/menu" className="btn-go mt-6">
            Lihat daftar menu
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pb-28 lg:pb-12">
      <GuestHeader title="Keranjang" back="/menu" />

      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
      >
        <div className="space-y-5">
          <section className="card-soft overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-base">Pesanan kamu</h2>
              <Link
                href="/menu"
                className="text-sm font-medium text-go-600 hover:underline"
              >
                + Tambah menu
              </Link>
            </div>

            <ul className="divide-y divide-line">
              {cartItems.map((item) => {
                const menu = menus.find((m) => m.id === item.menuId);
                return (
                  <li key={item.menuId} className="flex gap-4 px-5 py-4">
                    <FoodThumb
                      category={(menu?.category ?? "Lauk") as Category}
                      image={menu?.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-medium">
                            {item.name}
                          </p>
                          <p className="text-xs text-ink-500">
                            {rupiah(item.price)} / porsi
                          </p>
                        </div>
                        <span className="shrink-0 text-[15px] font-semibold tabular-nums">
                          {rupiah(item.price * item.qty)}
                        </span>
                      </div>

                      <input
                        value={item.note ?? ""}
                        onChange={(e) => setItemNote(item.menuId, e.target.value)}
                        placeholder="Catatan untuk dapur (opsional)"
                        aria-label={`Catatan untuk ${item.name}`}
                        className="input mt-3 rounded-lg px-3 py-1.5 text-xs"
                        maxLength={120}
                      />

                      <div className="mt-3">
                        <QtyStepper
                          qty={item.qty}
                          label={item.name}
                          onChange={(n) => setQty(item.menuId, n)}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card-soft p-5">
            <h2 className="text-base">Data pemesan</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="nama" className="label">
                  Pesanan atas nama <span className="text-brand-600">*</span>
                </label>
                <input
                  id="nama"
                  className="input rounded-xl"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="Contoh: Rama"
                  autoComplete="name"
                />
                <p className="hint">Nama ini yang dipanggil saat pesanan siap.</p>
              </div>
              <div>
                <label htmlFor="meja" className="label">
                  Nomor meja{" "}
                  <span className="font-normal text-ink-500">(opsional)</span>
                </label>
                <input
                  id="meja"
                  className="input rounded-xl"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  placeholder="Kosongkan jika dibungkus"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label htmlFor="catatan" className="label">
                  Catatan pesanan{" "}
                  <span className="font-normal text-ink-500">(opsional)</span>
                </label>
                <input
                  id="catatan"
                  className="input rounded-xl"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Misal: tolong siap jam 12"
                />
              </div>
            </div>
          </section>

          <section className="card-soft p-5">
            <h2 className="text-base">Metode pembayaran</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PAYMENTS.map((p) => {
                const Icon = p.icon;
                const active = payment === p.value;
                return (
                  <label
                    key={p.value}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                      active
                        ? "border-go-500 bg-go-50"
                        : "border-line hover:border-ink-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pembayaran"
                      value={p.value}
                      checked={active}
                      onChange={() => setPayment(p.value)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 shrink-0 ${
                        active ? "text-go-600" : "text-ink-500"
                      }`}
                    >
                      <Icon />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{p.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                        {p.detail}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="card-soft p-5 lg:sticky lg:top-20">
          <h2 className="text-base">Ringkasan</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Jumlah porsi</dt>
              <dd className="tabular-nums">{cartCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Subtotal</dt>
              <dd className="tabular-nums">{rupiah(cartTotal)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm font-medium">Total bayar</span>
            <span className="text-xl font-semibold tabular-nums">
              {rupiah(cartTotal)}
            </span>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-brand-600">
              {error}
            </p>
          )}

          <button type="submit" className="btn-go mt-4 hidden w-full lg:flex">
            Buat pesanan
          </button>
          <p className="hint hidden text-center lg:block">
            Pesanan diteruskan ke kasir setelah pembayaran dikonfirmasi.
          </p>
        </aside>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-4">
            <div>
              <p className="text-xs text-ink-500">{cartCount} porsi</p>
              <p className="text-base font-semibold tabular-nums">
                {rupiah(cartTotal)}
              </p>
            </div>
            <button type="submit" className="btn-go">
              Buat pesanan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
