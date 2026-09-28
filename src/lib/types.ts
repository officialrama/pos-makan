export type Category = "Lauk" | "Sayur" | "Nasi" | "Minuman";

export const CATEGORIES: Category[] = ["Lauk", "Sayur", "Nasi", "Minuman"];

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  available: boolean;
  /** URL gambar menu. Kosongkan untuk memakai ilustrasi bawaan per kategori. */
  image?: string;
}

export interface OrderItem {
  menuId: string;
  name: string;
  price: number;
  qty: number;
  /** Catatan tamu untuk item ini, misalnya "tanpa sambal". */
  note?: string;
}

export type PaymentMethod = "qris" | "transfer";

export type OrderStatus = "menunggu" | "dibayar" | "selesai" | "batal";

export interface Order {
  id: string;
  code: string;
  customerName: string;
  tableNo: string;
  note: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  /** Disembunyikan dari tab riwayat utama. Data tetap tersimpan. */
  hidden?: boolean;
}

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  qris: "QRIS",
  transfer: "Transfer Bank",
};

/**
 * "utama" boleh mengelola riwayat tersembunyi, "staf" tidak pernah melihatnya.
 */
export type AdminRole = "utama" | "staf";

export interface AdminSession {
  username: string;
  role: AdminRole;
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  utama: "Admin utama",
  staf: "Admin",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu: "Menunggu bayar",
  dibayar: "Sudah dibayar",
  selesai: "Selesai",
  batal: "Dibatalkan",
};
