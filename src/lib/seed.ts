import type { MenuItem, Order } from "./types";

export const SEED_MENU: MenuItem[] = [
  { id: "m01", name: "Rendang Daging", category: "Lauk", price: 28000, description: "Daging sapi dimasak santan dan rempah sampai kering.", available: true },
  { id: "m02", name: "Ayam Pop", category: "Lauk", price: 22000, description: "Ayam rebus bumbu putih, disajikan dengan sambal khas.", available: true },
  { id: "m03", name: "Ayam Gulai", category: "Lauk", price: 20000, description: "Potongan ayam dalam kuah gulai kuning.", available: true },
  { id: "m04", name: "Dendeng Balado", category: "Lauk", price: 30000, description: "Irisan daging tipis goreng, disiram sambal merah.", available: true },
  { id: "m05", name: "Gulai Tunjang", category: "Lauk", price: 25000, description: "Kikil sapi empuk dengan kuah gulai kental.", available: true },
  { id: "m06", name: "Ikan Bakar Padang", category: "Lauk", price: 27000, description: "Ikan nila bakar bumbu kuning.", available: true },
  { id: "m07", name: "Telur Dadar Padang", category: "Lauk", price: 12000, description: "Telur dadar tebal dengan kelapa parut dan daun bawang.", available: true },
  { id: "m08", name: "Telur Balado", category: "Lauk", price: 10000, description: "Telur rebus disiram sambal balado.", available: true },
  { id: "m09", name: "Perkedel Kentang", category: "Lauk", price: 6000, description: "Perkedel kentang goreng, gurih di luar lembut di dalam.", available: false },
  { id: "m10", name: "Gulai Nangka", category: "Sayur", price: 6000, description: "Nangka muda dalam kuah santan.", available: true },
  { id: "m11", name: "Daun Singkong", category: "Sayur", price: 5000, description: "Daun singkong rebus siram kuah gulai.", available: true },
  { id: "m12", name: "Sambal Ijo", category: "Sayur", price: 5000, description: "Cabai hijau ulek kasar, pedas segar.", available: true },
  { id: "m13", name: "Nasi Putih", category: "Nasi", price: 6000, description: "Satu porsi nasi putih hangat.", available: true },
  { id: "m14", name: "Nasi Bungkus Komplit", category: "Nasi", price: 18000, description: "Nasi, rendang, sayur, sambal ijo, dibungkus daun.", available: true },
  { id: "m15", name: "Es Teh Manis", category: "Minuman", price: 5000, description: "Teh manis dingin.", available: true },
  { id: "m16", name: "Teh Talua", category: "Minuman", price: 15000, description: "Teh telur khas Minang, hangat dan berbusa.", available: true },
  { id: "m17", name: "Es Jeruk", category: "Minuman", price: 7000, description: "Perasan jeruk peras dengan es batu.", available: true },
  { id: "m18", name: "Air Mineral", category: "Minuman", price: 4000, description: "Air mineral botol 600 ml.", available: true },
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
      { menuId: "m01", name: "Rendang Daging", price: 28000, qty: 1 },
      { menuId: "m13", name: "Nasi Putih", price: 6000, qty: 1 },
      { menuId: "m15", name: "Es Teh Manis", price: 5000, qty: 1 },
    ],
    total: 39000, paymentMethod: "qris", status: "selesai", createdAt: isoAt(0, 11, 20),
  },
  {
    id: "o1002", code: "PD-1002", customerName: "Sarah", tableNo: "", note: "Bungkus, sambalnya dipisah.",
    items: [
      { menuId: "m14", name: "Nasi Bungkus Komplit", price: 18000, qty: 2 },
      { menuId: "m12", name: "Sambal Ijo", price: 5000, qty: 1 },
    ],
    total: 41000, paymentMethod: "transfer", status: "dibayar", createdAt: isoAt(0, 12, 45),
  },
  {
    id: "o1003", code: "PD-1003", customerName: "Pak Dedi", tableNo: "2", note: "",
    items: [
      { menuId: "m04", name: "Dendeng Balado", price: 30000, qty: 1 },
      { menuId: "m13", name: "Nasi Putih", price: 6000, qty: 2 },
      { menuId: "m16", name: "Teh Talua", price: 15000, qty: 1 },
    ],
    total: 57000, paymentMethod: "qris", status: "selesai", createdAt: isoAt(1, 13, 5),
  },
  {
    id: "o1004", code: "PD-1004", customerName: "Bu Nia", tableNo: "7", note: "",
    items: [
      { menuId: "m02", name: "Ayam Pop", price: 22000, qty: 2 },
      { menuId: "m10", name: "Gulai Nangka", price: 6000, qty: 2 },
      { menuId: "m13", name: "Nasi Putih", price: 6000, qty: 2 },
    ],
    total: 68000, paymentMethod: "transfer", status: "selesai", createdAt: isoAt(2, 19, 10),
  },
  {
    id: "o1005", code: "PD-1005", customerName: "Andre", tableNo: "", note: "",
    items: [
      { menuId: "m05", name: "Gulai Tunjang", price: 25000, qty: 1 },
      { menuId: "m13", name: "Nasi Putih", price: 6000, qty: 1 },
    ],
    total: 31000, paymentMethod: "qris", status: "batal", createdAt: isoAt(3, 18, 30),
  },
  {
    id: "o1006", code: "PD-1006", customerName: "Kantor BRI Mascot", tableNo: "", note: "Pesanan rapat, tolong siap jam 12.",
    items: [
      { menuId: "m14", name: "Nasi Bungkus Komplit", price: 18000, qty: 10 },
      { menuId: "m18", name: "Air Mineral", price: 4000, qty: 10 },
    ],
    total: 220000, paymentMethod: "transfer", status: "selesai", createdAt: isoAt(5, 10, 15),
  },
  {
    id: "o1007", code: "PD-1007", customerName: "Fajar", tableNo: "1", note: "",
    items: [
      { menuId: "m03", name: "Ayam Gulai", price: 20000, qty: 1 },
      { menuId: "m11", name: "Daun Singkong", price: 5000, qty: 1 },
      { menuId: "m13", name: "Nasi Putih", price: 6000, qty: 1 },
      { menuId: "m17", name: "Es Jeruk", price: 7000, qty: 1 },
    ],
    total: 38000, paymentMethod: "qris", status: "selesai", createdAt: isoAt(8, 12, 0),
  },
];
