"use client";

import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  Bell,
  Table,
} from "lucide-react";
import { Howl } from "howler";

import WaiterOrdersPage from "./dashboard/page";
import WaiterTables from "./table/page";

export default function WaiterDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    servedOrders: 0,
  });

  const [branchSettings, setBranchSettings] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const previousCount = useRef<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationSound = new Howl({ src: ["/sounds/notification.wav"], volume: 1.0 });

  async function loadDashboard(branchName?: string) {
    try {
      let branch = branchName;
      if (!branch) {
        const u = localStorage.getItem("user");
        branch = u ? JSON.parse(u).branch : null;
      }
      if (!branch) return;

      const res = await fetch(`/api/orders?branch=${encodeURIComponent(branch)}`);
      const data = await res.json();
      if (data.success) {
        const orders = data.data || [];
        setDashboardData({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === "Pending").length,
          servedOrders: orders.filter((o: any) => o.status === "Served").length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadNotifications(branchName?: string) {
    try {
      let branch = branchName;
      if (!branch) {
        const u = localStorage.getItem("user");
        branch = u ? JSON.parse(u).branch : null;
      }
      if (!branch) {
        setNotifications([]);
        return;
      }

      const res = await fetch(`/api/notifications?branchName=${encodeURIComponent(branch)}`);
      const data = await res.json();
      if (data.success) {
        setNotifications((data.data || []).filter((n: any) => n.branch === branch));
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("loadNotifications error", err);
      setNotifications([]);
    }
  }

  async function loadBranchSettings(branchName?: string) {
    try {
      if (!branchName) {
        const u = localStorage.getItem("user");
        branchName = u ? JSON.parse(u).branch : null;
      }
      if (!branchName) return;
      const res = await fetch(`/api/branches?branchName=${encodeURIComponent(branchName)}`);
      const data = await res.json();
      setBranchSettings(data?.data?.[0] || null);
    } catch (err) {
      console.error("loadBranchSettings error", err);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/";
      return;
    }
    const parsed = JSON.parse(user);
    if (parsed.role !== "waiter") {
      window.location.href = "/";
      return;
    }

    const branch = parsed.branch;
    loadDashboard(branch);
    loadNotifications(branch);
    loadBranchSettings(branch);

    const interval = setInterval(() => {
      loadNotifications(branch);
      loadDashboard(branch);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.waiterRead).length;
    if (unread > previousCount.current && previousCount.current !== 0) {
      notificationSound.play();
      setActiveTab("orders");
    }
    previousCount.current = unread;
  }, [notifications]);

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const logoSrc = branchSettings?.logoUrl || (branchSettings?.logoPublicId && cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload/${branchSettings.logoPublicId}` : undefined);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#111111", color: "#fff", fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ width: "260px", background: "#1a1a1a", borderRight: "1px solid #2a2a2a", padding: "24px 18px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {logoSrc ? (
                <img src={logoSrc} alt="branch logo" style={{ height: 36, width: 36, objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = "none")} />
              ) : null}
              <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f59e0b" }}>Saveur</h1>
            </div>

            <div style={{ position: "relative" }}>
              <div onClick={() => setShowNotifications(!showNotifications)} style={{ width: 44, height: 44, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <Bell size={20} />
                {notifications.filter((n) => !n.waiterRead).length > 0 && (
                  <div style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                    {notifications.filter((n) => !n.waiterRead).length}
                  </div>
                )}
              </div>

              {showNotifications && (
                <div style={{ position: "absolute", top: 55, right: -20, left: 20, width: 320, background: "#1f1f1f", border: "1px solid #2a2a2a", borderRadius: 16, padding: 14, zIndex: 100, maxHeight: 400, overflowY: "auto" }}>
                  <h3 style={{ marginBottom: 14 }}>Notifications</h3>
                  {notifications.length === 0 ? <p style={{ color: "#888" }}>No notifications</p> : notifications.filter((n) => !n.waiterRead).map((n) => (
                    <div key={n._id} style={{ background: "#2a2a2a", padding: 12, borderRadius: 12, marginBottom: 10, border: !n.waiterRead ? "1px solid #f59e0b" : "1px solid transparent" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <h4 style={{ fontSize: 14 }}>{n.title}</h4>
                        {!n.waiterRead && (
                          <button onClick={async () => { await fetch(`/api/notifications/waiter/${n._id}`, { method: "PUT" }); await loadNotifications(); }} style={{ background: "#22c55e", border: "none", color: "#fff", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Read</button>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: "#999" }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Waiter Panel</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => setActiveTab("dashboard")} style={{ display: "flex", alignItems: "center", gap: 12, background: activeTab === "dashboard" ? "#d4841a" : "transparent", color: activeTab === "dashboard" ? "#000" : "#fff", border: "none", borderRadius: 12, padding: "14px", cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button onClick={() => setActiveTab("orders")} style={{ display: "flex", alignItems: "center", gap: 12, background: activeTab === "orders" ? "#d4841a" : "transparent", color: activeTab === "orders" ? "#000" : "#fff", border: "none", borderRadius: 12, padding: "14px", cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
            <ShoppingCart size={18} /> Orders
          </button>

          <button onClick={() => setActiveTab("tables")} style={{ display: "flex", alignItems: "center", gap: 12, background: activeTab === "tables" ? "#d4841a" : "transparent", color: activeTab === "tables" ? "#000" : "#fff", border: "none", borderRadius: 12, padding: "14px", cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
            <Table size={18} /> Table
          </button>
        </div>

        <button onClick={logout} style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, padding: "14px", cursor: "pointer", fontWeight: 600 }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ flex: 1, padding: "30px" }}>
        {activeTab === "dashboard" && (
          <div>
            <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 20, color: "#fff" }}>Waiter Dashboard</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
              <div style={{ background: "transparent", borderRadius: 18, padding: 24, border: "2px solid #eee" }}>
                <h3 style={{ color: "#999", marginBottom: 10 }}>Active Tables</h3>
                <h1 style={{ fontSize: 38, color: "#d4841a" }}>{dashboardData.totalOrders}</h1>
              </div>
              <div style={{ background: "transparent", borderRadius: 18, padding: 24, border: "2px solid #eee" }}>
                <h3 style={{ color: "#999", marginBottom: 10 }}>Pending Orders</h3>
                <h1 style={{ fontSize: 38, color: "#ef4444" }}>{dashboardData.pendingOrders}</h1>
              </div>
              <div style={{ background: "transparent", borderRadius: 18, padding: 24, border: "2px solid #eee" }}>
                <h3 style={{ color: "#999", marginBottom: 10 }}>Served Today</h3>
                <h1 style={{ fontSize: 38, color: "#16a34a" }}>{dashboardData.servedOrders}</h1>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && <WaiterOrdersPage />}
        {activeTab === "tables" && <WaiterTables />}
      </div>
    </div>
  );
}
