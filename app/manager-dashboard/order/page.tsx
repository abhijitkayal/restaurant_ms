"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, ClipboardList, ChevronDown, X, IndianRupee } from "lucide-react";

interface OrderItem {
  name: string;

  quantity: number;

  price: number;

  inventoryUsed: number;
}
interface Order {
  _id: string;
  orderNumber: string;
  tableNumber: number;
  items: OrderItem[];
  status: "Pending" | "Preparing" | "Ready" | "Served" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  paymentMethod?: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
}
interface MenuItem {
  _id: string;

  menuName: string;

  price: number;

  requirements: {
    product: string;

    quantity: number;

    unit: string;
  }[];
}

const statusBadge: Record<string, string> = { Pending: "badge-yellow", Preparing: "badge-blue", Ready: "badge-orange", Served: "badge-green", Cancelled: "badge-red" };
const payBadge: Record<string, string> = { Unpaid: "badge-red", Paid: "badge-green", Refunded: "badge-gray" };

// const MENU = [
//   { name: "Chicken Tikka Masala", price: 320 },
//   { name: "Paneer Butter Masala", price: 280 },
//   { name: "Biryani (Veg)", price: 250 },
//   { name: "Biryani (Chicken)", price: 320 },
//   { name: "Dal Makhani", price: 220 },
//   { name: "Garlic Naan", price: 50 },
//   { name: "Butter Roti", price: 35 },
//   { name: "Raita", price: 80 },
//   { name: "Lassi", price: 120 },
//   { name: "Cold Drink", price: 80 },
//   { name: "Gulab Jamun", price: 100 },
//   { name: "Ice Cream", price: 120 },
// ];
const MENU = [
  {
    name: "Chicken Tikka Masala",

    price: 320,

    inventory: [
      {
        product: "Chicken",
        quantity: 250,
      },

      {
        product: "salt",
        quantity: 10,
      },

      {
        product: "Oil",
        quantity: 20,
      },
    ],
  },

  {
    name: "Paneer Butter Masala",

    price: 280,

    inventory: [
      {
        product: "Paneer",
        quantity: 200,
      },

      {
        product: "Salt",
        quantity: 8,
      },

      {
        product: "Butter",
        quantity: 20,
      },
    ],
  },

  {
    name: "Biryani (Veg)",

    price: 250,

    inventory: [
      {
        product: "Rice",
        quantity: 300,
      },

      {
        product: "Salt",
        quantity: 10,
      },

      {
        product: "Vegetable",
        quantity: 150,
      },
    ],
  },

  {
    name: "Biryani (Chicken)",

    price: 320,

    inventory: [
      {
        product: "Chicken",
        quantity: 250,
      },

      {
        product: "Rice",
        quantity: 300,
      },

      {
        product: "Salt",
        quantity: 12,
      },
    ],
  },

  {
    name: "Dal Makhani",

    price: 220,

    inventory: [
      {
        product: "Dal",
        quantity: 200,
      },

      {
        product: "Salt",
        quantity: 8,
      },
    ],
  },

  {
    name: "Garlic Naan",

    price: 50,

    inventory: [
      {
        product: "Flour",
        quantity: 100,
      },

      {
        product: "Garlic",
        quantity: 15,
      },

      {
        product: "Salt",
        quantity: 5,
      },
    ],
  },

  {
    name: "Butter Roti",

    price: 35,

    inventory: [
      {
        product: "Flour",
        quantity: 80,
      },

      {
        product: "Butter",
        quantity: 10,
      },

      {
        product: "Salt",
        quantity: 4,
      },
    ],
  },

  {
    name: "Raita",

    price: 80,

    inventory: [
      {
        product: "Curd",
        quantity: 150,
      },

      {
        product: "Salt",
        quantity: 3,
      },
    ],
  },

  {
    name: "Lassi",

    price: 120,

    inventory: [
      {
        product: "Curd",
        quantity: 200,
      },

      {
        product: "Sugar",
        quantity: 15,
      },
    ],
  },

  {
    name: "Cold Drink",

    price: 80,

    inventory: [
      {
        product: "Cold Drink Bottle",
        quantity: 1,
      },
    ],
  },

  {
    name: "Gulab Jamun",

    price: 100,

    inventory: [
      {
        product: "Milk Powder",
        quantity: 100,
      },

      {
        product: "Sugar",
        quantity: 20,
      },
    ],
  },

  {
    name: "Ice Cream",

    price: 120,

    inventory: [
      {
        product: "Ice Cream Cup",
        quantity: 1,
      },
    ],
  },
];

export default function OrdersPage() {
  const [branch, setBranch] = useState<string | null>(null);
  const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] =
  useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
const [newItems, setNewItems] = useState<OrderItem[]>([
  {
    name: "",
    quantity: 1,
    price: 0,
    inventoryUsed: 1,
  },
]);
  const [tableNum, setTableNum] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const branchName = params.get("branchName");
    setQueryBranchName(branchName);

    if (branchName) {
      setBranch(branchName);
    } else {
      try {
        const u = localStorage.getItem("user");
        setBranch(u ? JSON.parse(u).branch : null);
      } catch {
        setBranch(null);
      }
    }
  }, []);

  async function load() {
    setLoading(true);
    const url = branch ? `/api/orders?branchName=${encodeURIComponent(branch)}` : "/api/orders";
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.data || []);
    setLoading(false);
  }

  useEffect(() => {
  if (branch !== null) {
    load();
    loadMenu();
  }
}, [branch]);
  async function loadMenu() {
  try {
    const url = branch ? `/api/menu?branchName=${encodeURIComponent(branch)}` : "/api/menu";
    const response = await fetch(url);

    const data =
      await response.json();

    setMenuItems(
      data.data || []
    );
  } catch (error) {
    console.log(error);
  }
}

  async function placeOrder() {
    const validItems = newItems.filter(i => i.name && i.price > 0);
    if (!validItems.length) return;
    setSaving(true);

    await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tableNumber: tableNum, items: validItems, notes, branch }) });
    setSaving(false);
    setShowModal(false);
    setNewItems([
  {
    name: "",
    quantity: 1,
    price: 0,
    inventoryUsed: 1,
  },
]);
    setNotes("");
    load();
  }

  async function updateStatus(
  id: string,
  status: string
) {
  const res = await fetch(
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

  const data = await res.json();

  // ALERT ERROR
  if (!data.success) {
    alert(data.message);

    return;
  }

  // ALERT SUCCESS
  alert(
    "Order marked ready successfully"
  );

  load();
}

  // async function updatePayment(id: string, paymentStatus: string, paymentMethod?: string) {
  //   await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentStatus, paymentMethod }) });
  //   load();
  // }

  async function updatePayment(
  id: string,
  paymentStatus: string,
  paymentMethod?: string
) {
  const response = await fetch(
    `/api/orders/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        paymentStatus,
        paymentMethod,
      }),
    }
  );

  const data =
    await response.json();

  if (!data.success) {
    return alert(
      data.message
    );
  }

  // UPDATE UI INSTANTLY
  setViewOrder((prev) =>
    prev
      ? {
          ...prev,
          paymentStatus:
            "Paid",
          paymentMethod,
        }
      : prev
  );

  load();

  alert(
    `Payment received via ${paymentMethod}`
  );
}
  async function del(id: string) {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    load();
    if (viewOrder?._id === id) setViewOrder(null);
  }

  // function selectMenuItem(idx: number, name: string) {
  //   const menuItem = MENU.find(m => m.name === name);
  //   const updated = [...newItems];
  //   updated[idx] = { name, quantity: updated[idx].quantity, price: menuItem?.price || 0 };
  //   setNewItems(updated);
  // }

  function selectMenuItem(
  idx: number,
  name: string
) {
  const menuItem =
    menuItems.find(
      (m) =>
        m.menuName === name
    );

  const updated = [
    ...newItems,
  ];

  updated[idx] = {
    ...updated[idx],

    name,

    price:
      menuItem?.price || 0,
  };

  setNewItems(updated);
}
  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || String(o.tableNumber).includes(search);
    return matchStatus && matchSearch;
  });

  const todayRev = orders.filter(o => o.paymentStatus === "Paid" && new Date(o.createdAt) >= new Date(new Date().setHours(0,0,0,0))).reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-8 animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "#e8e6e3" }}>Orders</h1>
          <p className="text-sm" style={{ color: "#6b6966" }}>Today&apos;s revenue: <span style={{ color: "#4ade80" }}>₹{todayRev.toFixed(0)}</span></p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} />New Order</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {["Pending","Preparing","Ready","Served","Cancelled"].map(s => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
            className="card p-3 text-center transition-all"
            style={{ borderColor: statusFilter === s ? "var(--brand)" : undefined }}>
            <p className="font-display text-xl font-semibold" style={{ color: "#e8e6e3" }}>{orders.filter(o => o.status === s).length}</p>
            <span className={`badge ${statusBadge[s]}`}>{s}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b6966" }} />
          <input className="input-field pl-9" placeholder="Search by order # or table..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option>
          {["Pending","Preparing","Ready","Served","Cancelled"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand)" }} /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--surface-200)" }}>
                {["Order #", "Table", "Items", "Total", "Status", "Payment", "Time", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider" style={{ color: "#6b6966" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16" style={{ color: "#6b6966" }}>
                  <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No orders found</p>
                </td></tr>
              ) : filtered.map(order => (
                <tr key={order._id} className="cursor-pointer transition-colors" style={{ borderBottom: "1px solid var(--surface-200)" }}
                  onClick={() => setViewOrder(order)}>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#e4a224" }}>{order.orderNumber}</td>
                  <td className="px-5 py-3.5" style={{ color: "#b3b1ae" }}>Table {order.tableNumber}</td>
                  <td className="px-5 py-3.5" style={{ color: "#8f8d8a" }}>{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "#e8e6e3" }}>₹{order.total.toFixed(0)}</td>
                  <td className="px-5 py-3.5"><span className={`badge ${statusBadge[order.status]}`}>{order.status}</span></td>
                  <td className="px-5 py-3.5"><span className={`badge ${payBadge[order.paymentStatus]}`}>{order.paymentStatus}</span></td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#6b6966" }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => del(order._id)} className="p-1.5 rounded" style={{ color: "#6b6966" }}
                      onMouseOver={e => (e.currentTarget.style.color = "#f87171")} onMouseOut={e => (e.currentTarget.style.color = "#6b6966")}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal animate-fade-up" style={{ maxWidth: "620px" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold" style={{ color: "#e8e6e3" }}>New Order</h2>
              <button onClick={() => setShowModal(false)}><X size={18} style={{ color: "#6b6966" }} /></button>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Table Number</label>
              <input type="number" className="input-field" value={tableNum} min={1} max={50} onChange={e => setTableNum(Number(e.target.value))} style={{ width: "120px" }} />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2" style={{ color: "#8f8d8a" }}>Items</label>
              <div className="space-y-2">
                {newItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <select className="input-field" value={item.name} onChange={e => selectMenuItem(idx, e.target.value)}>
                        <option value="">Select item...</option>
                        {menuItems.map((m) => (
  <option
    key={m._id}
    value={m.menuName}
  >
    {m.menuName}
  </option>
))}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6b6966" }} />
                    </div>
<input
  type="number"
  min={1}
  className="input-field"
  style={{ width: "110px" }}
  value={item.quantity}
  onChange={(e) => {
    const u = [...newItems];

    u[idx].quantity =
  Number(
    e.target.value
  );

    setNewItems(u);
  }}
  placeholder="Inventory"
/>
                      {/* onChange={e => { const u = [...newItems]; u[idx].quantity = Number(e.target.value); setNewItems(u); }} /> */}
                    <span className="text-sm font-mono" style={{ color: "#e4a224", width: "70px" }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                    {newItems.length > 1 && (
                      <button onClick={() => setNewItems(newItems.filter((_, i) => i !== idx))} style={{ color: "#6b6966" }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-2 text-xs flex items-center gap-1" style={{ color: "var(--brand)" }}
                onClick={() => setNewItems([...newItems, {
  name: "",
  quantity: 1,
  price: 0,
  inventoryUsed: 1,
}])}>
                <Plus size={12} /> Add item
              </button>
            </div>

            {/* Totals preview */}
            {newItems.some(i => i.price > 0) && (
              <div className="rounded-lg p-3 mb-4" style={{ background: "var(--surface-100)" }}>
                {(() => {
                  const sub = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
                  const tax = sub * 0.18;
                  return (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between" style={{ color: "#8f8d8a" }}><span>Subtotal</span><span>₹{sub.toFixed(0)}</span></div>
                      <div className="flex justify-between" style={{ color: "#8f8d8a" }}><span>GST (18%)</span><span>₹{tax.toFixed(0)}</span></div>
                      <div className="flex justify-between font-semibold pt-1" style={{ color: "#e8e6e3", borderTop: "1px solid var(--surface-300)" }}><span>Total</span><span>₹{(sub + tax).toFixed(0)}</span></div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Notes (optional)</label>
              <textarea className="input-field" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special requests..." />
            </div>
            <div className="flex gap-3 justify-end">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary flex items-center gap-2" onClick={placeOrder} disabled={saving}>
                <IndianRupee size={14} />
                {saving ? "Placing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Drawer */}
      {viewOrder && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewOrder(null)}>
          <div className="modal animate-fade-up" style={{ maxWidth: "480px" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-xl font-semibold" style={{ color: "#e8e6e3" }}>{viewOrder.orderNumber}</h2>
                <p className="text-xs mt-0.5" style={{ color: "#6b6966" }}>Table {viewOrder.tableNumber} · {new Date(viewOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewOrder(null)}><X size={18} style={{ color: "#6b6966" }} /></button>
            </div>

            <div className="rounded-lg p-4 mb-4" style={{ background: "var(--surface-100)" }}>
              {viewOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5" style={{ borderBottom: i < viewOrder.items.length - 1 ? "1px solid var(--surface-200)" : undefined }}>
                  <span style={{ color: "#b3b1ae" }}>{item.name} × {item.quantity}</span>
                  <span style={{ color: "#e8e6e3" }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <div className="pt-3 mt-1 space-y-1 text-sm">
                <div className="flex justify-between" style={{ color: "#6b6966" }}><span>Subtotal</span><span>₹{viewOrder.subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between" style={{ color: "#6b6966" }}><span>GST (18%)</span><span>₹{viewOrder.tax.toFixed(0)}</span></div>
                <div className="flex justify-between font-semibold" style={{ color: "#e8e6e3", borderTop: "1px solid var(--surface-200)", paddingTop: "0.5rem" }}><span>Total</span><span>₹{viewOrder.total.toFixed(0)}</span></div>
              </div>
            </div>

            {viewOrder.notes && (
              <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: "rgba(212,132,26,0.08)", border: "1px solid rgba(212,132,26,0.15)", color: "#e4a224" }}>
                📝 {viewOrder.notes}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium mb-2" style={{ color: "#8f8d8a" }}>Update Status</label>
              <div className="flex gap-2 flex-wrap">
                {["Pending","Preparing","Ready","Served","Cancelled"].map(s => (
                  <button key={s} onClick={() => updateStatus(viewOrder._id, s)}
                    className="text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                    style={{
                      background: viewOrder.status === s ? "var(--brand)" : "var(--surface-200)",
                      color: viewOrder.status === s ? "#0f0e0c" : "#8f8d8a"
                    }}>{s}</button>
                ))}
              </div>
            </div>

            {viewOrder.paymentStatus === "Unpaid" && (
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "#8f8d8a" }}>Mark as Paid</label>
                <div className="flex gap-2">
                  {["Cash","Card","UPI","Online"].map(m => (
                    <button key={m} onClick={() => { updatePayment(viewOrder._id, "Paid", m); setViewOrder(o => o ? { ...o, paymentStatus: "Paid", paymentMethod: m } : o); }}
                      className="text-xs px-3 py-1.5 rounded-md transition-all"
                      style={{ background: "var(--surface-200)", color: "#8f8d8a" }}
                      onMouseOver={e => { e.currentTarget.style.background = "var(--brand)"; e.currentTarget.style.color = "#0f0e0c"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "var(--surface-200)"; e.currentTarget.style.color = "#8f8d8a"; }}
                    >{m}</button>
                  ))}
                </div>
              </div>
            )}

         {viewOrder.paymentStatus ===
  "Paid" && (
  <div>
    <div
      className="flex items-center gap-2 text-sm mb-4"
      style={{
        color: "#4ade80",
      }}
    >
      ✓ Paid via{" "}
      {
        viewOrder.paymentMethod
      }
    </div>

    <button
      onClick={() =>
        window.open(
          `/bill/${viewOrder._id}`,
          "_blank"
        )
      }
      className="btn-primary"
      style={{
        width: "100%",
      }}
    >
      Generate Bill
    </button>
  </div>
)}
          </div>
        </div>
      )}
    </div>
  );
}
