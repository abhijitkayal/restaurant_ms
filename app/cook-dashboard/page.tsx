"use client";

import { useEffect, useState, useRef } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  Bell,
} from "lucide-react";
import { Howl } from "howler";
// import WaiterOrdersPage from "./order/page";
import OrderPage from "./order/page";

export default function WaiterDashboard() {
  const [activeTab, setActiveTab] =
    useState("dashboard");

    const [
  dashboardData,
  setDashboardData,
] = useState({
  totalOrders: 0,

  pendingOrders: 0,

  servedOrders: 0,
});
  const [branchSettings, setBranchSettings] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const previousCount = useRef<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationSound = new Howl({
    src: ["/sounds/notification.wav"],
    volume: 1.0,
  });

  async function loadNotifications(branchName?: string) {
    try {
      let branchToUse = branchName;
      if (!branchToUse) {
        try {
          const u = localStorage.getItem("user");
          branchToUse = u ? JSON.parse(u).branch : undefined;
        } catch {
          branchToUse = undefined;
        }
      }

      if (!branchToUse) {
        setNotifications([]);
        return;
      }

      const res = await fetch(`/api/notifications?branchName=${encodeURIComponent(branchToUse)}`);
      const data = await res.json();
      if (data.success) {
        setNotifications((data.data || []).filter((n: any) => n.branch === branchToUse));
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("loadNotifications cook error", err);
      setNotifications([]);
    }
  }
async function loadDashboard() {
  try {
    const branchFromStorage = (() => {
      try {
        const u = localStorage.getItem("user");
        return u ? JSON.parse(u).branch : null;
      } catch {
        return null;
      }
    })();

    const branch = branchFromStorage;

    const response = await fetch(
      `/api/orders${branch ? `?branch=${encodeURIComponent(branch)}` : ""}`
    );

    const data =
      await response.json();

    if (data.success) {
      const orders = data.data;

      setDashboardData({
        totalOrders:
          orders.length,

        pendingOrders:
          orders.filter(
            (o: any) =>
              o.status ===
                "Pending" ||
              o.status ===
                "Preparing"
          ).length,

        servedOrders:
          orders.filter(
            (o: any) =>
              o.status ===
              "Served"
          ).length,
      });
    }
  } catch (error) {
    console.log(error);
  }
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
    }
    loadDashboard();

    try {
      const u = localStorage.getItem("user");
      const parsed = u ? JSON.parse(u) : null;
      const branchFromStorage = parsed ? parsed.branch : null;
      if (branchFromStorage) {
        (async () => {
          try {
            const res = await fetch(`/api/branches?branchName=${encodeURIComponent(branchFromStorage)}`);
            const data = await res.json();
            setBranchSettings(data?.data?.[0] || null);
          } catch (err) {
            console.error("loadBranchSettings cook error", err);
          }
        })();

        // start notification polling for cook
        loadNotifications(branchFromStorage);

        const interval = setInterval(() => {
          loadNotifications(branchFromStorage);
        }, 3000);

        // cleanup on unmount
        return () => clearInterval(interval);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    // when notifications change, if unread increases, play sound and open orders
    try {
      const unread = notifications.filter((n) => !n.cookRead).length;
      const prev = previousCount.current || 0;
      if (unread > prev && prev !== 0) {
        notificationSound.play();
        setActiveTab("orders");
      }
      previousCount.current = unread;
    } catch (e) {
      // ignore
    }
  }, [notifications]);

  function logout() {
    localStorage.removeItem("user");

    window.location.href = "/";
  }

  return (
    <div
     style={{
        display: "flex",
        minHeight: "100vh",
        background: "#111111",
        color: "#fff",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* SIDEBAR */}
      <div
                style={{
          width: "260px",
          background: "#1a1a1a",
          borderRight: "1px solid #2a2a2a",
          padding: "24px 18px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {(() => {
              const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
              const logoSrc =
                branchSettings?.logoUrl ||
                (branchSettings?.logoPublicId && cloudName
                  ? `https://res.cloudinary.com/${cloudName}/image/upload/${branchSettings.logoPublicId}`
                  : undefined);

              return logoSrc ? (
                <img
                  src={logoSrc}
                  alt={"branch logo"}
                  style={{ height: 36, width: 36, objectFit: "contain" }}
                  onError={(e) => {
                    console.error("Cook dashboard logo failed:", e.currentTarget.src);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null;
            })()}

            <div style={{ marginLeft: 6 }}>
              <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#f59e0b",
              }}
            >
              Saveur
            </h1>
            </div>

            {/* COOK NOTIFICATIONS */}
            <div style={{ marginLeft: "auto", position: "relative" }}>
              <div
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Bell size={18} />

                {notifications.filter((n) => !n.cookRead).length > 0 && (
                  <div style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}>
                    {notifications.filter((n) => !n.cookRead).length}
                  </div>
                )}
              </div>

              {showNotifications && (
                <div style={{
                  position: "absolute",
                  top: 48,
                  left:20,
                  right: 0,
                  width: 320,
                  background: "#1f1f1f",
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: 12,
                  zIndex: 100,
                  maxHeight: 380,
                  overflowY: "auto",
                }}>
                  <h3 style={{ marginBottom: 8 }}>Notifications</h3>
                  {notifications.length === 0 ? (
                    <p style={{ color: "#888" }}>No notifications</p>
                  ) : (
                    notifications.filter((n) => !n.cookRead).map((n) => (
                      <div key={n._id} style={{ background: "#2a2a2a", padding: 10, borderRadius: 10, marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <h4 style={{ fontSize: 14 }}>{n.title}</h4>
                          <button
                            onClick={async () => {
                              await fetch(`/api/notifications/cook/${n._id}`, { method: "PUT" });
                              await loadNotifications();
                            }}
                            style={{ background: "#22c55e", border: "none", color: "#fff", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}
                          >
                            Read
                          </button>
                        </div>
                        <p style={{ fontSize: 13, color: "#999" }}>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <p
            style={{
              color: "#888",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Cooker Panel
          </p>
        </div>

        {/* MENU */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Dashboard */}
          <button
            onClick={() =>
              setActiveTab("dashboard")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "dashboard"
                  ? "#d4841a"
                  : "transparent",
              color:
                activeTab === "dashboard"
                  ? "#000"
                  : "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          {/* Orders */}
          <button
            onClick={() =>
              setActiveTab("orders")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "orders"
                  ? "#d4841a"
                  : "transparent",
              color:
                activeTab === "orders"
                  ? "#000"
                  : "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <ShoppingCart size={18} />
            Orders
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h1
              style={{
                fontSize: "34px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "#fff",
              }}
            >
              Cooker Dashboard
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "transparent",
                  borderRadius: "18px",
                  padding: "24px",
                  border: "2px solid #eee",
                }}
              >
                <h3
                  style={{
                    color: "#999",
                    marginBottom: "10px",
                  }}
                >
                  Total Orders
                </h3>

                <h1
                  style={{
                    fontSize: "38px",
                    color: "#d4841a",
                  }}
                >
                  {
  dashboardData.totalOrders
}
                </h1>
              </div>

              <div
                style={{
                  background: "transparent",
                  borderRadius: "18px",
                  padding: "24px",
                  border: "2px solid #eee",
                }}
              >
                <h3
                  style={{
                    color: "#999",
                    marginBottom: "10px",
                  }}
                >
                  Pending Orders
                </h3>

                <h1
                  style={{
                    fontSize: "38px",
                    color: "#ef4444",
                  }}
                >
                  {
  dashboardData.pendingOrders
}
                </h1>
              </div>

             
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
         
    <OrderPage/>

        )}
        </div>
        </div>
  );
}