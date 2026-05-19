"use client";

import { useEffect } from "react";
import { useAuth, Role } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";

const ROLE_PATHS: Record<Role, string> = {
  manager: "/dashboard",
  waiter: "/dashboard/waiter",
  cook: "/dashboard/cook",
};

// Pages each role is allowed to visit
const ROLE_ALLOWED: Record<Role, string[]> = {
  manager: ["/dashboard", "/dashboard/orders", "/dashboard/inventory", "/dashboard/staff", "/dashboard/waiter", "/dashboard/cook"],
  waiter: ["/dashboard/waiter", "/dashboard/orders"],
  cook: ["/dashboard/cook"],
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const allowed = ROLE_ALLOWED[user.role];
    if (!allowed.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      router.replace(ROLE_PATHS[user.role]);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surf)" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--brand)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
