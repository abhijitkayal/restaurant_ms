"use client";

import { useEffect, useState } from "react";
interface Chair {
  _id: string;
  chairNumber: number;
  occupied: boolean;
}

interface Table {
  _id: string;
  tableNumber: number;
  chairs: Chair[];
}



export default function WaiterTables() {
const [tables, setTables] =
  useState<Table[]>([]);

  async function loadTables() {
    try {
      const response = await fetch(
        "/api/tables"
      );

      const data =
        await response.json();

      if (data.success) {
        setTables(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTables();

    const interval = setInterval(() => {
      loadTables();
    }, 2000);

    return () =>
      clearInterval(interval);
  }, []);

  async function selectChair(
    tableId: any,
    chairId: any,
    currentStatus: any
  ) {
    try {
      await fetch(
        "/api/tables/update",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            tableId, chairId, occupied: !currentStatus,
          }),
        }
      );

      loadTables();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "30px",
        }}
      >
        Tables
      </h1>

      <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "30px",
  }}
>
  {tables.map((table) => (
    <div
      key={table._id}
      style={{
        background: "#1b1b1b",
        border: "1px solid #2a2a2a",
        borderRadius: "24px",
        padding: "30px",
        position: "relative",
        minHeight: "320px",
      }}
    >
      {/* TABLE CENTER */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform:
            "translate(-50%,-50%)",
          width: "130px",
          height: "130px",
          borderRadius: "24px",
          background: "#2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f59e0b",
          fontWeight: "700",
          fontSize: "22px",
          boxShadow:
            "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        Table {table.tableNumber}
      </div>

      {/* CHAIRS */}
      {table.chairs.map(
        (chair, index) => {
          const positions = [
            {
              top: "20px",
              left: "50%",
              transform:
                "translateX(-50%)",
            },

            {
              top: "50%",
              right: "20px",
              transform:
                "translateY(-50%)",
            },

            {
              bottom: "20px",
              left: "50%",
              transform:
                "translateX(-50%)",
            },

            {
              top: "50%",
              left: "20px",
              transform:
                "translateY(-50%)",
            },

            {
              top: "30px",
              left: "30px",
            },

            {
              top: "30px",
              right: "30px",
            },

            {
              bottom: "30px",
              right: "30px",
            },

            {
              bottom: "30px",
              left: "30px",
            },
          ];

          return (
            <div
              key={chair._id}
              onClick={() =>
                selectChair(
                  table._id,
                  chair._id,
                  chair.occupied
                )
              }
              style={{
                position: "absolute",
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background:
                  chair.occupied
                    ? "#22c55e"
                    : "#3a3a3a",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "700",
                transition: "0.3s",
                boxShadow:
                  chair.occupied
                    ? "0 0 18px #22c55e"
                    : "none",

                ...positions[
                  index %
                    positions.length
                ],
              }}
            >
              {chair.chairNumber}
            </div>
          );
        }
      )}
    </div>
  ))}
</div>
    </div>
  );
}


