// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// // import { useSearchParams } from "next/navigation";

// import {
//   Plus,
//   Trash2,
// } from "lucide-react";

// interface Requirement {
//   product: string;

//   quantity: number;

//   unit: string;
// }

// export default function MenuPage() {
//   const [branch, setBranch] = useState<string | null>(null);
//   const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
//   const [menuName, setMenuName] =
//     useState("");

//   const [price, setPrice] =
//     useState("");

//   const [
//     requirements,
//     setRequirements,
//   ] = useState<
//     Requirement[]
//   >([
//     {
//       product: "",
//       quantity: 1,
//       unit: "",
//     },
//   ]);

//   const [menus, setMenus] =
//     useState<any[]>([]);

//   const [showForm, setShowForm] =
//     useState(false);

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

//   async function loadMenus() {
//     const url = branch
//       ? `/api/menu?branchName=${encodeURIComponent(
//           branch
//         )}`
//       : "/api/menu";

//     const response =
//       await fetch(url);

//     const data =
//       await response.json();

//     setMenus(data.data || []);
//   }

//   useEffect(() => {
//     if (branch !== null) {
//       loadMenus();
//     }
//   }, [branch]);

//   function addRequirement() {
//     setRequirements([
//       ...requirements,

//       {
//         product: "",
//         quantity: 1,
//         unit: "",
//       },
//     ]);
//   }

//   function removeRequirement(
//     index: number
//   ) {
//     setRequirements(
//       requirements.filter(
//         (_, i) => i !== index
//       )
//     );
//   }

//   function updateRequirement(
//     index: number,
//     field: string,
//     value: any
//   ) {
//     const updated = [
//       ...requirements,
//     ];

//     updated[index] = {
//       ...updated[index],
//       [field]: value,
//     };

//     setRequirements(updated);
//   }

//   async function saveMenu() {
//     if (
//       !menuName ||
//       !price
//     ) {
//       return alert(
//         "Fill all fields"
//       );
//     }

//     const response = await fetch(
//       "/api/menu",
//       {
//         method: "POST",

//         headers: {
//           "Content-Type":
//             "application/json",
//         },

//         body: JSON.stringify({
//           menuName,

//           price:
//             Number(price),

//           requirements,

//           branchName: branch,
//         }),
//       }
//     );

//     const data =
//       await response.json();

//     if (!data.success) {
//       return alert(
//         data.message
//       );
//     }

//     alert(
//       "Menu added successfully"
//     );

//     setMenuName("");

//     setPrice("");

//     setRequirements([
//       {
//         product: "",
//         quantity: 1,
//         unit: "",
//       },
//     ]);

//     setShowForm(false);

//     loadMenus();
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#000",
//         color: "#fff",
//         padding: "30px",
//         display: "flex",
//         gap: "24px",
//       }}
//     >
//       {/* LEFT TABLE */}
//       <div
//         style={{
//           flex: 1,
//           background: "#111",
//           borderRadius: "24px",
//           overflow: "hidden",
//           border:
//             "1px solid #222",
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent:
//               "space-between",
//             alignItems: "center",
//             padding: "24px",
//             borderBottom:
//               "1px solid #222",
//           }}
//         >
//           <h1
//             style={{
//               fontSize: "34px",
//               color: "#d4841a",
//             }}
//           >
//             Menu Management
//           </h1>

//           <button
//             onClick={() =>
//               setShowForm(
//                 !showForm
//               )
//             }
//             style={{
//               background:
//                 "#d4841a",
//               border: "none",
//               color: "#fff",
//               padding:
//                 "14px 20px",
//               borderRadius:
//                 "14px",
//               cursor:
//                 "pointer",
//               display: "flex",
//               alignItems:
//                 "center",
//               gap: "10px",
//               fontWeight:
//                 "600",
//             }}
//           >
//             <Plus size={18} />
//             Add Menu
//           </button>
//         </div>

//         {/* TABLE */}
//         <table
//           style={{
//             width: "100%",
//             borderCollapse:
//               "collapse",
//           }}
//         >
//           <thead>
//             <tr
//               style={{
//                 background:
//                   "#181818",
//               }}
//             >
//               <th
//                 style={tableHead}
//               >
//                 Branch
//               </th>

//               <th
//                 style={tableHead}
//               >
//                 Menu
//               </th>

//               <th
//                 style={tableHead}
//               >
//                 Price
//               </th>

//               <th
//                 style={tableHead}
//               >
//                 Requirements
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {menus.map((menu) => (
//               <tr
//                 key={menu._id}
//                 style={{
//                   borderTop:
//                     "1px solid #222",
//                 }}
//               >
//                 <td
//                   style={
//                     tableData
//                   }
//                 >
//                   {
//                     menu.branchName || "-"
//                   }
//                 </td>

//                 <td
//                   style={
//                     tableData
//                   }
//                 >
//                   {
//                     menu.menuName
//                   }
//                 </td>

//                 <td
//                   style={
//                     tableData
//                   }
//                 >
//                   ₹{menu.price}
//                 </td>

//                 <td
//                   style={
//                     tableData
//                   }
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection:
//                         "column",
//                       gap: "6px",
//                     }}
//                   >
//                     {menu.requirements.map(
//                       (
//                         req: any,
//                         index: number
//                       ) => (
//                         <span
//                           key={
//                             index
//                           }
//                           style={{
//                             color:
//                               "#999",
//                             fontSize:
//                               "14px",
//                           }}
//                         >
//                           •{" "}
//                           {
//                             req.product
//                           }{" "}
//                           -{" "}
//                           {
//                             req.quantity
//                           }{" "}
//                           {
//                             req.unit
//                           }
//                         </span>
//                       )
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* RIGHT FORM */}
//       {showForm && (
//         <div
//           style={{
//             width: "420px",
//             background: "#111",
//             borderRadius: "24px",
//             padding: "24px",
//             border:
//               "1px solid #222",
//             height:
//               "fit-content",
//           }}
//         >
//           <h2
//             style={{
//               marginBottom:
//                 "20px",
//             }}
//           >
//             Add Menu
//           </h2>

//           <div
//             style={{
//               display: "grid",
//               gap: "16px",
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Menu Name"
//               value={menuName}
//               onChange={(e) =>
//                 setMenuName(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <input
//               type="number"
//               placeholder="Price"
//               value={price}
//               onChange={(e) =>
//                 setPrice(
//                   e.target.value
//                 )
//               }
//               style={inputStyle}
//             />

//             <h3>
//               Requirements
//             </h3>

//             {requirements.map(
//               (
//                 req,
//                 index
//               ) => (
//                 <div
//                   key={index}
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns:
//                       "2fr 1fr 1fr auto",
//                     gap: "10px",
//                   }}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Product"
//                     value={
//                       req.product
//                     }
//                     onChange={(e) =>
//                       updateRequirement(
//                         index,
//                         "product",
//                         e.target
//                           .value
//                       )
//                     }
//                     style={
//                       inputStyle
//                     }
//                   />

//                   <input
//                     type="number"
//                     placeholder="Qty"
//                     value={
//                       req.quantity
//                     }
//                     onChange={(e) =>
//                       updateRequirement(
//                         index,
//                         "quantity",
//                         Number(
//                           e.target
//                             .value
//                         )
//                       )
//                     }
//                     style={
//                       inputStyle
//                     }
//                   />

//                   <select
//                     value={req.unit}
//                     onChange={(e) =>
//                       updateRequirement(
//                         index,
//                         "unit",
//                         e.target
//                           .value
//                       )
//                     }
//                     style={
//                       inputStyle
//                     }
//                   >
//                     <option value="">
//                       Unit
//                     </option>

//                     <option value="kg">
//                       KG
//                     </option>

//                     <option value="gram">
//                       Gram
//                     </option>

//                     <option value="liter">
//                       Liter
//                     </option>

//                     <option value="ml">
//                       ML
//                     </option>

//                     <option value="pcs">
//                       PCS
//                     </option>
//                   </select>

//                   <button
//                     onClick={() =>
//                       removeRequirement(
//                         index
//                       )
//                     }
//                     style={{
//                       width:
//                         "50px",
//                       border:
//                         "none",
//                       borderRadius:
//                         "12px",
//                       background:
//                         "#ef4444",
//                       color:
//                         "#fff",
//                       cursor:
//                         "pointer",
//                     }}
//                   >
//                     <Trash2
//                       size={18}
//                     />
//                   </button>
//                 </div>
//               )
//             )}

//             <button
//               onClick={
//                 addRequirement
//               }
//               style={{
//                 background:
//                   "#222",
//                 border:
//                   "1px solid #333",
//                 color: "#fff",
//                 padding:
//                   "12px",
//                 borderRadius:
//                   "14px",
//                 cursor:
//                   "pointer",
//                 display: "flex",
//                 alignItems:
//                   "center",
//                 justifyContent:
//                   "center",
//                 gap: "8px",
//               }}
//             >
//               <Plus size={16} />
//               Add Requirement
//             </button>

//             <button
//               onClick={saveMenu}
//               style={{
//                 background:
//                   "#d4841a",
//                 border: "none",
//                 color: "#fff",
//                 padding:
//                   "14px",
//                 borderRadius:
//                   "14px",
//                 cursor:
//                   "pointer",
//                 fontWeight:
//                   "600",
//               }}
//             >
//               Save Menu
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "14px",
//   borderRadius: "14px",
//   border: "1px solid #333",
//   background: "#000",
//   color: "#fff",
// };

// const tableHead = {
//   padding: "18px",
//   textAlign: "left" as const,
//   color: "#888",
//   fontSize: "14px",
// };

// const tableData = {
//   padding: "18px",
// };











"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react";

interface Requirement {
  product: string;
  quantity: number;
  unit: string;
}

export default function MenuPage() {
  const [branch, setBranch] = useState<string | null>(null);
  const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");
  const [requirements, setRequirements] = useState<Requirement[]>([
    { product: "", quantity: 1, unit: "" },
  ]);
  const [menus, setMenus] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

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

  async function loadMenus() {
    const url = branch
      ? `/api/menu?branchName=${encodeURIComponent(branch)}`
      : "/api/menu";
    const response = await fetch(url);
    const data = await response.json();
    setMenus(data.data || []);
  }

  useEffect(() => {
    if (branch !== null) loadMenus();
  }, [branch]);

  function addRequirement() {
    setRequirements([...requirements, { product: "", quantity: 1, unit: "" }]);
  }

  function removeRequirement(index: number) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  function updateRequirement(index: number, field: string, value: any) {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    setRequirements(updated);
  }

  async function saveMenu() {
    if (!menuName || !price) return alert("Fill all fields");
    const response = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menuName,
        price: Number(price),
        requirements,
        branchName: branch,
      }),
    });
    const data = await response.json();
    if (!data.success) return alert(data.message);
    alert("Menu added successfully");
    setMenuName("");
    setPrice("");
    setRequirements([{ product: "", quantity: 1, unit: "" }]);
    setShowForm(false);
    loadMenus();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: transparent; }

        .menu-root {
          min-height: 100vh;
          background: transparent;
          color: #fff;
          font-family: "Times New Roman", Times, serif;
          padding: 0px;
          display: flex;
          gap: 24px;
        }

        .panel {
          background: transparent;
          // border: 1px solid #1a1a1a;
          border-radius: 20px;
          overflow: hidden;
          flex: 1;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 32px;
          border-bottom: 1px solid #1a1a1a;
          background: transparent;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .title-icon {
          width: 44px;
          height: 44px;
          background: #d4841a18;
          border: 1px solid #d4841a33;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4841a;
        }

        .title-text {
          // font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .title-sub {
          font-size: 13px;
          color: #fff;
          margin-top: 2px;
          font-weight: 300;
        }

        .add-btn {
          background: #d4841a;
          border: none;
          color: #fff;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "Times New Roman", Times, serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.3px;
          transition: background 0.15s, transform 0.1s;
        }

        .add-btn:hover {
          background: #e8951f;
          transform: translateY(-1px);
        }

        .add-btn:active { transform: translateY(0); }

        /* TABLE */
        .menu-table {
          width: 100%;
          border-collapse: collapse;
        }

        .menu-table thead tr {
          background: transparent;
        }

        .menu-table th {
          padding: 14px 28px;
          text-align: left;
          font-size: 11px;
          font-weight: 500;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-family: "Times New Roman", Times, serif;
        }

        .menu-table tbody tr {
          border-top: 1px solid #111;
          transition: background 0.12s;
        }

        .menu-table tbody tr:hover {
          background: #0f0f0f;
        }

        .menu-table td {
          padding: 18px 28px;
          color: #fff;
          font-size: 14px;
          vertical-align: top;
        }

        .branch-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          color: #fff;
          font-weight: 500;
        }

        .menu-name-cell {
          font-weight: 500;
          font-family: "Times New Roman", Times, serif;
          font-size: 15px;
          color: #f0f0f0;
        }

        .price-cell {
          font-family: "Times New Roman", Times, serif;
          font-size: 16px;
          font-weight: 700;
          color: #d4841a;
        }

        .req-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-size: 13px;
          padding: 3px 0;
        }

        .req-dot {
          width: 5px;
          height: 5px;
          background: #d4841a;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .req-name { color: #fff; }
        .req-amt { color: #ccc; }

        /* FORM PANEL */
        .form-panel {
          width: 400px;
          flex-shrink: 0;
          background: transparent;
          border: 1px solid #1a1a1a;
          border-radius: 20px;
          padding: 28px;
          height: fit-content;
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .form-title {
          font-family: "Times New Roman", Times, serif;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-title::before {
          content: '';
          display: block;
          width: 4px;
          height: 20px;
          background: #d4841a;
          border-radius: 2px;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 500;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: "Times New Roman", Times, serif;
          margin-bottom: 6px;
        }

        .field-wrap { display: flex; flex-direction: column; }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #2a2a2a;
          background: transparent;
          color: #fff;
          font-family: "Times New Roman", Times, serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }

        .form-input::placeholder { color: #666; }

        .form-input:focus {
          border-color: #d4841a55;
        }

        select.form-input option {
          background: #111;
          color: #fff;
        }

        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #fff;
          padding: 8px 0 4px;
          border-top: 1px solid #222;
          margin-top: 4px;
        }

        .req-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 36px;
          gap: 8px;
          align-items: center;
        }

        .remove-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 10px;
          background: #1a0a0a;
          color: #ef4444;
          border: 1px solid #2a1010;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s;
          flex-shrink: 0;
        }

        .remove-btn:hover { background: #250d0d; }

        .add-req-btn {
          background: transparent;
          border: 1px dashed #333;
          color: #fff;
          padding: 11px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: "Times New Roman", Times, serif;
          font-size: 13px;
          transition: border-color 0.15s, color 0.15s;
        }

        .add-req-btn:hover {
          border-color: #d4841a;
          color: #d4841a;
        }

        .save-btn {
          background: #d4841a;
          border: none;
          color: #fff;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-family: "Times New Roman", Times, serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.3px;
          transition: background 0.15s, transform 0.1s;
          margin-top: 4px;
        }

        .save-btn:hover {
          background: #e8951f;
          transform: translateY(-1px);
        }

        .save-btn:active { transform: translateY(0); }

        .empty-state {
          padding: 60px 28px;
          text-align: center;
          color: #fff;
          font-family: "Times New Roman", Times, serif;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
          opacity: 0.3;
        }
      `}</style>

      <div className="menu-root">
        {/* LEFT TABLE */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <div className="title-icon">
                <UtensilsCrossed size={20} />
              </div>
              <div>
                <div className="title-text font-display">Menu Management</div>
                <div className="title-sub">{menus.length} items listed</div>
              </div>
            </div>
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              <Plus size={16} />
              Add Menu
            </button>
          </div>

          <table className="menu-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Menu</th>
                <th>Price</th>
                <th>Requirements</th>
              </tr>
            </thead>
            <tbody>
              {menus.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-icon">🍽</div>
                      <div>No menus yet. Add your first one.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu._id}>
                    <td>
                      <span className="branch-badge">
                        <ChevronRight size={10} />
                        {menu.branchName || "—"}
                      </span>
                    </td>
                    <td className="menu-name-cell">{menu.menuName}</td>
                    <td className="price-cell">₹{menu.price}</td>
                    <td>
                      {menu.requirements.map((req: any, index: number) => (
                        <div key={index} className="req-item">
                          <span className="req-dot" />
                          <span className="req-name">{req.product}</span>
                          <span className="req-amt">
                            — {req.quantity} {req.unit}
                          </span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT FORM */}
        {showForm && (
          <div className="form-panel">
            <div className="form-title">Add New Menu</div>
            <div className="form-grid">
              <div className="field-wrap">
                <div className="field-label">Menu Name</div>
                <input
                  type="text"
                  placeholder="e.g. Butter Chicken"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="field-wrap">
                <div className="field-label">Price (₹)</div>
                <input
                  type="number"
                  placeholder="e.g. 350"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="section-label">Requirements</div>

              {requirements.map((req, index) => (
                <div key={index} className="req-row">
                  <input
                    type="text"
                    placeholder="Product"
                    value={req.product}
                    onChange={(e) =>
                      updateRequirement(index, "product", e.target.value)
                    }
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={req.quantity}
                    onChange={(e) =>
                      updateRequirement(index, "quantity", Number(e.target.value))
                    }
                    className="form-input"
                  />
                  <select
                    value={req.unit}
                    onChange={(e) =>
                      updateRequirement(index, "unit", e.target.value)
                    }
                    className="form-input"
                  >
                    <option value="">Unit</option>
                    <option value="kg">KG</option>
                    <option value="gram">Gram</option>
                    <option value="liter">Liter</option>
                    <option value="ml">ML</option>
                    <option value="pcs">PCS</option>
                  </select>
                  <button
                    onClick={() => removeRequirement(index)}
                    className="remove-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button onClick={addRequirement} className="add-req-btn">
                <Plus size={14} />
                Add Requirement
              </button>

              <button onClick={saveMenu} className="save-btn">
                Save Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}