"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ManagerDashboard from "../page";

export default function ManagerDashboardWithId() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      router.push("/");
      return;
    }

    const user = JSON.parse(userRaw);

    // If the logged-in user is a manager and their id doesn't match the URL,
    // redirect them to their own manager dashboard to prevent viewing others by accident.
    if (user.role === "manager" && user._id && id && user._id !== id) {
      router.push(`/manager-dashboard/${user._id}`);
      return;
    }
  }, [id, router]);

  return <ManagerDashboard />;
}
