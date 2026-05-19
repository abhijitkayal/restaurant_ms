"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  MoreVertical,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";

export default function AdminDashboard() {
  const [branches, setBranches] =
    useState<any[]>([]);

  const [branchName, setBranchName] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    managerName,
    setManagerName,
  ] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [
    openMenu,
    setOpenMenu,
  ] = useState(null);

  async function loadBranches() {
    try {
      const response = await fetch(
        "/api/branches"
      );

      const data =
        await response.json();

      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadBranches();

    const interval =
      setInterval(() => {
        loadBranches();
      }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  async function createBranch() {
    try {
      if (
        !branchName ||
        !address ||
        !phone ||
        !managerName
      ) {
        alert(
          "Please fill all fields"
        );

        return;
      }

      const response = await fetch(
        "/api/branches",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            branchName,
            address,
            phone,
            managerName,
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        setBranchName("");
        setAddress("");
        setPhone("");
        setManagerName("");

        setShowModal(false);

        loadBranches();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteBranch(
    id: string
  ) {
    try {
      await fetch(
        `/api/branches/${id}`,
        {
          method: "DELETE",
        }
      );

      loadBranches();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: "30px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "700",
            color: "#f59e0b",
          }}
        >
          Admin Panel
        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          style={{
            background: "#f59e0b",
            color: "#000",
            border: "none",
            padding: "14px 22px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Plus size={18} />
          Create Branch
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.7)",
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
              background: "#1f1f1f",
              borderRadius: "20px",
              padding: "24px",
              border:
                "1px solid #2a2a2a",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>
                Create Branch
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                style={{
                  background:
                    "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "16px",
              }}
            >
              <input
                placeholder="Branch Name"
                value={branchName}
                onChange={(e) =>
                  setBranchName(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                placeholder="Address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                placeholder="Manager Name"
                value={managerName}
                onChange={(e) =>
                  setManagerName(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <button
                onClick={
                  createBranch
                }
                style={{
                  background:
                    "#f59e0b",
                  color: "#000",
                  border: "none",
                  padding: "14px",
                  borderRadius:
                    "12px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "700",
                }}
              >
                Create Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div
        style={{
          background: "#1f1f1f",
          borderRadius: "20px",
          overflow: "hidden",
          border:
            "1px solid #2a2a2a",
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
                style={tableHead}
              >
                Branch
              </th>

              <th
                style={tableHead}
              >
                Address
              </th>

              <th
                style={tableHead}
              >
                Phone
              </th>

              <th
                style={tableHead}
              >
                Manager
              </th>

              <th
                style={tableHead}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {branches.map(
              (branch) => (
                <tr
                  key={
                    branch._id
                  }
                  style={{
                    borderTop:
                      "1px solid #2a2a2a",
                  }}
                >
                  <td
                    style={
                      tableData
                    }
                  >
                    {
                      branch.branchName
                    }
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    {
                      branch.address
                    }
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    {
                      branch.phone
                    }
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    {
                      branch.managerName
                    }
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    <div
                      style={{
                        position:
                          "relative",
                      }}
                    >
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu ===
                              branch._id
                              ? null
                              : branch._id
                          )
                        }
                        style={{
                          background:
                            "transparent",
                          border:
                            "none",
                          color:
                            "#fff",
                          cursor:
                            "pointer",
                        }}
                      >
                        <MoreVertical
                          size={
                            18
                          }
                        />
                      </button>

                      {openMenu ===
                        branch._id && (
                        <div
                          style={{
                            position:
                              "absolute",
                            right: 0,
                            top: "0",
                            width:
                              "180px",
                            background:
                              "#222",
                            border:
                              "1px solid #333",
                            borderRadius:
                              "12px",
                            zIndex: 100,
                          }}
                        >
                          <button
                            onClick={() =>
                              window.location.href =
                                `/manager-dashboard?branchName=${encodeURIComponent(
                                  branch.branchName
                                )}`
                            }
                            style={
                              menuButton
                            }
                          >
                            <ExternalLink
                              size={
                                16
                              }
                            />
                            Open
                          </button>

                          <button
                            onClick={() =>
                              deleteBranch(
                                branch._id
                              )
                            }
                            style={
                              menuButton
                            }
                          >
                            <Trash2
                              size={
                                16
                              }
                            />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  background: "#111",
  border:
    "1px solid #2a2a2a",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
  outline: "none",
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

const menuButton = {
  width: "100%",
  background: "transparent",
  border: "none",
  color: "#fff",
  padding: "12px 14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
