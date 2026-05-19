import mongoose, {
  Schema,
  model,
  models,
} from "mongoose";

const InventorySchema = new Schema(
  {
    productName: String,

    quantity: Number,

    unit: String,

    branch: String,
  },
  {
    timestamps: true,
  }
);

const Inventory =
  models.Inventory ||
  model(
    "Inventory",
    InventorySchema
  );

export default Inventory;