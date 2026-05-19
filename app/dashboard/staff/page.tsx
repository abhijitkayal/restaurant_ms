"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users, Phone, Mail } from "lucide-react";

interface StaffMember {
  _id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Inactive";
  shift: string;
  hourlyRate: number;
  hoursWorked: number;
  joinDate: string;
}

const ROLES = ["Chef", "Sous Chef", "Waiter", "Waitress", "Bartender", "Host", "Cashier", "Manager", "Kitchen Staff", "Cleaner"];
const SHIFTS = ["Morning", "Afternoon", "Evening", "Night"];

const statusBadge: Record<string, string> = {
  Active: "badge-green",
  "On Leave": "badge-yellow",
  Inactive: "badge-gray",
};

const shiftBadge: Record<string, string> = {
  Morning: "badge-yellow",
  Afternoon: "badge-orange",
  Evening: "badge-blue",
  Night: "badge-gray",
};

const empty = { name: "", role: "Waiter", email: "", phone: "", status: "Active", shift: "Evening", hourlyRate: 150, hoursWorked: 0 };

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/staff");
    const data = await res.json();
    setStaff(data.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(empty); setShowModal(true); }
  function openEdit(m: StaffMember) {
    setEditing(m);
    setForm({ name: m.name, role: m.role, email: m.email, phone: m.phone, status: m.status, shift: m.shift, hourlyRate: m.hourlyRate, hoursWorked: m.hoursWorked });
    setShowModal(true);
  }

  async function save() {
    setSaving(true);
    const url = editing ? `/api/staff/${editing._id}` : "/api/staff";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowModal(false);
    load();
  }

  async function del(id: string) {
    if (!confirm("Remove this staff member?")) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = staff.filter(s => {
    const matchRole = roleFilter === "All" || s.role === roleFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const active = staff.filter(s => s.status === "Active").length;
  const totalPayroll = staff.filter(s => s.status === "Active").reduce((sum, s) => sum + s.hourlyRate * s.hoursWorked, 0);

  return (
    <div className="p-8 animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "#e8e6e3" }}>Staff</h1>
          <p className="text-sm" style={{ color: "#6b6966" }}>{active} active · ₹{totalPayroll.toLocaleString()} payroll</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openAdd}><Plus size={16} />Add Staff</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Staff", value: staff.length, color: "#60a5fa" },
          { label: "Active", value: active, color: "#4ade80" },
          { label: "On Leave", value: staff.filter(s => s.status === "On Leave").length, color: "#fbbf24" },
          { label: "Payroll (MTD)", value: `₹${totalPayroll.toLocaleString()}`, color: "#e4a224" },
        ].map(card => (
          <div key={card.label} className="card p-4">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#6b6966" }}>{card.label}</p>
            <p className="font-display text-xl font-semibold" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b6966" }} />
          <input className="input-field pl-9" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option>All</option>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="input-field w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>On Leave</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand)" }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#6b6966" }}>
          <Users size={40} className="mx-auto mb-3 opacity-20" />
          <p>No staff found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(member => (
            <div key={member._id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: "var(--surface-200)", color: "var(--brand-light, #e4a224)" }}>
                    {member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#e8e6e3" }}>{member.name}</p>
                    <p className="text-xs" style={{ color: "#6b6966" }}>{member.role}</p>
                  </div>
                </div>
                <span className={`badge ${statusBadge[member.status]}`}>{member.status}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: "#8f8d8a" }}>
                  <Mail size={11} />{member.email}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#8f8d8a" }}>
                  <Phone size={11} />{member.phone}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--surface-200)" }}>
                <div className="flex items-center gap-2">
                  <span className={`badge ${shiftBadge[member.shift]}`}>{member.shift}</span>
                  <span className="text-xs" style={{ color: "#6b6966" }}>₹{member.hourlyRate}/hr</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(member)} className="p-1.5 rounded" style={{ color: "#6b6966" }} title="Edit"
                    onMouseOver={e => (e.currentTarget.style.color = "#e4a224")} onMouseOut={e => (e.currentTarget.style.color = "#6b6966")}>
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => del(member._id)} className="p-1.5 rounded" style={{ color: "#6b6966" }} title="Delete"
                    onMouseOver={e => (e.currentTarget.style.color = "#f87171")} onMouseOut={e => (e.currentTarget.style.color = "#6b6966")}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal animate-fade-up">
            <h2 className="font-display text-xl font-semibold mb-6" style={{ color: "#e8e6e3" }}>{editing ? "Edit Staff Member" : "Add Staff Member"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Full Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Role</label>
                <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Shift</label>
                <select className="input-field" value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })}>
                  {SHIFTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Email *</label>
                <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Phone</label>
                <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Hourly Rate (₹)</label>
                <input type="number" className="input-field" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8f8d8a" }}>Hours Worked</label>
                <input type="number" className="input-field" value={form.hoursWorked} onChange={e => setForm({ ...form, hoursWorked: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add Member"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
