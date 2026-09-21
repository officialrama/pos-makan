import { STATUS_LABEL, type OrderStatus } from "@/lib/types";

const TONE: Record<OrderStatus, string> = {
  menunggu: "bg-amber-50 text-amber-800",
  dibayar: "bg-blue-50 text-blue-800",
  selesai: "bg-emerald-50 text-emerald-800",
  batal: "bg-ink-300/25 text-ink-700",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge ${TONE[status]}`}>{STATUS_LABEL[status]}</span>;
}
