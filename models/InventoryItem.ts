import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Produce", "Meat", "Dairy", "Beverages", "Dry Goods", "Spices", "Seafood", "Bakery", "Other"] },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    minStock: { type: Number, required: true, default: 10 },
    costPerUnit: { type: Number, required: true, min: 0 },
    supplier: { type: String, required: true },
    lastRestocked: { type: Date, default: Date.now },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

const InventoryItem: Model<IInventoryItem> =
  mongoose.models.InventoryItem ||
  mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;
