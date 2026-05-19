"use client";

import { useEffect, useState } from "react";

import {
  ChefHat,
  Clock3,
  CheckCircle2,
} from "lucide-react";

interface Order {
  _id: string;

  orderNumber: string;

  tableNumber: number;

  status: string;

  items: {
    name: string;

    quantity: number;

    price: number;
  }[];

  createdAt: string;

  notes?: string;
}

export default function CookPage() {
  const [orders, setOrders] = useState<
    Order[]
  >([]);

  const [branch, setBranch] = useState<string | null>(null);

  async function loadOrders(branchName = branch) {
    if (!branchName) {
      setOrders([]);
      return;
    }

    const response = await fetch(
      `/api/orders?branch=${encodeURIComponent(branchName)}`
    );

    const data = await response.json();

    if (data.success) {
      // Filter for orders that should be shown to cooks (Pending or Preparing)
      const cookOrders = (data.data || []).filter((order: Order) => 
        order.status === "Pending" || order.status === "Preparing" || order.status === "Ready"
      );
      setOrders(cookOrders);
    } else {
      setOrders([]);
    }
  }

  async function markReady(
    id: string
  ) {
    await fetch(
      `/api/orders/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status: "Ready",
        }),
      }
    );

    setOrders((prev) =>
      prev.map((order) =>
        order._id === id
          ? {
              ...order,
              status: "Ready",
            }
          : order
      )
    );
  }

  useEffect(() => {
    const user = localStorage.getItem(
      "user"
    );

    if (!user) {
      window.location.href = "/";
      return;
    }

    const parsedUser = JSON.parse(user);

    if (parsedUser.role !== "cook") {
      window.location.href = "/";
      return;
    }

    setBranch(parsedUser.branch || null);

    if (!parsedUser.branch) {
      return;
    }

    loadOrders(parsedUser.branch || null);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "30px",
        fontFamily:
          "'DM Sans', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Cook Dashboard
        </h1>

        <p
          style={{
            color: "#888",
          }}
        >
          Today's Orders Queue
        </p>
      </div>

      {/* ORDERS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(350px,1fr))",
          gap: "22px",
        }}
      >
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#111",
              border:
                "1px solid #222",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            {/* TOP */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "22px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    marginBottom: "4px",
                  }}
                >
                  {
                    order.orderNumber
                  }
                </h2>

                <p
                  style={{
                    color: "#888",
                  }}
                >
                  Table{" "}
                  {
                    order.tableNumber
                  }
                </p>
              </div>

              <div
                style={{
                  background:
                    order.status ===
                    "Ready"
                      ? "#052e16"
                      : "#3b1d04",

                  color:
                    order.status ===
                    "Ready"
                      ? "#22c55e"
                      : "#f59e0b",

                  padding:
                    "8px 14px",

                  borderRadius:
                    "999px",

                  fontSize: "13px",

                  fontWeight: "600",
                }}
              >
                {order.status}
              </div>
            </div>

            {/* ITEMS */}
            <div
              style={{
                marginBottom: "22px",
              }}
            >
              {order.items.map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      padding:
                        "10px 0",
                      borderBottom:
                        "1px solid #1f1f1f",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                      }}
                    >
                      <ChefHat
                        size={16}
                        color="#d4841a"
                      />

                      <span>
                        {
                          item.quantity
                        }
                        x{" "}
                        {
                          item.name
                        }
                      </span>
                    </div>

                    <span
                      style={{
                        color:
                          "#888",
                      }}
                    >
                      ₹
                      {item.price *
                        item.quantity}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* NOTES */}
            {order.notes && (
              <div
                style={{
                  background:
                    "#1a1a1a",
                  border:
                    "1px solid #222",
                  padding:
                    "14px",
                  borderRadius:
                    "14px",
                  marginBottom:
                    "20px",
                  color: "#bbb",
                  fontSize:
                    "14px",
                }}
              >
                📝 {order.notes}
              </div>
            )}

            {/* FOOTER */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px",
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                <Clock3 size={16} />

                {new Date(
                  order.createdAt
                ).toLocaleTimeString()}
              </div>

              {order.status !==
  "Ready" &&
 order.status !==
  "Served"  &&(
                <button
                  onClick={() =>
                    markReady(
                      order._id
                    )
                  }
                  style={{
                    background:
                      "#22c55e",
                    border: "none",
                    color: "#fff",
                    borderRadius:
                      "14px",
                    padding:
                      "12px 18px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "600",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                  }}
                >
                  <CheckCircle2
                    size={18}
                  />
                  Mark Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}