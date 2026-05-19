// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// export default function BillPage({
//   params,
// }: any) {
//   const [order, setOrder] =
//     useState<any>(null);

//   async function loadBill() {
//     const res = await fetch(
//       `/api/orders/${params.id}`
//     );

//     const data =
//       await res.json();

//     setOrder(data.data);
//   }

//   useEffect(() => {
//     loadBill();
//   }, []);

//   if (!order) {
//     return (
//       <div
//         style={{
//           padding: "40px",
//         }}
//       >
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         maxWidth: "700px",
//         margin: "40px auto",
//         padding: "30px",
//         border:
//           "1px solid #ddd",
//         borderRadius: "20px",
//         fontFamily:
//           "sans-serif",
//       }}
//     >
//       <h1>
//         Restaurant Bill
//       </h1>

//       <hr />

//       <p>
//         <b>Order:</b>{" "}
//         {
//           order.orderNumber
//         }
//       </p>

//       <p>
//         <b>Table:</b>{" "}
//         {
//           order.tableNumber
//         }
//       </p>

//       <p>
//         <b>Payment:</b>{" "}
//         {
//           order.paymentMethod
//         }
//       </p>

//       <table
//         style={{
//           width: "100%",
//           marginTop: "20px",
//         }}
//       >
//         <thead>
//           <tr>
//             <th align="left">
//               Item
//             </th>

//             <th align="left">
//               Qty
//             </th>

//             <th align="left">
//               Price
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {order.items.map(
//             (
//               item: any,
//               index: number
//             ) => (
//               <tr key={index}>
//                 <td>
//                   {
//                     item.name
//                   }
//                 </td>

//                 <td>
//                   {
//                     item.quantity
//                   }
//                 </td>

//                 <td>
//                   ₹
//                   {(
//                     item.price *
//                     item.quantity
//                   ).toFixed(
//                     0
//                   )}
//                 </td>
//               </tr>
//             )
//           )}
//         </tbody>
//       </table>

//       <hr
//         style={{
//           margin:
//             "20px 0",
//         }}
//       />

//       <h2>
//         Total: ₹
//         {order.total.toFixed(
//           0
//         )}
//       </h2>

//       <button
//         onClick={() =>
//           window.print()
//         }
//         style={{
//           marginTop: "20px",
//           padding:
//             "12px 20px",
//           border: "none",
//           background:
//             "#000",
//           color: "#fff",
//           borderRadius:
//             "10px",
//           cursor: "pointer",
//         }}
//       >
//         Print Bill
//       </button>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  orderNumber: string;
  tableNumber: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  createdAt: string;
  branch?: string;

  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface BranchSettings {
  branchName?: string;
  restaurantName?: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  logoUrl?: string;
  logoPublicId?: string;
  managerName?: string;
}

export default function BillPage({
  params,
}: any) {
  const [order, setOrder] =
    useState<Order | null>(null);
  const [branchSettings, setBranchSettings] =
    useState<BranchSettings | null>(null);

  useEffect(() => {
    loadOrder();
  }, []);

  useEffect(() => {
    if (!order?.branch) {
      return;
    }

    loadBranchSettings(order.branch);
  }, [order]);

  async function loadOrder() {
    const response = await fetch(
      `/api/orders/${params.id}`
    );

    const data =
      await response.json();

    if (data.success) {
      setOrder(data.data);
    }
  }

  async function loadBranchSettings(branchName: string) {
    try {
      const response = await fetch(
        `/api/branches?branchName=${encodeURIComponent(branchName)}`
      );
      const data = await response.json();
      const settings = data?.data?.[0];

      if (settings) {
        setBranchSettings(settings);
      }
    } catch (error) {
      console.log("branch settings load error", error);
    }
  }

  const headerName =
    branchSettings?.restaurantName ||
    branchSettings?.branchName ||
    "Restaurant";

  const headerAddress = branchSettings?.address || "";
  const headerPhone = branchSettings?.phone || "";
  const headerEmail = branchSettings?.email || "";
  const headerGstin = branchSettings?.gstin || "";

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const logoSrc =
    branchSettings?.logoUrl ||
    (branchSettings?.logoPublicId && cloudName
      ? `https://res.cloudinary.com/${cloudName}/image/upload/${branchSettings.logoPublicId}`
      : undefined);

  if (!order) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "80mm",
        minHeight: "100vh",
        margin: "0 auto",
        background: "#fff",
        color: "#000",
        padding: "10px",
        fontFamily: "monospace",
        fontSize: "11px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          borderBottom:
            "1px dashed #000",
          paddingBottom: "8px",
          marginBottom: "8px",
        }}
      >
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={headerName}
            onError={(e) => {
              // show helpful console output when image fails to load
              // eslint-disable-next-line no-console
              console.error("Bill logo failed to load:", e.currentTarget.src);
              e.currentTarget.style.display = "none";
            }}
            style={{
              maxHeight: "56px",
              maxWidth: "100%",
              objectFit: "contain",
              margin: "0 auto 6px",
              display: "block",
            }}
          />
        ) : null}

        <h2 style={{ margin: 0, fontSize: "18px" }}>
          {headerName}
        </h2>

        {headerGstin ? (
          <p style={{ margin: "4px 0" }}>GSTIN: {headerGstin}</p>
        ) : null}

        {headerAddress ? (
          <p style={{ margin: "4px 0" }}>{headerAddress}</p>
        ) : null}

        {(headerPhone || headerEmail) ? (
          <p style={{ margin: "4px 0" }}>
            {headerPhone ? `Phone: ${headerPhone}` : ""}
            {headerPhone && headerEmail ? " | " : ""}
            {headerEmail ? `Email: ${headerEmail}` : ""}
          </p>
        ) : null}

        {order.branch ? (
          <p style={{ margin: "4px 0" }}>Branch: {order.branch}</p>
        ) : null}
      </div>

      {/* INFO */}

      <div
        style={{
          marginBottom: "10px",
          lineHeight: "18px",
        }}
      >
        <div>
          Bill No:
          {" "}
          {order.orderNumber}
        </div>

        <div>
          Table:
          {" "}
          {order.tableNumber}
        </div>

        <div>
          Date:
          {" "}
          {new Date(
            order.createdAt
          ).toLocaleDateString()}
        </div>

        <div>
          Time:
          {" "}
          {new Date(
            order.createdAt
          ).toLocaleTimeString()}
        </div>
      </div>

      {/* ITEMS */}

      <table
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
          marginBottom: "10px",
        }}
      >
        <thead>
          <tr
            style={{
              borderTop:
                "1px dashed #000",
              borderBottom:
                "1px dashed #000",
            }}
          >
            <th
              style={{
                textAlign:
                  "left",
                padding:
                  "4px 0",
              }}
            >
              Item
            </th>

            <th>Qty</th>

            <th>Rate</th>

            <th
              style={{
                textAlign:
                  "right",
              }}
            >
              Amt
            </th>
          </tr>
        </thead>

        <tbody>
          {order.items.map(
            (item, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding:
                      "4px 0",
                  }}
                >
                  {item.name}
                </td>

                <td
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  {
                    item.quantity
                  }
                </td>

                <td
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  ₹
                  {item.price}
                </td>

                <td
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  ₹
                  {item.price *
                    item.quantity}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* TOTALS */}

      <div
        style={{
          borderTop:
            "1px dashed #000",
          paddingTop: "8px",
          lineHeight: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span>Subtotal</span>

          <span>
            ₹
            {order.subtotal.toFixed(
              0
            )}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span>GST</span>

          <span>
            ₹
            {order.tax.toFixed(0)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",

            fontWeight: "700",

            borderTop:
              "1px dashed #000",

            marginTop: "6px",

            paddingTop: "6px",

            fontSize: "14px",
          }}
        >
          <span>Total</span>

          <span>
            ₹
            {order.total.toFixed(
              0
            )}
          </span>
        </div>
      </div>

      {/* PAYMENT */}

      <div
        style={{
          marginTop: "10px",
          borderTop:
            "1px dashed #000",
          paddingTop: "8px",
          lineHeight: "18px",
        }}
      >
        <div>
          Payment:
          {" "}
          {
            order.paymentMethod
          }
        </div>

        <div>Status: Paid</div>
      </div>

      {/* FOOTER */}

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          borderTop:
            "1px dashed #000",
          paddingTop: "10px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
          }}
        >
          Thank You!
        </h3>

        <p
          style={{
            margin:
              "4px 0 0 0",
          }}
        >
          Visit Again
        </p>
      </div>

      {/* PRINT BUTTON */}

      <button
        onClick={() =>
          window.print()
        }
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "10px",
          background: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Print Bill
      </button>

      <style jsx global>{`
        @media print {
          button {
            display: none;
          }

          body {
            margin: 0;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}