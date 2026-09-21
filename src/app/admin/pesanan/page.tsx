"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import StatusBadge from "@/components/StatusBadge";
import { useStore } from "@/lib/store";
import { rupiah, toDateKey, shiftDays, formatDate, formatTime } from "@/lib/format";
import {
  PAYMENT_LABEL,
  STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "@/lib/types";

type Quick = "hari-ini" | "7-hari" | "30-hari" | "semua" | "kustom";
type Tab = "aktif" | "tersembunyi";

const QUICK: { value: Quick; label: string }[] = [
  { value: "hari-ini", label: "Hari ini" },
  { value: "7-hari", label: "7 hari terakhir" },
  { value: "30-hari", label: "30 hari terakhir" },
  { value: "semua", label: "Semua tanggal" },
];

export default function AdminOrdersPage() {
  const { orders, setOrderStatus, setOrdersHidden } = useStore();

  const [tab, setTab] = useState<Tab>("aktif");
  const [quick, setQuick] = useState<Quick>("7-hari");
  const [from, setFrom] = useState(shiftDays(-6));
  const [to, setTo] = useState(toDateKey(new Date()));
  const [status, setStatus] = useState<"semua" | OrderStatus>("semua");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ ids: string[]; hidden: boolean } | null>(
    null,
  );

  // Pesan konfirmasi cukup tampil sebentar.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 8000);
    return () => clearTimeout(timer);
  }, [notice]);

  function applyQuick(value: Quick) {
    setQuick(value);
    const today = toDateKey(new Date());
    if (value === "hari-ini") {
      setFrom(today);
      setTo(today);
    } else if (value === "7-hari") {
      setFrom(shiftDays(-6));
      setTo(today);
    } else if (value === "30-hari") {
      setFrom(shiftDays(-29));
      setTo(today);
    } else if (value === "semua") {
      setFrom("");
      setTo("");
    }
  }

  const matchesFilter = useCallback(
    (o: Order) => {
      const q = query.trim().toLowerCase();
      const key = toDateKey(o.createdAt);
      if (from && key < from) return false;
      if (to && key > to) return false;
      if (status !== "semua" && o.status !== status) return false;
      if (
        q &&
        !o.customerName.toLowerCase().includes(q) &&
        !o.code.toLowerCase().includes(q)
      )
        return false;
      return true;
    },
    [from, to, status, query],
  );

  const { activeRows, hiddenRows } = useMemo(() => {
    const match = [...orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter(matchesFilter);
    return {
      activeRows: match.filter((o) => !o.hidden),
      hiddenRows: match.filter((o) => o.hidden),
    };
  }, [orders, matchesFilter]);

  const hiddenTotal = useMemo(() => orders.filter((o) => o.hidden).length, [orders]);

  const rows = tab === "aktif" ? activeRows : hiddenRows;
  const selectedRows = rows.filter((o) => selected.includes(o.id));
  const allChecked = rows.length > 0 && selectedRows.length === rows.length;
  const someChecked = selectedRows.length > 0 && !allChecked;

  const revenue = rows
    .filter((o) => o.status !== "batal")
    .reduce((sum, o) => sum + o.total, 0);
  const porsi = rows.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0),
    0,
  );

  function switchTab(next: Tab) {
    setTab(next);
    setSelected([]);
    setOpenId(null);
    setNotice(null);
  }

  function toggleRow(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    setSelected(allChecked ? [] : rows.map((o) => o.id));
  }

  /** Pindahkan pesanan antara riwayat utama dan riwayat tersembunyi. */
  function applyHidden(ids: string[], hidden: boolean) {
    if (ids.length === 0) return;
    setOrdersHidden(ids, hidden);
    setSelected([]);
    setOpenId(null);
    setNotice({ ids, hidden });
  }

  function undoNotice() {
    if (!notice) return;
    setOrdersHidden(notice.ids, !notice.hidden);
    setNotice(null);
  }

  return (
    <div>
      <h1 className="text-xl">Riwayat pesanan</h1>
      <p className="mt-1 text-sm text-ink-500">
        Saring pesanan berdasarkan tanggal, status, atau nama pemesan. Klik kode
        pesanan untuk melihat rincian item dan mengubah statusnya. Centang
        pesanan lalu sembunyikan bila tidak ingin tampil di riwayat utama —
        datanya tetap tersimpan di tab Riwayat tersembunyi.
      </p>

      <div className="mt-5 flex flex-wrap gap-1 border-b border-line">
        <TabButton
          active={tab === "aktif"}
          count={activeRows.length}
          onClick={() => switchTab("aktif")}
        >
          Riwayat pesanan
        </TabButton>
        <TabButton
          active={tab === "tersembunyi"}
          count={hiddenTotal}
          onClick={() => switchTab("tersembunyi")}
        >
          Riwayat tersembunyi
        </TabButton>
      </div>

      <section className="card mt-4 p-5">
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.value}
              type="button"
              onClick={() => applyQuick(q.value)}
              className={`chip ${quick === q.value ? "chip-active" : ""}`}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="dari" className="label">
              Dari tanggal
            </label>
            <input
              id="dari"
              type="date"
              className="input"
              value={from}
              max={to || undefined}
              onChange={(e) => {
                setFrom(e.target.value);
                setQuick("kustom");
              }}
            />
          </div>
          <div>
            <label htmlFor="sampai" className="label">
              Sampai tanggal
            </label>
            <input
              id="sampai"
              type="date"
              className="input"
              value={to}
              min={from || undefined}
              onChange={(e) => {
                setTo(e.target.value);
                setQuick("kustom");
              }}
            />
          </div>
          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as "semua" | OrderStatus)}
            >
              <option value="semua">Semua status</option>
              {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cari" className="label">
              Cari
            </label>
            <input
              id="cari"
              type="search"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nama atau kode pesanan"
            />
          </div>
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-white px-4 py-3 text-sm"
        >
          <p className="text-ink-700">
            {notice.ids.length} pesanan{" "}
            {notice.hidden
              ? "dipindahkan ke Riwayat tersembunyi."
              : "dikembalikan ke Riwayat pesanan."}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={undoNotice} className="btn-outline btn-sm">
              Urungkan
            </button>
            <button
              type="button"
              onClick={() => switchTab(notice.hidden ? "tersembunyi" : "aktif")}
              className="btn-ghost btn-sm"
            >
              Lihat
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-ink-500">Jumlah pesanan</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{rows.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-ink-500">Porsi terjual</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{porsi}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-ink-500">Pendapatan (tanpa yang dibatalkan)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{rupiah(revenue)}</p>
        </div>
      </div>

      {tab === "aktif" && hiddenTotal > 0 && (
        <p className="mt-3 text-xs text-ink-500">
          {hiddenTotal} pesanan sedang disembunyikan dan tidak ikut dihitung pada
          ringkasan di atas.{" "}
          <button
            type="button"
            onClick={() => switchTab("tersembunyi")}
            className="underline underline-offset-2 hover:text-ink-900"
          >
            Buka riwayat tersembunyi
          </button>
        </p>
      )}
      {tab === "tersembunyi" && (
        <p className="mt-3 text-xs text-ink-500">
          Ringkasan ini hanya menghitung pesanan yang sedang disembunyikan.
          Datanya tetap tersimpan dan bisa dimunculkan kembali kapan saja.
        </p>
      )}

      <div
        className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm ${
          selectedRows.length > 0
            ? "border-brand-500 bg-brand-50"
            : "border-line bg-white"
        }`}
      >
        <p className={selectedRows.length > 0 ? "text-brand-700" : "text-ink-500"}>
          {selectedRows.length > 0
            ? `${selectedRows.length} pesanan dipilih`
            : "Centang pesanan untuk memilih beberapa sekaligus."}
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {selectedRows.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="btn-ghost btn-sm"
            >
              Batalkan pilihan
            </button>
          )}
          <button
            type="button"
            disabled={selectedRows.length === 0}
            onClick={() => applyHidden(selectedRows.map((o) => o.id), tab === "aktif")}
            className="btn-outline btn-sm"
          >
            {tab === "aktif" ? "Sembunyikan terpilih" : "Munculkan kembali terpilih"}
          </button>
        </div>
      </div>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[880px]">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="table-head w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand-500"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  disabled={rows.length === 0}
                  onChange={toggleAll}
                  aria-label="Pilih semua pesanan pada tabel ini"
                />
              </th>
              <th className="table-head">Kode</th>
              <th className="table-head">Waktu</th>
              <th className="table-head">Pemesan</th>
              <th className="table-head">Pembayaran</th>
              <th className="table-head text-right">Total</th>
              <th className="table-head">Status</th>
              <th className="table-head text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((o) => {
              const open = openId === o.id;
              const checked = selected.includes(o.id);
              return (
                <tr
                  key={o.id}
                  className={
                    checked ? "bg-brand-50/60" : open ? "bg-canvas/60" : ""
                  }
                >
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-brand-500"
                      checked={checked}
                      onChange={() => toggleRow(o.id)}
                      aria-label={`Pilih pesanan ${o.code}`}
                    />
                  </td>
                  <td className="table-cell">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : o.id)}
                      className="font-medium text-brand-600 hover:underline"
                      aria-expanded={open}
                    >
                      {o.code} <span aria-hidden="true">{open ? "▾" : "▸"}</span>
                    </button>
                    {open && (
                      <div className="mt-3 max-w-md rounded-md border border-line bg-white p-3">
                        <ul className="space-y-1.5 text-xs">
                          {o.items.map((i) => (
                            <li key={i.menuId} className="flex justify-between gap-3">
                              <span className="text-ink-700">
                                {i.name} ×{i.qty}
                                {i.note && (
                                  <span className="block text-ink-500">
                                    {i.note}
                                  </span>
                                )}
                              </span>
                              <span className="tabular-nums">
                                {rupiah(i.price * i.qty)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {o.note && (
                          <p className="mt-2 border-t border-line pt-2 text-xs text-ink-500">
                            Catatan: {o.note}
                          </p>
                        )}
                        <div className="mt-3 border-t border-line pt-3">
                          <label
                            htmlFor={`status-${o.id}`}
                            className="mb-1 block text-xs text-ink-500"
                          >
                            Ubah status pesanan
                          </label>
                          <select
                            id={`status-${o.id}`}
                            className="input px-2 py-1.5 text-xs"
                            value={o.status}
                            onChange={(e) =>
                              setOrderStatus(o.id, e.target.value as OrderStatus)
                            }
                          >
                            {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="table-cell whitespace-nowrap text-ink-700">
                    <span className="block">{formatDate(o.createdAt)}</span>
                    <span className="text-xs text-ink-500">
                      {formatTime(o.createdAt)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="block font-medium">{o.customerName}</span>
                    <span className="text-xs text-ink-500">
                      {o.tableNo ? `Meja ${o.tableNo}` : "Dibungkus"}
                    </span>
                  </td>
                  <td className="table-cell text-ink-700">
                    {PAYMENT_LABEL[o.paymentMethod]}
                  </td>
                  <td className="table-cell text-right font-medium tabular-nums">
                    {rupiah(o.total)}
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="table-cell text-right">
                    <button
                      type="button"
                      onClick={() => applyHidden([o.id], !o.hidden)}
                      className="whitespace-nowrap text-sm text-ink-500 underline underline-offset-2 hover:text-ink-900"
                    >
                      {o.hidden ? "Munculkan" : "Sembunyikan"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="table-cell py-12 text-center text-ink-500">
                  {tab === "aktif"
                    ? "Tidak ada pesanan pada rentang tanggal ini."
                    : hiddenTotal === 0
                      ? "Belum ada pesanan yang disembunyikan."
                      : "Tidak ada pesanan tersembunyi pada filter tanggal ini."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm transition-colors ${
        active
          ? "border-brand-500 font-medium text-ink-900"
          : "border-transparent text-ink-500 hover:text-ink-900"
      }`}
    >
      {children}
      <span
        className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
          active ? "bg-brand-50 text-brand-700" : "bg-line/60 text-ink-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
