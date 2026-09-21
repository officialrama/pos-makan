import Link from "next/link";

interface Props {
  /** Judul halaman. Kosongkan untuk menampilkan nama rumah makan. */
  title?: string;
  /** Tujuan tombol kembali. Kosongkan untuk menyembunyikan tombolnya. */
  back?: string;
}

export default function GuestHeader({ title, back }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        {back && (
          <Link
            href={back}
            aria-label="Kembali"
            className="-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-700 hover:bg-canvas"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12 4l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}

        {title ? (
          <h1 className="truncate text-[17px] font-semibold">{title}</h1>
        ) : (
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
              RG
            </span>
            <span className="text-[15px] font-semibold">RM Padang Garuda</span>
          </Link>
        )}
      </div>
    </header>
  );
}
