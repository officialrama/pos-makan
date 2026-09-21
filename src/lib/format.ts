export function rupiah(value: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(value));
}

/** Tanggal lokal dalam format YYYY-MM-DD (dipakai input type="date" & filter). */
export function toDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

export function shiftDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}
