"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Package, Users, ClipboardList, AlertTriangle, Clock, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

interface Order {
  _id: string; orderNumber: string; tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  status: string; paymentStatus: string; total: number; createdAt: string;
}
interface StaffMember { _id: string; name: string; status: string; role: string; shift: string; }
interface InvItem { _id: string; name: string; quantity: number; minStock: number; unit: string; category: string; expiryDate?: string; }
interface Alert { type: "error" | "warn" | "info"; message: string; action?: string; link?: string; }

const STATUS_BADGE: Record<string, string> = {
  Pending: "badge-yellow", Preparing: "badge-blue",
  Ready: "badge-orange", Served: "badge-green", Cancelled: "badge-red",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [inventory, setInventory] = useState<InvItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [time, setTime] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [oRes, sRes, iRes] = await Promise.all([fetch("/api/orders"), fetch("/api/staff"), fetch("/api/inventory")]);
      const [oData, sData, iData] = await Promise.all([oRes.json(), sRes.json(), iRes.json()]);
      setOrders(oData.data || []);
      setStaff(sData.data || []);
      setInventory(iData.data || []);
      setLastRefresh(new Date());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    const tick = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })), 1000);
    return () => { clearInterval(interval); clearInterval(tick); };
  }, [load]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders.filter(o => o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0);
  const yesterdayStart = new Date(today); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayRevenue = orders.filter(o => { const d = new Date(o.createdAt); return d >= yesterdayStart && d < today; }).filter(o => o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0);
  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
  const activeOrders = orders.filter(o => ["Pending", "Preparing", "Ready"].includes(o.status));
  const activeStaff = staff.filter(s => s.status === "Active");
  const lowStock = inventory.filter(i => i.quantity <= i.minStock);
  const expiringSoon = inventory.filter(i => { if (!i.expiryDate) return false; const diff = (new Date(i.expiryDate).getTime() - Date.now()) / 86400000; return diff >= 0 && diff <= 3; });

  const alerts: Alert[] = [];
  lowStock.forEach(i => alerts.push({ type: i.quantity === 0 ? "error" : "warn", message: `${i.name} — ${i.quantity} ${i.unit} left (min: ${i.minStock})`, action: "Reorder", link: "/dashboard/inventory" }));
  expiringSoon.forEach(i => { const d = Math.ceil((new Date(i.expiryDate!).getTime() - Date.now()) / 86400000); alerts.push({ type: "warn", message: `${i.name} expires in ${d} day${d !== 1 ? "s" : ""} — prioritise`, action: "View", link: "/dashboard/inventory" }); });
  orders.filter(o => o.status === "Pending").forEach(o => { const mins = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000); if (mins >= 10) alerts.push({ type: "error", message: `Table ${o.tableNumber} waiting ${mins} min — ${o.orderNumber}`, action: "Check", link: "/dashboard/orders" }); });
  staff.filter(s => s.status === "On Leave").forEach(s => alerts.push({ type: "info", message: `${s.name} (${s.role}) is on leave`, link: "/dashboard/staff" }));

  const catKeywords: Record<string, string[]> = {
    "Main Course": ["masala", "biryani", "dal", "curry", "paneer", "chicken", "mutton", "fish"],
    Starters: ["tikka", "soup", "salad", "kebab", "pakora", "samosa"],
    Beverages: ["lassi", "drink", "juice", "tea", "coffee", "water", "soda"],
    Desserts: ["gulab", "ice cream", "kheer", "halwa", "rasgulla", "brownie"],
    Breads: ["naan", "roti", "paratha", "kulcha"],
  };
  const catRevenue: Record<string, number> = {};
  orders.filter(o => o.paymentStatus === "Paid" && new Date(o.createdAt) >= today).forEach(o => {
    o.items.forEach(item => {
      const lower = item.name.toLowerCase();
      let cat = "Other";
      for (const [c, kws] of Object.entries(catKeywords)) { if (kws.some(kw => lower.includes(kw))) { cat = c; break; } }
      catRevenue[cat] = (catRevenue[cat] || 0) + item.price * item.quantity;
    });
  });
  const catEntries = Object.entries(catRevenue).sort((a, b) => b[1] - a[1]);
  const maxCatRev = Math.max(...catEntries.map(e => e[1]), 1);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  if (loading && orders.length === 0) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: "1rem" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--brand)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
      <p style={{ color: "#6b6966", fontSize: "13px" }}>Loading dashboard…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="p-8 animate-fade-up">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="badge badge-orange">Manager</span></div>
          <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "#e8e6e3" }}>{greeting()}, {user?.name.split(" ")[0]} 👋</h1>
          <p style={{ color: "#6b6966" }} className="text-sm">Live restaurant overview — auto-refreshes every 30 seconds.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#6b6966", background: "var(--surface-100)", border: "1px solid var(--surface-200)", borderRadius: "8px", padding: "6px 12px" }}>{time}</div>
          <button onClick={() => load()} style={{ background: "var(--surface-100)", border: "1px solid var(--surface-200)", borderRadius: "8px", padding: "7px 12px", cursor: "pointer", color: "#6b6966", display: "flex", alignItems: "center", gap: ".4rem", fontSize: "12px" }}>
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {loading ? "Refreshing…" : `Updated ${lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          { label: "Today's Revenue", icon: TrendingUp, color: "#4ade80", value: `₹${todayRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, sub: yesterdayRevenue > 0 ? `${revenueChange >= 0 ? "↑" : "↓"} ${Math.abs(revenueChange).toFixed(0)}% vs yesterday` : "No data yesterday", subColor: revenueChange >= 0 ? "#4ade80" : "#f87171" },
          { label: "Active Orders", icon: ClipboardList, color: "#60a5fa", value: activeOrders.length, sub: `${todayOrders.length} total today` },
          { label: "Staff on Duty", icon: Users, color: "#e4a224", value: activeStaff.length, sub: `${staff.length} total · ${staff.filter(s => s.status === "On Leave").length} on leave` },
          { label: "Stock Alerts", icon: AlertTriangle, color: lowStock.length > 0 ? "#f87171" : "#4ade80", value: lowStock.length, sub: lowStock.length === 0 ? "All levels OK" : `${expiringSoon.length} expiring soon`, subColor: lowStock.length > 0 ? "#f87171" : "#4ade80" },
        ].map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6b6966" }}>{card.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.color}18` }}>
                <card.icon size={15} color={card.color} />
              </div>
            </div>
            <p className="font-display text-2xl font-semibold mb-1" style={{ color: "#e8e6e3" }}>{card.value}</p>
            <p className="text-xs" style={{ color: (card as {subColor?: string}).subColor || "#6b6966" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(alerts.length > 0) && (
        <div className="card mb-6 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--surface-200)" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} color="#f87171" />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6966" }}>Live Alerts</span>
            </div>
            <div style={{ display: "flex", gap: ".4rem" }}>
              {alerts.filter(a => a.type === "error").length > 0 && <span className="badge badge-red">{alerts.filter(a => a.type === "error").length} critical</span>}
              {alerts.filter(a => a.type === "warn").length > 0 && <span className="badge badge-yellow">{alerts.filter(a => a.type === "warn").length} warnings</span>}
            </div>
          </div>
          {alerts.length === 0 ? (
            <div className="px-5 py-4 text-sm" style={{ color: "#4ade80" }}>✓ All systems normal</div>
          ) : alerts.slice(0, 6).map((alert, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: i < Math.min(alerts.length, 6) - 1 ? "1px solid var(--surface-200)" : "none" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0, background: alert.type === "error" ? "#f87171" : alert.type === "warn" ? "#fbbf24" : "#6b6966" }} />
              <p className="flex-1 text-sm" style={{ color: "#b3b1ae" }}>{alert.message}</p>
              {alert.action && alert.link && <Link href={alert.link} className="text-xs font-medium" style={{ color: "#e4a224" }}>{alert.action} →</Link>}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Orders table */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--surface-200)" }}>
              <div className="flex items-center gap-2"><Clock size={13} style={{ color: "#6b6966" }} /><h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6966" }}>Recent Orders</h2></div>
              <Link href="/dashboard/orders" className="text-xs flex items-center gap-0.5" style={{ color: "#e4a224" }}>View all <ChevronRight size={12} /></Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12" style={{ color: "#6b6966" }}><ClipboardList size={28} className="mx-auto mb-2 opacity-20" /><p className="text-sm">No orders yet</p></div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: "1px solid var(--surface-200)" }}>{["Order #","Table","Items","Total","Status","Time"].map(h => <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: "#6b6966" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id} style={{ borderBottom: "1px solid var(--surface-200)" }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#e4a224" }}>{order.orderNumber}</td>
                      <td className="px-4 py-3" style={{ color: "#b3b1ae" }}>T{order.tableNumber}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#8f8d8a" }}>{order.items.length}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#e8e6e3" }}>₹{order.total.toFixed(0)}</td>
                      <td className="px-4 py-3"><span className={`badge ${STATUS_BADGE[order.status] || "badge-gray"}`}>{order.status}</span></td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6b6966" }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Revenue bars */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--surface-200)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6966" }}>Revenue by Category</h2>
              <span className="text-xs" style={{ color: "#6b6966" }}>Today · Paid orders</span>
            </div>
            <div className="px-5 py-4">
              {catEntries.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: "#6b6966" }}>No paid orders yet today</p>
              ) : catEntries.map(([cat, rev]) => (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: "#b3b1ae" }}>{cat}</span>
                    <span style={{ color: "#e8e6e3", fontWeight: 500 }}>₹{rev.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div style={{ height: "6px", background: "var(--surface-200)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(rev / maxCatRev) * 100}%`, background: "var(--brand)", borderRadius: "999px", transition: "width .6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Staff */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--surface-200)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6966" }}>Staff on Duty</h2>
              <Link href="/dashboard/staff" className="text-xs flex items-center gap-0.5" style={{ color: "#e4a224" }}>Manage <ChevronRight size={12} /></Link>
            </div>
            {staff.length === 0 ? (
              <div className="text-center py-8" style={{ color: "#6b6966" }}><p className="text-sm">No staff added yet</p></div>
            ) : staff.slice(0, 6).map(member => (
              <div key={member._id} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid var(--surface-200)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background: member.status === "Active" ? "rgba(74,222,128,0.12)" : "rgba(107,105,102,0.15)", color: member.status === "Active" ? "#4ade80" : "#6b6966" }}>
                  {member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#e8e6e3" }}>{member.name}</p>
                  <p className="text-xs" style={{ color: "#6b6966" }}>{member.role} · {member.shift}</p>
                </div>
                <span className={`badge ${member.status === "Active" ? "badge-green" : member.status === "On Leave" ? "badge-yellow" : "badge-gray"}`}>{member.status}</span>
              </div>
            ))}
          </div>

          {/* Inventory snapshot */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--surface-200)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6966" }}>Inventory Snapshot</h2>
              <Link href="/dashboard/inventory" className="text-xs flex items-center gap-0.5" style={{ color: "#e4a224" }}>Manage <ChevronRight size={12} /></Link>
            </div>
            <div className="px-5 py-3 grid grid-cols-3 gap-3" style={{ borderBottom: "1px solid var(--surface-200)" }}>
              {[
                { label: "Total Items", value: inventory.length, color: "#e8e6e3" },
                { label: "Low Stock", value: lowStock.length, color: lowStock.length > 0 ? "#f87171" : "#4ade80" },
                { label: "Expiring", value: expiringSoon.length, color: expiringSoon.length > 0 ? "#fbbf24" : "#4ade80" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-xl font-semibold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "#6b6966" }}>{s.label}</p>
                </div>
              ))}
            </div>
            {lowStock.length === 0 ? (
              <div className="px-5 py-4 text-sm text-center" style={{ color: "#4ade80" }}>✓ All stock levels OK</div>
            ) : lowStock.slice(0, 4).map(item => (
              <div key={item._id} className="flex items-center gap-3 px-5 py-2.5" style={{ borderBottom: "1px solid var(--surface-200)" }}>
                <AlertTriangle size={12} color={item.quantity === 0 ? "#f87171" : "#fbbf24"} />
                <span className="flex-1 text-sm" style={{ color: "#b3b1ae" }}>{item.name}</span>
                <span className="text-xs font-mono" style={{ color: item.quantity === 0 ? "#f87171" : "#fbbf24" }}>{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
