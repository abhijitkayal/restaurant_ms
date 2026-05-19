"use client";

import {
  useEffect,
  useState,
} from "react";

// import { useSearchParams } from "next/navigation";

import {
  Plus,
  Trash2,
} from "lucide-react";

interface Requirement {
  product: string;

  quantity: number;

  unit: string;
}

export default function MenuPage() {
  const [branch, setBranch] = useState<string | null>(null);
  const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
  const [menuName, setMenuName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [
    requirements,
    setRequirements,
  ] = useState<
    Requirement[]
  >([
    {
      product: "",
      quantity: 1,
      unit: "",
    },
  ]);

  const [menus, setMenus] =
    useState<any[]>([]);

  const [showForm, setShowForm] =
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

  async function loadMenus() {
    const url = branch
      ? `/api/menu?branchName=${encodeURIComponent(
          branch
        )}`
      : "/api/menu";

    const response =
      await fetch(url);

    const data =
      await response.json();

    setMenus(data.data || []);
  }

  useEffect(() => {
    if (branch !== null) {
      loadMenus();
    }
  }, [branch]);

  function addRequirement() {
    setRequirements([
      ...requirements,

      {
        product: "",
        quantity: 1,
        unit: "",
      },
    ]);
  }

  function removeRequirement(
    index: number
  ) {
    setRequirements(
      requirements.filter(
        (_, i) => i !== index
      )
    );
  }

  function updateRequirement(
    index: number,
    field: string,
    value: any
  ) {
    const updated = [
      ...requirements,
    ];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setRequirements(updated);
  }

  async function saveMenu() {
    if (
      !menuName ||
      !price
    ) {
      return alert(
        "Fill all fields"
      );
    }

    const response = await fetch(
      "/api/menu",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          menuName,

          price:
            Number(price),

          requirements,

          branchName: branch,
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

    alert(
      "Menu added successfully"
    );

    setMenuName("");

    setPrice("");

    setRequirements([
      {
        product: "",
        quantity: 1,
        unit: "",
      },
    ]);

    setShowForm(false);

    loadMenus();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "30px",
        display: "flex",
        gap: "24px",
      }}
    >
      {/* LEFT TABLE */}
      <div
        style={{
          flex: 1,
          background: "#111",
          borderRadius: "24px",
          overflow: "hidden",
          border:
            "1px solid #222",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            padding: "24px",
            borderBottom:
              "1px solid #222",
          }}
        >
          <h1
            style={{
              fontSize: "34px",
              color: "#d4841a",
            }}
          >
            Menu Management
          </h1>

          <button
            onClick={() =>
              setShowForm(
                !showForm
              )
            }
            style={{
              background:
                "#d4841a",
              border: "none",
              color: "#fff",
              padding:
                "14px 20px",
              borderRadius:
                "14px",
              cursor:
                "pointer",
              display: "flex",
              alignItems:
                "center",
              gap: "10px",
              fontWeight:
                "600",
            }}
          >
            <Plus size={18} />
            Add Menu
          </button>
        </div>

        {/* TABLE */}
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
                style={tableHead}
              >
                Branch
              </th>

              <th
                style={tableHead}
              >
                Menu
              </th>

              <th
                style={tableHead}
              >
                Price
              </th>

              <th
                style={tableHead}
              >
                Requirements
              </th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr
                key={menu._id}
                style={{
                  borderTop:
                    "1px solid #222",
                }}
              >
                <td
                  style={
                    tableData
                  }
                >
                  {
                    menu.branchName || "-"
                  }
                </td>

                <td
                  style={
                    tableData
                  }
                >
                  {
                    menu.menuName
                  }
                </td>

                <td
                  style={
                    tableData
                  }
                >
                  ₹{menu.price}
                </td>

                <td
                  style={
                    tableData
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        "column",
                      gap: "6px",
                    }}
                  >
                    {menu.requirements.map(
                      (
                        req: any,
                        index: number
                      ) => (
                        <span
                          key={
                            index
                          }
                          style={{
                            color:
                              "#999",
                            fontSize:
                              "14px",
                          }}
                        >
                          •{" "}
                          {
                            req.product
                          }{" "}
                          -{" "}
                          {
                            req.quantity
                          }{" "}
                          {
                            req.unit
                          }
                        </span>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT FORM */}
      {showForm && (
        <div
          style={{
            width: "420px",
            background: "#111",
            borderRadius: "24px",
            padding: "24px",
            border:
              "1px solid #222",
            height:
              "fit-content",
          }}
        >
          <h2
            style={{
              marginBottom:
                "20px",
            }}
          >
            Add Menu
          </h2>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Menu Name"
              value={menuName}
              onChange={(e) =>
                setMenuName(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <h3>
              Requirements
            </h3>

            {requirements.map(
              (
                req,
                index
              ) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr auto",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Product"
                    value={
                      req.product
                    }
                    onChange={(e) =>
                      updateRequirement(
                        index,
                        "product",
                        e.target
                          .value
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                  <input
                    type="number"
                    placeholder="Qty"
                    value={
                      req.quantity
                    }
                    onChange={(e) =>
                      updateRequirement(
                        index,
                        "quantity",
                        Number(
                          e.target
                            .value
                        )
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                  <select
                    value={req.unit}
                    onChange={(e) =>
                      updateRequirement(
                        index,
                        "unit",
                        e.target
                          .value
                      )
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="">
                      Unit
                    </option>

                    <option value="kg">
                      KG
                    </option>

                    <option value="gram">
                      Gram
                    </option>

                    <option value="liter">
                      Liter
                    </option>

                    <option value="ml">
                      ML
                    </option>

                    <option value="pcs">
                      PCS
                    </option>
                  </select>

                  <button
                    onClick={() =>
                      removeRequirement(
                        index
                      )
                    }
                    style={{
                      width:
                        "50px",
                      border:
                        "none",
                      borderRadius:
                        "12px",
                      background:
                        "#ef4444",
                      color:
                        "#fff",
                      cursor:
                        "pointer",
                    }}
                  >
                    <Trash2
                      size={18}
                    />
                  </button>
                </div>
              )
            )}

            <button
              onClick={
                addRequirement
              }
              style={{
                background:
                  "#222",
                border:
                  "1px solid #333",
                color: "#fff",
                padding:
                  "12px",
                borderRadius:
                  "14px",
                cursor:
                  "pointer",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "8px",
              }}
            >
              <Plus size={16} />
              Add Requirement
            </button>

            <button
              onClick={saveMenu}
              style={{
                background:
                  "#d4841a",
                border: "none",
                color: "#fff",
                padding:
                  "14px",
                borderRadius:
                  "14px",
                cursor:
                  "pointer",
                fontWeight:
                  "600",
              }}
            >
              Save Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #333",
  background: "#000",
  color: "#fff",
};

const tableHead = {
  padding: "18px",
  textAlign: "left" as const,
  color: "#888",
  fontSize: "14px",
};

const tableData = {
  padding: "18px",
};