"use client";

import Link from "next/link";
import FoodThumb from "./FoodThumb";
import QtyStepper from "./QtyStepper";
import { useStore } from "@/lib/store";
import { rupiah } from "@/lib/format";
import type { Category } from "@/lib/types";

/** Ringkasan keranjang. Dipakai di kolom kanan halaman menu (layar besar). */
export default function CartPanel() {
  const { cartItems, cartTotal, cartCount, setQty, menus } = useStore();

  if (cartItems.length === 0) {
    return (
      <div className="card-soft p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-canvas">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-ink-300" aria-hidden="true">
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
        <p className="mt-3 text-sm font-medium">Keranjang masih kosong</p>
        <p className="mt-1 text-xs text-ink-500">
          Pilih menu di sebelah kiri untuk mulai memesan.
        </p>
      </div>
    );
  }

  return (
    <div className="card-soft overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold">Keranjang</h2>
        <span className="text-xs text-ink-500">{cartCount} porsi</span>
      </div>

      <ul className="max-h-[42vh] divide-y divide-line overflow-y-auto">
        {cartItems.map((item) => {
          const menu = menus.find((m) => m.id === item.menuId);
          return (
            <li key={item.menuId} className="flex gap-3 px-5 py-4">
              <FoodThumb
                category={(menu?.category ?? "Lauk") as Category}
                image={menu?.image}
                alt={item.name}
                className="h-12 w-12 shrink-0"
                rounded="rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-ink-500">{rupiah(item.price)}</p>
                {item.note && (
                  <p className="mt-1 truncate text-xs text-ink-500">
                    Catatan: {item.note}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <QtyStepper
                    qty={item.qty}
                    label={item.name}
                    onChange={(n) => setQty(item.menuId, n)}
                  />
                  <span className="text-sm font-semibold tabular-nums">
                    {rupiah(item.price * item.qty)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-line p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink-500">Total</span>
          <span className="text-lg font-semibold tabular-nums">
            {rupiah(cartTotal)}
          </span>
        </div>
        <Link href="/checkout" className="btn-go mt-4 w-full">
          Lanjut ke pembayaran
        </Link>
      </div>
    </div>
  );
}
