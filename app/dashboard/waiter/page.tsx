"use client";

import { useEffect, useState } from "react";
import { Bell, CreditCard, Trash2, ClipboardList, RefreshCw } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  status: "Pending" | "Preparing" | "Ready" | "Served" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  paymentMethod?: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
}

type TableStatus = "free" | "occupied" | "ready" | "cleaning" | "bill";

interface TableInfo {
  number: number;
  status: TableStatus;
  minutes?: number;
  amount?: number;
  orderId?: string;
}

const STATUS_LABEL: Record<TableStatus, string> = {
  free: "Free",
  occupied: "Occupied",
  ready: "Food Ready",
  cleaning: "Cleaning",
  bill: "Bill Ready",
};

const ORDER_BADGE: Record<string, { cls: string; label: string }> = {
  Pending:   { cls: "badge-yellow", label: "Pending" },
  Preparing: { cls: "badge-blue",   label: "Preparing" },
  Ready:     { cls: "badge-green",  label: "Ready — Serve now!" },
  Served:    { cls: "badge-gray",   label: "Served" },
  Cancelled: { cls: "badge-red",    label: "Cancelled" },
};

export default function WaiterDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders((data.data || []).filter((o: Order) => !["Served", "Cancelled"].includes(o.status)));
    setLoading(false);
  }

  useEffect(() => {
    load();
    const tick = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  async function markServed(id: string) {
    await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Served" }) });
    load();
  }

  async function markPaid(id: string, method: string) {
    await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentStatus: "Paid", paymentMethod: method }) });
    load();
  }

  async function cancelOrder(id: string) {
    if (!confirm("Cancel this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Cancelled" }) });
    load();
  }

  // Build table map from orders
  const tableMap: Record<number, TableInfo> = {};
  for (let i = 1; i <= 15; i++) tableMap[i] = { number: i, status: "free" };

  orders.forEach((o) => {
    const t = o.tableNumber;
    if (!tableMap[t]) tableMap[t] = { number: t, status: "free" };
    const mins = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
    if (o.status === "Ready") {
      tableMap[t] = { number: t, status: "ready", minutes: mins, orderId: o._id };
    } else if (o.status === "Served" && o.paymentStatus === "Unpaid") {
      tableMap[t] = { number: t, status: "bill", amount: o.total, orderId: o._id };
    } else {
      tableMap[t] = { number: t, status: "occupied", minutes: mins, orderId: o._id };
    }
  });

  const tables = Object.values(tableMap).sort((a, b) => a.number - b.number);
  const readyOrders = orders.filter((o) => o.status === "Ready");
  const pendingOrders = orders.filter((o) => ["Pending", "Preparing"].includes(o.status));
  const billOrders = orders.filter((o) => o.status === "Served" && o.paymentStatus === "Unpaid");

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh", color: "#2a2520", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e0d4", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#2a2520", fontWeight: 600 }}>My Section</h1>
          <p style={{ fontSize: "12px", color: "#9a8e7e", marginTop: "2px" }}>Waiter Dashboard · Tables 1–15</p>
        </div>
        <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
          <button onClick={() => load()} style={{ background: "none", border: "1px solid #e8e0d4", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", color: "#9a8e7e" }}>
            <RefreshCw size={14} />
          </button>
          <div style={{ background: "#fdf4e7", border: "1px solid #f0d9a0", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", color: "#a06b10", fontWeight: 500 }}>
            {time || "--:--"} · Evening Shift
          </div>
        </div>
      </div>

      <div style={{ padding: "1.5rem" }}>
        {/* Summary pills */}
        <div style={{ display: "flex", gap: ".6rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Ready to serve", count: readyOrders.length, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
            { label: "In progress", count: pendingOrders.length, color: "#d4841a", bg: "#fffbf5", border: "#fde68a" },
            { label: "Awaiting bill", count: billOrders.length, color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
            { label: "Free tables", count: tables.filter(t => t.status === "free").length, color: "#9a8e7e", bg: "#f5f3ef", border: "#e8e0d4" },
          ].map(p => (
            <div key={p.label} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: "8px", padding: "6px 14px", fontSize: "12px", color: p.color, fontWeight: 500 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", marginRight: "6px" }}>{p.count}</span>
              {p.label}
            </div>
          ))}
        </div>

        {/* Table grid */}
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".08em", color: "#9a8e7e", marginBottom: ".7rem", fontWeight: 500 }}>Table Status</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: ".6rem", marginBottom: "1.5rem" }}>
          {tables.map((t) => {
            const colors: Record<TableStatus, { border: string; bg: string; textColor: string }> = {
              free:     { border: "#e8e0d4", bg: "#fff",    textColor: "#b0a090" },
              occupied: { border: "#d4841a", bg: "#fffbf5", textColor: "#d4841a" },
              ready:    { border: "#16a34a", bg: "#f0fdf4", textColor: "#16a34a" },
              cleaning: { border: "#9ca3af", bg: "#f9fafb", textColor: "#6b7280" },
              bill:     { border: "#6366f1", bg: "#eef2ff", textColor: "#6366f1" },
            };
            const c = colors[t.status];
            return (
              <div key={t.number} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: "10px", padding: ".7rem .5rem", textAlign: "center", transition: "all .2s" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: "#2a2520", lineHeight: 1 }}>{t.number}</div>
                <div style={{ fontSize: "10px", marginTop: "4px", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".04em", color: c.textColor }}>{STATUS_LABEL[t.status]}</div>
                {t.minutes !== undefined && t.status !== "free" && (
                  <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                    {t.status === "bill" ? `₹${t.amount?.toFixed(0)}` : `${t.minutes} min`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active orders */}
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".08em", color: "#9a8e7e", marginBottom: ".7rem", fontWeight: 500 }}>Active Orders</p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#9a8e7e" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#9a8e7e" }}>
            <ClipboardList size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
            <p>No active orders right now</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem", marginBottom: "1.5rem" }}>
            {orders.map((order) => {
              const badge = ORDER_BADGE[order.status];
              const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
              return (
                <div key={order._id} style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: "12px", padding: "1rem", borderLeft: order.status === "Ready" ? "3px solid #16a34a" : order.status === "Pending" ? "3px solid #d4841a" : "3px solid #93c5fd" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#a06b10" }}>{order.orderNumber}</span>
                    <span className={`badge ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#2a2520", marginBottom: ".5rem" }}>
                    Table {order.tableNumber} · {mins} min ago
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b5a42", lineHeight: 1.7, marginBottom: ".7rem" }}>
                    {order.items.map((it, i) => (
                      <div key={i}>{it.quantity}× {it.name}</div>
                    ))}
                  </div>
                  {order.notes && (
                    <div style={{ fontSize: "11px", background: "#fdf4e7", border: "1px solid #f0d9a0", borderRadius: "6px", padding: "4px 8px", color: "#a06b10", marginBottom: ".7rem" }}>
                      📝 {order.notes}
                    </div>
                  )}
                  <div style={{ borderTop: "1px solid #f0e8d8", paddingTop: ".6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#2a2520" }}>₹{order.total.toFixed(0)}</span>
                    <div style={{ display: "flex", gap: ".4rem" }}>
                      {order.status === "Ready" && (
                        <button onClick={() => markServed(order._id)}
                          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                          Mark Served
                        </button>
                      )}
                      {order.status === "Served" && order.paymentStatus === "Unpaid" && (
                        <div style={{ display: "flex", gap: ".3rem" }}>
                          {["Cash", "Card", "UPI"].map(m => (
                            <button key={m} onClick={() => markPaid(order._id, m)}
                              style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 8px", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => cancelOrder(order._id)}
                        style={{ background: "none", border: "1px solid #e8e0d4", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", color: "#9a8e7e" }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick actions */}
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".08em", color: "#9a8e7e", marginBottom: ".7rem", fontWeight: 500 }}>Quick Actions</p>
        <div style={{ display: "flex", gap: ".5rem" }}>
          {[
            { icon: <ClipboardList size={15} />, label: "New Order", href: "/dashboard/orders" },
            { icon: <Bell size={15} />, label: "Call Kitchen", href: "#" },
            { icon: <CreditCard size={15} />, label: "Process Bill", href: "#" },
          ].map((a) => (
            <a key={a.label} href={a.href}
              style={{ flex: 1, background: "#fff", border: "1px solid #e8e0d4", borderRadius: "10px", padding: ".8rem", textAlign: "center", cursor: "pointer", textDecoration: "none", color: "#6b5a42", transition: "all .2s", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px", color: "#d4841a" }}>{a.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: 500 }}>{a.label}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
