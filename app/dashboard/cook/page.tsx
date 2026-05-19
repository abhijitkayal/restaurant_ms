"use client";

import { useEffect, useState } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  tableNumber: number;
  items: OrderItem[];
  status: "Pending" | "Preparing" | "Ready" | "Served" | "Cancelled";
  notes?: string;
  createdAt: string;
}

interface InventoryAlert {
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
}

const urgencyColor = (mins: number) => {
  if (mins >= 18) return { border: "#ef4444", bg: "rgba(239,68,68,0.07)", numColor: "#f87171", timeColor: "#f87171" };
  if (mins >= 10) return { border: "#e4a224", bg: "rgba(228,162,36,0.06)", numColor: "#e4a224", timeColor: "#e4a224" };
  return { border: "#2a2a2a", bg: "transparent", numColor: "#e4a224", timeColor: "#555" };
};

export default function CookDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");
  const [completedToday, setCompletedToday] = useState(0);
  const [doneItems, setDoneItems] = useState<Set<string>>(new Set());
  const [branch, setBranch] = useState<string | null>(null);

  async function load(branchName = branch) {
    setLoading(true);
    
    if (!branchName) {
      setOrders([]);
      setLowStock([]);
      setLoading(false);
      return;
    }

    const ordersUrl = `/api/orders?branch=${encodeURIComponent(branchName)}`;
    const invUrl = `/api/inventory?branch=${encodeURIComponent(branchName)}`;
    
    const [ordersRes, invRes] = await Promise.all([fetch(ordersUrl), fetch(invUrl)]);
    const [ordersData, invData] = await Promise.all([ordersRes.json(), invRes.json()]);

    const allOrders: Order[] = ordersData.data || [];
    const active = allOrders.filter((o) => ["Pending", "Preparing"].includes(o.status));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayServed = allOrders.filter((o) => o.status === "Served" && new Date(o.createdAt) >= today);
    setOrders(active);
    setCompletedToday(todayServed.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.quantity, 0), 0));

    const inv = invData.data || [];
    setLowStock(inv.filter((i: InventoryAlert) => i.quantity <= i.minStock));
    setLoading(false);
  }

  async function markReady(id: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Ready" }),
    });
    load(branch);
  }

  async function markPreparing(id: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Preparing" }),
    });
    load(branch);
  }

  function toggleItemDone(orderId: string, itemIdx: number) {
    const key = `${orderId}-${itemIdx}`;
    setDoneItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      window.location.href = "/";
      return;
    }

    const parsedUser = JSON.parse(user);

    if (parsedUser.role !== "cook") {
      window.location.href = "/";
      return;
    }

    const userBranch = parsedUser.branch || null;
    setBranch(userBranch);

    if (userBranch) {
      load(userBranch);
    }

    const tick = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const sorted = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const avgMins = orders.length
    ? Math.round(orders.reduce((s, o) => s + (Date.now() - new Date(o.createdAt).getTime()) / 60000, 0) / orders.length)
    : 0;

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "#f0ece4", fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Header */}
      <div style={{ background: "#161616", borderBottom: "1px solid #2a2a2a", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1 style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "15px", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "#f0ece4" }}>
            Kitchen Display
          </h1>
          <button onClick={() => load()} style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "5px 9px", cursor: "pointer", color: "#555" }}>
            <RefreshCw size={13} />
          </button>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "10px", color: "#555", fontFamily: '"Times New Roman", Times, serif', textTransform: "uppercase", letterSpacing: ".06em" }}>Queue</div>
            <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "20px", color: orders.length > 5 ? "#f87171" : "#f0ece4" }}>{orders.length} tickets</div>
          </div>
          <div style={{ borderLeft: "1px solid #2a2a2a", paddingLeft: "1.5rem" }}>
            <div style={{ fontSize: "10px", color: "#555", fontFamily: '"Times New Roman", Times, serif', textTransform: "uppercase", letterSpacing: ".06em" }}>Avg wait</div>
            <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "20px", color: avgMins > 15 ? "#f87171" : "#4ade80" }}>{avgMins} min</div>
          </div>
          <div style={{ borderLeft: "1px solid #2a2a2a", paddingLeft: "1.5rem" }}>
            <div style={{ fontSize: "10px", color: "#555", fontFamily: '"Times New Roman", Times, serif', textTransform: "uppercase", letterSpacing: ".06em" }}>Time</div>
            <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "20px", color: "#e4a224" }}>{time || "--:--:--"}</div>
          </div>
        </div>
      </div>

      {/* Low stock ticker */}
      {lowStock.length > 0 && (
        <div style={{ background: "#e4a224", color: "#111", padding: "5px 1.5rem", fontFamily: '"Times New Roman", Times, serif', fontSize: "11px", fontWeight: 500, display: "flex", gap: "2rem", overflowX: "hidden", whiteSpace: "nowrap" }}>
          <span style={{ flexShrink: 0 }}>⚠ LOW STOCK:</span>
          {lowStock.map((i, idx) => (
            <span key={idx} style={{ flexShrink: 0 }}>
              {i.name} — {i.quantity} {i.unit} remaining
              {idx < lowStock.length - 1 && <span style={{ margin: "0 1rem" }}>·</span>}
            </span>
          ))}
        </div>
      )}

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.5fr", gap: "1rem", padding: "1rem 1.5rem" }}>

        {/* Ticket column */}
        <div>
          <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "#444", marginBottom: ".7rem", paddingBottom: ".4rem", borderBottom: "1px solid #1e1e1e" }}>
            Active tickets — oldest first
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#444" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #e4a224", borderTopColor: "transparent", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
              Loading kitchen queue...
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#444" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✓</div>
              <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "13px" }}>All caught up!</div>
              <div style={{ fontSize: "12px", marginTop: "4px", color: "#333" }}>No tickets in queue</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem" }}>
              {sorted.map((order) => {
                const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
                const u = urgencyColor(mins);
                const allItemsDone = order.items.every((_, i) => doneItems.has(`${order._id}-${i}`));

                return (
                  <div key={order._id} style={{ background: u.bg || "#1a1a1a", border: `1px solid ${u.border}`, borderRadius: "10px", overflow: "hidden" }}>
                    {/* Ticket header */}
                    <div style={{ padding: ".65rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222", background: "#1a1a1a" }}>
                      <div>
                        <span style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "12px", color: u.numColor }}>{order.orderNumber}</span>
                        <span style={{ fontSize: "12px", color: "#666", marginLeft: ".6rem" }}>Table {order.tableNumber}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                          <span style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "12px", color: u.timeColor, fontWeight: mins >= 10 ? 600 : 400 }}>
                          {mins >= 18 && "⚠ "}{mins} min
                        </span>
                        <span style={{ fontSize: "10px", background: order.status === "Preparing" ? "rgba(96,165,250,.15)" : "rgba(251,191,36,.15)", color: order.status === "Preparing" ? "#60a5fa" : "#fbbf24", border: `1px solid ${order.status === "Preparing" ? "rgba(96,165,250,.2)" : "rgba(251,191,36,.2)"}`, borderRadius: "999px", padding: "2px 7px", fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase" }}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ padding: ".6rem 1rem" }}>
                      {order.items.map((item, idx) => {
                        const key = `${order._id}-${idx}`;
                        const done = doneItems.has(key);
                        return (
                          <div key={idx} onClick={() => toggleItemDone(order._id, idx)}
                            style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: "5px 0", borderBottom: idx < order.items.length - 1 ? "1px solid #1e1e1e" : "none", cursor: "pointer", opacity: done ? 0.35 : 1, transition: "opacity .2s" }}>
                            <span style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "14px", fontWeight: 500, color: u.numColor, width: "22px", flexShrink: 0 }}>{item.quantity}×</span>
                            <span style={{ fontSize: "13px", color: done ? "#444" : "#d0ccc6", flex: 1, textDecoration: done ? "line-through" : "none" }}>{item.name}</span>
                            <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: `1px solid ${done ? "#4ade80" : "#333"}`, background: done ? "#4ade80" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {done && <span style={{ fontSize: "10px", color: "#111", fontWeight: 700 }}>✓</span>}
                            </div>
                          </div>
                        );
                      })}

                      {order.notes && (
                        <div style={{ marginTop: ".5rem", fontSize: "11px", color: "#666", fontStyle: "italic", background: "#1e1e1e", borderRadius: "5px", padding: "4px 8px" }}>
                          📝 {order.notes}
                        </div>
                      )}
                    </div>

                    {/* Ticket footer */}
                    <div style={{ padding: ".6rem 1rem", borderTop: "1px solid #1e1e1e", display: "flex", gap: ".4rem", justifyContent: "flex-end" }}>
                      {order.status === "Pending" && (
                        <button onClick={() => markPreparing(order._id)}
                          style={{ background: "rgba(96,165,250,.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,.2)", borderRadius: "6px", padding: "5px 12px", fontSize: "11px", fontFamily: '"Times New Roman", Times, serif', fontWeight: 500, cursor: "pointer", textTransform: "uppercase", letterSpacing: ".04em" }}>
                          Start
                        </button>
                      )}
                      <button onClick={() => markReady(order._id)}
                        style={{ background: allItemsDone ? "rgba(74,222,128,.2)" : "transparent", color: allItemsDone ? "#4ade80" : "#555", border: `1px solid ${allItemsDone ? "rgba(74,222,128,.3)" : "#333"}`, borderRadius: "6px", padding: "5px 12px", fontSize: "11px", fontFamily: '"Times New Roman", Times, serif', fontWeight: 500, cursor: "pointer", textTransform: "uppercase", letterSpacing: ".04em", transition: "all .2s" }}>
                        Ready ↑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side column */}
        <div>
          <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "#444", marginBottom: ".7rem", paddingBottom: ".4rem", borderBottom: "1px solid #1e1e1e" }}>
            Station stats
          </div>

          {/* Stats */}
          {[
            { label: "Dishes today", value: String(completedToday), sub: "items served" },
            { label: "Queue depth", value: String(orders.length), sub: orders.length > 0 ? `Tables: ${[...new Set(orders.map(o => o.tableNumber))].join(", ")}` : "All clear" },
            { label: "Avg wait time", value: `${avgMins} min`, sub: avgMins > 15 ? "⚠ Running behind" : "✓ On track", subColor: avgMins > 15 ? "#f87171" : "#4ade80" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: ".9rem 1rem", marginBottom: ".6rem" }}>
              <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".3rem" }}>{s.label}</div>
              <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "24px", color: "#f0ece4", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: s.subColor || "#555", marginTop: ".3rem" }}>{s.sub}</div>
            </div>
          ))}

          {/* Low stock alerts */}
          <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "#444", margin: ".8rem 0 .5rem", paddingBottom: ".4rem", borderBottom: "1px solid #1e1e1e" }}>
            Inventory alerts
          </div>

          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", overflow: "hidden" }}>
            {lowStock.length === 0 ? (
              <div style={{ padding: "1rem", fontSize: "12px", color: "#444", textAlign: "center" }}>✓ All stock levels OK</div>
            ) : (
              lowStock.map((item, i) => (
                <div key={i} style={{ padding: ".65rem 1rem", borderBottom: i < lowStock.length - 1 ? "1px solid #222" : "none", display: "flex", gap: ".6rem", alignItems: "flex-start" }}>
                  <AlertTriangle size={12} style={{ color: item.quantity === 0 ? "#f87171" : "#e4a224", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#ccc" }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "#555", fontFamily: '"Times New Roman", Times, serif' }}>
                      {item.quantity} {item.unit} left · min {item.minStock}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          <div style={{ marginTop: "1rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: ".8rem 1rem" }}>
            <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".5rem" }}>Legend</div>
            {[
              { color: "#2a2a2a", label: "New order (< 10 min)" },
              { color: "#e4a224", label: "Urgent (10–17 min)" },
              { color: "#ef4444", label: "Overdue (18+ min)" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".3rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.color, border: `1px solid ${l.color}`, flexShrink: 0 }} />
                <span style={{ fontSize: "11px", color: "#666" }}>{l.label}</span>
              </div>
            ))}
            <div style={{ marginTop: ".5rem", fontSize: "11px", color: "#444", fontStyle: "italic" }}>Tap items to mark as done</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
