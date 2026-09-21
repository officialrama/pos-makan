import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-14">
      <div className="mb-10">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500 text-base font-bold text-white">
          RG
        </span>
        <h1 className="text-3xl">RM Padang Garuda</h1>
        <p className="mt-2 max-w-md text-ink-500">
          Aplikasi pemesanan makanan Padang.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/menu"
          className="card group p-6 transition-colors hover:border-go-500"
        >
          <span className="badge bg-go-50 text-go-700">Tamu</span>
          <h2 className="mt-3 text-lg">Pesan makanan</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Pilih menu, tentukan jumlah, isi nama pemesan, lalu bayar dengan
            QRIS atau transfer bank.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-go-600 group-hover:underline">
            Lihat daftar menu →
          </span>
        </Link>

        <Link
          href="/admin/login"
          className="card group p-6 transition-colors hover:border-brand-500"
        >
          <span className="badge bg-brand-50 text-brand-700">Admin</span>
          <h2 className="mt-3 text-lg">Masuk sebagai admin</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Tambah dan ubah menu beserta harganya, serta lihat riwayat pesanan
            dengan filter tanggal.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-brand-600 group-hover:underline">
            Halaman login →
          </span>
        </Link>
      </div>
    </main>
  );
}
