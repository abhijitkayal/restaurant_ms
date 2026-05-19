"use client";

import { useEffect, useRef, useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  Bell,
} from "lucide-react";
import WaiterOrdersPage from "./order/page";
import WaiterTables from "./table/page";
import { Howl } from "howler";
const notificationSound =
  new Howl({
    src: [
      "/sounds/notification.wav",
    ],

    volume: 1.0,

    html5: true,
  });

export default function WaiterDashboard() {
  const [activeTab, setActiveTab] =
    useState("dashboard");
  const [
  notifications,
  setNotifications,
] = useState([]);
const previousCount =
  useRef(0);
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
              "Pending"
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

const [
  showNotifications,
  setShowNotifications,
] = useState(false);
async function loadNotifications() {
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
      `/api/notifications${branch ? `?branch=${encodeURIComponent(branch)}` : ""}`
    );

    const data =
      await response.json();

    if (data.success) {
      setNotifications(data.data);
    }
  } catch (error) {
    console.log(error);
  }
}
useEffect(() => {
  loadNotifications();

  loadDashboard();

  const interval =
    setInterval(() => {
      loadNotifications();

      loadDashboard();
    }, 3000);

  return () =>
    clearInterval(interval);
}, []);


useEffect(() => {
  const unreadCount =
    notifications.filter(
      (n: any) => !n.waiterRead
    ).length;

  if (
    unreadCount >
    previousCount.current
  ) {
    notificationSound.play();
  }

  previousCount.current =
    unreadCount;
}, [notifications]);
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      window.location.href = "/";
      return;
    }

    const parsedUser = JSON.parse(user);

    if (parsedUser.role !== "waiter") {
      window.location.href = "/";
    }
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
          <div
  style={{
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
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

  {/* BELL */}
  <div
    style={{
      position: "relative",
    }}
  >
    <div
      onClick={() =>
        setShowNotifications(
          !showNotifications
        )
      }
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Bell size={20} />

      {notifications.filter(
        (n: any) => !n.waiterRead
      ).length > 0 && (
        <div
          style={{
            position:
              "absolute",
            top: "2px",
            right: "2px",
            width: "18px",
            height: "18px",
            borderRadius:
              "50%",
            background:
              "#ef4444",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            fontSize: "10px",
            fontWeight: "700",
          }}
        >
          {
            notifications.filter(
              (n: any) => !n.waiterRead
            ).length
          }
        </div>
      )}
    </div>

    {/* DROPDOWN */}
    {showNotifications && (
      <div
        style={{
          position: "absolute",
          top: "55px",
          right: "-20px",
          left:"20px",
          width: "320px",
          background: "#1f1f1f",
          border:
            "1px solid #2a2a2a",
          borderRadius: "16px",
          padding: "14px",
          zIndex: 100,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            marginBottom: "14px",
          }}
        >
          Notifications
        </h3>

        {notifications.length ===
        0 ? (
          <p
            style={{
              color: "#888",
            }}
          >
            No notifications
          </p>
        ) : (
        notifications
  .filter(
    (n: any) => !n.waiterRead
  ).map((n: any) => (
  <div
    key={n._id}
    style={{
      background: "#2a2a2a",
      padding: "12px",
      borderRadius: "12px",
      marginBottom: "10px",
      border:
        !n.waiterRead
          ? "1px solid #f59e0b"
          : "1px solid transparent",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginBottom: "6px",
      }}
    >
      <h4
        style={{
          fontSize: "14px",
        }}
      >
        {n.title}
      </h4>

      {/* READ BUTTON */}
      {!n.waiterRead && (
        <button
          onClick={async () => {
            await fetch(
  `/api/notifications/waiter/${n._id}`,
  {
    method: "PUT",
  }
);

            loadNotifications();
          }}
          style={{
            background:
              "#22c55e",
            border: "none",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "600",
          }}
        >
          Read
        </button>
      )}
    </div>

    <p
      style={{
        fontSize: "13px",
        color: "#999",
      }}
    >
      {n.message}
    </p>
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
             <button
            onClick={() =>
              setActiveTab("tables")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "tables"
                  ? "#d4841a"
                  : "transparent",
              color:
                activeTab === "tables"
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
            Table
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
                  Active Tables
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
                  Served Today
                </h3>

                <h1
                  style={{
                    fontSize: "38px",
                    color: "#16a34a",
                  }}
                >
                  {
  dashboardData.servedOrders
}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
         
    <WaiterOrdersPage/>

        )}
        {activeTab === "tables" && (
          <WaiterTables />
        )}
        </div>
        </div>
  );
}



