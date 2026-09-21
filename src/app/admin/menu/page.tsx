"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { rupiah } from "@/lib/format";
import { CATEGORIES, type Category, type MenuItem } from "@/lib/types";

type Draft = {
  id: string;
  name: string;
  category: Category;
  price: string;
  description: string;
  image: string;
  available: boolean;
};

function emptyDraft(): Draft {
  return {
    id: "",
    name: "",
    category: "Lauk",
    price: "",
    description: "",
    image: "",
    available: true,
  };
}

export default function AdminMenuPage() {
  const { menus, saveMenu, deleteMenu, toggleAvailable } = useStore();
  const [filter, setFilter] = useState<"Semua" | Category>("Semua");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus
      .filter(
        (m) =>
          (filter === "Semua" || m.category === filter) &&
          (q === "" || m.name.toLowerCase().includes(q)),
      )
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }, [menus, filter, query]);

  function openNew() {
    setError("");
    setDraft(emptyDraft());
  }

  function openEdit(item: MenuItem) {
    setError("");
    setDraft({
      id: item.id,
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description,
      image: item.image ?? "",
      available: item.available,
    });
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const price = Number(draft.price);
    if (draft.name.trim().length < 2) {
      setError("Nama menu wajib diisi.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Harga harus berupa angka lebih dari 0.");
      return;
    }
    saveMenu({
      id: draft.id || `m${Date.now()}`,
      name: draft.name.trim(),
      category: draft.category,
      price: Math.round(price),
      description: draft.description.trim(),
      image: draft.image.trim() || undefined,
      available: draft.available,
    });
    setDraft(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl">Kelola menu</h1>
          <p className="mt-1 text-sm text-ink-500">
            {menus.length} menu terdaftar ·{" "}
            {menus.filter((m) => !m.available).length} sedang habis
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn-primary">
          Tambah menu
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama menu"
          className="input sm:max-w-xs"
          aria-label="Cari menu"
        />
        <div className="flex flex-wrap gap-2">
          {(["Semua", ...CATEGORIES] as ("Semua" | Category)[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`chip ${filter === c ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="table-head">Menu</th>
              <th className="table-head">Kategori</th>
              <th className="table-head text-right">Harga</th>
              <th className="table-head">Status</th>
              <th className="table-head text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((m) => (
              <tr key={m.id}>
                <td className="table-cell">
                  <p className="font-medium">{m.name}</p>
                  <p className="mt-0.5 max-w-sm text-xs text-ink-500">
                    {m.description || "—"}
                  </p>
                </td>
                <td className="table-cell text-ink-700">{m.category}</td>
                <td className="table-cell text-right font-medium tabular-nums">
                  {rupiah(m.price)}
                </td>
                <td className="table-cell">
                  <button
                    type="button"
                    onClick={() => toggleAvailable(m.id)}
                    className={`badge ${
                      m.available
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-ink-300/25 text-ink-700"
                    }`}
                  >
                    {m.available ? "Tersedia" : "Habis"}
                  </button>
                </td>
                <td className="table-cell text-right">
                  {confirmDelete === m.id ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="mr-1 text-xs text-ink-500">Hapus?</span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteMenu(m.id);
                          setConfirmDelete(null);
                        }}
                        className="btn-sm btn text-brand-600 hover:bg-brand-50"
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="btn-ghost btn-sm"
                      >
                        Batal
                      </button>
                    </span>
                  ) : (
                    <span className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(m)}
                        className="btn-outline btn-sm"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(m.id)}
                        className="btn-ghost btn-sm"
                      >
                        Hapus
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="table-cell py-10 text-center text-ink-500">
                  Tidak ada menu yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {draft && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={draft.id ? "Ubah menu" : "Tambah menu"}
            className="w-full max-w-lg rounded-t-xl bg-white p-6 sm:rounded-xl"
          >
            <h2 className="text-lg">{draft.id ? "Ubah menu" : "Tambah menu"}</h2>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label htmlFor="nama-menu" className="label">
                  Nama menu
                </label>
                <input
                  id="nama-menu"
                  className="input"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Contoh: Rendang Daging"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="kategori" className="label">
                    Kategori
                  </label>
                  <select
                    id="kategori"
                    className="input"
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.target.value as Category })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="harga" className="label">
                    Harga (Rp)
                  </label>
                  <input
                    id="harga"
                    className="input"
                    value={draft.price}
                    onChange={(e) =>
                      setDraft({ ...draft, price: e.target.value.replace(/[^0-9]/g, "") })
                    }
                    inputMode="numeric"
                    placeholder="28000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deskripsi" className="label">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  className="input min-h-[80px] resize-y"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Keterangan singkat yang dilihat tamu"
                />
              </div>

              <div>
                <label htmlFor="gambar" className="label">
                  URL gambar{" "}
                  <span className="font-normal text-ink-500">(opsional)</span>
                </label>
                <input
                  id="gambar"
                  className="input"
                  value={draft.image}
                  onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                  placeholder="https://..."
                />
                <p className="hint">
                  Dikosongkan berarti memakai ilustrasi bawaan sesuai kategori.
                </p>
              </div>

              <label className="flex items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={draft.available}
                  onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
                  className="h-4 w-4 accent-brand-500"
                />
                Tampilkan sebagai tersedia untuk tamu
              </label>

              {error && (
                <p role="alert" className="text-sm text-brand-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="btn-outline"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
