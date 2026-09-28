import type { MenuItem, Order } from "./types";


export const SEED_MENU: MenuItem[] = [
  { id: "m01", name: "Daging Rendang", category: "Lauk", price: 28000, description: "Daging sapi dimasak santan dan rempah sampai kering berminyak.", available: true, image: "/foto/daging-rendang.jpeg" },
  { id: "m02", name: "Dendeng Brekele", category: "Lauk", price: 32000, description: "Irisan daging sapi digoreng kering, disiram sambal merah dan bawang.", available: true, image: "/foto/dendeng-brekele.jpeg" },
  { id: "m03", name: "Dendeng Sambal Hijau", category: "Lauk", price: 32000, description: "Dendeng sapi bertabur sambal cabai hijau ulek kasar.", available: true, image: "/foto/dendeng-sambal-hijau.jpeg" },
  { id: "m04", name: "Ayam Cabai Hijau", category: "Lauk", price: 24000, description: "Potongan ayam berselimut sambal cabai hijau khas Minang.", available: true, image: "/foto/ayam-cabai-hijau.jpeg" },
  { id: "m05", name: "Ayam Panggang", category: "Lauk", price: 25000, description: "Ayam panggang bumbu rempah, disajikan dengan kuah kecap pedas.", available: true, image: "/foto/ayam-panggang.jpeg" },
  { id: "m06", name: "Sayur Daun Ubi Tumbuk", category: "Sayur", price: 8000, description: "Daun singkong ditumbuk halus, dimasak dengan santan kuning.", available: true, image: "/foto/sayur-daun-ubi-tumbuk.jpeg" },
  { id: "m07", name: "Gado-gado", category: "Sayur", price: 18000, description: "Sayuran segar dengan bumbu kacang dan kerupuk merah.", available: true, image: "/foto/gado-gado.jpeg" },
  { id: "m08", name: "Jus Martabe", category: "Minuman", price: 15000, description: "Campuran markisa dan terong belanda, segar dan sedikit asam.", available: true, image: "/foto/jus-martabe.jpeg" },
];

function isoAt(daysAgo: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Beberapa pesanan contoh supaya filter tanggal di halaman admin ada isinya. */
export const SEED_ORDERS: Order[] = [
  {
    id: "o1001", code: "PD-1001", customerName: "Rian", tableNo: "4", note: "",
    items: [
      { menuId: "m01", name: "Daging Rendang", price: 28000, qty: 1 },
      { menuId: "m08", name: "Jus Martabe", price: 15000, qty: 1 },
    ],
    total: 43000, paymentMethod: "qris", status: "selesai", createdAt: isoAt(0, 11, 20),
  },
  {
    id: "o1002", code: "PD-1002", customerName: "Sarah", tableNo: "", note: "Bungkus, sambalnya dipisah.",
    items: [
      { menuId: "m04", name: "Ayam Cabai Hijau", price: 24000, qty: 2 },
      { menuId: "m06", name: "Sayur Daun Ubi Tumbuk", price: 8000, qty: 1 },
    ],
    total: 56000, paymentMethod: "transfer", status: "selesai", createdAt: isoAt(0, 12, 45),
  },
  {
    id: "o1003", code: "PD-1003", customerName: "Pak Dedi", tableNo: "2", note: "",
    items: [
      { menuId: "m03", name: "Dendeng Sambal Hijau", price: 32000, qty: 1 },
      { menuId: "m07", name: "Gado-gado", price: 18000, qty: 1 },
    ],
    total: 50000, paymentMethod: "qris", status: "selesai", createdAt: isoAt(1, 13, 5),
  },
  {
    id: "o1004", code: "PD-1004", customerName: "Bu Nia", tableNo: "7", note: "",
    items: [
      { menuId: "m05", name: "Ayam Panggang", price: 25000, qty: 2 },
      { menuId: "m06", name: "Sayur Daun Ubi Tumbuk", price: 8000, qty: 2 },
    ],
    total: 66000, paymentMethod: "transfer", status: "selesai", createdAt: isoAt(2, 19, 10),
  },
  {
    id: "o1005", code: "PD-1005", customerName: "Andre", tableNo: "", note: "",
    items: [
      { menuId: "m02", name: "Dendeng Brekele", price: 32000, qty: 1 },
    ],
    total: 32000, paymentMethod: "qris", status: "batal", createdAt: isoAt(3, 18, 30),
  },
  {
    id: "o1006", code: "PD-1006", customerName: "Kantor BRI Mascot", tableNo: "", note: "Pesanan rapat, tolong siap jam 12.",
    items: [
      { menuId: "m01", name: "Daging Rendang", price: 28000, qty: 10 },
      { menuId: "m08", name: "Jus Martabe", price: 15000, qty: 10 },
    ],
    total: 430000, paymentMethod: "transfer", status: "selesai", createdAt: isoAt(5, 10, 15),
  },
  {
    id: "o1007", code: "PD-1007", customerName: "Fajar", tableNo: "1", note: "",
    items: [
      { menuId: "m04", name: "Ayam Cabai Hijau", price: 24000, qty: 1 },
      { menuId: "m07", name: "Gado-gado", price: 18000, qty: 1 },
      { menuId: "m08", name: "Jus Martabe", price: 15000, qty: 1 },
    ],
    total: 57000, paymentMethod: "qris", status: "selesai", createdAt: isoAt(8, 12, 0),
  },
];
