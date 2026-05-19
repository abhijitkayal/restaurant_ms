
// "use client";

// import { useEffect, useState } from "react";

// import {
//   Users,
//   Plus,
//   Armchair,
// } from "lucide-react";

// interface TableType {
//   _id: string;

//   tableNumber: number;

//   chairs: {
//   number: number;

//   occupied: boolean;
// }[];

//   status: string;
// }

// export default function TablesPage() {
//   const [branch, setBranch] = useState<string | null>(null);
//   const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
//   const [tables, setTables] = useState<
//     TableType[]
//   >([]);

//   const [selectedTable, setSelectedTable] =
//     useState<TableType | null>(null);
// const [showAddModal, setShowAddModal] =
//   useState(false);

// const [tableNumber, setTableNumber] =
//   useState("");

// const [chairs, setChairs] = useState("");
//   const [extraChairs, setExtraChairs] =
//     useState(0);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const branchName = params.get("branchName");
//     setQueryBranchName(branchName);

//     if (branchName) {
//       setBranch(branchName);
//     } else {
//       try {
//         const u = localStorage.getItem("user");
//         setBranch(u ? JSON.parse(u).branch : null);
//       } catch {
//         setBranch(null);
//       }
//     }
//   }, []);

//   async function loadTables() {
//     const url = branch ? `/api/tables?branchName=${encodeURIComponent(branch)}` : "/api/tables";
//     const response = await fetch(url);

//     const data = await response.json();

//     setTables(data.data || []);
//   }

//   async function updateChairs() {
//   if (!selectedTable) return;

//   const newChairs = [
//     ...selectedTable.chairs,

//     ...Array.from(
//       { length: extraChairs },
//       (_, i) => ({
//         number:
//           selectedTable.chairs.length +
//           i +
//           1,

//         occupied: false,
//       })
//     ),
//   ];

//   await fetch(
//     `/api/tables/${selectedTable._id}`,
//     {
//       method: "PUT",

//       headers: {
//         "Content-Type":
//           "application/json",
//       },

//       body: JSON.stringify({
//         chairs: newChairs,
//       }),
//     }
//   );

//   setSelectedTable(null);

//   setExtraChairs(0);

//   loadTables();
// }

//   useEffect(() => {
//     if (branch !== null) {
//       loadTables();
//     }
//   }, [branch]);
//   async function addTable() {
//   if (!tableNumber || !chairs) {
//     return alert("Fill all fields");
//   }

//   await fetch("/api/tables", {
//     method: "POST",

//     headers: {
//       "Content-Type": "application/json",
//     },

//     body: JSON.stringify({
//       tableNumber: Number(tableNumber),

//       chairs: Array.from(
//   { length: Number(chairs) },
//   (_, i) => ({
//     number: i + 1,
//     occupied: false,
//   })
// ),

//       branch,
//     }),
//   });

//   setShowAddModal(false);

//   setTableNumber("");

//   setChairs("");

//   loadTables();
// }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#000",
//         color: "#fff",
//         padding: "30px",
//       }}
//     >
//       {/* HEADER */}
//  {/* HEADER */}
// <div
//   style={{
//     marginBottom: "30px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }}
// >
//   <div>
//     <h1
//       style={{
//         fontSize: "34px",
//         fontWeight: "700",
//         color: "#2a2520",
//       }}
//     >
//       Restaurant Tables
//     </h1>

//     <p
//       style={{
//         color: "#777",
//         marginTop: "6px",
//       }}
//     >
//       Select table and manage chairs
//     </p>
//   </div>

//   {/* ADD TABLE BUTTON */}
//   <button
//     onClick={() => setShowAddModal(true)}
//     style={{
//       background: "#d4841a",
//       color: "#fff",
//       border: "none",
//       borderRadius: "14px",
//       padding: "14px 22px",
//       cursor: "pointer",
//       fontWeight: "600",
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//       fontSize: "15px",
//     }}
//   >
//     <Plus size={18} />
//     Add Table
//   </button>
// </div>

//       {/* TABLE GRID */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns:
//             "repeat(auto-fit,minmax(220px,1fr))",
//           gap: "24px",
//         }}
//       >
//         {tables.map((table) => (
//           <div
//             key={table._id}
//             onClick={() =>
//               setSelectedTable(table)
//             }
//             style={{
//               background: "#fff",
//               borderRadius: "22px",
//               padding: "24px",
//               border: "1px solid #eee",
//               cursor: "pointer",
//               transition: ".3s",
//               position: "relative",
//             }}
//           >
//             {/* TABLE IMAGE */}
//             <div
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 borderRadius: "50%",
//                 background: "#fff7ed",
//                 margin: "0 auto 20px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 position: "relative",
//               }}
//             >
//               {/* CHAIRS AROUND TABLE */}
//              {/* CHAIRS AROUND TABLE */}
// {/* CHAIRS AROUND TABLE */}
// {(
//   Array.isArray(table.chairs)
//     ? table.chairs
//     : Array.from(
//         {
//           length: table.chairs,
//         },
//         (_, i) => ({
//           number: i + 1,
//           occupied: false,
//         })
//       )
// ).map((chair: any, i: number) => {
//   const totalChairs = Array.isArray(
//     table.chairs
//   )
//     ? table.chairs.length
//     : table.chairs;

//   const angle =
//     (i / totalChairs) *
//     Math.PI *
//     2;

//   const x =
//     Math.cos(angle) * 55;

//   const y =
//     Math.sin(angle) * 55;

//   return (
//     <div
//       key={chair.number}
//       onClick={async (e) => {
//         e.stopPropagation();

//         const currentChairs =
//           Array.isArray(table.chairs)
//             ? table.chairs
//             : Array.from(
//                 {
//                   length:
//                     table.chairs,
//                 },
//                 (_, i) => ({
//                   number: i + 1,
//                   occupied: false,
//                 })
//               );

//         const updatedChairs =
//           currentChairs.map((c) =>
//             c.number === chair.number
//               ? {
//                   ...c,
//                   occupied:
//                     !c.occupied,
//                 }
//               : c
//           );

//         // frontend update
//         setTables((prev) =>
//           prev.map((t) =>
//             t._id === table._id
//               ? {
//                   ...t,
//                   chairs:
//                     updatedChairs,
//                 }
//               : t
//           )
//         );

//         // database update
//         await fetch(
//           `/api/tables/${table._id}`,
//           {
//             method: "PUT",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               chairs:
//                 updatedChairs,
//             }),
//           }
//         );
//       }}
//       style={{
//         width: "18px",
//         height: "18px",
//         borderRadius: "6px",

//         background:
//           chair.occupied
//             ? "#22c55e"
//             : "#d4841a",

//         position: "absolute",

//         transform: `translate(${x}px, ${y}px)`,

//         cursor: "pointer",

//         transition: ".2s",

//         border:
//           chair.occupied
//             ? "2px solid #fff"
//             : "none",

//         boxShadow:
//           chair.occupied
//             ? "0 0 12px #22c55e"
//             : "none",
//       }}
//     />
//   );
// })}

//               {/* CENTER TABLE */}
//               <div
//                 style={{
//                   width: "70px",
//                   height: "70px",
//                   borderRadius: "50%",
//                   background: "#d4841a",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "#fff",
//                   fontWeight: "700",
//                   fontSize: "20px",
//                 }}
//               >
//                 T{table.tableNumber}
//               </div>
//             </div>

//             {/* INFO */}
//             <div
//               style={{
//                 textAlign: "center",
//               }}
//             >
//               <h2
//                 style={{
//                   fontSize: "22px",
//                   marginBottom: "8px",
//                   color: "#2a2520",
//                 }}
//               >
//                 Table {table.tableNumber}
//               </h2>

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "8px",
//                   color: "#666",
//                 }}
//               >
//                 <Users size={18} />

//                 {table.chairs.length} Chairs
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       {selectedTable && (
//         <div
//           onClick={(e) => {
//             if (
//               e.target === e.currentTarget
//             ) {
//               setSelectedTable(null);
//             }
//           }}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background:
//               "rgba(0,0,0,.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               width: "450px",
//               background: "#000",
//               borderRadius: "24px",
//               padding: "30px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "30px",
//                 marginBottom: "10px",
//                 color: "#2a2520",
//               }}
//             >
//               Table {
//                 selectedTable.tableNumber
//               }
//             </h2>

//             <p
//               style={{
//                 color: "#777",
//                 marginBottom: "30px",
//               }}
//             >
//               Manage table chairs
//             </p>

//             {/* CURRENT CHAIRS */}
//             <div
//               style={{
//                 background: "#000",
//                 padding: "18px",
//                 borderRadius: "16px",
//                 marginBottom: "20px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent:
//                   "space-between",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                 }}
//               >
//                 <Armchair
//                   size={20}
//                   color="#d4841a"
//                 />

//                 <span>
//                   Current Chairs
//                 </span>
//               </div>

//               <h3>
                
//   {selectedTable.chairs.length}

//               </h3>
//             </div>

//             {/* ADD CHAIRS */}
//             <div
//               style={{
//                 marginBottom: "25px",
//               }}
//             >
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "10px",
//                   fontWeight: "600",
//                 }}
//               >
//                 Add Extra Chairs
//               </label>

//               <input
//                 type="number"
//                 value={extraChairs}
//                 onChange={(e) =>
//                   setExtraChairs(
//                     Number(e.target.value)
//                   )
//                 }
//                 placeholder="Enter chairs"
//                 style={{
//                   width: "100%",
//                   padding: "14px",
//                   borderRadius: "12px",
//                   border:
//                     "1px solid #ddd",
//                   fontSize: "15px",
//                   color:"#000"
//                 }}
//               />
//             </div>

//             {/* TOTAL */}
//             <div
//               style={{
//                 background: "#000",
//                 border:
//                   "1px solid #fed7aa",
//                 padding: "18px",
//                 borderRadius: "16px",
//                 marginBottom: "30px",
                
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     "space-between",
//                   color:"#000",
//                 }}
//               >
//                 <span>Total Chairs</span>

//                 <h2
//                   style={{
//                     color: "#d4841a",
//                   }}
//                 >
//                   {selectedTable.chairs.length +
//                     extraChairs}
//                 </h2>
//               </div>
//             </div>

//             {/* BUTTONS */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: "14px",
//               }}
//             >
//               <button
//                 onClick={() =>
//                   setSelectedTable(null)
//                 }
//                 style={{
//                   flex: 1,
//                   padding: "14px",
//                   borderRadius: "12px",
//                   border:
//                     "1px solid #ddd",
//                   background: "#fff",
//                   cursor: "pointer",
//                   fontWeight: "600",
//                 }}
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={updateChairs}
//                 style={{
//                   flex: 1,
//                   padding: "14px",
//                   borderRadius: "12px",
//                   border: "none",
//                   background: "#d4841a",
//                   color: "#fff",
//                   cursor: "pointer",
//                   fontWeight: "600",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: "8px",
//                 }}
//               >
//                 <Plus size={18} />
//                 Update Chairs
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ADD TABLE MODAL */}
// {showAddModal && (
//   <div
//     onClick={(e) => {
//       if (e.target === e.currentTarget) {
//         setShowAddModal(false);
//       }
//     }}
//     style={{
//       position: "fixed",
//       inset: 0,
//       background: "rgba(0,0,0,.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     }}
//   >
//     <div
//       style={{
//         width: "450px",
//         background: "#000",
//         borderRadius: "24px",
//         padding: "30px",
//       }}
//     >
//       <h2
//         style={{
//           fontSize: "28px",
//           marginBottom: "20px",
//           color: "#2a2520",
//         }}
//       >
//         Add New Table
//       </h2>

//       {/* TABLE NUMBER */}
//       <div
//         style={{
//           marginBottom: "18px",
//         }}
//       >
//         <label
//           style={{
//             display: "block",
//             marginBottom: "10px",
//             fontWeight: "600",
//           }}
//         >
//           Table Number
//         </label>

//         <input
//           type="number"
//           value={tableNumber}
//           onChange={(e) =>
//             setTableNumber(e.target.value)
//           }
//           placeholder="Enter table number"
//           style={{
//             width: "100%",
//             padding: "14px",
//             borderRadius: "12px",
//             border: "1px solid #ddd",
//             color:"#000"
//           }}
//         />
//       </div>

//       {/* CHAIRS */}
//       <div
//         style={{
//           marginBottom: "25px",
//         }}
//       >
//         <label
//           style={{
//             display: "block",
//             marginBottom: "10px",
//             fontWeight: "600",
//             color:"#000"
//           }}
//         >
//           Number of Chairs
//         </label>

//         <input
//           type="number"
//           value={chairs}
//           onChange={(e) =>
//             setChairs(e.target.value)
//           }
//           placeholder="Enter chairs"
//           style={{
//             width: "100%",
//             padding: "14px",
//             borderRadius: "12px",
//             border: "1px solid #ddd",
//             color:"#000"
//           }}
//         />
//       </div>

//       {/* BUTTONS */}
//       <div
//         style={{
//           display: "flex",
//           gap: "14px",
//         }}
//       >
//         <button
//           onClick={() =>
//             setShowAddModal(false)
//           }
//           style={{
//             flex: 1,
//             padding: "14px",
//             borderRadius: "12px",
//             border: "1px solid #ddd",
//             background: "#fff",
//             cursor: "pointer",
//             fontWeight: "600",
//           }}
//         >
//           Cancel
//         </button>

//         <button
//           onClick={addTable}
//           style={{
//             flex: 1,
//             padding: "14px",
//             borderRadius: "12px",
//             border: "none",
//             background: "#d4841a",
//             color: "#000",
//             cursor: "pointer",
//             fontWeight: "600",
//           }}
//         >
//           Add Table
//         </button>
//       </div>
//     </div>
//   </div>
// )}
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
          background: #transparent;
          color: #fff;
          padding: 30px;
          font-family: 'Outfit', 'DM Sans', sans-serif;
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
          <button className="tbl-add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add Table
          </button>
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