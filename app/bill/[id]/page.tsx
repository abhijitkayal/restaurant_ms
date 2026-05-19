"use client";

import {
  useEffect,
  useState,
} from "react";

export default function BillPage({
  params,
}: any) {
  const [order, setOrder] =
    useState<any>(null);

  async function loadBill() {
    const res = await fetch(
      `/api/orders/${params.id}`
    );

    const data =
      await res.json();

    setOrder(data.data);
  }

  useEffect(() => {
    loadBill();
  }, []);

  if (!order) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        border:
          "1px solid #ddd",
        borderRadius: "20px",
        fontFamily:
          "sans-serif",
      }}
    >
      <h1>
        Restaurant Bill
      </h1>

      <hr />

      <p>
        <b>Order:</b>{" "}
        {
          order.orderNumber
        }
      </p>

      <p>
        <b>Table:</b>{" "}
        {
          order.tableNumber
        }
      </p>

      <p>
        <b>Payment:</b>{" "}
        {
          order.paymentMethod
        }
      </p>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th align="left">
              Item
            </th>

            <th align="left">
              Qty
            </th>

            <th align="left">
              Price
            </th>
          </tr>
        </thead>

        <tbody>
          {order.items.map(
            (
              item: any,
              index: number
            ) => (
              <tr key={index}>
                <td>
                  {
                    item.name
                  }
                </td>

                <td>
                  {
                    item.quantity
                  }
                </td>

                <td>
                  ₹
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(
                    0
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <hr
        style={{
          margin:
            "20px 0",
        }}
      />

      <h2>
        Total: ₹
        {order.total.toFixed(
          0
        )}
      </h2>

      <button
        onClick={() =>
          window.print()
        }
        style={{
          marginTop: "20px",
          padding:
            "12px 20px",
          border: "none",
          background:
            "#000",
          color: "#fff",
          borderRadius:
            "10px",
          cursor: "pointer",
        }}
      >
        Print Bill
      </button>
    </div>
  );
}