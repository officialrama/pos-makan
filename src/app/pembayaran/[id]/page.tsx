"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import GuestHeader from "@/components/GuestHeader";
import QrisPlaceholder from "@/components/QrisPlaceholder";
import { useStore } from "@/lib/store";
import { rupiah } from "@/lib/format";

/** Rekening contoh untuk mockup, bukan rekening sungguhan. */
const BANK = {
  name: "Bank BCA",
  number: "1234567890",
  holder: "RM Padang Garuda",
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <GuestHeader title="Pembayaran" back="/checkout" />
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
    </div>
  );
}

export default function PaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { orders, setOrderStatus, ready } = useStore();
  const [copied, setCopied] = useState(false);

  const order = orders.find((o) => o.id === params.id);

  if (!ready) {
    return (
      <Shell>
        <p className="text-sm text-ink-500">Memuat pesanan…</p>
      </Shell>
    );
  }

  if (!order) {
    return (
      <Shell>
        <div className="card-soft p-10 text-center">
          <h1 className="text-lg">Pesanan tidak ditemukan</h1>
          <Link href="/menu" className="btn-go mt-6">
            Kembali ke menu
          </Link>
        </div>
      </Shell>
    );
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(BANK.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function confirmPaid() {
    if (!order) return;
    // Tidak ada status antara: begitu dibayar, pesanan langsung selesai.
    setOrderStatus(order.id, "selesai");
    router.push(`/struk/${order.id}`);
  }

  return (
    <Shell>
      <div className="card-soft overflow-hidden">
        <div className="bg-go-50 px-5 py-4 text-center">
          <p className="text-xs text-go-700">Kode pesanan {order.code}</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-go-700">
            {rupiah(order.total)}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            {order.paymentMethod === "qris"
              ? "Bayar dengan QRIS"
              : "Transfer ke rekening kasir"}
          </p>
        </div>

        {order.paymentMethod === "qris" ? (
          <div className="flex flex-col items-center px-5 py-7">
            <QrisPlaceholder code={order.code} />
            <p className="mt-4 text-center text-sm text-ink-500">
              Pindai kode di atas lewat aplikasi bank atau e-wallet yang mendukung
              QRIS.
            </p>
            <p className="mt-2 text-center text-xs text-ink-300">
              Kode contoh untuk mockup — tidak dapat dipindai.
            </p>
          </div>
        ) : (
          <div className="px-5 py-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Bank</dt>
                <dd className="font-medium">{BANK.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-500">Nomor rekening</dt>
                <dd className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{BANK.number}</span>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-go-600 hover:bg-go-50"
                  >
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Atas nama</dt>
                <dd className="font-medium">{BANK.holder}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-ink-300">
              Rekening contoh untuk mockup — bukan rekening sungguhan.
            </p>
          </div>
        )}
      </div>

      <div className="card-soft mt-4 p-5">
        <h2 className="text-sm font-semibold">Rincian pesanan</h2>
        <ul className="mt-3 space-y-2.5 text-sm">
          {order.items.map((i) => (
            <li key={i.menuId} className="flex justify-between gap-4">
              <span className="min-w-0">
                <span className="block text-ink-700">
                  {i.name} <span className="text-ink-500">×{i.qty}</span>
                </span>
                {i.note && (
                  <span className="block text-xs text-ink-500">{i.note}</span>
                )}
              </span>
              <span className="shrink-0 tabular-nums">
                {rupiah(i.price * i.qty)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-line pt-3 text-sm text-ink-500">
          Atas nama{" "}
          <span className="font-medium text-ink-900">{order.customerName}</span>
          {order.tableNo && ` · Meja ${order.tableNo}`}
        </p>
      </div>

      <button onClick={confirmPaid} className="btn-go mt-5 w-full">
        Saya sudah bayar
      </button>
      <Link href="/menu" className="btn-ghost mt-2 w-full">
        Batal, kembali ke menu
      </Link>
    </Shell>
  );
}
