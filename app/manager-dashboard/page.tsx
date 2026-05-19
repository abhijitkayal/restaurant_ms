


"use client";

import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  Bell,
  Table,
  Warehouse,
  User,
  Settings2,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Howl } from "howler";
import OrdersPage from "./order/page";
import { set } from "mongoose";
import TablesPage from "./tables/page";
import InventoryPage from "./inventory/page";
import MenuPage from "./menu/page";
import EmployeePage from "./employee/page";

const notificationSound =
  new Howl({
    src: [
      "/sounds/notification.wav",
    ],

    volume: 1.0,
  });
const orders = [
  {
    id: "#1021",
    table: "Table 1",
    item: "Chicken Burger",
    status: "Preparing",
    amount: "₹450",
  },
  {
    id: "#1022",
    table: "Table 4",
    item: "Pasta Alfredo",
    status: "Completed",
    amount: "₹620",
  },
  {
    id: "#1023",
    table: "Table 2",
    item: "Veg Pizza",
    status: "Pending",
    amount: "₹780",
  },
];

type BranchSettingsForm = {
  branchName: string;
  trackingEmail: string;
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  accountNo: string;
  ifscCode: string;
  gstin: string;
  logoUrl: string;
  logoPublicId: string;
  managerName: string;
};

const EMPTY_SETTINGS_FORM: BranchSettingsForm = {
  branchName: "",
  trackingEmail: "",
  restaurantName: "",
  address: "",
  phone: "",
  email: "",
  accountNo: "",
  ifscCode: "",
  gstin: "",
  logoUrl: "",
  logoPublicId: "",
  managerName: "",
};

export default function ManagerDashboard() {
  const buildDisplayLogoUrl = (url: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${Date.now()}`;
  };

  const getStoredUserEmail = () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return "";

      const parsedUser = JSON.parse(user);
      return parsedUser?.email || "";
    } catch {
      return "";
    }
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [branch, setBranch] = useState<string | null>(null);
  const [queryBranchName, setQueryBranchName] = useState<string | null>(null);
  const [logo, setLogo] =
  useState(
    "/logo.png"
  );
  const [logoUploading, setLogoUploading] =
    useState(false);
  const [logoError, setLogoError] =
    useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState<BranchSettingsForm>(EMPTY_SETTINGS_FORM);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [dashboardData, setDashboardData] =
  useState({
    totalRevenue: 0,
    totalOrders: 0,
    productSales: [],
    paymentTypes: [],
  });
  const [
  notifications,
  setNotifications,
] = useState<any[]>([]);
const previousCount =
  useRef(0);

const [
  showNotifications,
  setShowNotifications,
] = useState(false);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setQueryBranchName(params.get("branchName"));

  if (params.get("branchName")) {
    setBranch(params.get("branchName"));
  } else {
    try {
      const u = localStorage.getItem("user");
      const parsedUser = u ? JSON.parse(u) : null;
      setBranch(parsedUser ? parsedUser.branch : null);
      setSettingsForm((prev) => ({
        ...prev,
        trackingEmail: parsedUser?.email || prev.trackingEmail,
      }));
    } catch {
      setBranch(null);
    }
  }
}, []);

async function loadNotifications(branchName = branch) {
  try {
    if (!branchName) {
      setNotifications([]);
      return;
    }

    const response = await fetch(`/api/notifications?branchName=${encodeURIComponent(branchName)}`);

    const data =
      await response.json();

    if (data.success) {
      setNotifications((data.data || []).filter((n: any) => n.branch === branchName));
    } else {
      setNotifications([]);
    }
  } catch (error) {
    console.log(error);
    setNotifications([]);
  }
}
  async function loadDashboard(branchName = branch) {
  try {
    const response = await fetch(
      `/api/manager-dashboard${branchName ? `?branchName=${encodeURIComponent(branchName)}` : ""}`
    );

    const data =
      await response.json();
console.log(data);
    if (data.success) {
      setDashboardData(data.data);
    }
  } catch (error) {
    console.log(error);
  }
}
async function uploadLogo(
  file: File
) {
  try {
    setLogoError(null);
    setLogoUploading(true);

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await fetch(
        "/api/upload-logo",
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    if (!response.ok || !data.success) {
      const message =
        data?.message ||
        `Upload failed (${response.status})`;
      setLogoError(message);
      return;
    }

    const uploadedUrl =
      data.url ||
      data.secure_url ||
      null;

    if (
      uploadedUrl
    ) {
      const updatedForm = {
        ...settingsForm,
        branchName: settingsForm.branchName.trim() || branch || "",
        trackingEmail:
          settingsForm.trackingEmail.trim() || getStoredUserEmail(),
        logoUrl: uploadedUrl,
        logoPublicId: data.public_id || settingsForm.logoPublicId,
      };

      setLogo(
        buildDisplayLogoUrl(uploadedUrl)
      );

      setSettingsForm(updatedForm);

      if (branch) {
        const response = await fetch(
          settingsId ? `/api/branches/${settingsId}` : "/api/branches",
          {
            method: settingsId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedForm),
          }
        );

        const saved = await response.json();

        if (!response.ok || !saved.success) {
          throw new Error(
            saved?.message || "Logo uploaded but failed to save branch settings"
          );
        }

        setSettingsId(saved?.data?._id || settingsId);
      }

      localStorage.setItem(
        "restaurantLogo",
        uploadedUrl
      );
    } else {
      setLogoError(
        "Upload succeeded but no image URL returned"
      );
    }
  } catch (error) {
    setLogoError(
      error instanceof Error
        ? error.message
        : "Upload failed"
    );
  } finally {
    setLogoUploading(false);
  }
}

async function loadSettings(branchName = branch) {
  if (!branchName) {
    setSettingsForm(EMPTY_SETTINGS_FORM);
    setSettingsId(null);
    return;
  }

  setSettingsLoading(true);
  setSettingsMessage(null);

  try {
    const trackingEmail = getStoredUserEmail();
    const query = trackingEmail
      ? `/api/branches?branchName=${encodeURIComponent(branchName)}&trackingEmail=${encodeURIComponent(trackingEmail)}`
      : `/api/branches?branchName=${encodeURIComponent(branchName)}`;

    const response = await fetch(query);
    const data = await response.json();
    const settings = data?.data?.[0];

    if (!settings) {
      setSettingsId(null);
      setSettingsForm((prev) => ({
        ...EMPTY_SETTINGS_FORM,
        branchName,
        trackingEmail: prev.trackingEmail || trackingEmail,
        logoUrl: prev.logoUrl,
        logoPublicId: prev.logoPublicId,
      }));
      return;
    }

    setSettingsId(settings._id);
    setSettingsForm({
      branchName: settings.branchName || branchName,
      trackingEmail: settings.trackingEmail || trackingEmail,
      restaurantName: settings.restaurantName || "",
      address: settings.address || "",
      phone: settings.phone || "",
      email: settings.email || "",
      accountNo: settings.accountNo || "",
      ifscCode: settings.ifscCode || "",
      gstin: settings.gstin || "",
      logoUrl: settings.logoUrl || "",
      logoPublicId: settings.logoPublicId || "",
      managerName: settings.managerName || "",
    });

    if (settings.logoUrl) {
      const displayLogo = buildDisplayLogoUrl(settings.logoUrl);
      setLogo(displayLogo);
      localStorage.setItem("restaurantLogo", settings.logoUrl);
    }
  } catch (error) {
    console.log(error);
    setSettingsMessage("Failed to load branch settings");
  } finally {
    setSettingsLoading(false);
  }
}

async function saveSettings() {
  if (!branch) {
    setSettingsMessage("Branch is required before saving settings");
    return;
  }

  setSettingsSaving(true);
  setSettingsMessage(null);

  try {
    const trackingEmail =
      settingsForm.trackingEmail.trim() || getStoredUserEmail();

    const payload = {
      ...settingsForm,
      branchName: settingsForm.branchName.trim() || branch,
      trackingEmail,
    };

    const response = await fetch(
      settingsId ? `/api/branches/${settingsId}` : "/api/branches",
      {
        method: settingsId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok || !data.success) {
      throw new Error(data?.message || "Failed to save settings");
    }

    const saved = data.data;

    setSettingsId(saved?._id || settingsId);
    setSettingsForm({
      branchName: saved?.branchName || payload.branchName,
      trackingEmail: saved?.trackingEmail || payload.trackingEmail,
      restaurantName: saved?.restaurantName || payload.restaurantName,
      address: saved?.address || payload.address,
      phone: saved?.phone || payload.phone,
      email: saved?.email || payload.email,
      accountNo: saved?.accountNo || payload.accountNo,
      ifscCode: saved?.ifscCode || payload.ifscCode,
      gstin: saved?.gstin || payload.gstin,
      logoUrl: saved?.logoUrl || payload.logoUrl,
      logoPublicId: saved?.logoPublicId || payload.logoPublicId,
      managerName: saved?.managerName || payload.managerName,
    });

    if (payload.logoUrl) {
      localStorage.setItem("restaurantLogo", payload.logoUrl);
      setLogo(buildDisplayLogoUrl(payload.logoUrl));
    }

    if (payload.branchName !== branch) {
      setBranch(payload.branchName);

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          parsedUser.branch = payload.branchName;
              if (trackingEmail) {
                parsedUser.email = trackingEmail;
              }
          localStorage.setItem("user", JSON.stringify(parsedUser));
        } catch {
          // ignore malformed cached user data
        }
      }
    }

    setSettingsMessage("Settings saved successfully");
    await loadNotifications(payload.branchName);
    await loadDashboard(payload.branchName);
  } catch (error) {
    setSettingsMessage(
      error instanceof Error ? error.message : "Failed to save settings"
    );
  } finally {
    setSettingsSaving(false);
  }
}
useEffect(() => {
  const savedLogo =
    localStorage.getItem(
      "restaurantLogo"
    );

  if (savedLogo) {
    setLogo(buildDisplayLogoUrl(savedLogo));
  }
}, []);
useEffect(() => {
  if (activeTab === "settings") {
    void loadSettings();
  }
}, [activeTab, branch]);
useEffect(() => {
  if (branch !== null) {
    loadDashboard();

    loadNotifications();

    const interval =
      setInterval(() => {
        loadNotifications();

        loadDashboard();
      }, 3000);

    return () =>
      clearInterval(interval);
  }
}, [branch]);
useEffect(() => {
  const unreadCount =
    notifications.filter(
      (n) => !n.managerRead
    ).length;

  if (
    unreadCount >
      previousCount.current &&
    previousCount.current !== 0
  ) {
    notificationSound.play();
  }

  previousCount.current =
    unreadCount;
}, [notifications]);

  useEffect(() => {
    // Allow admin to view dashboard with branchName parameter without login.
    // Re-read from URL here to avoid timing issues between effects.
    const params = new URLSearchParams(window.location.search);
    const adminBranchName = params.get("branchName");
    if (adminBranchName) {
      return;
    }

    const user = localStorage.getItem("user");

    if (!user) {
      window.location.href = "/";
      return;
    }

    const parsedUser = JSON.parse(user);

    if (parsedUser.role !== "manager") {
      window.location.href = "/";
    }
  }, [queryBranchName]);

  function logout() {
    localStorage.removeItem("user");
    // If in admin view mode (branchName parameter), go back to admin dashboard
    if (queryBranchName) {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#111111",
        color: "#fff",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#1a1a1a",
          borderRight: "1px solid #2a2a2a",
          padding: "24px 18px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: "40px",
          }}
        >
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
  }}
>
  <label
  style={{
    cursor: logoUploading
      ? "not-allowed"
      : "pointer",
    opacity: logoUploading
      ? 0.7
      : 1,
  }}
>
  <input
    type="file"
    accept="image/*"
    hidden
    disabled={logoUploading}
    onClick={(e) => {
      // Reset so selecting the same file again still triggers onChange.
      e.currentTarget.value = "";
    }}
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (file) {
        void uploadLogo(file);
      }

      e.currentTarget.value = "";
    }}
  />

  <img
    src={logo}
    alt="Logo"
    style={{
      width: "55px",
      height: "55px",
      borderRadius: "14px",
      objectFit: "cover",
      border:
        "2px solid #f59e0b",
    }}
  />
</label>

{logoError && (
  <div
    style={{
      marginTop: "8px",
      color: "#f87171",
      fontSize: "12px",
      maxWidth: "140px",
      lineHeight: "1.3",
    }}
  >
    {logoError}
  </div>
)}

  {/* NOTIFICATION */}
  <div
    style={{
      position: "relative",
    }}
  >
    {/* BELL */}
    <div
      onClick={() =>
        setShowNotifications(
          !showNotifications
        )
      }
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Bell size={20} />

      {notifications.filter((n) => !n.managerRead).length >
        0 && (
        <div
          style={{
            position:
              "absolute",
            top: "2px",
            right: "2px",
            width: "18px",
            height: "18px",
            borderRadius:
              "50%",
            background:
              "#ef4444",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            fontSize: "10px",
            fontWeight: "700",
          }}
        >
          {
            notifications.filter(
  (n) => !n.managerRead
).length
          }
        </div>
      )}
    </div>

    {/* DROPDOWN */}
    {showNotifications && (
      <div
        style={{
          position: "absolute",
          top: "55px",
          right: "-20px",
          left:"20px",
          width: "300px",
          background: "#1f1f1f",
          border:
            "1px solid #2a2a2a",
          borderRadius: "16px",
          padding: "14px",
          zIndex: 100,
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            marginBottom: "12px",
          }}
        >
          Notifications
        </h3>

        {notifications.length ===
        0 ? (
          <p
            style={{
              color: "#888",
            }}
          >
            No notifications
          </p>
        ) : (
         notifications
  .filter((n) => !n.managerRead)
  .map((n) => (
    <div
      key={n._id}
      style={{
        background: "#2a2a2a",
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        <h4
          style={{
            fontSize: "14px",
          }}
        >
          {n.title}
        </h4>

        <button
          onClick={async () => {
           await fetch(
  `/api/notifications/manager/${n._id}`,
  {
    method: "PUT",
  }
);

            loadNotifications(branch || undefined);
          }}
          style={{
            background:
              "#22c55e",
            border: "none",
            color: "#fff",
            padding:
              "4px 8px",
            borderRadius:
              "6px",
            cursor: "pointer",
            fontSize: "11px",
          }}
        >
          Read
        </button>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "#999",
        }}
      >
        {n.message}
      </p>
    </div>
  ))
        )}
      </div>
    )}
  </div>
</div>
          <p
            style={{
              color: "#888",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Manager Panel
          </p>
        </div>

        {/* Menu */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "dashboard"
                  ? "#f59e0b"
                  : "transparent",
              border: "none",
              color:
                activeTab === "dashboard"
                  ? "#000"
                  : "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "menu"
                  ? "#f59e0b"
                  : "transparent",
              border: "none",
              color:
                activeTab === "menu"
                  ? "#000"
                  : "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <LayoutDashboard size={18} />
            Menu
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "orders"
                  ? "#f59e0b"
                  : "transparent",
              border: "none",
              color:
                activeTab === "orders"
                  ? "#000"
                  : "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <ShoppingCart size={18} />
            Order
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "tables"
                  ? "#f59e0b"
                  : "transparent",
              border: "none",
              color:
                activeTab === "tables"
                  ? "#000"
                  : "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <Table size={18} />
            Table
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "inventory"
                  ? "#f59e0b"
                  : "transparent",
              border: "none",
              color:
                activeTab === "inventory"
                  ? "#000"
                  : "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <Warehouse size={18} />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("employee")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "employee"
                  ? "#f59e0b"
                  : "transparent",
              border: "none",
              color:
                activeTab === "employee"
                  ? "#000"
                  : "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <User size={18} />
            Employee
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background:
                activeTab === "settings"
                  ? "#f59e0b"
                  : "transparent",
              border: "none",
              color:
                activeTab === "settings"
                  ? "#000"
                  : "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <Settings2 size={18} />
            Settings
          </button>
        </div>

        {/* Logout */}
        <div
          style={{
            marginTop: "auto",
          }}
        >
          <button
            onClick={logout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "#ef4444",
              border: "none",
              color: "#fff",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h1
              style={{
                fontSize: "32px",
                marginBottom: "25px",
              }}
            >
              Dashboard
            </h1>

            <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  }}
>
  <div
    style={{
      background: "#1f1f1f",
      padding: "24px",
      borderRadius: "18px",
      border: "1px solid #2a2a2a",
    }}
  >
    <h3
      style={{
        color: "#888",
        marginBottom: "10px",
      }}
    >
      Today's Orders
    </h3>

    <h1
      style={{
        fontSize: "34px",
        color: "#f59e0b",
      }}
    >
      {
        dashboardData.totalOrders
      }
    </h1>
  </div>

  <div
    style={{
      background: "#1f1f1f",
      padding: "24px",
      borderRadius: "18px",
      border: "1px solid #2a2a2a",
    }}
  >
    <h3
      style={{
        color: "#888",
        marginBottom: "10px",
      }}
    >
      Today's Revenue
    </h3>

    <h1
      style={{
        fontSize: "34px",
        color: "#22c55e",
      }}
    >
      ₹
      {
        dashboardData.totalRevenue
      }
    </h1>
  </div>
</div>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "24px",
  }}
>
  {/* PRODUCT SALES */}
  <div
    style={{
      background: "#1f1f1f",
      borderRadius: "24px",
      padding: "24px",
      border: "1px solid #2a2a2a",
      height: "420px",
    }}
  >
    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      Product Sales
    </h2>

    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={
            dashboardData.productSales
          }
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {dashboardData.productSales.map(
            (
              entry,
              index
            ) => (
              <Cell
                key={index}
                fill={
                  [
                    "#f59e0b",
                    "#22c55e",
                    "#3b82f6",
                    "#ef4444",
                    "#8b5cf6",
                  ][
                    index % 5
                  ]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* PAYMENT TYPE */}
  <div
    style={{
      background: "#1f1f1f",
      borderRadius: "24px",
      padding: "24px",
      border: "1px solid #2a2a2a",
      height: "420px",
    }}
  >
    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      Payment Types
    </h2>

    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={
            dashboardData.paymentTypes
          }
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {dashboardData.paymentTypes.map(
            (
              entry,
              index
            ) => (
              <Cell
                key={index}
                fill={
                  [
                    "#06b6d4",
                    "#22c55e",
                    "#f59e0b",
                    "#ef4444",
                  ][
                    index % 4
                  ]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
         
            
          <OrdersPage />
        )}
         {activeTab === "menu" && (
         
            
          <MenuPage />
        )}
         {activeTab === "tables" && (
         
            
          <TablesPage />
        )}
        {activeTab === "inventory" && (
         
            
          <InventoryPage />
        )}
        {activeTab === "employee" && (
         
            
          <EmployeePage />
        )}
        {activeTab === "settings" && (
          <div style={{ width: "100%", minHeight: "100%" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Settings</h1>
            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
              Update restaurant profile, branch details, bank information, GST, contact info, and logo.
            </p>

            <div style={{ background: "#1f1f1f", border: "1px solid #2a2a2a", borderRadius: "18px", padding: "24px", width: "100%", minHeight: "calc(100vh - 180px)" }}>
              {settingsLoading ? (
                <div style={{ color: "#9ca3af", padding: "16px 0" }}>Loading settings...</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Logo</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                      <div style={{ width: "72px", height: "72px", borderRadius: "16px", background: "#111", border: "1px solid #2a2a2a", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {logo ? (
                          <img src={logo} alt="Restaurant logo preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", padding: "4px" }}>No logo</span>
                        )}
                      </div>
                      <label style={{ background: "#f59e0b", color: "#000", borderRadius: "10px", padding: "10px 14px", cursor: logoUploading ? "not-allowed" : "pointer", fontWeight: 700, opacity: logoUploading ? 0.7 : 1 }}>
                        {logoUploading ? "Uploading..." : "Upload Logo"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          disabled={logoUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              void uploadLogo(file);
                            }
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {[
                    { key: "restaurantName", label: "Name", placeholder: "Restaurant name" },
                    { key: "branchName", label: "Branch Name", placeholder: "Main branch" },
                    { key: "trackingEmail", label: "Tracking Email", placeholder: "track@example.com" },
                    { key: "address", label: "Address", placeholder: "Street, city, state" },
                    { key: "phone", label: "Phone", placeholder: "+91..." },
                    { key: "email", label: "Email", placeholder: "name@example.com" },
                    { key: "accountNo", label: "Account No", placeholder: "Bank account number" },
                    { key: "ifscCode", label: "IFSC Code", placeholder: "Bank IFSC" },
                    { key: "gstin", label: "GST IN", placeholder: "GST number" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>{field.label}</label>
                      <input
                        value={settingsForm[field.key as keyof BranchSettingsForm] as string}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "12px 14px", color: "#fff", outline: "none" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {settingsMessage && (
                <div style={{ marginTop: "16px", color: settingsMessage.includes("success") ? "#4ade80" : "#f87171", fontSize: "13px" }}>
                  {settingsMessage}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  onClick={() => void saveSettings()}
                  disabled={settingsSaving}
                  style={{ background: "#f59e0b", color: "#000", border: "none", borderRadius: "10px", padding: "12px 18px", cursor: settingsSaving ? "not-allowed" : "pointer", fontWeight: 700, opacity: settingsSaving ? 0.7 : 1 }}
                >
                  {settingsSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

