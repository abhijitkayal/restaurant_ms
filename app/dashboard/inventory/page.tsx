"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, AlertTriangle, Package } from "lucide-react";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
}

const CATEGORIES = ["Produce", "Meat", "Dairy", "Beverages", "Dry Goods", "Spices", "Seafood", "Bakery", "Other"];
const UNITS = ["kg", "g", "L", "mL", "pcs", "dozen", "box", "bag", "bottle", "can"];

const empty = { name: "", category: "Produce", quantity: 0, unit: "kg", minStock: 10, costPerUnit: 0, supplier: "", expiryDate: "" };

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setItems(data.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(empty); setShowModal(true); }
  function openEdit(item: InventoryItem) {
    setEditing(item);
    setForm({ name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, minStock: item.minStock, costPerUnit: item.costPerUnit, supplier: item.supplier, expiryDate: item.expiryDate?.split("T")[0] || "" });
    setShowModal(true);
  }

  async function save() {
    setSaving(true);
    const url = editing ? `/api/inventory/${editing._id}` : "/api/inventory";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowModal(false);
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = items.filter(i => {
    const matchCat = catFilter === "All" || i.category === catFilter;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.supplier.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowStock = items.filter(i => i.quantity <= i.minStock).length;

  return (
    <div className="p-8 animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "#e8e6e3" }}>Inventory</h1>
          <p className="text-sm" style={{ color: "#6b6966" }}>{items.length} items · {lowStock > 0 && <span style={{ color: "#f87171" }}>{lowStock} low stock</span>}</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openAdd}>
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b6966" }} />
          <input className="input-field pl-9" placeholder="Search items or suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Low stock alert */}
      {lowStock > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-6 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
          <AlertTriangle size={15} />
          {lowStock} item{lowStock > 1 ? "s are" : " is"} running low on stock. Reorder soon.
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand)" }} /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--surface-200)" }}>
                {["Item", "Category", "Stock", "Min Stock", "Cost/Unit", "Supplier", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider" style={{ color: "#6b6966" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16" style={{ color: "#6b6966" }}>
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No items found</p>
                </td></tr>
              ) : filtered.map(item => {
                const isLow = item.quantity <= item.minStock;
                return (
                  <tr key={item._id} className="card-hover transition-colors" style={{ borderBottom: "1px solid var(--surface-200)" }}>
                    <td className="px-5 py-3.5 font-medium" style={{ color: "#e8e6e3" }}>{item.name}</td>
                    <td className="px-5 py-3.5"><span className="badge badge-gray">{item.category}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={isLow ? "font-semibold" : ""} style={{ color: isLow ? "#f87171" : "#e8e6e3" }}>
                        {item.quantity} {item.unit}
                      </span>
                      {isLow && <AlertTriangle size={12} className="inline ml-1" style={{ color: "#f87171" }} />}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "#8f8d8a" }}>{item.minStock} {item.unit}</td>
                    <td className="px-5 py-3.5" style={{ color: "#e8e6e3" }}>₹{item.costPerUnit.toFixed(2)}</td>
                    <td className="px-5 py-3.5" style={{ color: "#8f8d8a" }}>{item.supplier}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-md transition-colors hover:bg-surface-200" style={{ color: "#6b6966" }} title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => del(item._id)} className="p-1.5 rounded-md transition-colors" style={{ color: "#6b6966" }} title="Delete"
                          onMouseOver={e => (e.currentTarget.style.color = "#f87171")} onMouseOut={e => (e.currentTarget.style.color = "#6b6966")}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal animate-fade-up">
            <h2 className="font-display text-xl font-semibold mb-6" style={{ color: "#e8e6e3" }}>{editing ? "Edit Item" : "Add Inventory Item"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Item Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Chicken Breast" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Unit</label>
                <select className="input-field" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Quantity *</label>
                <input type="number" className="input-field" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Min Stock Level</label>
                <input type="number" className="input-field" value={form.minStock} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Cost per Unit (₹)</label>
                <input type="number" className="input-field" value={form.costPerUnit} onChange={e => setForm({ ...form, costPerUnit: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Expiry Date</label>
                <input type="date" className="input-field" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Supplier *</label>
                <input className="input-field" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Supplier name" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add Item"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
