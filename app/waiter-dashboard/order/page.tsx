// "use client";

// import { useEffect, useState } from "react";

// import {
//   Clock3,
//   RefreshCw,
//   ShoppingBag,
// } from "lucide-react";

// interface Order {
//   _id: string;
//   orderNumber: string;
//   tableNumber: number;

//   items: {
//     name: string;
//     quantity: number;
//     price: number;
//   }[];

//   status:
//     | "Pending"
//     | "Preparing"
//     | "Ready"
//     | "Served"
//     | "Cancelled";

//   paymentStatus:
//     | "Unpaid"
//     | "Paid"
//     | "Refunded";

//   total: number;

//   notes?: string;

//   createdAt: string;
// }

// export default function WaiterOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>(
//     []
//   );

//   const [branch, setBranch] = useState<string | null>(null);

//   const [loading, setLoading] =
//     useState(true);

//   async function loadOrders(branchName = branch) {
//     try {
//       if (!branchName) {
//         setOrders([]);
//         return;
//       }

//       setLoading(true);

//       const response = await fetch(
//         `/api/orders?branch=${encodeURIComponent(branchName)}`
//       );

//       const data = await response.json();

//       setOrders(data.data || []);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   }
//   async function updateStatus(
//   id: string,
//   status: string
// ) {
//   try {
//     await fetch(
//       `/api/orders/${id}`,
//       {
//         method: "PUT",

//         headers: {
//           "Content-Type":
//             "application/json",
//         },

//         body: JSON.stringify({
//           status,
//         }),
//       }
//     );

//     loadOrders();
//   } catch (error) {
//     console.log(error);
//   }
// }

//   useEffect(() => {
//     const user = localStorage.getItem("user");

//     if (!user) {
//       window.location.href = "/";
//       return;
//     }

//     const parsedUser = JSON.parse(user);

//     if (parsedUser.role !== "waiter") {
//       window.location.href = "/";
//       return;
//     }

//     setBranch(parsedUser.branch || null);

//     if (!parsedUser.branch) {
//       setLoading(false);
//       return;
//     }

//     loadOrders(parsedUser.branch || null);
//   }, []);

//     return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#000",
//         padding: "30px",
//         fontFamily: '"Times New Roman", Times, serif',
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent:
//             "space-between",
//           alignItems: "center",
//           marginBottom: "30px",
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               fontSize: "34px",
//               fontWeight: "700",
//               color: "#2a2520",
//               marginBottom: "6px",
//             }}
//           >
//             Today's Orders
//           </h1>

//           <p
//             style={{
//               color: "#888",
//               fontSize: "14px",
//             }}
//           >
//             All active orders for today
//           </p>
//         </div>

//         <button
//           onClick={() => loadOrders()}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             background: "#000",
//             border: "1px solid #ddd",
//             borderRadius: "12px",
//             padding: "12px 16px",
//             cursor: "pointer",
//             fontWeight: "600",
//           }}
//         >
//           <RefreshCw size={16} />
//           Refresh
//         </button>
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "80px",
//             color: "#888",
//           }}
//         >
//           Loading orders...
//         </div>
//       ) : orders.length === 0 ? (
//         <div
//           style={{
//             background: "transparent",
//             borderRadius: "18px",
//             padding: "60px",
//             textAlign: "center",
//             border: "1px solid #eee",
//           }}
//         >
//           <ShoppingBag
//             size={40}
//             color="#ccc"
//             style={{
//               marginBottom: "10px",
//             }}
//           />

//           <h2
//             style={{
//               color: "#666",
//               marginBottom: "6px",
//             }}
//           >
//             No Orders Found
//           </h2>

//           <p
//             style={{
//               color: "#999",
//               fontSize: "14px",
//             }}
//           >
//             No active orders today
//           </p>
//         </div>
//       ) : (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "18px",
//           }}
//         >
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               style={{
//                 background: "#fff",
//                 borderRadius: "18px",
//                 border: "1px solid #eee",
//                 padding: "22px",
//               }}
//             >
//               {/* Top */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     "space-between",
//                   alignItems: "center",
//                   marginBottom: "18px",
//                   flexWrap: "wrap",
//                   gap: "12px",
//                 }}
//               >
//                 <div>
//                   <h2
//                     style={{
//                       fontSize: "22px",
//                       color: "#2a2520",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     {order.orderNumber}
//                   </h2>

//                   <p
//                     style={{
//                       color: "#777",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Table {
//                       order.tableNumber
//                     }
//                   </p>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px",
//                   }}
//                 >
//               <select
//   value={order.status}
//   aria-label="Order status"
//   onChange={async (e) => {
//     try {
//       await fetch(
//         `/api/orders/${order._id}`,
//         {
//           method: "PUT",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             status:
//               e.target.value,
//           }),
//         }
//       );

//       loadOrders();
//     } catch (error) {
//       console.log(error);
//     }
//   }}
//   style={{
//     padding: "8px 14px",
//     borderRadius: "999px",
//     border: "none",
//     outline: "none",
//     background:
//       order.status ===
//       "Served"
//         ? "#22c55e"
//         : order.status ===
//           "Preparing"
//         ? "#f59e0b"
//         : order.status ===
//           "Ready"
//         ? "#3b82f6"
//         : "#6b7280",
//     color: "#fff",
//     fontWeight: "600",
//     cursor: "pointer",
//   }}
// >
//   <option value="Pending">
//     Pending
//   </option>

//   <option value="Preparing">
//     Preparing
//   </option>

//   <option value="Ready">
//     Ready
//   </option>

//  {(order.status ===
//   "Ready" ||
//   order.status ===
//     "Served") &&
//   order.paymentStatus ===
//     "Paid" && (
//     <option value="Served">
//       Served
//     </option>
// )}
// </select>

//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "5px",
//                       color: "#888",
//                       fontSize: "13px",
//                     }}
//                   >
//                     <Clock3 size={14} />

//                     {new Date(
//                       order.createdAt
//                     ).toLocaleTimeString(
//                       [],
//                       {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       }
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Items */}
//               <div
//                 style={{
//                   marginBottom: "18px",
//                 }}
//               >
//                 {order.items.map(
//                   (item, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         display: "flex",
//                         justifyContent:
//                           "space-between",
//                         padding: "8px 0",
//                         borderBottom:
//                           "1px solid #f3f3f3",
//                       }}
//                     >
//                       <div>
//                         <span
//                           style={{
//                             fontWeight:
//                               "600",
//                           }}
//                         >
//                           {
//                             item.quantity
//                           }
//                           x
//                         </span>{" "}
//                         {item.name}
//                       </div>

//                       <div
//                         style={{
//                           color: "#666",
//                         }}
//                       >
//                         ₹
//                         {(
//                           item.price *
//                           item.quantity
//                         ).toFixed(0)}
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>

//               {/* Notes */}
//               {order.notes && (
//                 <div
//                   style={{
//                     background: "#fff7ed",
//                     border:
//                       "1px solid #fed7aa",
//                     padding: "10px 14px",
//                     borderRadius: "10px",
//                     fontSize: "13px",
//                     color: "#9a3412",
//                     marginBottom: "18px",
//                   }}
//                 >
//                   📝 {order.notes}
//                 </div>
//               )}

//               {/* Bottom */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <div>
//                   <p
//                     style={{
//                       color: "#888",
//                       fontSize: "13px",
//                     }}
//                   >
//                     Payment
//                   </p>

//                   <h3
//                     style={{
//                       color:
//                         order.paymentStatus ===
//                         "Paid"
//                           ? "#16a34a"
//                           : "#dc2626",
//                     }}
//                   >
//                     {order.paymentStatus}
//                   </h3>
//                 </div>

//                 <div
//                   style={{
//                     textAlign: "right",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "#888",
//                       fontSize: "13px",
//                     }}
//                   >
//                     Total
//                   </p>

//                   <h2
//                     style={{
//                       fontSize: "26px",
//                       color: "#2a2520",
//                     }}
//                   >
//                     ₹
//                     {order.total.toFixed(
//                       0
//                     )}
//                   </h2>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Armchair } from "lucide-react";

interface TableType {
  _id: string;
  tableNumber: number;
  chairs: { number: number; occupied: boolean }[];
  status: string;
}

export default function TablesPage() {
  const [branch, setBranch] = useState<string | null>(null);
  const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
  const [tables, setTables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [chairs, setChairs] = useState("");
  const [extraChairs, setExtraChairs] = useState(0);

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
      } catch { setBranch(null); }
    }
  }, []);

  async function loadTables() {
    const url = branch ? `/api/tables?branchName=${encodeURIComponent(branch)}` : "/api/tables";
    const response = await fetch(url);
    const data = await response.json();
    setTables(data.data || []);
  }

  async function updateChairs() {
    if (!selectedTable) return;
    const newChairs = [
      ...selectedTable.chairs,
      ...Array.from({ length: extraChairs }, (_, i) => ({
        number: selectedTable.chairs.length + i + 1,
        occupied: false,
      })),
    ];
    await fetch(`/api/tables/${selectedTable._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chairs: newChairs }),
    });
    setSelectedTable(null);
    setExtraChairs(0);
    loadTables();
  }

  useEffect(() => {
    if (branch !== null) loadTables();
  }, [branch]);

  async function addTable() {
    if (!tableNumber || !chairs) return alert("Fill all fields");
    await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableNumber: Number(tableNumber),
        chairs: Array.from({ length: Number(chairs) }, (_, i) => ({ number: i + 1, occupied: false })),
        branch,
      }),
    });
    setShowAddModal(false);
    setTableNumber("");
    setChairs("");
    loadTables();
  }

  return (
    <>
      <style>{`
        .tbl-root {
          min-height: 100vh;
          background: transparent;
          color: #fff;
          padding: 30px;
          font-family: "Times New Roman", Times, serif;
        }

        /* HEADER */
        .tbl-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tbl-title {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .tbl-subtitle {
          color: #fff;
          margin-top: 5px;
          font-size: 14px;
        }

        .tbl-add-btn {
          background: #d4841a;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, transform 0.1s;
        }

        .tbl-add-btn:hover { background: #e8951f; transform: translateY(-1px); }
        .tbl-add-btn:active { transform: translateY(0); }

        /* GRID */
        .tbl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        /* TABLE CARD */
        .tbl-card {
          background: transparent;
          border: 2px solid gray;
          border-radius: 20px;
          padding: 24px 20px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.15s;
          position: relative;
        }

        .tbl-card:hover {
          border-color: #d4841a44;
          transform: translateY(-2px);
        }

        /* CIRCLE DIAGRAM */
        .tbl-diagram {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: transparent;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .tbl-center {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #d4841a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          z-index: 1;
        }

        /* CHAIR DOT */
        .chair-dot {
          width: 18px;
          height: 18px;
          border-radius: 6px;
          position: absolute;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.1s;
        }

        .chair-dot:hover { transform: scale(1.2); }

        /* INFO */
        .tbl-info { text-align: center; }

        .tbl-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .tbl-chairs-count {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 13px;
        }

        /* MODAL OVERLAY */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-box {
          width: 440px;
          background: #080808;
          border: 1px solid #1c1c1c;
          border-radius: 22px;
          padding: 32px;
          color: #fff;
          animation: modalIn 0.18s ease;
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .modal-sub {
          color: #555;
          font-size: 13px;
          margin-bottom: 24px;
        }

        .modal-row {
          background: transparent;
          border: 1px solid #1c1c1c;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #fff;
        }

        .modal-row-left {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 14px;
        }

        .modal-row-val {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .modal-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 13px;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .modal-input {
          width: 100%;
          padding: 13px 14px;
          border-radius: 10px;
          border: 1px solid #1c1c1c;
          background: transparent;
          color: #fff;
          font-size: 14px;
          outline: none;
          margin-bottom: 16px;
          transition: border-color 0.15s;
          font-family: inherit;
        }

        .modal-input::placeholder { color: #444; }
        .modal-input:focus { border-color: #d4841a55; }

        .modal-total-row {
          background: transparent;
          border: 1px solid #d4841a33;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
          font-size: 14px;
        }

        .modal-total-val {
          font-size: 22px;
          font-weight: 700;
          color: #d4841a;
        }

        .modal-btns {
          display: flex;
          gap: 12px;
        }

        .modal-cancel {
          flex: 1;
          padding: 13px;
          border-radius: 10px;
          border: 1px solid #1c1c1c;
          background: transparent;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.15s;
        }

        .modal-cancel:hover { border-color: #333; }

        .modal-confirm {
          flex: 1;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: #d4841a;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s;
        }

        .modal-confirm:hover { background: #e8951f; }
      `}</style>

      <div className="tbl-root">
        {/* HEADER */}
        <div className="tbl-header">
          <div>
            <h1 className="tbl-title">Restaurant Tables</h1>
            <p className="tbl-subtitle">Select a table to manage chairs</p>
          </div>
        </div>

          {/* TABLE GRID */}
        <div className="tbl-grid">
          {tables.map((table) => {
            const chairArr = Array.isArray(table.chairs)
              ? table.chairs
              : Array.from({ length: table.chairs as any }, (_, i) => ({ number: i + 1, occupied: false }));

            return (
              <div key={table._id} className="tbl-card" onClick={() => setSelectedTable(table)}>
                <div className="tbl-diagram">
                  {chairArr.map((chair: any, i: number) => {
                    const angle = (i / chairArr.length) * Math.PI * 2;
                    const x = Math.cos(angle) * 54;
                    const y = Math.sin(angle) * 54;
                    return (
                      <div
                        key={chair.number}
                        className="chair-dot"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const updated = chairArr.map((c: any) =>
                            c.number === chair.number ? { ...c, occupied: !c.occupied } : c
                          );
                          setTables((prev) =>
                            prev.map((t) => t._id === table._id ? { ...t, chairs: updated } : t)
                          );
                          await fetch(`/api/tables/${table._id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ chairs: updated }),
                          });
                        }}
                        style={{
                          background: chair.occupied ? "#22c55e" : "#d4841a",
                          border: chair.occupied ? "2px solid #fff" : "none",
                          boxShadow: chair.occupied ? "0 0 10px #22c55e88" : "none",
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                      />
                    );
                  })}
                  <div className="tbl-center">T{table.tableNumber}</div>
                </div>
                <div className="tbl-info">
                  <div className="tbl-name">Table {table.tableNumber}</div>
                  <div className="tbl-chairs-count">
                    <Users size={14} />
                    {chairArr.length} Chairs
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MANAGE CHAIRS MODAL */}
        {selectedTable && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedTable(null); }}>
            <div className="modal-box">
              <div className="modal-title">Table {selectedTable.tableNumber}</div>
              <div className="modal-sub">Manage table chairs</div>

              <div className="modal-row">
                <div className="modal-row-left">
                  <Armchair size={18} color="#d4841a" />
                  Current Chairs
                </div>
                <div className="modal-row-val">{selectedTable.chairs.length}</div>
              </div>

              <label className="modal-label">Add Extra Chairs</label>
              <input
                type="number"
                value={extraChairs}
                onChange={(e) => setExtraChairs(Number(e.target.value))}
                placeholder="Enter number of chairs"
                className="modal-input"
              />

              <div className="modal-total-row">
                <span>Total Chairs</span>
                <span className="modal-total-val">{selectedTable.chairs.length + extraChairs}</span>
              </div>

              <div className="modal-btns">
                <button className="modal-cancel" onClick={() => setSelectedTable(null)}>Cancel</button>
                <button className="modal-confirm" onClick={updateChairs}>
                  <Plus size={16} />
                  Update Chairs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD TABLE MODAL */}
        {showAddModal && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
            <div className="modal-box">
              <div className="modal-title">Add New Table</div>
              <div className="modal-sub">Enter table details below</div>

              <label className="modal-label">Table Number</label>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 5"
                className="modal-input"
              />

              <label className="modal-label">Number of Chairs</label>
              <input
                type="number"
                value={chairs}
                onChange={(e) => setChairs(e.target.value)}
                placeholder="e.g. 4"
                className="modal-input"
              />

              <div className="modal-btns" style={{ marginTop: "8px" }}>
                <button className="modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="modal-confirm" onClick={addTable}>
                  <Plus size={16} />
                  Add Table
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}