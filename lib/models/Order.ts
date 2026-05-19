import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNumber: String,

    tableNumber: Number,

    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    status: {
      type: String,
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      default: "Unpaid",
    },

    paymentMethod: String,

    subtotal: Number,

    tax: Number,

    total: Number,

    notes: String,

    branch: String,
  },
  {
    timestamps: true,
  }
);

const Order =
  models.Order || model("Order", OrderSchema);

export default Order;