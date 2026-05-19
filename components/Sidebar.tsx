"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Users, ClipboardList,
  ChefHat, LogOut, UtensilsCrossed, ConciergeBell,
} from "lucide-react";
import { useAuth, Role } from "@/lib/auth";

const allNav = [
  { href: "/dashboard",           label: "Manager",    icon: LayoutDashboard, section: "Dashboards", roles: ["manager"] as Role[] },
  { href: "/dashboard/waiter",    label: "Waiter",     icon: ConciergeBell,   section: "Dashboards", roles: ["manager", "waiter"] as Role[] },
  { href: "/dashboard/cook",      label: "Cook / KDS", icon: UtensilsCrossed, section: "Dashboards", roles: ["manager", "cook"] as Role[] },
  { href: "/dashboard/orders",    label: "Orders",     icon: ClipboardList,   section: "Manage",     roles: ["manager", "waiter"] as Role[] },
  { href: "/dashboard/inventory", label: "Inventory",  icon: Package,         section: "Manage",     roles: ["manager"] as Role[] },
  { href: "/dashboard/staff",     label: "Staff",      icon: Users,           section: "Manage",     roles: ["manager"] as Role[] },
];

const roleColors: Record<Role, string> = {
  manager: "#e4a224",
  waiter: "#60a5fa",
  cook: "#f87171",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = user?.role ?? "manager";

  const visibleNav = allNav.filter((n) => n.roles.includes(role));
  const sections = [...new Set(visibleNav.map((n) => n.section))];

  return (
    <aside className="w-60 shrink-0 flex flex-col" style={{ background: "var(--surface-50)", borderRight: "1px solid var(--surface-200)", minHeight: "100vh" }}>
      <div className="px-6 py-5 border-b" style={{ borderColor: "var(--surface-200)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--brand)" }}>
            <ChefHat size={18} color="#0f0e0c" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-semibold text-lg leading-tight" style={{ color: "#e8e6e3" }}>Saveur</p>
            <p className="text-xs" style={{ color: "#6b6966" }}>Management</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-lg flex items-center gap-2.5" style={{ background: `${roleColors[role]}10`, border: `1px solid ${roleColors[role]}25` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${roleColors[role]}22`, color: roleColors[role] }}>
            {user.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "#e8e6e3" }}>{user.name}</p>
            <p className="text-xs capitalize" style={{ color: roleColors[role] }}>{user.role}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section} className="mb-2">
            <p className="px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "#6b6966", letterSpacing: ".08em" }}>{section}</p>
            {visibleNav.filter((n) => n.section === section).map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium"
                  style={{ background: active ? "rgba(212,132,26,0.12)" : "transparent", color: active ? "#e4a224" : "#8f8d8a", borderLeft: active ? "2px solid var(--brand)" : "2px solid transparent" }}
                >
                  <Icon size={16} />{label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--surface-200)" }}>
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm transition-all"
          style={{ color: "#6b6966" }}
          onMouseOver={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.07)"; }}
          onMouseOut={e => { e.currentTarget.style.color = "#6b6966"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={16} />Sign out
        </button>
      </div>
    </aside>
  );
}
