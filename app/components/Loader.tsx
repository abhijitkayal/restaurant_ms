"use client";

import React from "react";

export default function Loader({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: "100%", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: "6px solid rgba(255,255,255,0.08)",
            borderTop: "6px solid #f59e0b",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: "#9ca3af", fontSize: 14 }}>Loading...</div>
      </div>
    </div>
  );
}
