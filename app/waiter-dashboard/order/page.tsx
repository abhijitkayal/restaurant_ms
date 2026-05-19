"use client";

import { useEffect, useState } from "react";

import {
  Clock3,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  tableNumber: number;

  items: {
    name: string;
    quantity: number;
    price: number;
  }[];

  status:
    | "Pending"
    | "Preparing"
    | "Ready"
    | "Served"
    | "Cancelled";

  paymentStatus:
    | "Unpaid"
    | "Paid"
    | "Refunded";

  total: number;

  notes?: string;

  createdAt: string;
}

export default function WaiterOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(
    []
  );

  const [branch, setBranch] = useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadOrders(branchName = branch) {
    try {
      if (!branchName) {
        setOrders([]);
        return;
      }

      setLoading(true);

      const response = await fetch(
        `/api/orders?branch=${encodeURIComponent(branchName)}`
      );

      const data = await response.json();

      setOrders(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function updateStatus(
  id: string,
  status: string
) {
  try {
    await fetch(
      `/api/orders/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      }
    );

    loadOrders();
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

    if (parsedUser.role !== "waiter") {
      window.location.href = "/";
      return;
    }

    setBranch(parsedUser.branch || null);

    if (!parsedUser.branch) {
      setLoading(false);
      return;
    }

    loadOrders(parsedUser.branch || null);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        padding: "30px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: "#2a2520",
              marginBottom: "6px",
            }}
          >
            Today's Orders
          </h1>

          <p
            style={{
              color: "#888",
              fontSize: "14px",
            }}
          >
            All active orders for today
          </p>
        </div>

        <button
          onClick={() => loadOrders()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#000",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "12px 16px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px",
            color: "#888",
          }}
        >
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            background: "transparent",
            borderRadius: "18px",
            padding: "60px",
            textAlign: "center",
            border: "1px solid #eee",
          }}
        >
          <ShoppingBag
            size={40}
            color="#ccc"
            style={{
              marginBottom: "10px",
            }}
          />

          <h2
            style={{
              color: "#666",
              marginBottom: "6px",
            }}
          >
            No Orders Found
          </h2>

          <p
            style={{
              color: "#999",
              fontSize: "14px",
            }}
          >
            No active orders today
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#fff",
                borderRadius: "18px",
                border: "1px solid #eee",
                padding: "22px",
              }}
            >
              {/* Top */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      color: "#2a2520",
                      marginBottom: "4px",
                    }}
                  >
                    {order.orderNumber}
                  </h2>

                  <p
                    style={{
                      color: "#777",
                      fontSize: "14px",
                    }}
                  >
                    Table {
                      order.tableNumber
                    }
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
              <select
  value={order.status}
  aria-label="Order status"
  onChange={async (e) => {
    try {
      await fetch(
        `/api/orders/${order._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status:
              e.target.value,
          }),
        }
      );

      loadOrders();
    } catch (error) {
      console.log(error);
    }
  }}
  style={{
    padding: "8px 14px",
    borderRadius: "999px",
    border: "none",
    outline: "none",
    background:
      order.status ===
      "Served"
        ? "#22c55e"
        : order.status ===
          "Preparing"
        ? "#f59e0b"
        : order.status ===
          "Ready"
        ? "#3b82f6"
        : "#6b7280",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  <option value="Pending">
    Pending
  </option>

  <option value="Preparing">
    Preparing
  </option>

  <option value="Ready">
    Ready
  </option>

 {(order.status ===
  "Ready" ||
  order.status ===
    "Served") &&
  order.paymentStatus ===
    "Paid" && (
    <option value="Served">
      Served
    </option>
)}
</select>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#888",
                      fontSize: "13px",
                    }}
                  >
                    <Clock3 size={14} />

                    {new Date(
                      order.createdAt
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                {order.items.map(
                  (item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        padding: "8px 0",
                        borderBottom:
                          "1px solid #f3f3f3",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight:
                              "600",
                          }}
                        >
                          {
                            item.quantity
                          }
                          x
                        </span>{" "}
                        {item.name}
                      </div>

                      <div
                        style={{
                          color: "#666",
                        }}
                      >
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(0)}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Notes */}
              {order.notes && (
                <div
                  style={{
                    background: "#fff7ed",
                    border:
                      "1px solid #fed7aa",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "#9a3412",
                    marginBottom: "18px",
                  }}
                >
                  📝 {order.notes}
                </div>
              )}

              {/* Bottom */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "13px",
                    }}
                  >
                    Payment
                  </p>

                  <h3
                    style={{
                      color:
                        order.paymentStatus ===
                        "Paid"
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >
                    {order.paymentStatus}
                  </h3>
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <p
                    style={{
                      color: "#888",
                      fontSize: "13px",
                    }}
                  >
                    Total
                  </p>

                  <h2
                    style={{
                      fontSize: "26px",
                      color: "#2a2520",
                    }}
                  >
                    ₹
                    {order.total.toFixed(
                      0
                    )}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}