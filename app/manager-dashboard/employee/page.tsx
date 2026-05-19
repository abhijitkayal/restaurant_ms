"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  User,
} from "lucide-react";

export default function EmployeePage() {
  const [employees, setEmployees] =
    useState<any[]>([]);
  const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("waiter");

  async function loadEmployees(branchName = branch) {
    try {
      if (!branchName) {
        setEmployees([]);
        return;
      }

      const response = await fetch(
        `/api/users?branch=${encodeURIComponent(branchName)}`
      );

      const data =
        await response.json();

      if (data.success) {
        setEmployees(data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (branch === null) {
      return;
    }

    loadEmployees(branch);

    const interval = setInterval(() => {
      loadEmployees(branch);
    }, 3000);

    return () => clearInterval(interval);
  }, [branch]);
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

  async function createEmployee() {
    try {
      if (
        !name ||
        !email ||
        !password
      ) {
        return alert(
          "Fill all fields"
        );
      }

      const avatar =
        name
          .split(" ")
          .map(
            (word) =>
              word[0]
          )
          .join("")
          .toUpperCase();

      const response = await fetch(
        "/api/users",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
            role,
            branch: branch || "",
            avatar,
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
        "Employee created"
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("waiter");

      setShowForm(false);

      loadEmployees();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteEmployee(
    id: string
  ) {
    try {
      await fetch(
        `/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      loadEmployees();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "\"Times New Roman\", Times, serif",
        background: "transparent",
        color: "#fff",
        padding: "0px",
        display: "flex",
        gap: "24px",
      }}
    >
      {/* LEFT TABLE */}
      <div
        style={{
          flex: 1,
          background: "transparent",
          borderRadius: "24px",
          overflow: "hidden",
         
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
              color: "#fff",
            }}
            className="font-display"
          >
            Employee Management
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
            Add Employee
          </button>
        </div>

        {/* TABLE */}
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
              border:"1px solid #222",
              // borderRadius:"30px",
          }}
          
        >
          <thead>
            <tr
              style={{
                background:
                  "#transparent",
              }}
            >
              <th
                style={tableHead}
              >
                Employee
              </th>

              <th
                style={tableHead}
              >
                Email
              </th>

              <th
                style={tableHead}
              >
                Role
              </th>

              <th
                style={tableHead}
              >
                Password
              </th>

              <th
                style={tableHead}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map(
              (employee) => (
                <tr
                  key={
                    employee._id
                  }
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
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width:
                            "42px",
                          height:
                            "42px",
                          borderRadius:
                            "50%",
                          background:
                            "#d4841a",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontWeight:
                            "700",
                        }}
                      >
                        {
                          employee.avatar
                        }
                      </div>

                      <div>
                        <h4>
                          {
                            employee.name
                          }
                        </h4>
                      </div>
                    </div>
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    {
                      employee.email
                    }
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    <span
                      style={{
                        background:
                          employee.role ===
                          "cook"
                            ? "#ef4444"
                            : "#3b82f6",
                        padding:
                          "6px 12px",
                        borderRadius:
                          "999px",
                        fontSize:
                          "13px",
                        textTransform:
                          "capitalize",
                      }}
                    >
                      {
                        employee.role
                      }
                    </span>
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    {
                      employee.password
                    }
                  </td>

                  <td
                    style={
                      tableData
                    }
                  >
                    <button
                      onClick={() =>
                        deleteEmployee(
                          employee._id
                        )
                      }
                      style={{
                        width:
                          "42px",
                        height:
                          "42px",
                        borderRadius:
                          "12px",
                        border:
                          "none",
                        background:
                          "#ef4444",
                        cursor:
                          "pointer",
                        color:
                          "#fff",
                          display:"flex",
                          alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      <Trash2
                        size={18}
                      />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* RIGHT FORM */}
      {/* MODAL FORM */}
{showForm && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
      backdropFilter: "blur(4px)",
    }}
    onClick={() => setShowForm(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "420px",
        background: "#111",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid #222",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        animation: "popup 0.25s ease",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Create Employee</h2>

        <button
          onClick={() => setShowForm(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#999",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* FORM */}
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Employee Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={inputStyle}
        >
          <option value="waiter">
            Waiter
          </option>

          <option value="cook">
            Cook
          </option>
        </select>

        <button
          onClick={createEmployee}
          style={{
            background: "#d4841a",
            border: "none",
            color: "#fff",
            padding: "14px",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Create Employee
        </button>
      </div>
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