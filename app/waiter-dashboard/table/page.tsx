"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Armchair } from "lucide-react";

export default function WaiterTables() {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [extraChairs, setExtraChairs] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | number>("");
  const [chairs, setChairs] = useState<string | number>("");

  async function loadTables() {
    try {
      const user = localStorage.getItem("user");
      const branchName = user ? JSON.parse(user).branch : null;
      if (!branchName) {
        setTables([]);
        return;
      }

      const res = await fetch(`/api/tables?branchName=${encodeURIComponent(branchName)}`);
      const data = await res.json();
      if (data.success) setTables(data.data || []);
      else setTables([]);
    } catch (err) {
      console.error(err);
      setTables([]);
    }
  }

  useEffect(() => {
    loadTables();
    const iv = setInterval(loadTables, 2000);
    return () => clearInterval(iv);
  }, []);

  async function updateChairs() {
    if (!selectedTable) return;
    try {
      const newChairs = [
        ...selectedTable.chairs,
        ...Array.from({ length: extraChairs }, (_, i) => ({ number: selectedTable.chairs.length + i + 1, occupied: false })),
      ];

      await fetch(`/api/tables/${selectedTable._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chairs: newChairs }),
      });

      setSelectedTable(null);
      setExtraChairs(0);
      loadTables();
    } catch (err) {
      console.error(err);
    }
  }

  async function addTable() {
    if (!tableNumber || !chairs) return alert("Fill all fields");
    try {
      const user = localStorage.getItem("user");
      const branch = user ? JSON.parse(user).branch : null;
      if (!branch) return alert("Branch is required");

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
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <style>{`
        .tbl-root {
          min-height: 100vh;
          background: #transparent;
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
                          setTables((prev) => prev.map((t) => (t._id === table._id ? { ...t, chairs: updated } : t)));
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


