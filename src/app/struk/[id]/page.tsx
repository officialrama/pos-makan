"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import GuestHeader from "@/components/GuestHeader";
import { useStore } from "@/lib/store";
import { rupiah, formatDateTime } from "@/lib/format";
import { PAYMENT_LABEL, type Order } from "@/lib/types";

const STEPS = [
  { key: "dibuat", title: "Pesanan dibuat", detail: "Pesanan tercatat di sistem kasir." },
  { key: "selesai", title: "Pesanan selesai", detail: "Pembayaran diterima, makanan diantar ke meja atau dibungkus." },
];

function stepIndex(order: Order): number {
  return order.status === "selesai" ? 1 : 0;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <GuestHeader title="Status pesanan" back="/menu" />
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
    </div>
  );
}

export default function OrderStatusPage() {
  const params = useParams<{ id: string }>();
  const { orders, ready } = useStore();
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

  const current = stepIndex(order);
  const cancelled = order.status === "batal";

  return (
    <Shell>
      <div className="card-soft p-6 text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            cancelled ? "bg-ink-300/25 text-ink-700" : "bg-go-50 text-go-600"
          }`}
        >
          {cancelled ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
              <path
                d="M7 7l10 10M17 7L7 17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <h1 className="mt-4 text-lg">
          {cancelled ? "Pesanan dibatalkan" : "Terima kasih, pesanan diterima"}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Kode pesanan <span className="font-medium text-ink-900">{order.code}</span> ·{" "}
          {formatDateTime(order.createdAt)}
        </p>
      </div>

      {!cancelled && (
        <div className="card-soft mt-4 p-5">
          <ol className="space-y-0">
            {STEPS.map((step, i) => {
              const done = i <= current;
              const last = i === STEPS.length - 1;
              return (
                <li key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        done ? "bg-go-500 text-white" : "bg-line text-ink-500"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    {!last && (
                      <span
                        className={`w-px flex-1 ${done ? "bg-go-200" : "bg-line"}`}
                      />
                    )}
                  </div>
                  <div className={last ? "pb-0" : "pb-6"}>
                    <p
                      className={`text-sm font-medium ${
                        done ? "text-ink-900" : "text-ink-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-500">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="card-soft mt-4 overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-base">Rincian pesanan</h2>
        </div>

        <dl className="space-y-2 border-b border-line px-5 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Atas nama</dt>
            <dd className="font-medium">{order.customerName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Meja</dt>
            <dd>{order.tableNo || "Dibungkus"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Pembayaran</dt>
            <dd>{PAYMENT_LABEL[order.paymentMethod]}</dd>
          </div>
        </dl>

        <ul className="space-y-3 px-5 py-4 text-sm">
          {order.items.map((i) => (
            <li key={i.menuId} className="flex justify-between gap-4">
              <span className="min-w-0">
                <span className="block">{i.name}</span>
                <span className="text-xs text-ink-500">
                  {i.qty} × {rupiah(i.price)}
                </span>
                {i.note && (
                  <span className="mt-0.5 block text-xs text-ink-500">
                    Catatan: {i.note}
                  </span>
                )}
              </span>
              <span className="shrink-0 tabular-nums">
                {rupiah(i.price * i.qty)}
              </span>
            </li>
          ))}
        </ul>

        {order.note && (
          <p className="mx-5 mb-4 rounded-xl bg-canvas p-3 text-xs text-ink-700">
            Catatan pesanan: {order.note}
          </p>
        )}

        <div className="flex items-baseline justify-between border-t border-line px-5 py-4">
          <span className="text-sm font-medium">Total</span>
          <span className="text-xl font-semibold tabular-nums">
            {rupiah(order.total)}
          </span>
        </div>
      </div>

      <Link href="/menu" className="btn-go-outline mt-5 w-full">
        Pesan lagi
      </Link>
    </Shell>
  );
}
