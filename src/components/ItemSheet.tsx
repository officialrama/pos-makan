"use client";

import { useEffect, useState } from "react";
import FoodThumb from "./FoodThumb";
import QtyStepper from "./QtyStepper";
import { rupiah } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

interface Props {
  item: MenuItem;
  initialQty: number;
  initialNote: string;
  onClose: () => void;
  onSave: (qty: number, note: string) => void;
}

/**
 * Detail item: tampil sebagai lembar bawah di layar kecil dan dialog tengah
 * di layar besar.
 */
export default function ItemSheet({
  item,
  initialQty,
  initialNote,
  onClose,
  onSave,
}: Props) {
  const [qty, setQty] = useState(Math.max(initialQty, 1));
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-ink-900/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="relative flex max-h-[88vh] w-full flex-col overflow-y-auto rounded-t-2xl bg-white sm:max-w-md sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-sm hover:bg-white"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <FoodThumb
          category={item.category}
          image={item.image}
          alt={item.name}
          className="h-40 w-full sm:h-48"
          rounded="rounded-t-2xl"
        />

        <div className="p-5">
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="mt-1 text-[15px] font-semibold text-go-600">
            {rupiah(item.price)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            {item.description}
          </p>

          <div className="mt-5">
            <label htmlFor="catatan-item" className="label">
              Catatan untuk dapur{" "}
              <span className="font-normal text-ink-500">(opsional)</span>
            </label>
            <textarea
              id="catatan-item"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: tanpa sambal, nasi setengah"
              className="input min-h-[72px] resize-y rounded-xl"
              maxLength={120}
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-white p-4">
          <QtyStepper qty={qty} label={item.name} onChange={setQty} />
          <button
            type="button"
            onClick={() => onSave(qty, note)}
            className="btn-go flex-1 justify-between"
          >
            <span>{initialQty > 0 ? "Perbarui" : "Tambah"}</span>
            <span className="tabular-nums">{rupiah(item.price * qty)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
