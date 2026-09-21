"use client";

interface Props {
  qty: number;
  onChange: (qty: number) => void;
  label?: string;
  disabled?: boolean;
}

export default function QtyStepper({ qty, onChange, label, disabled }: Props) {
  return (
    <div className="inline-flex items-center rounded-md border border-line bg-white">
      <button
        type="button"
        disabled={disabled || qty <= 0}
        onClick={() => onChange(qty - 1)}
        aria-label={`Kurangi ${label ?? "jumlah"}`}
        className="h-9 w-9 rounded-l-md text-lg leading-none text-ink-700 hover:bg-canvas disabled:opacity-30"
      >
        −
      </button>
      <span
        className="w-9 text-center text-sm font-semibold tabular-nums"
        aria-live="polite"
      >
        {qty}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(qty + 1)}
        aria-label={`Tambah ${label ?? "jumlah"}`}
        className="h-9 w-9 rounded-r-md text-lg leading-none text-ink-700 hover:bg-canvas disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
