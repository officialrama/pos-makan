"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CartPanel from "@/components/CartPanel";
import FoodThumb from "@/components/FoodThumb";
import GuestHeader from "@/components/GuestHeader";
import ScrollRow from "@/components/ScrollRow";
import ItemSheet from "@/components/ItemSheet";
import StoreCover from "@/components/StoreCover";
import { useStore } from "@/lib/store";
import { rupiah } from "@/lib/format";
import { CATEGORIES, type Category, type MenuItem } from "@/lib/types";

type Filter = "Semua" | Category;

function CompactStepper({
  qty,
  name,
  onChange,
}: {
  qty: number;
  name: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-go-500 bg-white">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label={`Kurangi ${name}`}
        className="h-8 w-8 rounded-l-lg text-lg leading-none text-go-600 hover:bg-go-50"
      >
        −
      </button>
      <span className="text-sm font-semibold tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label={`Tambah ${name}`}
        className="h-8 w-8 rounded-r-lg text-lg leading-none text-go-600 hover:bg-go-50"
      >
        +
      </button>
    </div>
  );
}

function MenuCard({
  item,
  qty,
  onOpen,
  onQty,
}: {
  item: MenuItem;
  qty: number;
  onOpen: () => void;
  onQty: (n: number) => void;
}) {
  return (
    <article className={`card-soft flex gap-4 p-4 ${item.available ? "" : "opacity-70"}`}>
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 flex-col items-start justify-start text-left"
        aria-label={`Lihat detail ${item.name}`}
      >
        <h3 className="text-[15px] font-semibold">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {item.description}
        </p>
        <p className="mt-2 text-[15px] font-semibold">{rupiah(item.price)}</p>
      </button>

      <div className="flex w-24 shrink-0 flex-col items-center gap-2">
        <div className="relative">
          <FoodThumb
            category={item.category}
            image={item.image}
            alt={item.name}
            className="h-24 w-24"
          />
          {!item.available && (
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/75 text-xs font-semibold text-ink-700">
              Habis
            </span>
          )}
        </div>

        {item.available &&
          (qty === 0 ? (
            <button
              type="button"
              onClick={() => onQty(1)}
              className="w-full rounded-lg border border-go-500 bg-white py-1.5 text-sm font-semibold text-go-600 hover:bg-go-50"
            >
              Tambah
            </button>
          ) : (
            <CompactStepper qty={qty} name={item.name} onChange={onQty} />
          ))}
      </div>
    </article>
  );
}

export default function MenuPage() {
  const { menus, orders, cart, setQty, cartCount, cartTotal, ready } = useStore();
  const [filter, setFilter] = useState<Filter>("Semua");
  const [query, setQuery] = useState("");
  const [sheetId, setSheetId] = useState<string | null>(null);

  const searching = query.trim() !== "";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus.filter(
      (m) =>
        (filter === "Semua" || m.category === filter) &&
        (q === "" || m.name.toLowerCase().includes(q)),
    );
  }, [menus, filter, query]);

  const sections = useMemo(() => {
    return CATEGORIES.map((c) => ({
      category: c,
      items: visible.filter((m) => m.category === c),
    })).filter((s) => s.items.length > 0);
  }, [visible]);

  /** Menu terlaris dihitung dari riwayat pesanan yang tidak dibatalkan. */
  const popular = useMemo(() => {
    const count = new Map<string, number>();
    for (const o of orders) {
      if (o.status === "batal") continue;
      for (const i of o.items) count.set(i.menuId, (count.get(i.menuId) ?? 0) + i.qty);
    }
    return menus
      .filter((m) => m.available && count.has(m.id))
      .sort((a, b) => (count.get(b.id) ?? 0) - (count.get(a.id) ?? 0))
      .slice(0, 6);
  }, [orders, menus]);

  const sheetItem = menus.find((m) => m.id === sheetId) ?? null;

  return (
    <div className="min-h-screen bg-canvas pb-24 lg:pb-12">
      <GuestHeader />
      <StoreCover />

      <div className="mx-auto max-w-6xl px-4">
        <section className="card-soft relative z-10 -mt-10 p-5 sm:-mt-12 sm:p-6">
          <h1 className="text-xl sm:text-2xl">RM Padang Garuda</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Jl. Pemuda No. 12, Bandung · Masakan Padang
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="badge bg-go-50 text-go-700">Buka · 08.00–21.00</span>
            <span className="badge bg-canvas text-ink-700">Siap 15–25 menit</span>
            <span className="badge bg-canvas text-ink-700">Makan di tempat &amp; bungkus</span>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[190px_minmax(0,1fr)_330px] lg:items-start">
          <nav aria-label="Kategori" className="hidden lg:sticky lg:top-20 lg:block">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
              Kategori
            </p>
            <ul className="space-y-1">
              {(["Semua", ...CATEGORIES] as Filter[]).map((c) => {
                const active = filter === c;
                const total =
                  c === "Semua"
                    ? menus.length
                    : menus.filter((m) => m.category === c).length;
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => setFilter(c)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-go-50 font-medium text-go-700"
                          : "text-ink-700 hover:bg-white"
                      }`}
                    >
                      {c}
                      <span className="text-xs text-ink-500">{total}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0">
            <div className="sticky top-16 z-20 -mx-4 bg-canvas px-4 pb-3 pt-1 lg:static lg:mx-0 lg:px-0 lg:pt-0">
              <div className="relative">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M13.5 13.5L17 17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari menu, misalnya rendang"
                  aria-label="Cari menu"
                  className="input rounded-full pl-10"
                />
              </div>

              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto lg:hidden">
                {(["Semua", ...CATEGORIES] as Filter[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={`chip-go ${filter === c ? "chip-go-active" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {!searching && filter === "Semua" && popular.length > 0 && (
              <section className="mt-4">
                <h2 className="text-base">Paling sering dipesan</h2>
                <div className="mt-3">
                  <ScrollRow>
                    {popular.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSheetId(m.id)}
                        className="card-soft w-40 shrink-0 snap-start p-3 text-left transition-colors hover:border-go-500"
                      >
                        <FoodThumb
                          category={m.category}
                          image={m.image}
                          alt={m.name}
                          className="h-24 w-full"
                        />
                        <h3 className="mt-2.5 truncate text-sm font-semibold">
                          {m.name}
                        </h3>
                        <p className="mt-0.5 text-sm font-semibold text-go-600">
                          {rupiah(m.price)}
                        </p>
                      </button>
                    ))}
                  </ScrollRow>
                </div>
              </section>
            )}

            {sections.length === 0 ? (
              <div className="card-soft mt-4 p-10 text-center">
                <p className="text-sm text-ink-500">
                  Menu tidak ditemukan. Coba kata kunci atau kategori lain.
                </p>
              </div>
            ) : (
              sections.map((section) => (
                <section key={section.category} className="mt-6">
                  <h2 className="text-base">{section.category}</h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {section.items.map((m) => (
                      <MenuCard
                        key={m.id}
                        item={m}
                        qty={cart[m.id]?.qty ?? 0}
                        onOpen={() => setSheetId(m.id)}
                        onQty={(n) => setQty(m.id, n)}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>

          <aside className="hidden lg:sticky lg:top-20 lg:block">
            <CartPanel />
          </aside>
        </div>
      </div>

      {ready && cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 lg:hidden">
          <Link
            href="/checkout"
            className="mx-auto flex max-w-md items-center justify-between rounded-xl bg-go-500 px-5 py-3.5 text-white shadow-lg shadow-go-700/20 hover:bg-go-600"
          >
            <span className="text-sm">
              {cartCount} porsi · <span className="font-semibold">{rupiah(cartTotal)}</span>
            </span>
            <span className="text-sm font-semibold">Lihat keranjang →</span>
          </Link>
        </div>
      )}

      {sheetItem && (
        <ItemSheet
          item={sheetItem}
          initialQty={cart[sheetItem.id]?.qty ?? 0}
          initialNote={cart[sheetItem.id]?.note ?? ""}
          onClose={() => setSheetId(null)}
          onSave={(qty, note) => {
            setQty(sheetItem.id, qty, note);
            setSheetId(null);
          }}
        />
      )}
    </div>
  );
}
