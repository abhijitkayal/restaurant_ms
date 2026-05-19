"use client";

import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  LogOut,
} from "lucide-react";
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
  }, []);

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
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#f59e0b",
            }}
          >
            Saveur
          </h1>

          <p
            style={{
              color: "#888",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Waiter Panel
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
                  ? "#fff"
                  : "#444",
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
                  ? "#fff"
                  : "#444",
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
                color: "#2a2520",
              }}
            >
              Waiter Dashboard
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
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "24px",
                  border: "1px solid #eee",
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
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "24px",
                  border: "1px solid #eee",
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