"use client";

import { useEffect, useState } from "react";
import { Clock3, RefreshCw, ShoppingBag } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  status: "Pending" | "Preparing" | "Ready" | "Served" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  total: number;
  notes?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Served:    "#22c55e",
  Preparing: "#f59e0b",
  Ready:     "#3b82f6",
  Pending:   "#6b7280",
  Cancelled: "#ef4444",
};

export default function WaiterOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [branch, setBranch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadOrders(branchName = branch) {
    try {
      if (!branchName) { setOrders([]); return; }
      setLoading(true);
      const res = await fetch(`/api/orders?branch=${encodeURIComponent(branchName)}`);
      const data = await res.json();
      setOrders(data.data || []);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) { window.location.href = "/"; return; }
    const p = JSON.parse(user);
    if (p.role !== "waiter") { window.location.href = "/"; return; }
    setBranch(p.branch || null);
    if (!p.branch) { setLoading(false); return; }
    loadOrders(p.branch || null);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .wo-root {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 32px;
          font-family: 'Outfit', sans-serif;
        }

        /* HEADER */
        .wo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .wo-title {
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .wo-subtitle {
          color: #555;
          font-size: 13px;
        }

        .wo-refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid #1c1c1c;
          border-radius: 10px;
          padding: 11px 16px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          transition: border-color 0.15s, background 0.15s;
        }

        .wo-refresh-btn:hover { border-color: #333; background: #0a0a0a; }

        /* LOADING */
        .wo-loading {
          text-align: center;
          padding: 80px;
          color: #444;
          font-size: 14px;
        }

        /* EMPTY */
        .wo-empty {
          background: transparent;
          border: 1px solid #1c1c1c;
          border-radius: 18px;
          padding: 60px;
          text-align: center;
        }

        .wo-empty-title { color: #fff; font-size: 18px; font-weight: 600; margin: 12px 0 6px; }
        .wo-empty-sub   { color: #555; font-size: 13px; }

        /* ORDER LIST */
        .wo-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ORDER CARD */
        .wo-card {
          background: transparent;
          border: 1px solid #1c1c1c;
          border-radius: 18px;
          padding: 22px;
          transition: border-color 0.15s;
        }

        .wo-card:hover { border-color: #2a2a2a; }

        /* CARD TOP */
        .wo-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .wo-order-num {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
          font-family: 'JetBrains Mono', monospace;
        }

        .wo-table-num { color: #666; font-size: 13px; }

        .wo-card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* STATUS SELECT */
        .wo-status-select {
          padding: 8px 14px;
          border-radius: 999px;
          border: none;
          outline: none;
          color: #fff;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          appearance: none;
          -webkit-appearance: none;
        }

        .wo-status-select option {
          background: #111;
          color: #fff;
        }

        /* TIME */
        .wo-time {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #555;
          font-size: 12px;
        }

        /* DIVIDER */
        .wo-divider {
          border: none;
          border-top: 1px solid #111;
          margin: 0 0 16px;
        }

        /* ITEMS */
        .wo-items { margin-bottom: 16px; }

        .wo-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid #0f0f0f;
          font-size: 14px;
        }

        .wo-item-row:last-child { border-bottom: none; }

        .wo-item-name { color: #fff; }
        .wo-item-qty  { color: #d4841a; font-weight: 700; margin-right: 6px; }
        .wo-item-price{ color: #666; font-family: 'JetBrains Mono', monospace; font-size: 13px; }

        /* NOTES */
        .wo-notes {
          background: transparent;
          border: 1px solid #d4841a33;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          color: #d4841a;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        /* CARD FOOTER */
        .wo-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid #111;
        }

        .wo-payment-label { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }

        .wo-payment-status {
          font-size: 14px;
          font-weight: 700;
        }

        .wo-total-label { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; text-align: right; }

        .wo-total-val {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          text-align: right;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <div className="wo-root">
        {/* HEADER */}
        <div className="wo-header">
          <div>
            <div className="wo-title">Today's Orders</div>
            <div className="wo-subtitle">All active orders for today</div>
          </div>
          <button className="wo-refresh-btn" onClick={() => loadOrders()}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="wo-loading">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="wo-empty">
            <ShoppingBag size={36} color="#333" />
            <div className="wo-empty-title">No Orders Found</div>
            <div className="wo-empty-sub">No active orders today</div>
          </div>
        ) : (
          <div className="wo-list">
            {orders.map((order) => (
              <div key={order._id} className="wo-card">
                {/* TOP */}
                <div className="wo-card-top">
                  <div>
                    <div className="wo-order-num">{order.orderNumber}</div>
                    <div className="wo-table-num">Table {order.tableNumber}</div>
                  </div>
                  <div className="wo-card-actions">
                    <select
                      value={order.status}
                      aria-label="Order status"
                      className="wo-status-select"
                      style={{ background: STATUS_COLORS[order.status] ?? "#6b7280" }}
                      onChange={async (e) => {
                        try {
                          await fetch(`/api/orders/${order._id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: e.target.value }),
                          });
                          loadOrders();
                        } catch (err) { console.log(err); }
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      {(order.status === "Ready" || order.status === "Served") &&
                        order.paymentStatus === "Paid" && (
                          <option value="Served">Served</option>
                        )}
                    </select>

                    <div className="wo-time">
                      <Clock3 size={13} />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                <hr className="wo-divider" />

                {/* ITEMS */}
                <div className="wo-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="wo-item-row">
                      <div className="wo-item-name">
                        <span className="wo-item-qty">{item.quantity}×</span>
                        {item.name}
                      </div>
                      <div className="wo-item-price">₹{(item.price * item.quantity).toFixed(0)}</div>
                    </div>
                  ))}
                </div>

                {/* NOTES */}
                {order.notes && (
                  <div className="wo-notes">📝 {order.notes}</div>
                )}

                {/* FOOTER */}
                <div className="wo-card-footer">
                  <div>
                    <div className="wo-payment-label">Payment</div>
                    <div
                      className="wo-payment-status"
                      style={{ color: order.paymentStatus === "Paid" ? "#22c55e" : "#ef4444" }}
                    >
                      {order.paymentStatus}
                    </div>
                  </div>
                  <div>
                    <div className="wo-total-label">Total</div>
                    <div className="wo-total-val">₹{order.total.toFixed(0)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}