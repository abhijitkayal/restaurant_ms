"use client";

import { useEffect, useState } from "react";

import {
  Package,
  Plus,
  Pencil,
} from "lucide-react";

interface InventoryItem {
  _id: string;

  productName: string;

  quantity: number;

  unit: string;

  createdAt: string;
}

export default function InventoryPage() {
  const [branch, setBranch] = useState<string | null>(null);
  const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
  const [items, setItems] = useState<
    InventoryItem[]
  >([]);

  const [productName, setProductName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] =
  useState<string | null>(null);

  const [showModal, setShowModal] =
    useState(false);

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

  async function loadInventory() {
    const url = branch ? `/api/inventory?branchName=${encodeURIComponent(branch)}` : "/api/inventory";
    const response = await fetch(url);

    const data = await response.json();

    setItems(data.data || []);
  }

  useEffect(() => {
    if (branch !== null) {
      loadInventory();
    }
  }, [branch]);

  // async function addInventory() {
  //   if (
  //     !productName ||
  //     !quantity ||
  //     !unit
  //   ) {
  //     return alert("Fill all fields");
  //   }

  //   const response = await fetch(
  //     "/api/inventory",
  //     {
  //       method: "POST",

  //       headers: {
  //         "Content-Type":
  //           "application/json",
  //       },

  //       body: JSON.stringify({
  //         productName,

  //         quantity:
  //           Number(quantity),

  //         unit,
  //       }),
  //     }
  //   );

  //   const data = await response.json();

  //   if (!data.success) {
  //     return alert(
  //       "Failed to add inventory"
  //     );
  //   }

  //   setProductName("");

  //   setQuantity("");

  //   setUnit("");

  //   setShowModal(false);

  //   loadInventory();
  // }

  async function addInventory() {
  if (
    !productName ||
    !quantity ||
    !unit
  ) {
    return alert("Fill all fields");
  }

  const url = editingId
    ? `/api/inventory/${editingId}`
    : "/api/inventory";

  const method = editingId
    ? "PUT"
    : "POST";

  const response = await fetch(url, {
    method,

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      productName: productName.trim(),

      quantity: Number(quantity),

      unit,

      branch,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    return alert(
      editingId
        ? "Failed to update inventory"
        : "Failed to add inventory"
    );
  }

  setProductName("");
  setQuantity("");
  setUnit("");
  setEditingId(null);

  setShowModal(false);

  loadInventory();
}
  useEffect(() => {
    loadInventory();
  }, []);

  const tableHeadStyle = {
    padding: "18px",
    textAlign: "left" as const,
    color: "#888",
    fontSize: "14px",
  };

  const tableCellStyle = {
    padding: "18px",
    color: "#fff",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #333",
    background: "#000",
    color: "#fff",
    fontSize: "15px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        color: "#fff",
        padding: "30px",
        fontFamily:
          "'DM Sans', sans-serif",
      }}
    >
      {/* TOP BAR */}
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
              marginBottom: "6px",
            }}
          >
            Inventory Management
          </h1>

          <p
            style={{
              color: "#888",
            }}
          >
            Manage restaurant stock
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          style={{
            background: "#d4841a",
            border: "none",
            borderRadius: "14px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "15px",
            padding: "14px 22px",
          }}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          overflowX: "auto",
          background: "#111",
          border: "1px solid #222",
          borderRadius: "24px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "#181818",
              }}
            >
              <th
                style={
                  tableHeadStyle
                }
              >
                Product
              </th>

              <th
                style={
                  tableHeadStyle
                }
              >
                Quantity
              </th>

              <th
                style={
                  tableHeadStyle
                }
              >
                Unit
              </th>

              <th
                style={
                  tableHeadStyle
                }
              >
                Status
              </th>

              <th
                style={
                  tableHeadStyle
                }
              >
                Date
              </th>
              <th style={tableHeadStyle}>
  Action
</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                style={{
                  borderTop:
                    "1px solid #222",
                }}
              >
                <td
                  style={
                    tableCellStyle
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height:
                          "42px",
                        borderRadius:
                          "12px",
                        background:
                          "#1f1f1f",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      <Package
                        size={18}
                        color="#d4841a"
                      />
                    </div>

                    {
                      item.productName
                    }
                  </div>
                </td>

                <td
                  style={
                    tableCellStyle
                  }
                >
                  {item.quantity}
                </td>

                <td
                  style={
                    tableCellStyle
                  }
                >
                  {item.unit}
                </td>

                <td
                  style={
                    tableCellStyle
                  }
                >
                  <span
  style={{
    background:
      item.quantity <= 5
        ? "#3b0a0a"
        : "#052e16",

    color:
      item.quantity <= 5
        ? "#ef4444"
        : "#22c55e",

    padding:
      "6px 12px",

    borderRadius:
      "999px",

    fontSize:
      "12px",

    fontWeight:
      "600",
  }}
>
  {item.quantity <= 5
    ? "Low Stock"
    : "Available"}
</span>
                </td>

                <td
                  style={
                    tableCellStyle
                  }
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </td>
                <td style={tableCellStyle}>
  <button
    onClick={() => {
      setEditingId(item._id);

      setProductName(
        item.productName
      );

      setQuantity(
        item.quantity.toString()
      );

      setUnit(item.unit);

      setShowModal(true);
    }}
    style={{
      background: "#1f1f1f",
      border: "1px solid #333",
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent:
        "center",
    }}
  >
    <Pencil
      size={16}
      color="#d4841a"
    />
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          onClick={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setShowModal(false);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "500px",
              background: "#111",
              borderRadius:
                "24px",
              padding: "30px",
              border:
                "1px solid #222",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                marginBottom:
                  "24px",
              }}
            >
              {editingId
  ? "Edit Inventory Product"
  : "Add Inventory Product"}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "18px",
              }}
            >
              <input
                type="text"
                placeholder="Product Name"
                value={
                  productName
                }
                onChange={(e) =>
                  setProductName(
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />

              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />

              <select
                value={unit}
                onChange={(e) =>
                  setUnit(
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Select Unit
                </option>

                <option value="kg">
                  Kilogram
                </option>

                <option value="gram">
                  Gram
                </option>

                <option value="liter">
                  Liter
                </option>

                <option value="ml">
                  Milliliter
                </option>

                <option value="pcs">
                  Pieces
                </option>
              </select>

              <button
                onClick={
                  addInventory
                }
                style={{
                  background:
                    "#d4841a",
                  border: "none",
                  borderRadius:
                    "14px",
                  color: "#fff",
                  padding: "14px",
                  fontWeight:
                    "600",
                  cursor:
                    "pointer",
                  fontSize:
                    "15px",
                }}
              >
                {editingId
  ? "Update Product"
  : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}