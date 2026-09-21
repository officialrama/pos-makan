"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_MENU, SEED_ORDERS } from "./seed";
import type { MenuItem, Order, OrderItem, PaymentMethod, OrderStatus } from "./types";

const KEY_MENU = "padang.menus";
const KEY_ORDER = "padang.orders";
const KEY_CART = "padang.cart";
const KEY_ADMIN = "padang.admin";

/** Kredensial demo. Di aplikasi asli ini diganti autentikasi server. */
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin123";

export interface CartLine {
  qty: number;
  note: string;
}

type Cart = Record<string, CartLine>;

/** Keranjang versi lama menyimpan angka saja — ubah ke bentuk baru. */
function normalizeCart(raw: unknown): Cart {
  if (!raw || typeof raw !== "object") return {};
  const out: Cart = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "number") {
      if (value > 0) out[id] = { qty: value, note: "" };
    } else if (value && typeof value === "object" && "qty" in value) {
      const line = value as CartLine;
      if (line.qty > 0) out[id] = { qty: line.qty, note: line.note ?? "" };
    }
  }
  return out;
}

interface StoreValue {
  ready: boolean;
  menus: MenuItem[];
  orders: Order[];
  cart: Cart;
  cartItems: OrderItem[];
  cartCount: number;
  cartTotal: number;
  isAdmin: boolean;
  setQty: (menuId: string, qty: number, note?: string) => void;
  setItemNote: (menuId: string, note: string) => void;
  clearCart: () => void;
  saveMenu: (item: MenuItem) => void;
  deleteMenu: (id: string) => void;
  toggleAvailable: (id: string) => void;
  createOrder: (input: {
    customerName: string;
    tableNo: string;
    note: string;
    paymentMethod: PaymentMethod;
  }) => Order | null;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  /** Sembunyikan / munculkan kembali pesanan di riwayat admin. */
  setOrdersHidden: (ids: string[], hidden: boolean) => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage penuh atau diblokir — abaikan, ini mockup */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>(SEED_MENU);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [cart, setCart] = useState<Cart>({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Data dibaca setelah mount supaya markup server & client tetap sama.
  useEffect(() => {
    setMenus(read<MenuItem[]>(KEY_MENU, SEED_MENU));
    setOrders(read<Order[]>(KEY_ORDER, SEED_ORDERS));
    setCart(normalizeCart(read<unknown>(KEY_CART, {})));
    setIsAdmin(read<boolean>(KEY_ADMIN, false));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(KEY_MENU, menus);
  }, [menus, ready]);
  useEffect(() => {
    if (ready) write(KEY_ORDER, orders);
  }, [orders, ready]);
  useEffect(() => {
    if (ready) write(KEY_CART, cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) write(KEY_ADMIN, isAdmin);
  }, [isAdmin, ready]);

  const setQty = useCallback((menuId: string, qty: number, note?: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[menuId];
      } else {
        next[menuId] = {
          qty: Math.min(qty, 99),
          note: note ?? prev[menuId]?.note ?? "",
        };
      }
      return next;
    });
  }, []);

  const setItemNote = useCallback((menuId: string, note: string) => {
    setCart((prev) => {
      const line = prev[menuId];
      if (!line) return prev;
      return { ...prev, [menuId]: { ...line, note } };
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const saveMenu = useCallback((item: MenuItem) => {
    setMenus((prev) => {
      const exists = prev.some((m) => m.id === item.id);
      return exists ? prev.map((m) => (m.id === item.id ? item : m)) : [...prev, item];
    });
  }, []);

  const deleteMenu = useCallback((id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleAvailable = useCallback((id: string) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)),
    );
  }, []);

  const cartItems = useMemo<OrderItem[]>(() => {
    return Object.entries(cart)
      .map(([menuId, line]): OrderItem | null => {
        const menu = menus.find((m) => m.id === menuId);
        if (!menu) return null;
        return {
          menuId,
          name: menu.name,
          price: menu.price,
          qty: line.qty,
          note: line.note,
        };
      })
      .filter((x): x is OrderItem => x !== null);
  }, [cart, menus]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.qty, 0),
    [cartItems],
  );
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.qty * i.price, 0),
    [cartItems],
  );

  const createOrder = useCallback<StoreValue["createOrder"]>(
    (input) => {
      if (cartItems.length === 0) return null;
      const nextNumber =
        orders.reduce((max, o) => {
          const n = Number(o.code.replace(/\D/g, ""));
          return Number.isFinite(n) && n > max ? n : max;
        }, 1000) + 1;

      const order: Order = {
        id: `o${nextNumber}`,
        code: `PD-${nextNumber}`,
        customerName: input.customerName.trim(),
        tableNo: input.tableNo.trim(),
        note: input.note.trim(),
        items: cartItems,
        total: cartTotal,
        paymentMethod: input.paymentMethod,
        status: "menunggu",
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [order, ...prev]);
      setCart({});
      return order;
    },
    [cartItems, cartTotal, orders],
  );

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const setOrdersHidden = useCallback((ids: string[], hidden: boolean) => {
    if (ids.length === 0) return;
    const target = new Set(ids);
    setOrders((prev) =>
      prev.map((o) => (target.has(o.id) ? { ...o, hidden } : o)),
    );
  }, []);

  const login = useCallback((user: string, pass: string) => {
    const ok = user.trim() === ADMIN_USER && pass === ADMIN_PASS;
    if (ok) setIsAdmin(true);
    return ok;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const resetDemo = useCallback(() => {
    setMenus(SEED_MENU);
    setOrders(SEED_ORDERS);
    setCart({});
  }, []);

  const value: StoreValue = {
    ready,
    menus,
    orders,
    cart,
    cartItems,
    cartCount,
    cartTotal,
    isAdmin,
    setQty,
    setItemNote,
    clearCart,
    saveMenu,
    deleteMenu,
    toggleAvailable,
    createOrder,
    setOrderStatus,
    setOrdersHidden,
    login,
    logout,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore harus dipakai di dalam <StoreProvider>");
  return ctx;
}
