import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  tableNumber: number;
  items: IOrderItem[];
  status: "Pending" | "Preparing" | "Ready" | "Served" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  paymentMethod?: "Cash" | "Card" | "UPI" | "Online";
  subtotal: number;
  tax: number;
  total: number;
  staffId?: mongoose.Types.ObjectId; branch?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    tableNumber: { type: Number, required: true, min: 1 },
    items: [OrderItemSchema],
    status: { type: String, enum: ["Pending", "Preparing", "Ready", "Served", "Cancelled"], default: "Pending" },
    paymentStatus: { type: String, enum: ["Unpaid", "Paid", "Refunded"], default: "Unpaid" },
    paymentMethod: { type: String, enum: ["Cash", "Card", "UPI", "Online"] },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    branch: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;


