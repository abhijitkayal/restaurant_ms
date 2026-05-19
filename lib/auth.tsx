"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type Role = "manager" | "waiter" | "cook";

export interface AuthUser {
  name: string;
  role: Role;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("saveur_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  function login(u: AuthUser) {
    setUser(u);
    localStorage.setItem("saveur_user", JSON.stringify(u));
    const dest = u.role === "manager" ? "/dashboard" : u.role === "waiter" ? "/dashboard/waiter" : "/dashboard/cook";
    router.push(dest);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("saveur_user");
    router.push("/login");
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
